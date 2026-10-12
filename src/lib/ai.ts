import { formatAzDate, formatAzn } from "./dates";
import type { AiResult, AppState } from "./types";

function customerById(state: AppState, id: string) {
  return state.customers.find((c) => c.id === id);
}

function findCustomer(state: AppState, q: string) {
  const n = q.toLowerCase();
  return state.customers.find(
    (c) =>
      c.name.toLowerCase().includes(n) ||
      n.includes(c.name.split(" ")[0].toLowerCase()),
  );
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function runLocalAdmin(query: string, state: AppState): AiResult {
  const q = normalize(query);
  const unread = state.messages.filter((m) => m.unread && m.direction === "in");
  const pending = state.appointments.filter((a) => a.status === "pending");

  if (/(bu gün|bugun|bugün|today|nə var|ne var|xülasə|xulase)/.test(q)) {
    const list = state.appointments.filter(
      (a) => formatAzDate(a.date) === "Bu gün",
    );
    const lines = list
      .map((a) => {
        const c = customerById(state, a.customerId);
        const st =
          a.status === "pending"
            ? "təsdiq gözləyir"
            : a.status === "confirmed"
              ? "təsdiqlənib"
              : a.status;
        return `• ${a.time} — ${c?.name}: ${a.service} (${st}, ${formatAzn(a.priceAzn)})`;
      })
      .join("\n");
    const revenue = list
      .filter((a) => a.status !== "cancelled")
      .reduce((s, a) => s + a.priceAzn, 0);
    return {
      reply: `Bu gün ${state.business.name} üçün ${list.length} randevu var.\n\n${lines}\n\nGözlənilən gəlir: ${formatAzn(revenue)}.\nOxunmamış mesaj: ${unread.length}. Təsdiq gözləyən: ${pending.length}.`,
    };
  }

  if (/(sabah)/.test(q)) {
    const list = state.appointments.filter(
      (a) => formatAzDate(a.date) === "Sabah",
    );
    const lines = list
      .map((a) => {
        const c = customerById(state, a.customerId);
        return `• ${a.time} — ${c?.name}: ${a.service}`;
      })
      .join("\n");
    return {
      reply: list.length
        ? `Sabahkı cədvəl:\n\n${lines}`
        : "Sabaha randevu yazılmayıb.",
    };
  }

  if (/(mesaj|inbox|whatsapp|cavab gözlə|oxunmam)/.test(q)) {
    if (!unread.length) {
      return { reply: "Oxunmamış mesaj yoxdur. Inbox təmizdir." };
    }
    const lines = unread
      .map((m) => {
        const c = customerById(state, m.customerId);
        return `• ${c?.name} (${m.channel}): “${m.text}”`;
      })
      .join("\n");
    return {
      reply: `${unread.length} oxunmamış mesaj:\n\n${lines}\n\nİstəsəniz “Ayselə cavab yaz” və ya “təsdiqlə” deyin, mən sizin adınızdan iş görərəm.`,
    };
  }

  if (/(borc|balans|ödəniş|odenis)/.test(q)) {
    const debtors = state.customers.filter((c) => c.balanceAzn > 0);
    if (!debtors.length) return { reply: "Açıq balans yoxdur." };
    return {
      reply: `Açıq balanslar:\n\n${debtors
        .map((c) => `• ${c.name}: ${formatAzn(c.balanceAzn)}`)
        .join("\n")}`,
    };
  }

  if (/(təsdiqlə|tesdiqle|təsdiq et|aysele|aysel.*təsdiq|14:30)/.test(q)) {
    const appt =
      pending.find((a) => a.customerId === "c2") ?? pending[0];
    if (!appt) return { reply: "Təsdiq gözləyən randevu yoxdur." };
    const c = customerById(state, appt.customerId);
    return {
      reply: `${c?.name} üçün ${appt.time} ${appt.service} randevusunu təsdiqlədim və WhatsApp-da cavab hazırladım.`,
      actions: [
        { type: "confirm", appointmentId: appt.id },
        {
          type: "reply",
          customerId: appt.customerId,
          text: `Bəli, ${appt.time} qalır. 10 dəqiqə gecikmə problem deyil, sizi gözləyəcəyik 🌿`,
        },
        ...unread
          .filter((m) => m.customerId === appt.customerId)
          .map((m) => ({ type: "mark_read" as const, messageId: m.id })),
      ],
    };
  }

  if (/(cavab|yaz|draft|hazırla|hazirla)/.test(q)) {
    const target =
      findCustomer(state, q) ??
      customerById(state, unread[0]?.customerId ?? "") ??
      state.customers[0];
    const last = [...state.messages]
      .reverse()
      .find((m) => m.customerId === target?.id && m.direction === "in");
    if (!target || !last) {
      return { reply: "Cavab yazmaq üçün açıq mesaj tapmadım." };
    }
    let draft = `Salam ${target.name.split(" ")[0]}, mesajınız üçün təşəkkürlər. Tezliklə dəqiqləşdirib yazacağıq.`;
    if (/gecik/.test(last.text.toLowerCase())) {
      draft = `Salam ${target.name.split(" ")[0]}! Bəli, 10 dəqiqə olar. Sizi gözləyəcəyik.`;
    } else if (/palitra|rəng|reng/.test(last.text.toLowerCase())) {
      draft = `Salam ${target.name.split(" ")[0]}! Toy üçün isti çəhrayı və şampan tonları çox yaraşır. Sınaqda birlikdə seçərik — sabah 10:00-da sizi gözləyirik.`;
    } else if (/park|vaxt|keratin/.test(last.text.toLowerCase())) {
      draft = `Keratin təxminən 2 saat çəkir. Nizami 45-dəyik, həyətə maşın qoymaq olar.`;
    }
    return {
      reply: `${target.name} üçün cavab göndərildi:\n\n“${draft}”`,
      actions: [
        { type: "reply", customerId: target.id, text: draft },
        { type: "mark_read", messageId: last.id },
      ],
    };
  }

  const person = findCustomer(state, q);
  if (
    person &&
    (/(kim|müştəri|musteri|haqqında|nomre|nömrə|telefon)/.test(q) ||
      q.split(" ").length <= 3)
  ) {
    if (person) {
      const next = state.appointments.find(
        (a) => a.customerId === person.id && a.status !== "cancelled",
      );
      return {
        reply: `${person.name}\nTelefon: ${person.phone}\nQeyd: ${person.notes}\nSon ziyarət: ${formatAzDate(person.lastVisit)}\nBalans: ${formatAzn(person.balanceAzn)}${
          next
            ? `\nNövbəti: ${formatAzDate(next.date)} ${next.time} — ${next.service}`
            : ""
        }`,
      };
    }
  }

  if (/(kömək|komek|help|nə edə|ne ede|nəyə qadirsən)/.test(q)) {
    return {
      reply:
        "Mən AdminAI — sizin ofis administratorunuzam.\n\nMəndən soruşa bilərsiniz:\n• Bu gün nə var?\n• Sabahkı cədvəl\n• Oxunmamış mesajlar\n• Ayselə cavab yaz\n• Randevunu təsdiqlə\n• Kimdə borc var?\n• Leyla kimdir?",
    };
  }

  return {
    reply: `Başa düşdüm: “${query}”.\n\nBu demo rejimində cədvəl, müştəri kartı, mesaj və randevu üzərində işləyirəm. “Bu gün nə var?” və ya “oxunmamış mesajlar” yazın.`,
  };
}
