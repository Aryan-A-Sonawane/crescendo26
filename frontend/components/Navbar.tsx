"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              CRESCENDO&apos;26
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="#home" className="text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link href="#events" className="text-gray-700 hover:text-purple-600 transition-colors">
              Events
            </Link>
            <Link href="#faqs" className="text-gray-700 hover:text-purple-600 transition-colors">
              FAQs
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors">
              Register Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600"
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
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-4">
              <Link href="#home" className="text-gray-700 hover:text-purple-600">
                Home
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-purple-600">
                About
              </Link>
              <Link href="#events" className="text-gray-700 hover:text-purple-600">
                Events
              </Link>
              <Link href="#faqs" className="text-gray-700 hover:text-purple-600">
                FAQs
              </Link>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 w-full">
                Register Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
