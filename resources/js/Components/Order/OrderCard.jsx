import React from "react";
import { Link } from "@inertiajs/react";

export default function OrderCard({ order }) {
    return (
        <div className="group bg-white border border-slate-100 hover:border-slate-300 transition-all duration-300">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Order #
                        </p>
                        <p className="text-xl font-black tracking-tight">
                            {order.order_number}
                        </p>
                    </div>
                    <span
                        className={`text-[10px] font-black px-3 py-1 rounded-full uppercase
                            ${order.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                            ${order.status === "paid" ? "bg-blue-100 text-blue-800" : ""}
                            ${order.status === "shipped" ? "bg-purple-100 text-purple-800" : ""}
                            ${order.status === "completed" ? "bg-green-100 text-green-800" : ""}
                        `}
                    >
                        {order.status}
                    </span>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date</span>
                        <span className="font-medium">
                            {new Date(order.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total</span>
                        <span className="font-bold">
                            ₱{order.total.toLocaleString()}
                        </span>
                    </div>
                </div>

                <Link
                    href={route("orders.show", order.id)}
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-pink-600 transition-colors"
                >
                    <span>View Details</span>
                    <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
