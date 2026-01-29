// src/components/ProductCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Eye,
  Zap,
  AlertCircle,
  Image as ImageIcon,
  Star,
  Timer,
  CheckCircle2,
} from "lucide-react";
import WishlistButton from "./WishlistButton";

// 1. 🛠️ Interfaces (Kept exactly as provided)
interface ProductImage {
  url: string;
  publicId: string;
  _id?: string;
}

interface Product {
  _id: string;
  id?: string;
  name: string;
  partNumber?: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  stockStatus?: string;
  images: ProductImage[];
  averageRating?: number;
  totalReviews?: number;
  flashSale?: {
    isActive: boolean;
    salePrice?: number;
    startTime?: string;
    endTime?: string;
  };
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: any) => void | Promise<void>;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🛡️ Safe ID Check
  const productId = product._id || product.id;

  if (!productId) {
    return null;
  }

  // 🔧 Image Logic (Kept exactly as is)
  const getImageUrl = () => {
    if (!product.images || product.images.length === 0) return null;
    const firstImage = product.images[0];
    const imagePath =
      typeof firstImage === "string" ? firstImage : firstImage?.url;

    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;

    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
    return `${baseUrl}/${cleanPath}`;
  };

  const displayImage = getImageUrl();
  const fallbackImage =
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop";

  // ⚡ Price & Stock Logic
  const isFlashSaleActive =
    product.flashSale?.isActive &&
    product.flashSale.salePrice &&
    new Date(product.flashSale.endTime!) > new Date();

  const finalPrice = isFlashSaleActive
    ? product.flashSale!.salePrice!
    : product.discountPrice || product.price;

  const originalPrice = product.price;

  const discountPercent =
    originalPrice > finalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : 0;

  const isOutOfStock =
    product.stock <= 0 || product.stockStatus === "Out of Stock";
  const isLowStock =
    !isOutOfStock && (product.stock < 5 || product.stockStatus === "Low Stock");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
    >
      <Link href={`/products/${productId}`} className="block h-full">
        {/* ✨ Card Container - Beautiful Glass Style */}
        <div className="relative h-full bg-white/90 dark:bg-[#1a1d29]/60 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-[1.5rem] overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col">
          {/* Wishlist Button (Top Right) - Floating Style */}
          <div className="absolute top-3 right-3 z-30">
            <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full shadow-sm p-0.5">
              <WishlistButton productId={product._id} />
            </div>
          </div>

          {/* 🏷️ Status Badges (Top Left) */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
            {isOutOfStock ? (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md border border-red-400">
                Out of Stock
              </span>
            ) : isFlashSaleActive ? (
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 animate-pulse border border-white/20">
                <Timer size={12} /> Flash Sale
              </span>
            ) : isLowStock ? (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 border border-orange-400">
                <Zap size={10} fill="currentColor" /> Low Stock
              </span>
            ) : (
              // In Stock Badge (Optional, creates consistency)
              <span className="bg-emerald-500/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-md">
                <CheckCircle2 size={10} /> In Stock
              </span>
            )}
          </div>

          {/* 🏷️ Discount Badge (Floating on Image) */}
          {discountPercent > 0 && !isOutOfStock && (
            <div className="absolute top-12 left-3 z-20">
              <span className="bg-yellow-400 text-black px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-lg border border-yellow-300">
                -{discountPercent}% OFF
              </span>
            </div>
          )}

          {/* ================================================================
            🖼️ IMAGE CONTAINER (STYLE KEPT EXACTLY AS REQUESTED) 
            ================================================================
          */}
          <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5">
            <motion.div
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full h-full relative"
            >
              <Image
                src={!imageError && displayImage ? displayImage : fallbackImage}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={true}
              />

              {/* Fallback Overlay */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <span className="text-xs">No Image</span>
                </div>
              )}
            </motion.div>

            {/* Quick Actions (Keep hover logic) */}
            <div className="absolute right-3 bottom-3 flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <button
                className="p-2.5 bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-700 dark:text-gray-200 rounded-full shadow-lg border border-white/20 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
          {/* ================================================================ */}

          {/* 📝 Content Section */}
          <div className="p-5 flex flex-col flex-grow relative">
            {/* Category & Rating Row */}
            <div className="mb-2 flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-500/20">
                {product.category || "Spare Part"}
              </span>

              {/* ⭐ Rating Feature */}
              {product.averageRating && product.averageRating > 0 && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full border border-amber-100 dark:border-amber-500/20">
                  <Star size={10} fill="currentColor" />
                  {product.averageRating.toFixed(1)}
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>

            {/* Part Number */}
            {product.partNumber && (
              <p className="text-[11px] text-gray-500 dark:text-gray-500 font-mono tracking-wide mb-3">
                PN: {product.partNumber}
              </p>
            )}

            <div className="mt-auto pt-3 border-t border-dashed border-gray-200 dark:border-white/10 flex items-end justify-between">
              {/* Price Section */}
              <div className="flex flex-col">
                {discountPercent > 0 ? (
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 line-through font-medium">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
                        ₹{finalPrice.toLocaleString()}
                      </span>
                      {isFlashSaleActive && (
                        <Zap
                          size={16}
                          className="text-purple-500 fill-current animate-bounce"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`mt-4 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold tracking-wide transition-all shadow-lg
                ${
                  isOutOfStock
                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none border border-gray-200 dark:border-white/5"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20 hover:shadow-blue-500/40 border border-white/10"
                }`}
            >
              {isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart size={18} strokeWidth={2.5} />
                  Add to Cart
                </>
              )}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
