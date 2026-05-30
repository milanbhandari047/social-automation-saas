"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";
import {
  AuthLayout,
  AuthHeader,
  AuthLink,
  FormField,
  ApiError,
  SubmitButton,
  PasswordStrengthMeter,
} from "@/components/auth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { usePasswordStrength } from "@/hooks/usePasswordStrength";
import { validateRegisterForm } from "@/constants/auth/validation";
import { colors } from "@/constants/auth/styles";

const REGISTER_ICON = (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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

  const strength = usePasswordStrength(password);

  const handleRegister = async () => {
    resetErrors();

    const errors = validateRegisterForm(name, email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await registerUser({ name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        icon={REGISTER_ICON}
        title="Create account"
        subtitle="Start automating your social presence"
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <FormField
          label="Full Name"
          field="name"
          value={name}
          placeholder="Milan Bhandari"
          focused={focused}
          error={fieldErrors.name}
          onChange={(v) => {
            setName(v);
            clearFieldError("name");
          }}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          onEnter={handleRegister}
        />

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
          onEnter={handleRegister}
        />

        <FormField
          label="Password"
          field="password"
          type="password"
          value={password}
          placeholder="••••••••"
          focused={focused}
          error={fieldErrors.password}
          below={<PasswordStrengthMeter strength={strength} />}
          onChange={(v) => {
            setPassword(v);
            clearFieldError("password");
          }}
          onFocus={() => setFocused("password")}
          onBlur={() => setFocused(null)}
          onEnter={handleRegister}
        />

        <ApiError message={error} />

        <SubmitButton
          loading={loading}
          label="Create Account"
          loadingLabel="Creating account..."
          onClick={handleRegister}
        />
      </div>

      <AuthLink
        prompt="Already have an account?"
        label="Sign in"
        href="/login"
      />
    </AuthLayout>
  );
}
