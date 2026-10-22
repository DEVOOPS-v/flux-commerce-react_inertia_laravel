import React from "react";

const STEPS = ["pending", "paid", "shipped", "completed"];

export default function OrderProgress({ status }) {
    const currentStep = STEPS.indexOf(status);

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between">
                {STEPS.map((step, idx) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                                    ${
                                        idx <= currentStep
                                            ? "bg-slate-950 text-white"
                                            : "bg-slate-100 text-slate-400"
                                    }`}
                            >
                                {idx + 1}
                            </div>
                            <span className="text-[8px] uppercase font-black mt-2 tracking-wider">
                                {step}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div
                                className={`flex-1 h-px
                                    ${idx < currentStep ? "bg-slate-950" : "bg-slate-200"}
                                `}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
