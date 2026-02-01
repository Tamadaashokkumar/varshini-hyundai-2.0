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
  Car, // Added Car Icon
  CheckCircle2, // Added Success Icon
  AlertCircle, // Added Warning Icon
} from "lucide-react";
import apiClient from "@/services/apiClient";
import { toast } from "react-hot-toast"; // For notifications (Optional)

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
  totalReviews?: number; // ✅ ఇది కొత్తగా యాడ్ చేయండి
  compatibleModels?: {
    modelName: string;
    yearFrom: number;
    yearTo?: number;
  }[];
}

interface GarageCar {
  model: string;
  year: number;
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

// --- Helper: Compatibility Logic ---
const checkCompatibility = (product: Product, userCar: GarageCar | null) => {
  if (
    !userCar ||
    !product.compatibleModels ||
    product.compatibleModels.length === 0
  )
    return null;

  return product.compatibleModels.some((item) => {
    const modelMatch = item.modelName
      .toLowerCase()
      .includes(userCar.model.toLowerCase());
    const endYear = item.yearTo || new Date().getFullYear();
    const yearMatch = userCar.year >= item.yearFrom && userCar.year <= endYear;
    return modelMatch && yearMatch;
  });
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("newest");

  // --- MY GARAGE STATE ---
  const [userGarage, setUserGarage] = useState<GarageCar | null>(null);
  const [garageForm, setGarageForm] = useState({
    model: "Creta",
    year: "2020",
  }); // Default values for ease
  // ... existing states ...
  const [showGarageOnly, setShowGarageOnly] = useState(false); // ✅ NEW STATE

  // Load Garage from Local Storage on Mount
  useEffect(() => {
    const savedGarage = localStorage.getItem("myGarage");
    if (savedGarage) {
      setUserGarage(JSON.parse(savedGarage));
    }
  }, []);

  const saveToGarage = () => {
    if (!garageForm.model || !garageForm.year) return;
    const car = { model: garageForm.model, year: parseInt(garageForm.year) };
    localStorage.setItem("myGarage", JSON.stringify(car));
    setUserGarage(car);
  };

  const clearGarage = () => {
    localStorage.removeItem("myGarage");
    setUserGarage(null);
  };

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

      // 🔥 FIX HERE: Garage ఉంటే సరిపోదు, స్విచ్ (showGarageOnly) కూడా ON లో ఉండాలి
      if (userGarage && showGarageOnly) {
        params.append("model", userGarage.model);
        params.append("year", userGarage.year.toString());
      }

      const response = await apiClient.get(`/products?${params.toString()}`);
      if (response.data.success) {
        setProducts(response.data.data.products || response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products");
    } finally {
      setLoading(false);
    }
    // 🔥 IMPORTANT: 'showGarageOnly' ని డిపెండెన్సీ అరే లో యాడ్ చేయాలి
  }, [
    search,
    selectedCategory,
    priceRange,
    sortBy,
    userGarage,
    showGarageOnly,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // ✅ NEW: Smart Filter Logic
  // టోగుల్ ON లో ఉంటే, కేవలం కారుకి సరిపోయేవే చూపించు. లేకపోతే అన్ని చూపించు.
  const filteredProducts = products.filter((product) => {
    if (showGarageOnly && userGarage) {
      return checkCompatibility(product, userGarage);
    }
    return true; // Show all if toggle is OFF
  });

  return (
    // Responsive Padding Change: p-24 changed to responsive padding (pt-28 px-4 etc)
    <div className="pt-28 pb-10 px-4 md:px-8 lg:p-24 min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#050505] dark:to-[#1a1a2e] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/20 rounded-full blur-[100px] md:blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-500/20 rounded-full blur-[100px] md:blur-[150px]"></div>
      </div>

      {/* ================= HEADER SECTION ================= */}
      <div className="relative z-20 fixed top-0 left-0 right-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                Explore Spares
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm mt-1 font-medium">
                Genuine parts for your Hyundai machine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 md:py-3 border border-white/20 dark:border-white/10 rounded-xl leading-5 bg-white/40 dark:bg-white/5 backdrop-blur-md text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white/60 dark:focus:bg-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 sm:text-sm transition-all shadow-inner"
                  placeholder="Search by part name or number..."
                />
              </div>

              {/* Tablet Fix: Changed md:hidden to lg:hidden so it shows on iPad */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 md:py-3 bg-white/40 dark:bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-sm font-medium shadow-sm hover:bg-white/50 dark:hover:bg-white/20 transition-all"
              >
                <Filter size={18} />{" "}
                <span className="sm:hidden md:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-8 py-4 md:py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ================= SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8 sticky top-32 h-fit p-6 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl">
            {/* --- 🚗 MY GARAGE WIDGET --- */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Car size={18} className="text-cyan-600 dark:text-cyan-400" />
                My Garage
              </h3>

              {userGarage ? (
                <div className="bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-4">
                  <p className="text-xs text-cyan-800 dark:text-cyan-300 font-bold uppercase tracking-wider mb-1">
                    Vehicle Selected
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    Hyundai {userGarage.model}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Year: {userGarage.year}
                  </p>
                  <button
                    onClick={clearGarage}
                    className="w-full py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Change Car
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Creta"
                      value={garageForm.model}
                      onChange={(e) =>
                        setGarageForm({ ...garageForm, model: e.target.value })
                      }
                      className="w-full bg-white/50 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Year
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2020"
                      value={garageForm.year}
                      onChange={(e) =>
                        setGarageForm({ ...garageForm, year: e.target.value })
                      }
                      className="w-full bg-white/50 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <button
                    onClick={saveToGarage}
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    Set Garage
                  </button>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-4"></div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Package
                  size={18}
                  className="text-cyan-600 dark:text-cyan-400"
                />
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
            {(selectedCategory !== "All" || search || userGarage) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {/* My Garage Tag */} {/* ✅ NEW: Garage Toggle Switch */}
                {userGarage && (
                  <div
                    onClick={() => setShowGarageOnly(!showGarageOnly)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2 transition-all select-none ${
                      showGarageOnly
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20"
                        : "bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-cyan-500/50"
                    }`}
                  >
                    <div
                      className={`w-8 h-4 rounded-full relative transition-colors ${showGarageOnly ? "bg-white/30" : "bg-gray-300 dark:bg-gray-600"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${showGarageOnly ? "left-4" : "left-0.5"}`}
                      ></div>
                    </div>
                    {showGarageOnly
                      ? "Showing Only Compatible Parts"
                      : "Filter by My Car"}
                  </div>
                )}
                {userGarage && (
                  <span className="px-3 py-1 bg-green-100/50 dark:bg-green-500/20 backdrop-blur-sm border border-green-200/50 dark:border-green-500/30 rounded-full text-xs text-green-800 dark:text-green-300 flex items-center gap-1 font-medium shadow-sm">
                    <Car size={12} /> {userGarage.model} ({userGarage.year})
                    <button onClick={clearGarage}>
                      <X size={12} />
                    </button>
                  </span>
                )}
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
                    clearGarage();
                  }}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white/20 dark:bg-white/5 rounded-[1.5rem] h-80 md:h-96 animate-pulse border border-white/30 dark:border-white/5 shadow-sm"
                  ></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
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
                  We couldn't find any parts matching your filters or garage
                  vehicle.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearch("");
                    clearGarage(); // Clear garage to show all products
                  }}
                  className="mt-6 px-6 py-2 bg-cyan-600/90 hover:bg-cyan-500 text-white rounded-lg transition-all shadow-lg shadow-cyan-500/30 backdrop-blur-sm"
                >
                  Clear Filters & Garage
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    userGarage={userGarage}
                  />
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
              className="fixed inset-y-0 right-0 w-80 md:w-96 bg-white/95 dark:bg-[#0f111a]/95 backdrop-blur-2xl border-l border-white/20 dark:border-white/10 z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
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

              {/* Mobile Garage Section */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Car size={16} /> My Garage
                </h3>
                <div className="bg-gray-50/50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5">
                  {userGarage ? (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {userGarage.model}
                          </p>
                          <p className="text-sm text-gray-500">
                            {userGarage.year}
                          </p>
                        </div>
                        <button
                          onClick={clearGarage}
                          className="text-red-500 text-xs font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                      <div
                        onClick={() => setShowGarageOnly(!showGarageOnly)}
                        className={`cursor-pointer w-full py-2 rounded-lg border text-xs font-bold flex justify-center items-center gap-2 transition-all select-none ${
                          showGarageOnly
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                            : "bg-white dark:bg-black/20 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10"
                        }`}
                      >
                        <div
                          className={`w-6 h-3 rounded-full relative transition-colors ${showGarageOnly ? "bg-white/30" : "bg-gray-300"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-2 h-2 rounded-full bg-white shadow-sm transition-all ${showGarageOnly ? "left-3.5" : "left-0.5"}`}
                          ></div>
                        </div>
                        {showGarageOnly
                          ? "Filtering Compatible"
                          : "Filter by Car"}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Model (e.g. Creta)"
                        value={garageForm.model}
                        onChange={(e) =>
                          setGarageForm({
                            ...garageForm,
                            model: e.target.value,
                          })
                        }
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Year (e.g. 2020)"
                        value={garageForm.year}
                        onChange={(e) =>
                          setGarageForm({ ...garageForm, year: e.target.value })
                        }
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm"
                      />
                      <button
                        onClick={saveToGarage}
                        className="w-full py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium"
                      >
                        Set Garage
                      </button>
                    </div>
                  )}
                </div>
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
                    className="w-full bg-gray-100/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white outline-none appearance-none"
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
                    <label
                      className={`flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-white/5 rounded-lg cursor-pointer border ${selectedCategory === "All" ? "border-cyan-500/50 bg-cyan-50/50 dark:bg-cyan-500/10" : "border-gray-100/50 dark:border-transparent"}`}
                    >
                      <input
                        type="radio"
                        name="mobile_cat"
                        checked={selectedCategory === "All"}
                        onChange={() => setSelectedCategory("All")}
                        className="accent-cyan-600 dark:accent-cyan-500 w-4 h-4"
                      />
                      <span
                        className={
                          selectedCategory === "All"
                            ? "text-cyan-700 dark:text-cyan-400 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }
                      >
                        All Parts
                      </span>
                    </label>
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat}
                        className={`flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-white/5 rounded-lg cursor-pointer border ${selectedCategory === cat ? "border-cyan-500/50 bg-cyan-50/50 dark:bg-cyan-500/10" : "border-gray-100/50 dark:border-transparent"}`}
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

// ================= PRODUCT CARD COMPONENT =================
function ProductCard({
  product,
  userGarage,
}: {
  product: Product;
  userGarage: GarageCar | null;
}) {
  const price = product.price;
  const discountPrice = product.discountPrice || 0;
  const finalPrice = discountPrice > 0 ? discountPrice : price;
  const discount =
    discountPrice > 0 ? Math.round(((price - discountPrice) / price) * 100) : 0;

  // Calculate Fitment only if Garage is Active
  const fitmentStatus = userGarage
    ? checkCompatibility(product, userGarage)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link href={`/products/${product._id}`} className="block h-full">
        <div className="h-full bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[1.5rem] overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col relative">
          <div className="relative aspect-square w-full bg-gradient-to-b from-white/10 to-transparent dark:from-white/5 dark:to-transparent overflow-hidden flex items-center justify-center border-b border-white/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

            {/* --- GARAGE FITMENT BADGE (TOP RIGHT) --- */}
            {userGarage && fitmentStatus !== null && (
              <div
                className={`absolute top-4 right-4 z-20 px-2 py-1 rounded-lg backdrop-blur-md border shadow-lg flex items-center gap-1.5 ${
                  fitmentStatus
                    ? "bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300"
                    : "bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300"
                }`}
              >
                {fitmentStatus ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wide">
                  {fitmentStatus ? "Fits" : "No Fit"}
                </span>
              </div>
            )}

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

            <div className="flex items-center gap-1 mb-3">
              <Star size={12} className="text-amber-400 fill-current" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {product.averageRating || 4.5}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                (24 reviews)
              </span>
            </div>

            {/* If Garage Set but NOT Compatible, show textual warning */}
            {userGarage && fitmentStatus === false && (
              <div className="mb-3 text-[10px] text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-900/30">
                ⚠️ Doesn't fit your {userGarage.model} ({userGarage.year})
              </div>
            )}

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
