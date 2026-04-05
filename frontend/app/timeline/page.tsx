import Timeline from "@/components/Timeline";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Crescendo26 - Timeline",
  description: "Schedule of events for Crescendo26 and Vishwotsav.",
};

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-[#f3ba35] relative overflow-x-hidden">
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
          backgroundImage: 'url(/border_1.webp)',
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
          backgroundImage: 'url(/border_1.webp)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: '0 0',
          transform: 'scaleX(-1)',
          margin: 0,
          padding: 0,
        }}
      />

      {/* Top Border — mobile hero only */}
      <div
        className="pointer-events-none flex flex-row items-start md:hidden"
        style={{
          position: 'absolute',
          top: -0.5,
          left: 'calc(clamp(28px, 7.5vw, 120px) - 10px)',
          right: 'calc(clamp(28px, 7.5vw, 120px) - 1px)',
          height: 'clamp(60px, 6vw, 95px)',
          zIndex: 9998,
          overflow: 'hidden', 
          margin: 0,
          padding: 0,
        }}
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 180,
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Image
              src="/border_1.webp"
              alt=""
              width={214}
              height={1076}
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '60px',
                height: '260px',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                maxWidth: 'none',
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative">
        <Navbar />
        
        <div className="relative z-10 min-h-screen">
          <Timeline />
        </div>

        <Footer />
      </div>
    </div>
  );
}
