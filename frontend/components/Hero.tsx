export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-[#f3ba35] pt-24 md:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
        <div className="space-y-6 md:space-y-8">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900">
            Welcome to{"\ "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600 font-nistha">
              CRESCENDO&apos;26
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-2">
            The Ultimate Inter-College Cultural Fest
          </p>

          {/* Date & Venue */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-sm sm:text-base md:text-lg text-gray-700">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>March 15-17, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Your College Campus</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-6 md:pt-8 px-4">
            <button className="w-full sm:w-auto bg-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-purple-700 transition-all hover:scale-105 shadow-lg">
              Register Now
            </button>
            <button className="w-full sm:w-auto border-2 border-purple-600 text-purple-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-purple-50 transition-all">
              View Events
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto pt-8 md:pt-16">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">50+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 md:mt-2">Colleges</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">100+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 md:mt-2">Events</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">5000+</div>
              <div className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 md:mt-2">Participants</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
