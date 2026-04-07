"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

type QueueEntryStatus = "QUEUED" | "IN_PROGRESS" | "COMPLETED";

type QueueEntry = {
  id: number;
  participantName: string;
  participantEmail: string;
  participantPhone: string | null;
  teamMembersJson?: {
    teamName?: string | null;
    teammates?: Array<{
      name: string;
      email?: string;
      phone?: string;
    }>;
  } | null;
  status: QueueEntryStatus;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
};

type RegisteredParticipant = {
  id: number;
  participantName: string;
  participantEmail: string;
  participantPhone: string | null;
  isPlayed: boolean;
  inQueue: boolean;
};

type EventRound = {
  id: number;
  status: "IN_PROGRESS" | "COMPLETED";
  scoreA: number;
  scoreB: number | null;
  remarks: string | null;
  isStarred: boolean;
  starredAt: string | null;
  startedAt: string;
  endedAt: string | null;
  entryA: { id: number; participantName: string };
  entryB: { id: number; participantName: string } | null;
};

type ManagedEvent = {
  id: number;
  name: string;
  category: string;
  format: "SINGLE_PARTICIPANT" | "SINGLE_VS_SINGLE" | "TEAM_SOLO" | "TEAM_VS_TEAM";
  teamSize: number | null;
  venue: string | null;
  allowOnSpotEntry: boolean;
  status: "NOT_STARTED" | "STARTED" | "PAUSED" | "COMPLETED";
  queueEntries?: QueueEntry[];
  rounds?: EventRound[];
};

type AccessResponse = {
  email: string;
  isSuperAdmin: boolean;
  isCoordinator: boolean;
  showDashboardAccess: boolean;
};

type StoredUser = { name: string; email: string };

type ViewTab = "ALL" | QueueEntryStatus;
type ToastKind = "success" | "error";
type ToastMessage = { id: number; kind: ToastKind; message: string };

const STATUS_STEP_ORDER: QueueEntryStatus[] = ["QUEUED", "IN_PROGRESS", "COMPLETED"];

const DASHBOARD_ASSISTANCE_CONTACTS = [
  { name: "Aryan Sonawane", phone: "9370950520" },
  { name: "Anushka Bhalerao", phone: "7887796921" },
  { name: "Soham Deogaonkar", phone: "708384291" },
  { name: "Shubham Chauhan", phone: "8591508599" },
];

function prettyQueueStatus(status: QueueEntryStatus) {
  if (status === "QUEUED") return "Queue";
  if (status === "IN_PROGRESS") return "Active";
  return "Completed";
}

function rowToneClass(status: QueueEntryStatus) {
  if (status === "QUEUED") return "row-tone-queued";
  if (status === "IN_PROGRESS") return "row-tone-active";
  if (status === "COMPLETED") return "row-tone-completed";
  return "row-tone-default";
}

function isVsFormat(format: ManagedEvent["format"]) {
  return format === "SINGLE_VS_SINGLE" || format === "TEAM_VS_TEAM";
}

function isTeamFormat(format: ManagedEvent["format"]) {
  return format === "TEAM_SOLO" || format === "TEAM_VS_TEAM";
}
type TeammateDraft = { name: string; email: string; phone: string };

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString();
}

function formatDateForExport(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function toFileSafeName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type CompletedExportRow = {
  eventId: number;
  eventName: string;
  category: string;
  venue: string;
  format: string;
  recordType: string;
  roundId: number | "";
  status: string;
  participantAName: string;
  participantAEmail: string;
  participantAPhone: string;
  teamAName: string;
  participantBName: string;
  participantBEmail: string;
  participantBPhone: string;
  teamBName: string;
  scoreA: number | "";
  scoreB: number | "";
  scoreDisplay: string;
  remarks: string;
  isStarred: string;
  startedAt: string;
  completedAt: string;
  queueEntryAId: number | "";
  queueEntryBId: number | "";
  queuedAtA: string;
  queuedAtB: string;
};

function getTeamMeta(entry: QueueEntry) {
  const raw = entry.teamMembersJson;
  if (!raw || typeof raw !== "object") return null;

  const teamName = typeof raw.teamName === "string" ? raw.teamName.trim() : "";
  const teammates = Array.isArray(raw.teammates)
    ? raw.teammates
        .map((row) => ({
          name: typeof row?.name === "string" ? row.name.trim() : "",
          email: typeof row?.email === "string" ? row.email.trim() : "",
          phone: typeof row?.phone === "string" ? row.phone.trim() : "",
        }))
        .filter((row) => row.name || row.email || row.phone)
    : [];

  if (!teamName && teammates.length === 0) return null;
  return { teamName, teammates };
}

function buildCompletedExportRowsForEvent(event: ManagedEvent): CompletedExportRow[] {
  const queueById = new Map((event.queueEntries || []).map((entry) => [entry.id, entry]));
  const completedRounds = (event.rounds || []).filter((round) => round.status === "COMPLETED");
  const rows: CompletedExportRow[] = [];
  const linkedQueueEntryIds = new Set<number>();

  for (const round of completedRounds) {
    const entryA = queueById.get(round.entryA.id);
    const entryB = round.entryB ? queueById.get(round.entryB.id) : null;
    const teamMetaA = entryA ? getTeamMeta(entryA) : null;
    const teamMetaB = entryB ? getTeamMeta(entryB) : null;

    linkedQueueEntryIds.add(round.entryA.id);
    if (round.entryB?.id) linkedQueueEntryIds.add(round.entryB.id);

    rows.push({
      eventId: event.id,
      eventName: event.name,
      category: event.category,
      venue: event.venue || "",
      format: event.format,
      recordType: "ROUND_COMPLETED",
      roundId: round.id,
      status: round.status,
      participantAName: round.entryA.participantName,
      participantAEmail: entryA?.participantEmail || "",
      participantAPhone: entryA?.participantPhone || "",
      teamAName: teamMetaA?.teamName || "",
      participantBName: round.entryB?.participantName || "",
      participantBEmail: entryB?.participantEmail || "",
      participantBPhone: entryB?.participantPhone || "",
      teamBName: teamMetaB?.teamName || "",
      scoreA: round.scoreA ?? "",
      scoreB: round.scoreB ?? "",
      scoreDisplay: round.entryB ? `${round.scoreA ?? 0} - ${round.scoreB ?? 0}` : `${round.scoreA ?? 0}`,
      remarks: round.remarks || "",
      isStarred: round.isStarred ? "Yes" : "No",
      startedAt: formatDateForExport(round.startedAt),
      completedAt: formatDateForExport(round.endedAt),
      queueEntryAId: round.entryA.id,
      queueEntryBId: round.entryB?.id ?? "",
      queuedAtA: formatDateForExport(entryA?.queuedAt || null),
      queuedAtB: formatDateForExport(entryB?.queuedAt || null),
    });
  }

  const completedQueueEntries = (event.queueEntries || []).filter(
    (entry) => entry.status === "COMPLETED" && !linkedQueueEntryIds.has(entry.id)
  );

  for (const entry of completedQueueEntries) {
    const teamMeta = getTeamMeta(entry);
    rows.push({
      eventId: event.id,
      eventName: event.name,
      category: event.category,
      venue: event.venue || "",
      format: event.format,
      recordType: "QUEUE_COMPLETED_ONLY",
      roundId: "",
      status: entry.status,
      participantAName: entry.participantName,
      participantAEmail: entry.participantEmail,
      participantAPhone: entry.participantPhone || "",
      teamAName: teamMeta?.teamName || "",
      participantBName: "",
      participantBEmail: "",
      participantBPhone: "",
      teamBName: "",
      scoreA: "",
      scoreB: "",
      scoreDisplay: "",
      remarks: "",
      isStarred: "",
      startedAt: formatDateForExport(entry.startedAt),
      completedAt: formatDateForExport(entry.completedAt),
      queueEntryAId: entry.id,
      queueEntryBId: "",
      queuedAtA: formatDateForExport(entry.queuedAt),
      queuedAtB: "",
    });
  }

  return rows.sort((a, b) => {
    const tA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const tB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return tB - tA;
  });
}

async function downloadRowsAsExcel(rows: CompletedExportRow[], sheetName: string, fileNameBase: string) {
  const XLSX = await import("xlsx");

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));
  XLSX.writeFile(wb, `${toFileSafeName(fileNameBase) || "completed-export"}.xlsx`);
}

