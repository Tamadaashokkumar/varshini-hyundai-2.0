"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  AlertTriangle,
  Check,
  Zap,
  Timer,
  Star,
  RotateCcw,
  Scale,
  Loader2,
  Package,
  Info,
  User,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  MapPin,
  Car, // ✅ Added Car Icon
  X,
  Plus,
  Trash2, // ✅ Added X Icon
} from "lucide-react";
import apiClient from "@/services/apiClient";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";
import {
  getProductReviews,
  createProductReview,
  deleteProductReview,
} from "@/services/productService";
import Cookies from "js-cookie";
// --- Types ---
interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

interface CompatibleModel {
  modelName: string;
  yearFrom: number;
  yearTo?: number; // Optional means "Till Date"
  variant?: string;
  _id?: string;
}

interface Product {
  _id: string;
  name: string;
  partNumber: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: ProductImage[];
  // Updated type to ensure strict checking
  compatibleModels: CompatibleModel[];
  specifications?: Record<string, string>;
  warrantyPeriod?: string;
  manufacturer?: string;
  averageRating?: number;
  flashSale?: {
    isActive: boolean;
    salePrice?: number;
    startTime?: string;
    endTime?: string;
  };
  returnPolicy?: { isReturnable: boolean; returnWindowDays: number };
  shippingInfo?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
}

interface GarageCar {
  model: string;
  year: number;
}

// 2. Add these interfaces below your existing types
interface BundleData {
  mainProduct: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  suggestedAddons: Product[]; // Reusing your existing Product interface
  bundleSummary: {
    totalItems: number;
    totalPrice: number;
    totalMRP: number;
    youSave: number;
  };
}

// 👇 కొత్తగా ఈ Review Interface ని యాడ్ చేయండి
interface Review {
  _id: string;
  user: {
    _id: string;
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  images?: { url: string }[];
  review: string;
  createdAt: string;
}

// Helper: Time Calculation
const calculateTimeLeft = (endTime: string) => {
  const difference = +new Date(endTime) - +new Date();
  if (difference > 0) {
    return {
      d: Math.floor(difference / (1000 * 60 * 60 * 24)),
      h: Math.floor((difference / (1000 * 60 * 60)) % 24),
      m: Math.floor((difference / 1000 / 60) % 60),
      s: Math.floor((difference / 1000) % 60),
    };
  }
  return null;
};

// Helper: Compatibility Check
const checkCompatibility = (product: Product, userCar: GarageCar | null) => {
  if (
    !userCar ||
    !product.compatibleModels ||
    product.compatibleModels.length === 0
  )
    return null;

  return product.compatibleModels.some((item) => {
    // 1. Model Name Check (Case Insensitive)
    const modelMatch = item.modelName
      .toLowerCase()
      .includes(userCar.model.toLowerCase());

    // 2. Year Logic
    const endYear = item.yearTo || new Date().getFullYear(); // If no yearTo, assume current
    const yearMatch = userCar.year >= item.yearFrom && userCar.year <= endYear;

    return modelMatch && yearMatch;
  });
};

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { setCart, toggleCartDrawer } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "compat">(
    "desc",
  );
  const [timeLeft, setTimeLeft] = useState<any>(null);

  // --- 🚗 MY GARAGE STATE ---
  const [userGarage, setUserGarage] = useState<GarageCar | null>(null);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [garageForm, setGarageForm] = useState({ model: "", year: "" });

  // Pincode State
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<
    null | "loading" | "success" | "error"
  >(null);
  const [deliveryMsg, setDeliveryMsg] = useState("");

  // Zoom State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // ✅ NEW STATE: Smart Bundle

