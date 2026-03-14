"use client";

import Image from "next/image";

const sponsors = [
  {
    tier: "Title Sponsor",
    name: "To be announced",
    description: "Our title sponsor for CRESCENDO'26 will be revealed soon.",
    badgeColor: "bg-[var(--primary-maroon)]",
  },
  {
    tier: "Powered By",
    name: "To be announced",
    description: "Stay tuned for our powered-by partner announcement.",
    badgeColor: "bg-[var(--accent-pink)]",
  },
  {
    tier: "Hospitality Partner",
    name: "To be announced",
    description: "Our hospitality partner details will be announced shortly.",
    badgeColor: "bg-[var(--accent-green)]",
  },
  {
    tier: "Food & Beverage Partner",
    name: "To be announced",
    description: "Food & beverage partners will be confirmed closer to the fest.",
    badgeColor: "bg-[var(--primary-orange)]",
  },
  {
    tier: "Merchandise Partner",
    name: "To be announced",
    description: "Official CRESCENDO'26 merch partner coming soon.",
    badgeColor: "bg-[var(--accent-blue)]",
  },
  {
    tier: "Tech Partner",
    name: "To be announced",
    description: "Our tech partner will be announced as we approach the fest.",
    badgeColor: "bg-[var(--accent-turquoise)]",
  },
];

export default function Partners() {
  return (
    <section
      id="partner"
      className="py-12 md:py-20"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,248,231,0.98) 0%, #FFE5B4 40%, #F3BA35 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[rgba(139,21,56,0.08)] border border-[rgba(139,21,56,0.25)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-maroon)]" />
            <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary-maroon)]">
              Our Partners
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--secondary-burgundy)] text-nishtha mb-4">
            Sponsors of the
            <span className="block gradient-text text-decorative mt-1">Indian Odyssey</span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[var(--neutral-dark)] px-2">
            CRESCENDO&apos;26 is brought to life by brands that celebrate
            India&apos;s colour, rhythm, and youth energy.
          </p>
        </div>

        {/* Sponsor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="relative rounded-2xl md:rounded-3xl border-[3px] border-transparent border-indian bg-[rgba(255,248,240,0.96)] shadow-[0_10px_0_rgba(107,15,26,0.7)] overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
            >
              {/* Tier badge */}
              <div className="absolute -top-3 left-4 flex items-center gap-2">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold text-[var(--neutral-white)] shadow-[0_3px_0_rgba(62,59,54,0.6)] ${sponsor.badgeColor}`}
                >
                  {sponsor.tier}
                </div>
              </div>

              {/* Content */}
              <div className="pt-6 pb-4 px-4 md:px-5 lg:px-6 flex-1 flex flex-col">
                {/* Logo placeholder */}
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative h-16 w-40 sm:h-20 sm:w-48 rounded-xl border-2 border-[rgba(212,160,23,0.7)] bg-[radial-gradient(circle_at_top,_#FFF8E7,_#F7B32B)] flex items-center justify-center overflow-hidden">
                    {/* If you have real logos, drop an <Image> here */}
                    <span className="text-sm sm:text-base font-bold text-[var(--primary-maroon)] text-center px-2">
                      {sponsor.name}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-[var(--neutral-dark)] text-center leading-relaxed mb-3">
                  {sponsor.description}
                </p>
              </div>

              {/* Decorative footer strip */}
              <div className="h-2 w-full bg-[var(--gradient-festival)]" />
            </div>
          ))}
        </div>

        {/* CTA for potential sponsors */}
        <div className="text-center mt-10 md:mt-14">
          <p className="text-xs sm:text-sm md:text-base text-[var(--neutral-dark)] mb-3 px-2">
            Want to partner with CRESCENDO&apos;26 and reach thousands of students?
          </p>
          <a
            href="mailto:crescendo.partners@example.com?subject=Crescendo%2726%20Sponsorship%20Enquiry"
            className="inline-flex items-center justify-center px-7 md:px-9 py-3.5 md:py-4 rounded-full text-sm md:text-base font-semibold text-[var(--neutral-white)] shadow-[0_10px_0_#6B0F1A] hover:translate-y-[2px] hover:shadow-[0_6px_0_#6B0F1A] transition-transform duration-150"
            style={{ backgroundImage: "var(--gradient-sunset)" }}
          >
            Become a Sponsor
          </a>
        </div>
      </div>
    </section>
  );
}
