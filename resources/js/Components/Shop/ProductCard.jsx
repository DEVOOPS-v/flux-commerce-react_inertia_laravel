import React, { useContext, useState, useEffect } from "react";
import { Heart, Plus, Edit3 } from "lucide-react";
import { Link, router, usePage } from "@inertiajs/react";
import { CartContext } from "@/Layouts/GuestLayout";

const ProductCard = ({ product, auth, delay }) => {
    const isAdmin =
        auth?.user?.roles?.includes("admin") || auth?.user?.is_admin;
    const productRoute = product?.slug ? route("shop.show", product.slug) : "#";
    const fallbackImage = "https://placehold.co/800x1000?text=Flux+Apparel";

    // Logic to determine the correct image source (Prefixing /storage/)
    const getProductImage = () => {
        if (!product?.image) return fallbackImage;

        // If the image is a full URL (e.g., from a seeder), use it directly
        if (product.image.startsWith("http")) {
            return product.image;
        }

        // Use the local storage path for admin-uploaded photos
        return `/storage/${product.image}`;
    };

    const { auth_favorites } = usePage().props;
    const { addToCart, addToFav, removeFromFav } = useContext(CartContext);

    const [cartPop, setCartPop] = useState(false);
    const [favPop, setFavPop] = useState(false);
    const [isFav, setIsFav] = useState(false);

    const isFavoritedFromSource = () => {
        if (auth?.user) {
            return auth_favorites?.includes(product.id) || false;
        } else {
            const guestFav = JSON.parse(
                sessionStorage.getItem("guest_fav") || "[]",
            );
            return guestFav.includes(product.id);
        }
    };

    useEffect(() => {
        setIsFav(isFavoritedFromSource());
    }, [auth_favorites, product.id]);

    useEffect(() => {
        const handleStorageChange = () => {
            if (!auth?.user) {
                setIsFav(isFavoritedFromSource());
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [auth?.user]);

    const handleToggleFav = async () => {
        setFavPop(true);
        setTimeout(() => setFavPop(false), 200);
        const newFavState = !isFav;
        setIsFav(newFavState);
        try {
            if (newFavState) {
                await addToFav(product);
            } else {
                await removeFromFav(product);
            }
        } catch (error) {
            setIsFav(!newFavState);
        }
    };

    const handleAddToCart = () => {
        setCartPop(true);
        setTimeout(() => setCartPop(false), 200);
        addToCart(product, 1);
    };

    const handleBuyNow = () => {
        if (!auth?.user) {
            alert("Please login to buy this product.");
            return;
        }
        addToCart(product, 1);
        setTimeout(() => router.visit(route("cart.index")), 300);
    };

    return (
        <div className="group" data-aos="fade-up" data-aos-delay={delay}>
            {/* Image Container */}
            <div className="relative overflow-hidden bg-white rounded-2xl mb-6 shadow-md hover:shadow-xl transition-shadow duration-500 ease-in-out">
                <Link href={productRoute}>
                    <img
                        src={getProductImage()}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = fallbackImage;
                        }}
                        className="w-full aspect-[3/4] object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                        alt={product?.name || "Product"}
                    />
                </Link>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={handleToggleFav}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:shadow-pink-200 transition-all duration-300
                        ${favPop ? "scale-125" : ""}
                        ${
                            isFav
                                ? "bg-pink-600 text-white hover:bg-pink-700"
                                : "bg-white/80 backdrop-blur-md text-slate-900 hover:bg-pink-600 hover:text-white"
                        }`}
                    >
                        <Heart className="w-4 h-4" />
                    </button>

                    {isAdmin && product?.id && (
                        <Link
                            href={route("admin.products.edit", product.id)}
                            className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-300"
                        >
                            <Edit3 className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    className={`absolute bottom-0 left-0 w-full bg-slate-950 text-white font-black py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-pink-600 hover:scale-105
                    ${cartPop ? "scale-110" : ""}`}
                >
                    <Plus className="w-3 h-3" /> ADD TO CART
                </button>
            </div>

            {/* Product Details */}
            <div className="flex justify-between items-start px-1 mb-4">
                <div className="max-w-[70%]">
                    <Link href={productRoute}>
                        <h3 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors uppercase text-sm tracking-tight truncate">
                            {product?.name || "Unnamed Product"}
                        </h3>
                    </Link>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">
                        {product?.category?.name || "Limited Edition"}
                    </p>
                </div>
                <p className="font-black text-slate-900 text-sm">
                    ₱{new Intl.NumberFormat().format(product?.price || 0)}
                </p>
            </div>

            {/* Buy Now Button */}
            {auth?.user && (
                <button
                    onClick={handleBuyNow}
                    className="w-full bg-pink-600 text-white font-black py-3 rounded-xl transition-all duration-300 text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-pink-700 hover:shadow-lg active:scale-95"
                >
                    BUY NOW
                </button>
            )}
        </div>
    );
};

// This was the missing piece!
export default ProductCard;
