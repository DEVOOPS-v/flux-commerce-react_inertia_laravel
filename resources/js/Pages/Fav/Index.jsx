import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";

export default function FavoritesIndex() {
    const { auth, favorites, recentAdded } = usePage().props;

    // Safety check for auth, though usually handled by middleware
    if (!auth.user) {
        router.visit("/login");
        return null;
    }

    // --- Image Logic Fix ---
    const getProductImage = (product) => {
        const fallbackImage = "https://placehold.co/800x1000?text=Flux+Apparel";
        if (!product?.image) return fallbackImage;
        return product.image.startsWith("http")
            ? product.image
            : `/storage/${product.image}`;
    };

    const removeFromFavorites = (productId) => {
        router.delete(route("favorites.remove"), {
            data: { product_id: productId },
            preserveScroll: true,
        });
    };

    const moveToCart = (product) => {
        router.post(
            route("cart.add"),
            {
                product_id: product.id,
                quantity: 1,
                // Optional: add default size logic if needed
            },
            {
                onSuccess: () => removeFromFavorites(product.id),
                preserveScroll: true,
            },
        );
    };

    return (
        <GuestLayout auth={auth}>
            <Head title="Wishlist | FLUX" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                {/* Header Section */}
                <div className="flex flex-col mb-16 border-b border-slate-100 pb-12">
                    <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.6em] mb-4">
                        Saved for Later
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.8]">
                        Your <br /> Favourites
                    </h1>
                </div>

                {favorites.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                        <p className="text-slate-400 uppercase tracking-widest font-bold text-sm mb-6">
                            Your wishlist is empty.
                        </p>
                        <button
                            onClick={() => router.visit("/shop")}
                            className="text-slate-900 font-black text-[10px] uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-pink-600 hover:border-pink-600 transition-all"
                        >
                            Explore Shop
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Favorites List */}
                        <div className="lg:col-span-8 space-y-8">
                            {favorites.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex flex-col sm:flex-row gap-8 pb-8 border-b border-slate-50 relative"
                                >
                                    <div className="w-full sm:w-40 h-52 bg-slate-50 shrink-0 overflow-hidden rounded-xl">
                                        <img
                                            src={getProductImage(item.product)}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between flex-grow py-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-1">
                                                    {item.product.name}
                                                </h2>
                                                <p className="text-pink-600 font-bold">
                                                    ₱
                                                    {Number(
                                                        item.product.price,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeFromFavorites(
                                                        item.product.id,
                                                    )
                                                }
                                                className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-4 mt-8">
                                            <button
                                                onClick={() =>
                                                    moveToCart(item.product)
                                                }
                                                className="bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-slate-200"
                                            >
                                                <ShoppingBag size={14} />
                                                Add to Bag
                                            </button>
                                            <button
                                                onClick={() =>
                                                    router.visit(
                                                        `/shop/${item.product.slug}`,
                                                    )
                                                }
                                                className="px-6 py-3 border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:border-slate-900 transition-all"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Added / Sidebar Info - Enhanced with Glassmorphism */}
                        <aside className="lg:col-span-4 sticky top-32">
                            <div className="bg-white/40 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2">
                                    <Heart
                                        size={12}
                                        className="text-pink-600 fill-pink-600"
                                    />
                                    Recently Added
                                </h3>

                                <div className="space-y-6">
                                    {recentAdded.map((prod) => (
                                        <div
                                            key={prod.id}
                                            className="flex gap-4 items-center group cursor-pointer"
                                            onClick={() =>
                                                router.visit(
                                                    `/shop/${prod.slug}`,
                                                )
                                            }
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-100">
                                                <img
                                                    src={getProductImage(prod)}
                                                    alt={prod.name}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase leading-tight group-hover:text-pink-600 transition-colors">
                                                    {prod.name}
                                                </h4>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">
                                                    ₱
                                                    {Number(
                                                        prod.price,
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-100">
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-6">
                                        Items in your favourites are not
                                        reserved. Add them to your bag to secure
                                        your style.
                                    </p>
                                    <button
                                        onClick={() => router.visit("/shop")}
                                        className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-pink-600 transition-all group"
                                    >
                                        Continue Shopping
                                        <ArrowRight
                                            size={14}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
