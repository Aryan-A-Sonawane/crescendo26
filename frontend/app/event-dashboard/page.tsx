"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ManagedEvent = {
  id: number;
  name: string;
  category: string;
  format: "SINGLE_PARTICIPANT" | "SINGLE_VS_SINGLE" | "TEAM_SOLO" | "TEAM_VS_TEAM";
  teamSize: number | null;
  venue: string | null;
  allowOnSpotEntry: boolean;
  status: "NOT_STARTED" | "STARTED" | "PAUSED" | "COMPLETED";
};

type AccessResponse = {
  email: string;
  isSuperAdmin: boolean;
  isCoordinator: boolean;
  showDashboardAccess: boolean;
};

type CoordinatorAccessRow = {
  email: string;
  role: "SUPER_ADMIN" | "COORDINATOR";
  assignments?: Array<{
    eventId: number;
    event?: { id: number; name: string; category: string };
  }>;
};

type StoredUser = { name: string; email: string };
type DashboardTab = "overview" | "users" | "events";

const FORMAT_OPTIONS: ManagedEvent["format"][] = [
  "SINGLE_PARTICIPANT",
  "SINGLE_VS_SINGLE",
  "TEAM_SOLO",
  "TEAM_VS_TEAM",
];

const STATUS_OPTIONS: ManagedEvent["status"][] = ["NOT_STARTED", "STARTED", "PAUSED", "COMPLETED"];
const CATEGORY_OPTIONS = ["Technical", "EC", "Sports"] as const;

function prettyFormat(value: ManagedEvent["format"]) {
  if (value === "SINGLE_PARTICIPANT") return "One At A Time";
  if (value === "SINGLE_VS_SINGLE") return "Solo vs Solo";
  if (value === "TEAM_SOLO") return "Team (One Team At A Time)";
  return "Team vs Team";
}

