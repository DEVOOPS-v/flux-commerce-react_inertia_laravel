import { router } from "@inertiajs/react";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem({ item }) {
    // 1. Match the fallback from your ProductCard
    const fallbackImage = 'https://placehold.co/800x1000?text=Flux+Apparel';
    
    // 2. Extract product for easier access
    const product = item.product;

    const updateQuantity = (newQty) => {
        if (newQty < 1) return;
        router.patch(`/cart/${item.id}`, { quantity: newQty }, { preserveScroll: true });
    };

    const removeItem = () => {
        router.delete(`/cart/${item.id}`, { preserveScroll: true });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-8 pb-10 border-b border-slate-50 relative group">
            <div className="w-full sm:w-48 h-60 bg-slate-100 shrink-0 overflow-hidden rounded-2xl">
                <img 
                    // EXACT SAME LOGIC AS PRODUCT CARD
                    src={product?.image || product?.image_url || fallbackImage} 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    alt={product?.name || 'Product'}
                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
                />
            </div>
            
            <div className="flex flex-col justify-between flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 group-hover:text-pink-600 transition-colors">
                            {product?.name || 'Unnamed Product'}
                        </h2>
                        <p className="text-pink-600 font-bold">
                            ₱{new Intl.NumberFormat().format(product?.price || 0)}
                        </p>
                    </div>
                    <button onClick={removeItem} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={20} />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-12">
                    <div className="flex items-center border-2 border-slate-900 bg-white">
                        <button onClick={() => updateQuantity(item.quantity - 1)} className="px-4 py-2 hover:bg-slate-900 hover:text-white transition-all"><Minus size={14} /></button>
                        <span className="w-12 text-center font-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.quantity + 1)} className="px-4 py-2 hover:bg-slate-900 hover:text-white transition-all"><Plus size={14} /></button>
                    </div>
                    <p className="text-2xl font-black tracking-tighter text-slate-900">
                        ₱{new Intl.NumberFormat().format(item.subtotal || 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}