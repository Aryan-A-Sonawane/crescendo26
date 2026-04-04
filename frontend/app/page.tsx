import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partners from "@/components/Partners";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";
import Image from "next/image";
import EventGallery from "@/components/EventGallery";
import EntryLoader from "@/components/EntryLoader";

export default function Home() {
  return (
    <EntryLoader>
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

      {/* Main Content */}
        <div className="relative">
          <Navbar />
          <main>
            <Hero />
            <About />
            {/* <Partners /> */}
            <EventGallery/>
            <FAQs />
          </main>
          <Footer />
        </div>
      </div>
    </EntryLoader>
  );
}

