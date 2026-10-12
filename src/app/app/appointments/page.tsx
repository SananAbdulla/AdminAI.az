"use client";

import { StatusBadge } from "@/components/StatusBadge";
import { formatAzDate, formatAzn } from "@/lib/dates";
import { useStore } from "@/lib/store";

export default function AppointmentsPage() {
  const { state } = useStore();
  const groups = ["Bu gün", "Sabah", "Digər"] as const;

  function groupOf(date: string) {
    const label = formatAzDate(date);
    if (label === "Bu gün" || label === "Sabah") return label;
    return "Digər";
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1
        className="text-3xl font-semibold"
        style={{ fontFamily: "var(--font-source-serif), serif" }}
      >
        Randevular
      </h1>
      {groups.map((g) => {
        const items = state.appointments.filter((a) => groupOf(a.date) === g);
        if (!items.length) return null;
        return (
          <section key={g} className="space-y-2">
            <h2 className="text-sm font-medium text-[#6b6458]">{g}</h2>
            {items.map((a) => {
              const c = state.customers.find((x) => x.id === a.customerId);
              return (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e6dfd2] bg-[#fffcf7] px-4 py-3"
                >
                  <div>
                    <p className="font-medium">
                      {formatAzDate(a.date)} {a.time} · {c?.name}
                    </p>
                    <p className="text-sm text-[#6b6458]">
                      {a.service} · {a.durationMin} dəq · {formatAzn(a.priceAzn)}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
