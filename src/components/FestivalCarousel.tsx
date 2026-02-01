// export default FestivalCarousel;

"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Wind,
  Gauge,
} from "lucide-react";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Helper to map icons based on ID (Optional visual touch)
const getIcon = (id: number) => {
  switch (id) {
    case 4:
      return <Wind className="w-5 h-5" />;
    case 5:
      return <Gauge className="w-5 h-5" />;
    case 6:
      return <Zap className="w-5 h-5" />;
    case 3:
      return <ShieldCheck className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

const offers = [
  {
    id: 1,
    title: "Republic Day Sale",
    subtitle: "Celebrate Freedom",
    discount: "FLAT 26% OFF",
    description: "On all Engine & Suspension parts. Valid till Jan 30th.",
    buttonText: "Shop Sale",
    link: "/products?category=sale",
    // Enhanced Gradients
    bgClass:
      "bg-gradient-to-br from-orange-100 via-orange-50 to-green-100 dark:from-orange-950 dark:via-[#1a1500] dark:to-green-950",
    textClass: "text-orange-700 dark:text-orange-400",
    buttonClass:
      "bg-gradient-to-r from-orange-600 to-amber-600 shadow-orange-500/30",
  },
  {
    id: 2,
    title: "Mega Festival Dhamaka",
    subtitle: "Upgrade Your Hyundai",
    discount: "UP TO 50% OFF",
    description: "Huge discounts on Headlights, Bumpers & Accessories.",
    buttonText: "Grab Deal",
    link: "/products",
    bgClass:
      "bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-blue-950 dark:via-[#0f0c29] dark:to-purple-950",
    textClass: "text-blue-700 dark:text-blue-400",
    buttonClass:
      "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/30",
  },
  {
    id: 3,
    title: "Monsoon Safety Drive",
    subtitle: "Wipers & Brakes Special",
    discount: "BUY 2 GET 10% OFF",
    description: "Ensure your family's safety with genuine brake pads.",
    buttonText: "Explore Parts",
    link: "/products?category=brakes",
    bgClass:
      "bg-gradient-to-br from-gray-200 via-gray-100 to-slate-200 dark:from-gray-900 dark:via-[#000000] dark:to-slate-900",
    textClass: "text-gray-800 dark:text-gray-300",
    buttonClass:
      "bg-gradient-to-r from-gray-800 to-black dark:from-gray-200 dark:to-white dark:text-black shadow-gray-500/30",
  },
  {
    id: 4,
    title: "Beat the Heat",
    subtitle: "AC & Cooling Systems",
    discount: "FLAT 15% OFF",
    description: "Keep your car cool with genuine AC filters and compressors.",
    buttonText: "Cool Deals",
    link: "/products?category=ac-parts",
    bgClass:
      "bg-gradient-to-br from-cyan-100 via-sky-50 to-blue-100 dark:from-cyan-950 dark:via-[#001a2c] dark:to-blue-950",
    textClass: "text-cyan-700 dark:text-cyan-400",
    buttonClass:
      "bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/30",
  },
  {
    id: 5,
    title: "High Performance",
    subtitle: "Engine & Transmission",
    discount: "SAVE ₹2000",
    description: "Boost your pickup with premium spark plugs and clutch kits.",
    buttonText: "Power Up",
    link: "/products?category=engine",
    bgClass:
      "bg-gradient-to-br from-red-100 via-rose-50 to-pink-100 dark:from-red-950 dark:via-[#2c0000] dark:to-pink-950",
    textClass: "text-red-700 dark:text-red-400",
    buttonClass: "bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30",
  },
  {
    id: 6,
    title: "Night Vision Sale",
    subtitle: "Lights & Electricals",
    discount: "UP TO 40% OFF",
    description: "Brighten your path with LED Headlamps and Fog lights.",
    buttonText: "Shine On",
    link: "/products?category=electrical",
    bgClass:
      "bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 dark:from-yellow-950 dark:via-[#2c1a00] dark:to-orange-950",
    textClass: "text-amber-700 dark:text-yellow-400",
    buttonClass:
      "bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/30",
  },
  {
    id: 7,
    title: "Smooth Ride Week",
    subtitle: "Suspension Overhaul",
    discount: "FLAT 20% OFF",
    description: "Get shock absorbers and link rods at unbeatable prices.",
    buttonText: "Fix Ride",
    link: "/products?category=suspension",
    bgClass:
      "bg-gradient-to-br from-teal-100 via-emerald-50 to-green-100 dark:from-teal-950 dark:via-[#002c1a] dark:to-green-950",
    textClass: "text-teal-700 dark:text-teal-400",
    buttonClass:
      "bg-gradient-to-r from-teal-600 to-emerald-600 shadow-teal-500/30",
  },
  {
    id: 8,
    title: "Interior Luxury",
    subtitle: "Mats & Covers",
    discount: "COMBO OFFERS",
    description: "Upgrade your cabin with 7D mats and premium seat covers.",
    buttonText: "Upgrade Now",
    link: "/products?category=accessories",
    bgClass:
      "bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 dark:from-violet-950 dark:via-[#1a002c] dark:to-fuchsia-950",
    textClass: "text-violet-700 dark:text-violet-400",
    buttonClass:
      "bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/30",
  },
  {
    id: 9,
    title: "Body Shop Bonanza",
    subtitle: "Exterior Parts",
    discount: "UP TO 35% OFF",
    description: "Genuine bumpers, mirrors, and door handles available now.",
    buttonText: "Check Parts",
    link: "/products?category=body",
    bgClass:
      "bg-gradient-to-br from-indigo-100 via-blue-50 to-slate-100 dark:from-indigo-950 dark:via-[#000a2c] dark:to-slate-950",
    textClass: "text-indigo-700 dark:text-indigo-400",
    buttonClass:
      "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-indigo-500/30",
  },
  {
    id: 10,
    title: "Stock Clearance",
    subtitle: "Everything Must Go",
    discount: "MIN 60% OFF",
    description: "Clearance sale on older model parts. Limited stock only!",
    buttonText: "Rush Now",
    link: "/products?category=clearance",
    bgClass:
      "bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 dark:from-red-900 dark:via-orange-900 dark:to-yellow-900",
    textClass: "text-red-800 dark:text-red-300",
    buttonClass:
      "bg-gradient-to-r from-red-700 to-orange-700 shadow-red-500/30",
  },
];

const HeroCarousel = () => {
  return (
    <div className="w-full mt-6 mb-12 px-2 md:px-0">
      <div className="max-w-7xl mx-auto md:px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            // Styling handled via global css below
          }}
          navigation={true}
          className="rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/50 border border-white/50 dark:border-white/10 hero-swiper"
        >
          {offers.map((offer) => (
            <SwiperSlide key={offer.id}>
              {/* Slide Container */}
              <div
                className={`relative h-[400px] md:h-[500px] w-full ${offer.bgClass} flex items-center justify-center transition-colors duration-500`}
              >
                {/* 🎨 Texture Overlay (Noise) - Adds premium feel */}
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
                  }}
                ></div>

                {/* 🌟 Ambient Glow Orbs (Background Decoration) */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 dark:bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 dark:bg-black/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

                {/* 🧊 Glass Card Content */}
                <div className="relative z-10 container mx-auto px-4 md:px-16 flex items-center h-full">
                  <div className="max-w-2xl w-full p-6 md:p-10 rounded-3xl bg-white/30 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50 dark:bg-white/10 text-gray-900 dark:text-white backdrop-blur-md shadow-sm">
                        {getIcon(offer.id)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest bg-white/50 dark:bg-white/10 text-gray-900 dark:text-white border border-white/20">
                        Limited Offer
                      </span>
                    </div>

                    {/* Headlines */}
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-2 drop-shadow-sm">
                      {offer.title}
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 md:mb-6">
                      <span
                        className={`text-lg md:text-2xl font-bold ${offer.textClass}`}
                      >
                        {offer.subtitle}
                      </span>
                      <span className="hidden sm:block text-gray-400 dark:text-white/20">
                        |
                      </span>
                      <span className="text-lg md:text-2xl font-black text-red-600 dark:text-yellow-400 bg-white/40 dark:bg-black/20 px-2 rounded-md">
                        {offer.discount}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 text-sm md:text-lg font-medium leading-relaxed mb-8 max-w-lg">
                      {offer.description}
                    </p>

                    {/* Action Button */}
                    <Link href={offer.link}>
                      <button
                        className={`${offer.buttonClass} text-white px-8 py-3.5 rounded-xl text-sm md:text-base font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95 flex items-center gap-3 group`}
                      >
                        {offer.buttonText}
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Styles for Modern Pagination & Navigation */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 25px !important;
          text-align: right;
          padding-right: 40px;
        }
        /* Mobile adjustment */
        @media (max-width: 768px) {
          .hero-swiper .swiper-pagination {
            text-align: center;
            padding-right: 0;
          }
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(0, 0, 0, 0.4);
          opacity: 0.5;
          transition: all 0.4s ease;
          border-radius: 99px;
        }
        .dark .hero-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 32px;
          background: #2563eb; /* Blue-600 */
          opacity: 1;
        }
        .dark .hero-swiper .swiper-pagination-bullet-active {
          background: #ffffff;
        }

        /* Navigation Arrows (Glass Style) */
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: #111;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s;
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.1);
        }

        /* Dark mode arrows */
        .dark .hero-swiper .swiper-button-next,
        .dark .hero-swiper .swiper-button-prev {
          color: #fff;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .dark .hero-swiper .swiper-button-next:hover,
        .dark .hero-swiper .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.7);
        }

        /* Hide arrows on mobile */
        @media (max-width: 768px) {
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
