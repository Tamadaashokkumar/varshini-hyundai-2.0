// // src/app/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image'; // 👈 Import Image
// import { ProductCard } from '@/components/ProductCard';
// import { Product, useStore } from '@/store/useStore';
// import apiClient from '@/services/apiClient';
// import toast from 'react-hot-toast';
// import { Search, Filter, ChevronRight, Sparkles } from 'lucide-react';
// import styles from './page.module.css';

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { setCart, toggleCartDrawer } = useStore();

//   const categories = [
//     'all',
//     'Engine',
//     'Brake',
//     'Electrical',
//     'Body',
//     'Accessories',
//     'Suspension',
//     'Transmission'
//   ];

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 12, page: 1 };
//       if (selectedCategory !== 'all') {
//         params.category = selectedCategory;
//       }

//       const response = await apiClient.get('/products', { params });

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error: any) {
//       console.error('Error fetching products:', error);
//       toast.error('Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async (product: Product) => {
//     try {
//       const response = await apiClient.post('/cart/add', {
//         productId: product._id,
//         quantity: 1,
//       });

//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success(`${product.name} added to cart!`);
//         toggleCartDrawer();
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.error || 'Failed to add to cart';
//       toast.error(errorMessage);
//     }
//   };

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     // 👇 Fixed Overlap: Added 'pt-20' to push content below Navbar
//     <div className={`${styles.container} pt-20`}>

//       {/* Hero Section */}
//       <section className={`${styles.hero} relative overflow-hidden min-h-[600px] flex items-center`}>
//         <div className={styles.heroBackground}>
//           <motion.div
//             className={styles.heroGradient}
//             animate={{
//               backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: 'linear',
//             }}
//           />
//         </div>

//         <div className={`${styles.heroContent} container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center`}>

//           {/* Left Side: Text */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="z-10"
//           >
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6 }}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-hyundai-blue/20 backdrop-blur-sm rounded-full mb-6 border border-hyundai-blue/30"
//             >
//               <Sparkles className="text-blue-400" size={20} />
//               <span className="text-sm font-semibold text-blue-300">
//                 Premium Genuine Parts
//               </span>
//             </motion.div>

//             <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
//               <motion.span
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 className="text-white block"
//               >
//                 Hyundai Spares
//               </motion.span>
//               <motion.span
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6, delay: 0.5 }}
//                 className="text-transparent bg-clip-text bg-gradient-to-r from-hyundai-blue to-blue-400"
//               >
//                 Engineered for Excellence
//               </motion.span>
//             </h1>

//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6, delay: 0.7 }}
//               className="text-lg text-gray-300 mb-8 max-w-lg"
//             >
//               Discover premium genuine spare parts for your Hyundai vehicle.
//               Quality assured. Performance guaranteed.
//             </motion.p>

//             <motion.button
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.9 }}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="px-8 py-4 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 flex items-center gap-2 hover:gap-3 transition-all"
//               onClick={() => {
//                 document.getElementById('products')?.scrollIntoView({
//                   behavior: 'smooth'
//                 });
//               }}
//             >
//               Explore Products
//               <ChevronRight size={20} />
//             </motion.button>
//           </motion.div>

//           {/* Right Side: Car Image */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 1, delay: 0.5 }}
//             className="relative z-10 hidden md:block"
//           >
//             <motion.div
//               animate={{ y: [0, -15, 0] }}
//               transition={{
//                 duration: 6,
//                 repeat: Infinity,
//                 ease: "easeInOut"
//               }}
//               className="relative w-full h-[300px] md:h-[400px]"
//             >
//               {/* 🛑 MAKE SURE TO ADD YOUR IMAGE TO public/images/hyundai-hero.png */}
//               <Image
//                 src="/images/hyundai-hero.png" // Replace with your actual file path
//                 alt="Hyundai Premium Car"
//                 fill
//                 className="object-contain drop-shadow-2xl"
//                 priority
//               />
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Scroll indicator */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1, delay: 1.2 }}
//           className="absolute bottom-8 left-1/2 -translate-x-1/2"
//         >
//           <motion.div
//             animate={{ y: [0, 10, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//             className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2"
//           >
//             <div className="w-1 h-2 bg-white rounded-full" />
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Products Section */}
//       <section id="products" className={styles.productsSection}>
//         <div className={styles.productsContainer}>
//           {/* Section header */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
//               Our Premium Collection
//             </h2>
//             <p className="text-gray-400">
//               Browse through our extensive range of genuine Hyundai spare parts
//             </p>
//           </motion.div>

