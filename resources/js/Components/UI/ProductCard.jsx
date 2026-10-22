import React from 'react';
import { Heart, Plus } from 'lucide-react';

const ProductCard = ({ id, delay, onBuyAction }) => {
    return (
        <div className="group" data-aos="fade-up" data-aos-delay={delay}>
            <div className="relative overflow-hidden bg-white rounded-xl mb-6 shadow-sm">
                <img src={`/images/product_${id}.jpg`} className="w-full aspect-[3/4] object-cover transition duration-700 group-hover:scale-105" alt="Product" />
                <div className="absolute top-4 right-4">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-900 hover:bg-pink-600 hover:text-white transition duration-300">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>
                <button onClick={onBuyAction} className="absolute bottom-0 left-0 w-full bg-slate-950 text-white font-black py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-xs tracking-widest flex items-center justify-center gap-2">
                    <Plus className="w-3 h-3" /> ADD TO CART
                </button>
            </div>
            <div className="flex justify-between items-start px-1">
                <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors uppercase text-sm tracking-tight">Flux Core Hoodie v.{id}</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Limited Edition</p>
                </div>
                <p className="font-black text-slate-900 text-sm">₱1,299</p>
            </div>
        </div>
    );
};

export default ProductCard;