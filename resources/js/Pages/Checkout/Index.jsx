import React from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import GuestLayout from '@/Layouts/GuestLayout';
import { ArrowRight, Lock } from "lucide-react";
import OrderStepper from "@/Components/UI/OrderStepper";
import ShippingForm from "@/Components/Checkout/ShippingForm";
import PaymentMethods from "@/Components/Checkout/PaymentMethods";

export default function CheckoutIndex() {
    const { auth, cart, total, vatAmount, shippingCost, grandTotal } = usePage().props;

    // The useForm hook handles our state and validation errors perfectly.
    const { data, setData, post, processing, errors } = useForm({
        full_name: auth.user?.name || "",
        phone: "",
        address: "",
        city: "",
        postal_code: "",
        payment_method: "cod",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pointing to the storeCheckout method we refactored in the Controller
        post(route('cart.checkout.store'));
    };

    return (
        <GuestLayout auth={auth}>
            <Head title="Checkout | FLUX" />W

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                
                {/* Progress Stepper */}
                <div data-aos="fade-down">
                    <OrderStepper activeStep={2} />
                </div>

                {/* Header Section */}
                <header 
                    className="flex flex-col mb-16 border-b border-slate-100 pb-12"
                    data-aos="fade-up"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Lock size={12} className="text-pink-600" />
                        <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.6em]">
                            Secure Checkout
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.8]">
                        Shipping <br /> & Payment
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    
                    {/* Left Side: Forms */}
                    <div className="lg:col-span-8 space-y-24" data-aos="fade-right" data-aos-delay="100">
                        
                        <section>
                            <ShippingForm 
                                data={data} 
                                setData={setData} 
                                errors={errors} 
                            />
                        </section>

                        <section>
                            <PaymentMethods 
                                data={data} 
                                setData={setData} 
                            />
                        </section>

                    </div>

                    {/* Right Side: Sticky Order Summary */}
                    <aside className="lg:col-span-4 lg:sticky lg:top-32" data-aos="fade-left" data-aos-delay="200">
                        <div className="bg-slate-950 p-10 text-white shadow-2xl relative overflow-hidden">
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 rounded-full -mr-16 -mt-16 blur-3xl" />

                            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-10 opacity-50 border-b border-white/10 pb-4">
                                Order Summary
                            </h3>
                            
                            {/* Product Mini-List with Custom Scrollbar */}
                            <div className="space-y-6 mb-10 max-h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start gap-4 text-[11px] font-bold uppercase tracking-widest">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white line-clamp-1">{item.product.name}</span>
                                            <span className="text-white/40">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="whitespace-nowrap">₱{Number(item.subtotal).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals Breakdown */}
                            <div className="space-y-4 mb-10 pt-6 border-t border-white/10">
                                <div className="flex justify-between text-[11px] uppercase font-bold text-white/50">
                                    <span>Subtotal</span>
                                    <span>₱{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase font-bold text-white/50">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? 'text-green-400' : ''}>
                                        {shippingCost === 0 ? 'FREE' : `₱${shippingCost.toLocaleString()}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase font-bold text-white/50">
                                    <span>VAT (12%)</span>
                                    <span>₱{vatAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Grand Total */}
                            <div className="flex justify-between items-end mb-10 pt-6 border-t-2 border-white">
                                <span className="text-[10px] font-black uppercase tracking-widest">Grand Total</span>
                                <span className="text-5xl font-black tracking-tighter">
                                    ₱{grandTotal.toLocaleString()}
                                </span>
                            </div>

                            {/* Action Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-pink-600 text-white py-6 font-black uppercase text-[12px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:text-slate-950 transition-all duration-500 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Processing Order..." : "Confirm & Pay"}
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                            </button>

                            <p className="mt-6 text-[9px] text-center uppercase tracking-widest text-white/30 font-bold">
                                By clicking place order, you agree to our terms of service
                            </p>
                        </div>
                    </aside>
                </form>
            </div>
        </GuestLayout>
    );
}