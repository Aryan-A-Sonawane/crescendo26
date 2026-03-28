"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CORE, SABHAS, Member, Sabha } from "@/lib/team";

export default function TeamPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredMember, setHoveredMember] = useState<Member | null>(null);

  return (
    <div className="min-h-screen bg-[#8B1538] font-sans selection:bg-[#E7A92E] selection:text-[#8B1538]">
      <Navbar />

      {/* 1. VIBRANT MERGED TOP SECTION */}
      <section className="relative pt-48 pb-24 px-6 md:px-24 bg-gradient-to-b from-[#8B1538] via-[#B85042] to-[#E7A92E] overflow-hidden">
        {/* Subtle radial glow to add "vibe" without being too dark */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(231,169,46,0.15)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10">
          <header className="mb-20">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-black uppercase tracking-[0.5em] text-white/90 block mb-4"
            >
              Crescendo '26 • The Indian Odyssey
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-nistha text-7xl md:text-9xl text-white leading-none drop-shadow-lg"
            >
              The Council
            </motion.h1>
          </header>

          <div className="flex flex-col items-center mb-16">
            <h3 className="font-taiganja text-3xl md:text-4xl uppercase tracking-widest text-[#8B1538] mb-4 bg-white/20 backdrop-blur-sm px-8 py-2 rounded-full">
              Core Durbar
            </h3>
          </div>
          
          {/* GRID: Core Members with Uniform Heights */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 items-stretch">
            {CORE.map((m, index) => (
              <motion.div 
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredMember(m)}
                onMouseLeave={() => setHoveredMember(null)}
                className="group flex"
              >
                {/* min-h-[220px] ensures all cards match the 'University Representative' height */}
                <div className="w-full min-h-[220px] bg-white/90 backdrop-blur-md border-2 border-transparent p-6 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 group-hover:bg-[#8B1538] group-hover:scale-105 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                  
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-5 border-2 border-[#E7A92E] shadow-md group-hover:border-white transition-all">
                    <span className="font-nistha text-3xl text-[#8B1538]">
                      {m.initial}
                    </span>
                  </div>

                  <p className="font-bold text-[#8B1538] group-hover:text-white text-sm leading-tight mb-auto transition-colors">
                    {m.name}
                  </p>
                  
                  {/* Pushes the role to the absolute bottom of the card for alignment */}
                  <div className="mt-4 pt-3 border-t border-[#8B1538]/10 w-full group-hover:border-white/20">
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#B85042] group-hover:text-[#E7A92E] transition-colors leading-tight">
                      {m.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MAIN SABHA AREA: Vibrant Sunset Theme */}
      <main className="relative px-6 md:px-24 py-32 flex flex-col lg:flex-row gap-16 bg-gradient-to-b from-[#E7A92E] to-[#8B1538]">
        
        {/* LEFT: Sabha List */}
        <div className="w-full lg:w-7/12">
          <div className="mb-12">
            <h4 className="font-taiganja text-4xl uppercase text-[#8B1538] tracking-tighter drop-shadow-sm">
              The Sabhas
            </h4>
            <div className="h-1 w-20 bg-white mt-2" />
          </div>

          <div className="space-y-4">
            {SABHAS.map((s) => (
              <div 
                key={s.id} 
                className={`transition-all duration-500 rounded-[2.5rem] border-2 
                ${openId === s.id ? 'border-white bg-white/20 shadow-2xl' : 'border-[#8B1538]/10 bg-white/10 hover:bg-white/30'}`}
              >
                <button 
                  onClick={() => setOpenId(openId === s.id ? null : s.id)}
                  className="w-full p-8 flex items-center justify-between outline-none group"
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${openId === s.id ? 'bg-white scale-[2.5] shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-[#8B1538]/40'}`} />
                    <h2 className={`font-taiganja text-3xl transition-colors ${openId === s.id ? 'text-white' : 'text-[#8B1538]/80'}`}>
                      {s.name}
                    </h2>
                  </div>
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                    ${openId === s.id ? 'rotate-180 bg-white border-white text-[#8B1538]' : 'border-[#8B1538]/20 text-[#8B1538]'}`}>
                    <span className="text-xl font-bold">↓</span>
                  </div>
                </button>

                <AnimatePresence>
                  {openId === s.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-10 space-y-2"
                    >
                      {s.members.map((m) => (
                        <div 
                          key={m.name}
                          onMouseEnter={() => setHoveredMember(m)}
                          onMouseLeave={() => setHoveredMember(null)}
                          className="p-5 rounded-2xl cursor-pointer hover:bg-white group/member transition-all flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-xl text-[#8B1538] transition-colors">
                              {m.name}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B1538]/60 group-hover/member:text-[#E7A92E]">
                              {m.role}
                            </p>
                          </div>
                          <span className="opacity-0 group-hover/member:opacity-100 transition-opacity text-[#8B1538] font-black">PROFILE</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: STICKY SPOTLIGHT */}
        <div className="hidden lg:block w-5/12 relative">
          <div className="sticky top-40 h-[650px] w-full max-w-[450px] ml-auto">
            <div className="w-full h-full bg-[#8B1538] rounded-[4rem] border-[12px] border-white shadow-2xl overflow-hidden relative flex flex-col">
              
              <AnimatePresence mode="wait">
                {hoveredMember ? (
                  <motion.div
                    key={hoveredMember.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center">
                       <span className="absolute text-[300px] font-nistha text-[#8B1538]/5 leading-none select-none">
                          {hoveredMember.initial}
                       </span>
                       <div className="absolute inset-0 bg-gradient-to-t from-[#8B1538] via-transparent to-transparent opacity-70 z-20" />
                    </div>

                    <div className="p-10 bg-[#8B1538] text-white">
                      <h4 className="font-nistha text-6xl mb-2">{hoveredMember.name}</h4>
                      <div className="h-1 w-20 bg-[#E7A92E] mb-4" />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E7A92E]">
                        {hoveredMember.role}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-16 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center mb-8 animate-pulse">
                       <div className="w-12 h-12 bg-[#E7A92E] rounded-full blur-xl opacity-50" />
                    </div>
                    <p className="font-taiganja text-2xl text-white uppercase tracking-widest">Select a Lead</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}