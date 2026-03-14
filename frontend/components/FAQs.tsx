"use client";

import { useState } from "react";

const faqs = [
  {
    question: "When is CRESCENDO'26?",
    answer: "CRESCENDO'26 will be held from March 15-17, 2026. The fest will run for three exciting days filled with various events and performances."
  },
  {
    question: "How do I register for events?",
    answer: "You can register for events through our official website by clicking the 'Register Now' button. Fill in your details, select the events you want to participate in, and complete the payment process."
  },
  {
    question: "Is there a registration fee?",
    answer: "Yes, there is a nominal registration fee that varies depending on the events you choose. Individual event fees and combo packages are available. Check the Events section for detailed pricing."
  },
  {
    question: "Can I participate in multiple events?",
    answer: "Absolutely! You can participate in as many events as you want, provided there are no time clashes. We offer special combo packages for multiple event registrations."
  },
  {
    question: "What prizes can I win?",
    answer: "Winners in each event will receive cash prizes, certificates, and trophies. The prize pool varies by event, with total prizes worth over ₹5 lakhs up for grabs!"
  },
  {
    question: "Is there a dress code?",
    answer: "There is no specific dress code for general attendance. However, some events may have specific requirements (e.g., traditional wear for classical dance). Check individual event guidelines."
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
      style={{
        backgroundColor: "#9f3026",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[rgba(139,21,56,0.08)] border border-[rgba(139,21,56,0.25)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-maroon)]" />
            <span className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[var(--primary-maroon)]">
              Help Desk
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--secondary-burgundy)] text-nishtha mb-4">
            Frequently Asked
            <span className="block gradient-text text-decorative mt-1">Questions</span>
          </h2>
          <div className="flex justify-center mb-4">
            <div className="h-[3px] w-24 sm:w-32 rounded-full bg-[var(--primary-gold)] shadow-[0_0_8px_rgba(212,160,23,0.8)]" />
          </div>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[var(--neutral-dark)] px-2">
            Before you dive into the performances, workshops, and competitions of
            <span className="font-semibold text-[var(--primary-maroon)]"> CRESCENDO&apos;26</span>, here&apos;s everything you need to know.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl md:rounded-3xl border-[3px] border-transparent border-indian bg-[rgba(255,248,240,0.96)] shadow-[0_8px_0_rgba(139,21,56,0.45)] overflow-hidden transition-transform duration-200 hover:-translate-y-1"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex justify-between items-center gap-3 md:gap-4 bg-[rgba(255,248,231,0.95)]"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="mt-1 inline-flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-[var(--primary-maroon)] text-[var(--primary-yellow)] text-sm md:text-base font-bold shadow-[0_3px_0_rgba(107,15,26,0.8)]">
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg font-semibold text-[var(--neutral-black)] pr-2 md:pr-4">
                      {faq.question}
                    </span>
                  </div>
                  <span
                    className={`flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border border-[var(--primary-maroon)] text-[var(--primary-maroon)] bg-[rgba(243,186,53,0.1)] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
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
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 md:px-6 py-3 md:py-4 bg-[rgba(255,248,240,0.98)] border-t border-[rgba(139,21,56,0.15)]">
                    <p className="text-sm md:text-base text-[var(--neutral-dark)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer call-to-action */}
        <div className="text-center mt-10 md:mt-14">
          <p className="text-sm md:text-base text-[var(--neutral-dark)] mb-4 px-2">
            Still have questions about events, registrations, or stay?
          </p>
          <button
            className="inline-flex items-center justify-center w-full sm:w-auto px-7 md:px-9 py-3.5 md:py-4 rounded-full text-sm md:text-base font-semibold text-[var(--neutral-white)] shadow-[0_10px_0_#6B0F1A] hover:translate-y-[2px] hover:shadow-[0_6px_0_#6B0F1A] transition-transform duration-150"
            style={{ backgroundImage: "var(--gradient-festival)" }}
          >
            Contact the Crescendo Team
          </button>
        </div>
      </div>
    </section>
  );
}
