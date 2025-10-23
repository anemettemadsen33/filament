<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Insurance extends Model
{
    protected $fillable = [
        'property_id',
        'user_id',
        'policy_type',
        'provider',
        'policy_number',
        'coverage_amount',
        'deductible',
        'premium_amount',
        'premium_frequency',
        'start_date',
        'end_date',
        'status',
        'document_url',
        'covered_items',
        'additional_coverage',
        'auto_renew',
        'last_payment_date',
        'next_payment_date',
    ];

    protected $casts = [
        'coverage_amount' => 'decimal:2',
        'deductible' => 'decimal:2',
        'premium_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'covered_items' => 'array',
        'auto_renew' => 'boolean',
        'last_payment_date' => 'datetime',
        'next_payment_date' => 'datetime',
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

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
    }

    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('status', 'active')
                    ->where('end_date', '<=', now()->addDays($days))
                    ->where('end_date', '>=', now());
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('policy_type', $type);
    }

    // Helpers
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && $this->start_date <= now() 
            && $this->end_date >= now();
    }

    public function daysUntilExpiry(): int
    {
        return max(0, now()->diffInDays($this->end_date, false));
    }

    public function recordPayment(): void
    {
        $nextPayment = match($this->premium_frequency) {
            'monthly' => now()->addMonth(),
            'quarterly' => now()->addMonths(3),
            'semi-annually' => now()->addMonths(6),
            'annually' => now()->addYear(),
        };

        $this->update([
            'last_payment_date' => now(),
            'next_payment_date' => $nextPayment,
            'status' => 'active',
        ]);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function renew(array $data): void
    {
        $this->update([
            'start_date' => $data['start_date'] ?? $this->end_date->addDay(),
            'end_date' => $data['end_date'],
            'premium_amount' => $data['premium_amount'] ?? $this->premium_amount,
            'coverage_amount' => $data['coverage_amount'] ?? $this->coverage_amount,
            'status' => 'active',
        ]);
    }

    public function isPaymentDue(): bool
    {
        if (!$this->next_payment_date) {
            return false;
        }

        return $this->next_payment_date <= now();
    }
}
