import { useState } from "react";
import { FieldErrors } from "@/types/auth.types";

export function useAuthForm() {
  const [focused, setFocused] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const resetErrors = () => {
    setFieldErrors({});
    setError("");
  };

  return {
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
  };
}
