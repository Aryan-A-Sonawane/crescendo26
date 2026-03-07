/**
 * Slide-in keyframes (slideInLeft / slideInRight) are defined in app/globals.css.
 * Z-index layers:
 *   css bg → background color #E7A92E (behind everything)
 *   0 → border_left-removebg-preview.png decorative border frame
 *   1 → banner.webp (centered, behind decoratives)
 *   2 → decorative elements (mandala, truck, camel, sitar, gramophone)
 *   3 → crescendo.png (primary focus)
 *   10 → Border_top-removebg-preview.png (top strip, above all)
 */

import Image from "next/image";

export default function Hero() {
  return (
    <>
      {/* ── Hero section — 88vh gives enough room to separate decoratives ── */}
      <section
        id="home"
        className="relative w-full overflow-hidden"
        style={{ height: "88vh", backgroundColor: "#E7A92E" }}
      >

        {/* Top decorative strip — border_left image at natural vertical scale, clipped to show top flower band */}
        {/* Background-size: 100% 630px → stretches to full width, 630px tall (near-natural height) */}
        {/* Container clips to ~130px → reveals top ~20% of image = corner medallion + hanging flowers */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none select-none"
          style={{
            zIndex: 6,
            height: "clamp(100px, 18vh, 150px)",
            backgroundImage: "url('/border_left-removebg-preview.png')",
            backgroundSize: "100% 630px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top left",
          }}
        />

        {/* Left side border — object-cover anchored top-left, z-7 so corner medallion overlaps top strip */}
        <div className="absolute top-0 left-0 h-full pointer-events-none select-none"
          style={{ zIndex: 7, width: "clamp(60px, 7vw, 110px)" }}>
          <Image src="/border_left-removebg-preview.png" alt="" fill
            style={{ objectFit: "cover", objectPosition: "left top" }}
            aria-hidden="true" sizes="8vw" />
        </div>

        {/* Right side border — mirrored */}
        <div className="absolute top-0 right-0 h-full pointer-events-none select-none"
          style={{ zIndex: 7, width: "clamp(60px, 7vw, 110px)", transform: "scaleX(-1)" }}>
          <Image src="/border_left-removebg-preview.png" alt="" fill
            style={{ objectFit: "cover", objectPosition: "left top" }}
            aria-hidden="true" sizes="8vw" />
        </div>

        {/* Mandala — top-left corner, behind truck — z-2, low opacity */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ top: "18vh", left: "0%", zIndex: 2, width: "clamp(160px, 14vw, 240px)", opacity: 0.45 }}
        >
          <Image
            src="/mandala.webp"
            alt=""
            width={300}
            height={300}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Truck — just below border, top-left — z-2 — hidden on mobile */}
        <div
          className="absolute hidden md:block pointer-events-none select-none animate-[slideInLeft_1.5s_ease-out_1.5s_both]"
          style={{ top: "18vh", left: "-12px", zIndex: 2, width: "clamp(220px, 20vw, 300px)" }}
        >
          <Image
            src="/truck.webp"
            alt="Decorated Indian Truck"
            width={400}
            height={320}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Camel — bottom-left, flush with section bottom — z-2 — hidden on mobile */}
        <div
          className="absolute hidden md:block pointer-events-none select-none animate-[slideInLeft_1.5s_ease-out_1.5s_both]"
          style={{ bottom: 0, left: "-12px", zIndex: 2, width: "clamp(280px, 24vw, 360px)" }}
        >
          <Image
            src="/camel.webp"
            alt="Decorated Camel"
            width={460}
            height={400}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Sitar — just below border, top-right — z-2 */}
        <div
          className="absolute pointer-events-none select-none animate-[slideInRight_1.5s_ease-out_1.5s_both]"
          style={{ top: "18vh", right: "-12px", zIndex: 2, width: "clamp(240px, 22vw, 320px)" }}
        >
          <Image
            src="/sitar.webp"
            alt="Classical instruments"
            width={420}
            height={380}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Gramophone — bottom-right, flush with section bottom — z-2 */}
        <div
          className="absolute pointer-events-none select-none animate-[slideInRight_1.5s_ease-out_1.5s_both]"
          style={{ bottom: 0, right: "-12px", zIndex: 2, width: "clamp(240px, 20vw, 320px)" }}
        >
          <Image
            src="/music_driver.webp"
            alt="Gramophone"
            width={420}
            height={380}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* banner.webp — behind all decoratives and logo, centered — z-1 */}
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ zIndex: 1, width: "clamp(360px, 55vw, 900px)" }}
        >
          <Image
            src="/banner.webp"
            alt=""
            width={1200}
            height={800}
            aria-hidden="true"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Crescendo logo — centered, 40–50% width — z-3 */}
        <div
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none hero-banner-wrapper"
          style={{ zIndex: 3 }}
        >
          <Image
            src="/crescendo.png"
            alt="Crescendo: The Indian Odyssey"
            width={900}
            height={450}
            priority
            style={{
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.25))",
            }}
          />
        </div>


      </section>

      {/* Bottom maroon section — 15–18% screen height */}
      <div style={{ width: "100%", height: "10vh", backgroundColor: "#9E2F24" }} />

    </>
  );
}
