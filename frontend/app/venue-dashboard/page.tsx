"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

type StoredUser = { name: string; email: string };

type AccessResponse = {
  email: string;
  isSuperAdmin: boolean;
  isCoordinator: boolean;
  isVenueTeam: boolean;
  showDashboardAccess: boolean;
};

type GateEntry = {
  id: number;
  participantEmail: string;
  participantName: string;
  participantPhone: string | null;
  participantCollege: string | null;
  scannedByEmail: string;
  scannedAt: string;
  entryDate: string;
};

type ToastState = { kind: "success" | "error" | "info"; text: string } | null;

const DASHBOARD_ASSISTANCE_CONTACTS = [
  { name: "Aryan Sonawane", phone: "9370950520" },
  { name: "Anushka Bhalerao", phone: "7887796921" },
  { name: "Soham Deogaonkar", phone: "708384291" },
  { name: "Shubham Chauhan", phone: "8591508599" },
];

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function VenueDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [access, setAccess] = useState<AccessResponse | null>(null);
  const [entries, setEntries] = useState<GateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const [scanToken, setScanToken] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [scanCameraError, setScanCameraError] = useState("");
  const [entriesLoadError, setEntriesLoadError] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopRef = useRef<number | null>(null);
  const inFlightRef = useRef(false);
  const lastScanRef = useRef<{ token: string; at: number }>({ token: "", at: 0 });

  const header = useMemo(
    () => ({ "Content-Type": "application/json", "x-user-email": user?.email || "" }),
    [user?.email]
  );

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const requestJson = async (url: string, init?: RequestInit) => {
    const maxAttempts = 2;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const res = await fetch(url, init);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error((data as { error?: string }).error || "Request failed");
        }
        return data;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) {
          await delay(200);
          continue;
        }
      }
    }

    if (lastError instanceof Error) throw lastError;
    throw new Error("Network error while contacting venue APIs.");
  };

  const showToast = (kind: "success" | "error" | "info", text: string) => {
    setToast({ kind, text });
    window.setTimeout(() => setToast(null), 2600);
  };

  const loadEntries = async (email?: string, options?: { silent?: boolean }) => {
    const actor = email || user?.email;
    if (!actor) return false;

    try {
      const data = await requestJson(`/api/dashboard/venue/entries?email=${encodeURIComponent(actor)}`);
      setEntries(Array.isArray(data.entries) ? (data.entries as GateEntry[]) : []);
      setEntriesLoadError("");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load gate entries.";
      setEntries([]);
      setEntriesLoadError(message);
      if (!options?.silent) {
        showToast("error", message);
      }
      return false;
    }
  };

  const stopScanner = () => {
    if (loopRef.current) {
      window.clearTimeout(loopRef.current);
      loopRef.current = null;
    }
    const stream = streamRef.current;
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    inFlightRef.current = false;
  };

  const submitScanToken = async (token: string) => {
    if (!user || !token.trim() || inFlightRef.current) return;

    inFlightRef.current = true;
    setSaving(true);
    try {
      const data = await requestJson(`/api/dashboard/venue/entries?email=${encodeURIComponent(user.email)}`, {
        method: "POST",
        headers: header,
        body: JSON.stringify({ qrToken: token.trim() }),
      });

      const entry = data.entry as GateEntry;
      showToast("success", `Identification successful: ${entry.participantName}`);

      await loadEntries(user.email, { silent: true });
      setScanToken("");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to validate gate pass");
    } finally {
      setSaving(false);
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("crescendo_user");
    if (!stored) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored) as StoredUser;
      setUser(parsed);

      (async () => {
        try {
          const accessData = (await requestJson(
            `/api/dashboard/me?email=${encodeURIComponent(parsed.email)}`
          )) as AccessResponse;
          setAccess(accessData);

          if (!accessData.isVenueTeam && !accessData.isSuperAdmin) {
            setError("You do not have Venue Team dashboard access.");
            return;
          }

          const loaded = await loadEntries(parsed.email, { silent: true });
          if (!loaded) {
            showToast("info", "Dashboard opened. Previous gate logs are temporarily unavailable.");
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load venue dashboard.");
        } finally {
          setLoading(false);
        }
      })();
    } catch {
      localStorage.removeItem("crescendo_user");
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!scanOpen) {
      stopScanner();
      return;
    }

    let cancelled = false;

    const startScanner = async () => {
      try {
        setScanCameraError("");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          for (const track of stream.getTracks()) track.stop();
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        const loop = () => {
          if (!scanOpen) return;
          const currentVideo = videoRef.current;
          if (!currentVideo || currentVideo.readyState < 2) {
            loopRef.current = window.setTimeout(loop, 220);
            return;
          }

          const width = currentVideo.videoWidth;
          const height = currentVideo.videoHeight;
          if (!width || !height) {
            loopRef.current = window.setTimeout(loop, 220);
            return;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) {
            loopRef.current = window.setTimeout(loop, 220);
            return;
          }

          ctx.drawImage(currentVideo, 0, 0, width, height);
          const img = ctx.getImageData(0, 0, width, height);
          const result = jsQR(img.data, width, height, { inversionAttempts: "dontInvert" });

          if (result?.data) {
            const now = Date.now();
            const normalized = result.data.trim();
            const repeated =
              lastScanRef.current.token === normalized && now - lastScanRef.current.at < 2500;

            if (!repeated && normalized) {
              lastScanRef.current = { token: normalized, at: now };
              void submitScanToken(normalized);
            }
          }

          loopRef.current = window.setTimeout(loop, 300);
        };

        loop();
      } catch (err) {
        setScanCameraError(err instanceof Error ? err.message : "Failed to access camera.");
      }
    };

    void startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanOpen]);

  if (loading) return <main style={{ padding: 20 }}>Loading venue dashboard...</main>;
  if (error) return <main style={{ padding: 20 }}>Error: {error}</main>;
  if (!access?.showDashboardAccess) return <main style={{ padding: 20 }}>Dashboard access not available.</main>;

  return (
    <main className="venue-shell">
      <section className="venue-panel">
        <div className="page-head">
          <h1>Venue Team Dashboard</h1>
          <p>Gate pass scan and guest entry validation</p>
        </div>

        <div className="scan-card">
          <h2>Scan Gate Pass</h2>
          <p>Paste QR token from scanner input or use camera scanner.</p>

          <div className="scan-row">
            <input
              value={scanToken}
              onChange={(e) => setScanToken(e.target.value)}
              placeholder="Paste/scan QR token (cr26_u_...)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void submitScanToken(scanToken);
                }
              }}
            />
            <button onClick={() => void submitScanToken(scanToken)} disabled={saving || !scanToken.trim()}>
              Validate
            </button>
            <button onClick={() => setScanOpen((prev) => !prev)}>
              {scanOpen ? "Close Camera" : "Open Camera"}
            </button>
          </div>

          {scanOpen && (
            <div className="camera-box">
              <video ref={videoRef} muted playsInline autoPlay />
              {scanCameraError ? <p className="camera-error">{scanCameraError}</p> : null}
            </div>
          )}
        </div>

        <div className="list-card">
          <div className="list-head">
            <h2>Guests Allowed</h2>
            <button onClick={() => void loadEntries()}>Refresh List</button>
          </div>

          {entriesLoadError ? <p className="list-error">{entriesLoadError}</p> : null}

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>College</th>
                  <th>Entry Time</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.participantName}</td>
                    <td>{entry.participantEmail}</td>
                    <td>{entry.participantPhone || "-"}</td>
                    <td>{entry.participantCollege || "-"}</td>
                    <td>{formatDateTime(entry.scannedAt)}</td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-row">No guest entries logged yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="assist-card">
          <h2>Website Assistance</h2>
          <p>For any dashboard assistance, contact the website team.</p>
          <div className="assist-grid">
            {DASHBOARD_ASSISTANCE_CONTACTS.map((contact) => (
              <a key={`${contact.name}-${contact.phone}`} href={`tel:${contact.phone}`} className="assist-item">
                <strong>{contact.name}</strong>
                <span>{contact.phone}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {toast && <div className={`toast ${toast.kind}`}>{toast.text}</div>}

      <style jsx>{`
        .venue-shell {
          min-height: 100vh;
          background: #f3f5f8;
          color: #0f172a;
          padding: 20px;
        }

        .venue-panel {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          gap: 16px;
        }

        .page-head h1 {
          margin: 0;
          font-size: 32px;
          font-family: var(--font-cinzel, serif);
        }

        .page-head p {
          margin: 8px 0 0;
          color: #475467;
        }

        .scan-card,
        .list-card,
        .assist-card {
          background: #fff;
          border: 1px solid #dde3ee;
          border-radius: 16px;
          padding: 16px;
        }

        .scan-card h2,
        .list-card h2,
        .assist-card h2 {
          margin: 0;
          font-size: 20px;
          font-family: var(--font-cinzel, serif);
        }

        .scan-card p {
          margin: 8px 0 0;
          color: #475467;
          font-size: 14px;
        }

        .scan-row {
          margin-top: 12px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto auto;
          gap: 10px;
        }

        .scan-row input,
        .scan-row button,
        .list-head button {
          border: 1px solid #c8d2e2;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
        }

        .scan-row button,
        .list-head button {
          background: #1e3a8a;
          color: #fff;
          border-color: #1e3a8a;
          cursor: pointer;
        }

        .scan-row button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .camera-box {
          margin-top: 12px;
          border: 1px solid #c8d2e2;
          border-radius: 12px;
          overflow: hidden;
          background: #0f172a;
        }

        .camera-box video {
          width: 100%;
          max-height: 360px;
          object-fit: cover;
          display: block;
        }

        .camera-error {
          margin: 0;
          padding: 10px 12px;
          color: #b91c1c;
          background: #fef2f2;
          font-size: 13px;
        }

        .list-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .table-wrap {
          overflow: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid #e7edf5;
          font-size: 13px;
          white-space: nowrap;
        }

        th {
          color: #475467;
          font-weight: 700;
          background: #f8fafc;
          position: sticky;
          top: 0;
        }

        .empty-row {
          text-align: center;
          color: #667085;
          padding: 18px;
        }

        .list-error {
          margin: 0 0 10px;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 600;
        }

        .assist-card p {
          margin: 8px 0 0;
          color: #475467;
          font-size: 14px;
        }

        .assist-grid {
          margin-top: 12px;
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .assist-item {
          text-decoration: none;
          border: 1px solid #d6deea;
          border-radius: 12px;
          background: #f8fafc;
          padding: 10px 12px;
          display: grid;
          gap: 2px;
        }

        .assist-item strong {
          color: #0f172a;
          font-size: 14px;
        }

        .assist-item span {
          color: #334155;
          font-size: 13px;
          font-weight: 600;
        }

        .toast {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 30;
          padding: 11px 14px;
          border-radius: 10px;
          color: #fff;
          font-weight: 700;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
        }

        .toast.success {
          background: #166534;
        }

        .toast.error {
          background: #b91c1c;
        }

        .toast.info {
          background: #1d4ed8;
        }

        @media (max-width: 760px) {
          .scan-row {
            grid-template-columns: 1fr;
          }

          .scan-row input,
          .scan-row button,
          .list-head button {
            min-height: 44px;
            font-size: 15px;
          }

          .assist-grid {
            grid-template-columns: 1fr;
          }

          th,
          td {
            font-size: 12px;
            padding: 8px;
          }
        }
      `}</style>
    </main>
  );
}
