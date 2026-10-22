import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingOverlay({
    isVisible,
    message = "Processing...",
}) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-xl animate-in fade-in duration-500">
            {/* The main card: Uses a very subtle white gradient and thin border */}
            <div className="relative flex flex-col items-center gap-8 p-12">
                {/* Abstract Spinner Design */}
                <div className="relative">
                    {/* Inner spinning ring */}
                    <Loader2 className="w-10 h-10 text-slate-900 animate-spin stroke-[1.5px]" />

                    {/* Static outer thin ring for "FLUX" aesthetic */}
                    <div className="absolute inset-[-8px] rounded-full border border-slate-100 animate-pulse"></div>

                    {/* Pink accent glow - keeping it very subtle for the white theme */}
                    <div className="absolute inset-0 blur-2xl bg-pink-400/10 rounded-full"></div>
                </div>

                {/* Typography: High tracking, ultra-bold, clean slate color */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-900 animate-pulse">
                        {message}
                    </span>
                    {/* Sub-label for extra detail */}
                    <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400">
                        Flux Apparel Collective
                    </span>
                </div>
            </div>

            {/* Decorative minimalist progress bar at the very top (optional) */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-slate-50 overflow-hidden">
                <div className="w-1/3 h-full bg-pink-600 animate-[progress_1.5s_ease-in-out_infinite]"></div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(300%);
                    }
                }
            `}</style>
        </div>
    );
}
