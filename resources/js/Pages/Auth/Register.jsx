import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    // Animation state
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    // 1. Capture the redirect URL from the query string (e.g., ?redirect=/products)
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect') || '/dashboard';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        // 2. Add the redirect destination to the form data
        redirect: redirectUrl, 
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account" />

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
                            Join Flux
                        </h1>
                        <p className="text-slate-500 text-center mb-10 font-medium">
                            Create your account to start shopping our latest collections.
                        </p>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Hidden field to pass the redirect path to the backend */}
                            <input type="hidden" name="redirect" value={data.redirect} />

                            {/* Name Input */}
                            <div>
                                <InputLabel 
                                    htmlFor="name" 
                                    value="Full Name" 
                                    className="text-slate-500 uppercase text-[10px] font-bold tracking-widest ml-1 mb-2"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="block w-full bg-slate-50 border-slate-200 text-slate-900 focus:border-pink-600 focus:ring-pink-600 rounded-xl py-3"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2 text-red-500 text-xs" />
                            </div>

                            {/* Email Input */}
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
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2 text-red-500 text-xs" />
                            </div>

                            {/* Password Input */}
                            <div>
                                <InputLabel 
                                    htmlFor="password" 
                                    value="Password" 
                                    className="text-slate-500 uppercase text-[10px] font-bold tracking-widest ml-1 mb-2"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full bg-slate-50 border-slate-200 text-slate-900 focus:border-pink-600 focus:ring-pink-600 rounded-xl py-3"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2 text-red-500 text-xs" />
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                    className="text-slate-500 uppercase text-[10px] font-bold tracking-widest ml-1 mb-2"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="block w-full bg-slate-50 border-slate-200 text-slate-900 focus:border-pink-600 focus:ring-pink-600 rounded-xl py-3"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2 text-red-500 text-xs" />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className={`w-full bg-pink-600 hover:bg-black text-white font-bold py-4 rounded-full transition-all duration-300 shadow-lg shadow-pink-100 active:scale-[0.98] uppercase tracking-widest text-sm ${
                                        processing && 'opacity-25'
                                    }`}
                                    disabled={processing}
                                >
                                    Register Account
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-xs text-slate-400 uppercase font-bold tracking-widest">
                            Already have an account?
                            <Link
                                href={route('login')}
                                className="text-pink-600 hover:text-black transition-colors ml-1 font-black"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}