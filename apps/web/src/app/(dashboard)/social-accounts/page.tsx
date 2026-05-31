"use client";

import { useEffect, useState } from "react";
import {
  Plug,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import {
  colors,
  typography,
  radius,
  transition,
  cardStyle,
} from "@/constants/tokens";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useAuthStore } from "@/store/auth.store";
import {
  getSocialAccounts,
  deleteSocialAccount,
} from "@/services/socail.account.service";

// ── Types ────────────────────────────────────────────────────
interface SocialAccount {
  id: string;
  platform: "FACEBOOK" | "INSTAGRAM" | "TIKTOK" | "LINKEDIN" | "TWITTER";
  accountId: string;
  accountName?: string;
  username?: string;
  profileImage?: string;
  isActive: boolean;
  tokenExpiresAt?: string;
  createdAt: string;
}

// ── Platform config ──────────────────────────────────────────
const PLATFORM_CONFIG = {
  FACEBOOK: {
    label: "Facebook",
    color: "#1877f2",
    bg: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.2)",
    icon: "𝓕",
  },
  INSTAGRAM: {
    label: "Instagram",
    color: "#e1306c",
    bg: "rgba(225,48,108,0.08)",
    border: "rgba(225,48,108,0.2)",
    icon: "IG",
  },
  TIKTOK: {
    label: "TikTok",
    color: "#ff0050",
    bg: "rgba(255,0,80,0.08)",
    border: "rgba(255,0,80,0.2)",
    icon: "TT",
  },
  LINKEDIN: {
    label: "LinkedIn",
    color: "#0a66c2",
    bg: "rgba(10,102,194,0.08)",
    border: "rgba(10,102,194,0.2)",
    icon: "in",
  },
  TWITTER: {
    label: "Twitter / X",
    color: "#e7e9ea",
    bg: "rgba(231,233,234,0.06)",
    border: "rgba(231,233,234,0.15)",
    icon: "𝕏",
  },
};

const CONNECT_PLATFORMS = [
  {
    key: "FACEBOOK",
    label: "Facebook Pages",
    desc: "Manage and publish to Facebook pages",
    color: "#1877f2",
    available: true,
  },
  {
    key: "INSTAGRAM",
    label: "Instagram Business",
    desc: "Post to Instagram business accounts",
    color: "#e1306c",
    available: false,
  },
  {
    key: "TIKTOK",
    label: "TikTok",
    desc: "Publish videos to TikTok",
    color: "#ff0050",
    available: false,
  },
  {
    key: "LINKEDIN",
    label: "LinkedIn",
    desc: "Share to LinkedIn pages and profiles",
    color: "#0a66c2",
    available: false,
  },
  {
    key: "TWITTER",
    label: "Twitter / X",
    desc: "Post to Twitter/X accounts",
    color: "#e7e9ea",
    available: false,
  },
];

