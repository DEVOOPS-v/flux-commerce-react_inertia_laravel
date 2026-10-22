import React from "react";
import { Link } from "@inertiajs/react";

export default function EmptyState() {
    return (
        <div className="py-20 text-center border-2 border-dashed border-slate-100">
            <p className="text-slate-400 uppercase tracking-widest font-bold text-sm mb-6">
                No orders placed yet.
            </p>
            <Link
                href="/shop"
                className="inline-block bg-slate-950 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-pink-600 transition"
            >
                Start Shopping
            </Link>
        </div>
    );
}
