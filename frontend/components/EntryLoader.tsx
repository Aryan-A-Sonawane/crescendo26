"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const SESSION_SEEN_KEY = "crescendo_entry_seen";
const MUSIC_ENABLED_KEY = "crescendo_music_enabled";
const MIN_SCREEN_TIME_MS = 1400;

type EntryLoaderProps = {
  children: React.ReactNode;
};

export default function EntryLoader({ children }: EntryLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const bars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        scale: 0.45 + ((i * 7) % 12) / 10,
        duration: 0.9 + (i % 5) * 0.15,
      })),
    []
  );

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_SEEN_KEY) === "1";
    if (seen) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => setButtonEnabled(true), MIN_SCREEN_TIME_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const enterFestival = () => {
    if (!buttonEnabled) {
      return;
    }

    sessionStorage.setItem(SESSION_SEEN_KEY, "1");
    localStorage.setItem(MUSIC_ENABLED_KEY, "1");
    window.dispatchEvent(new CustomEvent("crescendo-enter"));
    setVisible(false);
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="transition-all duration-700"
        style={{
          filter: visible ? "brightness(0.52) saturate(0.88)" : "brightness(1)",
          pointerEvents: visible ? "none" : "auto",
          userSelect: visible ? "none" : "auto",
        }}
      >
        {children}
      </div>

      <AnimatePresence>
        {visible ? (
          <motion.div
            key="entry-loader"
            className="fixed inset-0 z-12000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(12, 8, 6, 0.28)" }} />

            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="flex w-full max-w-2xl flex-col items-center text-center">
                <motion.div
                  className="relative mb-5 h-28 w-28 md:h-36 md:w-36"
                  initial={{ opacity: 0, y: 18, scale: 0.86 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.12, duration: 0.6 }}
                >
                  <Image
                    src="/mandala.webp"
                    alt=""
                    fill
                    aria-hidden="true"
                    className="object-contain opacity-40"
                    style={{ animation: "spin-slow 10s linear infinite" }}
                  />
                  <div className="absolute inset-3 md:inset-4">
                    <Image src="/crescendo.png" alt="Crescendo logo" fill className="object-contain" priority />
                  </div>
                </motion.div>

                <motion.h1
                  className="text-3xl font-black tracking-wide text-[#fff8e7] md:text-5xl"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.55 }}
                >
                  Crescendo&apos;26
                </motion.h1>

                <motion.p
                  className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#fff3d0] md:text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.5 }}
                >
                </motion.p>

                <motion.div
                  className="mt-7 flex h-16 items-end justify-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.34, duration: 0.5 }}
                  aria-hidden="true"
                >
                  {bars.map((bar, index) => (
                    <motion.span
                      key={bar.id}
                      className="w-1.5 rounded-full bg-[#ffd47a]"
                      style={{ originY: 1, height: 36 }}
                      animate={{
                        scaleY: [0.45, bar.scale, 0.62],
                        opacity: [0.36, 0.95, 0.5],
                      }}
                      transition={{
                        duration: bar.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.03,
                      }}
                    />
                  ))}
                </motion.div>

                <motion.button
                  type="button"
                  onClick={enterFestival}
                  disabled={!buttonEnabled}
                  className="mt-9 rounded-full border-2 border-[#ffd47a] px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#fff8e7] md:text-base"
                  style={{
                    fontFamily: "'Cinzel Decorative', serif",
                    backgroundColor: buttonEnabled ? "#8b1538" : "#8b1538aa",
                    cursor: buttonEnabled ? "pointer" : "not-allowed",
                    opacity: buttonEnabled ? 1 : 0.75,
                  }}
                  whileHover={buttonEnabled ? { scale: 1.05, boxShadow: "0 0 28px rgba(255, 212, 122, 0.6)" } : undefined}
                  whileTap={buttonEnabled ? { scale: 0.97 } : undefined}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.45 }}
                >
                  {buttonEnabled ? "Start The Journey" : "Preparing..."}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}