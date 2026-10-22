<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class CartService
{
    /**
     * Get transformed cart items for the user.
     */
    public function getUserCart($userId)
    {
        return Cart::with('product')
            ->where('user_id', $userId)
            ->get()
            ->map(fn($item) => $this->transform($item));
    }

    /**
     * Add or increment a product in the cart.
     */
    public function add($userId, $productId, $qty)
    {
        return DB::transaction(function () use ($userId, $productId, $qty) {
            Product::findOrFail($productId);

            $item = Cart::where('user_id', $userId)
                ->where('product_id', $productId)
                ->lockForUpdate()
                ->first();

            if ($item) {
                $item->increment('quantity', $qty);
            } else {
                $item = Cart::create([
                    'user_id'    => $userId,
                    'product_id' => $productId,
                    'quantity'   => $qty,
                ]);
            }

            return $item->fresh('product');
        });
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update($userId, $cartId, $qty)
    {
        return DB::transaction(function () use ($userId, $cartId, $qty) {
            $item = Cart::where('id', $cartId)
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->firstOrFail();

            $item->update(['quantity' => $qty]);

            return $item->fresh('product');
        });
    }

    /**
     * Remove an item from the cart.
     */
    public function remove($userId, $cartId)
    {
        return DB::transaction(function () use ($userId, $cartId) {
            $item = Cart::where('id', $cartId)
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->firstOrFail();

            $item->delete();
        });
    }

    /**
     * Process the checkout – convert cart to order.
     */
    public function processOrder(int $userId, array $data): Order
    {
        return DB::transaction(function () use ($userId, $data) {
            // 1. Get current cart items
            $cartItems = $this->getUserCart($userId);
            if ($cartItems->isEmpty()) {
                throw new Exception("Your shopping bag is empty.");
            }

            // 2. Calculate totals
            $subtotal    = $cartItems->sum('subtotal');
            $shippingFee = (float) ($data['shipping'] ?? 0);
            $taxRate     = 0.12; // 12% VAT
            $total       = ($subtotal * (1 + $taxRate)) + $shippingFee;

            // 3. Create the order
            $order = Order::create([
                'user_id'        => $userId,
                'order_number'   => 'FX-' . strtoupper(bin2hex(random_bytes(4))),
                'subtotal'       => $subtotal,
                'shipping_fee'   => $shippingFee,
                'total'          => $total,
                'status'         => 'pending',
                'payment_method' => $data['payment_method'],
                'ship_name'      => $data['full_name'],
                'ship_phone'     => $data['phone'],
                'ship_address'   => $data['address'],
                'ship_city'      => $data['city'] . ' ' . ($data['postal_code'] ?? ''),
            ]);

            // 4. Create order items (price snapshots)
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['product']['id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['product']['price'],
                ]);
            }

            // 5. Clear the user's cart
            Cart::where('user_id', $userId)->delete();

            return $order;
        });
    }

    /**
     * Transform a cart item into a structured array for the frontend.
     */
    private function transform($item)
    {
        $product = $item->product;
        $price   = $product->price ?? 0;

        return [
            'id'         => $item->id,
            'quantity'   => $item->quantity,
            'subtotal'   => $price * $item->quantity,
            'product_id' => $product->id,
            'product'    => [
                'id'       => $product->id ?? null,
                'name'     => $product->name ?? 'Unknown Item',
                'price'    => $price,
                'image'    => $product->image ?? $product->image_url ?? null,
                'category' => $product->category ?? 'General',
            ],
        ];
    }
}