//           {/* Filters */}
//           <div className={styles.filters}>
//             {/* Search bar */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className={styles.searchContainer}
//             >
//               <Search className={styles.searchIcon} size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by part name or number..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={styles.searchInput}
//               />
//             </motion.div>

//             {/* Category filters */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               className={styles.categoryFilters}
//             >
//               <Filter size={20} className="text-hyundai-blue" />
//               <div className={styles.categoryButtons}>
//                 {categories.map((category) => (
//                   <motion.button
//                     key={category}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setSelectedCategory(category)}
//                     className={`${styles.categoryButton} ${
//                       selectedCategory === category ? styles.categoryButtonActive : ''
//                     }`}
//                   >
//                     {category === 'all' ? 'All Parts' : category}
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Products grid */}
//           {loading ? (
//             <div className={styles.loadingContainer}>
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//                 className={styles.loader}
//               />
//               <p className="text-gray-600 dark:text-gray-400 mt-4">
//                 Loading premium parts...
//               </p>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className={styles.emptyState}
//             >
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-2xl font-bold mb-2">No products found</h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Try adjusting your filters or search query
//               </p>
//             </motion.div>
//           ) : (
//             <div className={styles.productsGrid}>
//               {filteredProducts.map((product, index) => (
//                 <ProductCard
//                   key={product._id}
//                   product={product}
//                   onAddToCart={handleAddToCart}
//                   index={index}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// // src/app/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { ProductCard } from "@/components/ProductCard";
// import { Product, useStore } from "@/store/useStore";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import { Search, Filter, ChevronRight, Sparkles } from "lucide-react";
// import ProductCarousel from "@/components/ProductCarousel";
// import FestivalCarousel from "@/components/FestivalCarousel";
// import ReviewsCarousel from "@/components/ReviewsCarousel";

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const { setCart, toggleCartDrawer } = useStore();

//   const categories = [
//     "all",
//     "Engine",
//     "Brake",
//     "Electrical",
//     "Body",
//     "Accessories",
//     "Suspension",
//     "Transmission",
//   ];

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 12, page: 1 };
//       if (selectedCategory !== "all") {
//         params.category = selectedCategory;
//       }

//       const response = await apiClient.get("/products", { params });

//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching products:", error);
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async (product: Product) => {
//     try {
//       const response = await apiClient.post("/cart/add", {
//         productId: product._id,
//         quantity: 1,
//       });

//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success(`${product.name} added to cart!`);
//         toggleCartDrawer();
//       }
//     } catch (error: any) {
//       const errorMessage =
//         error.response?.data?.error || "Failed to add to cart";
//       toast.error(errorMessage);
//     }
//   };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.partNumber?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//       {/* 🎨 CSS Styles for Smooth Gradient Animation
//         (Adding this inline style to ensure it works without config changes)
//       */}
//       <style jsx global>{`
//         @keyframes gradient-xy {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         .animate-gradient-bg {
//           background-size: 400% 400%;
//           animation: gradient-xy 15s ease infinite;
//         }
//         .animate-gradient-text {
//           background-size: 200% auto;
//           animation: gradient-xy 4s linear infinite;
//         }
//       `}</style>

//       {/* 🔥 BACKGROUND: 10-Color Moving Gradient
//         Using a blend of Blue, Purple, Pink, Teal, Indigo, Cyan, Violet, Emerald, Rose, Sky
//       */}
//       <div className="min-h-screen pt-20 transition-colors duration-500
//         bg-gradient-to-br from-blue-600 via-purple-600 via-pink-600 via-red-500 via-orange-500 via-yellow-500 via-green-600 via-teal-600 via-cyan-600 to-indigo-600
//         dark:from-blue-950 dark:via-purple-950 dark:via-fuchsia-900 dark:via-rose-900 dark:via-orange-900 dark:via-emerald-900 dark:via-teal-900 dark:via-cyan-900 dark:to-indigo-950
//         animate-gradient-bg text-gray-900 dark:text-white relative overflow-hidden"
//       >

//         {/* ✨ Glass Overlay to Soften the Colors (Readability Layer) */}
//         <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-[2px] z-0" />

//         {/* Hero Section */}
//         <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center z-10">

//           <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center py-10 md:py-0">
//             {/* Left Side: Text */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-center md:text-left"
//             >
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6 }}
//                 // ✨ Glass Badge
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/50 dark:border-white/20 shadow-lg"
//               >
//                 <Sparkles
//                   className="text-blue-600 dark:text-blue-300"
//                   size={20}
//                 />
//                 <span className="text-sm font-bold text-gray-800 dark:text-white tracking-wide">
//                   Premium Genuine Parts
//                 </span>
//               </motion.div>

