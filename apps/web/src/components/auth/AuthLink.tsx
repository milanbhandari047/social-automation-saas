"use client";

import React from "react";
import { colors } from "@/constants/auth/styles";

interface AuthLinkProps {
  prompt: string;
  label: string;
  href: string;
}

export function AuthLink({ prompt, label, href }: AuthLinkProps) {
  return (
    <p
      style={{
        textAlign: "center",
        fontSize: "13px",
        color: colors.textDim,
        margin: "28px 0 0",
      }}
    >
      {prompt}{" "}
      <a
        href={href}
        style={{
          color: colors.accent,
          textDecoration: "none",
          fontWeight: "500",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = colors.accentDark)}
        onMouseLeave={(e) => (e.currentTarget.style.color = colors.accent)}
      >
        {label}
      </a>
    </p>
  );
}
