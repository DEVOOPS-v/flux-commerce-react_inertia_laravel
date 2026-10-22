<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'category_id', // Matches migration
        'low_stock_threshold',
        'image',
        'sizes',
        'is_available',
        'is_featured'
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'stock' => 'integer',
        'sizes' => 'array',
    ];

    protected $appends = ['image_url'];

    protected static function booted()
    {
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    // --- Relationships ---

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // --- Scopes for Filtering ---

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        })->when($filters['category_id'] ?? null, function ($q, $catId) {
            $q->where('category_id', $catId);
        })->when($filters['size'] ?? null, function ($q, $size) {
            $q->whereJsonContains('sizes', $size);
        })->when($filters['featured'] ?? null, function ($q) {
            $q->where('is_featured', true);
        });
    }

    public function scopeSort(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'price_asc'  => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'oldest'     => $query->orderBy('created_at', 'asc'),
            default      => $query->latest(),
        };
    }

    // --- Accessors ---

    protected function imageUrl(): Attribute
    {
        return Attribute::get(
            fn() => $this->image
                ? asset('storage/' . $this->image)
                : asset('images/placeholder-product.png')
        );
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
}
