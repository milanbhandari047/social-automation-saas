import { FieldErrors } from "@/types/auth.types";

export function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
}

export function validateName(name: string): string | undefined {
  if (!name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
}

export function validateLoginForm(
  email: string,
  password: string
): FieldErrors {
  const errors: FieldErrors = {};
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return errors;
}

export function validateRegisterForm(
  name: string,
  email: string,
  password: string
): FieldErrors {
  const errors: FieldErrors = {};
  const nameErr = validateName(name);
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);

  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (passErr) {
    errors.password = passErr;
  } else if (!/[A-Z]/.test(password) && !/[0-9]/.test(password)) {
    errors.password = "Use a mix of letters and numbers.";
  }

  return errors;
}
