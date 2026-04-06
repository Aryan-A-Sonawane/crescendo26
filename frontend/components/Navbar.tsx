"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/rulebooks", label: "RULEBOOKS" },
  { href: "https://learner.vierp.in/events", label: "BUY TICKETS", external: true },
  { href: "/competitions", label: "COMPETITIONS" },
  { href: "/timeline", label: "TIMELINE" },
  { href: "/partners", label: "PARTNERS" },
  { href: "/team", label: "TEAM" },
];

const navLinkClass =
  "text-[#a71d16] hover:text-white transition-all duration-300 px-1 lg:px-1.5 xl:px-3 py-2 text-sm lg:text-[13px] xl:text-base font-bold tracking-wide hover:scale-105 whitespace-nowrap";

const mobileNavLinkClass =
  "text-[#a71d16] hover:text-white py-2 px-4 text-center text-sm font-bold rounded-full hover:bg-white/30 transition-all";

interface NavbarProps {
  hideAuthButton?: boolean;
}

export default function Navbar({ hideAuthButton = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("crescendo_user");
      if (stored) {
        try { setRegisteredUser(JSON.parse(stored)); }
        catch { localStorage.removeItem("crescendo_user"); }
      } else {
        setRegisteredUser(null);
      }
    };
    checkUser();
    window.addEventListener("crescendo_user_updated", checkUser);
    return () => window.removeEventListener("crescendo_user_updated", checkUser);
  }, []);

  return (
    <nav className="fixed top-4 md:top-10 left-0 right-0 z-50 flex justify-center pt-2 md:pt-6 px-2 sm:px-4 lg:px-4 xl:px-16 2xl:px-24">
      <div className="w-full flex items-center justify-center gap-2 lg:gap-3 xl:gap-4">

        {/* Main Navigation Pill */}
        <div className="w-full lg:w-auto bg-[#e87700] shadow-2xl border-4 border-[#a71d16] rounded-4xl transition-all duration-300">
          <div className="px-4 md:px-8 lg:px-3 xl:px-8">
            <div className="flex items-center justify-center py-2">

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center justify-center space-x-1 lg:space-x-1.5 xl:space-x-4">
                {navLinks.map((link) => (
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={navLinkClass}
                      style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      className={navLinkClass}
                      style={{ fontFamily: "'Cinzel Decorative', serif" }}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </div>

              {/* Mobile/Tablet Menu Button */}
              <div className="lg:hidden w-full flex justify-between items-center py-1">
                <Link 
                  href="/" 
                  className="text-base md:text-lg font-bold text-[#a71d16] pl-2"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  CRESCENDO&apos;26
                </Link>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-[#a71d16] hover:text-white p-1 pr-2"
                >
                  <svg
                    className="h-6 w-6 md:h-7 md:w-7"
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

            {/* Mobile/Tablet Menu Dropdown */}
            <div
              className={`lg:hidden grid transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "grid-rows-[1fr] opacity-100 mt-2"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-6 border-t border-[#a71d16]/20 pt-2 flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={mobileNavLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                        style={{ fontFamily: "'Cinzel Decorative', serif" }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={mobileNavLinkClass}
                        onClick={() => setIsMenuOpen(false)}
                        style={{ fontFamily: "'Cinzel Decorative', serif" }}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
                  {!hideAuthButton &&
                    (registeredUser ? (
                      <Link
                        href="/profile"
                        className="bg-[#8B1538] text-white text-base font-bold py-2 px-4 text-center rounded-full hover:bg-white hover:text-[#8B1538] transition-all mt-2"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ fontFamily: "'Cinzel Decorative', serif" }}
                      >
                        PROFILE
                      </Link>
                    ) : (
                      <Link
                        href="/onboard"
                        className="bg-[#a71d16] text-white text-base font-bold py-2 px-4 text-center rounded-full hover:bg-white hover:text-[#a71d16] transition-all mt-2"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ fontFamily: "'Cinzel Decorative', serif" }}
                      >
                        REGISTER
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Register/Profile Button — outside the pill, to the right */}
        {!hideAuthButton &&
          (registeredUser ? (
            <Link
              href="/profile"
              className="hidden lg:inline-flex items-center text-sm font-bold px-4 py-2 lg:px-5 xl:px-6 xl:py-2.5 rounded-full border-4 shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
              style={{ backgroundColor: "#8B1538", color: "#ffb51d", borderColor: "#8B1538", fontFamily: "'Cinzel Decorative', serif" }}
            >
              PROFILE
            </Link>
          ) : (
            <Link
              href="/onboard"
              className="hidden lg:inline-flex items-center text-sm font-bold px-4 py-2 lg:px-5 xl:px-6 xl:py-2.5 rounded-full border-4 border-[#a71d16] shadow-2xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
              style={{ backgroundColor: "#a71d16", color: "#ffb51d", fontFamily: "'Cinzel Decorative', serif" }}
            >
              REGISTER
            </Link>
          ))}

      </div>
    </nav>
  );
}
