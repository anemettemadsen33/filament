<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaseAgreement extends Model
{
    protected $fillable = [
        'property_id',
        'landlord_id',
        'tenant_id',
        'booking_id',
        'start_date',
        'end_date',
        'rent_amount',
        'deposit_amount',
        'payment_frequency',
        'terms',
        'additional_clauses',
        'status',
        'document_url',
        'signed_by_landlord_at',
        'signed_by_tenant_at',
        'signature_landlord',
        'signature_tenant',
        'auto_renew',
        'renewal_notice_days',
        'termination_reason',
        'terminated_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'rent_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'additional_clauses' => 'array',
        'signed_by_landlord_at' => 'datetime',
        'signed_by_tenant_at' => 'datetime',
        'auto_renew' => 'boolean',
        'terminated_at' => 'datetime',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function landlord(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
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

    public function scopePendingSignatures($query)
    {
        return $query->where('status', 'pending_signatures');
    }

    // Helpers
    public function signByLandlord(string $signature): void
    {
        $this->update([
            'signature_landlord' => $signature,
            'signed_by_landlord_at' => now(),
        ]);

        $this->checkFullySigned();
    }

    public function signByTenant(string $signature): void
    {
        $this->update([
            'signature_tenant' => $signature,
            'signed_by_tenant_at' => now(),
        ]);

        $this->checkFullySigned();
    }

    protected function checkFullySigned(): void
    {
        if ($this->signed_by_landlord_at && $this->signed_by_tenant_at) {
            $this->update(['status' => 'active']);
        }
    }

    public function isFullySigned(): bool
    {
        return $this->signed_by_landlord_at && $this->signed_by_tenant_at;
    }

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

    public function terminate(string $reason): void
    {
        $this->update([
            'status' => 'terminated',
            'termination_reason' => $reason,
            'terminated_at' => now(),
        ]);
    }

    public function renew(array $data): self
    {
        return self::create([
            'property_id' => $this->property_id,
            'landlord_id' => $this->landlord_id,
            'tenant_id' => $this->tenant_id,
            'start_date' => $data['start_date'] ?? $this->end_date->addDay(),
            'end_date' => $data['end_date'],
            'rent_amount' => $data['rent_amount'] ?? $this->rent_amount,
            'deposit_amount' => $data['deposit_amount'] ?? $this->deposit_amount,
            'payment_frequency' => $this->payment_frequency,
            'terms' => $data['terms'] ?? $this->terms,
            'status' => 'draft',
        ]);
    }
}
