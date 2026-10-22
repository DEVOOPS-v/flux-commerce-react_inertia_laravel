import React, { useState } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    Heart,
    ShoppingBag,
    ChevronLeft,
    Minus,
    Plus,
    CreditCard,
    Truck,
    ShieldCheck,
    Verified,
} from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";
import AuthModal from "@/Components/UI/AuthModal";
import LoadingOverlay from "@/Components/UI/LoadingOverlay";

export default function Show({ product, auth }) {
    const productSizes = product.sizes || [];
    const [selectedSize, setSelectedSize] = useState(productSizes[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // --- useForm handles 'processing' state automatically ---
    const { post, processing } = useForm({
        product_id: product.id,
        size: selectedSize,
        quantity: quantity,
    });

    const fallbackImage = "https://placehold.co/800x1000?text=Flux+Apparel";
    const isLoggedIn = !!auth?.user;
    const isInStock = product?.in_stock && product?.stock > 0;

    const getProductImage = () => {
        if (!product?.image) return fallbackImage;
        if (product.image.startsWith("http")) return product.image;
        return `/storage/${product.image}`;
    };

    const handleAddToCart = () => {
        post(route("cart.add"), {
            preserveScroll: true,
            data: {
                product_id: product.id,
                size: selectedSize,
                quantity: quantity,
            },
        });
    };

    const handleBuyNow = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
            return;
        }

        post(route("cart.add"), {
            data: {
                product_id: product.id,
                size: selectedSize,
                quantity: quantity,
            },
            onSuccess: () => router.visit(route("cart.index")),
        });
    };

    return (
        <GuestLayout auth={auth}>
            <Head title={`${product.name} | FLUX`} />

            {/* Global Loading Modal - Triggers on 'processing' */}
            <LoadingOverlay
                isVisible={processing}
                message="Updating your bag"
            />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                <div className="mb-12" data-aos="fade-right">
                    <Link
                        href={route("shop.index")}
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-pink-600 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Collection
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Product Image Section */}
                    <div className="w-full lg:w-[55%]" data-aos="fade-up">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-slate-100 shadow-2xl group">
                            <img
                                src={getProductImage()}
                                alt={product?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <button className="absolute top-6 right-6 p-4 bg-white/80 backdrop-blur-md rounded-full text-slate-900 shadow-sm hover:bg-pink-600 hover:text-white transition-all">
                                <Heart className="w-5 h-5" />
                            </button>

                            {!isInStock && (
                                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center">
                                    <span className="text-white font-black uppercase tracking-[0.5em] text-xl border-2 border-white px-8 py-4">
                                        Sold Out
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div
                        className="w-full lg:w-[45%] flex flex-col lg:sticky lg:top-32 h-fit"
                        data-aos="fade-left"
                    >
                        <div className="border-b border-slate-100 pb-8 mb-8">
                            <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">
                                {product.category?.name || "Limited Release"}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9] mb-6">
                                {product?.name}
                            </h1>
                            <p className="text-2xl font-black text-slate-900">
                                ₱{" "}
                                {new Intl.NumberFormat().format(
                                    product?.price || 0,
                                )}
                            </p>
                        </div>

                        <div className="mb-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">
                                Description
                            </h4>
                            <p className="text-slate-600 leading-relaxed text-sm max-w-md">
                                {product?.description ||
                                    "Engineered for the modern vanguard. This piece combines comfort with the signature FLUX minimalist aesthetic."}
                            </p>
                        </div>

                        <div className="space-y-10 mb-12">
                            {productSizes.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-4 flex justify-between">
                                        Select Size{" "}
                                        <span className="text-pink-600">
                                            {selectedSize}
                                        </span>
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {productSizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
                                                className={`h-12 min-w-[3.5rem] px-4 border-2 text-[11px] font-black transition-all rounded-xl ${
                                                    selectedSize === size
                                                        ? "bg-slate-950 text-white border-slate-950 shadow-lg scale-105"
                                                        : "border-slate-100 text-slate-400 hover:border-slate-900 hover:text-slate-900"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">
                                    Quantity
                                </h4>
                                <div className="flex items-center border-2 border-slate-100 rounded-xl overflow-hidden bg-white">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1),
                                            )
                                        }
                                        className="p-4 hover:bg-slate-50 hover:text-pink-600 transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-12 text-center text-xs font-black">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setQuantity(
                                                Math.min(
                                                    product.stock || 99,
                                                    quantity + 1,
                                                ),
                                            )
                                        }
                                        className="p-4 hover:bg-slate-50 hover:text-pink-600 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 mb-12">
                            <button
                                onClick={handleAddToCart}
                                disabled={!isInStock || processing}
                                className={`w-full font-black uppercase py-5 text-[11px] tracking-[0.4em] transition-all rounded-2xl shadow-xl hover:-translate-y-1 active:translate-y-0 ${
                                    isInStock && !processing
                                        ? "bg-slate-950 text-white hover:bg-slate-800"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <ShoppingBag className="w-4 h-4" />
                                    {processing ? "Adding..." : "Add to Cart"}
                                </span>
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={!isInStock || processing}
                                className={`w-full font-black uppercase py-5 text-[11px] tracking-[0.4em] transition-all rounded-2xl shadow-xl hover:-translate-y-1 active:translate-y-0 ${
                                    isInStock && !processing
                                        ? "bg-pink-600 text-white hover:bg-pink-700"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <CreditCard className="w-4 h-4" />
                                    {processing
                                        ? "Processing..."
                                        : "Buy It Now"}
                                </span>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                            <Badge
                                icon={<Truck />}
                                title="Express Delivery"
                                sub="24-48 Hour Shipping"
                            />
                            <Badge
                                icon={<ShieldCheck />}
                                title="Secure Payment"
                                sub="SSL Encrypted"
                            />
                            <Badge
                                icon={<Verified />}
                                title="Authentic Only"
                                sub="100% Flux Gear"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </GuestLayout>
    );
}

// Simple internal component for the trust badges
function Badge({ icon, title, sub }) {
    return (
        <div className="flex flex-col items-center gap-2 text-center">
            {React.cloneElement(icon, { className: "w-5 h-5 text-pink-600" })}
            <span className="text-[9px] font-black uppercase tracking-tighter text-slate-900">
                {title}
            </span>
            <p className="text-[8px] text-slate-400 font-bold uppercase leading-tight">
                {sub}
            </p>
        </div>
    );
}
