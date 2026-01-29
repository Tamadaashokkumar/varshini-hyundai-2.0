// // src/app/orders/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//   Package,
//   Truck,
//   CheckCircle,
//   XCircle,
//   Download,
//   Eye,
//   Clock,
//   MapPin,
//   CreditCard,
//   AlertCircle,
// } from "lucide-react";
// import apiClient from "@/services/apiClient";
// import socketService from "@/services/socketService";
// import toast from "react-hot-toast";

// // Helper to fix image URLs
// const getImageUrl = (imagePath: string | undefined) => {
//   if (!imagePath) return null;
//   if (imagePath.startsWith("http")) return imagePath;
//   const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
//   return `${baseUrl}/${cleanPath}`;
// };

// // Updated Interfaces
// interface OrderItem {
//   product: {
//     _id: string;
//     name: string;
//     partNumber: string;
//     images?: Array<{ url: string; publicId: string }>;
//   };
//   name?: string;
//   image?: string;
//   quantity: number;
//   price: number;
//   subtotal: number;
// }

// interface Order {
//   _id: string;
//   orderNumber: string;
//   items: OrderItem[];
//   totalAmount: number;
//   orderStatus: "Placed" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
//   paymentStatus: "Pending" | "Completed" | "Failed";
//   paymentMethod: string;
//   shippingAddress: {
//     street: string;
//     city: string;
//     state: string;
//     pincode: string;
//   };
//   trackingNumber?: string;
//   createdAt: string;
// }

// export default function OrdersPage() {
//   const { user, isAuthenticated, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       router.push("/login");
//       return;
//     }

//     if (isAuthenticated) {
//       fetchOrders();
//       setupSocketListeners();
//     }

//     return () => {
//       // Cleanup if needed
//     };
//   }, [authLoading, isAuthenticated, router]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get("/orders");

//       if (response.data.success) {
//         const ordersData = Array.isArray(response.data.data)
//           ? response.data.data
//           : response.data.orders || [];

//         setOrders(ordersData);
//       }
//     } catch (error: any) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupSocketListeners = () => {
//     if (socketService.onOrderStatusUpdated) {
//       socketService.onOrderStatusUpdated((data: any) => {
//         console.log("Order status updated:", data);
//         toast.success(`Order ${data.orderNumber} status: ${data.orderStatus}`);
//         fetchOrders();
//       });
//     }
//   };

//   const handleDownloadInvoice = async (
//     orderId: string,
//     orderNumber: string,
//   ) => {
//     try {
//       const response = await apiClient.get(`/orders/${orderId}/invoice`, {
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `invoice-${orderNumber}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       toast.success("Invoice downloaded successfully");
//     } catch (error: any) {
//       toast.error("Failed to download invoice");
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       Placed:
//         "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30",
//       Packed:
//         "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30",
//       Shipped:
//         "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
//       Delivered:
//         "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30",
//       Cancelled:
//         "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
//     };
//     return (
//       colors[status] ||
//       "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400"
//     );
//   };

//   const getStatusIcon = (status: string) => {
//     const icons: Record<string, React.ReactNode> = {
//       Placed: <Clock size={14} className="mr-1" />,
//       Packed: <Package size={14} className="mr-1" />,
//       Shipped: <Truck size={14} className="mr-1" />,
//       Delivered: <CheckCircle size={14} className="mr-1" />,
//       Cancelled: <XCircle size={14} className="mr-1" />,
//     };
//     return icons[status] || <Package size={14} className="mr-1" />;
//   };

//   if (authLoading || loading) {
//     return <LoadingSkeleton />;
//   }

//   if (!isAuthenticated) {
//     return null;
//   }

//   return (
//     // 👇 UPDATED: Added light/dark classes for main container
//     <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] text-gray-900 dark:text-white p-4 md:p-8 pt-24 pt-[70px] md:pt-[80px] lg:pt-[90px] transition-colors duration-300">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hyundai-blue to-blue-400 mb-2">
//               Order History
//             </h1>
//             <p className="text-gray-500 dark:text-gray-400">
//               Track and manage your recent purchases
//             </p>
//           </motion.div>
//         </div>

//         {/* Content */}
//         <div>
//           {orders.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#FFFFFF0D] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none"
//             >
//               <div className="text-6xl mb-4">📦</div>
//               <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
//                 No orders yet
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
//                 It looks like you haven't placed any orders yet. Start shopping
//                 to see your history here.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => router.push("/")}
//                 className="px-6 py-3 bg-gradient-to-r from-hyundai-blue to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
//               >
//                 Start Shopping
//               </motion.button>
//             </motion.div>
//           ) : (
//             <div className="space-y-6">
//               {orders.map((order, index) => (
//                 <motion.div
//                   key={order._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-hyundai-blue/30 dark:hover:border-white/20 transition-all shadow-sm hover:shadow-md dark:shadow-none"
//                 >
//                   {/* Order Header */}
//                   <div className="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between gap-4">
//                     <div>
//                       <div className="flex items-center gap-3 mb-1">
//                         <h3 className="text-lg font-bold text-gray-900 dark:text-white">
//                           #{order.orderNumber}
//                         </h3>
//                         <span
//                           className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center ${getStatusColor(order.orderStatus)}`}
//                         >
//                           {getStatusIcon(order.orderStatus)}
//                           {order.orderStatus}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Placed on{" "}
//                         {new Date(order.createdAt).toLocaleString("en-IN", {
//                           day: "numeric",
//                           month: "long",
//                           year: "numeric",
//                         })}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium border ${
//                           order.paymentStatus === "Completed"
//                             ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
//                             : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
//                         }`}
//                       >
//                         Payment: {order.paymentStatus}
//                       </span>
//                       <div className="text-right">
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           Total Amount
//                         </p>
//                         <p className="text-xl font-bold text-gray-900 dark:text-white">
//                           ₹{order.totalAmount?.toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Body */}
//                   <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Items Column */}
//                     <div className="lg:col-span-2 space-y-4">
//                       {order.items?.slice(0, 2).map((item, idx) => {
//                         const imageUrl = getImageUrl(
//                           item.image || item.product?.images?.[0]?.url,
//                         );
//                         const itemName =
//                           item.name || item.product?.name || "Product";

