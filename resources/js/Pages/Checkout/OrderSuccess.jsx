import React, { useRef } from "react";
import { Head, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    CheckCircle,
    Package,
    Calendar,
    MapPin,
    CreditCard,
    Printer,
    ShoppingBag,
} from "lucide-react";
import OrderStepper from "@/Components/UI/OrderStepper";

export default function OrderSuccess() {
    const { order } = usePage().props;
    const receiptRef = useRef(null);

    const getEstimatedDelivery = () => {
        const deliveryDays = 5; // adjust as needed
        const date = new Date();
        date.setDate(date.getDate() + deliveryDays);
        return date.toLocaleDateString("en-PH", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handlePrintReceipt = () => {
        const printContent = receiptRef.current.cloneNode(true);
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Order Receipt - ${order.order_number}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 2rem; }
                        .receipt { max-width: 800px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 2rem; }
                        .order-number { font-size: 1.25rem; font-weight: bold; }
                        .divider { border-top: 1px solid #ccc; margin: 1rem 0; }
                        .items { margin: 1rem 0; }
                        .item { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                        .totals { margin-top: 1rem; text-align: right; }
                        .footer { text-align: center; margin-top: 2rem; font-size: 0.75rem; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <GuestLayout>
            <Head title="Order Confirmed | FLUX" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-32 mt-10">
                <OrderStepper activeStep={3} />

                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900">
                        Order Confirmed
                    </h1>
                    <p className="text-slate-500 mt-4 max-w-md">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={handlePrintReceipt}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                        >
                            <Printer size={14} />
                            Print Receipt
                        </button>
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all"
                        >
                            <ShoppingBag size={14} />
                            Continue Shopping
                        </a>
                    </div>
                </div>

                <div ref={receiptRef}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column – Order Info & Shipping */}
                        <div className="space-y-8">
                            <div className="border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Package size={20} className="text-slate-400" />
                                    <h2 className="text-xl font-black uppercase tracking-tight">
                                        Order Summary
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between border-b border-slate-100 pb-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Order Number
                                        </span>
                                        <span className="font-mono font-bold">
                                            {order.order_number}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Date
                                        </span>
                                        <span className="font-bold">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Payment Method
                                        </span>
                                        <span className="font-bold uppercase">
                                            {order.payment_method === "cod"
                                                ? "Cash on Delivery"
                                                : "Bank Transfer"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Status
                                        </span>
                                        <span className="font-bold uppercase text-green-600">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-slate-200 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <MapPin size={20} className="text-slate-400" />
                                    <h2 className="text-xl font-black uppercase tracking-tight">
                                        Shipping Address
                                    </h2>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold">{order.ship_name}</p>
                                    <p className="text-slate-600">{order.ship_phone}</p>
                                    <p className="text-slate-600">{order.ship_address}</p>
                                    <p className="text-slate-600">{order.ship_city}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column – Items & Totals */}
                        <div className="border border-slate-200 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard size={20} className="text-slate-400" />
                                <h2 className="text-xl font-black uppercase tracking-tight">
                                    Items Purchased
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-start border-b border-slate-100 pb-4"
                                    >
                                        <div>
                                            <p className="font-black uppercase tracking-tight">
                                                {item.product.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-bold">
                                            ₱{Number(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}

                                <div className="pt-4 flex items-center gap-2 text-sm text-slate-600 border-t border-slate-100">
                                    <Calendar size={14} />
                                    <span>
                                        Estimated delivery: <strong>{getEstimatedDelivery()}</strong>
                                    </span>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span>Subtotal</span>
                                        <span>₱{Number(order.subtotal).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span>Shipping</span>
                                        <span>
                                            {order.shipping_fee === 0
                                                ? "FREE"
                                                : `₱${order.shipping_fee.toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span>VAT (12%)</span>
                                        <span>₱{(order.subtotal * 0.12).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black tracking-tighter pt-4 border-t-2 border-slate-200 mt-4">
                                        <span>Total</span>
                                        <span>₱{Number(order.total).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-12 text-xs text-slate-400">
                    <p>We'll send a confirmation email with the order details shortly.</p>
                    <p className="mt-1">For questions, contact us at support@flux.com</p>
                </div>
            </div>
        </GuestLayout>
    );
}