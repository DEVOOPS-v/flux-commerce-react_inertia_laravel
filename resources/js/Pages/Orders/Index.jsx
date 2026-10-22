import React from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import OrderCard from "@/Components/Order/OrderCards";
import Pagination from "@/Components/UI/Pagination";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function Index({ orders, auth }) {
    return (
        <GuestLayout auth={auth}>
            <Head title="My Orders | FLUX" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-slate-100 pb-12 gap-8">
                    <div>
                        <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">
                            Purchase History
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.8]">
                            My <br /> Orders
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <ShoppingBag size={16} />
                        Total Orders:{" "}
                        <span className="text-slate-900">{orders.total}</span>
                    </div>
                </div>

                {orders.data.length === 0 ? (
                    <div
                        className="py-32 text-center border-2 border-dashed border-slate-100 rounded-3xl"
                        data-aos="fade-up"
                    >
                        <p className="text-slate-400 uppercase tracking-widest font-bold text-sm mb-8">
                            You haven't secured any gear yet.
                        </p>
                        <Link
                            href={route("shop.index")}
                            className="inline-flex items-center gap-3 bg-slate-950 text-white px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-pink-600 transition-all rounded-full hover:shadow-2xl hover:shadow-pink-200"
                        >
                            Explore Collection <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Table Header - Aligned perfectly with OrderCard spans (5-2-2-2-1) */}
                        <div className="hidden lg:grid grid-cols-12 gap-6 px-10 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-900">
                            <div className="col-span-5">Product Details</div>
                            <div className="col-span-2 text-center">
                                Date Placed
                            </div>
                            <div className="col-span-2 text-center">
                                Order Status
                            </div>
                            <div className="col-span-2 text-right">
                                Total Amount
                            </div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Order List */}
                        <div className="flex flex-col gap-4">
                            {orders.data.map((order, index) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    delay={index * 50}
                                />
                            ))}
                        </div>

                        {/* Pagination Section */}
                        <div className="mt-20">
                            <Pagination links={orders.links} />
                        </div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
