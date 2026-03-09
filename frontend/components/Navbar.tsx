"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/events", label: "EVENTS" },
  { href: "#competitions", label: "COMPETITIONS" },
  { href: "#partner", label: "PARTNER" },
  { href: "#team", label: "TEAM" },
];

const navLinkClass =
  "text-[#a71d16] hover:text-white transition-all duration-300 px-4 py-2 text-2xl font-bold tracking-wide hover:scale-105 font-taiganja";

const mobileNavLinkClass =
  "text-[#a71d16] hover:text-white py-2 px-4 text-center text-base font-bold rounded-full hover:bg-white/30 transition-all font-taiganja";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 md:top-10 left-0 right-0 z-50 flex justify-center pt-2 md:pt-6 px-4">
      <div className="w-full max-w-5xl flex items-center gap-4">

        {/* Main Navigation Pill */}
        <div className="flex-1 bg-[#e87700] shadow-2xl rounded-full border-4 border-[#a71d16]">
          <div className="px-12 sm:px-12 lg:px-16">
            <div className="flex items-center justify-center py-2">

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center justify-center space-x-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={navLinkClass}>
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden w-full flex justify-between items-center">
                <Link href="/" className="text-lg font-bold text-[#a71d16] font-taiganja">
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
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={mobileNavLinkClass}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/register"
                    className="bg-[#a71d16] text-white font-taiganja text-base font-bold py-2 px-4 text-center rounded-full hover:bg-white hover:text-[#a71d16] transition-all mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    REGISTER
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Register Button — outside the pill, to the right */}
        <Link
          href="/register"
          className="hidden md:inline-flex items-center font-taiganja text-lg font-bold px-6 py-3 rounded-full border-4 border-[#a71d16] shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
          style={{ backgroundColor: "#a71d16", color: "#ffb51d" }}
        >
          REGISTER
        </Link>

      </div>
    </nav>
  );
}
