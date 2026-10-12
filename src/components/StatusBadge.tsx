import type { AppointmentStatus } from "@/lib/types";

const labels: Record<AppointmentStatus, string> = {
  confirmed: "Təsdiqlənib",
  pending: "Gözləyir",
  cancelled: "Ləğv",
  done: "Bitib",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cls =
    status === "confirmed"
      ? "bg-[#e4f3ef] text-[#0f6b5c]"
      : status === "pending"
        ? "bg-[#f8eadf] text-[#c45c26]"
        : status === "cancelled"
          ? "bg-[#eee] text-[#6b6458]"
          : "bg-[#eceae4] text-[#3f3a32]";
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${cls}`}>
      {labels[status]}
    </span>
  );
}
