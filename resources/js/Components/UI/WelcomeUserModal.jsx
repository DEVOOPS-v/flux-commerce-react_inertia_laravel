import React, { useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const WelcomeUserModal = ({ isOpen, onClose, userName }) => {
    // Trigger: Confetti effect when the modal opens
    useEffect(() => {
        if (!isOpen || typeof window === 'undefined') return;

        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 120 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);
            // Confetti from left and right
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval); // Cleanup interval on unmount or close
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div 
                className="bg-white relative z-10 w-full max-w-[500px] flex flex-col shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden rounded-sm"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal on inner click
            >
                <div className="p-12 relative text-center">
                    {/* Close Button */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-pink-600" />
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter mb-4 uppercase">
                        Welcome to the Elite, <br />
                        <span className="text-pink-600">{userName || 'Member'}</span>
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-10">
                        Your account has been successfully created. You now have access to member-exclusive pricing and early drops.
                    </p>

                    {/* Start Shopping Button */}
                    <button 
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-3 bg-slate-950 text-white py-5 px-8 font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-600 transition-all group"
                    >
                        Start Shopping <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeUserModal;
