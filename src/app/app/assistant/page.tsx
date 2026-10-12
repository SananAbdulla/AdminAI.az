import { Assistant } from "@/components/Assistant";

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1
          className="text-3xl font-semibold"
          style={{ fontFamily: "var(--font-source-serif), serif" }}
        >
          AI administrator
        </h1>
        <p className="mt-1 text-[#6b6458]">
          Azərbaycan dilində yazın. Demo rejimində cədvəl, mesaj və müştəri
          kartları üzərində real əməliyyatlar edir.
        </p>
      </div>
      <Assistant />
    </div>
  );
}
