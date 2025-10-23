<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Advanced property search with Meilisearch.
     *
     * @OA\Get(
     *     path="/api/search",
     *     summary="Search properties",
     *     tags={"Search"},
     *     @OA\Parameter(name="q", in="query", description="Search query (title, description, city)", @OA\Schema(type="string")),
     *     @OA\Parameter(name="city", in="query", description="Filter by city", @OA\Schema(type="string")),
     *     @OA\Parameter(name="country", in="query", description="Filter by country", @OA\Schema(type="string")),
     *     @OA\Parameter(name="property_type", in="query", description="Filter by type", @OA\Schema(type="string")),
     *     @OA\Parameter(name="rental_type", in="query", description="Filter by rental type", @OA\Schema(type="string")),
     *     @OA\Parameter(name="bedrooms", in="query", description="Minimum bedrooms", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="bathrooms", in="query", description="Minimum bathrooms", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="max_guests", in="query", description="Minimum guests capacity", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="min_price", in="query", description="Min price per night", @OA\Schema(type="number")),
     *     @OA\Parameter(name="max_price", in="query", description="Max price per night", @OA\Schema(type="number")),
     *     @OA\Parameter(name="sort", in="query", description="Sort field:direction (e.g., price_per_night:asc)", @OA\Schema(type="string")),
     *     @OA\Parameter(name="page", in="query", description="Page number", @OA\Schema(type="integer", default=1)),
     *     @OA\Parameter(name="per_page", in="query", description="Items per page", @OA\Schema(type="integer", default=20)),
     *     @OA\Response(response=200, description="Search results",
     *         @OA\JsonContent(type="object",
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="total", type="integer"),
     *             @OA\Property(property="page", type="integer")
     *         )
     *     )
     * )
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        $perPage = min((int) $request->input('per_page', 20), 100);
        
        // Build filters array
        $filters = ['status = published'];

        if ($request->filled('city')) {
            $filters[] = 'city = "' . addslashes($request->input('city')) . '"';
        }
        if ($request->filled('country')) {
            $filters[] = 'country = "' . addslashes($request->input('country')) . '"';
        }
        if ($request->filled('property_type')) {
            $filters[] = 'property_type = "' . addslashes($request->input('property_type')) . '"';
        }
        if ($request->filled('rental_type')) {
            $filters[] = 'rental_type = "' . addslashes($request->input('rental_type')) . '"';
        }
        if ($request->filled('bedrooms')) {
            $filters[] = 'bedrooms >= ' . (int) $request->input('bedrooms');
        }
        if ($request->filled('bathrooms')) {
            $filters[] = 'bathrooms >= ' . (int) $request->input('bathrooms');
        }
        if ($request->filled('max_guests')) {
            $filters[] = 'max_guests >= ' . (int) $request->input('max_guests');
        }
        if ($request->filled('min_price')) {
            $filters[] = 'price_per_night >= ' . (float) $request->input('min_price');
        }
        if ($request->filled('max_price')) {
            $filters[] = 'price_per_night <= ' . (float) $request->input('max_price');
        }

        $filterString = implode(' AND ', $filters);

        // Parse sort parameter (e.g., "price_per_night:asc")
        $sort = [];
        if ($request->filled('sort')) {
            [$field, $direction] = explode(':', $request->input('sort') . ':asc');
            $sort = [$field . ':' . ($direction === 'desc' ? 'desc' : 'asc')];
        }

        // Perform search
        $results = Property::search($query, function ($meilisearch, $query, $options) use ($filterString, $sort) {
            $options['filter'] = $filterString;
            if (!empty($sort)) {
                $options['sort'] = $sort;
            }
            return $meilisearch->search($query, $options);
        })->paginate($perPage);

        // Load relationships for the results
        $results->load(['owner', 'images', 'amenities', 'reviews' => function ($q) {
            $q->where('status', 'approved');
        }]);

        return response()->json([
            'data' => $results->items(),
            'total' => $results->total(),
            'page' => $results->currentPage(),
            'per_page' => $results->perPage(),
            'last_page' => $results->lastPage(),
        ]);
    }
}
