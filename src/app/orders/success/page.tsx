// "use client";

// import { useEffect, useState, Suspense } from "react";
// import { motion } from "framer-motion";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   CheckCircle,
//   Package,
//   ArrowRight,
//   Home,
//   Sparkles,
//   Loader2,
//   Calendar,
//   MapPin,
//   Truck,
//   Copy,
//   Check,
//   ShoppingBag,
//   Download,
// } from "lucide-react";
// import Confetti from "react-confetti";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";

// // --- Animation Variants ---
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15,
//       delayChildren: 0.3,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring", stiffness: 50 },
//   },
// };

// function SuccessContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("orderId");

//   const [showConfetti, setShowConfetti] = useState(true);
//   const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
//   const [orderDetails, setOrderDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [copied, setCopied] = useState(false);

//   // Calculate estimated delivery (Current Date + 5 days)
//   const estimatedDate = new Date();
//   estimatedDate.setDate(estimatedDate.getDate() + 5);
//   const deliveryString = estimatedDate.toLocaleDateString("en-US", {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   });

//   useEffect(() => {
//     // Window Resize for Confetti
//     const handleResize = () => {
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     };

//     if (typeof window !== "undefined") {
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//       window.addEventListener("resize", handleResize);
//     }

//     // Stop Confetti after 6s
//     const timer = setTimeout(() => setShowConfetti(false), 6000);

//     // Fetch Order
//     if (orderId) {
//       fetchOrderDetails(orderId);
//     }

//     return () => {
//       clearTimeout(timer);
//       if (typeof window !== "undefined")
//         window.removeEventListener("resize", handleResize);
//     };
//   }, [orderId]);

//   const fetchOrderDetails = async (id: string) => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get(`/orders/${id}`);
//       if (response.data.success) {
//         setOrderDetails(response.data.data.order || response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch order details", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyOrderId = () => {
//     if (orderDetails?.orderNumber) {
//       navigator.clipboard.writeText(orderDetails.orderNumber);
//       setCopied(true);
//       toast.success("Order ID Copied!");
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-4 pt-20 relative overflow-hidden font-sans">
//       {/* 🌌 Background Ambience */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
//         <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
//         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
//       </div>

//       {/* 🎉 Confetti */}
//       {showConfetti && (
//         <div className="fixed inset-0 z-50 pointer-events-none">
//           <Confetti
//             width={windowSize.width}
//             height={windowSize.height}
//             recycle={false}
//             numberOfPieces={400}
//             gravity={0.15}
//             colors={["#3b82f6", "#6366f1", "#10b981", "#fbbf24"]}
//           />
//         </div>
//       )}

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative z-10 w-full max-w-2xl"
//       >
//         {/* --- 1. Success Icon Animation --- */}
//         <motion.div
//           variants={itemVariants}
//           className="mb-8 flex justify-center"
//         >
//           <div className="relative">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
//               className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 relative z-10"
//             >
//               <CheckCircle
//                 size={48}
//                 className="text-white drop-shadow-md"
//                 strokeWidth={3}
//               />
//             </motion.div>
//             {/* Pulse Rings */}
//             <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping delay-75"></div>
//             <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-xl"></div>
//           </div>
//         </motion.div>

//         {/* --- 2. Title Section --- */}
//         <motion.div variants={itemVariants} className="text-center mb-10">
//           <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
//             Order Confirmed!
//           </h1>
//           <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
//             Thank you for your purchase. We have received your order and are
//             getting it ready.
//           </p>
//         </motion.div>

//         {/* --- 3. The "Receipt" Card --- */}
//         <motion.div
//           variants={itemVariants}
//           className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative"
//         >
//           {/* Top decorative gradient line */}
//           <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

