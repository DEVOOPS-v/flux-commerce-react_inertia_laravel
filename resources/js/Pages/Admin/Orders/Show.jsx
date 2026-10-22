import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    Activity,
} from "lucide-react";

export default function Show({ order }) {
    const { data, setData, put, processing } = useForm({
        status: order.status,
    });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: "ease-out-quart",
        });
    }, []);

    const updateStatus = (e) => {
        e.preventDefault();
        put(route("admin.orders.update-status", order.id), {
            preserveScroll: true,
        });
    };

    const statusOptions = ["pending", "paid", "shipped", "completed"];

    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number} | FLUX Admin`} />

            {/* Breadcrumb & Header */}
            <div className="mb-10" data-aos="fade-up">
                <Link
                    href={route("admin.orders.index")}
                    className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all mb-4 group"
                >
                    <ArrowLeft
                        size={12}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />
                    Return to Registry
                </Link>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
                    Order Details
                </h1>
                <p className="text-gray-500 mt-1 text-sm italic">
                    Managing transaction pipeline for Reference #
                    {order.order_number}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Items List */}
                <div
                    className="lg:col-span-2 bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-sm overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Package size={20} className="text-gray-900" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                Manifest
                            </h2>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {order.items.length} Position(s)
                        </span>
                    </div>

                    <div className="p-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Product
                                    </th>
                                    <th className="pb-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Qty
                                    </th>
                                    <th className="pb-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="group hover:bg-gray-50/30 transition-colors"
                                    >
                                        <td className="py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 transition-transform duration-500 group-hover:scale-105">
                                                    <img
                                                        src={
                                                            item.product
                                                                .image_url
                                                        }
                                                        alt=""
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-tight text-gray-900">
                                                    {item.product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-center text-xs font-medium text-gray-500 italic">
                                            {item.quantity}
                                        </td>
                                        <td className="py-6 text-right text-xs font-black text-gray-900">
                                            ₱
                                            {Number(
                                                item.price * item.quantity,
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-gray-950 flex justify-between items-center rounded-b-3xl mx-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">
                            Grand Total
                        </span>
                        <span className="text-3xl font-black text-white italic tracking-tighter">
                            ₱{Number(order.total).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Sidebar: Status & Customer */}
                <div className="space-y-8">
                    {/* Management Card */}
                    <div
                        className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-sm p-8"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Activity size={18} className="text-gray-900" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                Pipeline Control
                            </h2>
                        </div>
                        <form onSubmit={updateStatus}>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="w-full text-xs font-bold border-gray-100 bg-gray-50/50 focus:ring-0 focus:border-black rounded-xl py-4 mb-4 uppercase tracking-widest transition-all"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-black hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing
                                    ? "Synchronizing..."
                                    : "Update Status"}
                            </button>
                        </form>
                    </div>

                    {/* Information Card */}
                    <div
                        className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-sm p-8"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <User size={18} className="text-gray-900" />
                            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                Client Info
                            </h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    Name
                                </p>
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                                    {order.user?.name || "Guest"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    Email
                                </p>
                                <p className="text-xs text-gray-600 italic">
                                    {order.user?.email || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
