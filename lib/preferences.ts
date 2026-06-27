export type SupportStyle = "gentle" | "structured" | "minimal";
export type ResponseLength = "brief" | "balanced" | "spacious";

export interface UserPreferences {
  supportStyle: SupportStyle;
  responseLength: ResponseLength;
  groundingPreference: "auto" | "ask-first";
}

export const defaultPreferences: UserPreferences = {
  supportStyle: "gentle",
  responseLength: "balanced",
  groundingPreference: "ask-first",
};
