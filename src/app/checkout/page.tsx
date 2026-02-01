// // src/app/checkout/page.tsx
// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import { useStore } from "@/store/useStore";
// import { useAuth } from "@/hooks/useAuth";
// import apiClient from "@/services/apiClient";
// import toast from "react-hot-toast";
// import {
//   MapPin,
//   Plus,
//   CreditCard,
//   Package,
//   Tag,
//   Truck,
//   CheckCircle,
//   Loader2,
//   Home,
//   Building,
//   Wallet,
//   DollarSign,
//   AlertCircle,
// } from "lucide-react";
// import { AddAddressModal } from "@/components/checkout/AddAddressModal";
// import styles from "./page.module.css";

// // ==================== TYPE DEFINITIONS ====================
// interface Address {
//   _id: string;
//   addressType: string;
//   street: string;
//   city: string;
//   state: string;
//   pincode: string;
//   isDefault: boolean;
// }

// interface OrderResponse {
//   success: boolean;
//   data: {
//     order: {
//       _id: string;
//       orderNumber: string;
//       totalAmount: number;
//       paymentMethod: string;
//     };
//   };
// }

// interface RazorpayOrderResponse {
//   success: boolean;
//   data: {
//     razorpayOrderId: string;
//     amount: number;
//     keyId: string;
//     currency: string;
//   };
// }

// interface RazorpayResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// type PaymentMethod = "Razorpay" | "COD";

// // Extend Window interface for Razorpay
// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// // ==================== MAIN COMPONENT ====================
// export default function CheckoutPage() {
//   const router = useRouter();
//   const { user, isAuthenticated, loading: authLoading } = useAuth();
//   const { cart, setCart } = useStore();

//   // State management
//   const [addresses, setAddresses] = useState<Address[]>([]);
//   const [selectedAddressId, setSelectedAddressId] = useState<string>("");
//   const [selectedPaymentMethod, setSelectedPaymentMethod] =
//     useState<PaymentMethod>("Razorpay");
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [showAddAddressModal, setShowAddAddressModal] = useState(false);
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);
//   const [scriptError, setScriptError] = useState(false);

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       toast.error("Please login to continue");
//       router.push("/login");
//       return;
//     }

//     if (!authLoading && isAuthenticated && (!cart || cart.items.length === 0)) {
//       toast.error("Your cart is empty");
//       router.push("/cart");
//       return;
//     }

//     if (isAuthenticated && cart && cart.items.length > 0) {
//       fetchAddresses();
//       loadRazorpayScript();
//     }
//   }, [authLoading, isAuthenticated, cart, router]);

//   // ==================== RAZORPAY SCRIPT LOADING ====================
//   const loadRazorpayScript = useCallback(() => {
//     if (window.Razorpay) {
//       setRazorpayLoaded(true);
//       return;
//     }

//     const existingScript = document.querySelector('script[src*="razorpay"]');
//     if (existingScript) {
//       existingScript.addEventListener("load", () => {
//         setRazorpayLoaded(true);
//       });
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;

//     script.onload = () => {
//       setRazorpayLoaded(true);
//       setScriptError(false);
//     };

//     script.onerror = () => {
//       setScriptError(true);
//       setRazorpayLoaded(false);
//       toast.error("Failed to load payment gateway");
//     };

//     document.body.appendChild(script);
//   }, []);

//   // ==================== FETCH ADDRESSES ====================
//   const fetchAddresses = async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get("/auth/profile");
//       if (response.data.success) {
//         const userAddresses = response.data.data.user.addresses || [];
//         setAddresses(userAddresses);

//         const defaultAddress = userAddresses.find(
//           (addr: Address) => addr.isDefault,
//         );
//         if (defaultAddress) {
//           setSelectedAddressId(defaultAddress._id);
//         } else if (userAddresses.length > 0) {
//           setSelectedAddressId(userAddresses[0]._id);
//         }
//       }
//     } catch (error: any) {
//       console.error("Error fetching addresses:", error);
//       toast.error("Failed to load addresses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== ADDRESS HANDLERS ====================
//   const handleAddressAdded = useCallback(() => {
//     setShowAddAddressModal(false);
//     fetchAddresses();
//     toast.success("Address added successfully");
//   }, []);

