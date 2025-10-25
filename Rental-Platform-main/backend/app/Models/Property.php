<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Property extends Model
{
    use HasFactory, SoftDeletes, Searchable, LogsActivity;

    protected $fillable = [
        'owner_id',
        'title',
        'description',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
        'property_type',
        'rental_type',
        'bedrooms',
        'bathrooms',
        'max_guests',
        'area_sqm',
        'price_per_night',
        'price_per_month',
        'cleaning_fee',
        'security_deposit',
        'available_from',
        'available_to',
        'minimum_stay_nights',
        'maximum_stay_nights',
        'status',
        'is_featured',
        'house_rules',
        'cancellation_policy',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'price_per_night' => 'decimal:2',
        'price_per_month' => 'decimal:2',
        'cleaning_fee' => 'decimal:2',
        'security_deposit' => 'decimal:2',
        'available_from' => 'date',
        'available_to' => 'date',
        'is_featured' => 'boolean',
        'house_rules' => 'array',
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function landlord(): BelongsTo
    {
        return $this->belongsTo(Landlord::class);
    }

    public function virtualTours(): HasMany
    {
        return $this->hasMany(VirtualTour::class);
    }

    public function analytics(): HasOne
    {
        return $this->hasOne(PropertyAnalytic::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function maintenanceRequests(): HasMany
    {
        return $this->hasMany(MaintenanceRequest::class);
    }

    public function tours(): HasMany
    {
        return $this->hasMany(PropertyTour::class);
    }

    public function priceHistory(): HasMany
    {
        return $this->hasMany(PriceHistory::class);
    }

    public function priceAlerts(): HasMany
    {
        return $this->hasMany(PriceAlert::class);
    }

    public function checkIns(): HasMany
    {
        return $this->hasMany(CheckIn::class);
    }

    public function leaseAgreements(): HasMany
    {
        return $this->hasMany(LeaseAgreement::class);
    }

    public function backgroundChecks(): HasMany
    {
        return $this->hasMany(BackgroundCheck::class);
    }

    public function insurances(): HasMany
    {
        return $this->hasMany(Insurance::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeShortTerm($query)
    {
        return $query->whereIn('rental_type', ['short_term', 'both']);
    }

    public function scopeLongTerm($query)
    {
        return $query->whereIn('rental_type', ['long_term', 'both']);
    }

    // Accessors
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->where('status', 'approved')->avg('rating') ?? 0;
    }

    public function getReviewsCountAttribute()
    {
        return $this->reviews()->where('status', 'approved')->count();
    }

    public function getPrimaryImageAttribute()
    {
        return $this->images()->where('is_primary', true)->first();
    }

    // Scout Searchable Configuration
    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'property_type' => $this->property_type,
            'rental_type' => $this->rental_type,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'max_guests' => $this->max_guests,
            'price_per_night' => (float) $this->price_per_night,
            'price_per_month' => $this->price_per_month ? (float) $this->price_per_month : null,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return $this->status === 'published';
    }

    // Activity Log Configuration
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['title', 'price_per_night', 'price_per_month', 'status', 'is_available'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}