//                         return (
//                           <div
//                             key={idx}
//                             className="flex gap-4 items-center bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-white/5"
//                           >
//                             <div className="relative w-16 h-16 bg-white dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-0">
//                               {imageUrl ? (
//                                 <Image
//                                   src={imageUrl}
//                                   alt={itemName}
//                                   fill
//                                   className="object-cover"
//                                   unoptimized={true}
//                                 />
//                               ) : (
//                                 <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
//                                   <AlertCircle size={20} />
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex-grow">
//                               <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
//                                 {itemName}
//                               </p>
//                               <div className="flex justify-between items-center mt-1">
//                                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                                   Qty: {item.quantity}
//                                 </p>
//                                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                                   ₹{item.price?.toLocaleString()}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                       {order.items?.length > 2 && (
//                         <p className="text-sm text-gray-500 dark:text-gray-500 pl-2">
//                           +{order.items.length - 2} more items
//                         </p>
//                       )}
//                     </div>

//                     {/* Details Column */}
//                     <div className="lg:col-span-1 space-y-4 text-sm">
//                       <div className="flex items-start gap-3">
//                         <CreditCard
//                           size={16}
//                           className="text-hyundai-blue mt-0.5"
//                         />
//                         <div>
//                           <p className="text-gray-500 dark:text-gray-400 text-xs">
//                             Payment Method
//                           </p>
//                           <p className="font-medium text-gray-900 dark:text-gray-200 uppercase">
//                             {order.paymentMethod}
//                           </p>
//                         </div>
//                       </div>

//                       {order.shippingAddress && (
//                         <div className="flex items-start gap-3">
//                           <MapPin
//                             size={16}
//                             className="text-hyundai-blue mt-0.5"
//                           />
//                           <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-xs">
//                               Delivery Address
//                             </p>
//                             <p className="font-medium text-gray-900 dark:text-gray-200 line-clamp-2">
//                               {order.shippingAddress.street},{" "}
//                               {order.shippingAddress.city}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {order.trackingNumber && (
//                         <div className="flex items-start gap-3">
//                           <Truck
//                             size={16}
//                             className="text-hyundai-blue mt-0.5"
//                           />
//                           <div>
//                             <p className="text-gray-500 dark:text-gray-400 text-xs">
//                               Tracking Number
//                             </p>
//                             <p className="font-mono text-gray-900 dark:text-gray-200">
//                               {order.trackingNumber}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Order Footer Actions */}
//                   <div className="px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3">
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => router.push(`/orders/${order._id}`)}
//                       className="px-4 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-white/20 text-gray-700 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
//                     >
//                       <Eye size={16} />
//                       View Details
//                     </motion.button>

