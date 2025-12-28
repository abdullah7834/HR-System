import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (!user) {
    redirect("/login");
  }

  // If authenticated, redirect to dashboard
  redirect("/dashboard");
}
