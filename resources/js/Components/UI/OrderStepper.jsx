import React from "react";

const steps = [
    { id: 1, title: "01 Shopping Bag", sub: "Manage Your Items List" },
    { id: 2, title: "02 Shipping & Checkout", sub: "Enter Delivery Details" },
    { id: 3, title: "03 Confirmation", sub: "Review & Complete Order" },
];

export default function OrderStepper({ activeStep = 1 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {steps.map((step) => {
                const isActive = step.id <= activeStep;
                return (
                    <div
                        key={step.id}
                        className={`border-t-2 pt-6 transition-all duration-500 ${
                            isActive
                                ? "border-slate-900 opacity-100"
                                : "border-slate-100 opacity-40"
                        }`}
                    >
                        <span className="block text-[11px] font-black uppercase tracking-widest">
                            {step.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                            {step.sub}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}