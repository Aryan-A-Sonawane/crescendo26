"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-14 px-4">
      <div className="w-full max-w-4xl">
        {/* Main Navigation */}
        <div className="bg-[#e87700] shadow-2xl rounded-full border-4 border-[#a71d16]">
          <div className="px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col items-center py-4">
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center justify-center space-x-3">
                <Link 
                  href="#home" 
                  className="text-[#a71d16] hover:text-white transition-all duration-300 px-3 py-2 text-lg font-bold tracking-wide hover:scale-105"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  HOME
                </Link>
                <span className="text-[#a71d16] text-xl">*</span>
                <Link 
                  href="#events" 
                  className="text-[#a71d16] hover:text-white transition-all duration-300 px-3 py-2 text-lg font-bold tracking-wide hover:scale-105"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  EVENTS
                </Link>
                <span className="text-[#a71d16] text-xl">*</span>
                <Link 
                  href="#competitions" 
                  className="text-[#a71d16] hover:text-white transition-all duration-300 px-3 py-2 text-lg font-bold tracking-wide hover:scale-105"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  COMPETITIONS
                </Link>
                <span className="text-[#a71d16] text-xl">*</span>
                <Link 
                  href="#partner" 
                  className="text-[#a71d16] hover:text-white transition-all duration-300 px-3 py-2 text-lg font-bold tracking-wide hover:scale-105"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  PARTNER
                </Link>
                <span className="text-[#a71d16] text-xl">*</span>
                <Link 
                  href="#team" 
                  className="text-[#a71d16] hover:text-white transition-all duration-300 px-3 py-2 text-lg font-bold tracking-wide hover:scale-105"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  TEAM
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden w-full flex justify-between items-center">
                <Link 
                  href="/" 
                  className="text-lg font-bold text-[#a71d16]"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  CRESCENDO&apos;26
                </Link>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-[#a71d16] hover:text-white p-2"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {isMenuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden pb-4 border-t border-[#a71d16]/20">
                <div className="flex flex-col space-y-2 pt-4">
                  <Link 
                    href="#home" 
                    className="text-[#a71d16] hover:text-white py-2 px-4 text-center text-base font-bold rounded-full hover:bg-white/30 transition-all"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    HOME
                  </Link>
                  <Link 
                    href="#events" 
                    className="text-[#a71d16] hover:text-white py-2 px-4 text-center text-base font-bold rounded-full hover:bg-white/30 transition-all"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    EVENTS
                  </Link>
                  <Link 
                    href="#competitions" 
                    className="text-[#a71d16] hover:text-white py-2 px-4 text-center text-base font-bold rounded-full hover:bg-white/30 transition-all"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    COMPETITIONS
                  </Link>
                  <Link 
                    href="#partner" 
                    className="text-[#a71d16] hover:text-white py-2 px-4 text-center text-base font-bold rounded-full hover:bg-white/30 transition-all"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    PARTNER
                  </Link>
                  <Link 
                    href="#team" 
                    className="text-[#a71d16] hover:text-white py-2 px-4 text-center text-base font-bold rounded-full hover:bg-white/30 transition-all"
                    style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    TEAM
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
