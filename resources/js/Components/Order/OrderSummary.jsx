import React from "react";

export default function OrderSummary({ order }) {
    return (
        <div className="bg-slate-950 p-8 text-white sticky top-32">
            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] mb-10 opacity-50 border-b border-white/10 pb-4">
                Order Summary
            </h3>

            <div className="space-y-6 mb-10">
                <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest opacity-60">
                    <span>Subtotal</span>
                    <span>₱{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase font-bold tracking-widest opacity-60">
                    <span>Shipping Fee</span>
                    <span>₱{order.shipping_fee.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            Total
                        </span>
                        <span className="text-3xl font-black tracking-tighter">
                            ₱{order.total.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-white/10">
                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">
                    Shipping Information
                </h4>
                <div className="space-y-2 text-sm">
                    <p>
                        <span className="opacity-60">Name:</span>{" "}
                        {order.ship_name}
                    </p>
                    <p>
                        <span className="opacity-60">Phone:</span>{" "}
                        {order.ship_phone}
                    </p>
                    <p>
                        <span className="opacity-60">Address:</span>{" "}
                        {order.ship_address}
                    </p>
                    <p>
                        <span className="opacity-60">City:</span>{" "}
                        {order.ship_city}
                    </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-60">
                        Payment Method
                    </p>
                    <p className="mt-1 font-medium">
                        {order.payment_method === "cod"
                            ? "Cash on Delivery"
                            : "Bank Transfer"}
                    </p>
                </div>
            </div>
        </div>
    );
}
