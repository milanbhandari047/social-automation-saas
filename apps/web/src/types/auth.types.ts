export interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthFormState {
  loading: boolean;
  error: string;
  fieldErrors: FieldErrors;
}
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}
