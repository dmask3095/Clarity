export const DAILY_MESSAGE_LIMIT = 50;

export function getTodayDateKey() {
  return new Date().toISOString().split("T")[0];
}

export function getTomorrowDateKey() {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
