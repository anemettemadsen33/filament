<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Landlord extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'avatar',
        'bio',
        'languages',
        'joined_at',
        'verified',
        'verified_at',
        'identity_verified',
        'email_verified',
        'phone_verified',
        'business_license',
        'background_check',
        'tax_id',
        'proof_of_ownership',
        'total_properties',
        'active_listings',
        'total_bookings',
        'response_time_hours',
        'response_rate',
        'average_rating',
        'review_count',
        'years_on_platform',
        'completion_rate',
        'repeat_guest_rate',
        'badges',
        'is_superhost',
        'superhost_since',
    ];

    protected $casts = [
        'languages' => 'array',
        'badges' => 'array',
        'joined_at' => 'datetime',
        'verified_at' => 'datetime',
        'superhost_since' => 'datetime',
        'verified' => 'boolean',
        'identity_verified' => 'boolean',
        'email_verified' => 'boolean',
        'phone_verified' => 'boolean',
        'business_license' => 'boolean',
        'background_check' => 'boolean',
        'proof_of_ownership' => 'boolean',
        'is_superhost' => 'boolean',
        'average_rating' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    public function getVerificationPercentageAttribute(): int
    {
        $checks = [
            $this->identity_verified,
            $this->email_verified,
            $this->phone_verified,
            $this->business_license,
            $this->background_check,
            $this->proof_of_ownership,
        ];

        $completed = count(array_filter($checks));
        return (int) (($completed / count($checks)) * 100);
    }

    public function getIsFullyVerifiedAttribute(): bool
    {
        return $this->identity_verified
            && $this->email_verified
            && $this->phone_verified
            && $this->proof_of_ownership;
    }

    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }

    public function scopeSuperhost($query)
    {
        return $query->where('is_superhost', true);
    }
}
