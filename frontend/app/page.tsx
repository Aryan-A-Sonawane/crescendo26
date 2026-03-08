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
        className="fixed left-0 top-0 bottom-0 pointer-events-none" 
        style={{ 
          width: '120px',
          zIndex: 9999,
          backgroundImage: 'url(/border_1.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: 'left center',
          margin: 0,
          padding: 0,
        }}
      />

      {/* Right Border (scrolling with page - flipped) */}
      <div 
        className="fixed right-0 top-0 bottom-0 pointer-events-none" 
        style={{ 
          width: '120px',
          zIndex: 9999,
          backgroundImage: 'url(/border_1.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: 'right center',
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

