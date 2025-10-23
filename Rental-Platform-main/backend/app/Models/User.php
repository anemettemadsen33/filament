<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel as FilamentPanel;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'locale',
        'phone',
        'bio',
        'profile_photo',
        'is_verified',
        'verified_at',
        'google_id',
        'github_id',
        'facebook_id',
        'provider_avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    // Accessors
    public function getPhotoUrlAttribute(): ?string
    {
        if (!$this->profile_photo) {
            return null;
        }
        
        return Storage::url($this->profile_photo);
    }

    // Relationships
    public function properties()
    {
        return $this->hasMany(Property::class, 'owner_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'guest_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }

    public function leaseAgreementsAsLandlord()
    {
        return $this->hasMany(LeaseAgreement::class, 'landlord_id');
    }

    public function leaseAgreementsAsTenant()
    {
        return $this->hasMany(LeaseAgreement::class, 'tenant_id');
    }

    public function backgroundChecks()
    {
        return $this->hasMany(BackgroundCheck::class);
    }

    public function insurances()
    {
        return $this->hasMany(Insurance::class);
    }

    public function roommateProfile()
    {
        return $this->hasOne(RoommateProfile::class);
    }

    public function filterPresets()
    {
        return $this->hasMany(FilterPreset::class);
    }

    // Scopes
    public function scopeOwners($query)
    {
        return $query->whereIn('role', ['owner', 'admin']);
    }

    public function scopeGuests($query)
    {
        return $query->where('role', 'guest');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOwner(): bool
    {
        return in_array($this->role, ['owner', 'admin']);
    }

    public function isGuest(): bool
    {
        return $this->role === 'guest';
    }

    // Filament access control: only admins can access the admin panel
    public function canAccessPanel(FilamentPanel $panel): bool
    {
        return $this->isAdmin();
    }
}
