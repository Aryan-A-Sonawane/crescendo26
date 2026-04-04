"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CORE, SABHAS, Member, Sabha } from "@/lib/team";

export default function TeamPage() {
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const memberRefsDesktop = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Scroll-based member highlighting with RAF for smooth 60fps tracking
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestMember: Member | null = null;
      let closestDistance = Infinity;

      // Check all member elements - ONLY from SABHAS (not CORE)
      Object.entries(memberRefsDesktop.current).forEach(([memberName, ref]) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(elementCenter - viewportCenter);

          // Find member closest to viewport center (from SABHAS only)
          if (distance < closestDistance) {
            closestDistance = distance;
            // Only search in SABHAS members, not CORE
            const allSabhasMembers = SABHAS.flatMap((s) => s.members);
            const member = allSabhasMembers.find((m) => m.name === memberName);
            if (member) {
              closestMember = member;
            }
          }
        }
      });

      if (closestMember) {
        setActiveMember(closestMember);
      }
    };

    // Use RequestAnimationFrame for smooth 60fps updates
    const onScroll = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll(); // Call once on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#8B1538] font-sans selection:bg-[#E7A92E] selection:text-[#8B1538]">
      <Navbar />

      {/* 1. VIBRANT MERGED TOP SECTION */}
      <section className="relative pt-48 pb-4 px-6 md:px-24 bg-gradient-to-b from-[#8B1538] via-[#B85042] to-[#E7A92E] overflow-hidden">
        {/* Subtle radial glow to add "vibe" without being too dark */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(231,169,46,0.15)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-[1440px] mx-auto">
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
          
          {/* GRID: Core Members - Spotlight Style */}
          <div className="hidden lg:flex justify-center">
            <div className="grid grid-cols-3 xl:grid-cols-4  gap-4 auto-rows-[400px]">
              {CORE.map((m, index) => (
                <motion.div 
                  key={m.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col transition-all duration-300 h-full"
                >
                  {/* Card matching spotlight style */}
                  <div className="w-full h-full bg-[#8B1538] rounded-[2rem] border-[8px] border-white shadow-xl overflow-hidden relative flex flex-col transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  
                  {/* Photo - Prominent area */}
                  <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center">
                    {m.photo ? (
                      <Image 
                        src={m.photo} 
                        alt={m.name}
                        fill
                        priority={index < 3}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 14vw"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="absolute text-[150px] font-nistha text-[#8B1538]/10 leading-none select-none">
                        {m.initial}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8B1538] via-transparent to-transparent opacity-60 z-10" />
                  </div>

                  {/* Name and Role - Bottom Section */}
                  <div className="p-4 bg-[#8B1538] text-white">
                    <h5 className="font-nistha text-2xl mb-1 leading-tight">
                      {m.name}
                    </h5>
                    <div className="h-1 w-12 bg-[#E7A92E] mb-2" />
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E7A92E]">
                      {m.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>

          {/* Mobile: Core Members - Same style as Sabhas */}
          <div className="lg:hidden mb-16">
            <div className="mb-8">
              <h3 className="font-taiganja text-3xl uppercase text-[#8B1538] mb-2">
                Core Durbar
              </h3>
              <div className="h-1 w-16 bg-white" />
            </div>

            {/* 2-Column Grid for Core Members */}
            <div className="grid grid-cols-2 gap-4 auto-rows-[250px] md:auto-rows-[320px]">
              {CORE.map((m) => (
                <motion.div 
                  key={m.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group flex flex-col transition-all duration-300 h-full"
                >
                  {/* Card matching desktop spotlight style */}
                  <div className="w-full h-full bg-[#8B1538] rounded-[1.2rem] border-4 border-white shadow-lg overflow-hidden relative flex flex-col transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                  
                    {/* Photo - Prominent area */}
                    <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center">
                      {m.photo ? (
                        <Image 
                          src={m.photo} 
                          alt={m.name}
                          fill
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="absolute text-[80px] font-nistha text-[#8B1538]/10 leading-none select-none">
                          {m.initial}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#8B1538] via-transparent to-transparent opacity-60 z-10" />
                    </div>

                    {/* Name and Role - Bottom Section */}
                    <div className="p-3 bg-[#8B1538] text-white">
                      <h5 className="font-nistha text-lg mb-0.5 leading-tight">
                        {m.name}
                      </h5>
                      <div className="h-0.5 w-8 bg-[#E7A92E] mb-1.5" />
                      <p className="text-[6px] font-black uppercase tracking-[0.15em] text-[#E7A92E]">
                        {m.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN SABHA AREA: Vibrant Sunset Theme */}
      <main className="relative px-6 md:px-24 py-6 flex flex-col lg:flex-row gap-16 bg-gradient-to-b from-[#E7A92E] to-[#E7A92E]">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-16">
        
        {/* LEFT: Sabha List - Desktop Accordion */}
        <div className="hidden lg:block w-full lg:w-7/12">
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
                className={`transition-all duration-500 rounded-[2.5rem] border-2 border-[#8B1538]/10 bg-white/10`}
              >
                <div className="w-full p-8">
                  <div className="flex items-center gap-8 mb-6">
                    <div className="w-3 h-3 rounded-full bg-[#8B1538]/40" />
                    <h2 className="font-taiganja text-3xl text-[#8B1538]/80">
                      {s.name}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {s.members.map((m) => (
                      <div 
                        key={m.name}
                        data-member-name={m.name}
                        ref={(el) => {
                          if (el) memberRefsDesktop.current[m.name] = el;
                        }}
                        className={`p-5 rounded-2xl transition-all flex justify-between items-center ${
                          activeMember?.name === m.name
                            ? "bg-white shadow-lg"
                            : "bg-transparent"
                        }`}
                      >
                        <div>
                          <p className={`font-bold text-xl transition-colors ${
                            activeMember?.name === m.name
                              ? "text-[#8B1538]"
                              : "text-[#8B1538]"
                          }`}>
                            {m.name}
                          </p>
                          <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                            activeMember?.name === m.name
                              ? "text-[#8B1538]"
                              : "text-[#8B1538]/60"
                          }`}>
                            {m.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Extra scroll space to allow last member to reach viewport center */}
          <div style={{ height: "calc(100vh - 200px)" }} />
        </div>

        {/* Mobile: Grid Layout for All Sabhas */}
        <div className="lg:hidden w-full">
          
          {/* Sabhas Title */}
          <div className="mb-12">
            <h4 className="font-taiganja text-4xl uppercase text-[#8B1538] tracking-tighter drop-shadow-sm">
              The Sabhas
            </h4>
            <div className="h-1 w-20 bg-white mt-2" />
          </div>
          {SABHAS.map((s) => (
            <div key={s.id} className="mb-16">
              <div className="mb-8">
                <h3 className="font-taiganja text-3xl uppercase text-[#8B1538] mb-2">
                  {s.name}
                </h3>
                <div className="h-1 w-16 bg-white" />
              </div>

              {/* 2-Column Grid for Members */}
              <div className="grid grid-cols-2 gap-4 auto-rows-[250px] md:auto-rows-[320px]">
                {s.members.map((m) => (
                  <motion.div 
                    key={m.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group flex flex-col transition-all duration-300 h-full"
                  >
                    {/* Card matching desktop spotlight style */}
                    <div className="w-full h-full bg-[#8B1538] rounded-[1.2rem] border-4 border-white shadow-lg overflow-hidden relative flex flex-col transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                      
                      {/* Photo - Prominent area */}
                      <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center">
                        {m.photo ? (
                          <Image 
                            src={m.photo} 
                            alt={m.name}
                            fill
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <span className="absolute text-[80px] font-nistha text-[#8B1538]/10 leading-none select-none">
                            {m.initial}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#8B1538] via-transparent to-transparent opacity-60 z-10" />
                      </div>

                      {/* Name and Role - Bottom Section */}
                      <div className="p-3 bg-[#8B1538] text-white">
                        <h5 className="font-nistha text-lg mb-0.5 leading-tight">
                          {m.name}
                        </h5>
                        <div className="h-0.5 w-8 bg-[#E7A92E] mb-1.5" />
                        <p className="text-[6px] font-black uppercase tracking-[0.15em] text-[#E7A92E]">
                          {m.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: STICKY SPOTLIGHT (Desktop Only) */}
        <div className="hidden lg:block w-5/12 relative">
          <div className="sticky top-32 w-full max-w-[450px] ml-auto" style={{ height: "calc(100vh - 160px)" }}>
            <div className="w-full h-full bg-[#8B1538] rounded-[4rem] border-[12px] border-white shadow-2xl overflow-hidden relative flex flex-col">
              
              <AnimatePresence mode="wait">
                {activeMember ? (
                  <motion.div
                    key={activeMember.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex-1 bg-white relative overflow-hidden flex items-center justify-center">
                      {activeMember.photo ? (
                        <Image 
                          src={activeMember.photo} 
                          alt={activeMember.name}
                          fill
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="absolute text-[300px] font-nistha text-[#8B1538]/5 leading-none select-none">
                          {activeMember.initial}
                        </span>
                      )}
                       <div className="absolute inset-0 bg-gradient-to-t from-[#8B1538] via-transparent to-transparent opacity-70 z-20" />
                    </div>

                    <div className="p-10 bg-[#8B1538] text-white">
                      <h4 className="font-nistha text-3xl mb-2">{activeMember.name}</h4>
                      <div className="h-1 w-20 bg-[#E7A92E] mb-4" />
                      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E7A92E]">
                        {activeMember.role}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-16 text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center mb-8 animate-pulse">
                       <div className="w-12 h-12 bg-[#E7A92E] rounded-full blur-xl opacity-50" />
                    </div>
                    <p className="font-taiganja text-2xl text-white uppercase tracking-widest">Scroll to View</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}