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
// import PhoneBanner from "@/components/PhoneBanner";
// import HeroGarageWidget from "@/components/HeroGarageWidget";
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
//       toast.error(error.response?.data?.error || "Failed to add to cart");
//     }
//   };

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       product.partNumber?.toLowerCase().includes(searchQuery.toLowerCase()),
//   );

//   return (
//     <>
//       {/* 🔥 CSS Styles for Hero Animation Only */}
//       <style jsx global>{`
//         @keyframes gradientMove {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }

//         .hero-gradient-animate {
//           background: linear-gradient(
//             45deg,
//             /* Reds & Pinks */ #ff9a9e,
//             #fad0c4,
//             #ffecd2,
//             #fcb69f,
//             #ff9a9e,
//             #fecfef,
//             #feada6,
//             #ffdde1,
//             #ee9ca7,
//             /* Oranges & Yellows */ #fda085,
//             #f6d365,
//             #ff9a9e,
//             #fbc2eb,
//             #fa709a,
//             #fee140,
//             #fa709a,
//             #ff0844,
//             /* Greens & Teals */ #d4fc79,
//             #96e6a1,
//             #84fab0,
//             #8fd3f4,
//             #43e97b,
//             #38f9d7,
//             #00c6fb,
//             #005bea,
//             /* Blues & Cyans */ #a6c0fe,
//             #f68084,
//             #a18cd1,
//             #fbc2eb,
//             #8fd3f4,
//             #84fab0,
//             #12c2e9,
//             #c471ed,
//             /* Purples & Violets */ #a1c4fd,
//             #c2e9fb,
//             #fccb90,
//             #d57eeb,
//             #96e6a1,
//             #fecfef,
//             #667eea,
//             #764ba2,
//             /* Soft Pastels */ #e0c3fc,
//             #8ec5fc,
//             #e0c3fc,
//             #cfd9df,
//             #e2ebf0,
//             #a8edea,
//             #fed6e3,
//             /* Loop back colors */ #ff9a9e,
//             #fecfef,
//             #feada6,
//             #f5efef,
//             #d4fc79,
//             #96e6a1,
//             #84fab0,
//             #8fd3f4
//           );
//           /* 🔥 Increased size to blend 50+ colors smoothly */
//           background-size: 1000% 1000%;
//           animation: gradientMove 110s linear infinite; /* Slower speed for smooth flow */
//         }

//         .dark .hero-gradient-animate {
//           background: linear-gradient(
//             45deg,
//             /* Deep Space Blues */ #000000,
//             #0f2027,
//             #203a43,
//             #2c5364,
//             #243b55,
//             #141e30,
//             #0f0c29,
//             #302b63,
//             /* Cosmic Purples */ #24243e,
//             #232526,
//             #414345,
//             #1e130c,
//             #485563,
//             #29323c,
//             #3a1c71,
//             #d76d77,
//             /* Nebula Pinks & Reds */ #ffaf7b,
//             #434343,
//             #000000,
//             #0f9b0f,
//             #203a43,
//             #2c5364,
//             #cc2b5e,
//             #753a88,
//             /* Cyber Cyans & Teals */ #000428,
//             #004e92,
//             #240b36,
//             #c31432,
//             #1a2a6c,
//             #b21f1f,
//             #fdbb2d,
//             #021b79,
//             /* Deep Greens & Golds */ #0575e6,
//             #134e5e,
//             #71b280,
//             #000000,
//             #434343,
//             #0f2027,
//             #203a43,
//             #2c5364,
//             /* Loop back */ #243b55,
//             #141e30,
//             #0f0c29,
//             #302b63,
//             #24243e
//           );
//           background-size: 1000% 1000%;
//           animation: gradientMove 150s linear infinite;
//         }
//       `}</style>
//       {/* Main Layout - Solid Background for body content */}
//       <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
//         <PhoneBanner />
//         {/* 🔥 HERO SECTION ONLY
//            Added 'hero-gradient-animate' class here.
//            Using 'min-h-[85vh]' to cover most of the initial viewport.
//         */}
//         <section className="relative overflow-hidden min-h-[85vh] flex items-center hero-gradient-animate rounded-b-[3rem] shadow-xl mb-12">
//           {/* Glass Overlay for Hero Text Readability */}
//           <div className="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-[2px] z-0" />

