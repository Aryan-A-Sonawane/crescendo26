"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface StoredUser {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [state] = useState<{ user: StoredUser | null; checked: boolean }>(() => {
    if (typeof window === "undefined") {
      return { user: null, checked: false };
    }

    const stored = localStorage.getItem("crescendo_user");
    if (!stored) {
      return { user: null, checked: true };
    }

    try {
      return { user: JSON.parse(stored), checked: true };
    } catch {
      localStorage.removeItem("crescendo_user");
      return { user: null, checked: true };
    }
  });

  useEffect(() => {
    if (state.checked && !state.user) {
      router.replace("/login");
    }
  }, [state.checked, state.user, router]);

  const handleLogout = () => {
    localStorage.removeItem("crescendo_user");
    window.dispatchEvent(new Event("crescendo_user_updated"));
    router.push("/");
  };

  if (!state.checked || !state.user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('/blue-background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-8 h-8 rounded-full border-4 border-[#8B1538] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/blue-background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      <div className="sunray" aria-hidden="true" />

      <div
        className="fixed top-0 left-0 right-0 h-10 z-40 pointer-events-none"
        style={{
          backgroundColor: "#D4A017",
          backgroundImage: "url('/border-blue.webp')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
        }}
      />
      <div
        className="fixed bottom-0 left-0 right-0 h-10 z-40 pointer-events-none"
        style={{
          backgroundColor: "#D4A017",
          backgroundImage: "url('/border-blue.webp')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          transform: "scaleY(-1)",
        }}
      />
      <div className="fixed top-0 left-0 bottom-0 w-10 z-40 pointer-events-none overflow-hidden hidden lg:block">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vh",
            height: "40px",
            transformOrigin: "top left",
            transform: "rotate(90deg) translateY(-100%)",
            backgroundColor: "#D4A017",
            backgroundImage: "url('/border-blue.webp')",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>
      <div className="fixed top-0 right-0 bottom-0 w-10 z-40 pointer-events-none overflow-hidden hidden lg:block">
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100vh",
            height: "40px",
            transformOrigin: "top right",
            transform: "rotate(-90deg) translateY(-100%)",
            backgroundColor: "#D4A017",
            backgroundImage: "url('/border-blue.webp')",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>

      <Image
        src="/corner-triangle.webp"
        alt=""
        width={250}
        height={250}
        className="fixed top-10 right-10 z-40 pointer-events-none hidden lg:block"
      />
      <Image
        src="/corner-triangle.webp"
        alt=""
        width={250}
        height={250}
        className="fixed top-10 left-10 z-40 pointer-events-none hidden lg:block"
        style={{ transform: "scaleX(-1)" }}
      />
      <Image
        src="/corner-triangle.webp"
        alt=""
        width={250}
        height={250}
        className="fixed bottom-10 right-10 z-40 pointer-events-none hidden lg:block"
        style={{ transform: "scaleY(-1)" }}
      />
      <Image
        src="/corner-triangle.webp"
        alt=""
        width={250}
        height={250}
        className="fixed bottom-10 left-10 z-40 pointer-events-none hidden lg:block"
        style={{ transform: "scale(-1)" }}
      />

      <main className="relative z-30 pt-36 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}
            >
              PROFILE
            </h1>
            <p className="text-sm mt-2" style={{ color: "#7B2D0E" }}>
              Welcome back, <span className="font-bold">{state.user.name}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section
              className="lg:col-span-1 rounded-3xl border-4 p-5 shadow-2xl"
              style={{ borderColor: "#a71d16", backgroundColor: "rgba(255, 248, 231, 0.96)" }}
            >
              <h2
                className="text-lg font-bold mb-3"
                style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}
              >
                YOUR TICKETS
              </h2>
              <div className="rounded-2xl border-2 p-4" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.65)" }}>
                <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#8B1538" }}>
                  Upcoming
                </p>
                <p className="text-sm mt-2" style={{ color: "#7B2D0E" }}>
                  Purchased tickets will be shown here.
                </p>
              </div>
            </section>

            <section
              className="lg:col-span-2 rounded-3xl border-4 p-5 shadow-2xl"
              style={{ borderColor: "#a71d16", backgroundColor: "rgba(255, 248, 231, 0.96)" }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}
              >
                ACTIONS
              </h2>

              <div className="space-y-3 max-w-md">
                <Link
                  href="/select-events"
                  className="block w-full font-bold text-sm py-3 rounded-xl border-2 text-center transition-all hover:scale-105 tracking-widest shadow-lg"
                  style={{
                    backgroundColor: "#8B1538",
                    color: "#FFF8E7",
                    borderColor: "#D4A017",
                    fontFamily: "'Cinzel Decorative', serif",
                  }}
                >
                  SELECT / EDIT YOUR EVENTS
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full font-bold text-sm py-3 rounded-xl border-2 text-center transition-all hover:scale-105 tracking-widest shadow-lg"
                  style={{
                    backgroundColor: "#D4A017",
                    color: "#4a0e00",
                    borderColor: "#8B1538",
                    fontFamily: "'Cinzel Decorative', serif",
                  }}
                >
                  LOGOUT
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
