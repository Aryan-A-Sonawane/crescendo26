"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import QRCode from "qrcode";

interface StoredUser {
  name: string;
  email: string;
  phone?: string;
  college?: string;
}

interface ProfileDetails {
  phone: string;
  college: string;
}

interface ParticipantTicket {
  participantName: string;
  email: string;
  phone: string | null;
  qrToken: string;
}

interface PurchasedEvent {
  id: number;
  eventId: number | null;
  eventName: string;
  isPlayed: boolean;
  playedAt: string | null;
  playedByEmail: string | null;
  eventStatus: "NOT_STARTED" | "STARTED" | "PAUSED" | "COMPLETED";
  venue: string | null;
}

function prettyEventStatus(status: PurchasedEvent["eventStatus"]) {
  if (status === "STARTED") return "Live";
  if (status === "PAUSED") return "Paused";
  if (status === "COMPLETED") return "Completed";
  return "Not Started";
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
  const [ticket, setTicket] = useState<ParticipantTicket | null>(null);
  const [purchasedEvents, setPurchasedEvents] = useState<PurchasedEvent[]>([]);
  const [ticketQr, setTicketQr] = useState("");
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>(() => ({
    phone: state.user?.phone || "",
    college: state.user?.college || "",
  }));
  const [showDashboardAccess, setShowDashboardAccess] = useState(false);
  const [dashboardRoute, setDashboardRoute] = useState("/event-dashboard");
  const [dashboardLabel, setDashboardLabel] = useState("ACCESS EVENT DASHBOARD");
  const lastQrTokenRef = useRef("");

  useEffect(() => {
    if (state.checked && !state.user) {
      router.replace("/login");
    }
  }, [state.checked, state.user, router]);

  useEffect(() => {
    if (!state.user) return;

    let active = true;

    const loadProfileData = async () => {
      try {
        const [accessRes, ticketsRes] = await Promise.all([
          fetch(`/api/dashboard/me?email=${encodeURIComponent(state.user!.email)}`),
          fetch(`/api/profile/tickets?email=${encodeURIComponent(state.user!.email)}`),
        ]);

        const accessData = await accessRes.json();
        const ticketsData = await ticketsRes.json();

        if (!active) return;

        if (accessRes.ok) {
          setShowDashboardAccess(Boolean(accessData.showDashboardAccess));
          if (accessData.isSuperAdmin) {
            setDashboardRoute("/event-dashboard");
            setDashboardLabel("ACCESS SUPER ADMIN DASHBOARD");
          } else {
            setDashboardRoute("/coordinator-dashboard");
            setDashboardLabel("ACCESS COORDINATOR DASHBOARD");
          }
        }

        // Keep session + UI details in sync with DB on every profile refresh.
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: state.user!.email }),
        });
        const loginData = await loginRes.json().catch(() => ({}));
        if (active && loginRes.ok && loginData?.found) {
          const nextPhone = String(loginData.phone || "");
          const nextCollege = String(loginData.college || "");
          setProfileDetails({ phone: nextPhone, college: nextCollege });

          const existing = localStorage.getItem("crescendo_user");
          let parsed: StoredUser = { name: state.user!.name, email: state.user!.email };
          if (existing) {
            try {
              parsed = JSON.parse(existing) as StoredUser;
            } catch {
              // Ignore parse error and overwrite with known-safe values.
            }
          }

          localStorage.setItem(
            "crescendo_user",
            JSON.stringify({
              ...parsed,
              name: loginData.name || parsed.name,
              email: loginData.email || parsed.email,
              phone: nextPhone,
              college: nextCollege,
            })
          );
        }

        if (ticketsRes.ok && ticketsData.ticket) {
          setTicket(ticketsData.ticket as ParticipantTicket);
          setPurchasedEvents(Array.isArray(ticketsData.events) ? (ticketsData.events as PurchasedEvent[]) : []);

          const nextQrToken = String(ticketsData.ticket.qrToken || "");
          if (nextQrToken && nextQrToken !== lastQrTokenRef.current) {
            const dataUrl = await QRCode.toDataURL(nextQrToken, {
              width: 180,
              margin: 1,
            });
            if (!active) return;
            setTicketQr(dataUrl);
            lastQrTokenRef.current = nextQrToken;
          }
        }
      } catch (error) {
        console.error("[profile:load]", error);
      }
    };

    void loadProfileData();

    const intervalId = window.setInterval(() => {
      void loadProfileData();
    }, 8000);

    const onFocus = () => {
      void loadProfileData();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadProfileData();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [state.user]);

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
          backgroundImage: "url('/blue-background.jpeg')",
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
        backgroundImage: "url('/blue-background.jpeg')",
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
          backgroundImage: "url('/border-blue.png')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
        }}
      />
      <div
        className="fixed bottom-0 left-0 right-0 h-10 z-40 pointer-events-none"
        style={{
          backgroundColor: "#D4A017",
          backgroundImage: "url('/border-blue.png')",
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
            backgroundImage: "url('/border-blue.png')",
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
            backgroundImage: "url('/border-blue.png')",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>

      <Image
        src="/corner-triangle.png"
        alt=""
        width={250}
        height={250}
        className="fixed top-10 right-10 z-40 pointer-events-none hidden lg:block"
      />
      <Image
        src="/corner-triangle.png"
        alt=""
        width={250}
        height={250}
        className="fixed top-10 left-10 z-40 pointer-events-none hidden lg:block"
        style={{ transform: "scaleX(-1)" }}
      />
      <Image
        src="/corner-triangle.png"
        alt=""
        width={250}
        height={250}
        className="fixed bottom-10 right-10 z-40 pointer-events-none hidden lg:block"
        style={{ transform: "scaleY(-1)" }}
      />
      <Image
        src="/corner-triangle.png"
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
                YOUR TICKET
              </h2>
              <div className="space-y-3">
                {!ticket ? (
                  <div className="rounded-2xl border-2 p-4" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.65)" }}>
                    <p className="text-sm" style={{ color: "#7B2D0E" }}>
                      No ticket mapped to your email yet.
                    </p>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl border-2 p-4"
                    style={{
                      borderColor: "#D4A017",
                      backgroundColor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#8B1538" }}>
                      Participant Identity QR
                    </p>
                    <p className="text-sm mt-1 font-semibold" style={{ color: "#4a0e00" }}>
                      {ticket.participantName}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#7B2D0E" }}>
                      {ticket.phone || "Phone not available"}
                    </p>
                    {ticketQr && (
                      <Image
                        src={ticketQr}
                        alt="Participant QR"
                        width={180}
                        height={180}
                        unoptimized
                        className="mt-2 h-[180px] w-[180px] rounded border"
                      />
                    )}
                    <p className="text-xs mt-2" style={{ color: "#2D6A4F" }}>
                      Scan this once at desk. Event eligibility and play status are verified by email.
                    </p>
                  </div>
                )}
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

              <div className="rounded-2xl border-2 p-4 mb-4" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.7)" }}>
                <h3 className="text-sm font-bold mb-2" style={{ color: "#8B1538" }}>
                  YOUR DETAILS
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="inline-flex w-fit items-center rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }}>
                    College: {profileDetails.college || "Not provided"}
                  </div>
                  <div className="inline-flex w-fit items-center rounded-full px-2 py-1 text-[11px] font-bold" style={{ backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}>
                    Mobile: {profileDetails.phone || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 p-4 mb-4" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.7)" }}>
                <h3 className="text-sm font-bold mb-2" style={{ color: "#8B1538" }}>
                  PURCHASED EVENTS
                </h3>
                <div className="max-h-[36vh] overflow-auto pr-1 space-y-2">
                  {purchasedEvents.length === 0 ? (
                    <p className="text-sm" style={{ color: "#7B2D0E" }}>
                      No event purchases found yet.
                    </p>
                  ) : (
                    purchasedEvents.map((event) => (
                      <div key={event.id} className="rounded-xl border px-3 py-2" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,248,231,0.8)" }}>
                        <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#8B1538" }}>
                          {event.eventName}
                        </p>
                        <p className="text-xs mt-1" style={{ color: event.isPlayed ? "#8B1538" : "#2D6A4F" }}>
                          Participation: {event.isPlayed ? "Played" : "Not Played"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold"
                            style={{
                              backgroundColor: event.eventStatus === "STARTED" ? "#dcfce7" : "#fef9c3",
                              color: event.eventStatus === "STARTED" ? "#166534" : "#854d0e",
                              border: `1px solid ${event.eventStatus === "STARTED" ? "#86efac" : "#fde68a"}`,
                            }}
                          >
                            {prettyEventStatus(event.eventStatus)}
                          </span>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold"
                            style={{
                              backgroundColor: "#eff6ff",
                              color: "#1e40af",
                              border: "1px solid #bfdbfe",
                            }}
                          >
                            Location: {event.venue || "TBA"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

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

                {showDashboardAccess && (
                  <Link
                    href={dashboardRoute}
                    className="block w-full font-bold text-sm py-3 rounded-xl border-2 text-center transition-all hover:scale-105 tracking-widest shadow-lg"
                    style={{
                      backgroundColor: "#1B4965",
                      color: "#FFF8E7",
                      borderColor: "#D4A017",
                      fontFamily: "'Cinzel Decorative', serif",
                    }}
                  >
                    {dashboardLabel}
                  </Link>
                )}

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
