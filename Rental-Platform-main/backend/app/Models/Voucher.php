<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Voucher extends Model
{
    protected $fillable = [
        'code',
        'type',
        'value',
        'description',
        'property_id',
        'landlord_id',
        'category',
        'valid_from',
        'valid_until',
        'max_uses',
        'current_uses',
        'max_uses_per_user',
        'min_booking_days',
        'min_booking_months',
        'rental_term_restriction',
        'property_type_restriction',
        'min_booking_value',
        'active',
        'created_by',
        'used_by',
        'is_public',
        'auto_apply',
        'stackable',
        'priority',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_booking_value' => 'decimal:2',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'used_by' => 'array',
        'property_type_restriction' => 'array',
        'active' => 'boolean',
        'is_public' => 'boolean',
        'auto_apply' => 'boolean',
        'stackable' => 'boolean',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function landlord(): BelongsTo
    {
        return $this->belongsTo(Landlord::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true)
            ->where('valid_from', '<=', now())
            ->where('valid_until', '>=', now())
            ->whereColumn('current_uses', '<', 'max_uses');
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function isValid(): bool
    {
        return $this->active
            && $this->valid_from <= now()
            && $this->valid_until >= now()
            && $this->current_uses < $this->max_uses;
    }

    public function canBeUsedBy(int $userId): bool
    {
        if (!$this->isValid()) {
            return false;
        }

        $usedBy = $this->used_by ?? [];
        $userUsageCount = collect($usedBy)->filter(fn($id) => $id === $userId)->count();

        return $userUsageCount < $this->max_uses_per_user;
    }

    public function incrementUsage(int $userId): void
    {
        $this->increment('current_uses');
        
        $usedBy = $this->used_by ?? [];
        $usedBy[] = $userId;
        $this->update(['used_by' => $usedBy]);
    }

    public function getRemainingUsesAttribute(): int
    {
        return max(0, $this->max_uses - $this->current_uses);
    }

    public function getUsagePercentageAttribute(): int
    {
        if ($this->max_uses === 0) {
            return 0;
        }
        return (int) (($this->current_uses / $this->max_uses) * 100);
    }
}
