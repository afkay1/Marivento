"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, HOTEL } from "@/lib/data/hotel";
import Logo from "./Logo";

/** Pages without a full-bleed hero image start with the solid header. */
const SOLID = [/^\/book/, /^\/manage/, /^\/admin/, /^\/faq/, /^\/policies/];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solid = scrolled || open || SOLID.some((r) => r.test(pathname));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
          solid ? "bg-chalk/95 text-ink shadow-[0_1px_0_#DDD3C3] backdrop-blur-md" : "bg-gradient-to-b from-black/35 to-transparent text-chalk"
        }`}
      >
        <div className="mx-auto flex h-[var(--header)] max-w-[1440px] items-center justify-between gap-6 px-[var(--pad)]">
          <Logo light={!solid} />
          <nav aria-label="Main" className="hidden items-center gap-8 xl:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`relative py-2 text-[15px] font-medium transition-opacity hover:opacity-70 ${active(n.href) ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-terra" : ""}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a href={HOTEL.phoneHref} className="hidden text-[15px] font-medium hover:opacity-70 lg:inline">
              {HOTEL.phone}
            </a>
            <Link href="/book" className={`btn hidden min-h-[44px] px-6 sm:inline-flex ${solid ? "btn-sea" : "btn-light"}`}>
              Book your stay
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-11 w-11 items-center justify-center xl:hidden"
            >
              <span className={`absolute h-0.5 w-6 rounded bg-current transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-0.5 w-6 rounded bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute h-0.5 w-6 rounded bg-current transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </div>
      </header>
      <div
        id="menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-chalk pt-[var(--header)] transition-[opacity,visibility] duration-500 xl:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <nav aria-label="Mobile" className="wrap flex flex-1 flex-col justify-center gap-1">
          {[{ href: "/", label: "Home" }, ...NAV, { href: "/getting-here", label: "Getting here" }].map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              tabIndex={open ? 0 : -1}
              className="display py-1 text-[40px] transition-[transform,opacity] duration-500 hover:text-terra sm:text-[52px]"
              style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms", transform: open ? "none" : "translateY(16px)", opacity: open ? 1 : 0 }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="wrap flex flex-col gap-4 border-t border-line py-6">
          <Link href="/book" tabIndex={open ? 0 : -1} className="btn btn-sea w-full">Book your stay</Link>
          <a href={HOTEL.phoneHref} tabIndex={open ? 0 : -1} className="text-center text-mist">{HOTEL.phone}</a>
        </div>
      </div>
    </>
  );
}
