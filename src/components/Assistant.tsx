"use client";

import { runLocalAdmin } from "@/lib/ai";
import { useStore } from "@/lib/store";
import { useState } from "react";

const starters = [
  "Bu gün nə var?",
  "Oxunmamış mesajlar",
  "Ayselə cavab yaz",
  "Randevunu təsdiqlə",
  "Kimdə borc var?",
];

export function Assistant({ compact = false }: { compact?: boolean }) {
  const { state, applyActions } = useStore();
  const [input, setInput] = useState("");
  const [log, setLog] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: `Salam, mən ${state.business.name} üçün AdminAI administratoruyam. Cədvələ, müştərilərə və mesajlara baxıram. Nədən başlayaq?`,
    },
  ]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const result = runLocalAdmin(q, state);
    if (result.actions?.length) applyActions(result.actions);
    setLog((prev) => [
      ...prev,
      { role: "user", text: q },
      { role: "ai", text: result.reply },
    ]);
    setInput("");
  }

  return (
    <div
      className={`flex flex-col rounded-2xl border border-[#e6dfd2] bg-[#fffcf7] ${
        compact ? "h-[560px]" : "min-h-[70vh]"
      }`}
    >
      <div className="px-5 py-4 border-b border-[#e6dfd2]">
        <p className="text-sm font-semibold">AI administrator</p>
        <p className="text-xs text-[#6b6458]">Azərbaycan dilində, biznesinizə bağlı</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {log.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
              m.role === "user"
                ? "ml-auto bg-[#0f6b5c] text-white"
                : "bg-[#f4f1ea] text-[#1c1915]"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-[#e6dfd2] space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="text-xs rounded-full border border-[#e6dfd2] px-2.5 py-1 hover:bg-[#f4f1ea]"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Administratora yazın..."
            className="flex-1 rounded-xl border border-[#e6dfd2] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0f6b5c]"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#0f6b5c] px-4 text-sm font-medium text-white"
          >
            Göndər
          </button>
        </form>
      </div>
    </div>
  );
}
