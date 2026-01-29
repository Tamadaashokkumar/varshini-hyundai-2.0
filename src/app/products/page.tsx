// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Search,
//   Filter,
//   X,
//   ChevronDown,
//   SlidersHorizontal,
//   ShoppingCart,
//   Star,
//   ArrowRight,
//   Package,
// } from "lucide-react";
// import apiClient from "@/services/apiClient";

// // --- Types ---
// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   discountPrice?: number;
//   images: { url: string }[];
//   category: string;
//   stock: number;
//   averageRating?: number;
// }

// const CATEGORIES = [
//   "Engine",
//   "Brake",
//   "Electrical",
//   "Body",
//   "Suspension",
//   "Accessories",
// ];
// const SORT_OPTIONS = [
//   { label: "Newest Arrivals", value: "newest" },
//   { label: "Price: Low to High", value: "price_asc" },
//   { label: "Price: High to Low", value: "price_desc" },
//   { label: "Top Rated", value: "rating" },
// ];

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [priceRange, setPriceRange] = useState([0, 50000]);
//   const [sortBy, setSortBy] = useState("newest");

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (selectedCategory !== "All")
//         params.append("category", selectedCategory);
//       params.append("minPrice", priceRange[0].toString());
//       params.append("maxPrice", priceRange[1].toString());
//       params.append("sort", sortBy);

//       const response = await apiClient.get(`/products?${params.toString()}`);
//       if (response.data.success) {
//         setProducts(response.data.data.products || response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching products");
//     } finally {
//       setLoading(false);
//     }
//   }, [search, selectedCategory, priceRange, sortBy]);

//   useEffect(() => {
//     const timer = setTimeout(() => fetchProducts(), 500);
//     return () => clearTimeout(timer);
//   }, [fetchProducts]);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
//       {/* 🌌 Background Glows (Visible mostly in Dark) */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
//         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
//       </div>

//       {/* ================= HEADER SECTION ================= */}
//       <div className="relative z-20 sticky top-0 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
//                 Explore Spares
//               </h1>
//               <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
//                 Genuine parts for your Hyundai machine.
//               </p>
//             </div>

//             {/* Search Bar */}
//             <div className="relative w-full md:w-96 group">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl leading-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 sm:text-sm transition-all shadow-sm dark:shadow-none"
//                 placeholder="Search by part name or number..."
//               />
//             </div>

//             {/* Mobile Filter Toggle */}
//             <button
//               onClick={() => setIsMobileFilterOpen(true)}
//               className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-medium shadow-sm"
//             >
//               <Filter size={18} /> Filters & Sort
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* ================= SIDEBAR FILTERS (DESKTOP) ================= */}
//           <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-32 h-fit">
//             {/* Categories */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                 <Package
//                   size={18}
//                   className="text-cyan-600 dark:text-cyan-400"
//                 />{" "}
//                 Categories
//               </h3>
//               <div className="space-y-2">
//                 <button
//                   onClick={() => setSelectedCategory("All")}
//                   className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
//                     selectedCategory === "All"
//                       ? "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20"
//                       : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
//                   }`}
//                 >
//                   All Parts
//                 </button>
//                 {CATEGORIES.map((cat) => (
//                   <button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
//                       selectedCategory === cat
//                         ? "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20"
//                         : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
//                     }`}
//                   >
//                     {cat}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Price Range */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//                 <SlidersHorizontal
//                   size={18}
//                   className="text-purple-600 dark:text-purple-400"
//                 />
//                 Price Range
//               </h3>
//               <div className="px-2">
//                 <input
//                   type="range"
//                   min="0"
//                   max="50000"
//                   step="500"
//                   value={priceRange[1]}
//                   onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
//                   className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-500"
//                 />
//                 <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
//                   <span>₹0</span>
//                   <span className="text-gray-900 dark:text-white">
//                     Up to ₹{priceRange[1].toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Sort By */}
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//                 Sort By
//               </h3>
//               <div className="relative">
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer shadow-sm"
//                 >
//                   {SORT_OPTIONS.map((opt) => (
//                     <option
//                       key={opt.value}
//                       value={opt.value}
//                       className="bg-white text-gray-900 dark:bg-[#1a1d29] dark:text-white"
//                     >
//                       {opt.label}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
//           </aside>

