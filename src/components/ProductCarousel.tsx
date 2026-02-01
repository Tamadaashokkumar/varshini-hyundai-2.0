// export default ProductCarousel;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight, ShoppingCart, Sparkles, Tag } from "lucide-react"; // Using Lucide icons
import apiClient from "@/services/apiClient";

// Swiper CSS Styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Interfaces
interface ProductImage {
  url: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  finalPrice: number;
  stock: number;
  images: ProductImage[];
}

const ProductCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get("/products/featured");
        if (response.data?.success && response.data?.data?.products) {
          setProducts(response.data.data.products);
        }
      } catch (error) {
        console.error("Failed to fetch carousel products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].url;
    }
    return "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=400&auto=format&fit=crop";
  };

  if (loading) return null; // Or a skeleton loader
  if (products.length === 0) return null;

  return (
    // ✨ Section Container with Deep Gradients
    <section className="relative w-full py-16 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-[#050505] dark:to-[#1a1a2e] overflow-hidden transition-colors duration-300">
      {/* 🌌 Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10">
        {/* Title Section */}
        <div className="flex flex-row items-end justify-between mb-10 px-1 sm:px-0">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-bold text-sm uppercase tracking-widest">
              <Sparkles size={16} />
              <span>Premium Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
              Featured Products
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium max-w-md">
              Top rated genuine parts curated for your Hyundai machine.
            </p>
          </div>

          {/* View All Button */}
          <Link
            href="/products"
            className="hidden sm:flex group items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white bg-white/50 dark:bg-white/10 backdrop-blur-md border border-gray-200 dark:border-white/20 px-5 py-2.5 rounded-full transition-all hover:bg-white dark:hover:bg-white/20 hover:shadow-lg"
          >
            <span>View All</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1.2}
          navigation
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            850: { slidesPerView: 3, spaceBetween: 28 },
            1150: { slidesPerView: 4, spaceBetween: 32 },
          }}
          className="!pb-14 !px-2 product-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="h-auto pt-2">
              <Link
                href={`/products/${product._id}`}
                className="block h-full group"
              >
                {/* ✨ Glass Card Container */}
                <div className="h-full flex flex-col bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[1.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300">
                  {/* Image Area - No Padding ("Athukuni") */}
                  <div className="relative h-60 w-full bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent flex items-center justify-center overflow-hidden border-b border-white/20 dark:border-white/5">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-blue-400/10 dark:bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <Image
                      src={getImageUrl(product)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      // Using object-contain so the part is fully visible but fills the space nicely
                      className="object-contain w-full h-full p-2 group-hover:scale-110 transition-transform duration-700 ease-out z-10"
                      unoptimized={true}
                    />

                    {/* Stock/Sale Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                      {product.stock <= 0 ? (
                        <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-red-400/30">
                          OUT OF STOCK
                        </span>
                      ) : product.price > product.finalPrice ? (
                        <span className="bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-green-400/30">
                          SALE
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-grow relative">
                    {/* Category Tag */}
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                        <Tag size={10} /> {product.category}
                      </span>
                    </div>

                    <h3
                      className="text-gray-900 dark:text-white font-bold text-lg leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-dashed border-gray-300 dark:border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        {product.price > product.finalPrice && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-through mb-0.5">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                          ₹{product.finalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-blue-500/40">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile View All Button (Bottom) */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-xl transition-all w-full justify-center"
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Custom Styles for Swiper Pagination to match Glassmorphism */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #9ca3af !important;
          opacity: 0.5;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background-color: #2563eb !important; /* Blue-600 */
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }
        .dark .swiper-pagination-bullet-active {
          background-color: #22d3ee !important; /* Cyan-400 */
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #2563eb;
          background: rgba(255, 255, 255, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .dark .swiper-button-next,
        .dark .swiper-button-prev {
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }
        .swiper-button-disabled {
          opacity: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default ProductCarousel;
