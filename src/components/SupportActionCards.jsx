// "use client";

// import { MessageCircle, MessageSquareText, ArrowRight } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";

// export default function SupportActionCards() {
//   const router = useRouter();
//   const pathname = usePathname();

//   const whatsappNumber = "918096936290";
//   const preFilledMessage =
//     "Hello Hyundai Spares Team, I would like to enquire about spare parts. Please assist me with the details.";

//   const handleWhatsAppClick = () => {
//     const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
//       preFilledMessage,
//     )}`;
//     window.open(url, "_blank");
//   };

//   if (
//     pathname === "/login" ||
//     pathname === "/register" ||
//     pathname === "/forgot-password" ||
//     pathname?.startsWith("/admin") ||
//     pathname === "/chat"
//   ) {
//     return null;
//   }

//   return (
//     // 🔥 FIX 1: Changed Section BG to 'bg-slate-50' (Light Gray) for contrast in Light Mode
//     <section className="w-full py-16 relative overflow-hidden transition-colors duration-300 bg-slate-50 dark:bg-[#0f111a]">
//       {/* BACKGROUND DECORATION */}
//       {/* Stronger Gradient for Light Mode visibility */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-purple-100/40 dark:from-blue-500/5 dark:via-transparent dark:to-purple-500/5 -z-10" />

//       {/* Decorative Blobs */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
//         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[80px]" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[80px]" />
//       </div>

//       <div className="max-w-6xl mx-auto px-4 relative z-10">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
//             Need Assistance?
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
//             We are here to help you find the perfect part
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* CARD 1: LIVE CHAT */}
//           <div
//             onClick={() => router.push("/chat")}
//             // 🔥 FIX 2: Stronger Background (bg-white/80) & Visible Border (border-gray-200) for Light Mode
//             className="group relative cursor-pointer overflow-hidden rounded-3xl
//               border border-gray-200 dark:border-white/10
//               bg-white/80 dark:bg-white/5
//               p-8 shadow-xl hover:shadow-2xl
//               backdrop-blur-xl transition-all duration-500
//               hover:-translate-y-2 dark:hover:bg-white/10"
//           >
//             {/* Hover Gradient Glow */}
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//             <div className="relative z-10 flex items-start gap-6">
//               {/* Icon Box */}
//               <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
//                 <MessageSquareText className="h-8 w-8" />
//               </div>

//               <div className="flex-1">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                   Live Chat Support
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">
//                   Connect instantly with our admin. Verify part compatibility,
//                   check stock, and track orders.
//                 </p>

//                 <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
//                   Start Conversation <ArrowRight className="w-4 h-4" />
//                 </div>
//               </div>
//             </div>

//             {/* Background Decor Icon */}
//             <MessageSquareText className="absolute -bottom-6 -right-6 h-40 w-40 text-blue-100 dark:text-blue-400/5 rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
//           </div>

//           {/* CARD 2: WHATSAPP */}
//           <div
//             onClick={handleWhatsAppClick}
//             // 🔥 FIX 3: Applied same fix here
//             className="group relative cursor-pointer overflow-hidden rounded-3xl
//               border border-gray-200 dark:border-white/10
//               bg-white/80 dark:bg-white/5
//               p-8 shadow-xl hover:shadow-2xl
//               backdrop-blur-xl transition-all duration-500
//               hover:-translate-y-2 dark:hover:bg-white/10"
//           >
//             {/* Hover Gradient Glow */}
//             <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//             <div className="relative z-10 flex items-start gap-6">
//               {/* Icon Box */}
//               <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-lg shadow-green-500/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
//                 <MessageCircle className="h-8 w-8" />
//               </div>

//               <div className="flex-1">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
//                   Chat on WhatsApp
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 font-medium">
//                   Send us photos of your part directly. Get instant price quotes
//                   and expert advice on WhatsApp.
//                 </p>

//                 <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-green-400 group-hover:gap-3 transition-all">
//                   Open WhatsApp <ArrowRight className="w-4 h-4" />
//                 </div>
//               </div>
//             </div>

//             {/* Background Decor Icon */}
//             <MessageCircle className="absolute -bottom-6 -right-6 h-40 w-40 text-green-100 dark:text-green-400/5 rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import {
  MessageCircle,
  MessageSquareText,
  ArrowRight,
  Headset,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function SupportActionCards() {
  const router = useRouter();
  const pathname = usePathname();

  const whatsappNumber = "918096936290";
  const preFilledMessage =
    "Hello Hyundai Spares Team, I would like to enquire about spare parts. Please assist me with the details.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      preFilledMessage,
    )}`;
    window.open(url, "_blank");
  };

  // Hide on specific routes
  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/admin") ||
    pathname === "/chat"
  ) {
    return null;
  }

  return (
    // ✨ Section Container: Rich Gradient Background
    <section className="relative w-full py-20 overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-500">
      {/* 🌌 Background Ambience (Glow Orbs) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-200/50 dark:border-blue-500/20 backdrop-blur-sm">
            <Headset size={14} /> 24/7 Support
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">
            We are here to help
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Can't find what you're looking for? Connect with our experts
            directly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* ================= CARD 1: LIVE CHAT (Blue Theme) ================= */}
          <div
            onClick={() => router.push("/chat")}
            className="group relative cursor-pointer rounded-[2rem] p-1"
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

            {/* Card Content */}
            <div className="relative h-full bg-white/80 dark:bg-[#121212]/90 backdrop-blur-2xl rounded-[1.9rem] p-8 border border-white/60 dark:border-white/10 shadow-xl shadow-blue-900/5 dark:shadow-none hover:translate-y-[-4px] transition-all duration-300 overflow-hidden">
              {/* Background Decor Icon */}
              <MessageSquareText className="absolute -bottom-10 -right-10 w-48 h-48 text-blue-500/5 dark:text-blue-500/10 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                {/* Icon Box */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MessageSquareText className="h-8 w-8" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    Live Chat Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                    Start a conversation with our support team to verify part
                    compatibility and check real-time stock availability.
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-cyan-400 group-hover:gap-3 transition-all">
                    Start Chatting <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CARD 2: WHATSAPP (Green Theme) ================= */}
          <div
            onClick={handleWhatsAppClick}
            className="group relative cursor-pointer rounded-[2rem] p-1"
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />

            {/* Card Content */}
            <div className="relative h-full bg-white/80 dark:bg-[#121212]/90 backdrop-blur-2xl rounded-[1.9rem] p-8 border border-white/60 dark:border-white/10 shadow-xl shadow-green-900/5 dark:shadow-none hover:translate-y-[-4px] transition-all duration-300 overflow-hidden">
              {/* Background Decor Icon */}
              <MessageCircle className="absolute -bottom-10 -right-10 w-48 h-48 text-green-500/5 dark:text-emerald-500/10 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                {/* Icon Box */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MessageCircle className="h-8 w-8" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-emerald-400 transition-colors">
                    Chat on WhatsApp
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                    Prefer mobile? Send us photos of your part directly on
                    WhatsApp for instant identification and pricing.
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-green-600 dark:text-emerald-400 group-hover:gap-3 transition-all">
                    Open WhatsApp <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
