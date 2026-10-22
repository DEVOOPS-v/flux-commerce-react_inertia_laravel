<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ShopRequest;
use App\Http\Resources\ProductResource;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    /**
     * Display the main Shop listing with filters and sorting.
     */
    public function index(ShopRequest $request): Response
    {
        $query = Product::query();

        // --- Filters ---
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('size')) {
            $query->whereJsonContains('sizes', $request->size);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // --- Sorting ---
        switch ($request->sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'oldest':
                $query->oldest();
                break;
            default:
                $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        return Inertia::render('Shop/Index', [
            'products' => ProductResource::collection($products),
            'filters' => $request->validated(),
            'categories' => ['Dresses', 'Shorts', 'Sweatshirts', 'Swimwear', 'Jackets', 'T-Shirts & Tops', 'Jeans'],
            'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            'auth' => [
                'user' => Auth::user() ? Auth::user()->only('id', 'name', 'email') : null,
            ],
        ]);
    }

    /**
     * Display a single product detail page.
     */
    public function show(Product $product): Response
    {
        return Inertia::render('Shop/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'category' => $product->category,
                'sizes' => is_array($product->sizes) ? $product->sizes : json_decode($product->sizes ?? '[]'),
                'colors' => $product->colors,
                'image' => $product->image,
                'image_url' => $product->image_url,
                'in_stock' => $product->stock > 0,
                'is_available' => $product->is_available,
            ],
            'auth' => [
                'user' => Auth::user() ? Auth::user()->only('id', 'name', 'email') : null,
            ],
        ]);
    }

    /**
     * Display the Favorites/Wishlist page.
     */
    public function favoritesIndex(): Response
    {
        $user = Auth::user();

        // Ensure user is authenticated
        if (!$user) {
            return redirect()->route('login');
        }

        // Mapping to match the { id, product: { ... } } structure in your Index.jsx
        $favorites = $user->favorites()
            ->withPivot('created_at')
            ->orderBy('pivot_created_at', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product' => [
                        'id' => $product->id,
                        'name' => $product->name,
                        'slug' => $product->slug,
                        'price' => $product->price,
                        'image' => $product->image,
                    ]
                ];
            });

        // FIX: Use ->resolve() to flatten the ResourceCollection into a plain array
        $recentAdded = ProductResource::collection(Product::latest()->take(3)->get())->resolve();

        return Inertia::render('Fav/Index', [
            'favorites' => $favorites,
            'recentAdded' => $recentAdded,
            'auth' => [
                'user' => $user->only('id', 'name', 'email'),
            ],
        ]);
    }

    /**
     * Add product to cart.
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string'
        ]);

        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', 'Please log in to add items to your bag.');
        }

        $cartItem = $user->cart()
            ->where('product_id', $request->product_id)
            ->where('size', $request->size)
            ->first();

        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity);
        } else {
            $user->cart()->create([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'size' => $request->size
            ]);
        }

        return redirect()->back()->with('success', 'Item added to your bag.');
    }

    /**
     * Handle "Buy Now" - Adds to cart and redirects to bag.
     */
    public function buyNow(Request $request)
    {
        $this->addToCart($request);
        return redirect()->route('cart.index');
    }

    /**
     * Add product to favorites.
     */
    public function addFavorite(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $user = Auth::user();
        if (!$user) {
            return redirect()->back()->with('error', 'Login to save favorites.');
        }

        $user->favorites()->syncWithoutDetaching([$request->product_id]);

        return redirect()->back()->with('success', 'Added to favorites.');
    }

    /**
     * Remove product from favorites.
     */
    public function removeFavorite(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $user = Auth::user();
        if (!$user) return redirect()->back();

        $user->favorites()->detach($request->product_id);

        return redirect()->back()->with('success', 'Removed from favorites.');
    }

    /**
     * Merge guest cart into user cart upon login.
     */
    public function mergeCart(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string'
        ]);

        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        foreach ($request->items as $item) {
            $cartItem = $user->cart()
                ->where('product_id', $item['product_id'])
                ->where('size', $item['size'] ?? null)
                ->first();

            if ($cartItem) {
                $cartItem->increment('quantity', $item['quantity']);
            } else {
                $user->cart()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'size'       => $item['size'] ?? null
                ]);
            }
        }

        return response()->json(['message' => 'Cart merged successfully']);
    }

    /**
     * Merge guest favorites into user favorites.
     */
    public function mergeFavorites(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id'
        ]);

        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Unauthorized'], 401);

        $user->favorites()->syncWithoutDetaching($request->product_ids);

        return response()->json(['message' => 'Favorites merged successfully']);
    }
}
