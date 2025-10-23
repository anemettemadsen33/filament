<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'booking_id',
        'rating',
        'cleanliness_rating',
        'location_rating',
        'value_rating',
        'communication_rating',
        'checkin_rating',
        'accuracy_rating',
        'comment',
        'response',
        'responded_at',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
        'is_featured' => 'boolean',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Accessors
    public function getAverageDetailedRatingAttribute()
    {
        $ratings = collect([
            $this->cleanliness_rating,
            $this->location_rating,
            $this->value_rating,
            $this->communication_rating,
            $this->checkin_rating,
            $this->accuracy_rating,
        ])->filter();

        return $ratings->count() ? $ratings->avg() : $this->rating;
    }
}
