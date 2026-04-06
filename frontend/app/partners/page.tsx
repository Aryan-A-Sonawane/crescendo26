"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// All partner logos (1-8 are regular partners, 9 is featured sponsor, 10-18 are regular partners)
const allPartners = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  image: `/partners/${i + 1}.png`,
  isFeatured: i + 1 === 9, // 9.png is the featured sponsor
}));

const featuredSponsor = allPartners.find(p => p.isFeatured);
const otherSponsors = allPartners.filter(p => !p.isFeatured);

export default function PartnersPage() {
  return (
    <div className="min-h-screen `1  bg-[#f3ba35] relative overflow-x-hidden">
      {/* Left Border — responsive */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          left: -1,
          top: 0,
          bottom: 0,
          width: 'clamp(28px, 7.5vw, 120px)',
          zIndex: 9998,
          backgroundImage: 'url(/border_1.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: '0 0',
          margin: 0,
          padding: 0,
        }}
      />

      {/* Right Border — responsive */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          right: -1,
          top: 0,
          bottom: 0,
          width: 'clamp(28px, 7.5vw, 120px)',
          zIndex: 9998,
          backgroundImage: 'url(/border_1.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: '0 0',
          transform: 'scaleX(-1)',
          margin: 0,
          padding: 0,
        }}
      />

      <Navbar />

      <section
        className="pt-32 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,248,231,0.98) 0%, #FFE5B4 40%, #F3BA35 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary-burgundy)] mb-16 text-center" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
            Our Sponsors
          </h1>

          {/* Featured Sponsor */}
          {featuredSponsor && (
            <motion.div
              className="mb-16 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="rounded-3xl bg-white shadow-2xl p-4 mx-auto max-w-xs"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={featuredSponsor.image}
                  alt="Primary Sponsor"
                  width={300}
                  height={300}
                  className="rounded-2xl w-full h-auto"
                  priority
                />
              </motion.div>
            </motion.div>
          )}

          {/* Other Sponsors */}
          {otherSponsors.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--secondary-burgundy)] mb-8 text-center" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
                Our Partners
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 max-w-6xl mx-auto">
                {otherSponsors.map((partner, index) => (
                  <motion.div
                    key={index}
                    className="rounded-2xl bg-white shadow-lg p-2 flex items-center justify-center aspect-square"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={partner.image}
                      alt={`Partner ${partner.id}`}
                      width={200}
                      height={200}
                      className="rounded-xl w-full h-full object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}