//               <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
//                 {/* ✨ Animated Text Gradient 1 */}
//                 <motion.span
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.3 }}
//                   className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 animate-gradient-text block pb-2"
//                 >
//                   Hyundai Spares
//                 </motion.span>

//                 {/* ✨ Animated Text Gradient 2 */}
//                 <motion.span
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.5 }}
//                   className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-300 dark:via-cyan-300 dark:to-blue-300 animate-gradient-text"
//                 >
//                   Engineered for Excellence
//                 </motion.span>
//               </h1>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.7 }}
//                 className="text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed drop-shadow-sm"
//               >
//                 Discover premium genuine spare parts for your Hyundai vehicle.
//                 Quality assured. Performance guaranteed.
//               </motion.p>

//               <motion.button
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.9 }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-9 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/30 flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0 border border-white/20 animate-gradient-text bg-[length:200%_auto]"
//                 onClick={() => {
//                   document.getElementById("products")?.scrollIntoView({
//                     behavior: "smooth",
//                   });
//                 }}
//               >
//                 Explore Products
//                 <ChevronRight size={20} />
//               </motion.button>
//             </motion.div>

//             {/* Right Side: Car Image */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1, delay: 0.5 }}
//               className="relative z-10 flex justify-center"
//             >
//               {/* Backglow for car */}
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/40 rounded-full blur-[90px] -z-10 animate-pulse" />

//               <motion.div
//                 animate={{ y: [0, -15, 0] }}
//                 transition={{
//                   duration: 6,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//                 className="relative w-full max-w-[450px] md:max-w-full h-[280px] md:h-[450px]"
//               >
//                 <Image
//                   src="/images/hyundai-hero.png" // Ensure this image exists in public folder
//                   alt="Hyundai Premium Car"
//                   fill
//                   className="object-contain drop-shadow-2xl"
//                   priority
//                 />
//               </motion.div>
//             </motion.div>
//           </div>
//         </section>

//         <FestivalCarousel />
//         <ProductCarousel />

//         {/* Products Section */}
//         <section
//           id="products"
//           className="py-16 px-4 md:px-8 relative z-10"
//         >
//           <div className="max-w-7xl mx-auto">

//             {/* Section header */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-sm">
//                 Our Premium Collection
//               </h2>
//               <div className="h-1.5 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4 animate-gradient-text"></div>
//               <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
//                 Browse through our extensive range of genuine Hyundai spare parts designed for performance and durability.
//               </p>
//             </motion.div>

//             {/* Filters & Search - Glass Cards */}
//             <div className="flex flex-col md:flex-row gap-6 mb-12">

//               {/* Search bar */}
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 className="relative w-full md:w-96"
//               >
//                 <Search
//                   className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search by part name or number..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   // ✨ Frosted Input with Backdrop Blur
//                   className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-black/30 border border-white/40 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 backdrop-blur-xl shadow-lg transition-all"
//                 />
//               </motion.div>

//               {/* Category filters */}
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide"
//               >
//                 <div className="p-3.5 bg-white/60 dark:bg-black/30 rounded-2xl border border-white/40 dark:border-white/10 backdrop-blur-xl text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-sm">
//                    <Filter size={20} />
//                 </div>