export default function SocialAccountsPage() {
  const { activeWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConnect, setShowConnect] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!activeWorkspace?.id) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const data = await getSocialAccounts(activeWorkspace.id);
        if (Array.isArray(data)) {
          setAccounts(data);
        } else if (
          data &&
          typeof data === "object" &&
          "data" in data &&
          Array.isArray((data as any).data)
        ) {
          setAccounts((data as { data: SocialAccount[] }).data);
        } else {
          setAccounts([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeWorkspace?.id]);

  const handleConnectFacebook = async () => {
    if (!activeWorkspace) return;
    setConnecting(true);
    // Redirect to backend OAuth endpoint — backend will redirect to Facebook
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/facebook`;
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteSocialAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const S = { fontFamily: typography.fontSans, color: colors.text };

  if (!activeWorkspace) {
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
        <div style={{ textAlign: "center" }}>
          <Plug
            size={32}
            color={colors.textFaint}
            style={{ marginBottom: "12px" }}
          />
          <p
            style={{
              margin: "0 0 4px",
              fontSize: typography.size.md,
              color: colors.textSecondary,
            }}
          >
            No workspace selected
          </p>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.base,
              color: colors.textMuted,
            }}
          >
            Select a workspace to manage social accounts
          </p>
        </div>
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
              fontSize: typography.size["2xl"],
              fontWeight: typography.weight.bold,
              letterSpacing: "-0.5px",
            }}
          >
            Social Accounts
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.base,
              color: colors.textMuted,
            }}
          >
            Connect and manage your social media accounts for{" "}
            <span style={{ color: colors.accent }}>{activeWorkspace.name}</span>
          </p>
        </div>
        <button
          onClick={() => setShowConnect(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 16px",
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
            border: "none",
            borderRadius: radius.lg,
            color: "#080808",
            fontSize: typography.size.sm,
            fontWeight: typography.weight.extrabold,
            letterSpacing: typography.tracking.wider,
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(245,158,11,0.2)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} /> Connect Account
        </button>
      </div>

      {/* Connected accounts */}
      <div>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: colors.textFaint,
          }}
        >
          Connected Accounts ({accounts.length})
        </p>

        {loading ? (
          <div
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px",
            }}
          >
            <Loader2
              size={24}
              color={colors.accent}
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : accounts.length === 0 ? (
          <div
            style={{
              ...cardStyle,
              textAlign: "center",
              padding: "60px 32px",
              border: `1px dashed ${colors.borderDash}`,
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: radius.xl,
                background: colors.accentGlow,
                border: `1px solid ${colors.accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Plug size={22} color={colors.accent} />
            </div>
            <h3
              style={{
                margin: "0 0 6px",
                fontSize: typography.size.lg,
                fontWeight: typography.weight.semibold,
                color: colors.textSecondary,
              }}
            >
              No accounts connected
            </h3>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: typography.size.base,
                color: colors.textMuted,
              }}
            >
              Connect your social media accounts to start scheduling and
              publishing posts.
            </p>
            <button
              onClick={() => setShowConnect(true)}
              style={{
                padding: "10px 20px",
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
                border: "none",
                borderRadius: radius.lg,
                color: "#080808",
                fontSize: typography.size.sm,
                fontWeight: typography.weight.extrabold,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Connect First Account
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {accounts.map((account) => {
              const platform =
                PLATFORM_CONFIG[account.platform] ?? PLATFORM_CONFIG.FACEBOOK;
              const isDeleting = deletingId === account.id;
              const isExpired =
                account.tokenExpiresAt &&
                new Date(account.tokenExpiresAt) < new Date();

              return (
                <div
                  key={account.id}
                  style={{
                    ...cardStyle,
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    transition: transition.fast,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = colors.borderStrong)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = colors.border)
                  }
                >
                  {/* Platform icon */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: radius.lg,
                      background: platform.bg,
                      border: `1px solid ${platform.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: "800",
                      color: platform.color,
                      flexShrink: 0,
                    }}
                  >
                    {platform.icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: typography.size.md,
                          fontWeight: typography.weight.semibold,
                          color: colors.text,
                        }}
                      >
                        {account.accountName ??
                          account.username ??
                          account.accountId}
                      </p>
                      <span
                        style={{
                          fontSize: typography.size.xs,
                          padding: "1px 7px",
                          borderRadius: radius.full,
                          background: platform.bg,
                          color: platform.color,
                          fontWeight: typography.weight.bold,
                          letterSpacing: typography.tracking.wider,
                          border: `1px solid ${platform.border}`,
                        }}
                      >
                        {platform.label}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {account.isActive && !isExpired ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: typography.size.sm,
                            color: colors.success,
                          }}
                        >
                          <CheckCircle2 size={11} /> Active
                        </span>
                      ) : (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: typography.size.sm,
                            color: colors.error,
                          }}
                        >
                          <AlertCircle size={11} />{" "}
                          {isExpired ? "Token expired" : "Inactive"}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: typography.size.sm,
                          color: colors.textFaint,
                        }}
                      >
                        ·
                      </span>
                      <span
                        style={{
                          fontSize: typography.size.sm,
                          color: colors.textMuted,
                        }}
                      >
                        Connected{" "}
                        {new Date(account.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    {isExpired && (
                      <button
                        onClick={handleConnectFacebook}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "7px 12px",
                          background: "transparent",
                          border: `1px solid ${colors.accentBorder}`,
                          borderRadius: radius.md,
                          color: colors.accent,
                          fontSize: typography.size.sm,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: transition.fast,
                        }}
                      >
                        <RefreshCw size={12} /> Reconnect
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(account.id)}
                      disabled={isDeleting}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: radius.md,
                        background: "transparent",
                        border: `1px solid transparent`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: isDeleting ? "not-allowed" : "pointer",
                        color: colors.textMuted,
                        transition: transition.fast,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.errorBg;
                        e.currentTarget.style.borderColor = colors.errorBorder;
                        e.currentTarget.style.color = colors.error;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.color = colors.textMuted;
                      }}
                    >
                      {isDeleting ? (
                        <Loader2
                          size={14}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available platforms */}
      <div>
        <p
          style={{
            margin: "0 0 12px",
            fontSize: typography.size.xs,
            fontWeight: typography.weight.bold,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: colors.textFaint,
          }}
        >
          Available Platforms
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {CONNECT_PLATFORMS.map((platform) => (
            <div
              key={platform.key}
              style={{
                ...cardStyle,
                cursor: platform.available ? "pointer" : "default",
                opacity: platform.available ? 1 : 0.5,
                transition: transition.fast,
              }}
              onMouseEnter={(e) => {
                if (platform.available)
                  e.currentTarget.style.borderColor = platform.color + "40";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
              }}
              onClick={() => platform.available && setShowConnect(true)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: radius.lg,
                    background: platform.color + "15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "800",
                    color: platform.color,
                  }}
                >
                  {
                    PLATFORM_CONFIG[
                      platform.key as keyof typeof PLATFORM_CONFIG
                    ]?.icon
                  }
                </div>
                {platform.available ? (
                  <span
                    style={{
                      fontSize: typography.size.xs,
                      padding: "2px 7px",
                      borderRadius: radius.full,
                      background: colors.successBg,
                      color: colors.success,
                      fontWeight: typography.weight.bold,
                    }}
                  >
                    Available
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: typography.size.xs,
                      padding: "2px 7px",
                      borderRadius: radius.full,
                      background: colors.surface,
                      color: colors.textFaint,
                      fontWeight: typography.weight.bold,
                      border: `1px solid ${colors.divider}`,
                    }}
                  >
                    Soon
                  </span>
                )}
              </div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: typography.size.base,
                  fontWeight: typography.weight.semibold,
                  color: colors.textSecondary,
                }}
              >
                {platform.label}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: typography.size.sm,
                  color: colors.textMuted,
                  lineHeight: "1.5",
                }}
              >
                {platform.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Modal */}
      {showConnect && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setShowConnect(false)}
        >
          <div
            style={{
              background: "#0e0e0e",
              border: `1px solid ${colors.borderStrong}`,
              borderRadius: radius["2xl"],
              padding: "28px",
              width: "440px",
              fontFamily: typography.fontSans,
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
              <h2
                style={{
                  margin: 0,
                  fontSize: typography.size.xl,
                  fontWeight: typography.weight.bold,
                }}
              >
                Connect Account
              </h2>
              <button
                onClick={() => setShowConnect(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: colors.textMuted,
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p
              style={{
                margin: "0 0 20px",
                fontSize: typography.size.base,
                color: colors.textMuted,
              }}
            >
              Choose a platform to connect to{" "}
              <strong style={{ color: colors.text }}>
                {activeWorkspace.name}
              </strong>
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {CONNECT_PLATFORMS.map((platform) => (
                <div
                  key={platform.key}
                  onClick={() => {
                    if (!platform.available) return;
                    if (platform.key === "FACEBOOK") handleConnectFacebook();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px",
                    borderRadius: radius.lg,
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    cursor: platform.available ? "pointer" : "not-allowed",
                    opacity: platform.available ? 1 : 0.4,
                    transition: transition.fast,
                  }}
                  onMouseEnter={(e) => {
                    if (platform.available) {
                      e.currentTarget.style.borderColor = platform.color + "50";
                      e.currentTarget.style.background = platform.color + "08";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.background = colors.surface;
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: radius.lg,
                      background: platform.color + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      fontWeight: "800",
                      color: platform.color,
                      flexShrink: 0,
                    }}
                  >
                    {
                      PLATFORM_CONFIG[
                        platform.key as keyof typeof PLATFORM_CONFIG
                      ]?.icon
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: typography.size.base,
                        fontWeight: typography.weight.semibold,
                        color: colors.text,
                      }}
                    >
                      {platform.label}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: typography.size.sm,
                        color: colors.textMuted,
                      }}
                    >
                      {platform.desc}
                    </p>
                  </div>
                  {!platform.available && (
                    <span
                      style={{
                        fontSize: typography.size.xs,
                        padding: "2px 7px",
                        background: colors.surface,
                        border: `1px solid ${colors.divider}`,
                        borderRadius: radius.full,
                        color: colors.textFaint,
                        fontWeight: typography.weight.bold,
                      }}
                    >
                      Soon
                    </span>
                  )}
                  {platform.available &&
                    connecting &&
                    platform.key === "FACEBOOK" && (
                      <Loader2
                        size={16}
                        color={colors.accent}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
