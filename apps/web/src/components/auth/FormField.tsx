import React from "react";
import {
  colors,
  INPUT_BASE_STYLE,
  LABEL_BASE_STYLE,
} from "@/constants/auth/styles";
import { FieldError } from "./FieldError";

interface FormFieldProps {
  label: string;
  field: string;
  type?: string;
  value: string;
  placeholder?: string;
  focused: string | null;
  error?: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnter?: () => void;
  /** Optional content rendered to the right of the label */
  labelRight?: React.ReactNode;
  /** Optional content rendered below the input (e.g. strength meter) */
  below?: React.ReactNode;
}

export function FormField({
  label,
  field,
  type = "text",
  value,
  placeholder,
  focused,
  error,
  onChange,
  onFocus,
  onBlur,
  onEnter,
  labelRight,
  below,
}: FormFieldProps) {
  const isFocused = focused === field;

  const labelColor = error
    ? colors.error
    : isFocused
    ? colors.accent
    : colors.textMuted;

  const borderColor = error
    ? colors.borderError
    : isFocused
    ? colors.borderFocus
    : colors.border;

  const boxShadow = error
    ? `0 0 0 3px ${colors.errorShadow}`
    : isFocused
    ? `0 0 0 3px var(--accent-focus)`
    : "none";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: labelRight ? "space-between" : undefined,
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <label style={{ ...LABEL_BASE_STYLE, color: labelColor }}>
          {label}
        </label>
        {labelRight}
      </div>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        style={{
          ...INPUT_BASE_STYLE,
          background: isFocused ? colors.surfaceFocus : colors.surface,
          border: `1px solid ${borderColor}`,
          boxShadow,
        }}
      />

      {below}
      <FieldError msg={error} />
    </div>
  );
}
