import React, { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Import the new UI Components
import FlashMessage from "@/Components/Admin/UI/FlashMessage";
import DeleteModal from "@/Components/Admin/UI/DeleteModal";

export default function Index({ products }) {
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const confirmDelete = () => {
        if (productToDelete) {
            // Use slug for routing to match backend logic
            router.delete(
                route("admin.products.destroy", productToDelete.slug),
                {
                    onSuccess: () => {
                        setProductToDelete(null);
                    },
                    preserveScroll: true,
                },
            );
        }
    };

    const toggleAvailability = (product) => {
        // Use slug for routing to match backend logic
        router.patch(
            route("admin.products.toggle-availability", product.slug),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AdminLayout>
            <Head title="Products Management" />

            <FlashMessage />

            <DeleteModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
                itemName={productToDelete?.name}
            />

            {/* Header Section */}
            <div
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                data-aos="fade-up"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Products
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your inventory, stock levels, and product
                        availability.
                    </p>
                </div>
                <Link
                    href={route("admin.products.create")}
                    className="inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                >
                    <Plus size={18} className="mr-2" />
                    New Product
                </Link>
            </div>

            {/* Main Table Container */}
            <div
                className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                data-aos="fade-up"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.data.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50/50 transition-colors group"
                                    data-aos="fade-up"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-12 w-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                                {product.image ? (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <Package
                                                            size={20}
                                                            className="text-gray-300"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    ID: #{product.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                                        $
                                        {parseFloat(
                                            product.price,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`text-sm ${product.stock <= 5 ? "text-orange-600 font-bold" : "text-gray-600"}`}
                                        >
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleAvailability(product)
                                            }
                                            className="relative z-10 flex items-center gap-2 group/toggle cursor-pointer"
                                        >
                                            {product.is_available ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-gray-100">
                                                    Draft
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={route(
                                                    "admin.products.edit",
                                                    product.slug,
                                                )}
                                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setProductToDelete(product)
                                                }
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-center">
                    {products.links && (
                        <nav className="flex gap-1">
                            {products.links.map((link, index) =>
                                link.url ? (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                            link.active
                                                ? "bg-black text-white shadow-sm"
                                                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ) : (
                                    <span
                                        key={index}
                                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed"
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                            )}
                        </nav>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
