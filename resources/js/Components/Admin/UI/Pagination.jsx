import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1">
            {links.map((link, i) =>
                // THE FIX: If link.url is null (like 'Previous' on page 1),
                // render a span so Inertia doesn't try to process it.
                link.url === null ? (
                    <span
                        key={i}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-gray-100 text-gray-300 bg-gray-50/50 cursor-not-allowed rounded-sm"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={i}
                        href={link.url}
                        preserveScroll // Keeps admin at their current scroll position
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all duration-200 rounded-sm
                            ${
                                link.active
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black"
                            }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}
