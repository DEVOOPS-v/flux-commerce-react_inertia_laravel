<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Prepare cart and favorites data for the authenticated user
        $cart = [];
        $favorites = [];

        if ($user) {
            // Load cart items with the related product (eager load)
            $cart = $user->cart()->with('product')->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'price' => $item->product->price,
                        'image' => $item->product->image,
                        'image_url' => $item->product->image_url,
                        'stock' => $item->product->stock,
                    ],
                ];
            });

            // Favorites: just the product IDs
            $favorites = $user->favorites()->pluck('product_id');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'auth_cart' => $cart,
            'auth_favorites' => $favorites,

            // CRITICAL: Updated Flash Object for FLUX Pink Notifications
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error'   => fn() => $request->session()->get('error'),
                'message' => fn() => $request->session()->get('message'),
                'new_user' => fn() => $request->session()->get('new_user'),

                /**
                 * The flash_id is the "Heartbeat" for your React frontend.
                 * It forces the useEffect to re-run even if the success string is the same.
                 */
                'flash_id' => fn() => $request->session()->get('flash_id'),
            ],
        ];
    }
}
