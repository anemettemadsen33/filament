<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckIn extends Model
{
    protected $fillable = [
        'property_id',
        'booking_id',
        'access_method',
        'access_code',
        'lockbox_location',
        'check_in_instructions',
        'valid_from',
        'valid_until',
        'wifi_name',
        'wifi_password',
        'parking_details',
        'building_access_instructions',
        'emergency_contact_name',
        'emergency_contact_phone',
        'additional_info',
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'additional_info' => 'array',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('valid_from', '<=', now())
                    ->where('valid_until', '>=', now());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('valid_from', '>', now());
    }

    public function scopeExpired($query)
    {
        return $query->where('valid_until', '<', now());
    }

    // Helpers
    public function isActive(): bool
    {
        $now = now();
        return $this->valid_from <= $now && $this->valid_until >= $now;
    }

    public function isExpired(): bool
    {
        return $this->valid_until < now();
    }

    public function extendValidity(\DateTimeInterface $newEndDate): void
    {
        $this->update(['valid_until' => $newEndDate]);
    }

    public function generateAccessCode(int $length = 6): string
    {
        $code = str_pad(random_int(0, 999999), $length, '0', STR_PAD_LEFT);
        $this->update(['access_code' => $code]);
        return $code;
    }
}
