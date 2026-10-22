<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')->latest()->paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'category_id'  => 'required|exists:categories,id',
            'description'  => 'required|string',
            'price'        => 'required|numeric|min:0',
            'stock'        => 'required|integer|min:0',
            'is_available' => 'boolean',
            'is_featured'  => 'boolean',
            'image'        => 'nullable|image|max:2048',
            'sizes'        => 'nullable|array',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        // Ensure boolean values are handled correctly from the request
        $validated['is_available'] = $request->boolean('is_available', true);
        $validated['is_featured'] = $request->boolean('is_featured', false);

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with([
                'success' => 'Product created successfully!',
                'flash_id' => uniqid()
            ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product'    => $product,
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'category_id'  => 'required|exists:categories,id',
            'description'  => 'nullable|string',
            'price'        => 'required|numeric|min:0',
            'stock'        => 'required|integer|min:0',
            'is_available' => 'boolean',
            'is_featured'  => 'boolean',
            'image'        => 'nullable|image|max:2048',
            'sizes'        => 'nullable|array',
        ]);

        // FIX: Handle Image Update carefully
        if ($request->hasFile('image')) {
            // Only delete old image if a NEW one is being uploaded
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        } else {
            // CRITICAL: If no new image is uploaded, remove 'image' from $validated 
            // so it doesn't overwrite the existing path with NULL
            unset($validated['image']);
        }

        $validated['is_available'] = $request->boolean('is_available');
        $validated['is_featured'] = $request->boolean('is_featured');

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with([
                'success' => 'Product updated successfully.',
                'flash_id' => uniqid()
            ]);
    }

    public function destroy(Product $product)
    {
        try {
            DB::beginTransaction();

            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            // Clear relationships to prevent foreign key errors
            DB::table('carts')->where('product_id', $product->id)->delete();

            if (Schema::hasTable('order_items')) {
                DB::table('order_items')->where('product_id', $product->id)->delete();
            }

            if (Schema::hasTable('favorites')) {
                DB::table('favorites')->where('product_id', $product->id)->delete();
            }

            $product->delete();

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with([
                    'success' => 'Product purged successfully.',
                    'flash_id' => uniqid()
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Purge failed: ' . $e->getMessage());
        }
    }

    public function toggleAvailability(Product $product)
    {
        $product->update([
            'is_available' => !$product->is_available
        ]);

        return back()->with([
            'success' => 'Status updated!',
            'flash_id' => uniqid()
        ]);
    }
}
