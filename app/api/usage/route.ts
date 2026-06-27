import { createClient } from "@/lib/supabase-server";
import { DAILY_MESSAGE_LIMIT, getTodayDateKey, getTomorrowDateKey } from "@/lib/usage";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTodayDateKey();

  const { data: usage } = await supabase
    .from("usage")
    .select("message_count")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  const used = usage?.message_count ?? 0;

  return Response.json({
    limit: DAILY_MESSAGE_LIMIT,
    used,
    remaining: Math.max(DAILY_MESSAGE_LIMIT - used, 0),
    resetsOn: getTomorrowDateKey(),
  });
}
