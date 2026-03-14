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
      className="py-16 md:py-24 min-h-screen relative"
      style={{
        background: "var(--primary-maroon)",
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Top image + text */}
<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between mb-16 ">

  {/* Image */}
  <div className="flex justify-center md:justify-start">
    <img
      src="/faqs.png"
      alt="FAQ Illustration"
      className="w-[320px] md:w-[420px] opacity-80"
    />
  </div>

  {/* Text */}
  <div className="text-center md:text-left max-w-md">
    <h2
      className="text-3xl md:text-4xl font-bold mb-4"
      style={{ color: "var(--primary-gold)" }}
    >
      Sunna hai munne ke mummy
    </h2>

    <p
      className="text-lg"
      style={{ color: "var(--secondary-cream)" }}
    >
      Got questions? We've got answers! Explore the FAQs below to know everything about Crescendo'26.
    </p>
  </div>

</div>


      {/* FAQ grid + image */}
      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row gap-10 md:gap-8 items-start min-h-[650px]">        {/* FAQ flex-wrap grid */}
        <div className="grid md:grid-cols-2 gap-8 flex-1 z-10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-(--primary-maroon) bg-(--secondary-cream) hover:scale-[1.025] transition-transform duration-200 mb-2"
                style={{
                  boxShadow: isOpen ? "0 0 0 6px var(--primary-gold), 0 8px 32px 0 #d4a01755" : "0 8px 32px 0 #d4a01733",
                  width: '100%',
                  maxWidth: '540px',
                  
                  minWidth: '320px',
                }}
              >
                {/* Top motif bar */}
                <div className="w-full h-4 bg-[repeating-linear-gradient(90deg,var(--primary-gold)_0_16px,var(--primary-maroon)_16px_32px)]" />
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex flex-col gap-2 bg-(--secondary-cream)"
                  style={{ cursor: "pointer" }}
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--primary-maroon) text-(--primary-yellow) text-lg font-bold shadow-lg border-2 border-(--primary-gold)">
                      {index + 1}
                    </span>
                    <span className="text-lg md:text-xl font-bold text-(--primary-maroon) tracking-wide" style={{ fontFamily: "'Poppins', 'Nishtha', serif" }}>
                      {faq.question}
                    </span>
                  </span>
                  <span className="absolute right-6 top-7 flex h-8 w-8 items-center justify-center rounded-full border-2 border-(--primary-gold) text-(--primary-gold) bg-(--secondary-cream) transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  style={{
                    background: 'rgba(247, 176, 43, 0.92)',
                    borderTop: isOpen ? '4px solid var(--primary-maroon)' : '4px solid transparent',
                  }}
                >
                  <div className="px-6 py-5">
                    <p className="text-base md:text-lg text-(--primary-maroon) font-semibold leading-relaxed" style={{ textShadow: "0 2px 8px #fff8e7" }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
                {/* Bottom motif bar */}
                <div className="w-full h-4 bg-[repeating-linear-gradient(90deg,var(--primary-gold)_0_16px,var(--primary-maroon)_16px_32px)]" />
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer call-to-action */}
      <div className="text-center mt-14">
        <p className="text-base md:text-lg text-(--primary-maroon) mb-4 px-2" style={{ opacity: 0.8 }}>
          Still have questions? DM us on Instagram or contact the team!
        </p>
        <button
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 md:px-12 py-4 rounded-full text-lg font-bold text-(--neutral-white) shadow-lg"
          style={{ backgroundImage: "var(--gradient-festival)" }}
        >
          Contact the Crescendo Team
        </button>
      </div>
    </section>
  );
}
