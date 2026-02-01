// export default ReviewsCarousel;

"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const reviews = [
  {
    id: 1,
    name: "Ravi Teja",
    car: "Hyundai Creta",
    rating: 5,
    comment:
      "Original parts received! I was worried about quality, but the bumper fits perfectly. Fast delivery to Hyderabad.",
    initial: "R",
  },
  {
    id: 2,
    name: "Suresh Reddy",
    car: "Hyundai Verna",
    rating: 5,
    comment:
      "Best price compared to local market. The headlight assembly was packed very securely. Highly recommended!",
    initial: "S",
  },
  {
    id: 3,
    name: "Anil Kumar",
    car: "Hyundai i20",
    rating: 4,
    comment:
      "Good service. The part is genuine, but delivery took one extra day. Overall satisfied with the purchase.",
    initial: "A",
  },
  {
    id: 4,
    name: "Karthik Varma",
    car: "Hyundai Venue",
    rating: 5,
    comment:
      "Found rare parts for my Venue here. Customer support helped me choose the right model. Thank you Varshini Spares!",
    initial: "K",
  },
  {
    id: 5,
    name: "Manoj P",
    car: "Hyundai Tucson",
    rating: 5,
    comment:
      "Premium quality and genuine finish. Will definitely order brake pads from here next time.",
    initial: "M",
  },
];

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-yellow-400 mb-3 drop-shadow-sm">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${
            i < rating ? "fill-current" : "text-gray-300 dark:text-gray-600"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewsCarousel = () => {
  return (
    <div className="w-full py-20 relative overflow-hidden transition-colors duration-300">
      {/* --- BACKGROUND DECORATION (For Glass Effect) --- */}
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/20 to-white dark:from-[#0f111a] dark:via-[#161925] dark:to-[#0f111a] -z-20" />

      {/* Decorative Blobs (Blur Circles) */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg font-medium">
            Trusted by thousands of Hyundai owners across India for genuine
            spares and reliable service.
          </p>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16 px-2"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              {/* --- GLASSMORPHISM CARD --- */}
              <div
                className="h-full flex flex-col p-8 rounded-3xl transition-all duration-300 
                bg-white/60 dark:bg-white/5 
                backdrop-blur-xl 
                border border-white/50 dark:border-white/10 
                shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {/* User Info Header */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Avatar Circle with Gradient Border */}
                  <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-blue-500 to-purple-500">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1a1d29] flex items-center justify-center text-gray-900 dark:text-white font-bold text-xl">
                      {review.initial}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {review.name}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Owner of {review.car}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <StarRating rating={review.rating} />

                {/* Comment */}
                <div className="flex-grow">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                    "{review.comment}"
                  </p>
                </div>

                {/* Verified Badge */}
                <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-white/10 flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                  <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Verified Purchase
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewsCarousel;
