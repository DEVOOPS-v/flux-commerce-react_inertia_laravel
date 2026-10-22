<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CartController;

// ✅ Alias to avoid conflict
use App\Http\Controllers\OrderController as UserOrderController;
use App\Http\Controllers\Admin\AdminOrderController as AdminOrderController;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
// ... (keep your existing routes)

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'role:admin'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // 1. CUSTOM ROUTES (Use slug)
        Route::patch('/products/{product:slug}/toggle-availability', [ProductController::class, 'toggleAvailability'])
            ->name('products.toggle-availability');

        Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])
            ->name('orders.update-status');

        // 2. RESOURCE ROUTES
        // CHANGED: Use 'product:slug' so Edit and Delete work with the slug we send from React
        Route::resource('products', ProductController::class)->parameters([
            'products' => 'product:slug'
        ]);

        Route::resource('orders', AdminOrderController::class);
    });


/*
|--------------------------------------------------------------------------
| Shop (Public)
|--------------------------------------------------------------------------
*/

Route::get('/shop', [ShopController::class, 'index'])
    ->name('shop.index');

// Uses slug (Product::getRouteKeyName())

Route::get('/shop/{product}', [ShopController::class, 'show'])
    ->name('shop.show');

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    | Favorites + Cart Sync
    */
    Route::post('/cart/merge', [ShopController::class, 'mergeCart'])->name('cart.merge');
    Route::post('/favorites/merge', [ShopController::class, 'mergeFavorites'])->name('favorites.merge');

    /*
    | Favorites
    */
    Route::post('/favorites/add', [ShopController::class, 'addFavorite'])->name('favorites.add');
    Route::delete('/favorites/remove', [ShopController::class, 'removeFavorite'])->name('favorites.remove');
    Route::get('/favorites', [ShopController::class, 'favoritesIndex'])->name('favorites.index');
    /*
    | Cart
    */
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'store'])->name('cart.add');
    Route::patch('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    /*
    | Checkout
    */
    Route::get('/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
    Route::post('/checkout', [CartController::class, 'storeCheckout'])->name('cart.checkout.store');
    Route::get('/checkout/success/{order}', [CartController::class, 'success'])->name('checkout.success');

    /*
    | User Orders
    */
    Route::get('/orders', [UserOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [UserOrderController::class, 'show'])->name('orders.show');
});

/*
|--------------------------------------------------------------------------
| API Routes (User)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->get(
    '/api/user/recent-orders',
    [UserOrderController::class, 'recent']
)->name('orders.recent');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';
