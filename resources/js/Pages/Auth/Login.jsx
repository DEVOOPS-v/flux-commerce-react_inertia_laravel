import React, { useState, useEffect } from 'react';
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ canResetPassword, status }) {
    // Animation state
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
        // The Logic: Grabbing the intended destination from the URL
        redirect: new URLSearchParams(window.location.search).get('redirect') || '',
    });

    const submit = (e) => {
        e.preventDefault();
        // The "Pro-Tip" Logic: Passing the redirect data to the backend during POST
        post(route("login"), {
            data: {
                ...data,
                // Ensures the backend receives the redirect path
                redirect: data.redirect 
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="min-h-screen bg-white text-slate-900 selection:bg-pink-600 selection:text-white font-poppins overflow-x-hidden relative">
                {/* Background Glow */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-600 blur-[180px] rounded-full opacity-10 pointer-events-none z-0"></div>

                <main className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12 px-6">
                    <div
                        className={`w-full max-w-md transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                    >
                        <h1 className="text-4xl font-black tracking-tighter mb-2 text-center text-slate-900 uppercase">
                            Welcome Back
                        </h1>
                        <p className="text-slate-500 text-center mb-10 font-medium">
                            Enter your credentials to access your FLUX account.
                        </p>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-pink-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email Address"
                                    className="text-slate-500 uppercase text-[10px] font-bold tracking-widest ml-1 mb-2"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full bg-slate-50 border-slate-200 text-slate-900 focus:border-pink-600 focus:ring-pink-600 rounded-xl py-3"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-red-500 text-xs" />
                            </div>

                            <div className="mt-4">
                                <div className="flex justify-between items-center ml-1 mb-2">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="text-slate-500 uppercase text-[10px] font-bold tracking-widest"
                                    />
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-[10px] uppercase font-bold tracking-widest text-pink-600 hover:text-black transition-colors"
                                        >
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full bg-slate-50 border-slate-200 text-slate-900 focus:border-pink-600 focus:ring-pink-600 rounded-xl py-3"
                                    autoComplete="current-password"
                                    onChange={(e) => setData("password", e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-red-500 text-xs" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                        className="bg-slate-50 border-slate-300 text-pink-600 focus:ring-pink-600"
                                    />
                                    <span className="ms-2 text-xs text-slate-500 font-bold group-hover:text-slate-900 transition-colors uppercase tracking-tighter">
                                        Keep me logged in
                                    </span>
                                </label>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className={`w-full bg-pink-600 hover:bg-black text-white font-bold py-4 rounded-full transition-all duration-300 shadow-lg shadow-pink-100 active:scale-[0.98] uppercase tracking-widest text-sm ${
                                        processing && 'opacity-25'
                                    }`}
                                    disabled={processing}
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-xs text-slate-400 uppercase font-bold tracking-widest">
                            New to Flux?
                            <Link
                                href={route('register', { redirect: data.redirect })}
                                className="text-pink-600 hover:text-black transition-colors ml-1 font-black"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}