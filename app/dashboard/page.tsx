import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/Dashboard/DashboardShell";
import { createClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell
      initialUserLabel={user.email?.split("@")[0] ?? user.user_metadata?.full_name ?? "you"}
    />
  );
}
