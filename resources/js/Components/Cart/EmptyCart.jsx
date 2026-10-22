import React from "react";
import { router } from "@inertiajs/react";

export default function EmptyCart() {
    return (
        <div className="py-32 text-center border-2 border-dashed border-slate-100 flex flex-col items-center">
            <p className="text-slate-400 uppercase tracking-widest font-bold text-sm mb-8">Your bag is empty.</p>
            <button 
                onClick={() => router.visit('/shop')}
                className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all"
            >
                Return to Shop
            </button>
        </div>
    );
}