//                     {order.paymentStatus === "Completed" && (
//                       <motion.button
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() =>
//                           handleDownloadInvoice(order._id, order.orderNumber)
//                         }
//                         className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-hyundai-blue/20 dark:hover:bg-hyundai-blue/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
//                       >
//                         <Download size={16} />
//                         Invoice
//                       </motion.button>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function LoadingSkeleton() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-[#050B14] p-4 md:p-8 pt-24">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-8">
//           <div className="h-8 w-48 bg-gray-200 dark:bg-white/5 rounded-lg mb-2 animate-pulse" />
//           <div className="h-4 w-64 bg-gray-200 dark:bg-white/5 rounded animate-pulse" />
//         </div>
//         <div className="space-y-6">
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="h-64 bg-white dark:bg-white/5 rounded-2xl animate-pulse border border-gray-200 dark:border-white/5"
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// src/app/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Download,
  Eye,
  Clock,
  MapPin,
  CreditCard,
  AlertCircle,
  RefreshCw,
  Calendar,
  ChevronRight,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import apiClient from "@/services/apiClient";
import socketService from "@/services/socketService";
import toast from "react-hot-toast";

// --- Helper Functions ---
const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";
  return `${baseUrl}/${cleanPath}`;
};

// --- Interfaces ---
interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    partNumber: string;
    images?: Array<{ url: string; publicId: string }>;
  };
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus:
    | "Placed"
    | "Confirmed"
    | "Packed"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  trackingNumber?: string;
  createdAt: string;
}

