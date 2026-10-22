import React from "react";
import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="mt-16 flex justify-center space-x-2">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || "#"}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition
                        ${
                            link.active
                                ? "bg-slate-950 text-white border-slate-950"
                                : "bg-white text-slate-400 border-slate-200 hover:bg-slate-50"
                        }
                        ${!link.url ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
