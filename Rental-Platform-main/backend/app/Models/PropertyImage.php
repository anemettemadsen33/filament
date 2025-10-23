<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropertyImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'path',
        'original_name',
        'is_primary',
        'sort_order',
        'caption',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    // Relationships
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    // Scopes
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // Accessors
    public function getUrlAttribute()
    {
        // Check if file exists in storage
        $storagePath = storage_path('app/public/' . $this->path);
        if (file_exists($storagePath)) {
            return asset('storage/' . $this->path);
        }
        
        // Use placeholder image from Lorem Picsum
        // Generate unique seed based on image ID for consistent images
        $seed = $this->id ?? rand(1, 1000);
        return "https://picsum.photos/seed/{$seed}/1600/1200";
    }
    
    public function getThumbnailUrlAttribute()
    {
        // Check if thumbnail exists in storage
        $thumbnailPath = str_replace('.jpg', '_thumb.jpg', $this->path);
        $storagePath = storage_path('app/public/' . $thumbnailPath);
        if (file_exists($storagePath)) {
            return asset('storage/' . $thumbnailPath);
        }
        
        // Use smaller placeholder image for thumbnails
        $seed = $this->id ?? rand(1, 1000);
        return "https://picsum.photos/seed/{$seed}/800/600";
    }
}