//                 <div className="flex gap-3 p-1">
//                   {categories.map((category) => (
//                     <motion.button
//                       key={category}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedCategory(category)}
//                       // ✨ Frosted Buttons
//                       className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border backdrop-blur-xl shadow-sm ${
//                         selectedCategory === category
//                           ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg shadow-purple-500/30 animate-gradient-text bg-[length:200%_auto]"
//                           : "bg-white/60 dark:bg-black/30 text-gray-800 dark:text-gray-200 border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:border-blue-300"
//                       }`}
//                     >
//                       {category === "all" ? "All Parts" : category}
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             </div>

//             {/* Products grid */}
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-14 h-14 border-[5px] border-blue-500 border-t-transparent rounded-full mb-6 shadow-lg shadow-blue-500/30"
//                 />
//                 <p className="text-gray-600 dark:text-gray-300 font-semibold text-lg animate-pulse">
//                   Fetching premium parts...
//                 </p>
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 // ✨ Glass Empty State
//                 className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-[2rem] backdrop-blur-md text-center px-4"
//               >
//                 <div className="text-7xl mb-6 opacity-80 drop-shadow-md">🔍</div>
//                 <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
//                   No products found
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 max-w-md">
//                   We couldn't find any parts matching your search. Try different keywords or browse all categories.
//                 </p>
//               </motion.div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                 {filteredProducts.map((product, index) => (
//                   <ProductCard
//                     key={product._id}
//                     product={product}
//                     onAddToCart={handleAddToCart}
//                     index={index}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//       <ReviewsCarousel />
//     </>
//   );
// }

// idhi main code for animation ki
// src/app/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { ProductCard } from "@/components/ProductCard";
// import { Product, useStore } from "@/store/useStore";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import { Search, Filter, ChevronRight, Sparkles } from "lucide-react";
// import ProductCarousel from "@/components/ProductCarousel";
// import FestivalCarousel from "@/components/FestivalCarousel";
// import ReviewsCarousel from "@/components/ReviewsCarousel";

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const { setCart, toggleCartDrawer } = useStore();

//   const categories = [
//     "all", "Engine", "Brake", "Electrical", "Body",
//     "Accessories", "Suspension", "Transmission",
//   ];

