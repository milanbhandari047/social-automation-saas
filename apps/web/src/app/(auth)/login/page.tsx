"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth.service";
import {
  AuthLayout,
  AuthHeader,
  AuthLink,
  FormField,
  ApiError,
  SubmitButton,
} from "@/components/auth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { validateLoginForm } from "@/constants/auth/validation";
import { colors } from "@/constants/auth/styles";

const LOGIN_ICON = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.bg}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    focused,
    setFocused,
    fieldErrors,
    setFieldErrors,
    error,
    setError,
    loading,
    setLoading,
    clearFieldError,
    resetErrors,
  } = useAuthForm();

  const handleLogin = async () => {
    resetErrors();

    const errors = validateLoginForm(email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const forgotLink = (
    <a
      href="#"
      style={{
        fontSize: "12px",
        color: colors.textDim,
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = colors.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = colors.textDim;
      }}
    >
      Forgot?
    </a>
  );

  return (
    <AuthLayout>
      <AuthHeader
        icon={LOGIN_ICON}
        title="Welcome back"
        subtitle="Sign in to your workspace"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <FormField
          label="Email"
          field="email"
          type="email"
          value={email}
          placeholder="you@example.com"
          focused={focused}
          error={fieldErrors.email}
          onChange={(v) => {
            setEmail(v);
            clearFieldError("email");
          }}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          onEnter={handleLogin}
        />

        <FormField
          label="Password"
          field="password"
          type="password"
          value={password}
          placeholder="••••••••"
          focused={focused}
          error={fieldErrors.password}
          labelRight={forgotLink}
          onChange={(v) => {
            setPassword(v);
            clearFieldError("password");
          }}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused(null)}
          onEnter={handleLogin}
        />

        <ApiError message={error} />

        <SubmitButton
          loading={loading}
          label="Sign In"
          loadingLabel="Signing in..."
          onClick={handleLogin}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          margin: "28px 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: colors.divider }} />
        <span
          style={{
            fontSize: "12px",
            color: colors.textDimmer,
            letterSpacing: "1px",
          }}
        >
          OR
        </span>
        <div style={{ flex: 1, height: "1px", background: colors.divider }} />
      </div>

      <AuthLink
        prompt="Don't have an account?"
        label="Create one"
        href="/register"
      />
    </AuthLayout>
  );
}
