import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { Eye, ReceiptText } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// UI Components
import FlashMessage from "@/Components/Admin/UI/FlashMessage";
import Pagination from "@/Components/Admin/UI/Pagination";

export default function Index({ orders }) {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const statusColors = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
        paid: "bg-blue-50 text-blue-700 border-blue-100",
        shipped: "bg-purple-50 text-purple-700 border-purple-100",
        completed: "bg-green-50 text-green-700 border-green-100",
    };

    return (
        <AdminLayout>
            <Head title="Order Management" />

            <FlashMessage />

            {/* Header Section - Product Design Style */}
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                data-aos="fade-up"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Order Registry
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Track customer transactions, fulfillment status, and
                        revenue.
                    </p>
                </div>
            </div>

            {/* Main Table Container - Glassmorphism Design */}
            <div
                className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                data-aos="fade-up"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-gray-50/50">
                                {[
                                    "Order Details",
                                    "Customer",
                                    "Date",
                                    "Total",
                                    "Status",
                                    "Actions",
                                ].map((head) => (
                                    <th
                                        key={head}
                                        className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders?.data?.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50/50 transition-colors group"
                                    data-aos="fade-up"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-100">
                                                <ReceiptText
                                                    size={20}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">
                                                    #{order.order_number}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    ID: {order.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.user?.name || "Guest Customer"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(
                                            order.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        ₱
                                        {parseFloat(
                                            order.total,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status] || "bg-gray-50 text-gray-600 border-gray-100"}`}
                                        >
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={route(
                                                "admin.orders.show",
                                                order.id,
                                            )}
                                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all inline-block"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center">
                    <Pagination links={orders.links} />
                </div>
            </div>
        </AdminLayout>
    );
}
