"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            style={{
              animation: "spin 0.9s linear infinite",
              marginBottom: "16px",
            }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={{ color: "#2a2a2a", fontSize: "13px", margin: 0 }}>
            Loading your workspace…
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#080808",
        overflow: "hidden",
      }}
    >
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Topbar />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 32px",
            background: "#080808",
            scrollbarWidth: "thin",
            scrollbarColor: "#1a1a1a transparent",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