//           {/* ================= PRODUCT GRID ================= */}
//           <div className="flex-1">
//             {/* Active Filters Bar */}
//             {(selectedCategory !== "All" || search) && (
//               <div className="mb-6 flex flex-wrap gap-2">
//                 {selectedCategory !== "All" && (
//                   <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-full text-xs text-cyan-700 dark:text-cyan-400 flex items-center gap-1 font-medium">
//                     Category: {selectedCategory}
//                     <button onClick={() => setSelectedCategory("All")}>
//                       <X size={12} />
//                     </button>
//                   </span>
//                 )}
//                 {search && (
//                   <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-full text-xs text-purple-700 dark:text-purple-400 flex items-center gap-1 font-medium">
//                     Search: "{search}"
//                     <button onClick={() => setSearch("")}>
//                       <X size={12} />
//                     </button>
//                   </span>
//                 )}
//                 <button
//                   onClick={() => {
//                     setSelectedCategory("All");
//                     setSearch("");
//                   }}
//                   className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white underline ml-2"
//                 >
//                   Clear All
//                 </button>
//               </div>
//             )}

//             {loading ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[1, 2, 3, 4, 5, 6].map((i) => (
//                   <div
//                     key={i}
//                     className="bg-white dark:bg-white/5 rounded-[1.5rem] h-96 animate-pulse border border-gray-100 dark:border-white/5 shadow-sm"
//                   ></div>
//                 ))}
//               </div>
//             ) : products.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-20 text-center">
//                 <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-full mb-4">
//                   <Package
//                     size={64}
//                     className="text-gray-400 dark:text-gray-600"
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                   No Products Found
//                 </h3>
//                 <p className="text-gray-500 dark:text-gray-500 mt-2 max-w-md">
//                   We couldn't find any parts matching your filters. Try
//                   adjusting your search or category.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setSelectedCategory("All");
//                     setSearch("");
//                   }}
//                   className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {products.map((product) => (
//                   <ProductCard key={product._id} product={product} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= MOBILE FILTER DRAWER ================= */}
//       <AnimatePresence>
//         {isMobileFilterOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
//               onClick={() => setIsMobileFilterOpen(false)}
//             />
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 200 }}
//               className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-[#0f111a] border-l border-gray-200 dark:border-white/10 z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
//             >
//               <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                   Filters
//                 </h2>
//                 <button
//                   onClick={() => setIsMobileFilterOpen(false)}
//                   className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               {/* Mobile content uses same styling logic as Sidebar... just adapt colors */}
//               <div className="space-y-8">
//                 {/* ... Mobile filter content (Keeping it brief, use same classes as Desktop) ... */}
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
//                     Sort By
//                   </h3>
//                   <select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white outline-none"
//                   >
//                     {SORT_OPTIONS.map((opt) => (
//                       <option
//                         key={opt.value}
//                         value={opt.value}
//                         className="bg-white text-gray-900 dark:bg-[#1a1d29] dark:text-white"
//                       >
//                         {opt.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
//                     Categories
//                   </h3>
//                   <div className="space-y-2">
//                     {CATEGORIES.map((cat) => (
//                       <label
//                         key={cat}
//                         className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg cursor-pointer border border-gray-100 dark:border-transparent"
//                       >
//                         <input
//                           type="radio"
//                           name="mobile_cat"
//                           checked={selectedCategory === cat}
//                           onChange={() => setSelectedCategory(cat)}
//                           className="accent-cyan-600 dark:accent-cyan-500 w-4 h-4"
//                         />
//                         <span
//                           className={
//                             selectedCategory === cat
//                               ? "text-cyan-700 dark:text-cyan-400 font-medium"
//                               : "text-gray-700 dark:text-gray-300"
//                           }
//                         >
//                           {cat}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setIsMobileFilterOpen(false)}
//                   className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
//                 >
//                   Show Results
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ================= PRODUCT CARD COMPONENT =================
// function ProductCard({ product }: { product: Product }) {
//   const price = product.price;
//   const discountPrice = product.discountPrice || 0;
//   const finalPrice = discountPrice > 0 ? discountPrice : price;
//   const discount =
//     discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       whileHover={{ y: -8 }}
//       className="group h-full"
//     >
//       <Link href={`/products/${product._id}`} className="block h-full">
//         {/* Card Container:
//            Light Mode: White bg, subtle border, soft shadow
//            Dark Mode: Smoked bg, subtle light border, glow on hover
//         */}
//         <div className="h-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.5rem] overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col relative">
//           {/* Image Area - FIXED for Vertical/Horizontal */}
//           <div className="relative aspect-square p-6 bg-gray-50 dark:bg-[#121212] overflow-hidden flex items-center justify-center border-b border-gray-100 dark:border-white/5">
//             {/* Hover Glow Effect */}
//             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//             {product.images?.[0] ? (
//               <Image
//                 src={product.images[0].url}
//                 alt={product.name}
//                 fill
//                 // object-contain ensures the image fits perfectly without cropping, regardless of orientation
//                 className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out z-10"
//               />
//             ) : (
//               <Package size={48} className="text-gray-300 dark:text-gray-600" />
//             )}

