<?php

namespace App\Models;


use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'order_number',
        'subtotal',
        'shipping_fee',
        'total',
        'status',
        'payment_method',
        'ship_name',
        'ship_phone',
        'ship_address',
        'ship_city'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scope for recent orders (e.g., last 5)
    public function scopeRecent($query, $limit = 5)
    {
        return $query->latest()->limit($limit);
    }
}
