import { NextResponse } from "next/server";
import { demoReply, SYSTEM_PROMPT, type ChatMessage } from "@/lib/concierge";
import { bad, clean } from "@/lib/booking/http";

export async function POST(req: Request) {
  let body: { messages?: unknown };
  try {
    body = (await req.json()) as { messages?: unknown };
  } catch {
    return bad("Invalid request.", 400);
  }
  const raw = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const messages: ChatMessage[] = raw
    .map((m) => m as Record<string, unknown>)
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role as ChatMessage["role"], content: clean(m.content, 800) }))
    .filter((m) => m.content);
  const last = [...messages].reverse().find((m) => m.role === "user");
  if (!last) return bad("Please type a question.");

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ ok: true, mode: "demo", ...demoReply(last.content) });

  try {
    const first = messages.findIndex((m) => m.role === "user");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.CONCIERGE_MODEL || "claude-sonnet-5-5",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.slice(first),
      }),
    });
    const json = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = json.content?.find((c) => c.type === "text")?.text;
    if (!res.ok || !text) throw new Error("no reply");
    const wantsBooking = /book|availability|available|price/i.test(last.content);
    return NextResponse.json({ ok: true, mode: "live", reply: text, action: wantsBooking ? { label: "Check availability", href: "/book" } : undefined });
  } catch {
    return NextResponse.json({ ok: true, mode: "fallback", ...demoReply(last.content) });
  }
}
