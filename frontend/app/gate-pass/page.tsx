"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";

interface StoredUser {
  name: string;
  email: string;
}

interface GatePassData {
  participantName: string;
  email: string;
  phone: string;
  college: string;
  qrToken: string;
  issuedAt: string;
  validFrom: string;
  validTo: string;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function GatePassPage() {
  const router = useRouter();
  const [userState] = useState<{ user: StoredUser | null; checked: boolean }>(() => {
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

  const [pass, setPass] = useState<GatePassData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const guestReference = useMemo(() => {
    if (!pass?.email) return "CR26-GUEST";
    const compact = pass.email
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 10);
    return `CR26-${compact}`;
  }, [pass?.email]);

  useEffect(() => {
    if (userState.checked && !userState.user) {
      router.replace("/login?next=gate-pass");
      return;
    }

    if (!userState.user) return;

    let active = true;
    const loadGatePass = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/profile/gate-pass?email=${encodeURIComponent(userState.user!.email)}`);
        const data = await res.json();

        if (!active) return;

        if (!res.ok) {
          setError(data.error || "Could not load your gate pass.");
          setLoading(false);
          return;
        }

        const nextPass = data.pass as GatePassData;
        setPass(nextPass);
        const nextQr = await QRCode.toDataURL(nextPass.qrToken, {
          width: 340,
          margin: 1,
          color: {
            dark: "#1a1206",
            light: "#ffffff",
          },
        });

        if (!active) return;
        setQrDataUrl(nextQr);
      } catch {
        if (!active) return;
        setError("Network error while loading gate pass.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadGatePass();

    return () => {
      active = false;
    };
  }, [router, userState.checked, userState.user]);

  if (!userState.checked || !userState.user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f3ba35" }}>
        <div className="w-8 h-8 rounded-full border-4 border-[#8B1538] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !pass) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: "#f3ba35" }}>
        <h1 className="text-2xl font-bold mb-3" style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}>
          Gate Pass Unavailable
        </h1>
        <p className="text-sm mb-6" style={{ color: "#7B2D0E" }}>
          {error || "Unable to load gate pass at the moment."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/onboard"
            className="inline-block font-bold text-sm px-6 py-3 rounded-full border-2 transition-all hover:scale-105 shadow-lg tracking-widest"
            style={{
              backgroundColor: "#8B1538",
              color: "#FFF8E7",
              borderColor: "#D4A017",
              fontFamily: "'Cinzel Decorative', serif",
            }}
          >
            GO TO REGISTER
          </Link>
          <Link
            href="/"
            className="inline-block font-bold text-sm px-6 py-3 rounded-full border-2 transition-all hover:scale-105 shadow-lg tracking-widest"
            style={{
              backgroundColor: "#FFF8E7",
              color: "#4a0e00",
              borderColor: "#8B1538",
              fontFamily: "'Cinzel Decorative', serif",
            }}
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-6 px-4 sm:px-6" style={{ background: "#f3ba35" }}>
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl border-4 p-5 sm:p-7 shadow-2xl"
          style={{
            borderColor: "#8B1538",
            background: "linear-gradient(145deg, #FFF8E7 0%, #FFECC4 100%)",
          }}
        >
          <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: "#8B1538", fontFamily: "'Poppins', sans-serif" }}>
            Crescendo&apos;26
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#4a0e00", fontFamily: "'Cinzel Decorative', serif" }}>
            Guest Gate Pass
          </h1>
          <p className="text-xs sm:text-sm mt-2" style={{ color: "#7B2D0E" }}>
            Show this QR at the college gate for quick identity validation.
          </p>

          <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-130 lg:max-w-105 aspect-2/3">
                <Image
                  src="/gatepass.png"
                  alt="Crescendo guest gate pass"
                  fill
                  priority
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 520px, 420px"
                  className="object-contain"
                />

                {/* QR must sit inside the blank box area of the design */}
                <div className="absolute left-[27.8%] top-[50.6%] w-[43.7%] aspect-square">
                  <div
                    className="h-full w-full rounded-sm bg-white p-[2.5%] border"
                    style={{ borderColor: "rgba(60,26,0,0.45)", boxShadow: "0 6px 14px rgba(0,0,0,0.2)" }}
                  >
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="Guest gate pass QR code" className="h-full w-full" />
                    ) : (
                      <div className="h-full w-full bg-slate-100 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border p-4 sm:p-5 text-left" style={{ borderColor: "rgba(139,21,56,0.32)", background: "rgba(255,255,255,0.6)" }}>
                <div className="grid gap-2 sm:grid-cols-2 text-sm" style={{ color: "#3D1A00" }}>
                  <p><span className="font-bold">Name:</span> {pass.participantName}</p>
                  <p><span className="font-bold">Phone:</span> {pass.phone}</p>
                  <p><span className="font-bold">Email:</span> {pass.email}</p>
                  <p><span className="font-bold">College:</span> {pass.college}</p>
                  <p><span className="font-bold">Pass Ref:</span> {guestReference}</p>
                  <p><span className="font-bold">Validity:</span> {formatDate(pass.validFrom)} to {formatDate(pass.validTo)}</p>
                </div>
              </div>

              <div className="mt-4 text-[11px] sm:text-xs" style={{ color: "#7B2D0E" }}>
                Issued on {formatDate(pass.issuedAt)}. Keep a valid college ID card ready for verification.
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/select-events"
                  className="inline-block font-bold text-sm px-6 py-3 rounded-full border-2 text-center transition-all hover:scale-105 shadow-lg tracking-widest"
                  style={{
                    backgroundColor: "#FFF8E7",
                    color: "#4a0e00",
                    borderColor: "#8B1538",
                    fontFamily: "'Cinzel Decorative', serif",
                  }}
                >
                  BACK
                </Link>
                <Link
                  href="/"
                  className="inline-block font-bold text-sm px-6 py-3 rounded-full border-2 text-center transition-all hover:scale-105 shadow-lg tracking-widest"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
