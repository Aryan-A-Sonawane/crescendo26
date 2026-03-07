export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-purple-600 font-nistha">CRESCENDO&apos;26</span>
          </h2>
          <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              CRESCENDO is the premier inter-college cultural festival that brings together 
              talented students from across the region to celebrate art, music, dance, and innovation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With a legacy of excellence spanning years, CRESCENDO has become the platform 
              where creativity meets competition, and friendships are forged across college boundaries.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Join us for three days of electrifying performances, challenging competitions, 
              celebrity performances, and unforgettable experiences that will stay with you forever.
            </p>

            <div className="pt-4">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cultural Events</h3>
              <p className="text-gray-600">Dance, music, drama, and more</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitions</h3>
              <p className="text-gray-600">Win exciting prizes</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Celebrity Shows</h3>
              <p className="text-gray-600">Live performances by stars</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Networking</h3>
              <p className="text-gray-600">Connect with peers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