function ActionIcon({
  type,
  filled = false,
}: {
  type: "add" | "play" | "stop" | "score" | "edit" | "remove" | "star" | "note";
  filled?: boolean;
}) {
  if (type === "add") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (type === "play") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 5 11 7-11 7z" />
      </svg>
    );
  }

  if (type === "stop") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
      </svg>
    );
  }

  if (type === "score") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18h12" />
        <path d="M9 14h1" />
        <path d="M14 10h1" />
        <path d="M8 6h8a2 2 0 0 1 2 2v10H6V8a2 2 0 0 1 2-2z" />
      </svg>
    );
  }

  if (type === "edit") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
      </svg>
    );
  }

  if (type === "star") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="m12 3 2.9 5.88 6.49.94-4.7 4.58 1.11 6.47L12 17.77 6.2 20.87l1.11-6.47-4.7-4.58 6.49-.94z"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "note") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function CoordinatorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [access, setAccess] = useState<AccessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | "">("");
  const [scanToken, setScanToken] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [scanCameraReady, setScanCameraReady] = useState(false);
  const [scanCameraError, setScanCameraError] = useState("");
  const [registeredSearch, setRegisteredSearch] = useState("");
  const [registeredParticipants, setRegisteredParticipants] = useState<RegisteredParticipant[]>([]);
  const [registeredLoading, setRegisteredLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teammates, setTeammates] = useState<TeammateDraft[]>([]);
  const [search, setSearch] = useState("");
  const [viewTab, setViewTab] = useState<ViewTab>("ALL");
  const [saving, setSaving] = useState(false);
  const [scoreByRound, setScoreByRound] = useState<Record<number, { scoreA: number; scoreB: number }>>({});
  const [opponentByEntry, setOpponentByEntry] = useState<Record<number, number | "">>({});
  const [teamEditEntryId, setTeamEditEntryId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const scannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const scannerStreamRef = useRef<MediaStream | null>(null);
  const scannerLoopTimerRef = useRef<number | null>(null);
  const lastScanRef = useRef<{ token: string; at: number }>({ token: "", at: 0 });
  const scanInFlightRef = useRef(false);

  const header = useMemo(
    () => ({ "Content-Type": "application/json", "x-user-email": user?.email || "" }),
    [user?.email]
  );

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) || null,
    [events, selectedEventId]
  );

  const queueEntries = selectedEvent?.queueEntries || [];
  const rounds = selectedEvent?.rounds || [];
  const teamEventSelected = selectedEvent ? isTeamFormat(selectedEvent.format) : false;
  const versusEventSelected = selectedEvent ? isVsFormat(selectedEvent.format) : false;
  const eventStarted = selectedEvent?.status === "STARTED";
  const teammateLimit = useMemo(() => {
    if (!selectedEvent || !teamEventSelected) return 20;
    if (!selectedEvent.teamSize || selectedEvent.teamSize <= 1) return 20;
    return Math.min(Math.max(selectedEvent.teamSize - 1, 1), 20);
  }, [selectedEvent, teamEventSelected]);

  const counters = useMemo(() => {
    const queued = queueEntries.filter((item) => item.status === "QUEUED").length;
    const active = queueEntries.filter((item) => item.status === "IN_PROGRESS").length;
    const completed = queueEntries.filter((item) => item.status === "COMPLETED").length;
    return { queued, active, completed, all: queueEntries.length };
  }, [queueEntries]);

  const filteredEntries = useMemo(() => {
    return queueEntries
      .filter((entry) => (viewTab === "ALL" ? true : entry.status === viewTab))
      .filter((entry) => {
        const text = search.trim().toLowerCase();
        if (!text) return true;
        return (
          entry.participantName.toLowerCase().includes(text) ||
          entry.participantEmail.toLowerCase().includes(text) ||
          (entry.participantPhone || "").toLowerCase().includes(text)
        );
      })
      .sort((a, b) => {
        const statusDelta = STATUS_STEP_ORDER.indexOf(a.status) - STATUS_STEP_ORDER.indexOf(b.status);
        if (statusDelta !== 0) return statusDelta;
        return new Date(b.queuedAt).getTime() - new Date(a.queuedAt).getTime();
      });
  }, [queueEntries, search, viewTab]);

  const queueEntryById = useMemo(() => {
    return new Map(queueEntries.map((entry) => [entry.id, entry]));
  }, [queueEntries]);

  const filteredPairedQueueMatches = useMemo(() => {
    if (viewTab !== "IN_PROGRESS") return [] as Array<{ entryA: QueueEntry; entryB: QueueEntry }>;

    const text = search.trim().toLowerCase();
    const seen = new Set<string>();
    const pairs: Array<{ entryA: QueueEntry; entryB: QueueEntry }> = [];

    for (const [key, mapped] of Object.entries(opponentByEntry)) {
      const aId = Number(key);
      const bId = typeof mapped === "number" ? mapped : NaN;
      if (!Number.isFinite(bId)) continue;
      if (opponentByEntry[bId] !== aId) continue;

      const [minId, maxId] = aId < bId ? [aId, bId] : [bId, aId];
      const pairKey = `${minId}:${maxId}`;
      if (seen.has(pairKey)) continue;

      const entryA = queueEntryById.get(minId);
      const entryB = queueEntryById.get(maxId);
      if (!entryA || !entryB) continue;
      if (entryA.status !== "QUEUED" || entryB.status !== "QUEUED") continue;

      const haystack = [
        entryA.participantName,
        entryB.participantName,
        entryA.participantEmail,
        entryB.participantEmail,
        entryA.participantPhone || "",
        entryB.participantPhone || "",
      ]
        .join(" ")
        .toLowerCase();

      if (text && !haystack.includes(text)) continue;

      seen.add(pairKey);
      pairs.push({ entryA, entryB });
    }

    return pairs.sort((a, b) => new Date(b.entryA.queuedAt).getTime() - new Date(a.entryA.queuedAt).getTime());
  }, [viewTab, search, opponentByEntry, queueEntryById]);

  const filteredInProgressRounds = useMemo(() => {
    return rounds
      .filter((round) => round.status === "IN_PROGRESS")
      .filter((round) => {
        if (viewTab !== "IN_PROGRESS") return false;
        const text = search.trim().toLowerCase();
        if (!text) return true;

        const entryA = queueEntryById.get(round.entryA.id);
        const entryB = round.entryB ? queueEntryById.get(round.entryB.id) : null;

        const haystack = [
          round.entryA.participantName,
          round.entryB?.participantName || "",
          entryA?.participantEmail || "",
          entryB?.participantEmail || "",
          entryA?.participantPhone || "",
          entryB?.participantPhone || "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(text);
      })
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [rounds, viewTab, search, queueEntryById]);

  const filteredCompletedRounds = useMemo(() => {
    return rounds
      .filter((round) => round.status === "COMPLETED")
      .filter((round) => {
        if (viewTab !== "COMPLETED") return false;
        const text = search.trim().toLowerCase();
        if (!text) return true;

        const entryA = queueEntryById.get(round.entryA.id);
        const entryB = round.entryB ? queueEntryById.get(round.entryB.id) : null;

        const haystack = [
          round.entryA.participantName,
          round.entryB?.participantName || "",
          entryA?.participantEmail || "",
          entryB?.participantEmail || "",
          entryA?.participantPhone || "",
          entryB?.participantPhone || "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(text);
      })
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [rounds, viewTab, search, queueEntryById]);

  const filteredRegisteredParticipants = useMemo(() => {
    const text = registeredSearch.trim().toLowerCase();
    return registeredParticipants
      .filter((participant) => {
        if (!text) return true;
        return (
          participant.participantName.toLowerCase().includes(text) ||
          participant.participantEmail.toLowerCase().includes(text) ||
          (participant.participantPhone || "").toLowerCase().includes(text)
        );
      })
      .sort((a, b) => a.participantName.localeCompare(b.participantName));
  }, [registeredParticipants, registeredSearch]);

  const postJson = async (url: string, body: unknown, method: "POST" | "PATCH" = "POST") => {
    const res = await fetch(url, { method, headers: header, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  };

  const showToast = (kind: ToastKind, message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  };

  const stopScanner = () => {
    if (scannerLoopTimerRef.current) {
      window.clearInterval(scannerLoopTimerRef.current);
      scannerLoopTimerRef.current = null;
    }

    if (scannerStreamRef.current) {
      for (const track of scannerStreamRef.current.getTracks()) {
        track.stop();
      }
      scannerStreamRef.current = null;
    }

    if (scannerVideoRef.current) {
      scannerVideoRef.current.srcObject = null;
    }

    setScanCameraReady(false);
  };

  const loadAccess = async (email: string) => {
    const res = await fetch(`/api/dashboard/me?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load access");
    setAccess(data);
    return data as AccessResponse;
  };

  const loadEvents = async (emailOverride?: string) => {
    const email = emailOverride || user?.email;
    if (!email) return;

    const res = await fetch(`/api/dashboard/coordinator/events?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load coordinator events");

    const loadedEvents = data.events || [];
    setEvents(loadedEvents);
    setSelectedEventId((prev) => {
      if (prev && loadedEvents.some((event: ManagedEvent) => event.id === prev)) return prev;
      return loadedEvents[0]?.id || "";
    });
  };

  const loadRegisteredParticipants = async () => {
    const email = user?.email;
    if (!email || !selectedEvent) return;

    setRegisteredLoading(true);
    try {
      const params = new URLSearchParams({
        email,
        eventId: String(selectedEvent.id),
        limit: "600",
      });

      const res = await fetch(`/api/dashboard/coordinator/registered?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load registered participants");
      setRegisteredParticipants(data.participants || []);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load registered participants");
    } finally {
      setRegisteredLoading(false);
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
          const a = await loadAccess(parsed.email);
          if (!a.showDashboardAccess || !a.isCoordinator) {
            setError("You do not have coordinator dashboard access.");
            setLoading(false);
            return;
          }
          await loadEvents(parsed.email);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard.");
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
    setTeamName("");
    setTeammates([]);
    setTeamEditEntryId(null);
    setOpponentByEntry({});
    setScanOpen(false);
    setScanToken("");
    setRegisteredSearch("");
    setRegisteredParticipants([]);
  }, [selectedEventId]);

  const getTeamPayload = () => {
    const normalizedTeammates = teammates
      .map((row) => ({ name: row.name.trim(), email: row.email.trim(), phone: row.phone.trim() }))
      .filter((row) => row.name || row.email || row.phone);

    if (normalizedTeammates.some((row) => !row.name)) {
      showToast("error", "Teammate name is required when teammate details are provided.");
      return null;
    }

    return {
      teamName: teamName.trim(),
      teammates: normalizedTeammates,
    };
  };

  useEffect(() => {
    if (!selectedEvent || !user?.email) return;

    const timer = setTimeout(() => {
      loadRegisteredParticipants();
    }, 180);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEvent?.id, user?.email]);

  const handleTeammateField = (index: number, field: keyof TeammateDraft, value: string) => {
    setTeammates((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleAddTeammateRow = () => {
    setTeammates((prev) => {
      if (prev.length >= teammateLimit) return prev;
      return [...prev, { name: "", email: "", phone: "" }];
    });
  };

  const handleRemoveTeammateRow = (index: number) => {
    setTeammates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditTeamForEntry = (entry: QueueEntry) => {
    const meta = getTeamMeta(entry);
    setTeamEditEntryId(entry.id);
    setTeamName(meta?.teamName || "");
    setTeammates(
      (meta?.teammates || []).map((member) => ({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
      }))
    );
  };

  const handleCancelTeamEdit = () => {
    setTeamEditEntryId(null);
    setTeamName("");
    setTeammates([]);
  };

  const handleSaveTeamEdit = async () => {
    if (!user || !teamEditEntryId) return;

    const teamPayload = getTeamPayload();
    if (!teamPayload) return;

    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/coordinator/queue?email=${encodeURIComponent(user.email)}`,
        {
          queueEntryId: teamEditEntryId,
          teamName: teamPayload.teamName,
          teammates: teamPayload.teammates,
        },
        "PATCH"
      );
      await loadEvents();
      handleCancelTeamEdit();
      showToast("success", "Team details updated.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update team details");
    } finally {
      setSaving(false);
    }
  };

  const handleOpponentChange = (entryId: number, value: string) => {
    const opponentId = value ? Number(value) : "";

    setOpponentByEntry((prev) => {
      const next: Record<number, number | ""> = { ...prev };
      const previousOpponent = next[entryId];

      if (typeof previousOpponent === "number" && next[previousOpponent] === entryId) {
        delete next[previousOpponent];
      }

      if (!opponentId) {
        delete next[entryId];
        return next;
      }

      for (const [key, mapped] of Object.entries(next)) {
        const keyNumber = Number(key);
        if (keyNumber !== entryId && mapped === entryId && keyNumber !== opponentId) {
          delete next[keyNumber];
        }
      }

      const opponentCurrent = next[opponentId];
      if (typeof opponentCurrent === "number" && opponentCurrent !== entryId) {
        delete next[opponentCurrent];
      }

      next[entryId] = opponentId;
      next[opponentId] = entryId;
      return next;
    });
  };

  const handleAddParticipant = async (scannedToken?: string) => {
    if (!user || !selectedEvent) return;
    if (teamEditEntryId) {
      showToast("error", "Finish team edit or cancel it before adding a new participant.");
      return;
    }
    if (!eventStarted) {
      showToast("error", "Event is not started. Start the event first.");
      return;
    }
    const token = (scannedToken ?? scanToken).trim();
    if (!token) return;

    const teamPayload = getTeamPayload();
    if (!teamPayload) return;

    setSaving(true);
    try {
      await postJson(`/api/dashboard/coordinator/queue?email=${encodeURIComponent(user.email)}`, {
        eventId: selectedEvent.id,
        qrToken: token,
        teamName: teamEventSelected ? teamPayload.teamName : "",
        teammates: teamEventSelected ? teamPayload.teammates : [],
      });
      setScanToken("");
      setScanOpen(false);
      stopScanner();
      setTeamName("");
      setTeammates([]);
      await Promise.all([loadEvents(), loadRegisteredParticipants()]);
      showToast("success", "Participant added to queue.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to add participant");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!scanOpen || !selectedEvent || !eventStarted) {
      stopScanner();
      return;
    }

    let cancelled = false;

    const startScanner = async () => {
      setScanCameraError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setScanCameraError("Camera access is not supported in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          for (const track of stream.getTracks()) track.stop();
          return;
        }

        scannerStreamRef.current = stream;
        if (scannerVideoRef.current) {
          scannerVideoRef.current.srcObject = stream;
          await scannerVideoRef.current.play().catch(() => undefined);
        }
        setScanCameraReady(true);

        const frameCanvas = document.createElement("canvas");
        const frameContext = frameCanvas.getContext("2d", { willReadFrequently: true });
        if (!frameContext) {
          setScanCameraError("Camera opened, but the browser cannot read camera frames for QR decoding.");
          return;
        }

        const BarcodeDetectorCtor = (window as unknown as { BarcodeDetector?: new (options?: { formats?: string[] }) => { detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector;
        const detector = BarcodeDetectorCtor ? new BarcodeDetectorCtor({ formats: ["qr_code"] }) : null;

        scannerLoopTimerRef.current = window.setInterval(async () => {
          if (scanInFlightRef.current || !scannerVideoRef.current) return;

          try {
            let rawValue = "";

            if (detector) {
              const found = await detector.detect(scannerVideoRef.current);
              rawValue = (found[0]?.rawValue || "").trim();
            }

            if (!rawValue) {
              const video = scannerVideoRef.current;
              if (video.readyState >= 2) {
                const width = video.videoWidth;
                const height = video.videoHeight;

                if (width > 0 && height > 0) {
                  frameCanvas.width = width;
                  frameCanvas.height = height;
                  frameContext.drawImage(video, 0, 0, width, height);
                  const imageData = frameContext.getImageData(0, 0, width, height);
                  const decoded = jsQR(imageData.data, width, height, {
                    inversionAttempts: "dontInvert",
                  });
                  rawValue = (decoded?.data || "").trim();
                }
              }
            }

            if (!rawValue) return;

            const now = Date.now();
            if (lastScanRef.current.token === rawValue && now - lastScanRef.current.at < 1800) {
              return;
            }

            lastScanRef.current = { token: rawValue, at: now };
            setScanToken(rawValue);
            scanInFlightRef.current = true;
            await handleAddParticipant(rawValue);
          } catch {
            // Ignore transient detection errors and keep scanning.
          } finally {
            scanInFlightRef.current = false;
          }
        }, 450);
      } catch {
        setScanCameraError("Unable to access camera. Please allow camera permission and retry.");
      }
    };

    void startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanOpen, selectedEvent?.id, eventStarted]);

  const handleAddRegisteredParticipant = async (ticketId: number) => {
    if (!user || !selectedEvent) return;
    if (teamEditEntryId) {
      showToast("error", "Finish team edit or cancel it before adding a new participant.");
      return;
    }
    if (!eventStarted) {
      showToast("error", "Event is not started. Start the event first.");
      return;
    }

    const teamPayload = getTeamPayload();
    if (!teamPayload) return;

    setSaving(true);
    try {
      await postJson(`/api/dashboard/coordinator/queue?email=${encodeURIComponent(user.email)}`, {
        eventId: selectedEvent.id,
        ticketId,
        teamName: teamEventSelected ? teamPayload.teamName : "",
        teammates: teamEventSelected ? teamPayload.teammates : [],
      });
      setTeamName("");
      setTeammates([]);
      await Promise.all([loadEvents(), loadRegisteredParticipants()]);
      showToast("success", "Participant added to queue from list.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to add participant from list");
    } finally {
      setSaving(false);
    }
  };

  const handleAddOnSpotEntry = async () => {
    if (!user || !selectedEvent) return;
    if (teamEditEntryId) {
      showToast("error", "Finish team edit or cancel it before creating on-spot entry.");
      return;
    }
    if (!eventStarted) {
      showToast("error", "Event is not started. Start the event first.");
      return;
    }
    if (!selectedEvent.allowOnSpotEntry) {
      showToast("error", "On-spot entry is disabled for this event.");
      return;
    }

    const participantName = (prompt("On-spot participant name (required)") || "").trim();
    if (!participantName) {
      showToast("error", "Participant name is required for on-spot entry.");
      return;
    }

    const participantPhone = (prompt("Participant phone (required)") || "").trim();
    if (!participantPhone) {
      showToast("error", "Participant phone is required for on-spot entry.");
      return;
    }

    const participantEmail = (prompt("Participant email (required)") || "").trim();
    if (!participantEmail) {
      showToast("error", "Participant email is required for on-spot entry.");
      return;
    }

    const receipt = (prompt("Receipt number (required)") || "").trim();
    if (!receipt) {
      showToast("error", "Receipt number is required for on-spot entry.");
      return;
    }

    const teamPayload = getTeamPayload();
    if (!teamPayload) return;

    setSaving(true);
    try {
      await postJson(`/api/dashboard/coordinator/on-spot?email=${encodeURIComponent(user.email)}`, {
        eventId: selectedEvent.id,
        participantName,
        participantPhone,
        participantEmail,
        receipt,
        teamName: teamEventSelected ? teamPayload.teamName : "",
        teammates: teamEventSelected ? teamPayload.teammates : [],
      });
      setTeamName("");
      setTeammates([]);
      await Promise.all([loadEvents(), loadRegisteredParticipants()]);
      showToast("success", "On-spot entry added and queued.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to create on-spot entry");
    } finally {
      setSaving(false);
    }
  };

  const handleStartParticipant = async (entry: QueueEntry) => {
    if (!user || !selectedEvent) return;

    const opponentQueueEntryId = opponentByEntry[entry.id];
    if (versusEventSelected && !opponentQueueEntryId) {
      showToast("error", "Select an opponent before starting a versus match.");
      return;
    }

    setSaving(true);
    try {
      await postJson(`/api/dashboard/coordinator/rounds/start?email=${encodeURIComponent(user.email)}`, {
        eventId: selectedEvent.id,
        queueEntryId: entry.id,
        opponentQueueEntryId: versusEventSelected ? Number(opponentQueueEntryId) : undefined,
      });
      await Promise.all([loadEvents(), loadRegisteredParticipants()]);
      setOpponentByEntry((prev) => {
        const next = { ...prev };
        if (versusEventSelected && typeof opponentQueueEntryId === "number") {
          delete next[opponentQueueEntryId];
        }
        delete next[entry.id];
        return next;
      });
      showToast("success", "Game started for participant.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to start participant");
    } finally {
      setSaving(false);
    }
  };

  const handleEndParticipant = async (entry: QueueEntry) => {
    if (!user) return;
    const activeRound = rounds.find(
      (round) => round.status === "IN_PROGRESS" && (round.entryA.id === entry.id || round.entryB?.id === entry.id)
    );
    if (!activeRound) {
      showToast("error", "No active game found for this participant.");
      return;
    }

    setSaving(true);
    try {
      await postJson(`/api/dashboard/coordinator/rounds/end?email=${encodeURIComponent(user.email)}`, {
        roundId: activeRound.id,
      });
      await Promise.all([loadEvents(), loadRegisteredParticipants()]);
      showToast("success", "Game ended successfully.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to end game");
    } finally {
      setSaving(false);
    }
  };

  const handleScoreForEntry = async (entry: QueueEntry) => {
    if (!selectedEvent) return;
    const linked = rounds.find((round) => round.entryA.id === entry.id || round.entryB?.id === entry.id);
    if (!linked) {
      showToast("error", "No game found for this participant.");
      return;
    }

    const currentA = scoreByRound[linked.id]?.scoreA ?? linked.scoreA ?? 0;
    const currentB = scoreByRound[linked.id]?.scoreB ?? linked.scoreB ?? 0;

    const nextA = Number(prompt("Enter score A", String(currentA)) || currentA);
    const versus = isVsFormat(selectedEvent.format);
    const nextB = versus ? Number(prompt("Enter score B", String(currentB)) || currentB) : 0;

    if (Number.isNaN(nextA) || (versus && Number.isNaN(nextB))) {
      showToast("error", "Invalid score input");
      return;
    }

    setScoreByRound((prev) => ({
      ...prev,
      [linked.id]: { scoreA: nextA, scoreB: nextB },
    }));

    await handleAssignScore(linked);
  };

  const handleMoveStatus = async (entry: QueueEntry, target: QueueEntryStatus) => {
    if (!user) return;

    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/coordinator/queue/status?email=${encodeURIComponent(user.email)}`,
        { queueEntryId: entry.id, status: target },
        "PATCH"
      );
      await loadEvents();
      showToast("success", "Participant status updated.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update participant status");
    } finally {
      setSaving(false);
    }
  };

  const handleStartGame = async () => {
    if (!user || !selectedEvent) return;
    setSaving(true);
    try {
      await postJson(`/api/dashboard/coordinator/rounds/start?email=${encodeURIComponent(user.email)}`, {
        eventId: selectedEvent.id,
      });
      await loadEvents();
      showToast("success", "Game started.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to start game");
    } finally {
      setSaving(false);
    }
  };

  const handleEndGame = async (roundId: number) => {
    if (!user) return;
    setSaving(true);
    try {
      await postJson(`/api/dashboard/coordinator/rounds/end?email=${encodeURIComponent(user.email)}`, {
        roundId,
      });
      await loadEvents();
      showToast("success", "Round ended.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to end game");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignScore = async (
    round: EventRound,
    overrideScores?: { scoreA: number; scoreB: number }
  ) => {
    if (!user || !selectedEvent) return;
    const scores = overrideScores || scoreByRound[round.id] || { scoreA: round.scoreA ?? 0, scoreB: round.scoreB ?? 0 };
    const versus = isVsFormat(selectedEvent.format);

    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/coordinator/rounds/score?email=${encodeURIComponent(user.email)}`,
        {
          roundId: round.id,
          scoreA: Number(scores.scoreA || 0),
          scoreB: versus ? Number(scores.scoreB || 0) : null,
        },
        "PATCH"
      );
      await Promise.all([loadEvents(), loadRegisteredParticipants()]);
      showToast("success", "Score updated.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to assign score");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFromQueue = async (entryId: number) => {
    if (!user) return;
    setSaving(true);
    try {
      await fetch(`/api/dashboard/coordinator/queue/remove?email=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
        headers: header,
        body: JSON.stringify({ queueEntryId: entryId }),
      }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Failed to remove from queue");
      });
      await Promise.all([loadEvents(), loadRegisteredParticipants()]);
      showToast("success", "Participant removed from queue.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to remove from queue");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEventLiveState = async () => {
    if (!user || !selectedEvent) return;

    const nextStatus = selectedEvent.status === "STARTED" ? "PAUSED" : "STARTED";

    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/coordinator/event-meta?email=${encodeURIComponent(user.email)}`,
        {
          eventId: selectedEvent.id,
          status: nextStatus,
          venue: selectedEvent.venue,
        },
        "PATCH"
      );
      await loadEvents();
      showToast("success", `Event ${nextStatus === "STARTED" ? "started" : "paused"}.`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update event status");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main style={{ padding: 20 }}>Loading dashboard...</main>;
  if (error) return <main style={{ padding: 20 }}>Error: {error}</main>;
  if (!access?.isCoordinator) return <main style={{ padding: 20 }}>Coordinator dashboard access not available.</main>;

  const handleAddRemarks = async (round: EventRound) => {
    if (!user) return;

    const nextRemarks = prompt("Add match remarks", round.remarks || "");
    if (nextRemarks === null) return;

    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/coordinator/rounds/remarks?email=${encodeURIComponent(user.email)}`,
        {
          roundId: round.id,
          remarks: nextRemarks,
        },
        "PATCH"
      );
      await loadEvents();
      showToast("success", "Remarks updated.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update remarks");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStar = async (round: EventRound) => {
    if (!user) return;

    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/coordinator/rounds/star?email=${encodeURIComponent(user.email)}`,
        {
          roundId: round.id,
          isStarred: !round.isStarred,
        },
        "PATCH"
      );
      await loadEvents();
      showToast("success", !round.isStarred ? "Match starred." : "Match unstarred.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update star status");
    } finally {
      setSaving(false);
    }
  };

  const handleScoreForRound = async (round: EventRound) => {
    if (!selectedEvent) return;

    const currentA = scoreByRound[round.id]?.scoreA ?? round.scoreA ?? 0;
    const currentB = scoreByRound[round.id]?.scoreB ?? round.scoreB ?? 0;
    const versus = isVsFormat(selectedEvent.format);

    const nextA = Number(prompt("Enter score A", String(currentA)) || currentA);
    const nextB = versus ? Number(prompt("Enter score B", String(currentB)) || currentB) : 0;

    if (Number.isNaN(nextA) || (versus && Number.isNaN(nextB))) {
      showToast("error", "Invalid score input");
      return;
    }

    setScoreByRound((prev) => ({
      ...prev,
      [round.id]: { scoreA: nextA, scoreB: nextB },
    }));

    await handleAssignScore(round, { scoreA: nextA, scoreB: nextB });
  };

  const handleExportSelectedEventCompleted = async () => {
    if (!selectedEvent) {
      showToast("error", "Select an event first.");
      return;
    }

    const rows = buildCompletedExportRowsForEvent(selectedEvent);
    if (rows.length === 0) {
      showToast("error", "No completed data found for selected event.");
      return;
    }

    try {
      await downloadRowsAsExcel(rows, "Completed", `${selectedEvent.name}-completed`);
      showToast("success", `Exported completed data for ${selectedEvent.name}.`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to export selected event data");
    }
  };

  return (
    <main className={access.isSuperAdmin ? "dashboard-shell with-sidebar" : "dashboard-shell"}>
      {access.isSuperAdmin && (
        <aside className="dashboard-sidebar">
          <h3>Dashboard Views</h3>
          <button className="side-btn" onClick={() => router.push("/event-dashboard")}>Super User Dashboard</button>
          <button className="side-btn active" disabled>Coordinator Dashboard</button>

          <div className="assist-card desktop-assist">
            <h4>Dashboard Assistance</h4>
            <p>For any dashboard assistance - call website team.</p>
            <div className="assist-list">
              {DASHBOARD_ASSISTANCE_CONTACTS.map((contact) => (
                <div key={contact.name} className="assist-item">
                  <span>{contact.name}</span>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      <section className="dashboard-main">
        <h1>Event Management Dashboard</h1>
        <p>Manage participants with queue actions and live status transitions.</p>

        <section className="assist-card mobile-assist">
          <h4>Dashboard Assistance</h4>
          <p>For any dashboard assistance - call website team.</p>
          <div className="assist-list">
            {DASHBOARD_ASSISTANCE_CONTACTS.map((contact) => (
              <div key={contact.name} className="assist-item">
                <span>{contact.name}</span>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="header-row">
            <div>
              <h2>Select Event</h2>
              <p>Pick an event and manage entries from queue to completion.</p>
            </div>
            <div className="header-actions">
              <button onClick={() => loadEvents()} disabled={saving}>Refresh</button>
              <button onClick={handleExportSelectedEventCompleted} disabled={saving || !selectedEvent}>Export Event Excel</button>
            </div>
          </div>

          <div className="selector-row">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Select event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <div className="chip-row">
              <span className="chip">{selectedEvent.category}</span>
              <span className="chip">{selectedEvent.venue || "Venue pending"}</span>
              <span className="chip">{selectedEvent.status}</span>
              <label
                className="live-switch-wrap"
                title={selectedEvent.status === "STARTED" ? "Pause event" : "Start event"}
              >
                <span className="live-switch-text">
                  {selectedEvent.status === "STARTED" ? "Event Started" : "Event Paused"}
                </span>
                <input
                  type="checkbox"
                  className="live-switch-input"
                  checked={selectedEvent.status === "STARTED"}
                  onChange={() => handleToggleEventLiveState()}
                  disabled={saving}
                  aria-label="Toggle event started or paused"
                />
                <span className="live-switch-slider" />
              </label>
            </div>
          )}
        </section>

        <section className="dashboard-card">
          <div className="header-row">
            <div>
              <h2>Registered Participants ({registeredParticipants.length})</h2>
              <p>All participants from DB for selected event scope. Add from here or scan ticket.</p>
            </div>
            <button onClick={() => loadRegisteredParticipants()} disabled={saving || registeredLoading || !selectedEvent}>
              Refresh List
            </button>
          </div>

          <input
            placeholder="Search registered participants..."
            value={registeredSearch}
            onChange={(e) => setRegisteredSearch(e.target.value)}
            disabled={!selectedEvent}
          />

          <div className="table-wrap">
            <table className="participants-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>State</th>
                  <th>Add</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegisteredParticipants.map((participant) => {
                  const ready = !participant.isPlayed && !participant.inQueue;
                  const state = participant.inQueue ? "IN_QUEUE" : participant.isPlayed ? "USED" : "READY";

                  return (
                    <tr key={participant.id}>
                      <td>{participant.participantName}</td>
                      <td>{participant.participantEmail}</td>
                      <td>{participant.participantPhone || "-"}</td>
                      <td><span className="status-pill">{state}</span></td>
                      <td>
                        <button
                          className="icon-action success"
                          onClick={() => handleAddRegisteredParticipant(participant.id)}
                          title="Add to queue"
                          aria-label={`Add ${participant.participantName} to queue`}
                          disabled={saving || !ready || !eventStarted}
                        >
                          <ActionIcon type="add" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {selectedEvent && filteredRegisteredParticipants.length === 0 && !registeredLoading && (
                  <tr>
                    <td colSpan={5} className="empty-cell">No registered participants found for this event.</td>
                  </tr>
                )}
                {selectedEvent && registeredLoading && (
                  <tr>
                    <td colSpan={5} className="empty-cell">Loading registered participants...</td>
                  </tr>
                )}
                {!selectedEvent && (
                  <tr>
                    <td colSpan={5} className="empty-cell">Select an event to load registered participants.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="tab-row">
            <button className={viewTab === "ALL" ? "tab-btn active" : "tab-btn"} onClick={() => setViewTab("ALL")}>All ({counters.all})</button>
            <button className={viewTab === "QUEUED" ? "tab-btn active" : "tab-btn"} onClick={() => setViewTab("QUEUED")}>Queue ({counters.queued})</button>
            <button className={viewTab === "IN_PROGRESS" ? "tab-btn active" : "tab-btn"} onClick={() => setViewTab("IN_PROGRESS")}>Active ({counters.active})</button>
            <button className={viewTab === "COMPLETED" ? "tab-btn active" : "tab-btn"} onClick={() => setViewTab("COMPLETED")}>Completed ({counters.completed})</button>
          </div>

          <div className="toolbar-row">
            <input
              placeholder="Search participants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className={scanOpen ? "scan-btn active" : "scan-btn"}
              onClick={() => setScanOpen((prev) => !prev)}
              disabled={saving || !selectedEvent || !eventStarted}
            >
              {scanOpen ? "Close Scanner" : "Scan Ticket"}
            </button>
            <button
              className="scan-btn"
              onClick={handleAddOnSpotEntry}
              disabled={
                saving ||
                !selectedEvent ||
                !eventStarted ||
                !selectedEvent.allowOnSpotEntry
              }
              title={
                selectedEvent && !selectedEvent.allowOnSpotEntry
                  ? "Enable on-spot entry from Web Admin event settings"
                  : "Add on-spot participant"
              }
            >
              On-Spot Entry
            </button>
          </div>

          {selectedEvent && !eventStarted && (
            <div className="event-locked-banner">
              Event is not started. Turn on event start toggle to enable scan, add, queue, and round actions.
            </div>
          )}

          {scanOpen && (
            <div className="scanner-panel">
              <div className="scanner-preview-wrap">
                <video
                  ref={scannerVideoRef}
                  className="scanner-video"
                  autoPlay
                  muted
                  playsInline
                />
              </div>
              {!scanCameraReady && !scanCameraError && (
                <p className="scanner-help">Starting camera...</p>
              )}
              {scanCameraError && <p className="scanner-error">{scanCameraError}</p>}
              <div className="scan-row">
                <input
                  placeholder="Paste/scan QR token"
                  value={scanToken}
                  onChange={(e) => setScanToken(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddParticipant();
                  }}
                />
                <button onClick={() => handleAddParticipant()} disabled={saving || !selectedEvent || !eventStarted || !scanToken.trim()}>
                  Add
                </button>
              </div>
            </div>
          )}

          {selectedEvent && teamEventSelected && (
            <div className="teammates-block">
              <div className="teammate-actions">
                <h3>{teamEditEntryId ? "Edit Team Details (Queued Participant)" : "Team Details (Optional for next add)"}</h3>
                <button
                  type="button"
                  className="small-btn"
                  onClick={handleAddTeammateRow}
                  disabled={saving || teammates.length >= teammateLimit}
                >
                  Add Teammate
                </button>
              </div>
              {teamEditEntryId && (
                <div className="edit-actions-inline">
                  <button
                    type="button"
                    className="small-btn success"
                    onClick={handleSaveTeamEdit}
                    disabled={saving}
                  >
                    Save Team Edit
                  </button>
                  <button
                    type="button"
                    className="small-btn"
                    onClick={handleCancelTeamEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <p className="teammates-note">
                Team name is optional. Teammates are optional. If teammate row has any value, name is required.
              </p>

              <input
                placeholder="Team name (optional)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />

              {teammates.length === 0 && <p className="teammates-empty">No teammates added.</p>}

              {teammates.map((teammate, index) => (
                <div className="teammate-grid" key={`${selectedEvent.id}-teammate-${index}`}>
                  <input
                    placeholder="Teammate name"
                    value={teammate.name}
                    onChange={(e) => handleTeammateField(index, "name", e.target.value)}
                  />
                  <input
                    placeholder="Teammate email (optional)"
                    value={teammate.email}
                    onChange={(e) => handleTeammateField(index, "email", e.target.value)}
                  />
                  <input
                    placeholder="Teammate phone (optional)"
                    value={teammate.phone}
                    onChange={(e) => handleTeammateField(index, "phone", e.target.value)}
                  />
                  <button
                    type="button"
                    className="small-btn danger"
                    onClick={() => handleRemoveTeammateRow(index)}
                    disabled={saving}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="table-wrap">
            <table className="participants-table">
              <thead>
                <tr>
                  <th>{viewTab === "IN_PROGRESS" || viewTab === "COMPLETED" ? "Match" : "Participant"}</th>
                  <th>{viewTab === "IN_PROGRESS" || viewTab === "COMPLETED" ? "Emails" : "Email"}</th>
                  <th>{viewTab === "IN_PROGRESS" || viewTab === "COMPLETED" ? "Phones" : "Phone"}</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>{viewTab === "IN_PROGRESS" || viewTab === "COMPLETED" ? "Started At" : "Queued At"}</th>
                  <th>Completed At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(viewTab === "IN_PROGRESS") && filteredPairedQueueMatches.map(({ entryA, entryB }) => {
                  return (
                    <tr key={`queued-pair-${entryA.id}-${entryB.id}`} className={rowToneClass("QUEUED")}>
                      <td>
                        <div className="participant-cell">
                          <div className="participant-name">{entryA.participantName} vs {entryB.participantName}</div>
                        </div>
                      </td>
                      <td>
                        <div className="pair-meta-cell">
                          <span>{entryA.participantEmail}</span>
                          <span>{entryB.participantEmail}</span>
                        </div>
                      </td>
                      <td>
                        <div className="pair-meta-cell">
                          <span>{entryA.participantPhone || "-"}</span>
                          <span>{entryB.participantPhone || "-"}</span>
                        </div>
                      </td>
                      <td><span className="status-pill">Queue</span></td>
                      <td>-</td>
                      <td>{formatDate(entryA.queuedAt)}</td>
                      <td>-</td>
                      <td>
                        <div className="actions-row">
                          <button
                            className="icon-action success"
                            onClick={() => handleStartParticipant(entryA)}
                            title="Start match"
                            aria-label={`Start match ${entryA.participantName} vs ${entryB.participantName}`}
                            disabled={saving || !eventStarted}
                          >
                            <ActionIcon type="play" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {(viewTab === "IN_PROGRESS") && filteredInProgressRounds.map((round) => {
                  const entryA = queueEntryById.get(round.entryA.id);
                  const entryB = round.entryB ? queueEntryById.get(round.entryB.id) : null;
                  const teamMetaA = entryA ? getTeamMeta(entryA) : null;
                  const teamMetaB = entryB ? getTeamMeta(entryB) : null;

                  return (
                    <tr key={`round-${round.id}`} className={rowToneClass("IN_PROGRESS")}>
                      <td>
                        <div className="participant-cell">
                          <div className="participant-name">{round.entryA.participantName}{round.entryB ? ` vs ${round.entryB.participantName}` : ""}</div>
                          {teamMetaA?.teamName && <div className="team-chip">A: {teamMetaA.teamName}</div>}
                          {teamMetaB?.teamName && <div className="team-chip">B: {teamMetaB.teamName}</div>}
                          {round.remarks && <div className="remarks-inline">Remarks: {round.remarks}</div>}
                        </div>
                      </td>
                      <td>
                        <div className="pair-meta-cell">
                          <span>{entryA?.participantEmail || "-"}</span>
                          {entryB?.participantEmail && <span>{entryB.participantEmail}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="pair-meta-cell">
                          <span>{entryA?.participantPhone || "-"}</span>
                          {entryB?.participantPhone && <span>{entryB.participantPhone}</span>}
                        </div>
                      </td>
                      <td><span className="status-pill">{prettyQueueStatus(round.status)}</span></td>
                      <td>{round.entryB ? `${round.scoreA ?? 0} - ${round.scoreB ?? 0}` : `${round.scoreA ?? 0}`}</td>
                      <td>{formatDate(round.startedAt)}</td>
                      <td>{formatDate(round.endedAt)}</td>
                      <td>
                        <div className="actions-row">
                          {round.status === "IN_PROGRESS" && (
                            <button
                              className="icon-action note"
                              onClick={() => handleAddRemarks(round)}
                              title="Add remarks"
                              aria-label={`Add remarks for match ${round.id}`}
                              disabled={saving || !eventStarted}
                            >
                              <ActionIcon type="note" />
                            </button>
                          )}

                          {round.status === "IN_PROGRESS" && (
                            <button
                              className="icon-action danger"
                              onClick={() => handleEndGame(round.id)}
                              title="End match"
                              aria-label={`End match ${round.entryA.participantName}${round.entryB ? ` vs ${round.entryB.participantName}` : ""}`}
                              disabled={saving || !eventStarted}
                            >
                              <ActionIcon type="stop" />
                            </button>
                          )}

                          {round.status === "COMPLETED" && (
                            <button
                              className="icon-action warn"
                              onClick={() => handleAssignScore(round)}
                              title="Assign score"
                              aria-label={`Assign score for match ${round.id}`}
                              disabled={saving || !eventStarted}
                            >
                              <ActionIcon type="score" />
                            </button>
                          )}

                          {round.status === "COMPLETED" && (
                            <button
                              className="icon-action muted"
                              onClick={() => handleAssignScore(round)}
                              title="Edit score"
                              aria-label={`Edit score for match ${round.id}`}
                              disabled={saving || !eventStarted}
                            >
                              <ActionIcon type="edit" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {(viewTab === "COMPLETED") && filteredCompletedRounds.map((round) => {
                  const entryA = queueEntryById.get(round.entryA.id);
                  const entryB = round.entryB ? queueEntryById.get(round.entryB.id) : null;
                  const teamMetaA = entryA ? getTeamMeta(entryA) : null;
                  const teamMetaB = entryB ? getTeamMeta(entryB) : null;

                  return (
                    <tr key={`round-${round.id}`} className={rowToneClass("COMPLETED")}>
                      <td>
                        <div className="participant-cell">
                          <div className="match-header-row">
                            <button
                              className={round.isStarred ? "match-star-btn active" : "match-star-btn"}
                              onClick={() => handleToggleStar(round)}
                              title={round.isStarred ? "Unstar match" : "Star match"}
                              aria-label={`${round.isStarred ? "Unstar" : "Star"} match ${round.id}`}
                              disabled={saving}
                            >
                              <ActionIcon type="star" filled={round.isStarred} />
                            </button>
                            <div className="participant-name">{round.entryA.participantName}{round.entryB ? ` vs ${round.entryB.participantName}` : ""}</div>
                          </div>
                          {teamMetaA?.teamName && <div className="team-chip">A: {teamMetaA.teamName}</div>}
                          {teamMetaB?.teamName && <div className="team-chip">B: {teamMetaB.teamName}</div>}
                          {round.remarks && <div className="remarks-inline">Remarks: {round.remarks}</div>}
                        </div>
                      </td>
                      <td>
                        <div className="pair-meta-cell">
                          <span>{entryA?.participantEmail || "-"}</span>
                          {entryB?.participantEmail && <span>{entryB.participantEmail}</span>}
                        </div>
                      </td>
                      <td>
                        <div className="pair-meta-cell">
                          <span>{entryA?.participantPhone || "-"}</span>
                          {entryB?.participantPhone && <span>{entryB.participantPhone}</span>}
                        </div>
                      </td>
                      <td><span className="status-pill">{prettyQueueStatus(round.status)}</span></td>
                      <td>{round.entryB ? `${round.scoreA ?? 0} - ${round.scoreB ?? 0}` : `${round.scoreA ?? 0}`}</td>
                      <td>{formatDate(round.startedAt)}</td>
                      <td>{formatDate(round.endedAt)}</td>
                      <td>
                        <div className="actions-row">
                          <button
                            className="icon-action note"
                            onClick={() => handleAddRemarks(round)}
                            title="Add remarks"
                            aria-label={`Add remarks for match ${round.id}`}
                            disabled={saving}
                          >
                            <ActionIcon type="note" />
                          </button>

                          <button
                            className="icon-action warn"
                            onClick={() => handleScoreForRound(round)}
                            title="Assign score"
                            aria-label={`Assign score for match ${round.id}`}
                            disabled={saving || !eventStarted}
                          >
                            <ActionIcon type="score" />
                          </button>

                          <button
                            className="icon-action muted"
                            onClick={() => handleScoreForRound(round)}
                            title="Edit score"
                            aria-label={`Edit score for match ${round.id}`}
                            disabled={saving || !eventStarted}
                          >
                            <ActionIcon type="edit" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {(viewTab === "ALL" || viewTab === "QUEUED") && filteredEntries.map((entry) => {
                  const teamMeta = getTeamMeta(entry);
                  const queuedOpponents = versusEventSelected
                    ? queueEntries.filter((candidate) => candidate.status === "QUEUED" && candidate.id !== entry.id)
                    : [];
                  const selectedOpponentId = opponentByEntry[entry.id] ?? "";

                  return (
                  <tr key={entry.id} className={rowToneClass(entry.status)}>
                    <td>
                      <div className="participant-cell">
                        <div className="participant-name">{entry.participantName}</div>
                        {teamMeta?.teamName && <div className="team-chip">Team: {teamMeta.teamName}</div>}
                        {teamMeta && teamMeta.teammates.length > 0 && (
                          <div className="teammates-inline">
                            Members: {teamMeta.teammates.map((row) => row.name || row.email || row.phone).join(", ")}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{entry.participantEmail}</td>
                    <td>{entry.participantPhone || "-"}</td>
                    <td><span className="status-pill">{prettyQueueStatus(entry.status)}</span></td>
                    <td>
                      {
                        (() => {
                          const linked = rounds.find((round) => round.entryA.id === entry.id || round.entryB?.id === entry.id);
                          if (!linked) return "-";
                          return linked.entryB
                            ? `${linked.scoreA ?? 0} - ${linked.scoreB ?? 0}`
                            : `${linked.scoreA ?? 0}`;
                        })()
                      }
                    </td>
                    <td>{formatDate(entry.queuedAt)}</td>
                    <td>{formatDate(entry.completedAt)}</td>
                    <td>
                      <div className="actions-row">
                        {entry.status === "QUEUED" && versusEventSelected && (
                          <select
                            className="opponent-select"
                            value={selectedOpponentId}
                            onChange={(e) => handleOpponentChange(entry.id, e.target.value)}
                            disabled={saving || !eventStarted || queuedOpponents.length === 0}
                            aria-label={`Select opponent for ${entry.participantName}`}
                          >
                            <option value="">Select opponent</option>
                            {queuedOpponents.map((opponent) => (
                              <option key={opponent.id} value={opponent.id}>
                                {opponent.participantName}
                              </option>
                            ))}
                          </select>
                        )}

                        {entry.status === "QUEUED" && (
                          <button
                            className="icon-action success"
                            onClick={() => handleStartParticipant(entry)}
                            title="Start"
                            aria-label={`Start ${entry.participantName}`}
                            disabled={saving || !eventStarted || (versusEventSelected && !selectedOpponentId)}
                          >
                            <ActionIcon type="play" />
                          </button>
                        )}

                        {entry.status === "QUEUED" && (
                          <button
                            className="icon-action danger-ghost"
                            onClick={() => handleRemoveFromQueue(entry.id)}
                            title="Unqueue"
                            aria-label={`Unqueue ${entry.participantName}`}
                            disabled={saving || !eventStarted}
                          >
                            <ActionIcon type="remove" />
                          </button>
                        )}

                        {entry.status === "QUEUED" && teamEventSelected && (
                          <button
                            className={teamEditEntryId === entry.id ? "icon-action muted active-edit" : "icon-action muted"}
                            onClick={() => handleEditTeamForEntry(entry)}
                            title="Edit team details"
                            aria-label={`Edit team details for ${entry.participantName}`}
                            disabled={saving}
                          >
                            <ActionIcon type="edit" />
                          </button>
                        )}

                        {entry.status === "IN_PROGRESS" && (
                          <button
                            className="icon-action danger"
                            onClick={() => handleEndParticipant(entry)}
                            title="End"
                            aria-label={`End ${entry.participantName}`}
                            disabled={saving || !eventStarted}
                          >
                            <ActionIcon type="stop" />
                          </button>
                        )}

                        {entry.status === "COMPLETED" && (
                          <button
                            className="icon-action warn"
                            onClick={() => handleScoreForEntry(entry)}
                            title="Assign score"
                            aria-label={`Assign score for ${entry.participantName}`}
                            disabled={saving || !eventStarted || !rounds.some((round) => round.entryA.id === entry.id || round.entryB?.id === entry.id)}
                          >
                            <ActionIcon type="score" />
                          </button>
                        )}

                        {entry.status === "COMPLETED" && (
                        <button
                          className="icon-action muted"
                          onClick={() => handleScoreForEntry(entry)}
                          title="Edit score"
                          aria-label={`Edit score for ${entry.participantName}`}
                          disabled={saving || !eventStarted || !rounds.some((round) => round.entryA.id === entry.id || round.entryB?.id === entry.id)}
                        >
                          <ActionIcon type="edit" />
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
                {((viewTab === "ALL" || viewTab === "QUEUED") && filteredEntries.length === 0) && (
                  <tr>
                    <td colSpan={8} className="empty-cell">No participants in this tab yet. Use Scan Ticket to add to queue.</td>
                  </tr>
                )}
                {(viewTab === "IN_PROGRESS" && filteredPairedQueueMatches.length === 0 && filteredInProgressRounds.length === 0) && (
                  <tr>
                    <td colSpan={8} className="empty-cell">No matches in this tab yet.</td>
                  </tr>
                )}
                {(viewTab === "COMPLETED" && filteredCompletedRounds.length === 0) && (
                  <tr>
                    <td colSpan={8} className="empty-cell">No matches in this tab yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>


      </section>

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className={toast.kind === "success" ? "toast toast-success" : "toast toast-error"}>
            {toast.message}
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          display: grid;
          gap: 20px;
        }

        .with-sidebar {
          max-width: 1380px;
          grid-template-columns: 260px minmax(0, 1fr);
          align-items: start;
        }

        .dashboard-main {
          display: grid;
          gap: 18px;
        }

        .dashboard-sidebar {
          position: sticky;
          top: 18px;
          border: 1px solid #d9d9d9;
          border-radius: 20px;
          padding: 16px;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          display: grid;
          gap: 10px;
        }

        .assist-card {
          margin-top: 6px;
          border: 1px solid #d9e0ea;
          border-radius: 14px;
          background: #f8fafc;
          padding: 12px;
          display: grid;
          gap: 8px;
        }

        .assist-card h4 {
          margin: 0;
          font-size: 14px;
          color: #0f172a;
        }

        .assist-card p {
          margin: 0;
          font-size: 12px;
          color: #475569;
        }

        .assist-list {
          display: grid;
          gap: 6px;
        }

        .assist-item {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 12px;
          color: #0f172a;
          align-items: center;
        }

        .assist-item a {
          color: #1d4ed8;
          font-weight: 700;
          text-decoration: none;
        }

        .assist-item a:hover {
          text-decoration: underline;
        }

        .mobile-assist {
          display: none;
        }

        .dashboard-shell:not(.with-sidebar) .mobile-assist {
          display: grid;
        }

        .side-btn {
          border: 1px solid #d3d3d3;
          border-radius: 12px;
          background: #f3f4f6;
          color: #111827;
          font-weight: 600;
          min-height: 40px;
          cursor: pointer;
        }

        .side-btn.active {
          background: #111827;
          color: #fff;
          border-color: #111827;
        }

        .dashboard-card {
          border: 1px solid #d9d9d9;
          border-radius: 20px;
          padding: 18px;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
          display: grid;
          gap: 14px;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: start;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .header-row h2 {
          margin: 0;
        }

        .header-row p {
          margin: 4px 0 0;
          color: #64748b;
        }

        .selector-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .toolbar-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 10px;
          align-items: center;
        }

        .scan-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
        }

        .scanner-panel {
          border: 1px solid #d6deea;
          border-radius: 14px;
          padding: 10px;
          background: #f8fafc;
          display: grid;
          gap: 10px;
        }

        .scanner-preview-wrap {
          width: min(100%, 420px);
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #d6deea;
          background: #0f172a;
        }

        .scanner-video {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          display: block;
        }

        .scanner-help {
          margin: 0;
          font-size: 12px;
          color: #334155;
          font-weight: 600;
        }

        .scanner-error {
          margin: 0;
          font-size: 12px;
          color: #991b1b;
          font-weight: 700;
        }

        .scan-btn.active {
          background: #15803d;
          border-color: #15803d;
        }

        .event-locked-banner {
          border: 1px solid #fca5a5;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 13px;
          font-weight: 700;
        }

        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .teammates-block {
          border: 1px solid #d6deea;
          border-radius: 14px;
          padding: 12px;
          background: #f8fafc;
          display: grid;
          gap: 8px;
        }

        .teammate-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .teammate-actions h3 {
          margin: 0;
          font-size: 14px;
        }

        .teammates-note,
        .teammates-empty {
          margin: 0;
          font-size: 12px;
          color: #475569;
        }

        .edit-actions-inline {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .teammate-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr auto;
          gap: 8px;
        }

        .small-btn {
          min-height: 34px;
          padding: 0 10px;
          font-size: 12px;
        }

        .small-btn.danger {
          background: #991b1b;
          border-color: #991b1b;
          color: #fff;
        }

        .chip {
          border: 1px solid #d6deea;
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 12px;
          color: #334155;
          background: #f8fafc;
        }

        .live-switch-wrap {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 2px 2px 2px 8px;
          border: 1px solid #d6deea;
          border-radius: 999px;
          background: #f8fafc;
        }

        .live-switch-text {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          white-space: nowrap;
        }

        .live-switch-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .live-switch-slider {
          position: relative;
          width: 46px;
          height: 26px;
          border-radius: 999px;
          background: #9ca3af;
          transition: background-color 180ms ease;
          cursor: pointer;
          flex: 0 0 auto;
        }

        .live-switch-slider::before {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          top: 3px;
          left: 3px;
          transition: transform 180ms ease;
          box-shadow: 0 1px 2px rgba(2, 6, 23, 0.25);
        }

        .live-switch-input:checked + .live-switch-slider {
          background: #16a34a;
        }

        .live-switch-input:checked + .live-switch-slider::before {
          transform: translateX(20px);
        }

        .live-switch-input:disabled + .live-switch-slider {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .tab-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .round-action-row {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
        }

        .game-btn {
          border: 1px solid transparent;
          border-radius: 10px;
          min-height: 34px;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          color: #ffffff;
        }

        .game-btn.start {
          background: #15803d;
          border-color: #15803d;
        }

        .game-btn.end {
          background: #b91c1c;
          border-color: #b91c1c;
        }

        .game-btn.score {
          background: #a16207;
          border-color: #a16207;
        }

        .tab-btn {
          border: 1px solid #d3d3d3;
          border-radius: 12px;
          min-height: 38px;
          background: #f3f4f6;
          color: #334155;
          font-weight: 700;
          cursor: pointer;
        }

        .tab-btn.active {
          background: #0f172a;
          color: #fff;
          border-color: #0f172a;
        }

        .table-wrap {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: auto;
        }

        .participants-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 980px;
        }

        .participants-table th,
        .participants-table td {
          border-bottom: 1px solid #e5e7eb;
          padding: 10px;
          text-align: left;
          vertical-align: top;
          font-size: 14px;
        }

        .participants-table tbody tr.row-tone-default {
          background: #ffffff;
        }

        .participants-table tbody tr.row-tone-queued {
          background: #fffbeb;
        }

        .participants-table tbody tr.row-tone-active {
          background: #f0fdf4;
        }

        .participants-table tbody tr.row-tone-completed {
          background: #eff6ff;
        }

        .participants-table th {
          background: #f8fafc;
          color: #334155;
          font-weight: 700;
        }

        .status-pill {
          border: 1px solid #d6deea;
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 12px;
          color: #334155;
          background: #f8fafc;
          display: inline-flex;
        }

        .participant-cell {
          display: grid;
          gap: 4px;
        }

        .participant-name {
          font-weight: 600;
          color: #0f172a;
        }

        .match-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .match-star-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1px solid #dbe2ea;
          border-radius: 999px;
          background: #ffffff;
          color: #cbd5e1;
          padding: 0;
        }

        .match-star-btn.active {
          border-color: #facc15;
          color: #facc15;
          background: #fffbeb;
        }

        .match-star-btn :global(svg) {
          width: 16px;
          height: 16px;
        }

        .team-chip {
          display: inline-flex;
          width: fit-content;
          border: 1px solid #d6deea;
          border-radius: 999px;
          padding: 2px 8px;
          font-size: 11px;
          color: #0f766e;
          background: #ecfeff;
        }

        .teammates-inline {
          font-size: 12px;
          color: #475569;
        }

        .remarks-inline {
          font-size: 12px;
          color: #475569;
        }

        .pair-meta-cell {
          display: grid;
          gap: 2px;
          font-size: 13px;
          color: #0f172a;
        }

        .actions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .opponent-select {
          min-height: 34px;
          border: 1px solid #cfd8e6;
          border-radius: 10px;
          padding: 0 8px;
          font-size: 12px;
          max-width: 180px;
          background: #ffffff;
          color: #0f172a;
        }

        .icon-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #cfd8e6;
          border-radius: 10px;
          background: #0f172a;
          color: #ffffff;
          padding: 0 10px;
          min-height: 34px;
          font-size: 12px;
          font-weight: 700;
        }

        .icon-action.success {
          background: #166534;
          border-color: #166534;
        }

        .icon-action.warn {
          background: #a16207;
          border-color: #a16207;
        }

        .icon-action.note {
          background: #0f766e;
          border-color: #0f766e;
        }

        .icon-action.muted {
          background: #475569;
          border-color: #475569;
        }

        .icon-action.active-edit {
          background: #1d4ed8;
          border-color: #1d4ed8;
        }

        .icon-action.danger-ghost {
          background: #991b1b;
          border-color: #991b1b;
        }

        .icon-action :global(svg) {
          width: 14px;
          height: 14px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .empty-cell {
          text-align: center;
          color: #64748b;
        }

        .toast-stack {
          position: fixed;
          right: 18px;
          bottom: 18px;
          display: grid;
          gap: 8px;
          z-index: 1000;
          max-width: 360px;
        }

        .toast {
          border-radius: 12px;
          padding: 10px 12px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 10px 20px rgba(2, 6, 23, 0.28);
        }

        .toast-success {
          background: #166534;
        }

        .toast-error {
          background: #991b1b;
        }

        .dashboard-main :global(input),
        .dashboard-main :global(select) {
          border: 1px solid #d3d3d3;
          border-radius: 12px;
          padding: 10px 12px;
          min-height: 40px;
          background: #fff;
        }

        .score-input {
          width: 72px;
          min-height: 34px;
        }

        .dashboard-main :global(button) {
          border: 1px solid #d3d3d3;
          border-radius: 10px;
          padding: 0 12px;
          min-height: 38px;
          background: #111827;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .dashboard-main :global(button:disabled) {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dashboard-main :global(button).match-star-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          min-height: 28px;
          border: 1px solid #dbe2ea;
          border-radius: 999px;
          background: #ffffff;
          color: #d1d5db;
          padding: 0;
        }

        .dashboard-main :global(button).match-star-btn.active {
          border-color: #facc15;
          color: #facc15;
          background: #fffbeb;
        }

        .dashboard-main :global(button).match-star-btn :global(svg) {
          width: 16px;
          height: 16px;
          fill: none;
          stroke: currentColor;
        }

        .dashboard-main :global(button).match-star-btn :global(svg path) {
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
        }

        .dashboard-main :global(button).match-star-btn.active :global(svg path) {
          fill: currentColor;
          stroke: currentColor;
        }

        @media (max-width: 980px) {
          .dashboard-shell {
            padding: 12px;
            gap: 12px;
          }

          .dashboard-card {
            padding: 12px;
            border-radius: 14px;
          }

          .header-row {
            flex-direction: column;
            align-items: stretch;
          }

          .header-actions {
            width: 100%;
            justify-content: stretch;
          }

          .header-actions :global(button) {
            flex: 1;
          }

          .with-sidebar {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            position: static;
          }

          .desktop-assist {
            display: none;
          }

          .mobile-assist {
            display: grid;
          }

          .selector-row,
          .toolbar-row,
          .scan-row,
          .tab-row,
          .teammate-grid {
            grid-template-columns: 1fr;
          }

          .participants-table {
            min-width: 760px;
          }

          .participants-table th,
          .participants-table td {
            padding: 8px;
            font-size: 12px;
          }

          .actions-row {
            gap: 4px;
          }

          .icon-action {
            min-height: 30px;
            padding: 0 8px;
            font-size: 11px;
          }

          .opponent-select {
            min-height: 30px;
            font-size: 11px;
            max-width: 160px;
          }

          .dashboard-main :global(input),
          .dashboard-main :global(select),
          .dashboard-main :global(button) {
            min-height: 36px;
          }

          .toast-stack {
            left: 12px;
            right: 12px;
            max-width: none;
          }
        }

        @media (max-width: 640px) {
          .participants-table {
            min-width: 680px;
          }

          .tab-btn {
            min-height: 34px;
            font-size: 11px;
          }

          .scanner-preview-wrap {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
