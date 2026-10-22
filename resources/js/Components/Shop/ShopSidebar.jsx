import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { 
    Search, 
    X, 
    Layers, 
    Palette, 
    Ruler, 
    RotateCcw, 
    ChevronRight,
    Check 
} from 'lucide-react';

const ShopSidebar = ({ filters = {}, categories = [], colors = [], sizes = [] }) => {
    // Local state to capture search input
    const [searchValue, setSearchValue] = useState(filters.search || '');

    // Sync local search input with filters if they change externally (e.g., on reset)
    useEffect(() => {
        setSearchValue(filters.search || '');
    }, [filters.search]);

    const updateFilter = (key, value) => {
        // Create a copy of current filters
        const newFilters = { ...filters, [key]: value };

        // If a value is empty (like clicking 'View All'), remove it from the query
        if (!value) delete newFilters[key];

        router.get(route('shop.index'), newFilters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchValue(''); // Clear local input state
        router.get(route('shop.index'), {}, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="flex items-center gap-2 mb-6 border-b border-slate-900 pb-2">
            <Icon className="w-3 h-3 text-pink-600" strokeWidth={3} />
            <h4 className="text-[11px] font-black uppercase text-slate-900">
                {title}
            </h4>
        </div>
    );

    return (
        <aside className="w-full space-y-16">
            {/* SEARCH SECTION */}
            <section data-aos="fade-up" data-aos-delay="100">
                <SectionHeader icon={Search} title="Search" />
                <div className="relative group">
                    <input 
                        type="text" 
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && updateFilter('search', searchValue)}
                        placeholder="FIND YOUR FLUX..."
                        className="w-full border-0 border-b border-slate-200 focus:border-pink-600 focus:ring-0 text-[10px] font-bold uppercase px-0 py-4 transition-all placeholder:text-slate-300 placeholder:tracking-widest bg-transparent"
                    />
                    <Search 
                        className="absolute right-0 top-4 w-4 h-4 text-slate-300 group-focus-within:text-pink-600 transition-colors cursor-pointer" 
                        onClick={() => updateFilter('search', searchValue)}
                    />
                </div>
            </section>

            {/* COLLECTIONS SECTION */}
            <section data-aos="fade-up" data-aos-delay="200">
                <SectionHeader icon={Layers} title="Collections" />
                <ul className="space-y-3">
                    <li 
                        onClick={() => updateFilter('category', '')} 
                        className={`group flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all ${!filters.category ? 'text-pink-600' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        <span className="group-hover:translate-x-1 transition-transform">View All</span>
                        {!filters.category && <ChevronRight className="w-3 h-3" />}
                    </li>
                    {(categories || []).map(cat => (
                        <li 
                            key={cat} 
                            onClick={() => updateFilter('category', cat)} 
                            className={`group flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all ${filters.category === cat ? 'text-pink-600' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                            {filters.category === cat && <ChevronRight className="w-3 h-3" />}
                        </li>
                    ))}
                </ul>
            </section>

            {/* PALETTE SECTION */}
            <section data-aos="fade-up" data-aos-delay="300">
                <SectionHeader icon={Palette} title="Palette" />
                <div className="flex flex-wrap gap-4">
                    {(colors || []).map(color => (
                        <button 
                            key={color.name} 
                            onClick={() => updateFilter('color', color.name)} 
                            className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${filters.color === color.name ? 'border-pink-600 shadow-lg' : 'border-white shadow-sm hover:border-slate-200'}`} 
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        >
                            {filters.color === color.name && (
                                <Check className={`w-3 h-3 ${['white', '#ffffff', '#fff'].includes(color.hex.toLowerCase()) ? 'text-slate-900' : 'text-white'}`} strokeWidth={4} />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* SIZE SECTION */}
            <section data-aos="fade-up" data-aos-delay="400">
                <SectionHeader icon={Ruler} title="Size" />
                <div className="grid grid-cols-3 gap-2">
                    {(sizes || []).map(size => (
                        <button 
                            key={size} 
                            onClick={() => updateFilter('size', size)} 
                            className={`h-12 text-[10px] font-black border transition-all duration-300 relative overflow-hidden group ${filters.size === size ? 'bg-slate-950 text-white border-slate-950' : 'border-slate-100 text-slate-400 hover:border-slate-950 hover:text-slate-950'}`}
                        >
                            <span className="relative z-10">{size}</span>
                            {filters.size === size && (
                                <div className="absolute top-0 right-0 w-4 h-4 bg-pink-600 flex items-center justify-center rounded-bl-sm">
                                    <Check className="w-2 h-2 text-white" strokeWidth={5} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* RESET BUTTON */}
            {Object.keys(filters || {}).length > 0 && (
                <button 
                    onClick={clearFilters}
                    data-aos="fade-in"
                    className="group w-full py-4 bg-slate-950 text-[9px] font-black uppercase tracking-[0.3em] text-white hover:bg-pink-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                    <RotateCcw className="w-3 h-3 group-hover:rotate-[-180deg] transition-transform duration-500" /> 
                    Reset Filters
                </button>
            )}
        </aside>
    );
};

export default ShopSidebar;