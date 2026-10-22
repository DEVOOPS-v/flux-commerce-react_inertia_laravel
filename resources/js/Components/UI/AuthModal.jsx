import React from 'react';
import { Link } from '@inertiajs/react';
import { X, Lock, ArrowRight } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Capture the current URL so we can tell Laravel where to send the user back to
    // This ensures after login they return to the exact spot they clicked "Buy"
    const returnUrl = window.location.pathname;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white relative z-10 w-full max-w-[800px] flex flex-col md:flex-row shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden" data-aos="zoom-in" data-aos-duration="300">
                {/* Visual Side */}
                <div className="md:w-5/12 bg-slate-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 blur-3xl rounded-full"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black tracking-tighter leading-none mb-6 italic">FLUX<br/>ELITE.</h2>
                        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold">Member Exclusive</p>
                    </div>
                    <div className="relative z-10 border-l-2 border-pink-600 pl-6 py-2">
                        <p className="text-sm text-slate-300 italic">"Style is a way to say who you are without having to speak."</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-7/12 bg-white p-12 relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                    <div className="flex flex-col h-full justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4 text-pink-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security Gate</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-950 tracking-tighter mb-4 uppercase">Member Access</h3>
                        <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                            Join the Flux movement. You need an account to purchase limited drops and access your member dashboard.
                        </p>
                        <div className="flex flex-col gap-3">
                            {/* We pass the intended URL as a query parameter */}
                            <Link 
                                href={route('login', { redirect: returnUrl })} 
                                className="flex items-center justify-center gap-3 bg-slate-950 text-white py-5 px-8 font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-600 transition-all group"
                            >
                                Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link 
                                href={route('register', { redirect: returnUrl })} 
                                className="flex items-center justify-center gap-3 bg-white text-slate-950 border border-slate-200 py-5 px-8 font-black text-xs uppercase tracking-[0.2em] hover:border-slate-950 transition-all"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;