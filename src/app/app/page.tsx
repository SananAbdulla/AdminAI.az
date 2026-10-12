"use client";

import { Assistant } from "@/components/Assistant";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAzDate, formatAzn } from "@/lib/dates";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function DashboardPage() {
  const { state } = useStore();
  const today = state.appointments.filter((a) => formatAzDate(a.date) === "Bu gün");
  const unread = state.messages.filter((m) => m.unread && m.direction === "in");
  const revenue = today
    .filter((a) => a.status !== "cancelled")
    .reduce((s, a) => s + a.priceAzn, 0);
  const pending = today.filter((a) => a.status === "pending").length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-sm text-[#6b6458]">{state.business.address}</p>
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-source-serif), serif" }}
        >
          Günün idarəsi
        </h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Bu gün randevu" value={String(today.length)} />
        <Stat label="Gözlənilən gəlir" value={formatAzn(revenue)} />
        <Stat label="Oxunmamış mesaj" value={String(unread.length)} hint={pending ? `${pending} təsdiq gözləyir` : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Cədvəl</h2>
            <Link href="/app/appointments" className="text-sm text-[#0f6b5c]">
              Hamısı
            </Link>
          </div>
          <div className="space-y-2">
            {today.map((a) => {
              const customer = state.customers.find((c) => c.id === a.customerId);
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-2xl border border-[#e6dfd2] bg-[#fffcf7] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {a.time} · {customer?.name}
                    </p>
                    <p className="text-sm text-[#6b6458]">
                      {a.service} · {formatAzn(a.priceAzn)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="font-semibold">Gözləyən mesajlar</h2>
            <Link href="/app/inbox" className="text-sm text-[#0f6b5c]">
              Inbox
            </Link>
          </div>
          {unread.length === 0 ? (
            <p className="text-sm text-[#6b6458]">Inbox təmizdir.</p>
          ) : (
            unread.map((m) => {
              const customer = state.customers.find((c) => c.id === m.customerId);
              return (
                <Link
                  key={m.id}
                  href="/app/inbox"
                  className="block rounded-2xl border border-[#e6dfd2] bg-[#fffcf7] px-4 py-3"
                >
                  <p className="text-sm font-medium">
                    {customer?.name} · {m.channel}
                  </p>
                  <p className="text-sm text-[#5c564c] line-clamp-2">{m.text}</p>
                </Link>
              );
            })
          )}
        </section>
        <Assistant compact />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6dfd2] bg-[#fffcf7] px-5 py-4">
      <p className="text-sm text-[#6b6458]">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#c45c26]">{hint}</p> : null}
    </div>
  );
}
