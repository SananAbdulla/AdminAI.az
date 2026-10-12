"use client";

import { formatTimeAgo } from "@/lib/dates";
import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";

const channelLabel = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  telefon: "Telefon",
};

export default function InboxPage() {
  const { state, markRead } = useStore();
  const threads = useMemo(() => {
    const map = new Map<string, typeof state.messages>();
    for (const m of state.messages) {
      const list = map.get(m.customerId) ?? [];
      list.push(m);
      map.set(m.customerId, list);
    }
    return [...map.entries()].sort((a, b) => {
      const at = new Date(a[1][a[1].length - 1].at).getTime();
      const bt = new Date(b[1][b[1].length - 1].at).getTime();
      return bt - at;
    });
  }, [state.messages]);

  const [openId, setOpenId] = useState(threads[0]?.[0] ?? "");
  const customer = state.customers.find((c) => c.id === openId);
  const thread = state.messages.filter((m) => m.customerId === openId);

  return (
    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#e6dfd2] bg-[#fffcf7] md:grid-cols-[280px_1fr] min-h-[70vh]">
      <aside className="border-b md:border-b-0 md:border-r border-[#e6dfd2]">
        <div className="px-4 py-4">
          <h1 className="font-semibold">Mesajlar</h1>
        </div>
        {threads.map(([id, msgs]) => {
          const c = state.customers.find((x) => x.id === id);
          const last = msgs[msgs.length - 1];
          const unread = msgs.some((m) => m.unread && m.direction === "in");
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setOpenId(id);
                msgs.filter((m) => m.unread).forEach((m) => markRead(m.id));
              }}
              className={`w-full px-4 py-3 text-left ${
                openId === id ? "bg-[#f4f1ea]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{c?.name}</p>
                <span className="text-[11px] text-[#6b6458]">
                  {formatTimeAgo(last.at)}
                </span>
              </div>
              <p className={`text-xs mt-0.5 line-clamp-1 ${unread ? "text-[#1c1915] font-medium" : "text-[#6b6458]"}`}>
                {last.text}
              </p>
            </button>
          );
        })}
      </aside>
      <section className="flex flex-col">
        <div className="border-b border-[#e6dfd2] px-5 py-4">
          <p className="font-semibold">{customer?.name}</p>
          <p className="text-sm text-[#6b6458]">
            {customer?.phone} · {customer?.notes}
          </p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {thread.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                m.direction === "out"
                  ? "ml-auto bg-[#0f6b5c] text-white"
                  : "bg-[#f4f1ea]"
              }`}
            >
              <p className="text-[11px] mb-1 opacity-70">
                {channelLabel[m.channel]}
              </p>
              {m.text}
            </div>
          ))}
        </div>
        <p className="px-5 py-4 text-sm text-[#6b6458] border-t border-[#e6dfd2]">
          Cavabı AI administrator yazır. Paneldə “Ayselə cavab yaz” deyin.
        </p>
      </section>
    </div>
  );
}
