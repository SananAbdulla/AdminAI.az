"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreProvider, useStore } from "@/lib/store";
import type { ReactNode } from "react";

const nav = [
  { href: "/app", label: "İdarə paneli" },
  { href: "/app/inbox", label: "Mesajlar" },
  { href: "/app/appointments", label: "Randevular" },
  { href: "/app/customers", label: "Müştərilər" },
  { href: "/app/assistant", label: "AI administrator" },
];

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useStore();
  const unread = state.messages.filter((m) => m.unread && m.direction === "in").length;

  return (
    <div className="min-h-full flex bg-[#f4f1ea] text-[#1c1915]">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-[#e6dfd2] bg-[#fffcf7]">
        <Link href="/" className="px-6 py-6 border-b border-[#e6dfd2]">
          <p className="text-xs tracking-[0.2em] uppercase text-[#0f6b5c] font-semibold">
            AdminAI.az
          </p>
          <p className="mt-1 text-lg font-semibold">{state.business.name}</p>
          <p className="text-sm text-[#6b6458]">{state.business.category}</p>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                  active
                    ? "bg-[#0f6b5c] text-white"
                    : "text-[#3f3a32] hover:bg-[#f4f1ea]"
                }`}
              >
                {item.label}
                {item.href === "/app/inbox" && unread > 0 && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      active ? "bg-white/20" : "bg-[#c45c26] text-white"
                    }`}
                  >
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-5 border-t border-[#e6dfd2] text-sm text-[#6b6458]">
          <p className="font-medium text-[#1c1915]">{state.business.owner}</p>
          <p>{state.business.city} · {state.business.phone}</p>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#e6dfd2] bg-[#fffcf7]">
          <span className="font-semibold">AdminAI.az</span>
          <span className="text-sm text-[#6b6458]">{state.business.name}</span>
        </header>
        <div className="md:hidden flex gap-2 overflow-x-auto px-3 py-2 border-b border-[#e6dfd2] bg-[#fffcf7]">
          {nav.map((item) => {
            const active =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm ${
                  active
                    ? "border-[#0f6b5c] bg-[#0f6b5c] text-white"
                    : "border-[#e6dfd2]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ShellInner>{children}</ShellInner>
    </StoreProvider>
  );
}
