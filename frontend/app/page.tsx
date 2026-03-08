import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Events from "@/components/Events";
import FAQs from "@/components/FAQs";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f3ba35] relative overflow-x-hidden">
      {/* Left Border (scrolling with page) */}
      <div 
        className="pointer-events-none" 
        style={{ 
          position: 'fixed',
          left: -1,
          top: 0,
          bottom: 0,
          width: '120px',
          zIndex: 9998,
          backgroundImage: 'url(/border_1.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: '0 0',
          margin: 0,
          padding: 0,
        }}
      />

      {/* Right Border (scrolling with page - flipped) */}
      <div 
        className="pointer-events-none" 
        style={{ 
          position: 'fixed',
          right: -1,
          top: 0,
          bottom: 0,
          width: '120px',
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

      {/* Main Content */}
      <div className="relative">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Events />
          <FAQs />
        </main>
        <Footer />
      </div>
    </div>
  );
}

