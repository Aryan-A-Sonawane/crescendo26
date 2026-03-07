import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#9f3026", minHeight: "100vh" }}
    >
      {/* Left decorative border */}
      <div className="absolute left-0 top-0 h-full w-8 md:w-16 lg:w-20" style={{ zIndex: 2 }}>
        <Image
          src="/border_1.png"
          alt="left border"
          fill
          className="object-cover"
          style={{ objectPosition: "center" }}
        />
      </div>

      {/* Right decorative border */}
      <div className="absolute right-0 top-0 h-full w-8 md:w-16 lg:w-20" style={{ zIndex: 2 }}>
        <Image
          src="/border_1.png"
          alt="right border"
          fill
          className="object-cover"
          style={{ objectPosition: "center", transform: "scaleX(-1)" }}
        />
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col md:flex-row items-center h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-12 md:py-20 gap-0"
        style={{ zIndex: 4, minHeight: "100vh" }}
      >
        {/* Left — Title (sits on top, overlaps radio) */}
        <div className="flex flex-col justify-center shrink-0 md:w-1/2" style={{ zIndex: 6 }}>
          <h2
            className="font-taiganja text-white leading-tight text-center md:text-left"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
          >
            What is
          </h2>
          <h1
            className="font-nistha leading-none text-center md:text-left"
            style={{
              fontSize: "clamp(4rem, 12vw, 8rem)",
              color: "#ffb51d",
              textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Crescendo?
          </h1>
        </div>

        {/* Right — Radio image (large, pulls left to overlap title) */}
        <div
          className="shrink-0 flex items-center justify-start w-full md:w-auto"
          style={{ zIndex: 5, width: "100%", marginLeft: "0", marginTop: "2rem" }}
        >
          <div className="relative w-full md:w-[90%] md:-ml-[20%]">
            {/* Radio image */}
            <Image
              src="/radio.webp"
              alt="radio"
              width={1400}
              height={1050}
              className="object-contain w-full"
              style={{ opacity: 0.3}}
            />

            {/* Left speaker — spinning mandala wheel */}
            <div
              className="speaker-spin absolute pointer-events-none"
              style={{
                width: "23%",
                aspectRatio: "1",
                bottom: "22.5%",
                left: "10%",
                opacity: 0.3,
              }}
            >
              <Image src="/disc.webp" alt="left speaker wheel" fill className="object-contain" />
            </div>

            {/* Right speaker — spinning mandala wheel (reverse) */}
            <div
              className="speaker-spin-reverse absolute pointer-events-none"
              style={{
                width: "23%",
                aspectRatio: "1",
                bottom: "22.5%",
                right: "10%",
                opacity: 0.3,
              }}
            >
              <Image src="/disc.webp" alt="right speaker wheel" fill className="object-contain" />
            </div>

            {/* Text overlay on top of radio */}
            <div className="absolute inset-0 flex items-center justify-start px-16 sm:px-20 md:px-40 lg:px-52 xl:px-60">
              <p
                style={{
                  color: "#ffd21f",
                  font: "400 1rem/1.5 serif",
                  fontStyle: "italic",
                  fontSize: "clamp(0.75rem, 1.4vw, 1.1rem)",
                  textAlign: "justify",
                  textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                  lineHeight: "1.5",
                }}
              >
                Crescendo is VIT&apos;s inter-college fest that brings together students from
                different institutions to celebrate talent, creativity, and competition.&nbsp;
                Crescendo is not just a fest, but an experience filled with energy, innovation,
                performances, and unforgettable campus moments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
