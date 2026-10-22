import React from "react";

export default function OrderItem({ item }) {
    return (
        <div className="flex gap-6 py-6">
            <div className="w-24 h-24 bg-slate-50 flex-shrink-0">
                <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1">
                <div className="flex justify-between">
                    <h3 className="font-black uppercase tracking-tight">
                        {item.product.name}
                    </h3>
                    <p className="font-bold">
                        ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    Qty: {item.quantity} × ₱{item.price.toLocaleString()}
                </p>
            </div>
        </div>
    );
}
