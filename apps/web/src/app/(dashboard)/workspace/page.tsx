"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Users,
  Crown,
  Shield,
  Pencil,
  Eye,
  Trash2,
  Mail,
  ChevronDown,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  getWorkspaces,
  createWorkspace,
  getMembers,
  inviteMember,
  removeMember,
  changeMemberRole,
  searchUserByEmail,
  updateWorkspace,
  deleteWorkspace,
} from "@/services/workspace.service";
import {
  useWorkspaceStore,
  type Workspace,
  type WorkspaceMember,
} from "@/store/workspaceStore";
import { useAuthStore } from "@/store/auth.store";

const ROLE_CONFIG = {
  OWNER: { label: "Owner", color: "#eab308", icon: Crown },
  ADMIN: { label: "Admin", color: "#3b82f6", icon: Shield },
  EDITOR: { label: "Editor", color: "#22c55e", icon: Pencil },
  VIEWER: { label: "Viewer", color: "#888", icon: Eye },
};

const PLAN_CONFIG = {
  FREE: { label: "Free", color: "#525252", bg: "#1a1a1a" },
  PRO: { label: "Pro", color: "#eab308", bg: "rgba(234,179,8,0.1)" },
  BUSINESS: { label: "Business", color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
};

export default function WorkspacePage() {
  const { user } = useAuthStore();
  const {
    workspaces,
    activeWorkspace,
    setWorkspaces,
    setActiveWorkspace,
    addWorkspace,
    updateWorkspace: updateWorkspaceStore,
    removeWorkspace,
  } = useWorkspaceStore();

  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Rename modal
  const [showRename, setShowRename] = useState(false);
  const [renameName, setRenameName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameError, setRenameError] = useState("");

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("EDITOR");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Role dropdown
  const [roleDropdown, setRoleDropdown] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getWorkspaces();
        setWorkspaces(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPage(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    let cancelled = false;
    const load = async () => {
      setLoadingMembers(true);
      try {
        const data = await getMembers(activeWorkspace.id);
        if (!cancelled) setMembers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoadingMembers(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activeWorkspace?.id]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreateError("Workspace name is required.");
      return;
    }
    const tempWorkspace: Workspace = {
      id: `temp-${Date.now()}`,
      name: newName.trim(),
      plan: "FREE",
      ownerId: "",
      maxPostsPerMonth: 50,
      monthlyPostCount: 0,
      maxTeamMembers: 1,
      createdAt: new Date().toISOString(),
      members: [],
    };
    addWorkspace(tempWorkspace);
    setNewName("");
    setShowCreate(false);
    try {
      setCreating(true);
      const real = await createWorkspace(tempWorkspace.name);
      setWorkspaces(
        useWorkspaceStore
          .getState()
          .workspaces.map((ws) => (ws.id === tempWorkspace.id ? real : ws))
      );
    } catch (err: any) {
      setWorkspaces(
        useWorkspaceStore
          .getState()
          .workspaces.filter((ws) => ws.id !== tempWorkspace.id)
      );
      setShowCreate(true);
      setNewName(tempWorkspace.name);
      setCreateError(
        err?.response?.data?.message || "Failed to create workspace."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async () => {
    if (!renameName.trim()) {
      setRenameError("Workspace name is required.");
      return;
    }
    if (!activeWorkspace) return;
    try {
      setRenaming(true);
      setRenameError("");
      await updateWorkspace(activeWorkspace.id, renameName.trim());
      updateWorkspaceStore(activeWorkspace.id, renameName.trim());
      setShowRename(false);
      setRenameName("");
    } catch (err: any) {
      setRenameError(
        err?.response?.data?.message || "Failed to rename workspace."
      );
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!activeWorkspace) return;
    try {
      setDeleting(true);
      await deleteWorkspace(activeWorkspace.id);
      removeWorkspace(activeWorkspace.id);
      setShowDelete(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setInviteError("Enter a valid email.");
      return;
    }
    if (!activeWorkspace) return;
    try {
      setInviting(true);
      setInviteError("");
      const foundUser = await searchUserByEmail(inviteEmail);
      if (!foundUser) {
        setInviteError("No user found with that email.");
        return;
      }
      await inviteMember(activeWorkspace.id, foundUser.id, inviteRole);
      setInviteSuccess(true);
      setInviteEmail("");
      setTimeout(() => {
        setInviteSuccess(false);
        setShowInvite(false);
      }, 1500);
      const data = await getMembers(activeWorkspace.id);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setInviteError(
        err?.response?.data?.message || "Failed to invite member."
      );
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!activeWorkspace) return;
    try {
      await removeMember(activeWorkspace.id, userId);
      setMembers((prev) => prev.filter((m) => m.user.id !== userId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    if (!activeWorkspace) return;
    try {
      await changeMemberRole(activeWorkspace.id, userId, role);
      setMembers((prev) =>
        prev.map((m) =>
          m.user.id === userId ? { ...m, role: role as any } : m
        )
      );
      setRoleDropdown(null);
    } catch (e) {
      console.error(e);
    }
  };

  const isOwner = activeWorkspace?.ownerId === user?.id;

  const S: React.CSSProperties = {
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    color: "#fafafa",
  };

  if (loadingPage) {
    return (
      <div
        style={{
          ...S,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <Loader2
          size={24}
          color="#eab308"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div
      style={{ ...S, display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "20px",
              fontWeight: "600",
              letterSpacing: "-0.4px",
            }}
          >
            Workspaces
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#525252" }}>
            Manage your workspaces and team members
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 16px",
            background: "linear-gradient(135deg, #eab308, #ca8a04)",
            border: "none",
            borderRadius: "8px",
            color: "#0a0a0a",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(234,179,8,0.2)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} /> New Workspace
        </button>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "16px",
        }}
      >
        {/* Left — workspace list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#333",
            }}
          >
            Your Workspaces
          </p>
          {workspaces.length === 0 ? (
            <div
              style={{
                padding: "24px",
                background: "#111",
                border: "1px dashed #222",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <Building2
                size={24}
                color="#2a2a2a"
                style={{ marginBottom: "8px" }}
              />
              <p style={{ margin: 0, fontSize: "12px", color: "#525252" }}>
                No workspaces yet
              </p>
            </div>
          ) : (
            workspaces.map((ws) => {
              const active = activeWorkspace?.id === ws.id;
              const plan = PLAN_CONFIG[ws.plan] ?? PLAN_CONFIG.FREE;
              return (
                <div
                  key={ws.id}
                  onClick={() => setActiveWorkspace(ws)}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    background: active ? "rgba(234,179,8,0.06)" : "#111",
                    border: `1px solid ${
                      active ? "rgba(234,179,8,0.25)" : "#1a1a1a"
                    }`,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.borderColor = "#2a2a2a";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.borderColor = "#1a1a1a";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: active ? "rgba(234,179,8,0.15)" : "#1a1a1a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "700",
                        color: active ? "#eab308" : "#525252",
                        flexShrink: 0,
                      }}
                    >
                      {(ws.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: "0 0 2px",
                          fontSize: "13px",
                          fontWeight: "500",
                          color: active ? "#fafafa" : "#888",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ws.name}
                      </p>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: plan.bg,
                          color: plan.color,
                          fontWeight: "600",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {plan.label}
                      </span>
                    </div>
                    {active && <Check size={14} color="#eab308" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right — workspace detail */}
        {activeWorkspace ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Workspace info */}
            <div
              style={{
                padding: "20px",
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "rgba(234,179,8,0.1)",
                      border: "1px solid rgba(234,179,8,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#eab308",
                    }}
                  >
                    {(activeWorkspace.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: "0 0 2px",
                        fontSize: "16px",
                        fontWeight: "600",
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {activeWorkspace.name}
                    </h2>
                    <span
                      style={{
                        fontSize: "10px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background: PLAN_CONFIG[activeWorkspace.plan]?.bg,
                        color: PLAN_CONFIG[activeWorkspace.plan]?.color,
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {activeWorkspace.plan} PLAN
                    </span>
                  </div>
                </div>

                {/* Rename + Delete — owner only */}
                {isOwner && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        setRenameName(activeWorkspace.name);
                        setShowRename(true);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "7px 12px",
                        background: "transparent",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        color: "#888",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#eab308";
                        e.currentTarget.style.color = "#eab308";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#2a2a2a";
                        e.currentTarget.style.color = "#888";
                      }}
                    >
                      <Pencil size={12} /> Rename
                    </button>
                    <button
                      onClick={() => setShowDelete(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "7px 12px",
                        background: "transparent",
                        border: "1px solid #2a2a2a",
                        borderRadius: "8px",
                        color: "#888",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(239,68,68,0.4)";
                        e.currentTarget.style.color = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#2a2a2a";
                        e.currentTarget.style.color = "#888";
                      }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Usage stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "12px",
                }}
              >
                {[
                  {
                    label: "Posts Used",
                    value: `${activeWorkspace.monthlyPostCount} / ${activeWorkspace.maxPostsPerMonth}`,
                    pct:
                      (activeWorkspace.monthlyPostCount /
                        activeWorkspace.maxPostsPerMonth) *
                      100,
                  },
                  {
                    label: "Team Members",
                    value: `${members.length} / ${activeWorkspace.maxTeamMembers}`,
                    pct:
                      (members.length / activeWorkspace.maxTeamMembers) * 100,
                  },
                  { label: "Plan", value: activeWorkspace.plan, pct: null },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "12px",
                      background: "#0a0a0a",
                      borderRadius: "8px",
                      border: "1px solid #1a1a1a",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 6px",
                        fontSize: "11px",
                        color: "#525252",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#fafafa",
                      }}
                    >
                      {item.value}
                    </p>
                    {item.pct !== null && (
                      <div
                        style={{
                          height: "3px",
                          background: "#1a1a1a",
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(item.pct, 100)}%`,
                            height: "100%",
                            background: item.pct > 80 ? "#ef4444" : "#eab308",
                            borderRadius: "2px",
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Members */}
            <div
              style={{
                padding: "20px",
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Users size={16} color="#525252" />
                  <h3
                    style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}
                  >
                    Team Members
                  </h3>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: "#1a1a1a",
                      color: "#525252",
                    }}
                  >
                    {members.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowInvite(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 12px",
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    borderRadius: "8px",
                    color: "#888",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#eab308";
                    e.currentTarget.style.color = "#eab308";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.color = "#888";
                  }}
                >
                  <Mail size={13} /> Invite Member
                </button>
              </div>

              {loadingMembers ? (
                <div style={{ textAlign: "center", padding: "24px" }}>
                  <Loader2
                    size={20}
                    color="#eab308"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                </div>
              ) : members.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px",
                    border: "1px dashed #1a1a1a",
                    borderRadius: "8px",
                  }}
                >
                  <Users
                    size={24}
                    color="#2a2a2a"
                    style={{ marginBottom: "8px" }}
                  />
                  <p style={{ margin: 0, fontSize: "13px", color: "#525252" }}>
                    No members yet. Invite someone!
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {members.map((member) => {
                    const roleConf =
                      ROLE_CONFIG[member.role] ?? ROLE_CONFIG.VIEWER;
                    const RoleIcon = roleConf.icon;
                    const isMemberOwner = member.role === "OWNER";
                    const isMe = member.user.id === user?.id;
                    return (
                      <div
                        key={member.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #1a1a1a",
                          transition: "border-color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = "#2a2a2a")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "#1a1a1a")
                        }
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#888",
                            flexShrink: 0,
                          }}
                        >
                          {member.user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#fafafa",
                              }}
                            >
                              {member.user.name}
                            </p>
                            {isMe && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  padding: "1px 6px",
                                  background: "#1a1a1a",
                                  borderRadius: "4px",
                                  color: "#525252",
                                }}
                              >
                                you
                              </span>
                            )}
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              color: "#525252",
                            }}
                          >
                            {member.user.email}
                          </p>
                        </div>

                        {/* Role */}
                        <div style={{ position: "relative" }}>
                          <button
                            onClick={() =>
                              !isMemberOwner &&
                              !isMe &&
                              setRoleDropdown(
                                roleDropdown === member.id ? null : member.id
                              )
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "5px 10px",
                              borderRadius: "6px",
                              background: roleConf.color + "15",
                              border: `1px solid ${roleConf.color}30`,
                              color: roleConf.color,
                              fontSize: "11px",
                              fontWeight: "600",
                              cursor:
                                isMemberOwner || isMe ? "default" : "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            <RoleIcon size={11} />
                            {roleConf.label}
                            {!isMemberOwner && !isMe && (
                              <ChevronDown size={10} />
                            )}
                          </button>
                          {roleDropdown === member.id && (
                            <div
                              style={{
                                position: "absolute",
                                right: 0,
                                top: "calc(100% + 4px)",
                                background: "#111",
                                border: "1px solid #2a2a2a",
                                borderRadius: "8px",
                                overflow: "hidden",
                                zIndex: 50,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                minWidth: "120px",
                              }}
                            >
                              {(["ADMIN", "EDITOR", "VIEWER"] as const).map(
                                (r) => {
                                  const rc = ROLE_CONFIG[r];
                                  const RI = rc.icon;
                                  return (
                                    <button
                                      key={r}
                                      onClick={() =>
                                        handleRoleChange(member.user.id, r)
                                      }
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "9px 12px",
                                        background:
                                          member.role === r
                                            ? "#1a1a1a"
                                            : "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                        color: rc.color,
                                        fontSize: "12px",
                                        textAlign: "left",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                          "#1a1a1a")
                                      }
                                      onMouseLeave={(e) => {
                                        if (member.role !== r)
                                          e.currentTarget.style.background =
                                            "transparent";
                                      }}
                                    >
                                      <RI size={12} /> {rc.label}
                                      {member.role === r && (
                                        <Check
                                          size={10}
                                          style={{ marginLeft: "auto" }}
                                        />
                                      )}
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>

                        {/* Remove */}
                        {!isMemberOwner && !isMe && (
                          <button
                            onClick={() => handleRemove(member.user.id)}
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "6px",
                              background: "transparent",
                              border: "1px solid transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              color: "#525252",
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(239,68,68,0.08)";
                              e.currentTarget.style.borderColor =
                                "rgba(239,68,68,0.2)";
                              e.currentTarget.style.color = "#ef4444";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.borderColor = "transparent";
                              e.currentTarget.style.color = "#525252";
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#111",
              border: "1px dashed #222",
              borderRadius: "12px",
              padding: "60px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Building2
                size={32}
                color="#2a2a2a"
                style={{ marginBottom: "12px" }}
              />
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: "14px",
                  color: "#525252",
                }}
              >
                Select or create a workspace
              </p>
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #eab308, #ca8a04)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#0a0a0a",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Create Workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== CREATE MODAL ===== */}
      {showCreate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowCreate(false)}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "28px",
              width: "400px",
              fontFamily: "inherit",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                Create Workspace
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#525252",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#525252",
                marginBottom: "8px",
              }}
            >
              Workspace Name
            </label>
            <input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setCreateError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. My Brand, Client A..."
              autoFocus
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#0a0a0a",
                border: `1px solid ${
                  createError ? "rgba(239,68,68,0.4)" : "#222"
                }`,
                borderRadius: "8px",
                color: "#fafafa",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {createError && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <X size={11} /> {createError}
              </p>
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  color: "#525252",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: creating
                    ? "#1a1a0a"
                    : "linear-gradient(135deg, #eab308, #ca8a04)",
                  border: "none",
                  borderRadius: "8px",
                  color: creating ? "#525252" : "#0a0a0a",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: creating ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {creating ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RENAME MODAL ===== */}
      {showRename && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowRename(false)}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "28px",
              width: "400px",
              fontFamily: "inherit",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                Rename Workspace
              </h2>
              <button
                onClick={() => setShowRename(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#525252",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#525252",
                marginBottom: "8px",
              }}
            >
              New Name
            </label>
            <input
              value={renameName}
              onChange={(e) => {
                setRenameName(e.target.value);
                setRenameError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              placeholder="Workspace name..."
              autoFocus
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#0a0a0a",
                border: `1px solid ${
                  renameError ? "rgba(239,68,68,0.4)" : "#222"
                }`,
                borderRadius: "8px",
                color: "#fafafa",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {renameError && (
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <X size={11} /> {renameError}
              </p>
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              <button
                onClick={() => setShowRename(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  color: "#525252",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={renaming}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: renaming
                    ? "#1a1a0a"
                    : "linear-gradient(135deg, #eab308, #ca8a04)",
                  border: "none",
                  borderRadius: "8px",
                  color: renaming ? "#525252" : "#0a0a0a",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: renaming ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {renaming ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {showDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowDelete(false)}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "28px",
              width: "400px",
              fontFamily: "inherit",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                Delete Workspace
              </h2>
              <button
                onClick={() => setShowDelete(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#525252",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div
              style={{
                padding: "14px",
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#ef4444",
                }}
              >
                This action cannot be undone
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                Deleting{" "}
                <strong style={{ color: "#fafafa" }}>
                  {activeWorkspace?.name}
                </strong>{" "}
                will permanently remove all posts, members, and social accounts
                in this workspace.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowDelete(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  color: "#525252",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: deleting ? "#1a0a0a" : "rgba(239,68,68,0.9)",
                  border: "none",
                  borderRadius: "8px",
                  color: deleting ? "#525252" : "#fff",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: deleting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {deleting ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Deleting...
                  </>
                ) : (
                  "Delete Workspace"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== INVITE MODAL ===== */}
      {showInvite && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowInvite(false)}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "14px",
              padding: "28px",
              width: "400px",
              fontFamily: "inherit",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                Invite Member
              </h2>
              <button
                onClick={() => setShowInvite(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#525252",
                }}
              >
                <X size={18} />
              </button>
            </div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#525252",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteError("");
              }}
              placeholder="colleague@example.com"
              autoFocus
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#0a0a0a",
                border: `1px solid ${
                  inviteError ? "rgba(239,68,68,0.4)" : "#222"
                }`,
                borderRadius: "8px",
                color: "#fafafa",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
                marginBottom: "14px",
              }}
            />
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#525252",
                marginBottom: "8px",
              }}
            >
              Role
            </label>
            <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
              {(["ADMIN", "EDITOR", "VIEWER"] as const).map((r) => {
                const rc = ROLE_CONFIG[r];
                const RI = rc.icon;
                return (
                  <button
                    key={r}
                    onClick={() => setInviteRole(r)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "8px",
                      background:
                        inviteRole === r ? rc.color + "15" : "#0a0a0a",
                      border: `1px solid ${
                        inviteRole === r ? rc.color + "40" : "#222"
                      }`,
                      color: inviteRole === r ? rc.color : "#525252",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "5px",
                    }}
                  >
                    <RI size={12} /> {rc.label}
                  </button>
                );
              })}
            </div>
            {inviteError && (
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "12px",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <X size={11} /> {inviteError}
              </p>
            )}
            {inviteSuccess && (
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "12px",
                  color: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Check size={11} /> Invitation sent successfully!
              </p>
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              <button
                onClick={() => setShowInvite(false)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  border: "1px solid #222",
                  borderRadius: "8px",
                  color: "#525252",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: inviting
                    ? "#1a1a0a"
                    : "linear-gradient(135deg, #eab308, #ca8a04)",
                  border: "none",
                  borderRadius: "8px",
                  color: inviting ? "#525252" : "#0a0a0a",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: inviting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {inviting ? (
                  <>
                    <Loader2
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Inviting...
                  </>
                ) : (
                  "Send Invite"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
