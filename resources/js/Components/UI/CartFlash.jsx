import React, { useEffect, useState } from 'react';
import { ShoppingBag, Heart, X } from 'lucide-react';

// Added 'type' prop to handle different icons (cart vs fav)
export default function CartFlash({ message, isOpen, onClose, type = 'cart' }) {
    const [progress, setProgress] = useState(100);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsExiting(false);
            setProgress(100);
            
            // Progress Bar Logic
            const interval = setInterval(() => {
                setProgress((prev) => Math.max(0, prev - (100 / 40))); // 40 steps over 2s
            }, 50);

            // Start Exit Animation 300ms before closing
            const exitTimer = setTimeout(() => setIsExiting(true), 1700);

            // Final Close
            const closeTimer = setTimeout(() => {
                onClose();
            }, 2000);

            return () => {
                clearInterval(interval);
                clearTimeout(exitTimer);
                clearTimeout(closeTimer);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Determine which icon to show
    const Icon = type === 'fav' ? Heart : ShoppingBag;

    return (
        <div 
            className={`fixed top-24 right-6 z-[100] transition-all duration-500 ease-in-out
                ${isExiting ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}
        >
            <div className="relative group bg-slate-950 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[340px] rounded-sm overflow-hidden">
                
                {/* The Pink "Signature" Vertical Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]" />

                <div className="flex items-center gap-5 px-6 py-5">
                    {/* Dynamic Icon with soft glow */}
                    <div className="relative">
                        <Icon className="w-5 h-5 text-white relative z-10" />
                        <div className="absolute inset-0 bg-pink-600/20 blur-lg rounded-full" />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <span className="text-[9px] text-pink-500 font-black uppercase tracking-[0.4em] mb-1">
                            {type === 'fav' ? 'Wishlist Updated' : 'System Notification'}
                        </span>
                        <h4 className="text-[11px] font-bold text-white uppercase tracking-widest leading-none">
                            {message}
                        </h4>
                    </div>

                    <button 
                        onClick={() => { setIsExiting(true); setTimeout(onClose, 300); }}
                        className="group/close p-1 hover:rotate-90 transition-transform duration-300"
                    >
                        <X className="w-4 h-4 text-slate-500 group-hover/close:text-white" />
                    </button>
                </div>

                {/* Progress Track */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full">
                    <div 
                        className="h-full bg-gradient-to-r from-pink-600 to-pink-400 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(219,39,119,0.8)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Subtle Reflection Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
        </div>
    );
}