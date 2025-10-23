<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'property_id',
        'subject',
        'status',
        'participants',
        'last_message_at',
        'total_messages',
        'unread_count',
        'conversation_type',
    ];

    protected $casts = [
        'participants' => 'array',
        'unread_count' => 'array',
        'last_message_at' => 'datetime',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->whereJsonContains('participants', $userId);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('conversation_type', $type);
    }

    // Helpers
    public function addMessage(array $messageData): Message
    {
        $message = $this->messages()->create($messageData);
        
        // Update conversation stats
        $this->increment('total_messages');
        $this->update(['last_message_at' => now()]);
        
        // Update unread count for receiver
        $unreadCount = $this->unread_count ?? [];
        $receiverId = $messageData['receiver_id'] ?? null;
        if ($receiverId) {
            $unreadCount[$receiverId] = ($unreadCount[$receiverId] ?? 0) + 1;
            $this->update(['unread_count' => $unreadCount]);
        }
        
        return $message;
    }

    public function markAllAsRead(int $userId): void
    {
        $this->messages()
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
            
        $unreadCount = $this->unread_count ?? [];
        $unreadCount[$userId] = 0;
        $this->update(['unread_count' => $unreadCount]);
    }

    public function getUnreadCountForUser(int $userId): int
    {
        $unreadCount = $this->unread_count ?? [];
        return $unreadCount[$userId] ?? 0;
    }

    public function archive(): void
    {
        $this->update(['status' => 'archived']);
    }

    public function close(): void
    {
        $this->update(['status' => 'closed']);
    }

    public function reopen(): void
    {
        $this->update(['status' => 'active']);
    }
}
