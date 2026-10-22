import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { CheckCircle, X } from "lucide-react";

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        // Use flash_id to detect unique events even if the message text is the same
        if (flash.success) {
            // 1. Force immediate reset
            setShow(false);
            setProgress(100);

            // 2. Trigger animation after a tiny delay so React detects the change
            const timeout = setTimeout(() => {
                setMessage(flash.success);
                setShow(true);
            }, 50);

            // 3. Progress bar visual burn-down (4 seconds)
            const progressTimer = setInterval(() => {
                setProgress((prev) => Math.max(0, prev - 100 / 400));
            }, 10);

            // 4. Auto-hide
            const hideTimer = setTimeout(() => {
                setShow(false);
                clearInterval(progressTimer);
            }, 4000);

            return () => {
                clearTimeout(timeout);
                clearTimeout(hideTimer);
                clearInterval(progressTimer);
            };
        }
    }, [flash.success, flash.flash_id]); // CRITICAL: flash_id forces re-run on every click

    if (!message) return null;

    return (
        <div
            className={`fixed top-8 right-8 z-[9999] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform 
            ${show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none"}`}
        >
            <div className="relative group overflow-hidden bg-black text-white pl-1 pr-6 py-5 rounded-2xl shadow-[0_25px_80px_-12px_rgba(255,45,85,0.2)] border border-white/10 backdrop-blur-2xl min-w-[340px]">
                {/* Flux Pink Kinetic Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 shadow-[0_0_20px_rgba(255,45,85,0.6)]" />

                <div className="flex items-center gap-5 ml-5">
                    {/* Icon Container */}
                    <div className="flex-shrink-0 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                        <CheckCircle className="text-rose-500" size={20} />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-rose-500 font-black mb-1">
                            System Update
                        </span>
                        <p className="text-sm font-bold tracking-tight text-white leading-tight">
                            {message}
                        </p>
                    </div>

                    <button
                        onClick={() => setShow(false)}
                        className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Flux Pink Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
                    <div
                        className="h-full bg-rose-500 shadow-[0_0_10px_rgba(255,45,85,0.8)] transition-all duration-[10ms] ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
