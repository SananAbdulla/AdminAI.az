"use client";

import { formatAzDate, formatAzn } from "@/lib/dates";
import { useStore } from "@/lib/store";

export default function CustomersPage() {
  const { state } = useStore();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1
        className="text-3xl font-semibold"
        style={{ fontFamily: "var(--font-source-serif), serif" }}
      >
        Müştərilər
      </h1>
      <div className="grid gap-3">
        {state.customers.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border border-[#e6dfd2] bg-[#fffcf7] px-5 py-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold">{c.name}</h2>
                <p className="text-sm text-[#6b6458]">{c.phone}</p>
              </div>
              <p className="text-sm">
                Balans:{" "}
                <span className={c.balanceAzn > 0 ? "text-[#c45c26]" : "text-[#0f6b5c]"}>
                  {formatAzn(c.balanceAzn)}
                </span>
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5c564c]">{c.notes}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[#f4f1ea] px-2.5 py-1 text-xs"
                >
                  {t}
                </span>
              ))}
              <span className="text-xs text-[#6b6458] self-center">
                Son ziyarət: {formatAzDate(c.lastVisit)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
