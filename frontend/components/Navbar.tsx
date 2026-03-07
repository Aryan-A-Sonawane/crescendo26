"use client";

import React, { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#home", label: "HOME" },
  { href: "#events", label: "EVENTS" },
  { href: "#competitions", label: "COMPETITIONS" },
  { href: "#partner", label: "PARTNER" },
  { href: "#team", label: "TEAM" },
];

const navLinkClass =
  "text-[#a71d16] hover:text-white transition-all duration-300 px-4 py-2 text-2xl font-bold tracking-wide hover:scale-105";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-2 md:px-4">
      <div className="w-full md:max-w-5xl max-w-[95%]">
        {/* Main Navigation */}
        <div className="bg-[#e87700] shadow-2xl rounded-3xl md:rounded-full border-3 md:border-4 border-[#a71d16]">
          <div className="px-3 py-2 md:px-8 lg:px-16 md:py-0">
            <div className="flex flex-col md:items-center py-0 md:py-2">

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center justify-center space-x-3">
                {navLinks.map((link, index) => (
                  <React.Fragment key={link.href}>
                    <Link 
                      href={link.href} 
                      className={navLinkClass}
                      style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    >
                      {link.label}
                    </Link>
                    {index < navLinks.length - 1 && (
                      <span className="text-[#a71d16] text-xl">*</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden w-full flex justify-between items-center py-1">
                <Link 
                  href="/" 
                  className="text-sm font-bold text-[#a71d16]"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  CRESCENDO&apos;26
                </Link>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-[#a71d16] hover:text-white p-1"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
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
              <div className="md:hidden pb-2 border-t border-[#a71d16]/20 mt-2">
                <div className="flex flex-col space-y-1 pt-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-[#a71d16] hover:text-white py-1.5 px-3 text-center text-sm font-bold rounded-full hover:bg-white/30 transition-all"
                      style={{ fontFamily: "'Cinzel Decorative', serif" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
