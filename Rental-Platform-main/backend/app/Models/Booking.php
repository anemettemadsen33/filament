<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'guest_id',
        'check_in',
        'check_out',
        'guests_count',
        'nights',
        'price_per_night',
        'subtotal',
        'cleaning_fee',
        'service_fee',
        'total_price',
        'status',
        'payment_status',
        'special_requests',
        'cancellation_reason',
        'confirmed_at',
        'cancelled_at',
        'invoice_id',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'price_per_night' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'cleaning_fee' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'total_price' => 'decimal:2',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    // Scopes
    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('check_in', '>', now())
            ->whereIn('status', ['confirmed', 'pending']);
    }

    public function scopePast($query)
    {
        return $query->where('check_out', '<', now());
    }

    // Mutators
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (!$booking->nights) {
                $booking->nights = Carbon::parse($booking->check_in)
                    ->diffInDays(Carbon::parse($booking->check_out));
            }
        });
    }

    // Helpers
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']) 
            && $this->check_in > now();
    }

    public function canBeReviewed(): bool
    {
        return $this->status === 'completed' 
            && !$this->review()->exists()
            && $this->check_out <= now();
    }
}
