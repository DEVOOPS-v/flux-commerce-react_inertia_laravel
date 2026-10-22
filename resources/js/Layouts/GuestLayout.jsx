import React, {
    useState,
    useEffect,
    createContext,
    useRef,
    useCallback,
} from "react";
import { Link, usePage, router } from "@inertiajs/react";
import WelcomeUserModal from "@/Components/UI/WelcomeUserModal";
import { Search, Package, UserCircle, Heart, ShoppingBag } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const CartContext = createContext();

export default function GuestLayout({ children }) {
    const page = usePage()?.props || {};
    const url = page.url || "/";
    const flash = page.flash || {};
    const auth = page.auth || {};
    const user = auth.user || null;

    const [scrolled, setScrolled] = useState(false);
    const [intro, setIntro] = useState(true);
    const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [favCount, setFavCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState([]);
    const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);
    const [isMerging, setIsMerging] = useState(false);

    const prevUserRef = useRef(user);

    // ========== FETCH RECENT ORDERS ==========
    useEffect(() => {
        if (user) {
            axios
                .get(route("orders.recent"))
                .then((response) => setRecentOrders(response.data))
                .catch((error) =>
                    console.error("Failed to fetch recent orders", error),
                );
        } else {
            setRecentOrders([]);
        }
    }, [user]);

    // ========== UPDATE COUNTS FROM PAGE PROPS OR STORAGE ==========
    const updateCounts = useCallback(() => {
        if (user) {
            const authCart = page.auth_cart || [];
            const totalCart = authCart.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0,
            );
            setCartCount(totalCart);

            const authFavs = page.auth_favorites || [];
            setFavCount(authFavs.length);
        } else {
            const guestCart = JSON.parse(
                sessionStorage.getItem("guest_cart") || "{}",
            );
            setCartCount(
                Object.values(guestCart).reduce((sum, qty) => sum + qty, 0),
            );

            const guestFav = JSON.parse(
                sessionStorage.getItem("guest_fav") || "[]",
            );
            setFavCount(guestFav.length);
        }
    }, [user, page.auth_cart, page.auth_favorites]);

    // ========== MERGE GUEST DATA AFTER LOGIN ==========
    const mergeGuestData = async () => {
        const guestCart = JSON.parse(
            sessionStorage.getItem("guest_cart") || "{}",
        );
        const guestFav = JSON.parse(
            sessionStorage.getItem("guest_fav") || "[]",
        );

        if (Object.keys(guestCart).length === 0 && guestFav.length === 0) {
            return;
        }

        setIsMerging(true);
        const toastId = toast.loading("Syncing your cart and favorites...");

        try {
            const cartItems = Object.entries(guestCart).map(
                ([productId, quantity]) => ({
                    product_id: productId,
                    quantity,
                }),
            );
            if (cartItems.length > 0) {
                await axios.post(route("cart.merge"), { items: cartItems });
            }

            if (guestFav.length > 0) {
                await axios.post(route("favorites.merge"), {
                    product_ids: guestFav,
                });
            }

            sessionStorage.removeItem("guest_cart");
            sessionStorage.removeItem("guest_fav");

            toast.success("Your cart and favorites have been synced!", {
                id: toastId,
            });

            router.reload({ preserveScroll: true });
        } catch (error) {
            console.error("Failed to merge guest data:", error);
            toast.error("Could not sync your data. Please try again.", {
                id: toastId,
            });
        } finally {
            setIsMerging(false);
        }
    };

    // ========== DETECT LOGIN/LOGOUT ==========
    useEffect(() => {
        if (prevUserRef.current === null && user !== null) {
            mergeGuestData();
        } else if (prevUserRef.current !== null && user === null) {
            sessionStorage.removeItem("guest_cart");
            sessionStorage.removeItem("guest_fav");
            setCartCount(0);
            setFavCount(0);
        }
        prevUserRef.current = user;
    }, [user]);

    // ========== ADD TO CART (NO PAGE RELOAD) ==========
    const addToCart = useCallback(
        (product, quantity = 1) => {
            if (isMerging) {
                toast("Please wait, syncing your account...");
                return;
            }

            if (user) {
                // Authenticated – use axios to avoid page reload
                const prevCount = cartCount;
                setCartCount((prev) => prev + quantity);

                axios
                    .post(route("cart.add"), {
                        product_id: product.id,
                        quantity,
                    })
                    .then(() => {
                        toast.success(`${product.name} added to cart!`, {
                            duration: 3000,
                            icon: "🛒",
                        });
                    })
                    .catch((error) => {
                        setCartCount(prevCount); // rollback
                        toast.error(
                            error.response?.data?.message ||
                                "Failed to add item. Please try again.",
                        );
                    });
            } else {
                // Guest – use sessionStorage (client‑side only)
                const guestCart = JSON.parse(
                    sessionStorage.getItem("guest_cart") || "{}",
                );
                guestCart[product.id] = (guestCart[product.id] || 0) + quantity;
                sessionStorage.setItem("guest_cart", JSON.stringify(guestCart));

                setCartCount(
                    Object.values(guestCart).reduce((sum, qty) => sum + qty, 0),
                );

                toast.success(`${product.name} added to cart (Guest)!`, {
                    duration: 3000,
                    icon: "🛒",
                });
            }
        },
        [user, cartCount, isMerging],
    );

    // ========== ADD TO FAVORITES (RETURNS PROMISE) ==========
    // const addToFav = useCallback(
    //     (product) => {
    //         if (isMerging) {
    //             toast("Please wait, syncing your account...");
    //             return Promise.reject(new Error("Merging"));
    //         }

    //         if (user) {
    //             const prevCount = favCount;
    //             setFavCount((prev) => prev + 1); // optimistic update

    //             return axios
    //                 .post(route("favorites.add"), { product_id: product.id })
    //                 .then(() => {
    //                     toast.success(`${product.name} added to favorites!`, {
    //                         duration: 3000,
    //                         icon: "❤️",
    //                     });
    //                 })
    //                 .catch((error) => {
    //                     setFavCount(prevCount); // rollback
    //                     toast.error(
    //                         error.response?.data?.message ||
    //                             "Failed to add to favorites. Please try again.",
    //                     );
    //                     throw error; // rethrow so the caller can also roll back
    //                 });
    //         } else {
    //             // Guest – return a promise for consistency
    //             return new Promise((resolve, reject) => {
    //                 let guestFav = JSON.parse(
    //                     sessionStorage.getItem("guest_fav") || "[]",
    //                 );
    //                 if (!guestFav.includes(product.id)) {
    //                     guestFav.push(product.id);
    //                     sessionStorage.setItem(
    //                         "guest_fav",
    //                         JSON.stringify(guestFav),
    //                     );
    //                     setFavCount(guestFav.length);
    //                     toast.success(
    //                         `${product.name} added to favorites (Guest)!`,
    //                         { duration: 3000, icon: "❤️" },
    //                     );
    //                     resolve();
    //                 } else {
    //                     toast.info(`${product.name} is already in favorites!`, {
    //                         duration: 2000,
    //                     });
    //                     reject(new Error("Already favorited"));
    //                 }
    //             });
    //         }
    //     },
    //     [user, favCount, isMerging],

    // ========== ADD TO FAVORITES (REFINED FOR GUEST PERSISTENCE) ==========
    const addToFav = useCallback(
        (product) => {
            if (isMerging) {
                toast("Please wait, syncing your account...");
                return Promise.reject(new Error("Merging"));
            }

            if (user) {
                const prevCount = favCount;
                setFavCount((prev) => prev + 1);

                return axios
                    .post(route("favorites.add"), { product_id: product.id })
                    .then(() => {
                        toast.success(`${product.name} added to favorites!`, {
                            duration: 3000,
                            icon: "❤️",
                        });
                    })
                    .catch((error) => {
                        setFavCount(prevCount);
                        toast.error(
                            error.response?.data?.message ||
                                "Failed to add to favorites.",
                        );
                        throw error;
                    });
            } else {
                // Guest Logic: Ensure it adds to fav and stays there
                return new Promise((resolve) => {
                    let guestFav = JSON.parse(
                        sessionStorage.getItem("guest_fav") || "[]",
                    );

                    if (!guestFav.includes(product.id)) {
                        guestFav.push(product.id);
                        sessionStorage.setItem(
                            "guest_fav",
                            JSON.stringify(guestFav),
                        );
                        setFavCount(guestFav.length);
                        toast.success(`${product.name} added to favorites!`, {
                            duration: 3000,
                            icon: "❤️",
                        });
                    } else {
                        toast.info(
                            `${product.name} is already in your wishlist.`,
                        );
                    }
                    resolve();
                });
            }
        },
        [user, favCount, isMerging],
    );

    // ========== REMOVE FROM FAVORITES (RETURNS PROMISE) ==========
    const removeFromFav = useCallback(
        (product) => {
            if (isMerging) {
                toast("Please wait, syncing your account...");
                return Promise.reject(new Error("Merging"));
            }

            if (user) {
                const prevCount = favCount;
                setFavCount((prev) => prev - 1); // optimistic update

                return axios
                    .delete(route("favorites.remove"), {
                        data: { product_id: product.id },
                    })
                    .then(() => {
                        toast.success(
                            `${product.name} removed from favorites!`,
                            {
                                duration: 3000,
                                icon: "❤️",
                            },
                        );
                    })
                    .catch((error) => {
                        setFavCount(prevCount); // rollback
                        toast.error(
                            error.response?.data?.message ||
                                "Failed to remove from favorites. Please try again.",
                        );
                        throw error;
                    });
            } else {
                // Guest – return a promise
                return new Promise((resolve, reject) => {
                    let guestFav = JSON.parse(
                        sessionStorage.getItem("guest_fav") || "[]",
                    );
                    const index = guestFav.indexOf(product.id);
                    if (index !== -1) {
                        guestFav.splice(index, 1);
                        sessionStorage.setItem(
                            "guest_fav",
                            JSON.stringify(guestFav),
                        );
                        setFavCount(guestFav.length);
                        toast.success(
                            `${product.name} removed from favorites (Guest)!`,
                            { duration: 3000, icon: "❤️" },
                        );
                        resolve();
                    } else {
                        toast.info(
                            `${product.name} is not in your favorites.`,
                            {
                                duration: 2000,
                            },
                        );
                        reject(new Error("Not in favorites"));
                    }
                });
            }
        },
        [user, favCount, isMerging],
    );

    // ========== INITIAL EFFECTS ==========
    useEffect(() => {
        const timer = setTimeout(() => setIntro(false), 100);
        const handleScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", handleScroll);

        if (flash?.new_user && user) setIsWelcomeModalOpen(true);

        updateCounts();
        window.addEventListener("storage", updateCounts);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("storage", updateCounts);
        };
    }, [flash, user, updateCounts]);

    // ========== NAVIGATION ITEMS ==========
    const navItems = [
        { name: "Home", href: "/", routeName: "welcome" },
        { name: "Shop", href: "/shop", routeName: "shop.*" },
        { name: "Cart", href: "/cart", routeName: "cart.*" },
        { name: "About", href: "/about", routeName: "about" },
    ];

    const isActive = (path, routeName = null) => {
        if (routeName && typeof route !== "undefined")
            return route().current(routeName);
        if (!url || typeof url !== "string") return false;
        const currentPath = url.split("?")[0];
        if (path === "/") return currentPath === "/";
        return currentPath === path || currentPath.startsWith(`${path}/`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showOrdersDropdown &&
                !event.target.closest(".orders-dropdown")
            ) {
                setShowOrdersDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [showOrdersDropdown]);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                setCartCount,
                favCount,
                setFavCount,
                addToCart,
                addToFav,
                removeFromFav,
                isMerging,
            }}
        >
            <div className="min-h-screen bg-white font-poppins flex flex-col">
                <Toaster position="bottom-right" reverseOrder={false} />

                <WelcomeUserModal
                    isOpen={isWelcomeModalOpen}
                    onClose={() => setIsWelcomeModalOpen(false)}
                    userName={user?.name || "Member"}
                />

                <nav
                    className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out bg-white/90 backdrop-blur-md px-8 md:px-28 border-b border-gray-100 
            ${intro ? "opacity-0 -translate-y-4" : "translate-y-0 opacity-100"}
            ${scrolled ? "shadow-lg py-[50px]" : "py-[55px]"}`}
                >
                    <div className="flex justify-between items-center w-full">
                        <div className="text-2xl font-bold tracking-tight text-pink-600 select-none">
                            <Link href="/">FLUX</Link>
                        </div>

                        <ul className="hidden md:flex space-x-10 text-gray-800 font-medium tracking-wide uppercase text-sm">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`transition-colors hover:text-pink-600 ${
                                            isActive(item.href, item.routeName)
                                                ? "text-pink-600 font-semibold underline underline-offset-8 decoration-2"
                                                : ""
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center space-x-6 text-gray-700">
                            <button className="hover:text-pink-600 transition duration-200">
                                <Search className="w-5 h-5" />
                            </button>

                            <Link
                                href="/favorites"
                                className={`relative hover:text-pink-600 transition duration-200 ${
                                    isActive("/favorites")
                                        ? "text-pink-600"
                                        : ""
                                }`}
                            >
                                <Heart className="w-5 h-5" />
                                {favCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                                        {favCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/cart"
                                className={`relative hover:text-pink-600 transition duration-200 ${
                                    isActive("/cart", "cart.*")
                                        ? "text-pink-600"
                                        : ""
                                }`}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center space-x-5">
                                    <div className="relative group orders-dropdown">
                                        <button className="hover:text-pink-600 transition duration-200 flex items-center gap-1">
                                            <UserCircle className="w-6 h-6" />
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-2 text-gray-700 hover:bg-pink-50"
                                            >
                                                Dashboard
                                            </Link>

                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setShowOrdersDropdown(
                                                            !showOrdersDropdown,
                                                        )
                                                    }
                                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 flex justify-between items-center"
                                                >
                                                    My Orders
                                                    <svg
                                                        className={`w-4 h-4 transition-transform ${
                                                            showOrdersDropdown
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </button>

                                                {showOrdersDropdown && (
                                                    <div className="bg-white border border-gray-100 rounded-md shadow-sm mt-1 max-h-80 overflow-y-auto">
                                                        {recentOrders.length ===
                                                        0 ? (
                                                            <p className="px-4 py-2 text-sm text-gray-500">
                                                                No recent orders
                                                            </p>
                                                        ) : (
                                                            recentOrders.map(
                                                                (order) => (
                                                                    <Link
                                                                        key={
                                                                            order.id
                                                                        }
                                                                        href={route(
                                                                            "orders.show",
                                                                            order.id,
                                                                        )}
                                                                        className="block px-4 py-2 hover:bg-pink-50 border-b border-gray-100 last:border-b-0"
                                                                    >
                                                                        <div className="flex justify-between items-center">
                                                                            <div>
                                                                                <p className="text-sm font-medium text-gray-800">
                                                                                    #
                                                                                    {
                                                                                        order.order_number
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {new Date(
                                                                                        order.created_at,
                                                                                    ).toLocaleDateString()}
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <span
                                                                                    className={`text-xs px-2 py-1 rounded-full
                                          ${
                                              order.status === "pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : ""
                                          }
                                          ${
                                              order.status === "paid"
                                                  ? "bg-blue-100 text-blue-800"
                                                  : ""
                                          }
                                          ${
                                              order.status === "shipped"
                                                  ? "bg-purple-100 text-purple-800"
                                                  : ""
                                          }
                                          ${
                                              order.status === "completed"
                                                  ? "bg-green-100 text-green-800"
                                                  : ""
                                          }
                                        `}
                                                                                >
                                                                                    {order.status.toUpperCase()}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            Total:
                                                                            ₱
                                                                            {order.total.toFixed(
                                                                                2,
                                                                            )}
                                                                        </p>
                                                                    </Link>
                                                                ),
                                                            )
                                                        )}
                                                        <Link
                                                            href={route(
                                                                "orders.index",
                                                            )}
                                                            className="block px-4 py-2 text-center text-sm text-pink-600 hover:bg-pink-50 font-medium"
                                                        >
                                                            View all orders
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:text-pink-600 transition-all duration-300 ease-out"
                                    >
                                        <span className="h-px w-4 bg-slate-200 group-hover:bg-pink-600 transition-all duration-300"></span>
                                        Sign Out
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-5">
                                    <Link
                                        href={`/login?redirect=${url || "/"}`}
                                        className={`text-xs font-bold uppercase tracking-widest hover:text-pink-600 transition duration-200 ${
                                            isActive("/login")
                                                ? "text-pink-600"
                                                : ""
                                        }`}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href={`/register?redirect=${url || "/"}`}
                                        className="bg-pink-600 text-white text-[10px] font-black px-5 py-2.5 rounded-full hover:bg-black transition duration-300 uppercase tracking-tighter shadow-md shadow-pink-100"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="flex-grow pt-40 md:pt-10">{children}</main>
                <footer className="bg-gray-50 border-t border-gray-200 mt-16 text-gray-700 font-poppins">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-24 xl:px-32 py-12 md:py-16">
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-5 md:gap-8 lg:gap-16 xl:gap-20">
                            <div className="space-y-4 col-span-full sm:col-span-1 md:col-span-1">
                                <div className="mb-4 text-3xl font-extrabold text-pink-600 tracking-wider uppercase">
                                    FLUX
                                </div>
                                <p className="text-sm">
                                    123 Beach Avenue, Flux City, CA 00000
                                </p>
                                <p className="text-sm">contact@flux.com</p>
                                <p className="text-sm">+1 000-000-0000</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-base text-pink-600 mb-4 uppercase">
                                    Company
                                </h4>
                                <ul className="space-y-3 text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Careers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Affiliates
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Blog
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-base text-pink-600 mb-4 uppercase">
                                    Shop
                                </h4>
                                <ul className="space-y-3 text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            New Arrivals
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Accessories
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Men
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Women
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-base text-pink-600 mb-4 uppercase">
                                    Help
                                </h4>
                                <ul className="space-y-3 text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Customer Service
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            My Account
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Legal & Privacy
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-base text-pink-600 mb-4 uppercase">
                                    Categories
                                </h4>
                                <ul className="space-y-3 text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Shirts
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Jeans
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Shoes
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-pink-600 transition duration-200"
                                        >
                                            Bags
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 py-4 bg-gray-100/50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-24 xl:px-32 flex justify-between items-center text-sm text-gray-600">
                            <p>&copy; {new Date().getFullYear()} FLUX</p>
                            <div className="space-x-4">
                                <a
                                    href="#"
                                    className="hover:text-pink-600 transition duration-200"
                                >
                                    Privacy Policy
                                </a>
                                <span className="text-gray-400">|</span>
                                <a
                                    href="#"
                                    className="hover:text-pink-600 transition duration-200"
                                >
                                    Terms & Conditions
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </CartContext.Provider>
    );
}
