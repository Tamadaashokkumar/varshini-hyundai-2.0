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

// src/app/checkout/page.tsx
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
  AlertCircle,
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
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // ✅ NEW: Pincode Feature States
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<
    "loading" | "success" | "error" | null
  >(null);
  const [deliveryMsg, setDeliveryMsg] = useState("");

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    if (!authLoading && isAuthenticated && (!cart || cart.items.length === 0)) {
      if (!isOrderPlaced) {
        toast.error("Your cart is empty");
        router.push("/cart");
      }
      return;
    }

    if (isAuthenticated && cart && cart.items.length > 0) {
      fetchAddresses();
    }
  }, [authLoading, isAuthenticated, cart, router]);

  // ✅ NEW: Load Saved Pincode on Mount
  useEffect(() => {
    const savedPin = localStorage.getItem("user_pincode");
    if (savedPin) {
      setPincode(savedPin);
      checkDelivery(savedPin);
    }
  }, []);

  // ==================== FETCH ADDRESSES ====================
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/auth/profile");
      if (response.data.success) {
        const userAddresses = response.data.data.user.addresses || [];
        setAddresses(userAddresses);

        // Auto-select default or first address
        const defaultAddress = userAddresses.find(
          (addr: Address) => addr.isDefault,
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0]._id);
        }
      }
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Pincode Delivery Logic (Hyderabad/Uppal Origin)
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

        // Realistic Dispatch Timing (2 PM Cutoff)
        let deliveryDate = new Date();
        const currentHour = deliveryDate.getHours();
        if (currentHour >= 14) {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        }

        // Logic based on Uppal/Hyderabad Origin
        let daysToAdd = 7;
        const isLocalHyd =
          codeToCheck.startsWith("500") ||
          codeToCheck.startsWith("501") ||
          codeToCheck.startsWith("502");
        const isSouthMetro =
          codeToCheck.startsWith("560") || codeToCheck.startsWith("600");

        if (isLocalHyd) {
          daysToAdd = 2;
        } else if (state === "Telangana") {
          daysToAdd = 3;
        } else if (state === "Andhra Pradesh") {
          daysToAdd = 4;
        } else if (
          isSouthMetro ||
          ["Karnataka", "Tamil Nadu", "Maharashtra"].includes(state)
        ) {
          daysToAdd = 5;
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
          daysToAdd = 9;
        } else {
          daysToAdd = 7;
        }

        deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

        // Sunday Skip
        if (deliveryDate.getDay() === 0) {
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        }

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

  // ==================== ADDRESS HANDLERS ====================
  const handleAddressAdded = useCallback(() => {
    setShowAddAddressModal(false);
    fetchAddresses();
    toast.success("Address added successfully");
  }, []);

  // ==================== ORDER PLACEMENT HANDLER ====================
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!cart) {
      toast.error("Cart is empty");
      return;
    }

    setProcessing(true);

    try {
      const orderPayload = {
        shippingAddressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
      };

      const response = await apiClient.post("/orders", orderPayload);
      const apiResponse = response.data;

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to create order");
      }

      const orderData = apiResponse.data?.order;
      const orderId = orderData?._id;

      if (!orderId) {
        throw new Error("Order created but ID missing");
      }

      toast.success(apiResponse.message || "Order placed successfully!");
      // 🔥 Step 1: Tell system order is done! (Stop Redirect)
      setIsOrderPlaced(true);

      // Step 2: Now safe to clear cart
      setCart(null);

      router.push(`/orders/success?orderId=${orderId}`);
    } catch (error: any) {
      console.error("Order Placement Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to place order";

      if (errorMessage.includes("Insufficient stock")) {
        toast.error("Some items are out of stock. Please update cart.");
        router.push("/cart");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentClick = () => {
    if (selectedPaymentMethod === "Razorpay") {
      toast.error("Online payment is currently unavailable. Please use COD.");
      setSelectedPaymentMethod("COD");
    } else {
      handlePlaceOrder();
    }
  };

  // ==================== LOADING STATE ====================
  if (authLoading || loading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated || !cart) {
    return null;
  }

  // ==================== RENDER ====================
  return (
    <div
      className={`${styles.container} bg-gray-50 dark:bg-black min-h-screen`}
    >
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
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${styles.section} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
          >
            <div className={styles.sectionHeader}>
              <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
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
                  No saved addresses. Add one to continue.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddAddressModal(true)}
                  className={`${styles.addAddressButton} bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400`}
                >
                  <Plus size={20} />
                  Add Delivery Address
                </motion.button>
              </div>
            ) : (
              <>
                <div className={styles.addressList}>
                  {addresses.map((address, index) => (
                    <motion.div
                      key={address._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedAddressId(address._id)}
                      className={`${styles.addressCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
                        selectedAddressId === address._id
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-white dark:bg-transparent"
                      }`}
                    >
                      {selectedAddressId === address._id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 text-blue-600 dark:text-blue-400"
                        >
                          <CheckCircle size={20} />
                        </motion.div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        {address.addressType === "Home" ? (
                          <Home
                            size={18}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        ) : (
                          <Building
                            size={18}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        )}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {address.addressType}
                        </span>
                        {address.isDefault && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state}
                        </p>
                        <p className="font-medium">PIN: {address.pincode}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddAddressModal(true)}
                  className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Plus size={18} />
                  Add New Address
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Payment Method Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPaymentMethod("Razorpay")}
                className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
                  selectedPaymentMethod === "Razorpay"
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent opacity-60"
                }`}
              >
                {selectedPaymentMethod === "Razorpay" && (
                  <div className="absolute top-4 right-4 text-blue-600 dark:text-blue-400">
                    <CheckCircle size={20} />
                  </div>
                )}
                <Wallet
                  size={32}
                  className="text-blue-600 dark:text-blue-400 mb-3"
                />
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Online Payment
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Card, UPI, NetBanking
                </p>
                <span className="text-[10px] mt-2 inline-block bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                  Coming Soon
                </span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPaymentMethod("COD")}
                className={`${styles.paymentCard} border rounded-xl p-4 cursor-pointer relative transition-all ${
                  selectedPaymentMethod === "COD"
                    ? "border-green-500 bg-green-50/50 dark:bg-green-900/10 dark:border-green-400"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
                }`}
              >
                {selectedPaymentMethod === "COD" && (
                  <div className="absolute top-4 right-4 text-green-600 dark:text-green-400">
                    <CheckCircle size={20} />
                  </div>
                )}
                <DollarSign
                  size={32}
                  className="text-green-600 dark:text-green-400 mb-3"
                />
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  Cash on Delivery
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pay when you receive
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`${styles.orderSummary} bg-white dark:bg-[#FFFFFF0D] border border-gray-100 dark:border-gray-800`}
        >
          <h2
            className={`${styles.summaryTitle} text-xl font-bold text-gray-900 dark:text-white mb-6`}
          >
            Order Summary
          </h2>

          <div className={styles.itemsPreview}>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
            </p>
            <div className="space-y-3 mb-4">
              {cart.items.slice(0, 3).map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-start text-sm"
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
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
                  +{cart.items.length - 3} more items
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Package size={16} /> Subtotal
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{cart.subtotal}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Tag size={16} /> GST (18%)
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                ₹{cart.tax}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Truck size={16} /> Shipping
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {cart.shippingCharges === 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    FREE
                  </span>
                ) : (
                  `₹${cart.shippingCharges}`
                )}
              </span>
            </div>

            <div className="border-t border-dashed border-gray-200 dark:border-gray-700 my-4" />

            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-blue-600 dark:text-blue-400">
                ₹{cart.totalAmount}
              </span>
            </div>
          </div>

          {/* ✅ NEW: Delivery Estimate Feature (Glassmorphism Style) */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-3">
              {pincodeStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden flex flex-col gap-1 p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-xl transition-all"
                >
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400">
                        Estimated Delivery
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setPincodeStatus(null);
                        setDeliveryMsg("");
                      }}
                      className="text-[10px] font-bold text-cyan-600 hover:text-cyan-500 uppercase tracking-wider"
                    >
                      CHANGE
                    </button>
                  </div>
                  <div className="mt-1 relative z-10">
                    <p className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                      {deliveryMsg}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Shipping to{" "}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {pincode}
                      </span>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="relative">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <MapPin size={12} /> Check Delivery Date
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="PINCODE"
                      className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none placeholder-gray-400 dark:placeholder-gray-600 transition-all"
                      value={pincode}
                      onChange={(e) =>
                        setPincode(e.target.value.replace(/\D/g, ""))
                      }
                      onKeyDown={(e) => e.key === "Enter" && checkDelivery()}
                    />
                    <button
                      onClick={() => checkDelivery()}
                      disabled={pincodeStatus === "loading"}
                      className="bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white px-4 rounded-xl text-sm font-bold hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-50 transition-colors"
                    >
                      {pincodeStatus === "loading" ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        "Check"
                      )}
                    </button>
                  </div>
                  {pincodeStatus === "error" && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">
                      {deliveryMsg}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: processing ? 1 : 1.02 }}
            whileTap={{ scale: processing ? 1 : 0.98 }}
            onClick={handlePaymentClick}
            disabled={
              processing || !selectedAddressId || addresses.length === 0
            }
            className={`${styles.paymentButton} w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {selectedPaymentMethod === "Razorpay" ? (
                  <>
                    <CreditCard size={20} /> Pay ₹{cart.totalAmount}
                  </>
                ) : (
                  <>
                    <DollarSign size={20} /> Place Order (COD)
                  </>
                )}
              </>
            )}
          </motion.button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CheckCircle
              size={14}
              className="text-green-600 dark:text-green-500"
            />
            <span>
              {selectedPaymentMethod === "Razorpay"
                ? "Secure payment by Razorpay"
                : "Safe Cash on Delivery"}
            </span>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddAddressModal && (
          <AddAddressModal
            onClose={() => setShowAddAddressModal(false)}
            onSuccess={handleAddressAdded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className={`${styles.container} bg-gray-50 dark:bg-black p-8`}>
      <div className={styles.header}>
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-3" />
        <div className="h-5 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
      </div>
      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-6 mb-6"
            style={{ height: "400px" }}
          >
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-6"
            style={{ height: "300px" }}
          >
            <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        </div>
        <div
          className="bg-white dark:bg-gray-900 rounded-xl p-6"
          style={{ height: "500px" }}
        >
          <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
