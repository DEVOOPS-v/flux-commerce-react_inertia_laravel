import React from "react";
import { MapPin } from "lucide-react";

export default function ShippingForm({ data, setData, errors }) {
    return (
        <section>
            <div className="flex items-center gap-4 mb-10">
                <MapPin size={20} className="text-slate-900" />
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    Shipping Information
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                {/* Full Name */}
                <div className="md:col-span-2 space-y-1">
                    <label htmlFor="full_name" className="text-[10px] tracking-[0.3em] uppercase opacity-50 block">
                        Receiver Full Name
                    </label>
                    <input
                        id="full_name"
                        type="text"
                        value={data.full_name}
                        onChange={(e) => setData("full_name", e.target.value)}
                        className="w-full border-t-0 border-x-0 border-b-2 border-slate-200 py-3 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 px-0"
                        placeholder="e.g. ALEXANDER MCQUEEN"
                    />
                    {errors.full_name && (
                        <div className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.full_name}</div>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                    <label htmlFor="phone" className="text-[10px] tracking-[0.3em] uppercase opacity-50 block">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        className="w-full border-t-0 border-x-0 border-b-2 border-slate-200 py-3 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 px-0"
                        placeholder="+63 --- --- ----"
                    />
                    {errors.phone && (
                        <div className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.phone}</div>
                    )}
                </div>

                {/* Postal Code */}
                <div className="space-y-1">
                    <label htmlFor="postal_code" className="text-[10px] tracking-[0.3em] uppercase opacity-50 block">
                        Postal Code
                    </label>
                    <input
                        id="postal_code"
                        type="text"
                        value={data.postal_code}
                        onChange={(e) => setData("postal_code", e.target.value)}
                        className="w-full border-t-0 border-x-0 border-b-2 border-slate-200 py-3 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 px-0"
                    />
                </div>

                {/* Complete Address */}
                <div className="md:col-span-2 space-y-1">
                    <label htmlFor="address" className="text-[10px] tracking-[0.3em] uppercase opacity-50 block">
                        Street Address / House No.
                    </label>
                    <input
                        id="address"
                        type="text"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        className="w-full border-t-0 border-x-0 border-b-2 border-slate-200 py-3 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 px-0"
                        placeholder="FLAT, STREET, DISTRICT"
                    />
                    {errors.address && (
                        <div className="text-red-500 text-[10px] font-bold uppercase mt-2">{errors.address}</div>
                    )}
                </div>

                {/* City */}
                <div className="md:col-span-2 space-y-1">
                    <label htmlFor="city" className="text-[10px] tracking-[0.3em] uppercase opacity-50 block">
                        City / Province
                    </label>
                    <input
                        id="city"
                        type="text"
                        value={data.city}
                        onChange={(e) => setData("city", e.target.value)}
                        className="w-full border-t-0 border-x-0 border-b-2 border-slate-200 py-3 focus:border-slate-900 outline-none transition-all font-bold text-slate-900 px-0"
                    />
                </div>
            </div>
        </section>
    );
}