<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceAlert extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'target_price',
        'price_type',
        'alert_type',
        'is_active',
        'triggered_at',
        'notified_at',
    ];

    protected $casts = [
        'target_price' => 'decimal:2',
        'is_active' => 'boolean',
        'triggered_at' => 'datetime',
        'notified_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeTriggered($query)
    {
        return $query->whereNotNull('triggered_at');
    }

    public function scopeNotTriggered($query)
    {
        return $query->whereNull('triggered_at');
    }

    // Helpers
    public function trigger(): void
    {
        $this->update([
            'triggered_at' => now(),
        ]);
    }

    public function markNotified(): void
    {
        $this->update([
            'notified_at' => now(),
        ]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function checkAndTrigger(float $currentPrice): bool
    {
        if (!$this->is_active || $this->triggered_at) {
            return false;
        }

        $shouldTrigger = match($this->alert_type) {
            'price_drop' => $currentPrice < $this->target_price,
            'price_match' => abs($currentPrice - $this->target_price) < 0.01,
            'price_below' => $currentPrice <= $this->target_price,
            default => false,
        };

        if ($shouldTrigger) {
            $this->trigger();
            return true;
        }

        return false;
    }
}
