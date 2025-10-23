<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FilterPreset extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'filters',
        'is_active',
        'notification_enabled',
        'match_count',
        'last_checked_at',
        'new_matches_count',
        'is_favorite',
        'usage_count',
    ];

    protected $casts = [
        'filters' => 'array',
        'is_active' => 'boolean',
        'notification_enabled' => 'boolean',
        'last_checked_at' => 'datetime',
        'is_favorite' => 'boolean',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithNotifications($query)
    {
        return $query->where('notification_enabled', true);
    }

    public function scopeFavorites($query)
    {
        return $query->where('is_favorite', true);
    }

    // Helpers
    public function apply(): array
    {
        $this->increment('usage_count');
        return $this->filters;
    }

    public function updateMatchCount(int $count): void
    {
        $newMatches = max(0, $count - $this->match_count);
        
        $this->update([
            'match_count' => $count,
            'new_matches_count' => $this->new_matches_count + $newMatches,
            'last_checked_at' => now(),
        ]);
    }

    public function markMatchesViewed(): void
    {
        $this->update(['new_matches_count' => 0]);
    }

    public function toggleFavorite(): void
    {
        $this->update(['is_favorite' => !$this->is_favorite]);
    }

    public function toggleNotifications(): void
    {
        $this->update(['notification_enabled' => !$this->notification_enabled]);
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function hasNewMatches(): bool
    {
        return $this->new_matches_count > 0;
    }
}
