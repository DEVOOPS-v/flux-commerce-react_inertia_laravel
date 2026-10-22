import React, { useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import ProductForm from "@/Components/Admin/ProductForm";
import { ChevronLeft, Package } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Edit({ product, categories }) {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    return (
        <AdminLayout>
            <Head title={`Edit ${product.name}`} />

            {/* Header Section */}
            <div className="mb-8" data-aos="fade-up">
                <Link
                    href={route("admin.products.index")}
                    className="group inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-4"
                >
                    <ChevronLeft
                        size={16}
                        className="mr-1 group-hover:-translate-x-1 transition-transform"
                    />
                    Back to Inventory
                </Link>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-black text-white rounded-lg">
                        <Package size={24} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Edit Product
                    </h1>
                </div>
                <p className="text-gray-500 mt-2">
                    Modifying:{" "}
                    <span className="font-semibold text-gray-900">
                        {product.name}
                    </span>
                </p>
            </div>

            {/* Form Container */}
            <div
                className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm p-8"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                {/* Passing the 'product' object here triggers "Edit Mode" 
                  inside the ProductForm component.
                */}
                <ProductForm product={product} categories={categories} />
            </div>
        </AdminLayout>
    );
}
