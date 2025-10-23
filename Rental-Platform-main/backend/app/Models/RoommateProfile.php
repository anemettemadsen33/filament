<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoommateProfile extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'age',
        'gender',
        'occupation',
        'budget_min',
        'budget_max',
        'preferred_locations',
        'lifestyle',
        'cleanliness',
        'has_pets',
        'pet_types',
        'pet_friendly',
        'smoker',
        'smoking_friendly',
        'work_schedule',
        'interests',
        'looking_for_roommates_count',
        'move_in_date',
        'match_status',
        'current_matches',
        'verified',
        'last_active_at',
    ];

    protected $casts = [
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
        'preferred_locations' => 'array',
        'has_pets' => 'boolean',
        'pet_friendly' => 'boolean',
        'smoker' => 'boolean',
        'smoking_friendly' => 'boolean',
        'interests' => 'array',
        'move_in_date' => 'date',
        'current_matches' => 'array',
        'verified' => 'boolean',
        'last_active_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('match_status', 'active');
    }

    public function scopeVerified($query)
    {
        return $query->where('verified', true);
    }

    public function scopeInBudgetRange($query, float $min, float $max)
    {
        return $query->where(function($q) use ($min, $max) {
            $q->where('budget_min', '<=', $max)
              ->where('budget_max', '>=', $min);
        });
    }

    // Helpers
    public function calculateCompatibility(self $otherProfile): float
    {
        $score = 0;
        $maxScore = 0;

        // Budget compatibility (weight: 25)
        $maxScore += 25;
        if ($this->budget_min <= $otherProfile->budget_max && $this->budget_max >= $otherProfile->budget_min) {
            $score += 25;
        }

        // Lifestyle compatibility (weight: 20)
        $maxScore += 20;
        if ($this->lifestyle === $otherProfile->lifestyle) {
            $score += 20;
        } elseif (in_array($this->lifestyle, ['balanced']) || in_array($otherProfile->lifestyle, ['balanced'])) {
            $score += 10;
        }

        // Cleanliness compatibility (weight: 15)
        $maxScore += 15;
        $cleanlinessLevels = ['very_clean' => 4, 'clean' => 3, 'average' => 2, 'relaxed' => 1];
        $diff = abs(($cleanlinessLevels[$this->cleanliness] ?? 2) - ($cleanlinessLevels[$otherProfile->cleanliness] ?? 2));
        $score += max(0, 15 - ($diff * 5));

        // Pet compatibility (weight: 15)
        $maxScore += 15;
        if ($this->has_pets && $otherProfile->pet_friendly) {
            $score += 15;
        } elseif (!$this->has_pets && !$otherProfile->has_pets) {
            $score += 15;
        } elseif ($this->has_pets && !$otherProfile->pet_friendly) {
            $score += 0;
        } else {
            $score += 10;
        }

        // Smoking compatibility (weight: 15)
        $maxScore += 15;
        if ($this->smoker && $otherProfile->smoking_friendly) {
            $score += 15;
        } elseif (!$this->smoker && !$otherProfile->smoker) {
            $score += 15;
        } elseif ($this->smoker && !$otherProfile->smoking_friendly) {
            $score += 0;
        } else {
            $score += 10;
        }

        // Interests overlap (weight: 10)
        $maxScore += 10;
        $myInterests = $this->interests ?? [];
        $theirInterests = $otherProfile->interests ?? [];
        $commonInterests = count(array_intersect($myInterests, $theirInterests));
        $score += min(10, $commonInterests * 2);

        return round(($score / $maxScore) * 100, 2);
    }

    public function addMatch(int $userId, float $compatibilityScore): void
    {
        $matches = $this->current_matches ?? [];
        $matches[] = [
            'user_id' => $userId,
            'compatibility_score' => $compatibilityScore,
            'matched_at' => now()->toIso8601String(),
        ];

        $this->update(['current_matches' => $matches]);
    }

    public function removeMatch(int $userId): void
    {
        $matches = collect($this->current_matches ?? [])
            ->reject(fn($match) => $match['user_id'] === $userId)
            ->values()
            ->toArray();

        $this->update(['current_matches' => $matches]);
    }

    public function markActive(): void
    {
        $this->update([
            'match_status' => 'active',
            'last_active_at' => now(),
        ]);
    }

    public function markMatched(): void
    {
        $this->update(['match_status' => 'matched']);
    }

    public function verify(): void
    {
        $this->update(['verified' => true]);
    }
}
