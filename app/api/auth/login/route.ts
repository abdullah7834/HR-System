import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 401 });

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Unexpected error" },
      { status: 500 }
    );
  }
}