//   useEffect(() => {
//     fetchProducts();
//   }, [selectedCategory]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params: any = { limit: 12, page: 1 };
//       if (selectedCategory !== "all") {
//         params.category = selectedCategory;
//       }
//       const response = await apiClient.get("/products", { params });
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error: any) {
//       console.error("Error fetching products:", error);
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = async (product: Product) => {
//     try {
//       const response = await apiClient.post("/cart/add", {
//         productId: product._id,
//         quantity: 1,
//       });
//       if (response.data.success) {
//         setCart(response.data.data.cart);
//         toast.success(`${product.name} added to cart!`);
//         toggleCartDrawer();
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || "Failed to add to cart");
//     }
//   };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.partNumber?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <>
//       {/* 🔥 DIRECT CSS STYLES (Ultra-Rich 100-Color Spectrum Effect) */}
//       <style jsx global>{`
//         /* 1. Define the Animation Movement */
//         @keyframes gradientMove {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         /* 2. Light Mode: Full Pastel Spectrum (Every Shade possible) */
//         .gradient-bg-animate {
//           background: linear-gradient(
//             45deg,
//             #ff9a9e, #fad0c4, #fad0c4, #ffd1ff, #fbc2eb,
//             #a18cd1, #a6c0fe, #f68084, #84fab0, #8fd3f4,
//             #cfd9df, #e2ebf0, #a1c4fd, #c2e9fb, #fccb90,
//             #d57eeb, #fccb90, #96e6a1, #84fab0, #fecfef,
//             #ff9a9e, #fecfef, #feada6, #f5efef, #d4fc79,
//             #96e6a1, #84fab0, #8fd3f4, #a6c0fe, #f68084
//             /* This long chain blends into "100s" of visible colors */
//           );
//           background-size: 600% 600%; /* Increased size for smoother transition */
//           animation: gradientMove 20s ease infinite; /* Slower for better visual */
//         }

//         /* 3. Dark Mode: Deep Space Spectrum (Rich & Dark) */
//         .dark .gradient-bg-animate {
//           background: linear-gradient(
//             45deg,
//             #0f2027, #203a43, #2c5364, #000000, #0f9b0f,
//             #000428, #004e92, #240b36, #c31432, #240b36,
//             #141E30, #243B55, #000000, #434343, #020617,
//             #232526, #414345, #1e130c, #9a8478, #1e130c,
//             #3a1c71, #d76d77, #ffaf7b, #000000, #0f2027,
//             #16222a, #3a6073, #16222a, #000000, #2c5364
//             /* Deep rich color transitions covering the full dark spectrum */
//           );
//           background-size: 600% 600%;
//           animation: gradientMove 25s ease infinite;
//         }
//       `}</style>

//       {/* 🔥 Main Container with the custom class */}
//       <div className="min-h-screen pt-20 transition-colors duration-500 gradient-bg-animate text-gray-900 dark:text-white relative overflow-hidden">

//         {/* ✨ Glass Overlay (Slightly increased blur to blend the 100 colors smoothly) */}
//         <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-[5px] z-0" />

//         {/* Hero Section */}
//         <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center z-10">
//           <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center py-10 md:py-0">
//             {/* Left Side: Text */}
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="text-center md:text-left"
//             >
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/50 dark:border-white/20 shadow-lg"
//               >
//                 <Sparkles className="text-blue-600 dark:text-blue-300" size={20} />
//                 <span className="text-sm font-bold text-gray-800 dark:text-white tracking-wide">
//                   Premium Genuine Parts
//                 </span>
//               </motion.div>

//               <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
//                 <span className="block text-gray-900 dark:text-white drop-shadow-md mb-2">
//                   Hyundai Spares
//                 </span>
//                 {/* Text Gradient */}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-pink-600 to-purple-700 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 animate-pulse">
//                   Engineered for Excellence
//                 </span>
//               </h1>

//               <p className="text-lg text-gray-800 dark:text-gray-200 mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed drop-shadow-sm">
//                 Discover premium genuine spare parts for your Hyundai vehicle.
//                 Quality assured. Performance guaranteed.
//               </p>

//               <button
//                 className="px-9 py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold shadow-2xl flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0 border border-white/20 hover:scale-105 active:scale-95"
//                 onClick={() => {
//                   document.getElementById("products")?.scrollIntoView({
//                     behavior: "smooth",
//                   });
//                 }}
//               >
//                 Explore Products
//                 <ChevronRight size={20} />
//               </button>
//             </motion.div>

//             {/* Right Side: Car Image */}
//             <motion.div
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1, delay: 0.5 }}
//               className="relative z-10 flex justify-center"
//             >
//               {/* Backglow */}
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/40 dark:bg-blue-500/20 rounded-full blur-[80px] -z-10" />

//               <motion.div
//                 animate={{ y: [0, -15, 0] }}
//                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//                 className="relative w-full max-w-[450px] md:max-w-full h-[280px] md:h-[450px]"
//               >
//                 <Image
//                   src="/images/hyundai-hero.png"
//                   alt="Hyundai Premium Car"
//                   fill
//                   className="object-contain drop-shadow-2xl"
//                   priority
//                 />
//               </motion.div>
//             </motion.div>
//           </div>
//         </section>

//         <FestivalCarousel />
//         <ProductCarousel />

//         {/* Products Section */}
//         <section id="products" className="py-16 px-4 md:px-8 relative z-10">
//           <div className="max-w-7xl mx-auto">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white drop-shadow-md">
//                 Our Premium Collection
//               </h2>
//               <div className="h-1 w-24 bg-blue-600 dark:bg-purple-500 mx-auto rounded-full mb-4"></div>
//               <p className="text-gray-800 dark:text-gray-200 max-w-2xl mx-auto font-medium">
//                 Browse through our extensive range of genuine Hyundai spare parts.
//               </p>
//             </div>

//             {/* Filters */}
//             <div className="flex flex-col md:flex-row gap-6 mb-12">
//               <div className="relative w-full md:w-96">
//                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-300" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search parts..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-black/30 border border-white/60 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white backdrop-blur-xl shadow-lg transition-all"
//                 />
//               </div>