//           <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
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
//                 <Sparkles
//                   className="text-blue-600 dark:text-blue-300"
//                   size={20}
//                 />
//                 <span className="text-sm font-bold text-gray-800 dark:text-white tracking-wide">
//                   Premium Genuine Parts
//                 </span>
//               </motion.div>

//               <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
//                 <span className="block text-gray-900 dark:text-white drop-shadow-md mb-2">
//                   Hyundai Spares
//                 </span>
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 dark:from-cyan-400 dark:via-purple-400 dark:to-pink-400 animate-pulse">
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
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/40 dark:bg-blue-500/20 rounded-full blur-[80px] -z-10" />

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

//         {/* 👇👇👇 ఇక్కడ కొత్త WIDGET ని ప్లేస్ చేయండి 👇👇👇 */}
//         <div className="relative z-30 max-w-4xl mx-auto px-4 mt-10 mb-16">
//           <div className="bg-white dark:bg-[#111] rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden p-1">
//             <HeroGarageWidget />
//           </div>
//         </div>
//         {/* 👆👆👆 End of Widget 👆👆👆 */}

//         {/* Regular Sections with Clean Background */}
//         <div className="space-y-16 pb-16">
//           <FestivalCarousel />
//           <ProductCarousel />

//           {/* Products Section */}
//           <section id="products" className="px-4 md:px-8 relative z-10">
//             <div className="max-w-7xl mx-auto">
//               <div className="text-center mb-12">
//                 <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
//                   Our Premium Collection
//                 </h2>
//                 <div className="h-1 w-24 bg-blue-600 dark:bg-purple-500 mx-auto rounded-full mb-4"></div>
//                 <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
//                   Browse through our extensive range of genuine Hyundai spare
//                   parts.
//                 </p>
//               </div>

//               {/* Filters */}
//               <div className="flex flex-col md:flex-row gap-6 mb-12">
//                 <div className="relative w-full md:w-96">
//                   <Search
//                     className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
//                     size={20}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Search parts..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#0A101F] border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm transition-all"
//                   />
//                 </div>

//                 <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
//                   <div className="p-3.5 bg-white dark:bg-[#0A101F] rounded-2xl border border-gray-200 dark:border-white/10 text-blue-600 dark:text-blue-400 flex-shrink-0 shadow-sm">
//                     <Filter size={20} />
//                   </div>
//                   <div className="flex gap-3 p-1">
//                     {categories.map((category) => (
//                       <button
//                         key={category}
//                         onClick={() => setSelectedCategory(category)}
//                         className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border shadow-sm ${
//                           selectedCategory === category
//                             ? "bg-gray-900 dark:bg-blue-600 text-white border-transparent shadow-lg"
//                             : "bg-white dark:bg-[#0A101F] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
//                         }`}
//                       >
//                         {category === "all" ? "All Parts" : category}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Products Grid */}
//               {loading ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <div className="w-14 h-14 border-[5px] border-blue-600 border-t-transparent rounded-full mb-6 shadow-lg animate-spin" />
//                   <p className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
//                     Fetching premium parts...
//                   </p>
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0A101F] border border-gray-200 dark:border-white/10 rounded-[2rem] text-center px-4">
//                   <div className="text-7xl mb-6 opacity-80">🔍</div>
//                   <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
//                     No products found
//                   </h3>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                   {filteredProducts.map((product, index) => (
//                     <ProductCard
//                       key={product._id}
//                       product={product}
//                       onAddToCart={handleAddToCart as any} // 'as any' ని యాడ్ చేయండి
//                       index={index}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </section>

