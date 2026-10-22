import React from "react";
import { ArrowRight } from "lucide-react";
import { router } from "@inertiajs/react";

export default function CartSummary({ total, shippingCost, setShippingCost }) {
    const subtotal = parseFloat(total);
    const vatAmount = subtotal * 0.12;
    const grandTotal = subtotal + vatAmount + shippingCost;

    return (
        <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-slate-950 p-8 md:p-10 text-white">
                <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-10 opacity-50 border-b border-white/10 pb-4">
                    Cart Totals
                </h3>
                
                <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center text-[11px] uppercase font-bold tracking-widest opacity-60">
                        <span>Subtotal</span>
                        <span className="text-white">₱{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="py-6 border-y border-white/10">
                        <span className="text-[11px] uppercase font-bold tracking-widest opacity-60 block mb-4">Shipping</span>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 text-[10px] font-bold cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="ship" 
                                    checked={shippingCost === 0} 
                                    onChange={() => setShippingCost(0)}
                                    className="accent-pink-600 bg-transparent border-white/20" 
                                /> 
                                Free Shipping
                            </label>
                            <label className="flex items-center gap-3 text-[10px] font-bold cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="ship" 
                                    checked={shippingCost === 250} 
                                    onChange={() => setShippingCost(250)}
                                    className="accent-pink-600 bg-transparent border-white/20" 
                                /> 
                                Local Pickup: ₱250
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[11px] uppercase font-bold tracking-widest opacity-60">
                        <span>VAT (12%)</span>
                        <span className="text-white">₱{vatAmount.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-10 pt-6 border-t-2 border-white">
                    <span className="text-[10px] font-black uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-black tracking-tighter">₱{grandTotal.toLocaleString()}</span>
                </div>

                <button
                    onClick={() => router.visit("/checkout")}
                    className="w-full bg-white text-slate-950 py-5 font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-pink-600 hover:text-white transition-all group"
                >
                    Proceed to Checkout
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </aside>
    );
}