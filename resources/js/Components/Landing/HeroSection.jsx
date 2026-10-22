import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react'; // Added usePage
import { Instagram, Facebook, Twitter, ShoppingBag, Star } from 'lucide-react';

const HeroSection = ({ onBuyAction }) => {
    const { auth } = usePage().props; // Access the roles/user data
    const [headerIndex, setHeaderIndex] = useState(0);
    const words = ["MOTION", "STYLE", "COMFORT", "YOU"];

    // Logic to check role
    const isMember = auth.user?.roles.includes('user');

    useEffect(() => {
        const interval = setInterval(() => {
            setHeaderIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero-section bg-white min-h-screen relative overflow-hidden font-poppins flex items-center">
            <div className="absolute right-0 top-0 w-[45vw] h-[45vw] bg-pink-50 rounded-full opacity-40 blur-[120px] z-0 transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute left-[-5%] bottom-[-5%] w-[30vw] h-[30vw] bg-blue-50 rounded-full opacity-30 blur-[100px] z-0"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-16 relative z-10">
                <div className="hero-content grid grid-cols-1 md:grid-cols-12 items-center relative gap-y-12 md:gap-x-8 lg:gap-x-16">
                    {/* Left Column (Socials) */}
                    <div className="hero-left-column col-span-12 md:col-span-1 order-1 z-20 flex flex-col items-center md:items-start" data-aos="fade-right" data-aos-delay="200">
                        <div className="social-icons hidden md:flex flex-col items-center space-y-6 after:content-[''] after:w-[1px] after:h-24 after:bg-gray-200 after:mt-6">
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-600 cursor-pointer transition-all" />
                            <Facebook className="w-5 h-5 text-gray-400 hover:text-pink-600 cursor-pointer transition-all" />
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-pink-600 cursor-pointer transition-all" />
                        </div>
                    </div>

                    {/* Center Column (Hero Image) */}
                    <div className="hero-image-column col-span-12 md:col-span-5 order-2 z-10 flex items-center justify-center relative" data-aos="fade-up" data-aos-delay="400">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-100 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img src="/images/hero_model.png" alt="Hero" className="relative w-full object-contain max-h-[75vh] md:max-h-[85vh] drop-shadow-2xl" />
                        </div>
                    </div>

                    {/* Right Column (Headline) */}
                    <div className="hero-right-column col-span-12 md:col-span-6 order-3 z-20 text-center md:text-left">
                        <p className="text-pink-600 font-bold tracking-[0.3em] uppercase text-xs mb-6" data-aos="fade-up" data-aos-delay="500">
                            {isMember ? `Welcome Back, ${auth.user.name.split(' ')[0]}` : "New Season Arrival"}
                        </p>
                        <h1 className="main-heading w-full text-6xl sm:text-7xl lg:text-8xl xl:text-[7.5rem] font-black text-slate-900 leading-[0.9] tracking-tighter mb-8" data-aos="fade-up" data-aos-delay="600">
                            BUILT FOR<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-[#ED1D6C]">
                                {words[headerIndex]}
                            </span>
                        </h1>
                        <p className="description-text text-base md:text-lg text-slate-500 leading-relaxed max-w-lg mx-auto md:mx-0 mb-10" data-aos="fade-up" data-aos-delay="800">
                            {isMember 
                                ? "Your exclusive member access is active. Explore the latest drops designed with aesthetic precision and premium comfort."
                                : "Experience premium comfort and unmatched style. Our collection is designed for those who move with purpose and aesthetic precision."
                            }
                        </p>

                        <div className="stats flex flex-wrap justify-center md:justify-start gap-12 mb-12" data-aos="fade-up" data-aos-delay="1000">
                            <div className="stat-item">
                                <span className="block text-3xl font-black text-slate-900">95%</span>
                                <span className="block text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">Performance Grade</span>
                            </div>
                            <div className="stat-item border-l border-gray-100 pl-12">
                                <span className="block text-3xl font-black text-slate-900">
                                    {isMember ? <Star className="inline w-7 h-7 text-pink-600 mb-1" /> : "12K+"}
                                </span>
                                <span className="block text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">
                                    {isMember ? "Elite Status" : "Flux Members"}
                                </span>
                            </div>
                        </div>

                        <div className="hero-buttons flex flex-wrap justify-center md:justify-start gap-4" data-aos="fade-up" data-aos-delay="1200">
                            <Link onClick={onBuyAction} href="/shop" className="bg-[#ED1D6C] text-white rounded-full px-10 py-4 text-sm font-black uppercase tracking-widest transition duration-300 hover:bg-slate-950 flex items-center gap-3 shadow-xl shadow-pink-200">
                                {isMember ? "Enter Shop" : "Shop Now"} <ShoppingBag className="w-4 h-4" />
                            </Link>
                            <Link href="/categories" className="bg-white text-slate-900 border-2 border-slate-100 rounded-full px-10 py-4 text-sm font-black uppercase tracking-widest transition duration-300 hover:border-pink-600 hover:text-pink-600">
                                Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;