//           <div className="p-6 md:p-8">
//             {/* Header: ID & Copy */}
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 pb-6 mb-6">
//               <div className="text-center md:text-left">
//                 <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
//                   Order ID
//                 </p>
//                 <div
//                   className="flex items-center gap-2 group cursor-pointer"
//                   onClick={copyOrderId}
//                 >
//                   <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-wide">
//                     {orderDetails?.orderNumber || orderId || "Loading..."}
//                   </p>
//                   <button className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors text-slate-400">
//                     {copied ? (
//                       <Check size={14} className="text-green-400" />
//                     ) : (
//                       <Copy size={14} />
//                     )}
//                   </button>
//                 </div>
//               </div>
//               {/* Status Pill */}
//               <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold flex items-center gap-2">
//                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//                 Processing
//               </div>
//             </div>

//             {/* Loading State */}
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-10 space-y-4">
//                 <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
//                 <p className="text-slate-500 text-sm">
//                   Fetching order details...
//                 </p>
//               </div>
//             ) : (
//               <>
//                 {/* New Feature: Order Timeline */}
//                 <div className="mb-8">
//                   <div className="flex justify-between mb-2">
//                     <span className="text-xs font-bold text-blue-400">
//                       Placed
//                     </span>
//                     <span className="text-xs font-bold text-slate-600">
//                       Shipped
//                     </span>
//                     <span className="text-xs font-bold text-slate-600">
//                       Delivered
//                     </span>
//                   </div>
//                   <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
//                     <motion.div
//                       initial={{ width: 0 }}
//                       animate={{ width: "33%" }}
//                       transition={{ duration: 1, delay: 0.5 }}
//                       className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
//                     />
//                   </div>
//                   <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
//                     <Sparkles size={12} className="text-yellow-400" />
//                     We are currently processing your items.
//                   </p>
//                 </div>

//                 {/* Details Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 rounded-2xl p-5 border border-white/5">
//                   {/* Delivery Info */}
//                   <div className="space-y-3">
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
//                         <Truck size={18} />
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 font-bold uppercase">
//                           Estimated Delivery
//                         </p>
//                         <p className="text-white font-semibold">
//                           {deliveryString}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-3">
//                       <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
//                         <MapPin size={18} />
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-400 font-bold uppercase">
//                           Shipping To
//                         </p>
//                         <p className="text-white font-semibold text-sm line-clamp-1">
//                           {orderDetails?.shippingAddress?.city ||
//                             "Your Location"}
//                           , {orderDetails?.shippingAddress?.state}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Payment Summary */}
//                   <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-400">
//                         Items ({orderDetails?.items?.length})
//                       </span>
//                       <span className="text-white font-medium">
//                         ₹{orderDetails?.subtotal?.toLocaleString()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span className="text-slate-400">Shipping</span>
//                       <span className="text-green-400 font-medium">Free</span>
//                     </div>
//                     <div className="h-px bg-white/10 my-1"></div>
//                     <div className="flex justify-between text-base">
//                       <span className="text-white font-bold">Total Paid</span>
//                       <span className="text-xl font-black text-blue-400">
//                         ₹{orderDetails?.totalAmount?.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Bottom Actions Bar */}
//           <div className="bg-white/5 p-4 md:p-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
//             <button className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
//               <Download size={16} /> Download Invoice
//             </button>
//             <div className="flex gap-3 w-full sm:w-auto">
//               <button
//                 onClick={() => router.push("/orders")}
//                 className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/5"
//               >
//                 Track Order
//               </button>
//               <button
//                 onClick={() => router.push("/")}
//                 className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
//               >
//                 Continue Shopping
//                 <ArrowRight
//                   size={18}
//                   className="group-hover:translate-x-1 transition-transform"
//                 />
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* --- 4. Help Section --- */}
//         <motion.div variants={itemVariants} className="mt-8 text-center">
//           <p className="text-slate-500 text-sm">
//             Need help?{" "}
//             <a href="/chat" className="text-blue-400 hover:underline">
//               Chat with support
//             </a>{" "}
//             or{" "}
//             <a href="/orders" className="text-blue-400 hover:underline">
//               View details
//             </a>
//           </p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

