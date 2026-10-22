import React from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import OrderStatusBadge from "@/Components/Order/OrderStatusBadge";
import OrderProgress from "@/Components/Order/OrderProgress";
import OrderItem from "@/Components/Order/OrderItem";
import OrderSummary from "@/Components/Order/OrderSummary";

export default function Show({ order }) {
    return (
        <GuestLayout>
            <Head title={`Order #${order.order_number} | FLUX`} />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                {/* Back button */}
                <div className="mb-8">
                    <Link
                        href={route("orders.index")}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pink-600 transition"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Orders
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left column – Items */}
                    <div className="lg:col-span-8">
                        <div className="border-b border-slate-100 pb-6 mb-8">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Order #
                                    </p>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                                        {order.order_number}
                                    </h1>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Placed on{" "}
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <OrderStatusBadge status={order.status} />
                            </div>
                        </div>

                        <OrderProgress status={order.status} />

                        <div className="space-y-6">
                            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400">
                                Items in this order
                            </h2>
                            <div className="divide-y divide-slate-100">
                                {order.items.map((item) => (
                                    <OrderItem key={item.id} item={item} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column – Summary & Shipping */}
                    <div className="lg:col-span-4">
                        <OrderSummary order={order} />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
