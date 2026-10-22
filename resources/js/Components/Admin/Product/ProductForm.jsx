import React from "react";
import { useForm } from "@inertiajs/react";
import { Save, Upload, CheckCircle2 } from "lucide-react";

export default function ProductForm({ product = null, categories = [] }) {
    const isEditing = !!product;

    // Define available sizes
    const availableSizes = ["S", "M", "L", "XL", "XXL"];

    const { data, setData, post, processing, errors } = useForm({
        name: product?.name || "",
        category_id: product?.category_id || "",
        price: product?.price || "",
        stock: product?.stock || "",
        description: product?.description || "",
        is_available: product ? !!product.is_available : true,
        image: null,
        // Ensure sizes is initialized as an array
        sizes: product?.sizes || [],
        ...(isEditing && { _method: "PUT" }),
    });

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

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            post(route("admin.products.update", product.id));
        } else {
            post(route("admin.products.store"));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Name */}
                <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Product Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-gray-200"} focus:ring-2 focus:ring-black transition-all outline-none`}
                        placeholder="e.g. Heavyweight Oversized Tee"
                    />
                    {errors.name && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </span>
                    )}
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        value={data.category_id}
                        onChange={(e) => setData("category_id", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black transition-all outline-none"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.category_id}
                        </span>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Price (₱)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                    {errors.price && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.price}
                        </span>
                    )}
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Inventory Stock
                    </label>
                    <input
                        type="number"
                        value={data.stock}
                        onChange={(e) => setData("stock", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                    {errors.stock && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.stock}
                        </span>
                    )}
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center gap-3 md:mt-8">
                    <button
                        type="button"
                        onClick={() =>
                            setData("is_available", !data.is_available)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.is_available ? "bg-emerald-500" : "bg-gray-200"}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.is_available ? "translate-x-6" : "translate-x-1"}`}
                        />
                    </button>
                    <span className="text-sm font-bold text-gray-700">
                        Available for Sale
                    </span>
                </div>

                {/* Size Selection - FIXED */}
                <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {availableSizes.map((size) => {
                            const isSelected = data.sizes.includes(size);
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`relative px-6 py-2.5 rounded-xl border-2 font-bold transition-all duration-200 flex items-center gap-2 ${
                                        isSelected
                                            ? "border-black bg-black text-white shadow-lg scale-105"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300"
                                    }`}
                                >
                                    {isSelected && <CheckCircle2 size={14} />}
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                    {errors.sizes && (
                        <span className="text-red-500 text-xs mt-2 block">
                            {errors.sizes}
                        </span>
                    )}
                </div>

                {/* Description */}
                <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        rows="4"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black transition-all outline-none"
                    />
                </div>

                {/* Image Upload Area */}
                <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Product Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-2xl hover:border-black transition-colors group">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-black transition-colors" />
                            <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-bold text-black hover:underline">
                                    <span>
                                        {data.image
                                            ? data.image.name
                                            : "Upload a file"}
                                    </span>
                                    <input
                                        type="file"
                                        className="sr-only"
                                        onChange={(e) =>
                                            setData("image", e.target.files[0])
                                        }
                                    />
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG up to 2MB
                            </p>
                        </div>
                    </div>
                    {errors.image && (
                        <span className="text-red-500 text-xs mt-1">
                            {errors.image}
                        </span>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center px-8 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                >
                    <Save size={18} className="mr-2" />
                    {isEditing ? "Update Product" : "Save Product"}
                </button>
            </div>
        </form>
    );
}