function initialsFromEmail(email: string) {
  const parts = email.split("@")[0].split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export default function EventDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [access, setAccess] = useState<AccessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tab, setTab] = useState<DashboardTab>("users");

  const [adminEvents, setAdminEvents] = useState<ManagedEvent[]>([]);
  const [coordinators, setCoordinators] = useState<CoordinatorAccessRow[]>([]);

  const [searchUsers, setSearchUsers] = useState("");
  const [searchEvents, setSearchEvents] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "SUPER_ADMIN" | "COORDINATOR">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ManagedEvent["status"]>("ALL");

  const [grantEmail, setGrantEmail] = useState("");
  const [grantRole, setGrantRole] = useState<"SUPER_ADMIN" | "COORDINATOR">("COORDINATOR");
  const [grantEventId, setGrantEventId] = useState<number | "">("");

  const [inlineEventByEmail, setInlineEventByEmail] = useState<Record<string, number | "">>({});

  const [editingEvent, setEditingEvent] = useState<ManagedEvent | null>(null);
  const [saving, setSaving] = useState(false);

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
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await delay(250);
          continue;
        }
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }

    throw new Error("Network error while contacting dashboard APIs.");
  };

  const postJson = async (url: string, body: unknown, method: "POST" | "PATCH" | "DELETE" = "POST") => {
    return requestJson(url, { method, headers: header, body: JSON.stringify(body) });
  };

  const loadAccess = async (email: string) => {
    const data = await requestJson(`/api/dashboard/me?email=${encodeURIComponent(email)}`);
    setAccess(data);
    return data as AccessResponse;
  };

  const loadAdminData = async (emailOverride?: string) => {
    const email = emailOverride || user?.email;
    if (!email) return;

    const [eventsData, coordinatorsData] = await Promise.all([
      requestJson(`/api/dashboard/super-admin/events?email=${encodeURIComponent(email)}`),
      requestJson(`/api/dashboard/super-admin/coordinators?email=${encodeURIComponent(email)}`),
    ]);

    const events = eventsData.events || [];
    setAdminEvents(events);
    setGrantEventId((prev) => {
      if (prev && events.some((item: ManagedEvent) => item.id === prev)) return prev;
      return events[0]?.id || "";
    });

    const rows = coordinatorsData.coordinators || [];
    setCoordinators(rows);
    setInlineEventByEmail((prev) => {
      const next = { ...prev };
      const fallbackEventId = events[0]?.id || "";
      for (const row of rows) {
        if (next[row.email] === undefined || (next[row.email] && !events.some((e: ManagedEvent) => e.id === next[row.email]))) {
          next[row.email] = fallbackEventId;
        }
      }
      return next;
    });
  };

  const handleRefreshData = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await loadAdminData(user.email);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to refresh dashboard data");
    } finally {
      setSaving(false);
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
          if (!a.showDashboardAccess) {
            setError("You do not have dashboard access.");
            setLoading(false);
            return;
          }

          if (!a.isSuperAdmin) {
            router.replace("/coordinator-dashboard");
            return;
          }

          await loadAdminData(parsed.email);
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

  const grantAccess = async () => {
    if (!user) return;

    const normalizedGrantEmail = grantEmail.trim().toLowerCase();
    if (!normalizedGrantEmail) {
      alert("Enter a valid coordinator email.");
      return;
    }

    if (grantRole === "COORDINATOR" && !grantEventId) {
      alert("Select an event for coordinator access.");
      return;
    }

    setSaving(true);
    try {
      await postJson(`/api/dashboard/super-admin/coordinators?email=${encodeURIComponent(user.email)}`, {
        email: normalizedGrantEmail,
        role: grantRole,
      });

      if (grantRole === "COORDINATOR" && grantEventId) {
        await postJson(`/api/dashboard/super-admin/assignments?email=${encodeURIComponent(user.email)}`, {
          email: normalizedGrantEmail,
          eventId: Number(grantEventId),
        });
      }

      setGrantEmail("");
      await loadAdminData(user.email);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to grant access");
    } finally {
      setSaving(false);
    }
  };

  const revokeAllAccess = async (email: string) => {
    if (!user) return;
    if (!window.confirm(`Revoke all access for ${email}?`)) return;

    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/super-admin/coordinators?email=${encodeURIComponent(user.email)}`,
        { email },
        "DELETE"
      );
      await loadAdminData(user.email);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to revoke access");
    } finally {
      setSaving(false);
    }
  };

  const revokeAssignment = async (email: string, eventId: number) => {
    if (!user) return;
    setSaving(true);
    try {
      await postJson(
        `/api/dashboard/super-admin/assignments?email=${encodeURIComponent(user.email)}`,
        { email, eventId },
        "DELETE"
      );
      await loadAdminData(user.email);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to revoke event access");
    } finally {
      setSaving(false);
    }
  };

  const addAssignment = async (email: string) => {
    if (!user) return;
    const eventId = inlineEventByEmail[email];
    if (!eventId) {
      alert("Select an event first.");
      return;
    }

    setSaving(true);
    try {
      await postJson(`/api/dashboard/super-admin/assignments?email=${encodeURIComponent(user.email)}`, {
        email,
        eventId: Number(eventId),
      });
      await loadAdminData(user.email);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add event access");
    } finally {
      setSaving(false);
    }
  };

  const saveEventEdit = async () => {
    if (!user || !editingEvent) return;

    const isTeam = editingEvent.format === "TEAM_SOLO" || editingEvent.format === "TEAM_VS_TEAM";
    const payload = {
      ...editingEvent,
      teamSize: isTeam ? Math.max(1, Number(editingEvent.teamSize || 1)) : null,
    };

    setSaving(true);
    try {
      await postJson(`/api/dashboard/super-admin/events?email=${encodeURIComponent(user.email)}`, payload, "PATCH");
      setEditingEvent(null);
      await loadAdminData(user.email);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return coordinators.filter((row) => {
      const matchesText = !searchUsers.trim() || row.email.toLowerCase().includes(searchUsers.toLowerCase());
      const matchesRole = roleFilter === "ALL" || row.role === roleFilter;
      return matchesText && matchesRole;
    });
  }, [coordinators, roleFilter, searchUsers]);

  const filteredEvents = useMemo(() => {
    return adminEvents.filter((event) => {
      const matchesText =
        !searchEvents.trim() ||
        event.name.toLowerCase().includes(searchEvents.toLowerCase()) ||
        event.category.toLowerCase().includes(searchEvents.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [adminEvents, searchEvents, statusFilter]);

  const totalAssigned = useMemo(
    () => coordinators.reduce((sum, row) => sum + (row.assignments?.length || 0), 0),
    [coordinators]
  );

  if (loading) return <main style={{ padding: 20 }}>Loading dashboard...</main>;
  if (error) return <main style={{ padding: 20 }}>Error: {error}</main>;
  if (!access?.showDashboardAccess) return <main style={{ padding: 20 }}>Dashboard access not available.</main>;

  return (
    <main className="admin-shell">
      <aside className="left-nav">
        <div className="brand">
          <h2>Crescendo Admin</h2>
          <p>Role Based Access</p>
        </div>

        <div className="nav-list">
          <button className="nav-item" onClick={() => router.push("/coordinator-dashboard")}>Event Coordinator</button>
          <button className="nav-item active">Web Admin</button>
        </div>

        <div className="nav-note">Super admin can manage users, events, and coordinator assignments.</div>
      </aside>

      <section className="main-panel">
        <div className="page-head">
          <h1>Web Admin Dashboard</h1>
          <p>Comprehensive system administration and management</p>
        </div>

        <div className="top-tabs">
          <button className={tab === "overview" ? "tab active" : "tab"} onClick={() => setTab("overview")}>Overview</button>
          <button className={tab === "users" ? "tab active" : "tab"} onClick={() => setTab("users")}>User Management</button>
          <button className={tab === "events" ? "tab active" : "tab"} onClick={() => setTab("events")}>Event Management</button>
        </div>

        {tab === "overview" && (
          <div className="card-grid">
            <article className="stat-card">
              <h3>Total Events</h3>
              <p>{adminEvents.length}</p>
            </article>
            <article className="stat-card">
              <h3>Access Users</h3>
              <p>{coordinators.length}</p>
            </article>
            <article className="stat-card">
              <h3>Event Assignments</h3>
              <p>{totalAssigned}</p>
            </article>
          </div>
        )}

        {tab === "users" && (
          <section className="data-card">
            <div className="card-header">
              <div>
                <h2>User Management</h2>
                <p>Manage user accounts, roles, and event permissions</p>
              </div>
            </div>

            <div className="grant-form">
              <input
                placeholder="Coordinator email"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
              />
              <select value={grantRole} onChange={(e) => setGrantRole(e.target.value as "SUPER_ADMIN" | "COORDINATOR")}>
                <option value="COORDINATOR">COORDINATOR</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <select
                value={grantEventId}
                onChange={(e) => setGrantEventId(e.target.value ? Number(e.target.value) : "")}
                disabled={grantRole !== "COORDINATOR"}
              >
                <option value="">Select event</option>
                {adminEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <button className="compact-btn" onClick={grantAccess} disabled={saving}>Grant Access</button>
            </div>

            <div className="toolbar">
              <input
                placeholder="Search users..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
              />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as "ALL" | "SUPER_ADMIN" | "COORDINATOR")}>
                <option value="ALL">All Roles</option>
                <option value="COORDINATOR">COORDINATOR</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
              <button className="compact-btn" onClick={handleRefreshData} disabled={saving}>Refresh</button>
            </div>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Events</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((row) => (
                    <tr key={row.email}>
                      <td>
                        <div className="user-cell">
                          <span className="avatar">{initialsFromEmail(row.email)}</span>
                          <div>
                            <strong>{row.email.split("@")[0]}</strong>
                            <p>{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="pill">{row.role}</span>
                      </td>
                      <td>
                        <div className="events-col">
                          {(row.assignments || []).length === 0 ? (
                            <span className="muted">No event assigned</span>
                          ) : (
                            (row.assignments || []).slice(0, 3).map((assignment) => (
                              <div key={`${row.email}-${assignment.eventId}`} className="assignment-item">
                                <span>{assignment.event?.name || `Event #${assignment.eventId}`}</span>
                                <button
                                  className="icon-btn danger"
                                  onClick={() => revokeAssignment(row.email, assignment.eventId)}
                                  disabled={saving}
                                >
                                  Revoke
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td>{row.email}</td>
                      <td>
                        <div className="actions-col">
                          <select
                            value={inlineEventByEmail[row.email] ?? ""}
                            onChange={(e) =>
                              setInlineEventByEmail((prev) => ({
                                ...prev,
                                [row.email]: e.target.value ? Number(e.target.value) : "",
                              }))
                            }
                          >
                            <option value="">Select event</option>
                            {adminEvents.map((event) => (
                              <option key={event.id} value={event.id}>
                                {event.name}
                              </option>
                            ))}
                          </select>
                          <button className="icon-btn compact" onClick={() => addAssignment(row.email)} disabled={saving}>Add Event</button>
                          <button className="icon-btn danger" onClick={() => revokeAllAccess(row.email)} disabled={saving}>Revoke All</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-row">No users found for current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "events" && (
          <section className="data-card">
            <div className="card-header">
              <div>
                <h2>Event Management</h2>
                <p>Manage event configurations and coordinator-ready setup</p>
              </div>
            </div>

            <div className="toolbar">
              <input
                placeholder="Search events..."
                value={searchEvents}
                onChange={(e) => setSearchEvents(e.target.value)}
              />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "ALL" | ManagedEvent["status"])}>
                <option value="ALL">All Status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button className="compact-btn" onClick={handleRefreshData} disabled={saving}>Refresh</button>
            </div>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Domain</th>
                    <th>Type</th>
                    <th>On-Spot</th>
                    <th>Status</th>
                    <th>Venue</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.name}</td>
                      <td>{event.category}</td>
                      <td>{prettyFormat(event.format)}</td>
                      <td>
                        <span className="pill">{event.allowOnSpotEntry ? "ALLOWED" : "BLOCKED"}</span>
                      </td>
                      <td><span className="pill">{event.status}</span></td>
                      <td>{event.venue || "Not set"}</td>
                      <td>
                        <div className="actions-col">
                          <button className="icon-btn compact" onClick={() => setEditingEvent({ ...event })}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="empty-row">No events found for current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </section>

      {editingEvent && (
        <div className="modal-backdrop" onClick={() => setEditingEvent(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h2>Edit Event</h2>
                <p>Update event information</p>
              </div>
              <button className="icon-btn" onClick={() => setEditingEvent(null)}>Close</button>
            </div>

            <div className="modal-grid">
              <label>
                Event Name
                <input
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
                />
              </label>

              <label>
                Domain
                <select
                  value={editingEvent.category}
                  onChange={(e) => setEditingEvent((prev) => (prev ? { ...prev, category: e.target.value } : prev))}
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Venue
                <input
                  value={editingEvent.venue || ""}
                  onChange={(e) => setEditingEvent((prev) => (prev ? { ...prev, venue: e.target.value } : prev))}
                />
              </label>

              <label>
                Event Type
                <select
                  value={editingEvent.format}
                  onChange={(e) =>
                    setEditingEvent((prev) => {
                      if (!prev) return prev;
                      const nextFormat = e.target.value as ManagedEvent["format"];
                      return {
                        ...prev,
                        format: nextFormat,
                        teamSize: nextFormat === "TEAM_SOLO" || nextFormat === "TEAM_VS_TEAM" ? prev.teamSize || 1 : null,
                      };
                    })
                  }
                >
                  {FORMAT_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {prettyFormat(value)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Participants Per Entry
                <input
                  type="number"
                  min={1}
                  value={
                    editingEvent.format === "TEAM_SOLO" || editingEvent.format === "TEAM_VS_TEAM"
                      ? editingEvent.teamSize || 1
                      : 1
                  }
                  disabled={editingEvent.format === "SINGLE_PARTICIPANT" || editingEvent.format === "SINGLE_VS_SINGLE"}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            teamSize: e.target.value ? Number(e.target.value) : 1,
                          }
                        : prev
                    )
                  }
                />
              </label>

              <label>
                Status
                <select
                  value={editingEvent.status}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev ? { ...prev, status: e.target.value as ManagedEvent["status"] } : prev
                    )
                  }
                >
                  {STATUS_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={Boolean(editingEvent.allowOnSpotEntry)}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev ? { ...prev, allowOnSpotEntry: e.target.checked } : prev
                    )
                  }
                />
                Allow On-Spot Entry
              </label>
            </div>

            <div className="modal-actions">
              <button className="icon-btn" onClick={() => setEditingEvent(null)} disabled={saving}>Cancel</button>
              <button className="icon-btn" onClick={saveEventEdit} disabled={saving}>Save Event</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-shell {
          min-height: 100vh;
          background: #f3f5f8;
          display: grid;
          grid-template-columns: 240px minmax(0, 1fr);
          color: #0f172a;
        }

        .left-nav {
          border-right: 1px solid #d9e0ea;
          background: #ffffff;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        .brand {
          padding: 22px 18px;
          border-bottom: 1px solid #e7ebf1;
        }

        .brand h2 {
          margin: 0;
          font-size: 30px;
          line-height: 1.15;
          font-family: var(--font-cinzel, serif);
        }

        .brand p {
          margin: 8px 0 0;
          color: #667085;
          font-size: 14px;
        }

        .nav-list {
          display: grid;
          gap: 8px;
          padding: 14px;
          align-content: start;
          grid-auto-rows: min-content;
        }

        .nav-item {
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: #334155;
          height: 42px;
          text-align: left;
          padding: 0 12px;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          line-height: 1;
        }

        .nav-item.active {
          background: #2563eb;
          color: #ffffff;
        }

        .nav-note {
          border-top: 1px solid #e7ebf1;
          padding: 14px;
          color: #667085;
          font-size: 12px;
          line-height: 1.5;
        }

        .main-panel {
          padding: 24px;
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .page-head h1 {
          margin: 0;
          font-size: 40px;
          line-height: 1.15;
          font-family: var(--font-cinzel, serif);
        }

        .page-head p {
          margin: 8px 0 0;
          color: #64748b;
        }

        .top-tabs {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          padding: 4px;
          border-radius: 14px;
          background: #ebeff5;
        }

        .tab {
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          height: 40px;
          cursor: pointer;
          font-weight: 700;
          color: #334155;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          line-height: 1;
        }

        .tab.active {
          background: #ffffff;
          border-color: #c8d2e1;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .stat-card {
          border: 1px solid #d6dee9;
          border-radius: 16px;
          background: #ffffff;
          padding: 16px;
        }

        .stat-card h3 {
          margin: 0;
          color: #475569;
          font-size: 14px;
        }

        .stat-card p {
          margin: 10px 0 0;
          font-size: 30px;
          font-weight: 800;
        }

        .data-card {
          border: 1px solid #d6dee9;
          border-radius: 18px;
          background: #ffffff;
          padding: 16px;
          display: grid;
          gap: 14px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 24px;
          font-family: var(--font-cinzel, serif);
        }

        .card-header p {
          margin: 6px 0 0;
          color: #64748b;
        }

        .grant-form,
        .toolbar {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr auto;
          gap: 10px;
        }

        .toolbar {
          grid-template-columns: 1.8fr 1fr auto;
        }

        .table-wrap {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 980px;
        }

        .admin-table th,
        .admin-table td {
          border-bottom: 1px solid #e5ebf3;
          padding: 12px 10px;
          text-align: left;
          vertical-align: top;
          font-size: 14px;
        }

        .admin-table th {
          background: #f8fafc;
          color: #334155;
          font-weight: 700;
        }

        .user-cell {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .user-cell p {
          margin: 2px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-grid;
          place-items: center;
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
          background: #2563eb;
          flex: 0 0 auto;
        }

        .pill {
          display: inline-flex;
          border: 1px solid #d6deea;
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 12px;
          color: #334155;
          background: #f8fafc;
        }

        .events-col {
          display: grid;
          gap: 6px;
          min-width: 220px;
        }

        .assignment-item {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: center;
        }

        .actions-col {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          min-width: 260px;
        }

        .icon-btn {
          border: 1px solid #cdd8e8;
          background: #f8fafc;
          color: #0f172a;
          border-radius: 10px;
          height: 30px;
          padding: 0 10px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          white-space: nowrap;
        }

        .icon-btn.compact {
          height: 28px;
          padding: 0 8px;
        }

        .compact-btn {
          border: 1px solid #cdd8e8;
          border-radius: 10px;
          background: #0f172a;
          color: #ffffff;
          height: 34px;
          padding: 0 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .icon-btn.danger {
          border-color: #fecaca;
          background: #fff1f2;
          color: #b91c1c;
        }

        .empty-row {
          text-align: center;
          color: #64748b;
        }

        .muted {
          color: #64748b;
          font-size: 12px;
        }

        input,
        select {
          min-height: 38px;
          border: 1px solid #cfd8e6;
          border-radius: 10px;
          padding: 0 10px;
          background: #ffffff;
          color: #0f172a;
          font-size: 14px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.5);
          display: grid;
          place-items: center;
          padding: 16px;
          z-index: 40;
        }

        .modal-card {
          width: min(760px, 100%);
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #d6deea;
          padding: 18px;
          display: grid;
          gap: 14px;
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 12px;
        }

        .modal-head h2 {
          margin: 0;
          font-size: 26px;
          font-family: var(--font-cinzel, serif);
        }

        .modal-head p {
          margin: 6px 0 0;
          color: #64748b;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #334155;
        }

        .modal-grid label {
          display: grid;
          gap: 6px;
          font-weight: 700;
          color: #334155;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          justify-content: end;
          gap: 10px;
        }

        @media (max-width: 1100px) {
          .admin-shell {
            grid-template-columns: 1fr;
          }

          .left-nav {
            border-right: none;
            border-bottom: 1px solid #d9e0ea;
          }

          .main-panel {
            padding: 14px;
            gap: 14px;
          }

          .page-head h1 {
            font-size: 30px;
          }

          .brand h2 {
            font-size: 24px;
          }

          .card-grid {
            grid-template-columns: 1fr;
          }

          .grant-form,
          .toolbar,
          .top-tabs {
            grid-template-columns: 1fr;
          }

          .admin-table {
            min-width: 760px;
          }

          .admin-table th,
          .admin-table td {
            padding: 8px;
            font-size: 12px;
          }

          .actions-col,
          .events-col {
            min-width: 0;
          }

          .actions-col {
            align-items: stretch;
          }

          .compact-btn,
          .icon-btn,
          .nav-item,
          .tab {
            height: 36px;
          }

          .icon-btn.compact {
            height: 32px;
          }

          .modal-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .main-panel {
            padding: 10px;
          }

          .page-head h1 {
            font-size: 24px;
          }

          .admin-table {
            min-width: 680px;
          }

          .top-tabs {
            gap: 6px;
            padding: 3px;
          }

          .tab {
            height: 34px;
            font-size: 12px;
          }

          .modal-card {
            padding: 12px;
          }
        }
      `}</style>
    </main>
  );
}
