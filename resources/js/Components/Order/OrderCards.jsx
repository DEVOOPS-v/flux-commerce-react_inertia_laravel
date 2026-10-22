import React from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronRight,
    Package,
    Clock,
    CheckCircle,
    Truck,
    Zap,
    Calendar,
} from "lucide-react";

export default function OrderCard({ order, delay }) {
    // 1. Defensive Image Handler
    const getProductImage = (item) => {
        const imagePath = item?.product?.image;
        if (!imagePath) return "https://placehold.co/400x500?text=FLUX+GEAR";
        return imagePath.startsWith("http")
            ? imagePath
            : `/storage/${imagePath}`;
    };

    // 2. Safe Currency Formatter (Prevents NaN)
    const formattedTotal = React.useMemo(() => {
        const amount = parseFloat(order?.total_amount);
        return isNaN(amount)
            ? "0.00"
            : amount.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              });
    }, [order?.total_amount]);

    // 3. Safe Date Formatter
    const formattedDate = React.useMemo(() => {
        const date = new Date(order?.created_at);
        return isNaN(date.getTime())
            ? "PENDING"
            : date
                  .toLocaleDateString("en-PH", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                  })
                  .toUpperCase();
    }, [order?.created_at]);

    const statusConfig = {
        pending: {
            color: "text-amber-600",
            bg: "bg-amber-50/50",
            icon: <Clock size={12} />,
            border: "border-amber-100",
        },
        processing: {
            color: "text-blue-600",
            bg: "bg-blue-50/50",
            icon: <Package size={12} />,
            border: "border-blue-100",
        },
        shipped: {
            color: "text-purple-600",
            bg: "bg-purple-50/50",
            icon: <Truck size={12} />,
            border: "border-purple-100",
        },
        delivered: {
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
            icon: <CheckCircle size={12} />,
            border: "border-emerald-100",
        },
    };

    const currentStatus = order?.status?.toLowerCase() || "pending";
    const status = statusConfig[currentStatus] || statusConfig.pending;
    const firstItem = order?.items?.[0];

    return (
        <div
            data-aos="fade-up"
            data-aos-delay={delay}
            className="group relative bg-white border border-slate-100 hover:border-slate-900 rounded-[2rem] transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50"
        >
            <div className="relative flex flex-col lg:grid lg:grid-cols-12 items-center p-6 lg:px-10 lg:py-8 gap-6">
                {/* ID & PRODUCT PREVIEW */}
                <div className="w-full lg:col-span-5 flex items-center gap-6">
                    <div className="relative w-20 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                        <img
                            src={getProductImage(firstItem)}
                            alt="Product preview"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-slate-900 text-[8px] font-black text-white rounded-md tracking-[0.2em]">
                                ID: {order?.id || "0000"}
                            </span>
                            <Zap
                                size={10}
                                className="text-pink-500 fill-pink-500"
                            />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase text-base tracking-tighter leading-tight">
                            {firstItem?.product?.name || "Processing Order..."}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                            {order?.items?.length || 0} ITEMS IN SHIPMENT
                        </p>
                    </div>
                </div>

                {/* DATE */}
                <div className="w-full lg:col-span-2 lg:text-center border-t lg:border-none pt-4 lg:pt-0">
                    <div className="flex items-center lg:justify-center gap-2 mb-1">
                        <Calendar size={10} className="text-slate-300" />
                        <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">
                            Log Date
                        </span>
                    </div>
                    <span className="text-xs font-bold text-slate-600 font-mono italic">
                        {formattedDate}
                    </span>
                </div>

                {/* STATUS */}
                <div className="w-full lg:col-span-2 flex lg:justify-center">
                    <div
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm ${status.bg} ${status.color} ${status.border}`}
                    >
                        {status.icon}
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                            {order?.status || "PENDING"}
                        </span>
                    </div>
                </div>

                {/* AMOUNT */}
                <div className="w-full lg:col-span-3 flex items-center justify-between lg:justify-end gap-6">
                    <div className="text-right">
                        <span className="hidden lg:block text-[9px] font-black uppercase text-slate-300 tracking-widest mb-1">
                            Total Statement
                        </span>
                        <span className="text-2xl font-black text-slate-950 tracking-tighter">
                            ₱{formattedTotal}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route("orders.show", order?.id)}
                            className="hidden xl:flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors group/link"
                        >
                            <span>Details</span>
                            <div className="w-4 group-hover/link:w-8 h-[1px] bg-slate-300 group-hover/link:bg-slate-900 transition-all" />
                        </Link>

                        <Link
                            href={route("orders.show", order?.id)}
                            className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
