<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BackgroundCheck extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'check_type',
        'status',
        'provider',
        'provider_reference_id',
        'request_date',
        'completed_date',
        'result',
        'credit_score',
        'summary',
        'report_url',
        'details',
        'consent_given',
        'consent_given_at',
        'fee',
        'expires_at',
    ];

    protected $casts = [
        'request_date' => 'datetime',
        'completed_date' => 'datetime',
        'details' => 'array',
        'consent_given' => 'boolean',
        'consent_given_at' => 'datetime',
        'fee' => 'decimal:2',
        'expires_at' => 'datetime',
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
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopePassed($query)
    {
        return $query->where('result', 'pass');
    }

    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', now())
                    ->orWhereNull('expires_at');
    }

    // Helpers
    public function giveConsent(): void
    {
        $this->update([
            'consent_given' => true,
            'consent_given_at' => now(),
        ]);
    }

    public function complete(array $data): void
    {
        $this->update([
            'status' => 'completed',
            'completed_date' => now(),
            'result' => $data['result'],
            'credit_score' => $data['credit_score'] ?? null,
            'summary' => $data['summary'] ?? null,
            'report_url' => $data['report_url'] ?? null,
            'details' => $data['details'] ?? null,
            'expires_at' => now()->addDays(90), // Standard 90-day validity
        ]);
    }

    public function markFailed(string $reason): void
    {
        $this->update([
            'status' => 'failed',
            'completed_date' => now(),
            'summary' => $reason,
        ]);
    }

    public function isValid(): bool
    {
        if ($this->status !== 'completed') {
            return false;
        }

        if (!$this->expires_at) {
            return true;
        }

        return $this->expires_at > now();
    }

    public function isPassed(): bool
    {
        return $this->result === 'pass' && $this->isValid();
    }

    public function daysUntilExpiry(): ?int
    {
        if (!$this->expires_at) {
            return null;
        }

        return max(0, now()->diffInDays($this->expires_at, false));
    }
}