//   // ==================== COD PAYMENT HANDLER ====================
//   const handleCODPayment = async () => {
//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address");
//       return;
//     }

//     if (!cart) {
//       toast.error("Cart is empty");
//       return;
//     }

//     setProcessing(true);

//     try {
//       const orderPayload = {
//         shippingAddressId: selectedAddressId,
//         paymentMethod: "COD",
//       };

//       const response = await apiClient.post("/orders", orderPayload);
//       const apiResponse = response.data;

//       console.log("Full API Response:", apiResponse);

//       if (!apiResponse.success) {
//         throw new Error(apiResponse.message || "Failed to create order");
//       }

//       const orderId = apiResponse.data?.order?._id;

//       if (!orderId) {
//         throw new Error("Order ID missing in response");
//       }

//       toast.success(apiResponse.message || "Order placed successfully!");
//       router.push(`/orders/success?orderId=${orderId}`);
//     } catch (error: any) {
//       console.error("COD Payment error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.error ||
//         error.message ||
//         "Failed to place order";

//       toast.error(errorMessage);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // ==================== UNIFIED PAYMENT HANDLER ====================
//   const handlePayment = () => {
//     if (selectedPaymentMethod === "COD") {
//       handleCODPayment();
//     } else {
//       // handleRazorpayPayment();
//       toast.error("Online payment integration pending"); // Temporary placeholder
//     }
//   };

//   // ==================== LOADING STATE ====================
//   if (authLoading || loading) {
//     return <LoadingSkeleton />;
//   }

//   if (!isAuthenticated || !cart) {
//     return null;
//   }

//   // ==================== RENDER ====================
//   return (
//     <div
//       className={`${styles.container} bg-gray-50 dark:bg-black min-h-screen`}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className={styles.header}
//       >
//         <h1
//           className={`${styles.title} text-3xl font-bold text-gray-900 dark:text-white`}
//         >
//           Checkout
//         </h1>
//         <p
//           className={`${styles.subtitle} text-gray-600 dark:text-gray-400 mt-2`}
//         >
//           Complete your order securely
//         </p>
//       </motion.div>

//       <div className={styles.content}>
//         <div className={styles.leftColumn}>
//           {/* Address Section */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//           >
//             <div className={styles.sectionHeader}>
//               <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
//               <h2
//                 className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
//               >
//                 Delivery Address
//               </h2>
//             </div>

//             {addresses.length === 0 ? (
//               <div className={styles.noAddresses}>
//                 <MapPin size={48} className="text-gray-400 mb-4" />
//                 <p className="text-gray-600 dark:text-gray-400 mb-4">
//                   No saved addresses. Add one to continue.
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setShowAddAddressModal(true)}
//                   className={`${styles.addAddressButton} bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400`}
//                 >
//                   <Plus size={20} />
//                   Add Delivery Address
//                 </motion.button>
//               </div>
//             ) : (
//               <>
//                 <div className={styles.addressList}>
//                   {addresses.map((address, index) => (
//                     <motion.div
//                       key={address._id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       onClick={() => setSelectedAddressId(address._id)}
//                       className={`${styles.addressCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
//                         selectedAddressId === address._id
//                           ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
//                           : "border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-transparent"
//                       }`}
//                     >
//                       {selectedAddressId === address._id && (
//                         <motion.div
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           className="absolute top-4 right-4 text-blue-600 dark:text-blue-400"
//                         >
//                           <CheckCircle size={20} />
//                         </motion.div>
//                       )}

//                       <div className="flex items-center gap-2 mb-2">
//                         {address.addressType === "Home" ? (
//                           <Home
//                             size={18}
//                             className="text-gray-500 dark:text-gray-400"
//                           />
//                         ) : (
//                           <Building
//                             size={18}
//                             className="text-gray-500 dark:text-gray-400"
//                           />
//                         )}
//                         <span className="font-semibold text-gray-900 dark:text-white">
//                           {address.addressType}
//                         </span>
//                         {address.isDefault && (
//                           <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
//                             Default
//                           </span>
//                         )}
//                       </div>

