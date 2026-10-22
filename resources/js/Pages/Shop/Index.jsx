import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import ProductCard from '@/Components/Shop/ProductCard'; 
import ShopSidebar from '@/Components/Shop/ShopSidebar';
import AuthModal from '@/Components/UI/AuthModal';

export default function Index({ products, filters, categories, colors, sizes, auth }) {
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Unified "Add to Cart" handler
    const handleAddToCart = (productId) => {
        if (!auth?.user) {
            setShowLoginModal(true);
            return;
        }

        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1
        }, { preserveScroll: true });
    };

    return (
        <GuestLayout auth={auth}>
            <Head title="Catalog | FLUX" />
            
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-slate-100 pb-12 gap-8">
                    <div className="space-y-4">
                        <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.6em]" data-aos="fade-right">
                            Collection 2026
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.8]" data-aos="fade-up">
                            Flux <br /> Shop
                        </h1>
                    </div>
                    
                    <div className="w-full md:w-auto">
                        <select 
                            // Fix: Fallback to "" prevents the "Invalid value for prop value" React warning
                            value={String(filters?.sort || "")} 
                            onChange={(e) => router.get(route('shop.index'), { ...filters, sort: e.target.value })}
                            className="w-full md:w-auto border-0 border-b-2 border-slate-900 text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer pb-2 bg-transparent transition-all"
                        >
                            <option value="">Newest Arrivals</option>
                            <option value="price_asc">Price: Low-High</option>
                            <option value="price_desc">Price: High-Low</option>
                        </select>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-start">
                    
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0 sticky top-32 z-10 overflow-y-visible">
                        <ShopSidebar filters={filters} categories={categories} colors={colors} sizes={sizes} />
                    </aside>
                    
                    {/* Products Grid */}
                    <main className="flex-grow min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20">
                            {products?.data?.map((product, index) => (
                                <ProductCard 
                                    key={product.id}
                                    product={product} 
                                    auth={auth}      
                                    id={product.id}  
                                    delay={index * 50}
                                    onBuyAction={() => handleAddToCart(product.id)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-32 flex justify-start gap-3 overflow-x-auto pb-4 scrollbar-hide">
                            {products?.meta?.links?.map((link, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`px-5 py-3 text-[10px] font-black uppercase transition-all whitespace-nowrap
                                        ${link.active 
                                            ? 'bg-slate-950 text-white shadow-xl scale-105' 
                                            : 'text-slate-400 hover:text-slate-950 hover:bg-slate-50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </main>
                </div>
            </div>

            {/* Login modal for guests */}
            <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </GuestLayout>
    );
}