export default function OrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAuthenticated) {
      fetchOrders();
      setupSocketListeners();
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/orders");
      if (response.data.success) {
        const ordersData = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data?.docs || [];
        setOrders(ordersData);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    if (socketService.onOrderStatusUpdated) {
      socketService.onOrderStatusUpdated((data: any) => {
        toast.success(`Order #${data.orderNumber} is now ${data.orderStatus}`);
        fetchOrders();
      });
    }
  };

  const handleDownloadInvoice = async (
    orderId: string,
    orderNumber: string,
  ) => {
    try {
      toast.loading("Generating Invoice...");
      const response = await apiClient.get(`/orders/${orderId}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `INV-${orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.dismiss();
      toast.success("Invoice downloaded successfully");
    } catch (error: any) {
      toast.dismiss();
      toast.error("Failed to download invoice");
    }
  };

  const handleReorder = async (orderId: string) => {
    try {
      setProcessingId(orderId);
      const response = await apiClient.post(`/orders/${orderId}/reorder`);
      if (response.data.success) {
        toast.success("Items added to cart!");
        router.push("/cart");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reorder items");
    } finally {
      setProcessingId(null);
    }
  };

  // --- UI Helpers ---
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Placed":
        return {
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-900/20",
          icon: Clock,
          border: "border-amber-200 dark:border-amber-500/30",
        };
      case "Confirmed":
        return {
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/20",
          icon: CheckCircle2,
          border: "border-blue-200 dark:border-blue-500/30",
        };
      case "Packed":
        return {
          color: "text-purple-600 dark:text-purple-400",
          bg: "bg-purple-100 dark:bg-purple-900/20",
          icon: Package,
          border: "border-purple-200 dark:border-purple-500/30",
        };
      case "Shipped":
        return {
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-100 dark:bg-indigo-900/20",
          icon: Truck,
          border: "border-indigo-200 dark:border-indigo-500/30",
        };
      case "Delivered":
        return {
          color: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-100 dark:bg-emerald-900/20",
          icon: CheckCircle2,
          border: "border-emerald-200 dark:border-emerald-500/30",
        };
      case "Cancelled":
        return {
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-900/20",
          icon: XCircle,
          border: "border-red-200 dark:border-red-500/30",
        };
      default:
        return {
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-gray-800",
          icon: Package,
          border: "border-gray-200",
        };
    }
  };

  if (authLoading || loading) return <LoadingSkeleton />;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] text-gray-900 dark:text-white p-4 md:p-8 pt-24 md:pt-28 transition-colors duration-500 relative overflow-hidden">
      {/* 🌌 Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-3 shadow-sm">
              <Receipt size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">
                My Orders
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Order History
            </h1>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 backdrop-blur-sm">
            Total Orders:{" "}
            <span className="text-gray-900 dark:text-white font-bold">
              {orders.length}
            </span>
          </div>
        </motion.div>

        {/* Content */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 px-4 bg-white/60 dark:bg-[#121212]/50 border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-sm backdrop-blur-xl text-center"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-400 dark:text-gray-500">
              <ShoppingBag size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed">
              Looks like you haven't made any purchases yet. Start exploring our
              catalog to find genuine parts.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/products")}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
            >
              Start Shopping <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {orders.map((order, index) => {
                const status = getStatusConfig(order.orderStatus);
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="group bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-500/30 transition-all duration-300 relative"
                  >
                    {/* Top Stripe for Status */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${order.orderStatus === "Delivered" ? "from-emerald-500 to-green-400" : "from-blue-500 to-indigo-500"}`}
                    />

                    {/* HEADER SECTION */}
                    <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                        {/* Order ID & Status */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                              #{order.orderNumber}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${status.bg} ${status.color} ${status.border}`}
                            >
                              <StatusIcon size={12} strokeWidth={2.5} />{" "}
                              {order.orderStatus}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </div>

                        {/* Total Amount */}
                        <div className="flex flex-col md:items-end">
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                            Total Amount
                          </span>
                          <span className="text-2xl font-black text-gray-900 dark:text-white">
                            ₹{order.totalAmount?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ITEMS SECTION */}
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* Product List */}
                        <div className="flex-1 space-y-4">
                          {order.items?.slice(0, 3).map((item, idx) => {
                            const imageUrl = getImageUrl(
                              item.image || item.product?.images?.[0]?.url,
                            );
                            const itemName =
                              item.name || item.product?.name || "Product";

                            return (
                              <div
                                key={idx}
                                className="flex gap-4 items-center group/item"
                              >
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex-shrink-0">
                                  {imageUrl ? (
                                    <Image
                                      src={imageUrl}
                                      alt={itemName}
                                      fill
                                      className="object-cover"
                                      unoptimized={true}
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                      <AlertCircle size={20} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover/item:text-blue-600 transition-colors">
                                    {itemName}
                                  </h4>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">
                                      Qty: {item.quantity}
                                    </span>
                                    <span>
                                      ₹{item.price?.toLocaleString()} / unit
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {order.items?.length > 3 && (
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 pt-1">
                              +{order.items.length - 3} more items...
                            </p>
                          )}
                        </div>

                        {/* Order Meta Details (Address/Payment) */}
                        <div className="lg:w-1/3 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-6 lg:pt-0 lg:pl-8">
                          {/* Payment Info */}
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-600 dark:text-blue-400">
                              <CreditCard size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                                Payment
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                {order.paymentMethod}
                              </p>
                              <p
                                className={`text-[10px] font-bold mt-1 ${order.paymentStatus === "Completed" ? "text-green-600" : "text-amber-600"}`}
                              >
                                {order.paymentStatus}
                              </p>
                            </div>
                          </div>

                          {/* Tracking Info (If Exists) */}
                          {order.trackingNumber && (
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg text-purple-600 dark:text-purple-400">
                                <Truck size={18} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                                  Tracking ID
                                </p>
                                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS FOOTER */}
                    <div className="px-6 md:px-8 py-5 bg-gray-50 dark:bg-white/[0.03] border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-end gap-3">
                      {/* Download Invoice Button */}
                      {order.orderStatus === "Delivered" && (
                        <button
                          onClick={() =>
                            handleDownloadInvoice(order._id, order.orderNumber)
                          }
                          className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                          <Download size={16} /> Invoice
                        </button>
                      )}

                      {/* View Details Button */}
                      <button
                        onClick={() => router.push(`/orders/${order._id}`)}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        <Eye size={16} /> Details
                      </button>

                      {/* Buy Again Button (Primary) */}
                      <button
                        onClick={() => handleReorder(order._id)}
                        disabled={processingId === order._id}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-black hover:bg-black dark:hover:bg-gray-200 transition-all shadow-lg shadow-gray-200/50 dark:shadow-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingId === order._id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                        Buy Again
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton Loader
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#030712] p-4 md:p-8 pt-24">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-12 w-48 bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-72 bg-white dark:bg-white/5 rounded-[2rem] animate-pulse border border-gray-200 dark:border-white/5"
          />
        ))}
      </div>
    </div>
  );
}
