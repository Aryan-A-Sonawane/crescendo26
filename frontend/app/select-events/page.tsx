"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EventsInterest from "@/components/EventsInterest";

interface StoredUser {
  name: string;
  email: string;
}

export default function SelectEventsPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<{ user: StoredUser | null; checked: boolean }>({
    user: null,
    checked: false,
  });
  const { user, checked } = pageState;
  const [done, setDone] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("crescendo_user");
    let parsedUser: StoredUser | null = null;
    if (stored) {
      try {
        parsedUser = JSON.parse(stored);
      } catch {
        localStorage.removeItem("crescendo_user");
      }
    }
    setPageState({ user: parsedUser, checked: true });
  }, []);

  // Redirect to login if not registered
  useEffect(() => {
    if (checked && !user) {
      router.replace("/login?next=select-events");
    }
  }, [checked, user, router]);

  if (!checked || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f3ba35" }}>
        <div className="w-8 h-8 rounded-full border-4 border-[#8B1538] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: "#f3ba35" }}
      >
        <div className="text-6xl mb-4">🎊</div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}
        >
          All Done!
        </h2>
        <p className="text-sm mb-6" style={{ color: "#7B2D0E" }}>
          Your event interests have been saved. Our team will reach out!
        </p>
        <Link
          href="/"
          className="inline-block font-bold text-sm px-8 py-3 rounded-full border-2 transition-all hover:scale-105 shadow-lg tracking-widest"
          style={{
            backgroundColor: "#8B1538",
            color: "#FFF8E7",
            borderColor: "#D4A017",
            fontFamily: "'Cinzel Decorative', serif",
          }}
        >
          BACK TO HOME
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full py-24 px-4 flex flex-col items-center"
      style={{ background: "#f3ba35" }}
    >
      {/* Back link */}
      <div className="w-full max-w-lg mb-4 flex justify-start">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-all hover:scale-105"
          style={{ backgroundColor: "#8B1538", color: "#FFF8E7", borderColor: "#D4A017" }}
        >
          ← Home
        </Link>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg rounded-3xl border-4 p-6 shadow-2xl overflow-y-auto"
        style={{
          borderColor: "#a71d16",
          backgroundColor: "rgba(255, 248, 231, 0.96)",
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        <EventsInterest
          email={user.email}
          name={user.name}
          onComplete={(skipped) => {
            if (skipped) {
              router.push("/");
            } else {
              setDone(true);
            }
          }}
        />
      </div>
    </div>
  );
}
