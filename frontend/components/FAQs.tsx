"use client";

import { useState } from "react";

const faqs = [
  {
    question: "When is CRESCENDO'26?",
    answer: "CRESCENDO'26 will be held from 6th to 9th April, 2026."
  },
  {
    question: "How do I register for events?",
    answer: "Click on Buy Tickets from the nav bar, sign in and then purchase yout tickets. Alternatively, click on the Register button, and add events of your interest. Our team will guide you on call."
  },
  {
    question: "Is there a registration fee?",
    answer: "Yes, there is a registration fee that varies depending on the events you choose. Check the Events section for detailed pricing."
  },
  {
    question: "Can I participate in multiple events?",
    answer: "Absolutely! You can participate in as many events as you want, provided there are no time clashes."
  },
  {
    question: "Who can participate?",
    answer: "CRESCENDO'26 is open to all college students with valid student ID cards. Undergraduate students from any college can participate."
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="py-12 md:py-20"
      style={{ background: "linear-gradient(180deg, #21070b 0%, #110206 100%)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p
            className="text-xs sm:text-sm tracking-[0.35em] uppercase mb-3"
            style={{ color: "#FF6B35", fontFamily: "'Poppins', sans-serif" }}
          >
            Help Desk
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#D4A017", fontFamily: "'Cinzel Decorative', serif" }}
          >
            Frequently Asked <span style={{ color: "#FF6B35" }}>Questions</span>
          </h2>
          <div
            className="w-24 h-1 mx-auto mb-6"
            style={{ background: "linear-gradient(to right, #8B1538, #D4A017, #FF6B35)" }}
          ></div>
          <p className="text-base sm:text-lg md:text-xl px-2" style={{ color: "#f6d9ac" }}>
            Got questions? We&apos;ve got answers!
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl md:rounded-2xl overflow-hidden transition-colors"
              style={{
                border: "1px solid rgba(212,160,23,0.45)",
                background: "linear-gradient(145deg, #3a0f16 0%, #2a0a10 100%)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex justify-between items-center transition-colors"
                style={{ backgroundColor: openIndex === index ? "rgba(212,160,23,0.12)" : "transparent" }}
              >
                <span
                  className="text-base md:text-lg font-semibold pr-3 md:pr-4"
                  style={{ color: "#FFF1D2", fontFamily: "'Poppins', sans-serif" }}
                >
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 md:w-6 md:h-6 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  style={{ color: "#D4A017" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <>
                  <div
                    className="px-4 md:px-6 py-3 md:py-4 border-t"
                    style={{
                      background: "rgba(212,160,23,0.09)",
                      borderColor: "rgba(212,160,23,0.35)",
                    }}
                  >
                    <p className="text-sm md:text-base leading-relaxed" style={{ color: "#F6DFC0" }}>
                      {faq.answer}
                    </p>
                  </div>
                  <div className="w-full h-4 bg-[repeating-linear-gradient(90deg,var(--primary-gold)_0_16px,var(--primary-maroon)_16px_32px)]" />
                </>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-sm md:text-base mb-4 px-2" style={{ color: "#f6d9ac" }}>Still have questions?</p>
          <button
            className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(90deg, #8B1538 0%, #D4A017 100%)",
              color: "#FFF8E7",
              border: "1px solid rgba(212,160,23,0.7)",
              fontFamily: "'Cinzel Decorative', serif",
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
