"use client";

import { useState } from "react";

const eventCategories = [
  {
    category: "Music",
    events: [
      { name: "Battle of Bands", description: "Show your musical prowess", icon: "🎸" },
      { name: "Solo Singing", description: "Mesmerize with your voice", icon: "🎤" },
      { name: "Classical Vocals", description: "Traditional melodies", icon: "🎵" },
    ]
  },
  {
    category: "Dance",
    events: [
      { name: "Group Dance", description: "Synchronized perfection", icon: "💃" },
      { name: "Solo Dance", description: "Express yourself", icon: "🕺" },
      { name: "Street Dance", description: "Urban moves", icon: "🔥" },
    ]
  },
  {
    category: "Drama",
    events: [
      { name: "Street Play", description: "Theatre with a message", icon: "🎭" },
      { name: "Mono Acting", description: "One person, many emotions", icon: "🎬" },
      { name: "Skit", description: "Short and impactful", icon: "🎪" },
    ]
  },
  {
    category: "Literary",
    events: [
      { name: "Debate", description: "Battle of words", icon: "💬" },
      { name: "Poetry Slam", description: "Rhythm and rhyme", icon: "📝" },
      { name: "Creative Writing", description: "Pen your thoughts", icon: "✍️" },
    ]
  },
];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-purple-600">Events</span>
          </h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of competitions and showcase your talents
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {eventCategories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeCategory === index
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-purple-50"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {eventCategories[activeCategory].events.map((event, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
            >
              <div className="text-5xl mb-4">{event.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.name}</h3>
              <p className="text-gray-600 mb-6">{event.description}</p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                View Details
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-lg">
            View All Events
          </button>
        </div>
      </div>
    </section>
  );
}