//               <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
//                 <div className="p-3.5 bg-white/60 dark:bg-black/30 rounded-2xl border border-white/60 dark:border-white/10 backdrop-blur-xl text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-sm">
//                    <Filter size={20} />
//                 </div>
//                 <div className="flex gap-3 p-1">
//                   {categories.map((category) => (
//                     <button
//                       key={category}
//                       onClick={() => setSelectedCategory(category)}
//                       className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border backdrop-blur-xl shadow-sm ${
//                         selectedCategory === category
//                           ? "bg-gray-900 dark:bg-blue-600 text-white border-transparent shadow-lg"
//                           : "bg-white/60 dark:bg-black/30 text-gray-800 dark:text-gray-200 border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10"
//                       }`}
//                     >
//                       {category === "all" ? "All Parts" : category}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Products Grid */}
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <div className="w-14 h-14 border-[5px] border-blue-600 border-t-transparent rounded-full mb-6 shadow-lg animate-spin" />
//                 <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
//                   Fetching premium parts...
//                 </p>
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-20 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-[2rem] backdrop-blur-md text-center px-4">
//                 <div className="text-7xl mb-6 opacity-80 drop-shadow-md">🔍</div>
//                 <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No products found</h3>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                 {filteredProducts.map((product, index) => (
//                   <ProductCard
//                     key={product._id}
//                     product={product}
//                     onAddToCart={handleAddToCart}
//                     index={index}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>
//       </div>
//       <ReviewsCarousel />
//     </>
//   );
// }

// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { Product, useStore } from "@/store/useStore";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import { Search, Filter, ChevronRight, Sparkles } from "lucide-react";
import ProductCarousel from "@/components/ProductCarousel";
import FestivalCarousel from "@/components/FestivalCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import PhoneBanner from "@/components/PhoneBanner";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { setCart, toggleCartDrawer } = useStore();

  const categories = [
    "all",
    "Engine",
    "Brake",
    "Electrical",
    "Body",
    "Accessories",
    "Suspension",
    "Transmission",
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { limit: 12, page: 1 };
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      const response = await apiClient.get("/products", { params });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await apiClient.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success(`${product.name} added to cart!`);
        toggleCartDrawer();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add to cart");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.partNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      {/* 🔥 CSS Styles for Hero Animation Only */}
      <style jsx global>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .hero-gradient-animate {
          background: linear-gradient(
            45deg,
            /* Reds & Pinks */ #ff9a9e,
            #fad0c4,
            #ffecd2,
            #fcb69f,
            #ff9a9e,
            #fecfef,
            #feada6,
            #ffdde1,
            #ee9ca7,
            /* Oranges & Yellows */ #fda085,
            #f6d365,
            #ff9a9e,
            #fbc2eb,
            #fa709a,
            #fee140,
            #fa709a,
            #ff0844,
            /* Greens & Teals */ #d4fc79,
            #96e6a1,
            #84fab0,
            #8fd3f4,
            #43e97b,
            #38f9d7,
            #00c6fb,
            #005bea,
            /* Blues & Cyans */ #a6c0fe,
            #f68084,
            #a18cd1,
            #fbc2eb,
            #8fd3f4,
            #84fab0,
            #12c2e9,
            #c471ed,
            /* Purples & Violets */ #a1c4fd,
            #c2e9fb,
            #fccb90,
            #d57eeb,
            #96e6a1,
            #fecfef,
            #667eea,
            #764ba2,
            /* Soft Pastels */ #e0c3fc,
            #8ec5fc,
            #e0c3fc,
            #cfd9df,
            #e2ebf0,
            #a8edea,
            #fed6e3,
            /* Loop back colors */ #ff9a9e,
            #fecfef,
            #feada6,
            #f5efef,
            #d4fc79,
            #96e6a1,
            #84fab0,
            #8fd3f4
          );
          /* 🔥 Increased size to blend 50+ colors smoothly */
          background-size: 1000% 1000%;
          animation: gradientMove 110s linear infinite; /* Slower speed for smooth flow */
        }

        .dark .hero-gradient-animate {
          background: linear-gradient(
            45deg,
            /* Deep Space Blues */ #000000,
            #0f2027,
            #203a43,
            #2c5364,
            #243b55,
            #141e30,
            #0f0c29,
            #302b63,
            /* Cosmic Purples */ #24243e,
            #232526,
            #414345,
            #1e130c,
            #485563,
            #29323c,
            #3a1c71,
            #d76d77,
            /* Nebula Pinks & Reds */ #ffaf7b,
            #434343,
            #000000,
            #0f9b0f,
            #203a43,
            #2c5364,
            #cc2b5e,
            #753a88,
            /* Cyber Cyans & Teals */ #000428,
            #004e92,
            #240b36,
            #c31432,
            #1a2a6c,
            #b21f1f,
            #fdbb2d,
            #021b79,
            /* Deep Greens & Golds */ #0575e6,
            #134e5e,
            #71b280,
            #000000,
            #434343,
            #0f2027,
            #203a43,
            #2c5364,
            /* Loop back */ #243b55,
            #141e30,
            #0f0c29,
            #302b63,
            #24243e
          );
          background-size: 1000% 1000%;
          animation: gradientMove 150s linear infinite;
        }
      `}</style>
      {/* Main Layout - Solid Background for body content */}
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
        <PhoneBanner />
        {/* 🔥 HERO SECTION ONLY 
           Added 'hero-gradient-animate' class here.
           Using 'min-h-[85vh]' to cover most of the initial viewport.
        */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center hero-gradient-animate rounded-b-[3rem] shadow-xl mb-12">
          {/* Glass Overlay for Hero Text Readability */}
          <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-[2px] z-0" />

          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
            {/* Left Side: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/50 dark:border-white/20 shadow-lg"
              >
                <Sparkles
                  className="text-blue-600 dark:text-blue-300"
                  size={20}
                />
                <span className="text-sm font-bold text-gray-800 dark:text-white tracking-wide">
                  Premium Genuine Parts
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                <span className="block text-gray-900 dark:text-white drop-shadow-md mb-2">
                  Hyundai Spares
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 animate-pulse">
                  Engineered for Excellence
                </span>
              </h1>

              <p className="text-lg text-gray-800 dark:text-gray-200 mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed drop-shadow-sm">
                Discover premium genuine spare parts for your Hyundai vehicle.
                Quality assured. Performance guaranteed.
              </p>

              <button
                className="px-9 py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl font-bold shadow-2xl flex items-center gap-2 hover:gap-3 transition-all mx-auto md:mx-0 border border-white/20 hover:scale-105 active:scale-95"
                onClick={() => {
                  document.getElementById("products")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Explore Products
                <ChevronRight size={20} />
              </button>
            </motion.div>

            {/* Right Side: Car Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative z-10 flex justify-center"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/40 dark:bg-blue-500/20 rounded-full blur-[80px] -z-10" />

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full max-w-[450px] md:max-w-full h-[280px] md:h-[450px]"
              >
                <Image
                  src="/images/hyundai-hero.png"
                  alt="Hyundai Premium Car"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Regular Sections with Clean Background */}
        <div className="space-y-16 pb-16">
          <FestivalCarousel />
          <ProductCarousel />

          {/* Products Section */}
          <section id="products" className="px-4 md:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Our Premium Collection
                </h2>
                <div className="h-1 w-24 bg-blue-600 dark:bg-purple-500 mx-auto rounded-full mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
                  Browse through our extensive range of genuine Hyundai spare
                  parts.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-6 mb-12">
                <div className="relative w-full md:w-96">
                  <Search
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search parts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#0A101F] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm transition-all"
                  />
                </div>

                <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  <div className="p-3.5 bg-white dark:bg-[#0A101F] rounded-2xl border border-gray-200 dark:border-white/10 text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-sm">
                    <Filter size={20} />
                  </div>
                  <div className="flex gap-3 p-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border shadow-sm ${
                          selectedCategory === category
                            ? "bg-gray-900 dark:bg-blue-600 text-white border-transparent shadow-lg"
                            : "bg-white dark:bg-[#0A101F] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                        }`}
                      >
                        {category === "all" ? "All Parts" : category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-14 h-14 border-[5px] border-blue-600 border-t-transparent rounded-full mb-6 shadow-lg animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                    Fetching premium parts...
                  </p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0A101F] border border-gray-200 dark:border-white/10 rounded-[2rem] text-center px-4">
                  <div className="text-7xl mb-6 opacity-80">🔍</div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    No products found
                  </h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onAddToCart={handleAddToCart as any} // 'as any' ని యాడ్ చేయండి
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <ReviewsCarousel />
        </div>
      </div>
    </>
  );
}
