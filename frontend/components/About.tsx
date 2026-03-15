import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#9f3026", minHeight: "100vh", padding: 0, margin: 0 }}
    >

      {/* Scrolling Warli painting band */}
      <div
        className="w-full overflow-hidden"
        style={{
          position: "relative",
          zIndex: 10,
          backgroundColor: "#5a1a0e",
          height: 100,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Double the images so the loop is seamless */}
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "warli-scroll 18s linear infinite",
          }}
        >
          {[...Array(8)].map((_, i) => (
            <Image
              key={i}
              src="/warli-painting.jpg"
              alt="warli dancers"
              width={350}
              height={100}
              className="object-contain"
              style={{ flexShrink: 0, opacity: 0.92, height: 100, width: "auto" }}
              priority={i === 0}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col md:flex-row items-center h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 gap-0"
        style={{ zIndex: 4, minHeight: "100vh" }}
      >
        {/* Left — Title */}
        <div className="flex flex-col justify-center shrink-0 md:w-1/2 pt-8 md:pt-0" style={{ zIndex: 6 }}>
          <h2
            className="font-taiganja text-white leading-tight text-center md:text-left"
            style={{ fontSize: "clamp(2.2rem, 8vw, 6.5rem)" }}
          >
            What is
          </h2>
          <h1
            className="font-nistha leading-none text-center md:text-left"
            style={{
              fontSize: "clamp(3rem, 12vw, 8rem)",
              color: "#ffb51d",
              textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            Crescendo?
          </h1>
          {/* Mobile-only description — shown instead of the radio overlay */}
          <p
            className="block md:hidden text-center mt-4 px-4"
            style={{
              color: "#ffd21f",
              fontStyle: "italic",
              fontSize: "clamp(0.9rem, 4vw, 1.1rem)",
              lineHeight: 1.6,
            }}
          >
            Crescendo is VIT&apos;s inter-college fest that brings together students from
            different institutions to celebrate talent, creativity, and competition.
            Not just a fest — an experience filled with energy, innovation, performances,
            and unforgettable campus moments.
          </p>
        </div>

        {/* Right — Radio image — desktop only */}
        <div
          className="hidden md:flex shrink-0 items-center justify-start w-full md:w-auto"
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
