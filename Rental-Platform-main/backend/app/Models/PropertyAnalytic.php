<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyAnalytic extends Model
{
    protected $fillable = [
        'property_id',
        'views_total',
        'views_today',
        'views_week',
        'views_month',
        'favorites_count',
        'contact_requests',
        'booking_requests',
        'tour_requests',
        'conversion_rate',
        'last_viewed_at',
        'viewer_demographics',
        'traffic_sources',
    ];

    protected $casts = [
        'conversion_rate' => 'decimal:2',
        'last_viewed_at' => 'datetime',
        'viewer_demographics' => 'array',
        'traffic_sources' => 'array',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    // Increment methods
    public function incrementViews(string $period = 'total')
    {
        $field = 'views_' . $period;
        if (in_array($field, ['views_total', 'views_today', 'views_week', 'views_month'])) {
            $this->increment($field);
            $this->update(['last_viewed_at' => now()]);
        }
        $this->updateConversionRate();
    }

    public function incrementFavorites()
    {
        $this->increment('favorites_count');
        $this->updateConversionRate();
    }

    public function incrementContactRequests()
    {
        $this->increment('contact_requests');
        $this->updateConversionRate();
    }

    public function incrementBookingRequests()
    {
        $this->increment('booking_requests');
        $this->updateConversionRate();
    }

    public function incrementTourRequests()
    {
        $this->increment('tour_requests');
        $this->updateConversionRate();
    }

    // Helper methods
    public function updateConversionRate()
    {
        if ($this->views_total > 0) {
            $conversions = $this->contact_requests + $this->booking_requests + $this->tour_requests;
            $this->conversion_rate = ($conversions / $this->views_total) * 100;
            $this->save();
        }
    }

    public function resetDailyViews()
    {
        $this->update(['views_today' => 0]);
    }

    public function resetWeeklyViews()
    {
        $this->update(['views_week' => 0]);
    }

    public function resetMonthlyViews()
    {
        $this->update(['views_month' => 0]);
    }

    // Scopes
    public function scopePopular($query, $minViews = 100)
    {
        return $query->where('views_total', '>=', $minViews);
    }

    public function scopeMostViewed($query, $limit = 10)
    {
        return $query->orderBy('views_total', 'desc')->limit($limit);
    }

    public function scopeRecentActivity($query, $days = 7)
    {
        return $query->where('last_viewed_at', '>=', now()->subDays($days));
    }

    public function scopeHighConversion($query, $minRate = 5.0)
    {
        return $query->where('conversion_rate', '>=', $minRate);
    }
}
