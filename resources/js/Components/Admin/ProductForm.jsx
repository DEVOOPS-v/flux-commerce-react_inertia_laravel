import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Upload,
    X,
    Save,
    Package,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";

export default function ProductForm({ product = null, categories = [] }) {
    const isEditing = !!product;

    // 1. Define available sizes
    const availableSizes = ["S", "M", "L", "XL", "XXL"];

    const [preview, setPreview] = useState(
        product?.image ? `/storage/${product.image}` : null,
    );

    const { data, setData, post, processing, errors } = useForm({
        name: product?.name || "",
        category_id: product?.category_id || "",
        price: product?.price || "",
        stock: product?.stock || "",
        description: product?.description || "",
        is_available: product ? !!product.is_available : true,
        image: null,
        // 2. Initialize sizes from product data or empty array
        sizes: product?.sizes || [],
        _method: isEditing ? "PUT" : "POST",
    });

    // 3. Logic to add/remove sizes from the array
    const toggleSize = (size) => {
        const currentSizes = [...data.sizes];
        if (currentSizes.includes(size)) {
            setData(
                "sizes",
                currentSizes.filter((s) => s !== size),
            );
        } else {
            setData("sizes", [...currentSizes, size]);
        }
    };

    const getStockStatus = () => {
        const stockNum = parseInt(data.stock);
        if (isNaN(stockNum) || stockNum <= 0)
            return { label: "Out of Stock", color: "text-red-500 bg-red-50" };
        if (stockNum < 10)
            return { label: "Low Stock", color: "text-amber-500 bg-amber-50" };
        return { label: "In Stock", color: "text-emerald-500 bg-emerald-50" };
    };

    const status = getStockStatus();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData("image", null);
        setPreview(null);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            post(route("admin.products.update", product.slug), {
                forceFormData: true,
            });
        } else {
            post(route("admin.products.store"));
        }
    };

    return (
        <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
            {/* Left Column: Details */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Product Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none"
                        placeholder="Minimalist Tee"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-black transition-all outline-none"
                        >
                            <option value="">Select...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.category_id}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Price (₱)
                        </label>
                        <input
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-black transition-all outline-none"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.price}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-bold text-gray-700">
                            Stock Quantity
                        </label>
                        <span
                            className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${status.color}`}
                        >
                            {status.label}
                        </span>
                    </div>
                    <input
                        type="number"
                        value={data.stock}
                        onChange={(e) => setData("stock", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                    {errors.stock && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.stock}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        rows="4"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* 4. SIZE SELECTION UI ADDED HERE */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => {
                            const isSelected = data.sizes.includes(size);
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-bold transition-all duration-200 ${
                                        isSelected
                                            ? "border-black bg-black text-white shadow-md scale-105"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                    }`}
                                >
                                    {isSelected && <CheckCircle2 size={14} />}
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                    {errors.sizes && (
                        <p className="text-red-500 text-xs mt-2">
                            {errors.sizes}
                        </p>
                    )}
                </div>
            </div>

            {/* Right Column: Image & Availability */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Product Image
                    </label>
                    <div className="relative group">
                        {preview ? (
                            <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-gray-100 shadow-inner bg-gray-50">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center h-80 w-full border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-black transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="p-4 bg-gray-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                        <Upload
                                            className="text-gray-400 group-hover:text-black"
                                            size={24}
                                        />
                                    </div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Upload product image
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </label>
                        )}
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.image}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">
                        Availability & Visibility
                    </label>

                    <div
                        className={`p-4 rounded-2xl border transition-all ${data.is_available ? "border-gray-100 bg-gray-50/30" : "border-red-100 bg-red-50/30"}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-lg ${data.is_available ? "bg-black text-white" : "bg-red-100 text-red-600"}`}
                                >
                                    {data.is_available ? (
                                        <Eye size={18} />
                                    ) : (
                                        <EyeOff size={18} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        Store Visibility
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {data.is_available
                                            ? "Active and visible to customers."
                                            : "Hidden from the store frontend."}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setData("is_available", !data.is_available)
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${data.is_available ? "bg-black" : "bg-gray-300"}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${data.is_available ? "translate-x-6" : "translate-x-1"}`}
                                />
                            </button>
                        </div>
                    </div>

                    {parseInt(data.stock) <= 0 && data.is_available && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                            <AlertCircle size={16} />
                            <p className="text-xs font-medium">
                                This product is visible but shows as "Out of
                                Stock".
                            </p>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isEditing ? "Update Product" : "Publish Product"}
                    </button>
                </div>
            </div>
        </form>
    );
}
