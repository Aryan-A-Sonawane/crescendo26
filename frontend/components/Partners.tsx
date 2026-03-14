"use client";

import { motion } from "framer-motion";

const sponsors = new Array(8).fill("To be announced");

export default function Partners() {
  return (
    <section
      id="partner"
      className="py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,248,231,0.98) 0%, #FFE5B4 40%, #F3BA35 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-[var(--secondary-burgundy)] mb-12">
          Our Sponsors
        </h2>

        {/* Carousel */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 25,
              ease: "linear",
            }}
          >
            {[...sponsors, ...sponsors].map((name, index) => (
              <div
                key={index}
                className="min-w-[220px] md:min-w-[260px] h-[280px] rounded-3xl bg-white shadow-xl flex items-center justify-center text-center px-6 text-lg font-semibold text-[var(--primary-maroon)]"
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}