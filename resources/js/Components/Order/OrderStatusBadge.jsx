import React from "react";

export default function OrderStatusBadge({ status }) {
    const statusClasses = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        completed: "bg-green-100 text-green-800",
    };

    return (
        <span
            className={`px-4 py-2 text-[10px] font-black rounded-full uppercase ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}
        >
            {status}
        </span>
    );
}
