import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import ProductForm from "@/Components/Admin/ProductForm";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Create({ categories }) {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <AdminLayout>
            <Head title="Create Product" />

            <div className="mb-8" data-aos="fade-up">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Add New Product
                </h1>
                <p className="text-gray-500 mt-1">
                    Expand your minimalist collection with a new inventory item.
                </p>
            </div>

            <div
                className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm p-8"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                {/* Product is not passed here (defaults to null), 
                  so the form knows this is a NEW entry. 
                */}
                <ProductForm categories={categories} />
            </div>
        </AdminLayout>
    );
}
