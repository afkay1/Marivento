"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Msg {
  role: "user" | "assistant";
  content: string;
  action?: { label: string; href: string };
}

const SUGGESTIONS = ["How do I get there from Naples?", "Is breakfast included?", "Which room is best for a family?", "What's your cancellation policy?"];

/** AI concierge chat. Scripted answers in demo mode; uses Claude when ANTHROPIC_API_KEY is set. */
export default function Concierge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Buongiorno! I'm the Marivento concierge. How can I help you plan your stay?" },
  ]);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);
  useEffect(() => {
    if (open) field.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const json = (await res.json()) as { reply?: string; action?: Msg["action"] };
      setMsgs((m) => [...m, { role: "assistant", content: json.reply || "Sorry, something went wrong. Please call us.", action: json.action }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry, I couldn't connect. Please try again or call us." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="concierge"
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-sea px-5 py-3.5 text-sm font-semibold text-chalk shadow-card transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 5h16v11H8l-4 4z" strokeLinejoin="round" />
        </svg>
        {open ? "Close" : "Ask the concierge"}
      </button>
      <div
        id="concierge"
        role="dialog"
        aria-label="Marivento concierge chat"
        className={`fixed bottom-40 right-4 z-40 flex h-[min(560px,65svh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-line bg-chalk shadow-card transition-[opacity,transform,visibility] duration-300 md:bottom-24 md:right-6 ${
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between bg-sea px-5 py-4 text-chalk">
          <div>
            <p className="font-display text-xl">Concierge</p>
            <p className="text-xs text-chalk/70">Usually replies instantly</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-2xl leading-none text-chalk/80 hover:text-white">×</button>
        </div>
        <div ref={list} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite" data-lenis-prevent>
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${m.role === "user" ? "bg-sea text-chalk" : "border border-line bg-white"}`}>
                {m.content}
                {m.action && (
                  <Link href={m.action.href} onClick={() => setOpen(false)} className="mt-2 block font-semibold text-terra">
                    {m.action.label} →
                  </Link>
                )}
              </div>
            </div>
          ))}
          {busy && <p className="text-sm text-mist">Concierge is typing…</p>}
          {msgs.length === 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm hover:border-sea">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2 border-t border-line p-3"
        >
          <label htmlFor="concierge-input" className="sr-only">Your question</label>
          <input id="concierge-input" ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your stay" maxLength={500} className="field rounded-full py-2.5" />
          <button type="submit" disabled={busy || !input.trim()} className="btn btn-terra min-h-[44px] px-4" aria-label="Send">
            →
          </button>
        </form>
      </div>
    </div>
  );
}