//                       <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
//                         <p>{address.street}</p>
//                         <p>
//                           {address.city}, {address.state}
//                         </p>
//                         <p className="font-medium">PIN: {address.pincode}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setShowAddAddressModal(true)}
//                   className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                   <Plus size={18} />
//                   Add New Address
//                 </motion.button>
//               </>
//             )}
//           </motion.div>

//           {/* Payment Method Section */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.4 }}
//             className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//           >
//             <div className={styles.sectionHeader}>
//               <CreditCard
//                 className="text-blue-600 dark:text-blue-400"
//                 size={24}
//               />
//               <h2
//                 className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
//               >
//                 Payment Method
//               </h2>
//             </div>

//             <div className={styles.paymentMethods}>
//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => setSelectedPaymentMethod("Razorpay")}
//                 className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
//                   selectedPaymentMethod === "Razorpay"
//                     ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
//                     : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
//                 }`}
//               >
//                 {selectedPaymentMethod === "Razorpay" && (
//                   <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
//                     <CheckCircle size={20} />
//                   </div>
//                 )}
//                 <Wallet
//                   size={32}
//                   className="text-blue-600 dark:text-blue-400 mb-3"
//                 />
//                 <h3 className="font-bold text-gray-900 dark:text-white mb-1">
//                   Online Payment
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Pay with Card, UPI, Net Banking
//                 </p>
//                 {!razorpayLoaded && selectedPaymentMethod === "Razorpay" && (
//                   <div className="flex items-center gap-2 mt-2 text-xs text-yellow-600 dark:text-yellow-500">
//                     <AlertCircle size={14} />
//                     <span>Loading...</span>
//                   </div>
//                 )}
//               </motion.div>

