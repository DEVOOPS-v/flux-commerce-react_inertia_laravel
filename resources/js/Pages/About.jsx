import React, { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import AuthModal from "@/Components/UI/AuthModal";
import WelcomeUserModal from "@/Components/UI/WelcomeUserModal";
import AOS from "aos";
import "aos/dist/aos.css";
import { MoveRight, ArrowUpRight } from "lucide-react";

const About = () => {
    const { auth, flash } = usePage().props;
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        if (flash?.new_user) setShowWelcomeModal(true);
        AOS.init({ duration: 1200, once: true, easing: "ease-in-out" });
    }, [flash]);

    const timeline = [
        {
            year: "1999",
            event: "Genesis",
            desc: "Core concepts of modular design and digital synthesis established.",
        },
        {
            year: "2007",
            event: "Framework Launch",
            desc: "The RILT stack architecture is perfected for the modern web.",
        },
        {
            year: "2012",
            event: "Monolith to Micro",
            desc: "Transitioning into scalable, streetwear-inspired interfaces.",
        },
        {
            year: "2020",
            event: "Sustainable Code",
            desc: "Introduction of eco-conscious development practices and textures.",
        },
        {
            year: "PRESENT",
            event: "FLUX Ecosystem",
            desc: "Continuing to redefine the boundaries of tech and apparel.",
        },
    ];

    return (
        <GuestLayout>
            <Head title="KNOW FLUX | About" />
            <div className="bg-white text-slate-950 selection:bg-pink-200 overflow-x-hidden">
                {/* --- 01. THE HERO (MASSIVE TYPOGRAPHY) --- */}
                <section className="relative pt-40 pb-20">
                    <div className="container mx-auto px-6">
                        <div className="relative z-10">
                            <h1
                                className="text-[14vw] font-black tracking-tighter leading-[0.8] uppercase mb-0 select-none"
                                data-aos="fade-down"
                            >
                                KNOW FLUX
                                <span className="text-pink-600">.</span>
                            </h1>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-0 items-start -mt-10 lg:-mt-20">
                            {/* The Designer Collage Wrap */}
                            <div
                                className="relative w-full lg:w-[60%] z-20"
                                data-aos="zoom-out-up"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974"
                                    alt="Main Profile"
                                    className="w-full h-[700px] object-cover grayscale brightness-90 shadow-2xl"
                                />
                                {/* Floating Top-Left Detail Image */}
                                <div
                                    className="absolute -top-12 -left-8 w-48 h-60 hidden xl:block shadow-2xl overflow-hidden"
                                    data-aos="fade-right"
                                    data-aos-delay="400"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1618354691373-d851c5c3a991?q=80&w=1915"
                                        className="w-full h-full object-cover grayscale"
                                        alt="texture"
                                    />
                                </div>
                            </div>

                            <div
                                className="lg:w-[40%] lg:pl-20 pt-20 relative z-10"
                                data-aos="fade-left"
                            >
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-4 border-slate-950 pb-2 inline-block">
                                    Passion Beyond Borders
                                </h3>
                                <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-md">
                                    Inspired by the meticulous complexity of
                                    information technology and the fluid
                                    rebellion of street style, FLUX is the
                                    intersection of architecture and identity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 02. ASYMMETRIC IDENTITY SECTION --- */}
                <section className="py-32 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-end gap-12">
                            <div
                                className="w-full md:w-1/2 relative"
                                data-aos="fade-up"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1974"
                                    className="w-full h-[400px] object-cover grayscale"
                                    alt="Sub detail"
                                />
                                <div
                                    className="absolute -bottom-10 -right-10 w-64 h-80 bg-white p-4 shadow-xl hidden lg:block"
                                    data-aos="fade-up"
                                    data-aos-delay="200"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1596455607563-ad6193f76b17?q=80&w=1974"
                                        className="w-full h-full object-cover grayscale"
                                        alt="Small detail"
                                    />
                                </div>
                            </div>
                            <div
                                className="w-full md:w-1/2 mb-10"
                                data-aos="fade-left"
                            >
                                <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                                    FLUX IS <br />
                                    <span className="text-pink-600">
                                        JUNG WOOK JUN
                                    </span>
                                </h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
                                    Creative Director
                                </p>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    A visionary approach to modern dressing. By
                                    deconstructing traditional silhouettes and
                                    rebuilding them through a digital lens, we
                                    create the uniform for the modern pioneer.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 03. THE JOURNEY (EDITORIAL TIMELINE) --- */}
                <section className="py-40 bg-white">
                    <div className="container mx-auto px-6">
                        <h2
                            className="text-center text-5xl font-black uppercase tracking-[0.2em] mb-32"
                            data-aos="fade-up"
                        >
                            Our Journey
                        </h2>

                        <div className="max-w-6xl mx-auto relative">
                            {/* Large Background Ghost Image (Exact Juun.J detail) */}
                            <div
                                className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-[0.08]"
                                data-aos="fade-in"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920"
                                    alt="Editorial Look"
                                    className="w-full h-[750px] object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>

                            <div className="divide-y divide-slate-200 border-t border-slate-200">
                                {timeline.map((item, index) => (
                                    <div
                                        key={index}
                                        className="group flex flex-col md:flex-row items-center py-12 px-6 transition-all duration-500 hover:bg-slate-950 hover:text-white"
                                        data-aos="fade-up"
                                    >
                                        <div className="w-full md:w-1/5 text-4xl font-black tracking-tighter mb-4 md:mb-0">
                                            {item.year}
                                        </div>
                                        <div className="w-full md:w-1/5 relative hidden md:block">
                                            {/* Hover Image Reveal Logic */}
                                            <img
                                                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070"
                                                className="w-16 h-16 rounded-full object-cover grayscale opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                alt="preview"
                                            />
                                        </div>
                                        <div className="w-full md:w-2/5 text-lg font-bold uppercase tracking-widest text-slate-400 group-hover:text-pink-500">
                                            {item.event}
                                        </div>
                                        <div className="w-full md:w-1/5 text-sm leading-relaxed italic text-slate-400 group-hover:text-slate-300">
                                            {item.desc}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 04. CALL TO ACTION --- */}
                <section className="py-60 bg-white border-t border-slate-100">
                    <div className="container mx-auto px-6 text-center">
                        <Link
                            href="/shop"
                            className="group relative inline-block"
                            data-aos="zoom-in"
                        >
                            <div className="flex items-center gap-8">
                                <span className="text-7xl md:text-[10vw] font-black uppercase tracking-tighter leading-none transition-transform duration-700 group-hover:-translate-x-4">
                                    Claim Your Style
                                </span>
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-slate-950 flex items-center justify-center group-hover:bg-pink-600 group-hover:border-pink-600 group-hover:text-white transition-all duration-500">
                                    <ArrowUpRight className="w-10 h-10 md:w-16 md:h-16" />
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-0 w-0 h-2 bg-pink-600 transition-all duration-700 group-hover:w-full" />
                        </Link>
                    </div>
                </section>

                {/* Modals Shared Logic */}
                <AuthModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
                <WelcomeUserModal
                    isOpen={showWelcomeModal}
                    onClose={() => setShowWelcomeModal(false)}
                    userName={auth.user?.name}
                />
            </div>
        </GuestLayout>
    );
};

export default About;
