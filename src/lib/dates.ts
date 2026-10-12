const TZ = "Asia/Baku";

export function bakuToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00+04:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

export function formatAzDate(isoDate: string): string {
  const today = bakuToday();
  if (isoDate === today) return "Bu gün";
  if (isoDate === addDays(today, 1)) return "Sabah";
  if (isoDate === addDays(today, -1)) return "Dünən";
  return new Date(`${isoDate}T12:00:00+04:00`).toLocaleDateString("az-AZ", {
    day: "numeric",
    month: "long",
  });
}

export function formatAzn(amount: number): string {
  return `${amount.toLocaleString("az-AZ")} ₼`;
}

export function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const mins = Math.max(1, Math.round((now - then) / 60000));
  if (mins < 60) return `${mins} dəq`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} saat`;
  const days = Math.round(hours / 24);
  return `${days} gün`;
}
