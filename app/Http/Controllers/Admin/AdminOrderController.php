<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

/**
 * FLUX Admin Order Management
 * Handles Order Listing, Detailed Viewing, and Status Transitions
 */
class AdminOrderController extends Controller
{
    /**
     * Requirement: Order List
     * Optimized with Eager Loading and Query String preservation
     */
    public function index()
    {
        $orders = Order::with('user:id,name,email')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Requirement: View Order Details
     * Loads nested relationships for products and customer info
     */
    public function show(Order $order)
    {
        // Eager load items and products to prevent N+1 query issues
        $order->load(['user', 'items.product']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Requirement: Update Order Status (Validation Required)
     * Strictly enforces the four valid FLUX order states
     */
    public function updateStatus(Request $request, Order $order)
    {
        // 1. Strict Validation
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(['pending', 'paid', 'shipped', 'completed']),
            ],
        ], [
            'status.in' => 'The selected status is invalid for the FLUX system.',
        ]);

        // 2. Database Update
        $order->update([
            'status' => $validated['status']
        ]);

        // 3. Return to view with Flash Notification
        return back()->with('success', "Order #{$order->order_number} status updated to " . strtoupper($validated['status']));
    }
}