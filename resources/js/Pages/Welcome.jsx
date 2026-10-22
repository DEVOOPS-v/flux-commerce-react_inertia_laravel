import React, { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import HeroSection from "@/Components/Landing/HeroSection";
import AuthModal from "@/Components/UI/AuthModal";
import WelcomeUserModal from "@/Components/UI/WelcomeUserModal"; // Added Import
import ProductCard from "@/Components/UI/ProductCard";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    ArrowRight,
    ChevronRight,
    Truck,
    ShieldCheck,
    RefreshCw,
} from "lucide-react";

const Welcome = () => {
    // Access auth and flash from our middleware
    const { auth, flash } = usePage().props;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false); // Added State

    // Logic: Check if user has specific Spatie roles
    const isMember = auth.user?.roles.includes("user");
    const isAdmin = auth.user?.roles.includes("admin");

    useEffect(() => {
        // Trigger the Welcome Modal if the flash message 'new_user' exists
        if (flash?.new_user) {
            setShowWelcomeModal(true);
        }

        AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    }, [flash]); // Added flash to dependency array

    const handleBuyAction = (e) => {
        if (!auth.user) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <GuestLayout>
            <Head title="Welcome | FLUX" />
            <div className="overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
                <HeroSection onBuyAction={handleBuyAction} />

                {/* --- CATEGORY SECTION --- */}
                <section className="category-section py-24 bg-white font-poppins">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20" data-aos="fade-up">
                            <span className="text-pink-600 font-bold tracking-widest text-xs uppercase">
                                {isMember
                                    ? "Your Personalized Picks"
                                    : "Curated Collections"}
                            </span>
                            <h2 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter uppercase">
                                The Directory
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Hoodies & Sweatshirts",
                                    img: "/images/product_4.jpg",
                                    delay: "0",
                                    sub: "Essential Comfort",
                                },
                                {
                                    title: "Casual Shirts",
                                    img: "/images/product_2.jpg",
                                    delay: "100",
                                    sub: "Urban Basics",
                                },
                                {
                                    title: "Long Sleeve Tees",
                                    img: "/images/product_1.jpg",
                                    delay: "200",
                                    sub: "Performance Layer",
                                },
                            ].map((cat, index) => (
                                <div
                                    key={index}
                                    className="category-item group relative h-[500px] overflow-hidden rounded-2xl cursor-pointer"
                                    data-aos="fade-up"
                                    data-aos-delay={cat.delay}
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.title}
                                        className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-90"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-8">
                                        <p className="text-pink-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                                            {cat.sub}
                                        </p>
                                        <h3 className="text-2xl font-black text-white mb-6 leading-tight">
                                            {cat.title}
                                        </h3>
                                        <Link
                                            href={route("shop.index")}
                                            className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest group/btn"
                                        >
                                            Explore{" "}
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative py-32 px-6 overflow-hidden bg-pink-600">
                    <div
                        className="max-w-4xl mx-auto text-center relative z-10"
                        data-aos="fade-up"
                    >
                        <h2 className="text-white text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 uppercase">
                            {isMember
                                ? `Ready for more, ${auth.user.name.split(" ")[0]}?`
                                : "Step Into Your Style"}
                        </h2>
                        <Link
                            onClick={handleBuyAction}
                            href="/products"
                            className="inline-flex items-center gap-3 bg-white text-pink-600 px-12 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all duration-500 shadow-2xl"
                        >
                            Shop Now <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                {/* --- TRENDING PRODUCTS --- */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div
                            className="flex flex-col md:flex-row justify-between items-end mb-16"
                            data-aos="fade-up"
                        >
                            <div>
                                <p className="text-pink-600 font-bold tracking-widest uppercase text-xs mb-3">
                                    Top Picks
                                </p>
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
                                    Trending Now
                                </h2>
                            </div>
                            <Link
                                href={route("shop.index")}
                                className="group text-slate-950 font-black text-sm tracking-widest uppercase border-b-2 border-pink-600 pb-2 hover:text-pink-600 transition-colors flex items-center gap-2"
                            >
                                Full Collection{" "}
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {[1, 2, 3, 4].map((i) => (
                                <ProductCard
                                    key={i}
                                    id={i}
                                    delay={i * 100}
                                    onBuyAction={handleBuyAction}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modals */}
                <AuthModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />

                {/* Added WelcomeUserModal */}
                <WelcomeUserModal
                    isOpen={showWelcomeModal}
                    onClose={() => setShowWelcomeModal(false)}
                    userName={auth.user?.name}
                />

                {/* --- PROMISE SECTION --- */}
                <section className="py-20 border-y border-gray-100 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: <Truck className="w-6 h-6" />,
                                    title: "Swift Delivery",
                                    desc: "Premium logistics ensuring your gear arrives within 48 hours.",
                                },
                                {
                                    icon: <ShieldCheck className="w-6 h-6" />,
                                    title: "Flux Secure",
                                    desc: "100% genuine products directly from authorized brand houses.",
                                },
                                {
                                    icon: <RefreshCw className="w-6 h-6" />,
                                    title: "Easy Swap",
                                    desc: "Simple 7-day return policy if your fit isn't quite right.",
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex gap-6 items-center"
                                    data-aos="fade-up"
                                    data-aos-delay={i * 200}
                                >
                                    <div className="w-14 h-14 flex-shrink-0 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center shadow-sm border border-pink-100 transition-colors hover:bg-pink-600 hover:text-white">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- NEWSLETTER --- */}
                <section className="py-24 bg-slate-950 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/10 blur-[150px] rounded-full"></div>
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="max-w-2xl mx-auto" data-aos="fade-up">
                            <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">
                                {isMember
                                    ? "Welcome to the Elite"
                                    : "Join The Flux VIP"}
                            </h2>
                            <p className="text-slate-400 mb-10 font-medium">
                                {isMember
                                    ? "You are currently receiving member-only drops and insights."
                                    : "Get early access to drops, exclusive discounts, and professional fashion insights."}
                            </p>
                            {!isMember && (
                                <form className="flex flex-col sm:flex-row gap-3 p-2 bg-white/5 rounded-[2rem] border border-white/10">
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="flex-1 bg-transparent border-none rounded-full px-8 py-4 text-white focus:ring-0 placeholder:text-slate-600"
                                    />
                                    <button
                                        type="button"
                                        className="bg-pink-600 text-white font-black px-10 py-4 rounded-full hover:bg-white hover:text-slate-950 transition duration-500 shadow-lg text-sm tracking-widest"
                                    >
                                        SUBSCRIBE
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </GuestLayout>
    );
};

export default Welcome;
