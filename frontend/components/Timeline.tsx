"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useCallback, useState } from "react";
import Image from "next/image";

import { MapPin, Clock } from "lucide-react";

type EventData = {
  name: string;
  time?: string;
  location?: string;
  icon?: string;
  iconPosition?: "top" | "bottom";
};
type DayData = { title: string; events: EventData[] };
type PhaseData = { phase: string; days: DayData[] };

const scheduleData: PhaseData[] = [
  {
    phase: "Timeline",
    days: [
      {
        title: "Day 1 (6 April)",
        events: [
          {
            name: "Natki",
            time: "11:00 AM onwards",
            icon: "/nataki.webp",
            iconPosition: "top",
          },
          { name: "Bike & Car Show" },
        ],
      },
      {
        title: "Day 2 (7 April)",
        events: [
          { name: "Met Gala (Ms. & Mr. Crescendo)", time: "1:00 PM onwards" },
          { name: "DJ Night", location: "Ground", icon: "/djnight.webp" },
          { name: "Flea Market" },
        ],
      },
      {
        title: "Day 3 (8 April)",
        events: [
          { name: "Footloose", location: "Audi", icon: "/footloose.webp" },
          {
            name: "Screen Display",
            time: "Morning & 4:00 PM",
            location: "Ground",
          },
          { name: "Flea Market" },
        ],
      },
      {
        title: "Day 4 (9 April)",
        events: [
          { name: "Vrock", location: "Open Ground Stage", icon: "/vrock.webp" },
          { name: "Screen Display", time: "2:00 PM to 8:30 PM" },
          { name: "Flea Market" },
        ],
      },
    ],
  },
  {
    phase: "Vishwotsav",
    days: [
      {
        title: "Day 1 (10 April)",
        events: [
          {
            name: "Cosplay + Movie Night",
            location: "Ground Stage",
            icon: "/movienight.webp",
          },
        ],
      },
      {
        title: "Day 2 (11 April)",
        events: [
          {
            name: "Fake Wedding",
            icon: "/fakewedding.webp",
            iconPosition: "top",
          },
        ],
      },
      {
        title: "Day 3 (12 April)",
        events: [
          { name: "Western Day", location: "Ground Stage" },
          {
            name: "Band Performance",
            location: "Main Ground",
            icon: "/bandperformance.webp",
          },
        ],
      },
    ],
  },
];