//           <ReviewsCarousel />
//         </div>
//       </div>
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
import { Search, Filter, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import ProductCarousel from "@/components/ProductCarousel";
import FestivalCarousel from "@/components/FestivalCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import PhoneBanner from "@/components/PhoneBanner";
import HeroGarageWidget from "@/components/HeroGarageWidget";

export default function Home() {
  // ✅ 1. GLOBAL LOADING STATE (దీనిని యాడ్ చేసాను)
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);

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
    // కేవలం కేటగిరీ మారినప్పుడు మాత్రమే గ్రిడ్ లోడింగ్ చూపించాలి
    if (!isGlobalLoading) setLoading(true);

    try {
      const params: any = { limit: 12, page: 1 };
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      // ✅ 2. API CALL (మిగతా API లు ఉంటే ఇక్కడ Promise.all వాడవచ్చు)
      const response = await apiClient.get("/products", { params });

      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
      // ✅ 3. STOP GLOBAL LOADER (డేటా రాగానే లోడర్ ఆపేస్తాం)
      setIsGlobalLoading(false);
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

  // ✅ 4. FULL SCREEN BLOCKER (ఇది యాడ్ చేసాను)
  if (isGlobalLoading) {
    return <FullScreenLoader />;
  }

  // ✅ 5. ACTUAL CONTENT
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
            #ff9a9e,
            #fad0c4,
            #ffecd2,
            #fcb69f,
            #ff9a9e,
            #fecfef,
            #feada6,
            #ffdde1,
            #ee9ca7,
            #fda085,
            #f6d365,
            #ff9a9e,
            #fbc2eb,
            #fa709a,
            #fee140,
            #fa709a,
            #ff0844,
            #d4fc79,
            #96e6a1,
            #84fab0,
            #8fd3f4,
            #43e97b,
            #38f9d7,
            #00c6fb,
            #005bea,
            #a6c0fe,
            #f68084,
            #a18cd1,
            #fbc2eb,
            #8fd3f4,
            #84fab0,
            #12c2e9,
            #c471ed,
            #a1c4fd,
            #c2e9fb,
            #fccb90,
            #d57eeb,
            #96e6a1,
            #fecfef,
            #667eea,
            #764ba2,
            #e0c3fc,
            #8ec5fc,
            #e0c3fc,
            #cfd9df,
            #e2ebf0,
            #a8edea,
            #fed6e3
          );
          background-size: 1000% 1000%;
          animation: gradientMove 110s linear infinite;
        }

        .dark .hero-gradient-animate {
          background: linear-gradient(
            45deg,
            #000000,
            #0f2027,
            #203a43,
            #2c5364,
            #243b55,
            #141e30,
            #0f0c29,
            #302b63,
            #24243e,
            #232526,
            #414345,
            #1e130c,
            #485563,
            #29323c,
            #3a1c71,
            #d76d77,
            #ffaf7b,
            #434343,
            #000000,
            #0f9b0f,
            #203a43,
            #2c5364,
            #cc2b5e,
            #753a88,
            #000428,
            #004e92,
            #240b36,
            #c31432,
            #1a2a6c,
            #b21f1f,
            #fdbb2d,
            #021b79,
            #0575e6,
            #134e5e,
            #71b280,
            #000000,
            #434343,
            #0f2027,
            #203a43,
            #2c5364
          );
          background-size: 1000% 1000%;
          animation: gradientMove 150s linear infinite;
        }
      `}</style>

      {/* Main Layout - Solid Background for body content */}
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
        <PhoneBanner />

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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Hero Garage Widget */}
        <div className="relative z-30 max-w-4xl mx-auto px-4 mt-10 mb-16">
          <div className="bg-white dark:bg-[#111] rounded-3xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden p-1">
            <HeroGarageWidget />
          </div>
        </div>

        {/* Regular Sections */}
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
                      onAddToCart={handleAddToCart as any}
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

// ✨ FULL SCREEN LOADER COMPONENT (Covers Navbar & Footer)
function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050B14] flex flex-col items-center justify-center">
      {/* Logo Animation */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
        <h2 className="relative text-3xl md:text-5xl font-orbitron font-black tracking-widest text-white animate-pulse">
          VARSHINI <span className="text-cyan-500">HYUNDAI</span>
        </h2>
      </div>

      {/* Spinner */}
      <Loader2 size={48} className="animate-spin text-cyan-500" />

      <p className="mt-6 text-gray-400 text-sm font-medium tracking-wide animate-bounce">
        INITIALIZING SYSTEM...
      </p>
    </div>
  );
}
