"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

import { MapPin, Clock } from "lucide-react";

const scheduleData = [
  {
    phase: "Timeline",
    days: [
      {
        title: "Day 1 (06 April)",
        events: [
          { name: "Natki", time: "11:00 AM onwards" },
          { name: "Bike & Car Show" },
        ],
      },
      {
        title: "Day 2 (07 April)",
        events: [
          { name: "Met Gala (Ms. & Mr. Crescendo)", time: "1:00 PM onwards" },
          { name: "DJ Night", location: "Ground" },
          { name: "Flea Market" },
        ],
      },
      {
        title: "Day 3 (08 April)",
        events: [
          { name: "Footloose", location: "Audi" },
          {
            name: "Screen Display",
            time: "Morning & 4:00 PM",
            location: "Ground",
          },
          { name: "Flea Market" },
        ],
      },
      {
        title: "Day 4 (09 April)",
        events: [
          { name: "Vrock", location: "Open Ground Stage" },
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
        events: [{ name: "Cosplay + Movie Night", location: "Ground Stage" }],
      },
      {
        title: "Day 2 (11 April)",
        events: [{ name: "Fake Wedding" }],
      },
      {
        title: "Day 3 - Kondhwa (12 April)",
        events: [{ name: "Western Day" }, { name: "Band Performance" }],
      },
    ],
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

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
  // We use 90% as max to stop right before the end
  const yPos = useTransform(smoothProgress, [0, 1], ["0%", "90%"]);

  return (
    <div className="relative w-full max-w-5xl mx-auto pt-32 md:pt-40 lg:pt-48 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Container tracking scroll progress */}
      <div ref={containerRef} className="relative w-full flex">
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
                src="/rickshaw.png"
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
            <div key={phaseIdx} className="mb-24 last:mb-0">
              {/* Phase Header */}
              <motion.h2
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-5xl sm:text-6xl md:text-7xl font-nistha mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#8B1538] to-[#a71d16] drop-shadow-md break-words"
              >
                {phase.phase}
              </motion.h2>

              {/* Days List */}
              <div className="space-y-12 md:space-y-16">
                {phase.days.map((day, dayIdx) => (
                  <motion.div
                    key={dayIdx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.5, delay: dayIdx * 0.1 }}
                    className="relative bg-[#8B1538] rounded-2xl p-6 sm:p-8 border-2 border-[#a71d16] hover:border-[var(--primary-gold)] transition-colors shadow-2xl group overflow-hidden"
                  >
                    {/* Advanced Royal Fort CSS Pattern */}
                    <div className="absolute inset-1.5 sm:inset-2.5 pointer-events-none z-0">
                      {/* Corner L-Brackets */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-[2.5px] border-l-[2.5px] border-[#f3ba35] rounded-tl-[10px]" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-[2.5px] border-r-[2.5px] border-[#f3ba35] rounded-tr-[10px]" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[2.5px] border-l-[2.5px] border-[#f3ba35] rounded-bl-[10px]" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[2.5px] border-r-[2.5px] border-[#f3ba35] rounded-br-[10px]" />

                      {/* Intersecting Floating Diamonds */}
                      <div className="absolute top-[8px] left-[8px] w-3 h-3 bg-[#f3ba35] rotate-45 shadow-[0_0_8px_#f3ba35]" />
                      <div className="absolute top-[8px] right-[8px] w-3 h-3 bg-[#f3ba35] rotate-45 shadow-[0_0_8px_#f3ba35]" />
                      <div className="absolute bottom-[8px] left-[8px] w-3 h-3 bg-[#f3ba35] rotate-45 shadow-[0_0_8px_#f3ba35]" />
                      <div className="absolute bottom-[8px] right-[8px] w-3 h-3 bg-[#f3ba35] rotate-45 shadow-[0_0_8px_#f3ba35]" />

                      {/* Center-Aligned Dashed Connecting Trusses */}
                      <div className="absolute top-[13.5px] inset-x-8 border-t-[1.5px] border-dashed border-[#f3ba35]/40" />
                      <div className="absolute bottom-[13.5px] inset-x-8 border-b-[1.5px] border-dashed border-[#f3ba35]/40" />
                      <div className="absolute left-[13.5px] inset-y-8 border-l-[1.5px] border-dashed border-[#f3ba35]/40" />
                      <div className="absolute right-[13.5px] inset-y-8 border-r-[1.5px] border-dashed border-[#f3ba35]/40" />
                    </div>

                    {/* Connection dot to the road */}
                    <div className="absolute top-1/2 -left-4 sm:-left-6 md:-left-12 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 -translate-y-1/2 rounded-full border-[3px] md:border-4 border-[var(--primary-gold)] bg-[#a71d16] shadow-[0_0_10px_var(--primary-gold)] z-10 group-hover:scale-125 transition-transform" />

                    <div className="relative z-10">
                      <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--primary-gold)] tracking-wide drop-shadow-sm flex flex-col gap-1 text-decorative">
                      <span>{day.title.split(" (")[0]}</span>
                      {day.title.includes("(") && (
                        <span className="text-xl md:text-2xl opacity-90">
                          ({day.title.split(" (")[1]}
                        </span>
                      )}
                    </h3>

                    <ul className="space-y-4">
                      {day.events.map((event, evtIdx) => (
                        <li key={evtIdx} className="flex flex-col gap-1 pb-4">
                          <div className="flex items-start gap-3">
                            <span className="text-[#f3ba35] mt-1 drop-shadow-md shrink-0">
                              ✦
                            </span>
                            <span className="text-xl md:text-2xl text-[var(--neutral-white)] font-bold tracking-wider leading-snug text-decorative">
                              {event.name}
                            </span>
                          </div>
                          {(event.time || event.location) && (
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm md:text-base text-[#f3ba35]/90 font-medium tracking-wide">
                              {event.time && (
                                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-black/10">
                                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" />
                                  {event.time}
                                </span>
                              )}
                              {event.location && (
                                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full border border-black/10">
                                  <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
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