// ─── Horizontal Phase Section (Mobile / Tablet) ───────────────────────────────
function HorizontalPhaseSection({ phase }: { phase: PhaseData }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? el.scrollLeft / max : 0;
    if (!hasScrolled && pct > 0.03) setHasScrolled(true);
  }, [hasScrolled]);

  const totalDays = phase.days.length;
  // Proper date ranges for the truck as done in hero page
  const dateRange = phase.phase === "Timeline" ? "6-9 April" : "10-12 April";

  return (
    <div className="mb-12">
      {/* Ornamental phase header box without mandala crown */}
      <div className="relative flex items-center justify-center gap-3 mb-6">
        <div className="flex-1 flex items-center gap-1 min-w-0">
          <div className="w-2 h-2 rotate-45 bg-[#f3ba35] shrink-0 shadow-[0_0_6px_#f3ba35]" />
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-[#f3ba35] to-[#f3ba35]/10" />
        </div>

        <div className="shrink-0 relative">
          <div className="relative z-10 shrink-0 px-6 py-2.5 border border-[#f3ba35]/60 rounded-xl bg-[#3a0c1a] shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-nistha text-transparent bg-clip-text bg-gradient-to-br from-[#f3ba35] via-[#ffe08a] to-[#d4922c] tracking-wider">
              {phase.phase}
            </h2>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-1 min-w-0">
          <div className="flex-1 h-[1.5px] bg-gradient-to-l from-[#f3ba35] to-[#f3ba35]/10" />
          <div className="w-2 h-2 rotate-45 bg-[#f3ba35] shrink-0 shadow-[0_0_6px_#f3ba35]" />
        </div>
      </div>

      {/* Cards + swipe hint wrapper */}
      <div className="relative">
        {/* Scrollable cards - stable vertical alignment */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide overscroll-x-contain overflow-y-hidden"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex gap-4 w-max pr-4">
            {phase.days.map((day, dayIdx) => {
              const heroEvent = day.events.find((e) => e.icon);
              return (
                <motion.div
                  key={dayIdx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: dayIdx * 0.1 }}
                  className="w-40 sm:w-48 flex-shrink-0 bg-[#8B1538] rounded-xl border-2 border-[#f3ba35]/60 flex flex-col overflow-hidden shadow-2xl"
                  style={{
                    boxShadow:
                      "0 8px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(243,186,53,0.2)",
                  }}
                >
                  {/* Card top: image zone */}
                  <div className="relative h-40 sm:h-48 bg-[#6B0F28] overflow-hidden flex items-center justify-center">
                    {/* Subtle dark full-bg mandala */}
                    <img
                      src="/mandala.webp"
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-[0.07] brightness-[0.3] scale-110"
                      style={{ animation: "mandala-spin 70s linear infinite" }}
                    />
                    {/* Vivid golden mandala behind the event image */}
                    <img
                      src="/mandala.webp"
                      alt=""
                      className="absolute inset-0 w-4/5 h-4/5 m-auto object-contain opacity-[0.30] sepia brightness-[1.4] saturate-[4] z-[1]"
                      style={{
                        animation: "mandala-spin 45s linear infinite reverse",
                      }}
                    />
                    {heroEvent?.icon ? (
                      <img
                        src={heroEvent.icon}
                        alt={heroEvent.name}
                        className={`relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] ${
                          heroEvent.iconPosition === "top"
                            ? "h-full w-auto object-contain object-top pt-2"
                            : "h-[90%] w-auto object-contain object-bottom"
                        }`}
                      />
                    ) : (
                      <img
                        src="/mandala.webp"
                        alt=""
                        className="relative z-10 w-24 h-24 object-contain opacity-25"
                      />
                    )}
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 border-t-2 border-l-2 border-[#f3ba35]/70 rounded-tl-md" />
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 border-t-2 border-r-2 border-[#f3ba35]/70 rounded-tr-md" />
                  </div>
                  {/* Card bottom: events */}
                  <div className="p-3 flex-1 flex flex-col relative">
                    <div className="mb-2 pb-1.5 border-b border-[#f3ba35]/30">
                      <p className="text-[#f3ba35] text-xs font-bold tracking-widest text-decorative leading-tight">
                        {day.title.split(" (")[0]}
                      </p>
                      {day.title.includes("(") && (
                        <p className="text-[#f3ba35]/70 text-[10px]">
                          {"(" + day.title.split(" (")[1]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {day.events.map((event, eIdx) => (
                        <div key={eIdx} className="flex items-start gap-1">
                          <span className="text-[#f3ba35] text-[10px] mt-0.5 shrink-0">
                            ✦
                          </span>
                          <div className="min-w-0">
                            <p className="text-white text-[11px] font-semibold leading-tight text-decorative">
                              {event.name}
                            </p>
                            {event.time && (
                              <p className="text-[#f3ba35]/70 text-[9px] mt-0.5">
                                {event.time}
                              </p>
                            )}
                            {event.location && (
                              <p className="text-[#f3ba35]/60 text-[9px]">
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Swipe hint: cascading chevron arrows (fades after first scroll) ── */}
        <motion.div
          className="absolute top-0 right-0 bottom-2 w-16 pointer-events-none flex items-center justify-end pr-2"
          animate={{ opacity: hasScrolled ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Gradient veil */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/15 to-transparent" />
          {/* Cascading chevron arrows */}
          <div className="relative z-10 flex items-center gap-0">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 border-r-[2.5px] border-t-[2.5px] border-[#f3ba35] rotate-45"
                animate={{ opacity: [0.2, 1, 0.2], x: [0, 3, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Swipe label: text hint (fades on first scroll) ── */}
      <motion.div
        className="flex items-center justify-center gap-1.5 mt-1 mb-1"
        animate={{ opacity: hasScrolled ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#f3ba35]/50" />
        <p className="text-[#f3ba35]/60 text-[10px] tracking-[0.25em] uppercase font-medium select-none">
          swipe to explore
        </p>
        <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#f3ba35]/50" />
      </motion.div>

      {/* ── Dot progress indicators ── */}
      <div className="flex justify-center gap-1.5 mb-2">
        {Array.from({ length: totalDays }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#f3ba35]/30" />
        ))}
      </div>

      {/* ── Horizontal Road Strip with continuous truck ── */}
      <div
        className="relative mt-12 h-24 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {/* Actual Road Surface (bottom portion of the container) */}
        <div
          className="absolute bottom-0 left-0 w-full h-[65%] shadow-2xl"
          style={{
            background: "#2d2d2d",
            borderTop: "4px solid rgba(107,114,128,0.6)",
            borderBottom: "4px solid rgba(107,114,128,0.6)",
            boxShadow:
              "0 4px 30px rgba(0,0,0,0.6), inset 0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {/* Road surface line marks */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.15) 40px, rgba(255,255,255,0.15) 42px)",
            }}
          />
          {/* Dashed centre line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0 border-t-[3px] border-dashed border-yellow-400/70" />
          {/* Kerb edges */}
          <div className="absolute top-1 left-0 w-full h-[2px] bg-white/10" />
          <div className="absolute bottom-1 left-0 w-full h-[2px] bg-white/10" />
        </div>

        {/* Continuous driving truck - positioned to overlap the top edge of the road */}
        <div
          className="absolute bottom-[5%] drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] z-10"
          style={{
            width: "130px",
            animation: "truck-drive 12s linear infinite",
          }}
        >
          <div className="relative">
            <img
              src="/truck.webp"
              alt="Crescendo Truck"
              className="w-full h-auto object-contain"
            />
            {/* Date label on truck - matching Hero page style */}
            <div
              className="absolute text-[9px] sm:text-[11px] font-bold text-[#F7B32B] px-1.5 py-1"
              style={{
                top: "38%",
                left: "32%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(139,21,56,0.95)",
                border: "1.5px solid #D4A017",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                letterSpacing: "0.03em",
                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            >
              {dateRange}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Page-level scroll for progress bar
  const { scrollYProgress: pageProgress } = useScroll();
  const progressWidth = useTransform(pageProgress, [0, 1], ["0%", "100%"]);

  // Track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  // Smooth the scroll progress so the vehicle doesn't jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map progress (0 to 1) to vertical position (0% to 100% of container height)
  const yPos = useTransform(smoothProgress, [0, 1], ["0%", "90%"]);

  return (
    <div className="relative w-full max-w-5xl mx-auto pt-32 md:pt-40 lg:pt-48 pb-24 px-4 sm:px-6 lg:px-8">
      {/* ── Enhancement 1: Golden Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] z-[9999] origin-left"
        style={{
          width: progressWidth,
          background: "linear-gradient(to right, #8B1538, #f3ba35, #a71d16)",
          boxShadow: "0 0 8px #f3ba35, 0 0 16px #f3ba35aa",
        }}
      />

      {/* ── Enhancement 2: Rotating Mandala Background ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <img
          src="/mandala.webp"
          alt=""
          className="w-[90vmin] sm:w-[75vmin] md:w-[65vmin] lg:w-[55vmin] opacity-[0.055] select-none"
          style={{ animation: "mandala-spin 120s linear infinite" }}
        />
      </div>
      <style>{`
        @keyframes mandala-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; } 50% { transform: translate(-50%,-50%) scale(1.55); opacity: 0; } }
      `}</style>

      {/* Mobile/Tablet: horizontal phase sections with rolling road */}
      <div className="lg:hidden space-y-4">
        {scheduleData.map((phase, phaseIdx) => (
          <HorizontalPhaseSection key={phaseIdx} phase={phase} />
        ))}
      </div>

      {/* ════════════════════════════════════════════
          DESKTOP lg+: Parallax Road Layout (unchanged)
          ════════════════════════════════════════════ */}
      {/* Container tracking scroll progress */}
      <div ref={containerRef} className="hidden lg:flex relative w-full">
        {/* LEFT COLUMN: The Parallax Track */}
        <div className="relative w-16 sm:w-20 md:w-40 flex-shrink-0 flex justify-center">
          {/* The Thick Road Strip */}
          <div
            className="absolute -top-16 -bottom-16 w-8 sm:w-12 md:w-28 bg-[#2d2d2d] dark:bg-[#1a1a1a] border-x-2 md:border-x-4 border-gray-500/50 shadow-2xl overflow-hidden flex justify-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
            }}
          >
            {/* Center dashed line */}
            <div className="w-0 h-full border-l-2 md:border-l-8 border-dashed border-yellow-400/80"></div>
          </div>

          {/* The Moving Vehicle */}
          <motion.div
            style={{ top: yPos }}
            className="absolute z-10 w-16 sm:w-20 md:w-32 -ml-1 mt-6 drop-shadow-2xl"
          >
            <div className="relative w-full animate-[truck-bob_2s_ease-in-out_infinite]">
              <Image
                src="/rickshaw.webp"
                alt="Moving Rickshaw"
                width={400}
                height={400}
                className="w-full h-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                priority
              />
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: The Events List */}
        <div className="flex-1 min-w-0 pb-32 ml-2 sm:ml-4 md:ml-8">
          {scheduleData.map((phase, phaseIdx) => (
            <div key={phaseIdx} className="relative mb-24 last:mb-0">
              {/* ── Per-phase rotating mandala at top edge ── */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 pointer-events-none z-[-1] w-[280px] sm:w-[340px] md:w-[400px] overflow-visible">
                <img
                  src="/mandala.webp"
                  alt=""
                  className="w-full h-auto opacity-[0.28] select-none brightness-[0.4]"
                  style={{ animation: "mandala-spin 90s linear infinite" }}
                />
              </div>

              {/* ── Enhancement 4: Ornamental Phase Header Banner ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="relative flex items-center gap-3 sm:gap-4 mb-8 md:mb-12"
              >
                {/* Left rule with diamond cap */}
                <div className="flex-1 flex items-center gap-1 min-w-0">
                  <div className="w-2 h-2 rotate-45 bg-[#f3ba35] shrink-0 shadow-[0_0_6px_#f3ba35]" />
                  <div className="flex-1 h-[1.5px] bg-gradient-to-r from-[#f3ba35] to-[#f3ba35]/10" />
                </div>
                {/* Badge */}
                <div className="shrink-0 px-4 sm:px-6 py-1.5 sm:py-2 border border-[#f3ba35]/60 rounded-sm shadow-[0_0_20px_rgba(243,186,53,0.15)] bg-[#3a0c1a]/80 backdrop-blur-sm">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-nistha text-transparent bg-clip-text bg-gradient-to-br from-[#f3ba35] via-[#ffe08a] to-[#d4922c] drop-shadow-md whitespace-nowrap tracking-wider">
                    {phase.phase}
                  </h2>
                </div>
                {/* Right rule with diamond cap */}
                <div className="flex-1 flex items-center gap-1 min-w-0">
                  <div className="flex-1 h-[1.5px] bg-gradient-to-l from-[#f3ba35] to-[#f3ba35]/10" />
                  <div className="w-2 h-2 rotate-45 bg-[#f3ba35] shrink-0 shadow-[0_0_6px_#f3ba35]" />
                </div>
              </motion.div>

              {/* Days List */}
              <div className="space-y-12 md:space-y-16">
                {phase.days.map((day, dayIdx) => (
                  <motion.div
                    key={dayIdx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.5, delay: dayIdx * 0.1 }}
                    className="relative bg-[#8B1538] rounded-3xl p-6 sm:p-8 border-[1.5px] border-[#f3ba35]/30 hover:border-[#f3ba35]/70 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.6)] group transition-transform duration-500 hover:-translate-y-2"
                  >
                    {/* Film Grain Texture Overlay */}
                    <div
                      className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden opacity-10 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                      }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-14 items-stretch">
                      {/* Left Side: Event Details (Match Image Style) */}
                      <div className="flex-1 min-w-0 pr-2">
                        {/* Header: DAY X (Gold decorative) + Date */}
                        <div className="mb-6 flex flex-col gap-0.5">
                          <h3 className="text-3xl md:text-5xl font-nistha text-[#f3ba35] tracking-[0.1em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                            {day.title.split(" (")[0].toUpperCase()}
                          </h3>
                          {day.title.includes("(") && (
                            <span className="text-lg md:text-xl text-[#f3ba35]/80 font-medium">
                              ({day.title.split(" (")[1]}
                            </span>
                          )}
                          {/* Horizontal Separator Line as seen in image */}
                          <div className="w-full h-[1px] bg-gradient-to-r from-[#f3ba35]/30 to-transparent mt-4 mb-2" />
                        </div>

                        {/* Event List with Sub-details and Separators */}
                        <ul className="space-y-6">
                          {day.events.map((event, evtIdx) => (
                            <li key={evtIdx} className="flex flex-col gap-2">
                              <div className="flex items-start gap-3">
                                <span className="text-[#f3ba35] mt-1 text-lg drop-shadow-lg shrink-0">
                                  ✦
                                </span>
                                <div className="flex flex-col gap-1">
                                  <span className="text-2xl md:text-[1.75rem] font-bold text-[#F5F5DC] tracking-wide uppercase drop-shadow-xl text-decorative">
                                    {event.name}
                                  </span>
                                  
                                  {/* Sub-details (Time & Location) */}
                                  {(event.time || event.location) && (
                                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm md:text-base font-medium text-[#f3ba35]/90 tracking-wide">
                                      {event.time && (
                                        <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-[#f3ba35]/30">
                                          <Clock className="w-4 h-4" />
                                          {event.time}
                                        </span>
                                      )}
                                      {event.location && (
                                        <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-[#f3ba35]/30">
                                          <MapPin className="w-4 h-4" />
                                          {event.location}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* Horizontal Separator Line below each event (except last) */}
                              {evtIdx < day.events.length - 1 && (
                                <div className="w-full h-[1px] bg-gradient-to-r from-[#f3ba35]/20 to-transparent mt-4 opacity-50" />
                              )}
                            </li>
                          ))}
                        </ul>

                        {/* Bottom Extra spacing removed to keep box tightly aligned */}
                      </div>

                      {/* Right Side: Image Zone (The darker div zone) */}
                      {day.events.some((e) => e.icon) && (
                        <div className="w-full md:w-[35%] lg:w-[40%] shrink-0 relative min-h-[220px] md:min-h-[280px] bg-[#4A081A] rounded-3xl overflow-hidden self-center shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-[#f3ba35]/20">
                          {/* Inner card background mandala (Subtle as seen in image) */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-15">
                            <img
                              src="/mandala.webp"
                              alt=""
                              className="w-[120%] h-[120%] object-contain"
                              style={{
                                animation: "mandala-spin 90s linear infinite",
                              }}
                            />
                          </div>

                          {/* Image Zone Corner Brackets (Refined thin gold as seen in image) */}
                          <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#f3ba35]/50 rounded-tl-xl" />
                          <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#f3ba35]/50 rounded-tr-xl" />
                          <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#f3ba35]/50 rounded-bl-xl" />
                          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#f3ba35]/50 rounded-br-xl" />

                          {/* Hero Event Image (Icon) */}
                          <div className="relative z-10 w-full h-full p-8 flex items-center justify-center">
                            <img
                              src={
                                day.events.find((e) => e.icon)?.icon ||
                                "/mandala.webp"
                              }
                              alt="Event"
                              className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
