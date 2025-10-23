<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Laravel\Facades\Image;

class PropertyImageController extends Controller
{
    use AuthorizesRequests;
    /**
     * List all images for a property.
     */
    public function index(Property $property)
    {
        $this->authorize('view', $property);
        $images = $property->images()->orderBy('sort_order')->get();
        return response()->json([
            'data' => $images->map(fn ($img) => $this->imageResource($img))->all(),
        ]);
    }
    /**
     * Upload one or more images for a property.
     */
    public function store(Request $request, Property $property)
    {
        $this->authorize('update', $property);

        $validated = $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['file', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:10240'], // 10MB
            'captions' => ['sometimes', 'array'],
            'captions.*' => ['nullable', 'string', 'max:255'],
        ]);

        $existingCount = $property->images()->count();
        $incomingCount = count($validated['images']);
        if ($existingCount + $incomingCount > 20) {
            throw ValidationException::withMessages([
                'images' => 'A property can have at most 20 images. You can upload up to '.(20 - $existingCount).' more.',
            ]);
        }

        $created = [];

        DB::transaction(function () use ($validated, $property, &$created) {
            $disk = 'public';
            $basePath = 'properties/'.$property->id.'/'.date('Y/m');

            $nextSort = (int) ($property->images()->max('sort_order') ?? 0) + 1;

            foreach ($validated['images'] as $index => $file) {
                $originalName = $file->getClientOriginalName();
                $ext = strtolower($file->getClientOriginalExtension());
                $filename = uniqid('img_', true).'.'.$ext;
                $path = $basePath.'/'.$filename;

                // Process image (auto orient, max 1600x1200)
                $image = Image::read($file->getPathname())
                    ->scaleDown(1600, 1200);

                // Ensure directory exists and save processed image to storage disk
                Storage::disk($disk)->makeDirectory($basePath);
                Storage::disk($disk)->put($path, (string) $image->encodeByExtension($ext, 85));

                $img = new PropertyImage([
                    'path' => $path,
                    'original_name' => $originalName,
                    'is_primary' => false,
                    'sort_order' => $nextSort++,
                    'caption' => $validated['captions'][$index] ?? null,
                ]);

                $property->images()->save($img);
                $created[] = $img->fresh();
            }

            // Ensure there is a primary image
            if ($property->images()->where('is_primary', true)->doesntExist()) {
                $first = $property->images()->orderBy('sort_order')->first();
                if ($first) {
                    $first->is_primary = true;
                    $first->save();
                }
            }
        });

        return response()->json([
            'data' => array_map(function (PropertyImage $img) { return $this->imageResource($img); }, $created),
        ], 201);
    }

    /**
     * Delete an image from a property.
     */
    public function destroy(Property $property, PropertyImage $image)
    {
        $this->authorize('update', $property);

        if ($image->property_id !== $property->id) {
            abort(404);
        }

        // Remove file
        if ($image->path && Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        $wasPrimary = $image->is_primary;
        $image->delete();

        // If deleted primary, set next available as primary
        if ($wasPrimary) {
            $next = $property->images()->orderBy('sort_order')->first();
            if ($next) {
                $next->is_primary = true;
                $next->save();
            }
        }

        return response()->json(['message' => 'Image deleted']);
    }

    /**
     * Set an image as primary for the property.
     */
    public function setPrimary(Property $property, PropertyImage $image)
    {
        $this->authorize('update', $property);

        if ($image->property_id !== $property->id) {
            abort(404);
        }

        DB::transaction(function () use ($property, $image) {
            $property->images()->where('is_primary', true)->update(['is_primary' => false]);
            $image->is_primary = true;
            $image->save();
        });

        return response()->json(['data' => $this->imageResource($image->fresh())]);
    }

    /**
     * Reorder images using an ordered array of image IDs.
     */
    public function reorder(Request $request, Property $property)
    {
        $this->authorize('update', $property);

        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:property_images,id'],
        ]);

        $ids = $validated['order'];
        $images = $property->images()->whereIn('id', $ids)->get()->keyBy('id');

        DB::transaction(function () use ($ids, $images) {
            $sort = 1;
            foreach ($ids as $id) {
                if (isset($images[$id])) {
                    $img = $images[$id];
                    $img->sort_order = $sort++;
                    $img->save();
                }
            }
        });

        $refreshed = $property->images()->orderBy('sort_order')->get();
        return response()->json(['data' => $refreshed->map(fn ($img) => $this->imageResource($img))->all()]);
    }

    private function imageResource(PropertyImage $img): array
    {
        return [
            'id' => $img->id,
            'property_id' => $img->property_id,
            'url' => $img->url,
            'thumbnail_url' => $img->thumbnail_url,
            'path' => $img->path,
            'original_name' => $img->original_name,
            'is_primary' => (bool) $img->is_primary,
            'sort_order' => (int) $img->sort_order,
            'caption' => $img->caption,
            'created_at' => $img->created_at,
        ];
    }
}
