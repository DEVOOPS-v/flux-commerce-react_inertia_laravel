import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import OrderStepper from "@/Components/UI/OrderStepper";

export default function CartIndex() {
    const { auth, cart, total } = usePage().props;

    const [shippingCost, setShippingCost] = useState(0);
    const [coupon, setCoupon] = useState("");

    if (!auth.user) {
        router.visit("/login");
        return null;
    }

    // --- Image Logic Fix ---
    const getProductImage = (product) => {
        const fallbackImage = "https://placehold.co/800x1000?text=Flux+Apparel";
        if (!product?.image) return fallbackImage;

        // If it's a full URL (seeder), use it. Otherwise, prefix with /storage/
        return product.image.startsWith("http")
            ? product.image
            : `/storage/${product.image}`;
    };

    const updateQuantity = (cartId, newQty) => {
        if (newQty < 1) return;
        router.patch(
            `/cart/${cartId}`,
            { quantity: newQty },
            { preserveScroll: true },
        );
    };

    const removeItem = (cartId) => {
        router.delete(`/cart/${cartId}`, { preserveScroll: true });
    };

    const subtotal = parseFloat(total);
    const vatAmount = subtotal * 0.12;
    const grandTotal = subtotal + vatAmount + shippingCost;

    return (
        <GuestLayout auth={auth}>
            <Head title="Shopping Bag | FLUX" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                <OrderStepper activeStep={1} />

                <div className="flex flex-col mb-16 border-b border-slate-100 pb-12">
                    <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.6em] mb-4">
                        Review Your Items
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.8]">
                        Shopping <br /> Bag
                    </h1>
                </div>

                {cart.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 uppercase tracking-widest font-bold text-sm">
                            Your bag is empty.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-8 space-y-10">
                            <div className="hidden md:grid grid-cols-12 gap-6 pb-6 border-b border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-3 text-center">
                                    Quantity
                                </div>
                                <div className="col-span-3 text-right">
                                    Subtotal
                                </div>
                            </div>

                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-slate-50 relative"
                                >
                                    <div className="w-full sm:w-48 h-60 bg-slate-50 shrink-0 overflow-hidden rounded-xl">
                                        <img
                                            src={getProductImage(item.product)} // Fixed image source
                                            alt={item.product.name}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://placehold.co/800x1000?text=Flux+Apparel";
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col justify-between flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-tight mb-1">
                                                    {item.product.name}
                                                </h2>
                                                <p className="text-pink-600 font-bold">
                                                    ₱
                                                    {Number(
                                                        item.product.price,
                                                    ).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
                                                    ID: #FX-{item.id}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    removeItem(item.id)
                                                }
                                                className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-12">
                                            <div className="flex items-center border-2 border-slate-900">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    className="px-4 py-2 hover:bg-slate-900 hover:text-white transition-all"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-12 text-center font-black">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="px-4 py-2 hover:bg-slate-900 hover:text-white transition-all"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <p className="text-2xl font-black tracking-tighter">
                                                ₱
                                                {Number(
                                                    item.subtotal,
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <input
                                    type="text"
                                    value={coupon}
                                    onChange={(e) =>
                                        setCoupon(e.target.value.toUpperCase())
                                    }
                                    placeholder="COUPON CODE"
                                    className="border border-slate-200 px-6 py-4 text-[10px] font-bold tracking-widest focus:border-slate-950 transition-all outline-none md:w-64"
                                />
                                <button className="px-8 py-4 border-2 border-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">
                                    Apply Coupon
                                </button>
                            </div>
                        </div>

                        <aside className="lg:col-span-4 sticky top-32">
                            <div className="bg-slate-950 p-8 md:p-10 text-white">
                                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-10 opacity-50 border-b border-white/10 pb-4">
                                    Cart Totals
                                </h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center text-[11px] uppercase font-bold tracking-widest opacity-60">
                                        <span>Subtotal</span>
                                        <span className="text-white">
                                            ₱{subtotal.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="py-6 border-y border-white/10">
                                        <span className="text-[11px] uppercase font-bold tracking-widest opacity-60 block mb-4">
                                            Shipping
                                        </span>
                                        <div className="space-y-4">
                                            <label className="flex items-center gap-3 text-[10px] font-bold cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ship"
                                                    checked={shippingCost === 0}
                                                    onChange={() =>
                                                        setShippingCost(0)
                                                    }
                                                    className="accent-pink-600 bg-transparent border-white/20"
                                                />
                                                Free Shipping
                                            </label>
                                            <label className="flex items-center gap-3 text-[10px] font-bold cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="ship"
                                                    checked={
                                                        shippingCost === 250
                                                    }
                                                    onChange={() =>
                                                        setShippingCost(250)
                                                    }
                                                    className="accent-pink-600 bg-transparent border-white/20"
                                                />
                                                Local Pickup: ₱250
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-[11px] uppercase font-bold tracking-widest opacity-60">
                                        <span>VAT (12%)</span>
                                        <span className="text-white">
                                            ₱{vatAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-10 pt-6 border-t-2 border-white">
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Total
                                    </span>
                                    <span className="text-4xl font-black tracking-tighter">
                                        ₱{grandTotal.toLocaleString()}
                                    </span>
                                </div>

                                <button
                                    onClick={() =>
                                        router.visit("/checkout", {
                                            data: {
                                                shipping: shippingCost,
                                                coupon,
                                            },
                                        })
                                    }
                                    className="w-full bg-white text-slate-950 py-5 font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-pink-600 hover:text-white transition-all group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </button>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
