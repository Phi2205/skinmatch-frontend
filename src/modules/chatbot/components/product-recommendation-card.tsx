'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '@/modules/cart/hooks/useCart';
import { RecommendedProduct } from '../types';
import { useState } from 'react';

interface ProductCardProps {
  product: RecommendedProduct;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export function ProductRecommendationCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          imageUrl: product.image_url,
          slug: product.slug,
        },
        1
      );
    } catch (err) {
      console.error('Failed to add product to cart:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white/70 backdrop-blur-md rounded-xl border border-emerald-100/40 p-2 shadow-sm hover:shadow-md transition-all duration-300 w-[145px] select-none overflow-hidden hover:border-[#7a9e8e]/30">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] w-full rounded-lg bg-[#faf8f5] overflow-hidden mb-1.5 block">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="150px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <ShoppingBag size={20} strokeWidth={1.5} />
          </div>
        )}
        
        {/* Hover overlay badge */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 text-[#7a9e8e] text-[9px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5 scale-90 group-hover:scale-100 transition-transform duration-300">
            Xem <ArrowRight size={8} />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col min-w-0">
        <Link href={`/products/${product.slug}`} className="block">
          <h4 className="font-semibold text-gray-800 text-[11.5px] leading-tight hover:text-[#7a9e8e] transition-colors duration-200 line-clamp-1 mb-1" title={product.name}>
            {product.name}
          </h4>
        </Link>
        
        {product.summary ? (
          <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug mb-2 flex-1 min-h-[28px]">
            {product.summary}
          </p>
        ) : (
          <p className="text-[10px] text-gray-400 italic line-clamp-2 leading-snug mb-2 flex-1 min-h-[28px]">
            Nuôi dưỡng làn da khỏe đẹp...
          </p>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-1 mt-auto pt-1.5 border-t border-gray-100/50">
          <span className="text-[11px] font-bold text-[#7a9e8e] truncate max-w-[65px]">
            {product.price ? formatPrice(product.price) : 'Liên hệ'}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="px-2 py-1 bg-[#7a9e8e] hover:bg-[#5a7a6b] disabled:bg-[#7a9e8e]/50 text-white text-[9.5px] font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-0.5 cursor-pointer"
          >
            <ShoppingCart size={9} />
            {isAdding ? 'Thêm...' : 'Thêm'}
          </button>
        </div>
      </div>
    </div>
  );
}

