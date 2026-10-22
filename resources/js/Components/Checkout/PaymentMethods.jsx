import React from "react";
import { CreditCard, Banknote } from "lucide-react";

export default function PaymentMethods({ data, setData }) {
    const methods = [
        {
            id: "cod",
            title: "Cash on Delivery",
            description: "Pay upon arrival",
            icon: <Banknote size={20} />,
        },
        {
            id: "bank",
            title: "Bank Transfer",
            description: "Manual verification",
            icon: <CreditCard size={20} />,
        },
    ];

    return (
        <section>
            <div className="flex items-center gap-4 mb-8">
                <CreditCard size={20} className="text-slate-900" />
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    Payment Method
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {methods.map((method) => (
                    <button
                        key={method.id}
                        type="button"
                        onClick={() => setData("payment_method", method.id)}
                        className={`group relative p-8 border-2 text-left transition-all duration-500 ${
                            data.payment_method === method.id
                                ? "border-slate-950 bg-slate-950 text-white"
                                : "border-slate-100 hover:border-slate-300 bg-white text-slate-900"
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div
                                className={`${
                                    data.payment_method === method.id ? "text-pink-500" : "text-slate-400"
                                }`}
                            >
                                {method.icon}
                            </div>
                            {data.payment_method === method.id && (
                                <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                            )}
                        </div>

                        <span className="block font-black uppercase text-sm tracking-widest mb-1">
                            {method.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                            {method.description}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}