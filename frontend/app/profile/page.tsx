"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import QRCode from "qrcode";

interface StoredUser {
  name: string;
  email: string;
}

interface ProfileTicket {
  id: number;
  eventName: string;
  participantName: string;
  phone: string | null;
  qrToken: string;
  isPlayed: boolean;
  playedAt: string | null;
  playedByEmail: string | null;
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
  const [tickets, setTickets] = useState<ProfileTicket[]>([]);
  const [ticketQrMap, setTicketQrMap] = useState<Record<number, string>>({});
  const [showDashboardAccess, setShowDashboardAccess] = useState(false);
  const [dashboardRoute, setDashboardRoute] = useState("/event-dashboard");
  const [dashboardLabel, setDashboardLabel] = useState("ACCESS EVENT DASHBOARD");

  useEffect(() => {
    if (state.checked && !state.user) {
      router.replace("/login");
    }
  }, [state.checked, state.user, router]);

  useEffect(() => {
    if (!state.user) return;

    (async () => {
      try {
        const [accessRes, ticketsRes] = await Promise.all([
          fetch(`/api/dashboard/me?email=${encodeURIComponent(state.user!.email)}`),
          fetch(`/api/profile/tickets?email=${encodeURIComponent(state.user!.email)}`),
        ]);

        const accessData = await accessRes.json();
        const ticketsData = await ticketsRes.json();

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

        if (ticketsRes.ok && Array.isArray(ticketsData.tickets)) {
          const loadedTickets = ticketsData.tickets as ProfileTicket[];
          setTickets(loadedTickets);

          const qrEntries = await Promise.all(
            loadedTickets.map(async (ticket) => {
              const dataUrl = await QRCode.toDataURL(ticket.qrToken, {
                width: 164,
                margin: 1,
              });
              return [ticket.id, dataUrl] as const;
            })
          );

          setTicketQrMap(Object.fromEntries(qrEntries));
        }
      } catch (error) {
        console.error("[profile:load]", error);
      }
    })();
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
                YOUR TICKETS
              </h2>
              <div className="space-y-3 max-h-[55vh] overflow-auto pr-1">
                {tickets.length === 0 ? (
                  <div className="rounded-2xl border-2 p-4" style={{ borderColor: "#D4A017", backgroundColor: "rgba(255,255,255,0.65)" }}>
                    <p className="text-sm" style={{ color: "#7B2D0E" }}>
                      No event tickets mapped to your email yet.
                    </p>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-2xl border-2 p-4"
                      style={{
                        borderColor: ticket.isPlayed ? "#8B8680" : "#D4A017",
                        backgroundColor: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#8B1538" }}>
                        {ticket.eventName}
                      </p>
                      <p className="text-sm mt-1 font-semibold" style={{ color: "#4a0e00" }}>
                        {ticket.participantName}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#7B2D0E" }}>
                        {ticket.phone || "Phone not available"}
                      </p>
                      {!ticket.isPlayed && ticketQrMap[ticket.id] && (
                        <Image
                          src={ticketQrMap[ticket.id]}
                          alt={`QR for ${ticket.eventName}`}
                          width={160}
                          height={160}
                          unoptimized
                          className="mt-2 h-40 w-40 rounded border"
                        />
                      )}
                      <p className="text-xs mt-2" style={{ color: ticket.isPlayed ? "#8B1538" : "#2D6A4F" }}>
                        {ticket.isPlayed ? "Status: Played (ticket locked)" : "Status: Active"}
                      </p>
                    </div>
                  ))
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
