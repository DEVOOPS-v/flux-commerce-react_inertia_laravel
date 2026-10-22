<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->with('items.product') // eager load items and products
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load('items.product');

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Return recent orders as JSON (for the navbar dropdown).
     */
    public function recent(Request $request)
    {
        $orders = Order::where('user_id', auth()->id())
            ->latest()
            ->limit(5)
            ->get(['id', 'order_number', 'status', 'total', 'created_at']);

        return response()->json($orders);
    }
}