// export default function OrderSuccessPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
//           <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
//         </div>
//       }
//     >
//       <SuccessContent />
//     </Suspense>
//   );
// }

"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  MapPin,
  Truck,
  Copy,
  Check,
} from "lucide-react";
import Confetti from "react-confetti";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50 },
  },
};

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deliveryDateString, setDeliveryDateString] =
    useState("Calculating...");

  useEffect(() => {
    // Window Resize for Confetti
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
    }

    // Stop Confetti after 6s
    const timer = setTimeout(() => setShowConfetti(false), 6000);

    // Fetch Order
    if (orderId) {
      fetchOrderDetails(orderId);
    }

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined")
        window.removeEventListener("resize", handleResize);
    };
  }, [orderId]);

  // --- PERFECT DELIVERY LOGIC (Hyderabad Origin) ---
  const calculateDelivery = (address: any) => {
    if (!address) return;

    const pincode = address.pincode || "";
    const state = address.state || "";

    let deliveryDate = new Date();

    // 1. Cutoff Time Rule: After 2 PM, dispatch happens next day
    if (deliveryDate.getHours() >= 14) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    let daysToAdd = 7; // Default fallback

    // Logic based on Uppal/Hyderabad Origin
    const isLocalHyd =
      pincode.startsWith("500") ||
      pincode.startsWith("501") ||
      pincode.startsWith("502");
    const isSouthMetro = pincode.startsWith("560") || pincode.startsWith("600"); // Bangalore/Chennai

    if (isLocalHyd) {
      daysToAdd = 2; // Local delivery
    } else if (state === "Telangana") {
      daysToAdd = 3; // Rest of TS
    } else if (state === "Andhra Pradesh") {
      daysToAdd = 4; // AP
    } else if (
      isSouthMetro ||
      ["Karnataka", "Tamil Nadu", "Maharashtra", "Kerala"].includes(state)
    ) {
      daysToAdd = 5; // South/West
    } else if (
      [
        "Assam",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Tripura",
        "Jammu and Kashmir",
      ].includes(state)
    ) {
      daysToAdd = 9; // Remote areas
    } else {
      daysToAdd = 7; // North India
    }

    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

    // 2. Sunday Rule: Skip Sunday delivery
    if (deliveryDate.getDay() === 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    setDeliveryDateString(
      deliveryDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    );
  };

  const fetchOrderDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/orders/${id}`);
      if (response.data.success) {
        const data = response.data.data.order || response.data.data;
        setOrderDetails(data);
        // Calculate delivery once data is available
        calculateDelivery(data.shippingAddress);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    if (orderDetails?.orderNumber) {
      navigator.clipboard.writeText(orderDetails.orderNumber);
      setCopied(true);
      toast.success("Order ID Copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // // ✅ SOUND EFFECT: Multilingual Professional Voice
  // useEffect(() => {
  //   // 1. Confetti Timer
  //   const timer = setTimeout(() => setShowConfetti(false), 6000);

  //   // 2. Play Sequence Voice (Eng -> Hin -> Tel)
  //   if ("speechSynthesis" in window) {
  //     // పాతవి ఏమైనా ఉంటే ఆపేస్తుంది
  //     window.speechSynthesis.cancel();

  //     // --- SCRIPT SETTINGS ---
  //     const textEng =
  //       "Thank you for shopping with us. Your order has been successfully placed and is being processed for express dispatch.";
  //     const textHin =
  //       "Hamein chunne ke liye dhanyavaad. Aapka order safaltapurvak place ho gaya hai.";
  //     const textTel =
  //       "మాతో షాపింగ్ చేసినందుకు ధన్యవాదాలు. మీ ఆర్డర్ విజయవంతంగా పూర్తయింది.";

  //     // --- UTTERANCE OBJECTS ---
  //     const utterEng = new SpeechSynthesisUtterance(textEng);
  //     const utterHin = new SpeechSynthesisUtterance(textHin);
  //     const utterTel = new SpeechSynthesisUtterance(textTel);

  //     // --- VOICE CONFIGURATION ---

  //     // English Config
  //     utterEng.lang = "en-IN"; // Indian English
  //     utterEng.rate = 0.9; // Slightly slow & professional
  //     utterEng.pitch = 1;
  //     utterEng.volume = 1;

  //     // Hindi Config
  //     utterHin.lang = "hi-IN"; // Hindi India
  //     utterHin.rate = 0.85; // Hindi needs to be a bit slower to be clear
  //     utterHin.pitch = 1;

  //     // Telugu Config
  //     utterTel.lang = "te-IN"; // Telugu India
  //     utterTel.rate = 0.85;
  //     utterTel.pitch = 1;

  //     // --- PLAY SEQUENCE (Queue them up) ---
  //     // ఒకదాని తర్వాత ఒకటి క్యూలో పెడితే ఆటోమేటిక్ గా ప్లే అవుతాయి
  //     setTimeout(() => {
  //       window.speechSynthesis.speak(utterEng);
  //       // English తర్వాత 0.5 sec గ్యాప్ ఇవ్వడం కోసం ఖాళీగా పాజ్ పెట్టలేము,
  //       // కానీ బ్రౌజర్ ఆటోమేటిక్ గా ఒక సెంటెన్స్ తర్వాత గ్యాప్ తీసుకుంటుంది.
  //       window.speechSynthesis.speak(utterHin);
  //       window.speechSynthesis.speak(utterTel);
  //     }, 1000); // Page load ayyaka 1 sec ki start avutundi
  //   }

  //   return () => {
  //     clearTimeout(timer);
  //     window.speechSynthesis.cancel(); // User page vadilesi velthe sound aagipovali
  //   };
  // }, []);

  // // ✅ SOUND EFFECT: Real Human Voice (MP3 Sequence)
  // useEffect(() => {
  //   // 1. Confetti Timer
  //   const timer = setTimeout(() => setShowConfetti(false), 6000);

  //   // 2. Play Audio Sequence (Eng -> Hin -> Tel)
  //   const playOrderAudio = async () => {
  //     try {
  //       // ఆడియో ఫైల్స్ లోడ్ చేయడం
  //       const audioEn = new Audio("/sounds/success-english.mp3");
  //       const audioHi = new Audio("/sounds/success-hindi.mp3");
  //       const audioTe = new Audio("/sounds/success-telugu.mp3");

  //       // English Play
  //       await audioEn.play();

  //       // English అయ్యాక Hindi
  //       audioEn.onended = async () => {
  //         await audioHi.play();
  //       };

  //       // Hindi అయ్యాక Telugu
  //       audioHi.onended = async () => {
  //         await audioTe.play();
  //       };

  //     } catch (err) {
  //       console.error("Audio play failed (User interaction needed):", err);
  //     }
  //   };

  //   // పేజీ లోడ్ అయిన 1 సెకన్ తర్వాత స్టార్ట్ అవుతుంది
  //   const audioTimer = setTimeout(() => {
  //     playOrderAudio();
  //   }, 1000);

  //   // Cleanup: యూజర్ పేజీ వదిలి వెళ్ళిపోతే సౌండ్ ఆగిపోవాలి
  //   return () => {
  //     clearTimeout(timer);
  //     clearTimeout(audioTimer);
  //     // ఆడియోలు స్టాప్ చేయడానికి సింపుల్ టెక్నిక్: వేరియబుల్స్ స్కోప్ లో లేవు కాబట్టి
  //     // ఇక్కడ రిటర్న్ క్లీనప్ సరిపోతుంది లేదా ఆడియోలను స్టేట్ లో పెట్టుకోవచ్చు.
  //     // సింపుల్ గా ఉంచడానికి టైమర్స్ క్లియర్ చేస్తున్నాం.
  //   };
  // }, []);

  // ✅ SOUND EFFECT: Custom MP3 File
  useEffect(() => {
    const audio = new Audio("/sounds/success.mp3");

    // ఆడియో ప్లే చేయడానికి ట్రై చేస్తుంది
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Audio play blocked by browser:", err);
      }
    };

    setTimeout(playAudio, 500); // 0.5 sec delay
  }, []);

  return (
    // ✅ Updated Background: Light gray for Light Mode, Deep Blue for Dark Mode
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-white flex flex-col items-center justify-center p-4 pt-20 relative overflow-hidden font-sans transition-colors duration-300">
      {/* 🌌 Background Ambience (Adaptive) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.03]"></div>
      </div>

      {/* 🎉 Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
            colors={["#3b82f6", "#6366f1", "#10b981", "#fbbf24"]}
          />
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl"
      >
        {/* --- 1. Success Icon Animation --- */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 relative z-10"
            >
              <CheckCircle
                size={48}
                className="text-white drop-shadow-md"
                strokeWidth={3}
              />
            </motion.div>
            {/* Pulse Rings */}
            <div className="absolute inset-0 bg-green-500/30 rounded-full animate-ping delay-75"></div>
            <div className="absolute -inset-4 bg-green-500/10 rounded-full blur-xl"></div>
          </div>
        </motion.div>

        {/* --- 2. Title Section --- */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900 dark:text-white dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-white/70">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. We have received your order and are
            getting it ready.
          </p>
        </motion.div>

        {/* --- 3. The "Receipt" Card (Glassmorphism Light/Dark) --- */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl dark:shadow-none relative"
        >
          {/* Top decorative gradient line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

          <div className="p-6 md:p-8">
            {/* Header: ID & Copy */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-6 mb-6">
              <div className="text-center md:text-left">
                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-1">
                  Order ID
                </p>
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={copyOrderId}
                >
                  <p className="text-xl md:text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wide">
                    {orderDetails?.orderNumber || orderId || "Loading..."}
                  </p>
                  <button className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors text-gray-500 dark:text-slate-400">
                    {copied ? (
                      <Check
                        size={14}
                        className="text-green-500 dark:text-green-400"
                      />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>
              {/* Status Pill */}
              <div className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Processing
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
                <p className="text-gray-500 dark:text-slate-500 text-sm">
                  Fetching order details...
                </p>
              </div>
            ) : (
              <>
                {/* Order Timeline */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Placed
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-600">
                      Shipped
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-600">
                      Delivered
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "33%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 flex items-center gap-1">
                    <Sparkles
                      size={12}
                      className="text-yellow-500 dark:text-yellow-400"
                    />
                    We are currently processing your items.
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                  {/* Delivery Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                        <Truck size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase">
                          Estimated Delivery
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold">
                          {deliveryDateString}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 font-bold uppercase">
                          Shipping To
                        </p>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm line-clamp-1">
                          {orderDetails?.shippingAddress?.city ||
                            "Your Location"}
                          , {orderDetails?.shippingAddress?.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="space-y-3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 pt-4 md:pt-0 md:pl-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">
                        Items ({orderDetails?.items?.length})
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ₹{orderDetails?.subtotal?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-400">
                        Shipping
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Free
                      </span>
                    </div>
                    <div className="h-px bg-gray-200 dark:bg-white/10 my-1"></div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-900 dark:text-white font-bold">
                        Total Paid
                      </span>
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                        ₹{orderDetails?.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Actions Bar */}
          <div className="bg-gray-50 dark:bg-white/5 p-4 md:p-6 flex flex-col sm:flex-row gap-3 justify-end items-center">
            {/* Invoice Button Removed as Requested */}

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push("/orders")}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold transition-all border border-gray-200 dark:border-white/5 shadow-sm"
              >
                Track Order
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
              >
                Continue Shopping
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- 4. Help Section --- */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-gray-500 dark:text-slate-500 text-sm">
            Need help?{" "}
            <a
              href="/chat"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Chat with support
            </a>{" "}
            or{" "}
            <a
              href="/orders"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View details
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-[#020617] flex items-center justify-center text-gray-900 dark:text-white">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
