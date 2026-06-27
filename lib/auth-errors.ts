const AUTH_ERROR_MAP: Record<string, string> = {
  "Invalid login credentials": "That email and password combination didn't match. Try again slowly.",
  "Email not confirmed": "Check your inbox and confirm your email first, then come back here.",
  "User already registered": "That email already has an account. Try logging in instead.",
  "Password should be at least 6 characters":
    "Use a password with at least 6 characters.",
};

export function normalizeAuthError(message: string) {
  return AUTH_ERROR_MAP[message] ?? "Something got in the way. Try again in a moment.";
}