//             {discount > 0 && (
//               <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-20">
//                 -{discount}%
//               </span>
//             )}

//             {/* Quick View Button */}
//             <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
//               <div className="bg-white dark:bg-black/80 backdrop-blur-md text-cyan-600 dark:text-cyan-400 p-3 rounded-full shadow-lg border border-gray-100 dark:border-white/10 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-colors">
//                 <ArrowRight size={18} />
//               </div>
//             </div>
//           </div>

//           {/* Details */}
//           <div className="p-5 flex-1 flex flex-col bg-white dark:bg-transparent">
//             <div className="mb-2">
//               <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2 py-1 rounded border border-cyan-100 dark:border-transparent">
//                 {product.category}
//               </span>
//             </div>

//             <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-500 transition-colors">
//               {product.name}
//             </h3>

//             {/* Rating */}
//             <div className="flex items-center gap-1 mb-3">
//               <Star size={12} className="text-amber-400 fill-current" />
//               <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
//                 {product.averageRating || 4.5}
//               </span>
//               <span className="text-xs text-gray-400">(24 reviews)</span>
//             </div>

//             <div className="mt-auto pt-3 border-t border-dashed border-gray-200 dark:border-white/10 flex items-center justify-between">
//               <div className="flex flex-col">
//                 <span className="text-lg font-bold text-gray-900 dark:text-white">
//                   ₹{finalPrice.toLocaleString()}
//                 </span>
//                 {discount > 0 && (
//                   <span className="text-xs text-gray-400 line-through">
//                     ₹{product.price.toLocaleString()}
//                   </span>
//                 )}
//               </div>
//               <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-sm">
//                 <ShoppingCart size={16} />
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  SlidersHorizontal,
  ShoppingCart,
  Star,
  ArrowRight,
  Package,
} from "lucide-react";
import apiClient from "@/services/apiClient";

// --- Types ---
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: { url: string }[];
  category: string;
  stock: number;
  averageRating?: number;
}

