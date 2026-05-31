"use client";

import {
  LayoutDashboard,
  Building2,
  Settings,
  CalendarDays,
  BarChart3,
  Share2,
  Sparkles,
  CreditCard,
  Zap,
  LogOut,
  Plug,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { colors, typography, radius, transition } from "@/constants/tokens";
import { logoutUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const navSections = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/workspace", label: "Workspaces", icon: Building2 },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/posts", label: "Posts", icon: Share2 },
      { href: "/social-accounts", label: "Social Accounts", icon: Plug },
      {
        href: "/calendar",
        label: "Calendar",
        icon: CalendarDays,
        badge: "Soon",
      },
      {
        href: "/analytics",
        label: "Analytics",
        icon: BarChart3,
        badge: "Soon",
      },
    ],
  },
  {
    label: "Tools",
    items: [
      { href: "/ai", label: "AI Assistant", icon: Sparkles, badge: "Soon" },
      { href: "/billing", label: "Billing", icon: CreditCard, badge: "Soon" },
      { href: "/setting", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearUser();
      localStorage.removeItem("accessToken");
      router.replace("/login");
    }
  };

  return (
    <div
      style={{
        width: "240px",
        minWidth: "240px",
        background: "#080808",
        borderRight: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: typography.fontSans,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "22px 18px 18px",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: radius.lg,
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 24px rgba(245,158,11,0.3)",
            flexShrink: 0,
          }}
        >
          <Zap size={17} color="#080808" strokeWidth={2.5} />
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              color: colors.text,
              letterSpacing: "-0.4px",
              lineHeight: 1,
            }}
          >
            AutoPost
          </p>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: typography.size.xs,
              color: colors.textFaint,
              letterSpacing: typography.tracking.label,
              fontWeight: typography.weight.semibold,
            }}
          >
            SOCIAL SaaS
          </p>
        </div>
      </div>

      {/* Nav */}
      <div
        style={{
          flex: 1,
          padding: "16px 10px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          scrollbarWidth: "none",
        }}
      >
        {navSections.map((section) => (
          <div key={section.label}>
            <p
              style={{
                margin: "0 0 6px 8px",
                fontSize: typography.size.xs,
                fontWeight: typography.weight.bold,
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                color: colors.textFaint,
              }}
            >
              {section.label}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {section.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 10px",
                        borderRadius: radius.md,
                        background: active ? colors.accentGlow : "transparent",
                        border: active
                          ? `1px solid ${colors.accentBorder}`
                          : "1px solid transparent",
                        cursor: "pointer",
                        transition: transition.fast,
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        if (!active)
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        if (!active)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {active && (
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "3px",
                            height: "60%",
                            background: colors.accent,
                            borderRadius: "0 2px 2px 0",
                          }}
                        />
                      )}
                      <Icon
                        size={15}
                        color={active ? colors.accent : colors.textMuted}
                        strokeWidth={active ? 2.5 : 1.8}
                      />
                      <span
                        style={{
                          fontSize: typography.size.base,
                          flex: 1,
                          color: active ? colors.accent : colors.textSecondary,
                          fontWeight: active
                            ? typography.weight.semibold
                            : typography.weight.normal,
                        }}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: typography.size.xs,
                            padding: "2px 5px",
                            background: colors.surface,
                            border: `1px solid ${colors.divider}`,
                            borderRadius: radius.sm,
                            color: colors.textFaint,
                            letterSpacing: typography.tracking.wider,
                            fontWeight: typography.weight.bold,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Plan badge */}
      <div style={{ padding: "0 10px 10px" }}>
        <div
          style={{
            padding: "14px",
            background: colors.accentGlow,
            border: `1px solid ${colors.accentBorder}`,
            borderRadius: radius.lg,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: typography.size.xs,
                color: colors.accentText,
                fontWeight: typography.weight.bold,
                letterSpacing: typography.tracking.widest,
              }}
            >
              FREE PLAN
            </span>
            <Sparkles size={11} color={colors.accent} />
          </div>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: typography.size.sm,
              color: colors.textMuted,
              lineHeight: "1.5",
            }}
          >
            5 posts used · 50/mo limit
          </p>
          <div
            style={{
              width: "100%",
              height: "2px",
              background: colors.divider,
              borderRadius: "1px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "10%",
                height: "100%",
                background: colors.accent,
                borderRadius: "1px",
              }}
            />
          </div>
          <button
            style={{
              width: "100%",
              padding: "8px",
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
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: "0 10px 16px" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: radius.md,
            background: "transparent",
            border: "1px solid transparent",
            cursor: "pointer",
            transition: transition.fast,
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.errorBg;
            e.currentTarget.style.borderColor = colors.errorBorder;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <LogOut size={15} color={colors.textMuted} strokeWidth={1.8} />
          <span
            style={{
              fontSize: typography.size.base,
              color: colors.textMuted,
              fontWeight: typography.weight.normal,
            }}
          >
            Sign out
          </span>
        </button>
      </div>
    </div>
  );
}
