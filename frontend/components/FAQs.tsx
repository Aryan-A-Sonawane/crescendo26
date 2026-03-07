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
    question: "Are there accommodation facilities?",
    answer: "Yes, we provide accommodation facilities for outstation participants. You need to opt for accommodation during registration. Limited seats are available on a first-come, first-served basis."
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
    answer: "CRESCENDO'26 is open to all college students with valid student ID cards. Both undergraduate and postgraduate students from any college can participate."
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-12 md:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-purple-600">Questions</span>
          </h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
            Got questions? We&apos;ve got answers!
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden hover:border-purple-300 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 md:px-6 py-4 md:py-5 text-left flex justify-between items-center bg-white hover:bg-purple-50 transition-colors"
              >
                <span className="text-base md:text-lg font-semibold text-gray-900 pr-3 md:pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 md:w-6 md:h-6 text-purple-600 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
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
                <div className="px-4 md:px-6 py-3 md:py-4 bg-purple-50 border-t border-purple-100">
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <p className="text-sm md:text-base text-gray-600 mb-4 px-2">Still have questions?</p>
          <button className="w-full sm:w-auto bg-purple-600 text-white px-6 md:px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
