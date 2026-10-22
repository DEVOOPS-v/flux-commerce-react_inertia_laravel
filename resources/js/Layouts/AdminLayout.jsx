import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    ChevronRight,
    Menu,
    X,
    Bell,
    User,
    LogOut,
    Search,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
} from "lucide-react";

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const user = props.auth.user;

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showingMobileMenu, setShowingMobileMenu] = useState(false);

    // Navigation items with their route names for active highlighting
    const navItems = [
        {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
            route: "admin.dashboard",
        },
        {
            name: "Products",
            href: "/admin/products",
            icon: Package,
            route: "admin.products.index",
        },
        {
            name: "Orders",
            href: "/admin/orders",
            icon: ShoppingCart,
            route: "admin.orders.index",
        },
        {
            name: "Users",
            href: "/admin/users",
            icon: Users,
            route: "admin.users.index",
        },
        {
            name: "Settings",
            href: "/admin/settings",
            icon: Settings,
            route: "admin.settings",
        },
    ];

    // Helper to check if current route matches
    const isActive = (routeName) => {
        if (!routeName) return false;
        if (typeof routeName === "string") return route().current(routeName);
        return routeName.some((r) => route().current(r));
    };

    // Get readable current page name (for header)
    const currentPageName = () => {
        const current = navItems.find((item) => isActive(item.route));
        return current ? current.name : "Dashboard";
    };

    return (
        <div className="flex min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-pink-600 selection:text-white">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-slate-200 bg-white transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:flex ${
                    isCollapsed ? "w-20" : "w-72"
                }`}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 flex h-7 w-7 items-center justify-center rounded-full bg-black text-pink-600 transition-all hover:scale-110 shadow-xl z-50 border-4 border-white"
                    style={{
                        transform: isCollapsed ? "rotate(180deg)" : "none",
                    }}
                >
                    <ChevronRight size={12} strokeWidth={3} />
                </button>

                {/* Logo Section */}
                <div
                    className={`flex items-center gap-4 py-10 overflow-hidden transition-all ${
                        isCollapsed ? "justify-center px-0" : "px-7"
                    }`}
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black shadow-lg shadow-black/10 transition-transform hover:rotate-3">
                        <span className="text-xl font-black text-pink-600">
                            F.
                        </span>
                    </div>
                    {!isCollapsed && (
                        <div className="whitespace-nowrap transition-opacity duration-300">
                            <p className="text-2xl font-black tracking-tighter text-pink-600 text-black leading-none">
                                FLUX<span className="text-pink-600">.</span>
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">
                                Admin v1.0
                            </p>
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <div className="px-4 mb-8">
                    <div
                        className={`flex items-center gap-3 rounded-2xl py-3 border transition-all ${
                            isCollapsed
                                ? "justify-center bg-transparent border-none"
                                : "bg-slate-50 px-4 border-slate-100 shadow-sm"
                        }`}
                    >
                        <Search
                            size={20}
                            className={
                                isCollapsed ? "text-black" : "text-slate-400"
                            }
                        />
                        {!isCollapsed && (
                            <input
                                type="text"
                                placeholder="SEARCH..."
                                className="w-full bg-transparent border-none p-0 text-[10px] font-black tracking-widest focus:ring-0 placeholder:text-slate-300 uppercase"
                            />
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 px-3">
                    {!isCollapsed && (
                        <p className="px-4 mb-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Main Menu
                        </p>
                    )}
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.route);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center h-12 rounded-2xl transition-all duration-300 ${
                                    active
                                        ? "bg-black text-white"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-black"
                                } ${isCollapsed ? "justify-center" : "px-4"}`}
                            >
                                <Icon
                                    size={22}
                                    className={
                                        active
                                            ? "text-pink-600"
                                            : "group-hover:text-black"
                                    }
                                />
                                {!isCollapsed && (
                                    <span className="ml-4 text-xs font-black uppercase tracking-widest whitespace-nowrap">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className={`${isCollapsed ? "px-2" : "p-4"} mt-auto pb-6`}>
                    <div
                        className={`rounded-[2rem] border transition-all ${
                            isCollapsed
                                ? "bg-transparent border-none"
                                : "bg-slate-50 p-2 border-slate-100"
                        }`}
                    >
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className={`flex w-full items-center h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                isCollapsed
                                    ? "justify-center bg-rose-50 text-rose-600"
                                    : "px-4 text-slate-500 hover:bg-rose-500 hover:text-white"
                            }`}
                        >
                            <LogOut size={18} />
                            {!isCollapsed && (
                                <span className="ml-3">Sign Out</span>
                            )}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {showingMobileMenu && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 sm:hidden"
                    onClick={() => setShowingMobileMenu(false)}
                >
                    <div
                        className="w-72 h-full bg-white border-r border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                                    <span className="text-xl font-black text-pink-600">
                                        F.
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xl font-black tracking-tighter">
                                        FLUX
                                        <span className="text-pink-600">.</span>
                                    </p>
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        Admin v1.0
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowingMobileMenu(false)}
                                className="p-2"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <nav className="p-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.route);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() =>
                                            setShowingMobileMenu(false)
                                        }
                                        className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                                            active
                                                ? "bg-black text-white"
                                                : "text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        <Icon
                                            size={20}
                                            className={
                                                active ? "text-pink-600" : ""
                                            }
                                        />
                                        <span className="ml-3 text-sm font-black uppercase tracking-wider">
                                            {item.name}
                                        </span>
                                    </Link>
                                );
                            })}
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center w-full px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                onClick={() => setShowingMobileMenu(false)}
                            >
                                <LogOut size={20} />
                                <span className="ml-3 text-sm font-black uppercase tracking-wider">
                                    Sign Out
                                </span>
                            </Link>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div
                className={`flex flex-1 flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isCollapsed ? "sm:ml-20" : "sm:ml-72"
                }`}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 sm:px-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowingMobileMenu(true)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-pink-600" />
                            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                                FLUX Admin // {currentPageName()}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-black hover:text-pink-600 transition-all">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-rose-500 border-2 border-white" />
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-black text-black leading-none uppercase tracking-tighter">
                                    {user?.name || "Admin"}
                                </p>
                                <p className="text-[9px] font-black text-pink-600 bg-black px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-widest">
                                    Administrator
                                </p>
                            </div>
                            <div className="h-11 w-11 rounded-2xl bg-black border-2 border-slate-100 flex items-center justify-center text-pink-600 shadow-lg shadow-black/5">
                                <User size={20} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-6 sm:p-10">{children}</main>
            </div>
        </div>
    );
}
