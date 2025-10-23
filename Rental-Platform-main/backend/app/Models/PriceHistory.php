<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceHistory extends Model
{
    protected $fillable = [
        'property_id',
        'old_price',
        'new_price',
        'price_type',
        'changed_by_id',
        'reason',
        'effective_date',
        'price_change_percentage',
    ];

    protected $casts = [
        'old_price' => 'decimal:2',
        'new_price' => 'decimal:2',
        'price_change_percentage' => 'decimal:2',
        'effective_date' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($priceHistory) {
            if ($priceHistory->old_price > 0) {
                $priceHistory->price_change_percentage = 
                    (($priceHistory->new_price - $priceHistory->old_price) / $priceHistory->old_price) * 100;
            }
        });
    }

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function changedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_id');
    }

    // Scopes
    public function scopePriceDrops($query)
    {
        return $query->where('price_change_percentage', '<', 0);
    }

    public function scopePriceIncreases($query)
    {
        return $query->where('price_change_percentage', '>', 0);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('effective_date', '>=', now()->subDays($days));
    }

    // Helpers
    public function getIsPriceDropAttribute(): bool
    {
        return $this->price_change_percentage < 0;
    }

    public function getIsPriceIncreaseAttribute(): bool
    {
        return $this->price_change_percentage > 0;
    }
}