//               <motion.div
//                 whileHover={{ scale: 1.02 }}
//                 onClick={() => setSelectedPaymentMethod("COD")}
//                 className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
//                   selectedPaymentMethod === "COD"
//                     ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 dark:border-green-400"
//                     : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
//                 }`}
//               >
//                 {selectedPaymentMethod === "COD" && (
//                   <div className="absolute top-4 right-4 text-green-600 dark:text-green-400">
//                     <CheckCircle size={20} />
//                   </div>
//                 )}
//                 <DollarSign
//                   size={32}
//                   className="text-green-600 dark:text-green-400 mb-3"
//                 />
//                 <h3 className="font-bold text-gray-900 dark:text-white mb-1">
//                   Cash on Delivery
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Pay when you receive
//                 </p>
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Order Summary */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           className={`${styles.orderSummary} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
//         >
//           <h2
//             className={`${styles.summaryTitle} text-xl font-bold text-gray-900 dark:text-white mb-6`}
//           >
//             Order Summary
//           </h2>

//           <div className={styles.itemsPreview}>
//             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
//               {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
//             </p>
//             <div className="space-y-3 mb-4">
//               {cart.items.slice(0, 3).map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex justify-between items-start text-sm"
//                 >
//                   <span className="text-gray-700 dark:text-gray-300">
//                     {item.product.name} × {item.quantity}
//                   </span>
//                   <span className="font-semibold text-gray-900 dark:text-white">
//                     ₹{item.subtotal}
//                   </span>
//                 </div>
//               ))}
//               {cart.items.length > 3 && (
//                 <p className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
//                   +{cart.items.length - 3} more items
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                 <Package size={16} />
//                 Subtotal
//               </span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 ₹{cart.subtotal}
//               </span>
//             </div>

//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                 <Tag size={16} />
//                 GST (18%)
//               </span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 ₹{cart.tax}
//               </span>
//             </div>

//             <div className="flex justify-between text-sm">
//               <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
//                 <Truck size={16} />
//                 Shipping
//               </span>
//               <span className="font-medium text-gray-900 dark:text-white">
//                 {cart.shippingCharges === 0 ? (
//                   <span className="text-green-600 dark:text-green-400 font-bold">
//                     FREE
//                   </span>
//                 ) : (
//                   `₹${cart.shippingCharges}`
//                 )}
//               </span>
//             </div>

//             <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4" />

//             <div className="flex justify-between items-center text-lg font-bold">
//               <span className="text-gray-900 dark:text-white">Total</span>
//               <span className="text-blue-600 dark:text-blue-400">
//                 ₹{cart.totalAmount}
//               </span>
//             </div>
//           </div>

//           <motion.button
//             whileHover={{ scale: processing ? 1 : 1.02 }}
//             whileTap={{ scale: processing ? 1 : 0.98 }}
//             onClick={handlePayment}
//             disabled={
//               processing || !selectedAddressId || addresses.length === 0
//             }
//             className={`${styles.paymentButton} w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
//           >
//             {processing ? (
//               <>
//                 <Loader2 size={20} className="animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 {selectedPaymentMethod === "Razorpay" ? (
//                   <>
//                     <CreditCard size={20} />
//                     Pay ₹{cart.totalAmount}
//                   </>
//                 ) : (
//                   <>
//                     <DollarSign size={20} />
//                     Place Order (COD)
//                   </>
//                 )}
//               </>
//             )}
//           </motion.button>

//           <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
//             <CheckCircle
//               size={14}
//               className="text-green-600 dark:text-green-500"
//             />
//             <span>
//               {selectedPaymentMethod === "Razorpay"
//                 ? "Secure payment by Razorpay"
//                 : "Safe Cash on Delivery"}
//             </span>
//           </div>
//         </motion.div>
//       </div>

//       <AnimatePresence>
//         {showAddAddressModal && (
//           <AddAddressModal
//             onClose={() => setShowAddAddressModal(false)}
//             onSuccess={handleAddressAdded}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function LoadingSkeleton() {
//   return (
//     <div className={`${styles.container} bg-gray-50 dark:bg-black p-8`}>
//       <div className={styles.header}>
//         <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
//         <div className="h-5 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
//       </div>
//       <div className={styles.content}>
//         <div className={styles.leftColumn}>
//           <div
//             className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6"
//             style={{ height: "400px" }}
//           >
//             <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
//           </div>
//           <div
//             className="bg-white dark:bg-gray-900 rounded-xl p-6"
//             style={{ height: "300px" }}
//           >
//             <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
//           </div>
//         </div>
//         <div
//           className="bg-white dark:bg-gray-900 rounded-xl p-6"
//           style={{ height: "500px" }}
//         >
//           <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/services/apiClient";
import toast from "react-hot-toast";
import {
  MapPin,
  Plus,
  CreditCard,
  Package,
  Tag,
  Truck,
  CheckCircle,
  Loader2,
  Home,
  Building,
  Wallet,
  DollarSign,
} from "lucide-react";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import styles from "./page.module.css";

// ==================== TYPE DEFINITIONS ====================
interface Address {
  _id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

type PaymentMethod = "Razorpay" | "COD";

// ==================== MAIN COMPONENT ====================
export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { cart, setCart } = useStore();

  // State management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("COD");

  // Loading States
  const [loading, setLoading] = useState(true); // Initial data fetch
  const [processing, setProcessing] = useState(false); // Order submission
  const [isOrderPlaced, setIsOrderPlaced] = useState(false); // Success transition

  // Modals & Pincode
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [deliveryMsg, setDeliveryMsg] = useState("");

  // 🔥 MASTER LOADER LOGIC
  // పేజీ లోడ్ అవుతున్నప్పుడు, లేదా ఆర్డర్ ప్రాసెస్ అవుతున్నప్పుడు, లేదా సక్సెస్ అయ్యాక
  // ఈ లోడర్ స్క్రీన్ ని కవర్ చేస్తుంది.
  const showOverlayLoader =
    authLoading || loading || processing || isOrderPlaced;

  // ==================== EFFECTS ====================

  // 1. Auth & Cart Validation (Reload Issue Fix)
  useEffect(() => {
    if (authLoading) return; // Wait for auth

    if (!isAuthenticated) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    // Cart Check - only if not already placed order
    if (!isOrderPlaced && cart !== null && !loading) {
      if (cart.items.length === 0) {
        // చిన్న డిలే ఇవ్వడం వల్ల రీలోడ్ అప్పుడు వెంటనే Redirect అవ్వదు
        const timer = setTimeout(() => {
          if (cart.items.length === 0) {
            toast.error("Your cart is empty");
            router.push("/cart");
          }
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [authLoading, isAuthenticated, cart, router, isOrderPlaced, loading]);

  // 2. Load Data
  useEffect(() => {
    if (isAuthenticated && cart && cart.items.length > 0) {
      fetchAddresses();
    } else if (isAuthenticated && cart && cart.items.length === 0) {
      setLoading(false); // Cart empty but authenticated (handled by redirect above)
    }
  }, [isAuthenticated, cart]);

  // 3. Load Saved Pincode
  useEffect(() => {
    const savedPin = localStorage.getItem("user_pincode");
    if (savedPin) {
      setPincode(savedPin);
      checkDelivery(savedPin);
    }
  }, []);

  // ==================== API FUNCTIONS ====================
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/auth/profile");
      if (response.data.success) {
        const userAddresses = response.data.data.user.addresses || [];
        setAddresses(userAddresses);

        const defaultAddress = userAddresses.find(
          (addr: Address) => addr.isDefault,
        );
        if (defaultAddress) setSelectedAddressId(defaultAddress._id);
        else if (userAddresses.length > 0)
          setSelectedAddressId(userAddresses[0]._id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const checkDelivery = async (manualCode?: string) => {
    const codeToCheck = typeof manualCode === "string" ? manualCode : pincode;
    if (!codeToCheck || codeToCheck.length !== 6) {
      setPincodeStatus("error");
      setDeliveryMsg("Enter valid pincode");
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
        const state = details.State;

        // Delivery Date Logic (Same as before)
        let deliveryDate = new Date();
        if (deliveryDate.getHours() >= 14)
          deliveryDate.setDate(deliveryDate.getDate() + 1);

        let daysToAdd = 7;
        const isLocalHyd =
          codeToCheck.startsWith("500") ||
          codeToCheck.startsWith("501") ||
          codeToCheck.startsWith("502");
        const isSouthMetro =
          codeToCheck.startsWith("560") || codeToCheck.startsWith("600");

        if (isLocalHyd) daysToAdd = 2;
        else if (state === "Telangana") daysToAdd = 3;
        else if (state === "Andhra Pradesh") daysToAdd = 4;
        else if (
          isSouthMetro ||
          ["Karnataka", "Tamil Nadu", "Maharashtra"].includes(state)
        )
          daysToAdd = 5;
        else daysToAdd = 7;

        deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
        if (deliveryDate.getDay() === 0)
          deliveryDate.setDate(deliveryDate.getDate() + 1);

        const dateString = deliveryDate.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });

        localStorage.setItem("user_pincode", codeToCheck);
        setPincodeStatus("success");
        setDeliveryMsg(`Arrives by ${dateString}`);
      } else {
        setPincodeStatus("error");
        setDeliveryMsg("Not serviceable");
      }
    } catch (err) {
      setPincodeStatus("error");
      setDeliveryMsg("Verification failed");
    }
  };

  const handleAddressAdded = useCallback(() => {
    setShowAddAddressModal(false);
    fetchAddresses();
    toast.success("Address added successfully");
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId)
      return toast.error("Please select a delivery address");
    if (!cart) return toast.error("Cart is empty");

    setProcessing(true); // START OVERLAY LOADER

    try {
      const orderPayload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
      };

      const response = await apiClient.post("/orders", orderPayload);

      if (response.data.success) {
        const orderId = response.data.data?.order?._id;
        if (!orderId) throw new Error("Order ID missing");

        toast.success("Order placed successfully!");
        setIsOrderPlaced(true); // KEEP OVERLAY LOADER ON
        setCart(null);
        router.push(`/orders/success?orderId=${orderId}`);
      } else {
        throw new Error(response.data.message || "Failed");
      }
    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      setProcessing(false); // Hide loader only on error
    }
  };

  const handlePaymentClick = () => {
    if (selectedPaymentMethod === "Razorpay") {
      toast.error("Online payment unavailable. Use COD.");
      setSelectedPaymentMethod("COD");
    } else {
      handlePlaceOrder();
    }
  };

  // ==================== RENDER ====================
  return (
    <div
      className={`${styles.container} bg-gray-50 dark:bg-black min-h-screen relative`}
    >
      {/* 🔥🔥 1. BIG ANIMATED OVERLAY LOADER 🔥🔥 */}
      {/* ఇది Loading, Processing, Success అన్ని సమయాల్లో టాప్ లో ఉంటుంది */}
      <AnimatePresence>
        {showOverlayLoader && (
          <CheckoutLoader
            message={
              isOrderPlaced
                ? "Order Placed Successfully!"
                : processing
                  ? "Securing your Order..."
                  : "Loading Checkout..."
            }
          />
        )}
      </AnimatePresence>

      {/* 🔥🔥 2. CONDITIONAL CONTENT RENDER 🔥🔥 */}
      {/* - authLoading లేదా loading ఉన్నప్పుడు 'LoadingSkeleton' చూపిస్తాం.
         - దీని వల్ల పేజీ Height ఉంటుంది, Footer పైకి రాదు.
         - పైన ఉన్న 'CheckoutLoader' దీని పైన కవర్ చేస్తుంది కాబట్టి యూజర్ కి స్మూత్ గా ఉంటుంది.
      */}
      {authLoading || loading || !cart ? (
        <LoadingSkeleton />
      ) : (
        // అసలు కంటెంట్ (Data is Ready)
        isAuthenticated &&
        cart && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.header}
            >
              <h1
                className={`${styles.title} text-3xl font-bold text-gray-900 dark:text-white`}
              >
                Checkout
              </h1>
              <p
                className={`${styles.subtitle} text-gray-600 dark:text-gray-400 mt-2`}
              >
                Complete your order securely
              </p>
            </motion.div>

            <div className={styles.content}>
              <div className={styles.leftColumn}>
                {/* Address Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
                >
                  <div className={styles.sectionHeader}>
                    <MapPin
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                    <h2
                      className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
                    >
                      Delivery Address
                    </h2>
                  </div>

                  {addresses.length === 0 ? (
                    <div className={styles.noAddresses}>
                      <MapPin size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No saved addresses.
                      </p>
                      <button
                        onClick={() => setShowAddAddressModal(true)}
                        className={`${styles.addAddressButton} bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400`}
                      >
                        <Plus size={20} /> Add Delivery Address
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={styles.addressList}>
                        {addresses.map((address) => (
                          <div
                            key={address._id}
                            onClick={() => setSelectedAddressId(address._id)}
                            className={`${styles.addressCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
                              selectedAddressId === address._id
                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            {selectedAddressId === address._id && (
                              <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
                                <CheckCircle size={20} />
                              </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              {address.addressType === "Home" ? (
                                <Home size={18} />
                              ) : (
                                <Building size={18} />
                              )}
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {address.addressType}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <p>{address.street}</p>
                              <p>
                                {address.city}, {address.state}
                              </p>
                              <p className="font-bold">{address.pincode}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setShowAddAddressModal(true)}
                        className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Plus size={18} /> Add New Address
                      </button>
                    </>
                  )}
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
                >
                  <div className={styles.sectionHeader}>
                    <CreditCard
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                    <h2
                      className={`${styles.sectionTitle} text-xl font-bold text-gray-900 dark:text-white`}
                    >
                      Payment Method
                    </h2>
                  </div>
                  <div className={styles.paymentMethods}>
                    <div
                      onClick={() => setSelectedPaymentMethod("Razorpay")}
                      className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative ${
                        selectedPaymentMethod === "Razorpay"
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                          : "border-gray-200 dark:border-gray-700 opacity-60"
                      }`}
                    >
                      {selectedPaymentMethod === "Razorpay" && (
                        <div className="absolute top-4 right-4 text-blue-600">
                          <CheckCircle size={20} />
                        </div>
                      )}
                      <Wallet size={32} className="text-blue-600 mb-3" />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Online Payment
                      </h3>
                      <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 rounded">
                        Coming Soon
                      </span>
                    </div>
                    <div
                      onClick={() => setSelectedPaymentMethod("COD")}
                      className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative ${
                        selectedPaymentMethod === "COD"
                          ? "border-green-500 bg-green-50/50 dark:bg-green-900/10"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {selectedPaymentMethod === "COD" && (
                        <div className="absolute top-4 right-4 text-green-600">
                          <CheckCircle size={20} />
                        </div>
                      )}
                      <DollarSign size={32} className="text-green-600 mb-3" />
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Cash on Delivery
                      </h3>
                      <p className="text-sm text-gray-500">
                        Pay when you receive
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Order Summary */}
              <div
                className={
                  styles.orderSummary +
                  " bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800"
                }
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {cart.items.slice(0, 3).map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{item.subtotal}
                      </span>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <p className="text-xs text-blue-500">
                      +{cart.items.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{cart.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₹{cart.tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-500">
                      {cart.shippingCharges === 0
                        ? "FREE"
                        : `₹${cart.shippingCharges}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-blue-600">₹{cart.totalAmount}</span>
                  </div>
                </div>

                {/* Pincode Checker */}
                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  {pincodeStatus === "success" ? (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xs uppercase">
                          <Truck size={14} /> Estimated Delivery
                        </div>
                        <button
                          onClick={() => {
                            setPincodeStatus(null);
                            setDeliveryMsg("");
                          }}
                          className="text-xs text-blue-500 font-bold"
                        >
                          CHANGE
                        </button>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {deliveryMsg}
                      </p>
                      <p className="text-xs text-gray-500">to {pincode}</p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={(e) =>
                          setPincode(e.target.value.replace(/\D/g, ""))
                        }
                        className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => checkDelivery()}
                        disabled={pincodeStatus === "loading"}
                        className="bg-gray-200 dark:bg-gray-800 px-3 rounded-lg text-sm font-bold"
                      >
                        {pincodeStatus === "loading" ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          "Check"
                        )}
                      </button>
                    </div>
                  )}
                  {pincodeStatus === "error" && (
                    <p className="text-xs text-red-500 mt-1">{deliveryMsg}</p>
                  )}
                </div>

                {/* Pay Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePaymentClick}
                  disabled={processing || !selectedAddressId}
                  className={`${styles.paymentButton} w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" /> Processing...
                    </>
                  ) : selectedPaymentMethod === "Razorpay" ? (
                    `Pay ₹${cart.totalAmount}`
                  ) : (
                    "Place Order (COD)"
                  )}
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {showAddAddressModal && (
                <AddAddressModal
                  onClose={() => setShowAddAddressModal(false)}
                  onSuccess={handleAddressAdded}
                />
              )}
            </AnimatePresence>
          </>
        )
      )}
    </div>
  );
}

// ==================== HELPER COMPONENTS ====================

function LoadingSkeleton() {
  return (
    <div
      className={`${styles.container} bg-gray-50 dark:bg-black p-8 min-h-screen`}
    >
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-6" />
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6 h-[200px] animate-pulse" />
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-[150px] animate-pulse" />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-[400px] animate-pulse" />
      </div>
    </div>
  );
}

function CheckoutLoader({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white/90 dark:bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-b-4 border-r-4 border-blue-600 dark:border-blue-400 border-t-transparent border-l-transparent"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full border-t-4 border-l-4 border-purple-500 dark:border-purple-400 border-b-transparent border-r-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle size={32} className="text-gray-900 dark:text-white" />
          </div>
        </div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {message}
        </motion.h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
          Please do not close this window
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </p>
      </div>
    </motion.div>
  );
}
