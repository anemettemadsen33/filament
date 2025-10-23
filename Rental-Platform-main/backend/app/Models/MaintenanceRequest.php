<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceRequest extends Model
{
    protected $fillable = [
        'property_id',
        'tenant_id',
        'landlord_id',
        'assigned_to',
        'category',
        'priority',
        'status',
        'title',
        'description',
        'attachments',
        'scheduled_date',
        'completed_date',
        'estimated_cost',
        'actual_cost',
        'landlord_notes',
        'tenant_notes',
        'resolution_details',
    ];

    protected $casts = [
        'attachments' => 'array',
        'scheduled_date' => 'datetime',
        'completed_date' => 'datetime',
        'estimated_cost' => 'decimal:2',
        'actual_cost' => 'decimal:2',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function landlord(): BelongsTo
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Scopes
    public function scopeEmergency($query)
    {
        return $query->where('priority', 'emergency');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Helpers
    public function acknowledge(): void
    {
        $this->update(['status' => 'acknowledged']);
    }

    public function schedule(string $date): void
    {
        $this->update([
            'status' => 'scheduled',
            'scheduled_date' => $date
        ]);
    }

    public function markInProgress(): void
    {
        $this->update(['status' => 'in_progress']);
    }

    public function complete(array $details = []): void
    {
        $this->update([
            'status' => 'completed',
            'completed_date' => now(),
            'resolution_details' => $details['resolution_details'] ?? null,
            'actual_cost' => $details['actual_cost'] ?? null,
        ]);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }
}
