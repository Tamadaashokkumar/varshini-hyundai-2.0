"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car,
  Search,
  ArrowRight,
  X,
  CheckCircle2,
  Calendar,
  Settings2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroGarageWidget() {
  const router = useRouter();
  const [garage, setGarage] = useState<{ model: string; year: string } | null>(
    null,
  );
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Load Garage on Mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("myGarage");
    if (saved) setGarage(JSON.parse(saved));
  }, []);

  const handleSetGarage = () => {
    if (!model || !year) return;
    const newGarage = { model, year };
    localStorage.setItem("myGarage", JSON.stringify(newGarage));
    setGarage(newGarage);
    router.push("/products");
  };

  const handleClear = () => {
    localStorage.removeItem("myGarage");
    setGarage(null);
    setModel("");
    setYear("");
  };

  if (!isMounted) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#020617] text-white rounded-[2.5rem] shadow-2xl mb-12 border border-white/5">
      {/* 🌌 Background Ambience (Glows & Gradients) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Abstract Gradient Mesh */}
        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] opacity-50"></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* --- LEFT SIDE: HERO TEXT --- */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              <Settings2 size={14} className="animate-spin-slow" />
              <span>Compatibility Guaranteed</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Parts that actually <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                Fit Your Machine
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
          >
            Don't guess. Select your Hyundai model and year to instantly filter
            thousands of genuine spare parts designed for your vehicle.
          </motion.p>
        </div>

        {/* --- RIGHT SIDE: WIDGET CARD --- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Glass Card Container */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-1 shadow-2xl relative overflow-hidden group">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="bg-[#0f172a]/80 rounded-[1.8rem] p-6 md:p-8 relative z-10 h-full">
              <AnimatePresence mode="wait">
                {garage ? (
                  // --- STATE A: GARAGE SET (Display Vehicle) ---
                  <motion.div
                    key="garage-set"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 bg-gradient-to-tr from-green-500/20 to-emerald-500/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <Car
                        size={40}
                        className="text-green-400 drop-shadow-md"
                      />
                    </div>

                    <div className="mb-8">
                      <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mb-2">
                        My Garage
                      </p>
                      <h2 className="text-3xl font-black text-white tracking-tight">
                        {garage.model}
                      </h2>
                      <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-sm font-semibold text-slate-200">
                          {garage.year} Model
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <button
                        onClick={() => router.push("/products")}
                        className="col-span-3 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 group/btn"
                      >
                        Find Parts
                        <ArrowRight
                          size={18}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                      <button
                        onClick={handleClear}
                        className="col-span-1 flex items-center justify-center bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-2xl transition-all"
                        title="Change Car"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // --- STATE B: NO GARAGE (Form) ---
                  <motion.div
                    key="garage-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
                        <Search size={22} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Select Your Car
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          To check compatibility
                        </p>
                      </div>
                    </div>

                    {/* Inputs Group */}
                    <div className="space-y-4">
                      <div className="space-y-1.5 group/input">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-cyan-400 transition-colors">
                          Model Name
                        </label>
                        <div className="relative">
                          <Car
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-white transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="e.g. Creta, i20, Verna"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 group/input">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 group-focus-within/input:text-cyan-400 transition-colors">
                          Year
                        </label>
                        <div className="relative">
                          <Calendar
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-white transition-colors"
                          />
                          <input
                            type="number"
                            placeholder="e.g. 2024"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSetGarage}
                      disabled={!model || !year}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 group/btn mt-2"
                    >
                      <span>Show My Parts</span>
                      <ArrowRight
                        size={18}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
