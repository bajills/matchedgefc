import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!raw || !emailRe.test(raw)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.from("subscribers").insert({ email: raw, is_paid: false });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({
        ok: true,
        message: "You're in — we'll notify you when picks drop.",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    message: "You're in — we'll notify you when picks drop.",
  });
}
