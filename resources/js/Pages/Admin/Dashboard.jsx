import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import * as Icons from "lucide-react";
import { Line } from "react-chartjs-2";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from "chart.js";

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);

export default function Dashboard({
    stats,
    chartData,
    lowStockProducts,
    recentOrders,
    growth,
}) {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const pinkAccent = "#ff2d55";

    const statCards = [
        {
            title: "Total Sales",
            value: `$${growth?.total_sales?.toLocaleString() || "0.00"}`,
            icon: Icons.DollarSign,
            trend: `${growth?.isUp ? "+" : "-"}${Math.abs(growth?.percentage)}%`,
            isUp: growth?.isUp,
            id: "sales",
        },
        {
            title: "Total Orders",
            value: stats.find((s) => s.name === "Total Orders")?.value || 0,
            icon: Icons.ShoppingCart,
            trend: "+5.2%",
            isUp: true,
            id: "orders",
        },
        {
            title: "Total Customers",
            value: stats.find((s) => s.name === "Total Customers")?.value || 0,
            icon: Icons.Users,
            trend: "+8.1%",
            isUp: true,
            id: "customers",
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            {/* --- PREMIUM HEADER --- */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-8 mb-8 border-b border-slate-100">
                <div className="flex items-center gap-5">
                    <div className="bg-black p-4 rounded-[1.5rem] shadow-2xl shadow-black/20">
                        <Icons.Activity
                            size={28}
                            style={{ color: pinkAccent }}
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                            Flux Control
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                            Intelligence & Store Operations
                        </p>
                    </div>
                </div>

                <div className="mt-6 md:mt-0 flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Export Data
                    </button>
                    <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-black/10">
                        <Icons.Plus
                            size={14}
                            strokeWidth={3}
                            style={{ color: pinkAccent }}
                        />
                        New Product
                    </button>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div
                className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10"
                data-aos="fade-up"
            >
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.id}
                            className="group bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:border-black transition-all duration-300 shadow-sm relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-black transition-colors">
                                        {card.title}
                                    </p>
                                    <p className="text-4xl font-black tracking-tighter text-slate-900">
                                        {card.value}
                                    </p>
                                    <span
                                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${card.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                                    >
                                        {card.trend} vs last month
                                    </span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl transition-transform group-hover:rotate-6 group-hover:bg-black group-hover:text-white">
                                    <Icon
                                        size={20}
                                        className="group-hover:text-[#ff2d55]"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* --- REVENUE CHART --- */}
                <div
                    className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm"
                    data-aos="fade-right"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.3em]">
                            Revenue Analytics
                        </h3>
                        <select className="text-[10px] font-bold uppercase tracking-widest border-none bg-slate-50 rounded-lg px-4 py-2 focus:ring-0">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[350px]">
                        <Line
                            data={chartData}
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                    legend: { display: false },
                                },
                                scales: {
                                    y: {
                                        grid: { display: false },
                                        ticks: { font: { size: 10 } },
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { size: 10 } },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* --- SIDE HIGHLIGHT CARD --- */}
                <div className="space-y-6" data-aos="fade-left">
                    <div className="bg-black p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
                        <div
                            className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
                            style={{ backgroundColor: pinkAccent }}
                        ></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-12">
                                <div
                                    className="p-3 rounded-2xl"
                                    style={{ backgroundColor: pinkAccent }}
                                >
                                    <Icons.Target
                                        size={24}
                                        className="text-black"
                                    />
                                </div>
                                <div
                                    className="text-right text-[9px] font-black tracking-[0.3em] uppercase"
                                    style={{ color: pinkAccent }}
                                >
                                    Projection
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                    Quarterly Target
                                </p>
                                <div className="flex items-end gap-2">
                                    <span className="text-5xl font-black tracking-tighter">
                                        $42.8k
                                    </span>
                                    <Icons.ArrowUpRight
                                        size={24}
                                        style={{ color: pinkAccent }}
                                        className="mb-2"
                                    />
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full mt-4">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: "75%",
                                            backgroundColor: pinkAccent,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-12 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                            View Deep Insight
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- RECENT ORDERS --- */}
                <div
                    className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden"
                    data-aos="fade-up"
                >
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.3em]">
                            Recent Orders
                        </h3>
                        <Icons.ChevronRight
                            size={16}
                            className="text-slate-400"
                        />
                    </div>
                    <div className="divide-y divide-slate-50 px-4">
                        {recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="p-5 flex justify-between items-center hover:bg-slate-50/50 transition-all rounded-2xl group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px]">
                                        {order.user?.name
                                            ?.substring(0, 2)
                                            .toUpperCase() || "GS"}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-sm tracking-tight uppercase">
                                            #{order.id}
                                        </p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            {order.user?.name || "Guest User"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900 text-sm">
                                        ${order.total}
                                    </p>
                                    <p
                                        className={`text-[9px] font-black uppercase tracking-widest ${order.status === "completed" ? "text-green-500" : "text-amber-500"}`}
                                    >
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- INVENTORY ALERTS --- */}
                <div
                    className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-red-50/30">
                        <div className="flex items-center gap-3">
                            <Icons.AlertTriangle
                                size={18}
                                style={{ color: pinkAccent }}
                            />
                            <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.3em]">
                                Inventory Alerts
                            </h3>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-50">
                                {lowStockProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <p className="font-black text-slate-900 text-sm uppercase tracking-tight">
                                                {product.name}
                                            </p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                Min Threshold:{" "}
                                                {product.low_stock_threshold}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className="text-[10px] font-black bg-slate-100 px-4 py-1.5 rounded-full text-red-500 group-hover:bg-[#ff2d55] group-hover:text-white transition-colors">
                                                STOCK: {product.stock}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
