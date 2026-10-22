<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartItemRequest;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(protected CartService $cartService)
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(): Response
    {
        $cart = $this->cartService->getUserCart(auth()->id());
        return Inertia::render('Cart/Index', [
            'cart'  => $cart,
            'total' => collect($cart)->sum('subtotal'),
        ]);
    }

    public function checkout(Request $request): Response|RedirectResponse
    {
        $cart = $this->cartService->getUserCart(auth()->id());
        if ($cart->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your bag is empty.');
        }

        $subtotal = $cart->sum('subtotal');
        $shipping = (float) $request->query('shipping', 0);

        return Inertia::render('Checkout/Index', [
            'cart'         => $cart,
            'total'        => $subtotal,
            'vatAmount'    => $subtotal * 0.12,
            'shippingCost' => $shipping,
            'grandTotal'   => ($subtotal * 1.12) + $shipping,
        ]);
    }

    public function storeCheckout(CheckoutRequest $request): RedirectResponse
    {
        try {
            $order = $this->cartService->processOrder(
                auth()->id(),
                $request->validated()
            );

            // Send confirmation email
            Mail::to(auth()->user()->email)->queue(new OrderConfirmation($order));

            return redirect()
                ->route('checkout.success', $order->id)
                ->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Checkout failed: ' . $e->getMessage()]);
        }
    }

    public function success(int $orderId): Response
    {
        $order = Order::with('items.product')
            ->where('user_id', auth()->id())
            ->findOrFail($orderId);

        return Inertia::render('Checkout/OrderSuccess', [
            'order' => $order,
        ]);
    }

    // Standard cart operations...
    public function store(CartItemRequest $request): RedirectResponse
    {
        $this->cartService->add(auth()->id(), $request->product_id, $request->quantity);
        return back()->with('success', 'Added to bag.');
    }

    public function update(CartItemRequest $request, int $cartId): RedirectResponse
    {
        $this->cartService->update(auth()->id(), $cartId, $request->quantity);
        return back()->with('success', 'Bag updated.');
    }

    public function destroy(int $cartId): RedirectResponse
    {
        $this->cartService->remove(auth()->id(), $cartId);
        return back()->with('success', 'Item removed.');
    }
}
