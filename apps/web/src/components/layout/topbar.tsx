"use client";

import {
  Bell,
  Plus,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { colors, typography, radius, transition } from "@/constants/tokens";
import { logoutUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function Topbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { clearUser } = useAuthStore();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  //   const handleLogout = () => {
  //     document.cookie = "token=; max-age=0; path=/";
  //     localStorage.removeItem("token");
  //     router.push("/login");
  //   };
  // replace handleLogout with this

  const handleLogout = async () => {
    try {
      await logoutUser(); // hits backend → backend clears httpOnly refreshToken cookie
    } finally {
      clearUser(); // clears zustand store
      localStorage.removeItem("accessToken"); // clears access token
      router.replace("/login"); // redirect
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div
      style={{
        height: "58px",
        borderBottom: `1px solid ${colors.border}`,
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        gap: "16px",
        fontFamily: typography.fontSans,
        flexShrink: 0,
      }}
    >
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${colors.border}`,
          borderRadius: radius.md,
          padding: "8px 14px",
          width: "250px",
          cursor: "text",
          transition: transition.fast,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = colors.borderStrong)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = colors.border)
        }
      >
        <Search size={14} color={colors.textMuted} strokeWidth={1.8} />
        <span
          style={{ fontSize: typography.size.base, color: colors.textMuted }}
        >
          {" "}
          {/* ← was #2a2a2a */}
          Search posts, accounts…
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: typography.size.xs,
            padding: "1px 5px",
            background: colors.surface,
            border: `1px solid ${colors.divider}`,
            borderRadius: radius.sm,
            color: colors.textFaint, // ← was #2a2a2a (invisible)
            fontWeight: typography.weight.semibold,
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* New Post button */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
            border: "none",
            borderRadius: radius.md,
            color: "#080808",
            fontSize: typography.size.sm,
            fontWeight: typography.weight.extrabold,
            letterSpacing: typography.tracking.wider,
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 2px 12px rgba(245,158,11,0.25)",
            transition: transition.fast,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Plus size={14} strokeWidth={3} />
          New Post
        </button>

        {/* Notifications */}
        <button
          style={{
            width: "36px",
            height: "36px",
            borderRadius: radius.md,
            background: "transparent",
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            transition: transition.fast,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <Bell size={15} color={colors.textMuted} strokeWidth={1.8} />{" "}
          {/* ← was #444 */}
          <span
            style={{
              position: "absolute",
              top: "7px",
              right: "7px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: colors.accent,
              border: "1.5px solid #080808",
            }}
          />
        </button>

        {/* User menu trigger */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 10px 5px 5px",
              borderRadius: radius.lg,
              background: menuOpen ? "rgba(255,255,255,0.05)" : "transparent",
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: transition.fast,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
            }
            onMouseLeave={(e) => {
              if (!menuOpen) e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: radius.md,
                background: "rgba(245,158,11,0.12)",
                border: `1px solid ${colors.accentBorder}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: typography.size.sm,
                fontWeight: typography.weight.extrabold,
                color: colors.accent,
                letterSpacing: typography.tracking.wide,
              }}
            >
              {initials}
            </div>

            {/* Name + plan */}
            <div style={{ textAlign: "left" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: typography.size.sm,
                  fontWeight: typography.weight.semibold,
                  color: colors.textSecondary, // ← was #d0d0d0 (ok, now token)
                  lineHeight: 1.2,
                }}
              >
                {user?.name?.split(" ")[0] || "User"}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: typography.size.xs,
                  color: colors.textMuted,
                }}
              >
                {" "}
                {/* ← was #606060 */}
                Free plan
              </p>
            </div>

            <ChevronDown
              size={12}
              color={colors.textFaint} // ← was #333 (invisible)
              style={{
                transition: "transform 0.15s",
                transform: menuOpen ? "rotate(180deg)" : "rotate(0)",
              }}
            />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                width: "200px",
                background: "#0e0e0e",
                border: `1px solid ${colors.borderStrong}`,
                borderRadius: radius.lg,
                padding: "6px",
                zIndex: 50,
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* User info header */}
              <div
                style={{
                  padding: "10px 12px 8px",
                  borderBottom: `1px solid ${colors.border}`,
                  marginBottom: "4px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.semibold,
                    color: colors.textSecondary, // ← was #c0c0c0
                  }}
                >
                  {user?.name || "User"}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: typography.size.sm,
                    color: colors.textMuted, // ← was #606060
                  }}
                >
                  {user?.email || ""}
                </p>
              </div>

              {/* Menu items */}
              {[
                {
                  icon: User,
                  label: "Profile",
                  action: () => router.push("/setting"),
                },
                {
                  icon: Settings,
                  label: "Settings",
                  action: () => router.push("/setting"),
                },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: radius.md,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: transition.fast,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.04)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Icon size={14} color={colors.textMuted} strokeWidth={1.8} />{" "}
                  {/* ← was #444 */}
                  <span
                    style={{
                      fontSize: typography.size.base,
                      color: colors.textSecondary,
                    }}
                  >
                    {" "}
                    {/* ← was #888 */}
                    {label}
                  </span>
                </button>
              ))}

              <div
                style={{
                  height: "1px",
                  background: colors.border,
                  margin: "4px 0",
                }}
              />

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: radius.md,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: transition.fast,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = colors.errorBg)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <LogOut size={14} color={colors.error} strokeWidth={1.8} />
                <span
                  style={{
                    fontSize: typography.size.base,
                    color: colors.error,
                  }}
                >
                  Sign out
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
