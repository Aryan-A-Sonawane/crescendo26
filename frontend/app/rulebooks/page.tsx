import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const rulebooks = [
  {
    title: "Technical Rulebook",
    description: "Rules, judging criteria, and participation details for technical events.",
    href: "/rulebooks/Technical.pdf",
  },
  {
    title: "Extra Curricular Rulebook",
    description: "Guidelines for extra-curricular competitions and cultural activities.",
    href: "/rulebooks/Extra-Curriular.pdf",
  },
  {
    title: "Sports Rulebook",
    description: "Event rules, fixtures format, and fair-play standards for sports contests.",
    href: "/rulebooks/Sports.pdf",
  },
];

export default function RulebooksPage() {
  return (
    <div className="min-h-screen bg-[#f3ba35] relative overflow-x-hidden">
      {/* Paisley pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/paisley-pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "420px 420px",
          opacity: 0.14,
          zIndex: 0,
        }}
      />

      <Navbar />

      <main className="px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 relative z-[1]">
        <section className="max-w-6xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold text-center"
            style={{ color: "#6B0F1A", fontFamily: "'Cinzel Decorative', serif" }}
          >
            Rulebooks
          </h1>
          <p className="text-center mt-3" style={{ color: "#8B1538", fontFamily: "'Poppins', sans-serif" }}>
            Download official Crescendo&apos;26 rulebooks
          </p>

          <div className="grid md:grid-cols-3 gap-5 md:gap-7 mt-10">
            {rulebooks.map((book) => (
              <article
                key={book.href}
                className="rounded-3xl border-2 p-6 md:p-7 shadow-xl"
                style={{
                  borderColor: "#8B1538",
                  background: "linear-gradient(165deg, #FFF8E7 0%, #FFE5B4 100%)",
                }}
              >
                <h2
                  className="text-xl font-bold"
                  style={{ color: "#6B0F1A", fontFamily: "'Cinzel Decorative', serif" }}
                >
                  {book.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#7B2D0E", fontFamily: "'Poppins', sans-serif" }}>
                  {book.description}
                </p>

                <a
                  href={book.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-full border-2 font-bold text-sm transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: "#8B1538",
                    backgroundColor: "#D4A017",
                    color: "#4a0e00",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Open PDF
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
