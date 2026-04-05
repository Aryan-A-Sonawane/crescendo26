"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";

const ROW_1 = [
  { src: "/showcase/classical_dance.webp", title: "Classical Dance" },
  { src: "/showcase/car.webp",             title: "Vintage Expo"    },
  { src: "/showcase/0D1A1196.webp",        title: "Main Stage"      },
  { src: "/showcase/code.webp",            title: "Debug Session"   },
];
const ROW_2 = [
  { src: "/showcase/tt.webp",        title: "Tournament"  },
  { src: "/showcase/table.webp",     title: "Setup"       },
  { src: "/showcase/mr.ms.vit.webp", title: "Grand Finale"},
  { src: "/showcase/football.webp",  title: "Match Day"   },
];
const ROW_3 = [
  { src: "/showcase/dance_solo.webp",  title: "Solo Act"    },
  { src: "/showcase/dance_group.webp", title: "Group Sync"  },
  { src: "/showcase/dance.webp",       title: "Street Dance"},
  { src: "/showcase/codenseek.webp",   title: "Hackathon"   },
];


interface ParallaxProps {
  images: { src: string; title: string }[];
  baseVelocity: number;
}

function ParallaxRow({ images, baseVelocity }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  
  // Modulo math for infinite wrap
  const x = useTransform(baseX, (v) => `${((v % 25) - 25) % 25}%`);
  const directionFactor = useRef<number>(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden mb-12 py-8 whitespace-nowrap">
      <motion.div style={{ x }} className="flex gap-12 flex-nowrap">
        {[...images, ...images, ...images, ...images].map((item, i) => (
          <div
            key={i}
            className="gallery-item group relative flex-shrink-0"
            style={{
              height: "clamp(180px, 35vh, 340px)",
              width: "clamp(240px, 30vw, 480px)",
              willChange: "transform", // PREPARE GPU
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:z-50 shadow-2xl">
              <img
                src={item.src}
                alt={item.title}
                loading="lazy" // DON'T LOAD ALL AT ONCE
                className="gallery-img w-full h-full object-cover transition-all duration-500 ease-in-out"
                style={{ willChange: "filter, transform" }}
              />
              
              {/* Title label - simple CSS transition is lighter than Framer for this */}
              <div className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none">
                <p className="text-white font-mono text-[10px] uppercase tracking-widest bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
                  {item.title}
                </p>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function EventGallery() {
  return (
    <>
      <style>{PERFORMANCE_CSS}</style>
      <section
        className="gallery-container relative min-h-screen py-24 overflow-hidden flex flex-col justify-center"
        style={{ background: "#000" }}
      >
        {/* No overlay gradients, keep background pure black */}

        <div className="relative z-10 w-full">
          <ParallaxRow images={ROW_1} baseVelocity={-0.6} />
          <ParallaxRow images={ROW_2} baseVelocity={0.8} />
          <ParallaxRow images={ROW_3} baseVelocity={-0.7} />
        </div>
      </section>
    </>
  );
}

const PERFORMANCE_CSS = `
  /* 1. Normal State */
  .gallery-img {
    filter: grayscale(0) brightness(1);
  }

  /* 2. When ANY part of the gallery is hovered, dim ALL images */
  .gallery-container:hover .gallery-img {
    filter: grayscale(1) brightness(0.5);
  }

  /* 3. The specific image being hovered pops back to color */
  /* This is handled by CSS which is 10x faster than React State for filters */
  .gallery-item:hover .gallery-img {
    filter: grayscale(0) brightness(1) !important;
  }
`;