  const [bundleData, setBundleData] = useState<BundleData | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]); // సెలెక్ట్ చేసిన ఐటమ్స్ లిస్ట్
  const [addingBundle, setAddingBundle] = useState(false);
  // ... existing states (bundleData, userGarage, etc.) ...

  // ✅ REVIEWS STATE (Add this block)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0], // 5 stars to 1 star percentages
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Review Form States
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  const [reviewImages, setReviewImages] = useState<File[]>([]);
  // ✅ 1. USER ID STATE (To check ownership for delete)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ 2. LIGHTBOX STATE (To open image in same page)
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(
    null,
  );

  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // ✅ FETCH REVIEWS FUNCTION
  const fetchReviews = async (productId: string) => {
    try {
      setReviewsLoading(true);
      const data = await getProductReviews(productId);
      const fetchedReviews = data.data.result || data.data || []; // Adjust based on API response
      setReviews(fetchedReviews);
      calculateReviewStats(fetchedReviews);
    } catch (error) {
      console.error("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  // ✅ CALCULATE STATS
  const calculateReviewStats = (data: Review[]) => {
    if (!data.length) return;
    const total = data.length;
    const sum = data.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / total).toFixed(1);

    // Distribution: [5 stars %, 4 stars %, ...]
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const count = data.filter((r) => r.rating === star).length;
      return Math.round((count / total) * 100);
    });

    setReviewStats({ average: Number(avg), total, distribution });
  };

  /// Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (filesArray.length > 3) {
        toast.error("You can upload max 3 images");
        return;
      }
      setReviewImages(filesArray);
    }
  };

  // Handle Submit (Updated for FormData)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) return toast.error("Please select a star rating");
    if (!product) return;

    setSubmittingReview(true);
    try {
      // 🔥 Create FormData
      const formData = new FormData();
      formData.append("rating", userRating.toString());
      formData.append("review", comment);

      // Append Images
      reviewImages.forEach((file) => {
        formData.append("images", file);
      });

      await createProductReview(product._id, formData);

      toast.success("Review submitted successfully!");
      setComment("");
      setUserRating(0);
      setReviewImages([]); // Reset images
      fetchReviews(product._id);
    } catch (error: any) {
      toast.error(
        error ||
          "Failed to submit review. Make sure you purchased this product.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };
  // ✅ UPDATE USE EFFECT (Add fetchReviews call)
  useEffect(() => {
    if (params.id) {
      // ... existing calls ...
      fetchReviews(params.id as string); // Call this here
    }
  }, [params.id]);

  // ✅ 3. GET USER ID ON MOUNT
  // ✅ 3. GET USER ID FROM COOKIES (FIXED FOR RAW STRING)
  useEffect(() => {
    try {
      const storedUser = Cookies.get("user");
      // console.log("🍪 Raw Cookie Data:", storedUser); // Debugging line

      if (storedUser) {
        // Logic: డేటా '{' తో మొదలైతే అది JSON Object, లేకపోతే అది Direct ID String
        if (storedUser.startsWith("{")) {
          try {
            const user = JSON.parse(storedUser);
            setCurrentUserId(user._id || user.id);
          } catch (err) {
            console.error("Error parsing JSON, fallback to raw string");
            setCurrentUserId(storedUser);
          }
        } else {
          // ఇది మీ కేస్: కుకీలో డైరెక్ట్ గా ID ఉంది (e.g., "696e28...")
          setCurrentUserId(storedUser);
        }
      }
    } catch (e) {
      console.error("❌ Error handling user cookie", e);
    }
  }, []);
  // ✅ 4. DELETE REVIEW FUNCTION
  // 1. OPEN DELETE MODAL
  const openDeleteModal = (reviewId: string) => {
    setReviewToDelete(reviewId); // మోడల్ ఓపెన్ అవుతుంది
  };

  // 2. CONFIRM DELETE (నిజంగా డిలీట్ చేసే ఫంక్షన్)
  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      await deleteProductReview(reviewToDelete);
      toast.success("Review deleted successfully");
      setReviewToDelete(null); // మోడల్ క్లోజ్
      if (product?._id) fetchReviews(product._id); // లిస్ట్ రీఫ్రెష్
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  // 👇 ================================================= 👇

  const userAlreadyReviewed = reviews.some((r) => {
    if (!r.user) return false;
    // ఇప్పుడు TypeScript ఎర్రర్ రాదు ఎందుకంటే id?: string అని ఇంటర్‌ఫేస్ లో ఉంది
    return r.user._id === currentUserId || r.user.id === currentUserId;
  });

  // 👆 ================================================= 👆
  // ... rest of the component logic ...

  // // Fetch Product & Related
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await apiClient.get(`/products/${params.id}`);

  //       if (response.data.success) {
  //         const productData =
  //           response.data.data?.product ||
  //           response.data.data ||
  //           response.data.product;
  //         setProduct(productData);

  //         try {
  //           const relatedRes = await apiClient.get(
  //             `/products/${params.id}/related`,
  //           );
  //           if (relatedRes.data.success) {
  //             setRelatedProducts(relatedRes.data.data.products);
  //           }
  //         } catch (err) {
  //           console.log("Related products fetch failed");
  //         }
  //       }
  //     } catch (error) {
  //       toast.error("Failed to load product");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (params.id) fetchData();
  // }, [params.id]);

  // Fetch Product, Related & Smart Bundle
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. మెయిన్ ప్రొడక్ట్ ని తెచ్చుకోవడం
        const response = await apiClient.get(`/products/${params.id}`);

        if (response.data.success) {
          const productData =
            response.data.data?.product ||
            response.data.data ||
            response.data.product;
          setProduct(productData);

          // 2. Related Products ని తెచ్చుకోవడం (ఇది మీ పాత కోడ్)
          try {
            const relatedRes = await apiClient.get(
              `/products/${params.id}/related`,
            );
            if (relatedRes.data.success) {
              setRelatedProducts(relatedRes.data.data.products);
            }
          } catch (err) {
            console.log("Related products fetch failed");
          }

          // 👇 3. 🚀 SMART BUNDLE (ఇది మనం కొత్తగా యాడ్ చేస్తున్న బ్లాక్) 👇
          try {
            const bundleRes = await apiClient.get(
              `/products/${params.id}/smart-bundle`,
            );
            if (
              bundleRes.data.success &&
              bundleRes.data.data.suggestedAddons.length > 0
            ) {
              const data = bundleRes.data.data;
              setBundleData(data);

              // 🔥 CRITICAL STEP: డేటా రాగానే అన్ని Add-ons ని సెలెక్ట్ లిస్ట్‌లో వేయాలి
              const allAddonIds = data.suggestedAddons.map(
                (item: any) => item._id,
              );
              setSelectedAddonIds(allAddonIds);
            }
          } catch (err) {
            console.log("Bundle fetch failed");
          }
          // 👆 Smart Bundle Block End 👆
        }
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  // Load Garage & Pincode on Mount
  useEffect(() => {
    // Garage
    const savedGarage = localStorage.getItem("myGarage");
    if (savedGarage) setUserGarage(JSON.parse(savedGarage));

    // Pincode
    const savedPin = localStorage.getItem("user_pincode");
    if (savedPin) {
      setPincode(savedPin);
      checkDelivery(savedPin);
    }
  }, []);

  // Timer
  useEffect(() => {
    if (product?.flashSale?.isActive && product?.flashSale?.endTime) {
      const timer = setInterval(() => {
        const remaining = calculateTimeLeft(product.flashSale!.endTime!);
        setTimeLeft(remaining);
        if (!remaining) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  // --- GARAGE LOGIC ---
  const saveGarage = () => {
    if (!garageForm.model || !garageForm.year) {
      toast.error("Please fill all fields");
      return;
    }
    const car = { model: garageForm.model, year: parseInt(garageForm.year) };
    localStorage.setItem("myGarage", JSON.stringify(car));
    setUserGarage(car);
    setIsGarageModalOpen(false);
    toast.success("Car saved to garage!");
  };

  const removeGarage = () => {
    localStorage.removeItem("myGarage");
    setUserGarage(null);
  };

  // Image Zoom Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  // Add Cart
  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      const response = await apiClient.post("/cart/add", {
        productId: product._id,
        quantity,
      });
      if (response.data.success) {
        setCart(response.data.data.cart);
        toast.success("Added to cart!");
        toggleCartDrawer();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  // ✅ 1. TOGGLE ADD-ON (Select/Deselect Logic)
  const toggleAddon = (id: string) => {
    setSelectedAddonIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id) // ఉంటే తీసేయ్
          : [...prev, id], // లేకపోతే యాడ్ చెయ్
    );
  };

  // ✅ 2. ADD BUNDLE TO CART
  const handleAddBundleToCart = async () => {
    if (!bundleData) return;
    setAddingBundle(true);
    const toastId = toast.loading("Adding bundle items...");

    try {
      // A. మెయిన్ ప్రొడక్ట్ ని యాడ్ చేయడం
      await apiClient.post("/cart/add", {
        productId: product?._id,
        quantity: 1,
      });

      // B. కేవలం సెలెక్ట్ చేసిన Add-ons ని మాత్రమే ఫిల్టర్ చేసి లూప్ చేయడం
      const itemsToAdd = bundleData.suggestedAddons.filter((addon) =>
        selectedAddonIds.includes(addon._id),
      );

      const addonPromises = itemsToAdd.map((addon) =>
        apiClient.post("/cart/add", { productId: addon._id, quantity: 1 }),
      );

      await Promise.all(addonPromises);

      // C. Refresh Cart
      const cartRes = await apiClient.get("/cart");
      if (cartRes.data.success) setCart(cartRes.data.data.cart);

      toast.success(`${itemsToAdd.length + 1} items added to cart!`, {
        id: toastId,
      });
      toggleCartDrawer();
    } catch (error) {
      toast.error("Failed to add bundle", { id: toastId });
    } finally {
      setAddingBundle(false);
    }
  };

  // Delivery Logic
  const checkDelivery = async (manualCode?: string) => {
    const codeToCheck = typeof manualCode === "string" ? manualCode : pincode;
    if (!codeToCheck || codeToCheck.length !== 6) {
      setPincodeStatus("error");
      setDeliveryMsg("Enter valid 6-digit pincode");
      return;
    }
    setPincodeStatus("loading");
    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${codeToCheck}`,
      );
      const data = await res.json();
      if (data && data[0].Status === "Success") {
        const details = data[0].PostOffice[0];
        let deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        const dateString = deliveryDate.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });
        localStorage.setItem("user_pincode", codeToCheck);
        setPincodeStatus("success");
        setDeliveryMsg(
          `Speed Post: Get it by ${dateString} in ${details.District}`,
        );
      } else {
        setPincodeStatus("error");
        setDeliveryMsg("Service not available.");
      }
    } catch (err) {
      setPincodeStatus("error");
      setDeliveryMsg("Could not verify pincode.");
    }
  };

  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: product.name,
      text: `Check this out!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-600 dark:text-cyan-500 h-12 w-12" />
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center text-gray-900 dark:text-white">
        Product not found
      </div>
    );

  const isFlashSaleActive = product.flashSale?.isActive && timeLeft;
  const currentPrice = isFlashSaleActive
    ? product.flashSale!.salePrice!
    : product.discountPrice || product.price;
  const originalPrice = product.price;
  const discountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;
  const isOutOfStock = product.stock <= 0;

  // Calculate Fitment
  const fitStatus = checkCompatibility(product, userGarage);

  // 🧮 DYNAMIC CALCULATION (UI కోసం)
  // యూజర్ సెలెక్ట్ చేసిన ఐటమ్స్ ని బట్టి ప్రైస్ మారుతుంది
  const currentBundlePrice = bundleData
    ? (product?.discountPrice || product?.price || 0) + // Main Product Price
      bundleData.suggestedAddons
        .filter((addon) => selectedAddonIds.includes(addon._id))
        .reduce((sum, item) => sum + (item.discountPrice || item.price), 0) // Selected Addons Price
    : 0;

  const totalBundleItems = 1 + selectedAddonIds.length; // Main + Selected Addons

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="min-h-screen relative bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-cyan-500/30 overflow-x-hidden pb-24 lg:pb-0 transition-colors duration-300"
    >
      {/* 🌌 Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-300/30 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-purple-300/30 dark:bg-purple-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-300/20 dark:bg-cyan-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Breadcrumb */}
        <motion.nav
          variants={fadeIn}
          className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-8 font-medium"
        >
          <Link
            href="/"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            Home
          </Link>{" "}
          <ChevronRight size={14} />
          <Link
            href="/products"
            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            Spares
          </Link>{" "}
          <ChevronRight size={14} />
          <span className="text-gray-800 dark:text-gray-300 truncate max-w-[200px]">
            {product.name}
          </span>
        </motion.nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* ================= LEFT: GALLERY ================= */}
          <motion.div
            variants={fadeIn}
            className="lg:col-span-7 space-y-6 lg:sticky lg:top-28 h-fit z-20"
          >
            {/* 🔥 MAGICAL ZOOM CARD */}
            <div
              className="relative aspect-square rounded-[2rem] overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-2xl dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] group cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute top-5 left-5 z-20 flex flex-col gap-3 pointer-events-none">
                {discountPercentage > 0 && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-yellow-400 text-black font-bold px-4 py-1.5 rounded-full text-xs shadow-lg"
                  >
                    {discountPercentage}% OFF
                  </motion.span>
                )}
                {isFlashSaleActive && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-600 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-1 animate-pulse"
                  >
                    <Zap size={12} fill="currentColor" /> LIVE SALE
                  </motion.span>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full p-8"
                >
                  <Image
                    src={
                      product.images[selectedImage]?.url || "/placeholder.png"
                    }
                    alt={product.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    style={{
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: isHovering ? "scale(2)" : "scale(1)",
                      transition: "transform 0.1s ease-out",
                    }}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              <div
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full text-xs text-gray-800 dark:text-white/70 pointer-events-none transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"} shadow-sm`}
              >
                Hover to Zoom
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center lg:justify-start px-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 duration-300 ${selectedImage === idx ? "border-cyan-500 shadow-lg scale-110" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105 bg-white/50 dark:bg-white/5"}`}
                >
                  <Image
                    src={img.url}
                    alt="thumb"
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ================= RIGHT: INFO ================= */}
          <motion.div
            variants={fadeIn}
            className="lg:col-span-5 flex flex-col h-full"
          >
            <div className="relative">
              {/* Product Title & Brand */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-cyan-700 dark:text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase bg-cyan-100 dark:bg-cyan-950/30 px-3 py-1 rounded border border-cyan-200 dark:border-cyan-800/30">
                    {product.category}
                  </span>
                  {product.manufacturer && (
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                      <Package size={12} /> {product.manufacturer}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:via-gray-200 dark:to-gray-500 mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={18} fill="currentColor" />
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      {product.averageRating || "4.8"}
                    </span>
                  </div>
                  <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 underline decoration-gray-400 dark:decoration-gray-700 cursor-pointer hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    128 Verified Reviews
                  </span>
                </div>
              </div>

              {/* Price Card */}
              <div className="mb-6 p-6 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] -mr-10 -mt-10"></div>
                <div className="flex items-end gap-3 flex-wrap relative z-10">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ₹{currentPrice.toLocaleString()}
                  </span>
                  {originalPrice > currentPrice && (
                    <div className="flex flex-col mb-2">
                      <span className="text-lg text-gray-500 line-through decoration-red-500/50">
                        ₹{originalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                {isFlashSaleActive && timeLeft && (
                  <div className="mt-5 pt-5 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                    <div className="text-rose-500 dark:text-rose-400 font-bold text-sm flex items-center gap-2 uppercase tracking-wide animate-pulse">
                      <Timer size={16} /> Offer Ends In:
                    </div>
                    <div className="flex gap-2 font-mono text-gray-900 dark:text-white text-sm font-bold">
                      {["d", "h", "m", "s"].map((unit) => (
                        <div
                          key={unit}
                          className="bg-gray-100 dark:bg-black/40 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-inner min-w-[40px] text-center"
                        >
                          {timeLeft[unit]}
                          <span className="text-[9px] text-gray-500 ml-0.5">
                            {unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= 🔥 SMART BUNDLE UI (Selectable) 🔥 ================= */}
              {bundleData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-3xl relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-cyan-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-md">
                      Frequently Bought Together
                    </div>
                    {/* Select All / Deselect All Helper Text */}
                    <button
                      onClick={() =>
                        setSelectedAddonIds(
                          selectedAddonIds.length ===
                            bundleData.suggestedAddons.length
                            ? []
                            : bundleData.suggestedAddons.map((i) => i._id),
                        )
                      }
                      className="text-xs text-cyan-600 font-bold hover:underline"
                    >
                      {selectedAddonIds.length ===
                      bundleData.suggestedAddons.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* Visual Chain */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                      {/* 1. Main Product (Always Selected) */}
                      <div className="relative w-20 h-24 flex-shrink-0 flex flex-col items-center gap-2">
                        <div className="relative w-16 h-16 bg-white dark:bg-white/10 rounded-xl p-2 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20">
                          <Image
                            src={product.images[0]?.url || ""}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-white z-10">
                            <Check size={12} strokeWidth={4} />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-center leading-tight line-clamp-2 w-full text-cyan-700 dark:text-cyan-400">
                          This Item
                        </span>
                      </div>

                      {/* 2. Add-ons (Toggleable) */}
                      {bundleData.suggestedAddons.map((addon) => {
                        const isSelected = selectedAddonIds.includes(addon._id);
                        return (
                          <div
                            key={addon._id}
                            className="flex items-center gap-2 flex-shrink-0"
                          >
                            <Plus
                              size={16}
                              className="text-gray-300 dark:text-gray-600"
                            />

                            <div
                              onClick={() => toggleAddon(addon._id)}
                              className={`relative w-20 h-24 flex flex-col items-center gap-2 cursor-pointer group transition-all duration-300 ${!isSelected ? "opacity-50 grayscale" : "opacity-100"}`}
                            >
                              <div
                                className={`relative w-16 h-16 bg-white dark:bg-white/10 rounded-xl p-2 border-2 transition-all ${isSelected ? "border-cyan-500 shadow-md" : "border-gray-200 dark:border-white/10"}`}
                              >
                                <Image
                                  src={addon.images[0]?.url || ""}
                                  alt={addon.name}
                                  fill
                                  className="object-contain"
                                />

                                {/* Checkbox UI */}
                                <div
                                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-md flex items-center justify-center text-white transition-colors z-10 ${isSelected ? "bg-cyan-500" : "bg-gray-300 dark:bg-gray-600"}`}
                                >
                                  {isSelected && (
                                    <Check size={12} strokeWidth={4} />
                                  )}
                                </div>
                              </div>
                              <span
                                className={`text-[10px] font-medium text-center leading-tight line-clamp-2 w-full ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                              >
                                {addon.name}
                              </span>
                              <span className="text-[10px] font-bold text-gray-900 dark:text-white">
                                ₹
                                {(
                                  addon.discountPrice || addon.price
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary & Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-dashed border-cyan-500/20">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                          Total for {totalBundleItems} items:
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-gray-900 dark:text-white">
                            ₹{currentBundlePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleAddBundleToCart}
                        disabled={addingBundle}
                        className="flex-1 sm:flex-none px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {addingBundle ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          `Add ${totalBundleItems} to Cart`
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* ================= END NEW SECTION ================= */}

              {/* ✅ NEW: MY GARAGE COMPATIBILITY CHECK */}
              <div className="mb-8">
                {userGarage ? (
                  // --- CAR IS SELECTED ---
                  <div
                    className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden transition-all ${
                      fitStatus
                        ? "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/5 dark:border-emerald-500/20"
                        : "bg-red-500/10 border-red-500/20 dark:bg-red-500/5 dark:border-red-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex gap-3">
                        <div
                          className={`p-2 rounded-xl ${fitStatus ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-red-500/20 text-red-600 dark:text-red-400"}`}
                        >
                          {fitStatus ? (
                            <CheckCircle2 size={24} />
                          ) : (
                            <AlertTriangle size={24} />
                          )}
                        </div>
                        <div>
                          <h4
                            className={`font-bold text-lg ${fitStatus ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"}`}
                          >
                            {fitStatus
                              ? "This part fits your car!"
                              : "This part does NOT fit."}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Checking for{" "}
                            <b>
                              Hyundai {userGarage.model} ({userGarage.year})
                            </b>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeGarage}
                        className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-300 underline p-1"
                      >
                        Change Car
                      </button>
                    </div>
                    {/* Decorative Background Icon */}
                    <Car
                      className={`absolute -bottom-2 -right-2 w-24 h-24 opacity-5 pointer-events-none ${fitStatus ? "text-emerald-500" : "text-red-500"}`}
                    />
                  </div>
                ) : (
                  // --- NO CAR SELECTED ---
                  <div className="p-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl">
                    <div className="bg-white/80 dark:bg-[#0f111a] backdrop-blur-xl rounded-xl p-4 flex items-center justify-between border border-white/40 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-300">
                          <Car size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            Does this fit your car?
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Add your vehicle to check compatibility.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsGarageModalOpen(true)}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                      >
                        Check Now
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Bar */}
              <div className="mb-8">
                {isOutOfStock ? (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-3">
                    <AlertTriangle size={20} />{" "}
                    <span className="font-medium">Currently Out of Stock</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 size={16} /> In Stock
                      </span>
                      {product.stock < 10 && (
                        <span className="text-orange-600 dark:text-orange-400">
                          Only {product.stock} Left!
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        style={{ width: product.stock < 10 ? "20%" : "85%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ships within 24 hours.
                    </p>
                  </div>
                )}
              </div>

              {/* Smart Pincode UI */}
              <div className="mb-8 p-4 bg-white/40 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin size={16} className="text-cyan-600" />
                    {pincodeStatus === "success"
                      ? `Delivering to ${pincode}`
                      : "Check Delivery"}
                  </label>
                  {pincodeStatus === "success" && (
                    <button
                      onClick={() => {
                        setPincodeStatus(null);
                        setDeliveryMsg("");
                        setTimeout(
                          () =>
                            document.getElementById("pincodeInput")?.focus(),
                          100,
                        );
                      }}
                      className="text-xs font-bold text-cyan-600 hover:text-cyan-500 uppercase tracking-wider"
                    >
                      Change
                    </button>
                  )}
                </div>

                {pincodeStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden flex flex-col gap-1 p-5 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl transition-all"
                  >
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-2 relative z-10">
                      <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                        <Truck size={16} className="text-emerald-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                        Estimated Delivery
                      </span>
                    </div>
                    <div className="pl-8 relative z-10">
                      <p className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                        {deliveryMsg}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        Shipping to{" "}
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400 px-1.5 py-0.5 bg-cyan-500/10 rounded">
                          {pincode}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    <div className="flex gap-2 relative">
                      <input
                        id="pincodeInput"
                        type="text"
                        maxLength={6}
                        placeholder="Enter Pincode"
                        className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                        value={pincode}
                        onChange={(e) =>
                          setPincode(e.target.value.replace(/\D/g, ""))
                        }
                        onKeyDown={(e) => e.key === "Enter" && checkDelivery()}
                      />
                      <button
                        onClick={() => checkDelivery()}
                        disabled={pincodeStatus === "loading"}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black text-xs font-bold px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {pincodeStatus === "loading" ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Check"
                        )}
                      </button>
                    </div>
                    {pincodeStatus === "error" && (
                      <div className="mt-2 text-xs flex items-center gap-1.5 font-medium text-red-500 animate-pulse">
                        <AlertTriangle size={14} /> {deliveryMsg}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex gap-4 mb-8">
                <div className="flex items-center bg-gray-100 dark:bg-black/30 rounded-2xl border border-gray-200 dark:border-white/10 h-14 px-1 w-32 justify-between">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="w-10 h-full hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-800 dark:text-white disabled:opacity-30 text-xl"
                  >
                    -
                  </button>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="w-10 h-full hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-colors text-gray-800 dark:text-white disabled:opacity-30 text-xl"
                  >
                    +
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className="flex-1 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] dark:shadow-[0_0_30px_-10px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {addingToCart ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={20} />{" "}
                      {isOutOfStock ? "Sold Out" : "Add to Cart"}
                    </>
                  )}
                </motion.button>

                <div className="flex gap-2">
                  <button className="h-14 w-14 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 hover:border-red-500/50 hover:text-red-500 text-gray-600 dark:text-white transition-all shadow-sm">
                    <Heart size={22} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-14 w-14 flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 hover:border-blue-500/50 hover:text-blue-500 text-gray-600 dark:text-white transition-all shadow-sm"
                  >
                    <Share2 size={22} />
                  </button>
                </div>
              </div>

              {/* Policy Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                  <RotateCcw
                    className="text-cyan-600 dark:text-cyan-400 mb-2"
                    size={24}
                  />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                    Easy Returns
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {product.returnPolicy?.isReturnable
                      ? `${product.returnPolicy.returnWindowDays}-Day Policy`
                      : "Non-returnable"}
                  </p>
                </div>
                <div className="p-4 bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none">
                  <Shield
                    className="text-purple-600 dark:text-purple-400 mb-2"
                    size={24}
                  />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                    Warranty
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {product.warrantyPeriod || "Manufacturer Warranty"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= TABS & DETAILS ================= */}
        <div className="mt-24">
          <div className="flex justify-center mb-10">
            <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/10 inline-flex">
              {[
                { id: "desc", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "compat", label: "Compatibility" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-600 text-cyan-700 dark:text-white shadow-md dark:shadow-lg" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/60 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-8 lg:p-12 min-h-[300px] shadow-lg dark:shadow-none"
          >
            {activeTab === "desc" && (
              <p className="text-gray-600 dark:text-gray-300 leading-8 text-lg whitespace-pre-line">
                {product.description}
              </p>
            )}

            {activeTab === "specs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {product.specifications &&
                  Object.entries(product.specifications).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-3"
                    >
                      <span className="text-gray-500 dark:text-gray-400">
                        {k}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {v}
                      </span>
                    </div>
                  ))}
                {product.shippingInfo && (
                  <>
                    <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-3">
                      <span className="text-gray-500 dark:text-gray-400">
                        Weight
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {product.shippingInfo.weight} kg
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-3">
                      <span className="text-gray-500 dark:text-gray-400">
                        Dimensions
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {product.shippingInfo.length} x{" "}
                        {product.shippingInfo.width} x{" "}
                        {product.shippingInfo.height} cm
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "compat" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                      <th className="pb-4">Model</th>
                      <th className="pb-4">Year</th>
                      <th className="pb-4">Variant</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    {product.compatibleModels.map((m: any, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-200 dark:border-white/5 transition-colors ${userGarage && m.modelName.toLowerCase().includes(userGarage.model.toLowerCase()) ? "bg-emerald-500/10" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                      >
                        <td className="py-4 font-medium text-gray-900 dark:text-white">
                          {m.modelName}
                          {userGarage &&
                            m.modelName
                              .toLowerCase()
                              .includes(userGarage.model.toLowerCase()) && (
                              <span className="ml-2 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                                MATCH
                              </span>
                            )}
                        </td>
                        <td className="py-4">
                          {m.yearFrom} - {m.yearTo || "Now"}
                        </td>
                        <td className="py-4">
                          <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-xs">
                            {m.variant || "All"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* ================= REVIEWS SECTION (UPDATED) ================= */}
        <div className="mt-24" id="reviews">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <Star fill="currentColor" className="text-amber-400" /> Customer
            Reviews
          </h2>

          <div className="grid md:grid-cols-12 gap-8">
            {/* --- LEFT: RATINGS SUMMARY --- */}
            <div className="md:col-span-4 bg-white/60 dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 h-fit shadow-lg dark:shadow-none">
              <div className="text-center">
                <div className="text-6xl font-black text-gray-900 dark:text-white mb-2">
                  {reviewStats.total > 0 ? reviewStats.average : "0.0"}
                </div>
                <div className="flex justify-center text-amber-400 gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={20}
                      fill="currentColor"
                      className={
                        i > Math.round(reviewStats.average)
                          ? "text-gray-300 dark:text-gray-600"
                          : ""
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Based on {reviewStats.total} Reviews
                </p>
              </div>

              {/* Progress Bars */}
              <div className="mt-8 space-y-3">
                {[5, 4, 3, 2, 1].map((star, i) => (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-3 text-gray-700 dark:text-white font-bold">
                      {star}
                    </span>
                    <Star
                      size={12}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${reviewStats.distribution[i]}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-amber-400"
                      ></motion.div>
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">
                      {reviewStats.distribution[i]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- RIGHT: WRITE REVIEW & LIST --- */}
            <div className="md:col-span-8 space-y-8">
              {/* 🟢 1. WRITE REVIEW FORM LOGIC */}
              {/* లాజిక్: యూజర్ లాగిన్ అయ్యి ఉంటే AND ఇంకా రివ్యూ ఇవ్వకపోతేనే ఫామ్ చూపించు */}
              {currentUserId && !userAlreadyReviewed ? (
                <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                    Write a Review
                  </h3>
                  <form onSubmit={handleSubmitReview}>
                    {/* Rating Stars */}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onMouseEnter={() => setHoverStar(star)}
                            onMouseLeave={() => setHoverStar(0)}
                            onClick={() => setUserRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                          >
                            <Star
                              size={28}
                              className={
                                star <= (hoverStar || userRating)
                                  ? "text-amber-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }
                              fill={
                                star <= (hoverStar || userRating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Box */}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Your Experience
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike?"
                        className="w-full p-4 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none h-32 text-gray-800 dark:text-gray-200"
                        required
                      />
                    </div>

                    {/* Image Input (Updated Logic Only) */}
                    <div className="mb-4">
                      <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Add Photos (Max 3)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 dark:file:bg-cyan-900/20 dark:file:text-cyan-400"
                      />
                      {/* Preview Selected Names */}
                      {reviewImages.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {reviewImages.map((img, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300"
                            >
                              {img.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {submittingReview && (
                        <Loader2 size={18} className="animate-spin" />
                      )}
                      Submit Review
                    </button>
                  </form>
                </div>
              ) : (
                // 🟢 2. ALREADY REVIEWED MESSAGE (UI same as before)
                !reviewsLoading &&
                reviews.length > 0 &&
                userAlreadyReviewed && (
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl text-center">
                    <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 mb-3">
                      <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Thanks for your review!
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      You have already shared your feedback for this product.
                    </p>
                  </div>
                )
              )}

              {/* 🟢 3. REVIEWS LIST (Only Logic Updated for Delete/Lightbox) */}
              {reviewsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-cyan-600" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No reviews yet. Be the first to review!
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-6 bg-white/60 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl hover:bg-white dark:hover:bg-white/5 transition-colors shadow-sm relative group"
                    >
                      {/* 🔥 DELETE BUTTON LOGIC ADDED HERE */}
                      {/* (Style unchanged, just condition added) */}
                      {currentUserId === review.user?._id && (
                        <button
                          onClick={() => openDeleteModal(review._id)}
                          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                          title="Delete Review"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}

                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white overflow-hidden text-sm">
                            {review.user?.avatar ? (
                              <Image
                                src={review.user.avatar}
                                alt={review.user.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              review.user?.name?.charAt(0).toUpperCase() || (
                                <User size={20} />
                              )
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                              {review.user?.name || "Anonymous"}
                            </h4>
                            <div className="flex text-amber-400 gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={10}
                                  fill={
                                    s <= review.rating ? "currentColor" : "none"
                                  }
                                  className={
                                    s <= review.rating
                                      ? ""
                                      : "text-gray-300 dark:text-gray-600"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mr-8">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-IN",
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {review.review}
                      </p>

                      {/* 🔥 IMAGE LIGHTBOX LOGIC ADDED HERE */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {review.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 flex-shrink-0 cursor-zoom-in hover:scale-105 transition-transform group/img"
                              onClick={() => setSelectedReviewImage(img.url)}
                            >
                              <Image
                                src={img.url}
                                alt="Review attachment"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= RELATED PRODUCTS (UNCHANGED) ================= */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-10 flex items-center gap-2"
            >
              <span className="w-1.5 h-8 bg-cyan-500 rounded-full inline-block"></span>
              You Might Also Like
            </motion.h2>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {relatedProducts.map((related) => {
                const rPrice = related.price;
                const rDiscount = related.discountPrice || 0;
                const rFinal = rDiscount > 0 ? rDiscount : rPrice;
                const rOff =
                  rDiscount > 0
                    ? Math.round(((rPrice - rDiscount) / rPrice) * 100)
                    : 0;
                return (
                  <motion.div
                    key={related._id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { type: "spring", stiffness: 50 },
                      },
                    }}
                    whileHover={{
                      y: -12,
                      scale: 1.02,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    className="h-full"
                  >
                    <Link
                      href={`/products/${related._id}`}
                      className="block h-full"
                    >
                      <div className="group h-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-500/50 flex flex-col relative">
                        <div className="relative aspect-[4/5] p-6 overflow-hidden bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          {related.images && related.images.length > 0 ? (
                            <Image
                              src={related.images[0].url}
                              alt={related.name}
                              fill
                              className="object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out z-10"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          ) : (
                            <Package
                              size={48}
                              className="text-gray-300 dark:text-gray-700 opacity-50"
                            />
                          )}
                          {rOff > 0 && (
                            <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-20">
                              -{rOff}%
                            </span>
                          )}
                          <div className="absolute bottom-4 right-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <div className="bg-white dark:bg-black/80 backdrop-blur-md text-cyan-600 dark:text-cyan-400 p-3 rounded-full shadow-lg hover:bg-cyan-500 hover:text-white dark:hover:text-white transition-colors">
                              <ArrowRight size={18} />
                            </div>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col border-t border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02]">
                          <div className="mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20 px-2.5 py-1 rounded-md">
                              {related.category}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            {related.name}
                          </h3>
                          <div className="flex items-center gap-1 mb-4">
                            {[1, 2, 3, 4].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                className="text-amber-400 fill-current"
                              />
                            ))}
                            <Star
                              size={14}
                              className="text-gray-300 dark:text-gray-600 fill-current"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 font-medium">
                              (24 Reviews)
                            </span>
                          </div>
                          <div className="mt-auto pt-4 border-t border-dashed border-gray-200 dark:border-white/10 flex items-end justify-between">
                            <div className="flex flex-col">
                              <span className="text-2xl font-black text-gray-900 dark:text-white">
                                ₹{rFinal.toLocaleString()}
                              </span>
                              {rOff > 0 && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through font-medium">
                                  ₹{rPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300 shadow-sm">
                              <ShoppingCart size={18} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      {/* 📱 MOBILE STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#050505]/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 p-4 lg:hidden z-50 flex items-center gap-4 animate-slide-up pb-safe">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total Price
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{currentPrice.toLocaleString()}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || addingToCart}
          className="flex-1 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {addingToCart ? (
            <Loader2 className="animate-spin" />
          ) : isOutOfStock ? (
            "Sold Out"
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>

      {/* 🚙 GARAGE MODAL POPUP */}
      <AnimatePresence>
        {isGarageModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGarageModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto w-[90%] max-w-md h-fit p-6 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl z-[101]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Car className="text-cyan-600" /> Add Your Car
                </h2>
                <button
                  onClick={() => setIsGarageModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Car Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Creta, Swift, City"
                    value={garageForm.model}
                    onChange={(e) =>
                      setGarageForm({ ...garageForm, model: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2020"
                    value={garageForm.year}
                    onChange={(e) =>
                      setGarageForm({ ...garageForm, year: e.target.value })
                    }
                    className="w-full p-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <button
                  onClick={saveGarage}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all mt-2"
                >
                  Save Vehicle
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🖼️ IMAGE LIGHTBOX MODAL (Full Screen View) */}
      <AnimatePresence>
        {selectedReviewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedReviewImage(null)} // Click outside to close
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl h-[80vh]"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
            >
              <Image
                src={selectedReviewImage}
                alt="Full size review"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗑️ BEAUTIFUL DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {reviewToDelete && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center px-4">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
            >
              {/* Red Glow Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-500 dark:text-red-400">
                  <AlertTriangle size={32} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Review?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Are you sure you want to delete this review? This action
                  cannot be undone.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setReviewToDelete(null)}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteReview}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