const CATEGORIES = [
  "Engine",
  "Brake",
  "Electrical",
  "Body",
  "Suspension",
  "Accessories",
];
const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("newest");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory !== "All")
        params.append("category", selectedCategory);
      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());
      params.append("sort", sortBy);

      const response = await apiClient.get(`/products?${params.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data.products || response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, priceRange, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    // Changed main bg to a rich dark gradient to make Glassmorphism pop
    <div className="p-24 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#050505] dark:to-[#1a1a2e] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      {/* 🌌 Background Glows - Enhanced for Glass Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px]"></div>
      </div>

      {/* ================= HEADER SECTION (Glass) ================= */}
      <div className="relative z-20 sticky top-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                Explore Spares
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 font-medium">
                Genuine parts for your Hyundai machine.
              </p>
            </div>

            {/* Search Bar (Glass Style) */}
            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-white/20 dark:border-white/10 rounded-xl leading-5 bg-white/40 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 sm:text-sm transition-all shadow-inner"
                placeholder="Search by part name or number..."
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-sm font-medium shadow-sm"
            >
              <Filter size={18} /> Filters & Sort
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ================= SIDEBAR FILTERS (Glass Panel) ================= */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-32 h-fit p-6 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package
                  size={18}
                  className="text-cyan-600 dark:text-cyan-400"
                />{" "}
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                    selectedCategory === "All"
                      ? "bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 shadow-inner"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10"
                  }`}
                >
                  All Parts
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all font-medium ${
                      selectedCategory === cat
                        ? "bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/30 shadow-inner"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
                Price Range
              </h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-1.5 bg-gray-200/50 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  <span>₹0</span>
                  <span className="text-gray-900 dark:text-white">
                    Up to ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sort By
              </h3>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/50 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-500/50 appearance-none cursor-pointer shadow-sm backdrop-blur-md"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-white text-gray-900 dark:bg-[#1a1d29] dark:text-white"
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </aside>

          {/* ================= PRODUCT GRID ================= */}
          <div className="flex-1">
            {/* Active Filters Bar */}
            {(selectedCategory !== "All" || search) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategory !== "All" && (
                  <span className="px-3 py-1 bg-cyan-100/50 dark:bg-cyan-500/20 backdrop-blur-sm border border-cyan-200/50 dark:border-cyan-500/30 rounded-full text-xs text-cyan-800 dark:text-cyan-300 flex items-center gap-1 font-medium shadow-sm">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {search && (
                  <span className="px-3 py-1 bg-purple-100/50 dark:bg-purple-500/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-500/30 rounded-full text-xs text-purple-800 dark:text-purple-300 flex items-center gap-1 font-medium shadow-sm">
                    Search: "{search}"
                    <button onClick={() => setSearch("")}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearch("");
                  }}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white/20 dark:bg-white/5 rounded-[1.5rem] h-96 animate-pulse border border-white/30 dark:border-white/5 shadow-sm"
                  ></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-white/30 dark:bg-white/5 p-6 rounded-full mb-4 backdrop-blur-sm">
                  <Package
                    size={64}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  No Products Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
                  We couldn't find any parts matching your filters. Try
                  adjusting your search or category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearch("");
                  }}
                  className="mt-6 px-6 py-2 bg-cyan-600/90 hover:bg-cyan-500 text-white rounded-lg transition-all shadow-lg shadow-cyan-500/30 backdrop-blur-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-white/80 dark:bg-[#0f111a]/90 backdrop-blur-2xl border-l border-white/20 dark:border-white/10 z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 bg-gray-100/50 dark:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Mobile Sort */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Sort By
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white outline-none"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-white text-gray-900 dark:bg-[#1a1d29] dark:text-white"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Mobile Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-white/5 rounded-lg cursor-pointer border border-gray-100/50 dark:border-transparent"
                      >
                        <input
                          type="radio"
                          name="mobile_cat"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="accent-cyan-600 dark:accent-cyan-500 w-4 h-4"
                        />
                        <span
                          className={
                            selectedCategory === cat
                              ? "text-cyan-700 dark:text-cyan-400 font-medium"
                              : "text-gray-700 dark:text-gray-300"
                          }
                        >
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ================= PRODUCT CARD COMPONENT (GLASS & NO PADDING) =================
function ProductCard({ product }: { product: Product }) {
  const price = product.price;
  const discountPrice = product.discountPrice || 0;
  const finalPrice = discountPrice > 0 ? discountPrice : price;
  const discount =
    discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link href={`/products/${product._id}`} className="block h-full">
        {/* GLASSMORPHISM CARD STYLES:
           1. bg-white/20 dark:bg-white/5 -> Translucent background
           2. backdrop-blur-xl -> The blur effect
           3. border-white/30 -> Subtle frosty border
        */}
        <div className="h-full bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[1.5rem] overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col relative">
          {/* IMAGE AREA - NO PADDING 
              Removed p-6, removed p-4 on Image.
              Added w-full h-full object-cover so it sticks to edges.
          */}
          <div className="relative aspect-square w-full bg-gradient-to-b from-white/10 to-transparent dark:from-white/5 dark:to-transparent overflow-hidden flex items-center justify-center border-b border-white/10">
            {/* Hover Glow Effect inside image area */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                // object-cover makes it fill completely (athukuni untundi), object-contain keeps aspect ratio.
                // Using object-contain combined with NO padding to ensure it reaches edges if possible without cropping awkwardly.
                // If you want it STRICTLY sticking to all 4 corners and cropping is okay, change to 'object-cover'.
                className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500 ease-out z-0"
              />
            ) : (
              <Package size={48} className="text-gray-400/50" />
            )}

            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-20 border border-red-400/20">
                -{discount}%
              </span>
            )}

            {/* Quick View Button */}
            <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md text-cyan-600 dark:text-cyan-400 p-3 rounded-full shadow-lg border border-white/20 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-colors">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-5 flex-1 flex flex-col bg-transparent">
            <div className="mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 bg-cyan-100/50 dark:bg-cyan-500/20 px-2 py-1 rounded border border-cyan-200/50 dark:border-cyan-500/30">
                {product.category}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors drop-shadow-sm">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <Star size={12} className="text-amber-400 fill-current" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {product.averageRating || 4.5}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (24 reviews)
              </span>
            </div>

            <div className="mt-auto pt-3 border-t border-dashed border-gray-300/50 dark:border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{finalPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="w-9 h-9 rounded-full bg-white/40 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-sm backdrop-blur-sm border border-white/20">
                <ShoppingCart size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
