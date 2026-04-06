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
  const activeUser = state.user;

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
          backgroundColor: "#F0A500",
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
        backgroundColor: "#F0A500",
      }}
    >
      <Navbar hideAuthButton />

      <main className="relative z-30 pt-40 md:pt-44 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <section
            className="rounded-[24px] p-1 mb-6 shadow-2xl"
            style={{
              backgroundColor: "#8B1538",
              boxShadow: "0 12px 32px rgba(139, 21, 56, 0.35)",
            }}
          >
            <div
              className="relative rounded-[20px] px-5 py-5 md:px-7 md:py-6 flex flex-col md:flex-row md:items-center gap-5 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #751010 0%, #A81818 45%, #C0392B 100%)",
                border: "2px solid rgba(212, 160, 23, 0.35)",
              }}
            >
              <div
                className="h-20 w-20 md:h-24 md:w-24 rounded-full p-0.75 shrink-0"
                style={{
                  background:
                    "conic-gradient(#D4A017 0%, #FF6B35 25%, #D4A017 50%, #FF6B35 75%, #D4A017 100%)",
                }}
              >
                <div
                  className="h-full w-full rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #651010, #9B1C1C)",
                    color: "#D4A017",
                  }}
                >
                  {(activeUser?.name ?? "")
                    .split(" ")
                    .map((word) => word[0] || "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              </div>

              <div className="flex-1">
                <h1
                  className="text-2xl md:text-4xl font-black tracking-[0.25em]"
                  style={{ color: "#FFFFFF", fontFamily: "'Cinzel Decorative', serif" }}
                >
                  PROFILE
                </h1>
                <p className="mt-1 text-sm md:text-base font-semibold" style={{ color: "#F7B32B" }}>
                  Welcome back, {activeUser?.name}
                </p>
                <p className="text-xs md:text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {activeUser?.email}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "#F7B32B", border: "1px solid rgba(247,179,43,0.45)", backgroundColor: "rgba(0,0,0,0.22)" }}
                  >
                    ✦ Registered Participant
                  </span>
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: "#F7B32B", border: "1px solid rgba(247,179,43,0.45)", backgroundColor: "rgba(0,0,0,0.22)" }}
                  >
                    Crescendo&apos;26
                  </span>
                </div>
              </div>

              <div
                className="absolute bottom-0 left-0 right-0 h-1.5"
                style={{
                  background:
                    "repeating-linear-gradient(90deg, #D4A017 0, #D4A017 8px, #FF6B35 8px, #FF6B35 16px)",
                  opacity: 0.45,
                }}
              />
            </div>
          </section>

          <div className="text-center mb-4">
            <h2
              className="text-xl md:text-2xl font-bold tracking-[0.28em]"
              style={{ color: "#8B1538", fontFamily: "'Cinzel Decorative', serif" }}
            >
              MY TICKET & EVENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <section className="xl:col-span-2">
              <div
                className="w-full rounded-[18px] overflow-hidden border-2 shadow-2xl"
                style={{
                  backgroundColor: "#FFF8E7",
                  borderColor: "rgba(139, 21, 56, 0.22)",
                  boxShadow: "0 10px 26px rgba(139, 21, 56, 0.2)",
                }}
              >
                <div className="relative px-5 py-4" style={{ backgroundColor: "#8B1538" }}>
                  <p
                    className="text-sm md:text-base font-bold uppercase tracking-[0.22em]"
                    style={{ color: "#FFFFFF", fontFamily: "'Cinzel Decorative', serif" }}
                  >
                    Participant Ticket
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] font-bold" style={{ color: "#F7B32B" }}>
                    Identity Pass
                  </p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1.25"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, #D4A017 0, #D4A017 8px, #FF6B35 8px, #FF6B35 16px)",
                    }}
                  />
                </div>

                <div className="px-5 py-4">
                  {!ticket ? (
                    <div
                      className="rounded-2xl border p-4"
                      style={{ borderColor: "rgba(212,160,23,0.5)", backgroundColor: "rgba(255,255,255,0.72)" }}
                    >
                      <p className="text-sm" style={{ color: "#7B2D0E" }}>
                        No ticket mapped to your email yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "#E8690A" }}>
                            Ticket Holder
                          </p>
                          <p className="text-base font-semibold mt-1" style={{ color: "#3D1A00" }}>
                            {ticket.participantName}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#7B2D0E" }}>
                            {ticket.phone || "Phone not available"}
                          </p>
                          <p className="text-xs mt-1" style={{ color: "#7B2D0E" }}>
                            {ticket.email}
                          </p>
                        </div>

                        {ticketQr && (
                          <Image
                            src={ticketQr}
                            alt="Participant QR"
                            width={165}
                            height={165}
                            unoptimized
                            className="h-41.25 w-41.25 rounded-lg border-2"
                            style={{ borderColor: "rgba(139, 21, 56, 0.2)", backgroundColor: "#fff" }}
                          />
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-dashed" style={{ borderColor: "rgba(139, 21, 56, 0.3)" }}>
                        <p className="text-xs" style={{ color: "#2D6A4F" }}>
                          Scan this ticket once at help desk. Event eligibility and play status remain tied to your email.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="xl:col-span-3 rounded-[22px] border-[3px] p-5 shadow-2xl" style={{ borderColor: "#a71d16", backgroundColor: "rgba(255, 248, 231, 0.97)" }}>
              <div className="rounded-2xl border p-4 mb-4" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.72)" }}>
                <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: "#8B1538" }}>
                  Participant Details
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }}>
                    College: {profileDetails.college || "Not provided"}
                  </span>
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}>
                    Mobile: {profileDetails.phone || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border p-4 mb-4" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.72)" }}>
                <h3 className="text-sm md:text-base font-bold mb-3 uppercase tracking-[0.18em]" style={{ color: "#8B1538", fontFamily: "'Cinzel Decorative', serif" }}>
                  Participated / Purchased Events
                </h3>

                <div className="max-h-[42vh] overflow-auto pr-1 space-y-3">
                  {purchasedEvents.length === 0 ? (
                    <p className="text-sm" style={{ color: "#7B2D0E" }}>
                      No event purchases found yet.
                    </p>
                  ) : (
                    purchasedEvents.map((event) => (
                      <article
                        key={event.id}
                        className="rounded-xl border px-4 py-3"
                        style={{
                          borderColor: "rgba(139, 21, 56, 0.2)",
                          backgroundColor: "rgba(255,248,231,0.9)",
                          boxShadow: "0 4px 12px rgba(139, 21, 56, 0.08)",
                        }}
                      >
                        <p className="text-xs uppercase tracking-[0.16em] font-bold" style={{ color: "#8B1538" }}>
                          {event.eventName}
                        </p>
                        <p className="text-xs mt-1" style={{ color: event.isPlayed ? "#8B1538" : "#2D6A4F" }}>
                          Participation: {event.isPlayed ? "Played" : "Not Played"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
                            style={{
                              backgroundColor: event.eventStatus === "STARTED" ? "#dcfce7" : "#fef9c3",
                              color: event.eventStatus === "STARTED" ? "#166534" : "#854d0e",
                              border: `1px solid ${event.eventStatus === "STARTED" ? "#86efac" : "#fde68a"}`,
                            }}
                          >
                            {prettyEventStatus(event.eventStatus)}
                          </span>
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold"
                            style={{ backgroundColor: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" }}
                          >
                            Venue: {event.venue || "TBA"}
                          </span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {showDashboardAccess && (
                  <Link
                    href={dashboardRoute}
                    className="block w-full font-bold text-xs md:text-sm py-3 rounded-xl border-2 text-center transition-all hover:scale-[1.02] tracking-[0.14em] shadow-lg"
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
                  className="w-full font-bold text-xs md:text-sm py-3 rounded-xl border-2 text-center transition-all hover:scale-[1.02] tracking-[0.16em] shadow-lg md:col-span-2"
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
