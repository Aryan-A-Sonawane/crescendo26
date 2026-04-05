"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [found, setFound] = useState<{ name: string; email: string; college: string } | null>(null);

  // If already logged in, redirect to select-events
  useEffect(() => {
    const stored = localStorage.getItem("crescendo_user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const next = searchParams.get("next");
        if (next === "select-events") {
          router.replace("/select-events");
        } else {
          setFound(user);
        }
      } catch {
        localStorage.removeItem("crescendo_user");
      }
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (!data.found) {
        setError("");
        // Not registered — clear error and show message inline
        setFound(null);
        setError("__not_found__");
        return;
      }

      // Store and show welcome
      const userData = { name: data.name, email: data.email };
      localStorage.setItem("crescendo_user", JSON.stringify(userData));
      window.dispatchEvent(new Event("crescendo_user_updated"));
      setFound(data);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-24 overflow-hidden"
      style={{ background: "#f3ba35" }}
    >
      {/* Background decoration: corner triangles */}
      <Image src="/corner-triangle.webp" alt="" width={180} height={180}
        className="fixed top-10 right-10 z-0 pointer-events-none hidden lg:block" />
      <Image src="/corner-triangle.webp" alt="" width={180} height={180}
        className="fixed top-10 left-10 z-0 pointer-events-none hidden lg:block"
        style={{ transform: "scaleX(-1)" }} />
      <Image src="/corner-triangle.webp" alt="" width={180} height={180}
        className="fixed bottom-10 right-10 z-0 pointer-events-none hidden lg:block"
        style={{ transform: "scaleY(-1)" }} />
      <Image src="/corner-triangle.webp" alt="" width={180} height={180}
        className="fixed bottom-10 left-10 z-0 pointer-events-none hidden lg:block"
        style={{ transform: "scale(-1)" }} />

      {/* Decorative borders */}
      <div className="fixed top-0 left-0 right-0 h-10 z-9998 pointer-events-none"
        style={{ backgroundColor: "#D4A017", backgroundImage: "url('/border-blue.webp')", backgroundSize: "auto 100%", backgroundRepeat: "repeat-x" }} />
      <div className="fixed bottom-0 left-0 right-0 h-10 z-9998 pointer-events-none"
        style={{ backgroundColor: "#D4A017", backgroundImage: "url('/border-blue.webp')", backgroundSize: "auto 100%", backgroundRepeat: "repeat-x", transform: "scaleY(-1)" }} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-sm rounded-3xl border-4 shadow-2xl overflow-hidden"
        style={{ borderColor: "#a71d16", backgroundColor: "rgba(255, 248, 231, 0.97)" }}
      >
        <div className="px-7 pt-8 pb-7">
          {found ? (
            /* ── Welcome state ── */
            <div className="text-center space-y-4">
              <div className="text-5xl">👋</div>
              <h2
                className="text-xl font-bold"
                style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}
              >
                Welcome back!
              </h2>
              <p className="font-bold text-base" style={{ color: "#8B1538" }}>{found.name}</p>
              <p className="text-xs" style={{ color: "#7B2D0E" }}>
                {found.college}
              </p>
              <p className="text-xs mt-1" style={{ color: "#7B2D0E" }}>
                You&apos;re registered for Crescendo&apos;26 🎉
              </p>

              <div className="pt-3 space-y-2.5">
                <Link
                  href="/select-events"
                  className="block w-full font-bold text-sm py-2.5 rounded-xl border-2 text-center transition-all hover:scale-105 tracking-widest shadow-lg"
                  style={{
                    backgroundColor: "#8B1538",
                    color: "#FFF8E7",
                    borderColor: "#D4A017",
                    fontFamily: "'Cinzel Decorative', serif",
                  }}
                >
                  SELECT EVENTS OF INTEREST
                </Link>
                <Link
                  href="/"
                  className="block w-full text-xs font-bold py-1.5 text-center transition-all hover:underline"
                  style={{ color: "#7B2D0E" }}
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            /* ── Login form ── */
            <>
              <div className="text-center mb-6">
                <div className="text-3xl mb-2">🎪</div>
                <h2
                  className="text-xl font-bold leading-tight"
                  style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}
                >
                  CRESCENDO&apos;26
                </h2>
                <p className="text-xs mt-1" style={{ color: "#7B2D0E" }}>
                  Enter your registered email to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    className="block font-bold text-xs tracking-widest mb-1"
                    style={{ color: "#4a0e00" }}
                  >
                    REGISTERED EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 text-sm rounded-lg outline-none transition-all"
                    style={{
                      backgroundColor: "rgba(255,220,150,0.55)",
                      border: `2px solid ${error && error !== "__not_found__" ? "#cc0000" : "#c45e00"}`,
                      color: "#3a0a00",
                    }}
                  />
                </div>

                {/* Error / not-found message */}
                {error === "__not_found__" ? (
                  <div
                    className="rounded-xl p-3 text-xs text-center"
                    style={{ backgroundColor: "rgba(139,21,56,0.07)", border: "1px solid #8B1538" }}
                  >
                    <p className="font-bold" style={{ color: "#8B1538" }}>
                      No registration found for this email.
                    </p>
                    <p className="mt-1" style={{ color: "#7B2D0E" }}>
                      Want to join?{" "}
                      <Link href="/onboard" className="font-bold underline" style={{ color: "#8B1538" }}>
                        Register here
                      </Link>
                    </p>
                  </div>
                ) : error ? (
                  <p className="text-red-700 text-xs font-bold text-center">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold text-sm py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#8B1538",
                    color: "#FFF8E7",
                    borderColor: "#D4A017",
                    fontFamily: "'Cinzel Decorative', serif",
                  }}
                >
                  {loading ? "CHECKING..." : "CONTINUE"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-xs" style={{ color: "#7B2D0E" }}>
                  Not registered yet?{" "}
                  <Link href="/onboard" className="font-bold underline" style={{ color: "#8B1538" }}>
                    Register here
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#f3ba35" }}>
          <div className="w-8 h-8 rounded-full border-4 border-[#8B1538] border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
