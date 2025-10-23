<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::query()->with(['images', 'amenities', 'owner']);

        // Filter by owner (for owner dashboard)
        if ($request->has('my_properties') && $request->user()) {
            $query->where('owner_id', $request->user()->id);
        } else {
            // Only show published properties for public listing
            $query->where('status', 'published');
        }

        if ($city = $request->string('city')->toString()) {
            $query->where('city', 'like', "%$city%");
        }
        if ($country = $request->string('country')->toString()) {
            $query->where('country', 'like', "%$country%");
        }
        if ($type = $request->string('property_type')->toString()) {
            $query->where('property_type', $type);
        }
        if ($rental = $request->string('rental_type')->toString()) {
            $query->where('rental_type', $rental);
        }
        if ($guests = $request->integer('guests')) {
            $query->where('max_guests', '>=', $guests);
        }
        if ($min = $request->float('min_price')) {
            $query->where(function ($q) use ($min) {
                $q->where('price_per_night', '>=', $min)
                  ->orWhere('price_per_month', '>=', $min);
            });
        }
        if ($max = $request->float('max_price')) {
            $query->where(function ($q) use ($max) {
                $q->where('price_per_night', '<=', $max)
                  ->orWhere('price_per_month', '<=', $max);
            });
        }

        $properties = $query->paginate($request->integer('per_page', 15));
        return PropertyResource::collection($properties);
    }

    public function show(Property $property)
    {
        $property->load([
            'images',
            'amenities',
            'owner',
            'reviews' => function ($q) {
                $q->where('status', 'approved')->with('user');
            },
        ]);
        return new PropertyResource($property);
    }

    public function store(Request $request)
    {
    $this->authorize('create', Property::class);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:20'],
            'property_type' => ['required', 'in:apartment,house,villa,room,studio,condo,other'],
            'rental_type' => ['required', 'in:short_term,long_term,both'],
            'bedrooms' => ['required', 'integer', 'min:0'],
            'bathrooms' => ['required', 'integer', 'min:0'],
            'max_guests' => ['required', 'integer', 'min:1'],
            'price_per_night' => ['nullable', 'numeric', 'min:0'],
            'price_per_month' => ['nullable', 'numeric', 'min:0'],
            'cleaning_fee' => ['nullable', 'numeric', 'min:0'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
        ]);

        $property = new Property($data);
        $property->owner_id = $request->user()->id;
        $property->status = 'draft';
        $property->save();

        return new PropertyResource($property->fresh(['images','amenities','owner']));
    }

    public function update(Request $request, Property $property)
    {
    $this->authorize('update', $property);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'address' => ['sometimes', 'string', 'max:255'],
            'city' => ['sometimes', 'string', 'max:255'],
            'state' => ['nullable', 'string', 'max:255'],
            'country' => ['sometimes', 'string', 'max:255'],
            'postal_code' => ['sometimes', 'string', 'max:20'],
            'property_type' => ['sometimes', 'in:apartment,house,villa,room,studio,condo,other'],
            'rental_type' => ['sometimes', 'in:short_term,long_term,both'],
            'bedrooms' => ['sometimes', 'integer', 'min:0'],
            'bathrooms' => ['sometimes', 'integer', 'min:0'],
            'max_guests' => ['sometimes', 'integer', 'min:1'],
            'price_per_night' => ['nullable', 'numeric', 'min:0'],
            'price_per_month' => ['nullable', 'numeric', 'min:0'],
            'cleaning_fee' => ['nullable', 'numeric', 'min:0'],
            'security_deposit' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:draft,published,unavailable,archived'],
        ]);

        $property->fill($data)->save();
        return new PropertyResource($property->fresh(['images','amenities','owner']));
    }

    public function destroy(Request $request, Property $property)
    {
        $this->authorize('delete', $property);
        $property->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
