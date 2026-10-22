<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;

class WelcomeController extends Controller
{
    public function index()
    {
        // 1. Fetch trending products
        $trendingProducts = Product::with('category')
            ->where('is_trending', true)
            ->latest()
            ->take(4)
            ->get();

        // 2. Fallback: If no products are marked trending, just get the latest 4
        if ($trendingProducts->isEmpty()) {
            $trendingProducts = Product::with('category')->latest()->take(4)->get();
        }

        // 3. Render the React component and pass the data
        return Inertia::render('Welcome', [
            'trendingProducts' => $trendingProducts,
        ]);
    }
}
