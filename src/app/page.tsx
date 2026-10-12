import Link from "next/link";

const features = [
  {
    title: "Günün cədvəli",
    text: "Randevular, gəlir və gecikmələr bir baxışda. Bakı saatı, manat, Azərbaycan dili.",
  },
  {
    title: "Mesajlara cavab",
    text: "WhatsApp, Instagram və zəng qeydlərini oxuyur, sizin adınızdan nəzakətli cavab yazır.",
  },
  {
    title: "Müştəri yaddaşı",
    text: "Kim keratina gəlir, kimdə borc qalıb, toy tarixi nə vaxtdır — administrator unutmur.",
  },
  {
    title: "Əmr yerinə yetirir",
    text: "“Ayselə cavab yaz”, “randevunu təsdiqlə” — söhbət təkcə məsləhət deyil, iş görür.",
  },
];

export default function Home() {
  return (
    <div className="min-h-full bg-[#f4f1ea] text-[#1c1915]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <p className="text-sm font-semibold tracking-[0.18em] uppercase text-[#0f6b5c]">
          AdminAI.az
        </p>
        <Link
          href="/app"
          className="rounded-full bg-[#0f6b5c] px-4 py-2 text-sm font-medium text-white"
        >
          Demo aç
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        <section className="grid gap-12 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-16">
          <div>
            <p className="text-sm font-medium text-[#c45c26]">
              Azərbaycan kiçik biznesi üçün
            </p>
            <h1
              className="mt-3 max-w-xl text-4xl leading-tight font-semibold tracking-tight md:text-5xl"
              style={{ fontFamily: "var(--font-source-serif), serif" }}
            >
              Ofisinizə gəlməyən administrator. Amma işini görür.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#5c564c]">
              Salon, klinika, servis, mağaza — müştəri yazır, randevu gəlir,
              kassaya nəzarət lazımdır. AdminAI bunları Azərbaycan dilində
              idarə edir.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="rounded-full bg-[#0f6b5c] px-6 py-3 text-sm font-medium text-white"
              >
                Nərgiz Studio demosunu aç
              </Link>
              <a
                href="#necə"
                className="rounded-full border border-[#d9d0c2] px-6 py-3 text-sm font-medium"
              >
                Necə işləyir
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e6dfd2] bg-[#fffcf7] p-6 shadow-[0_20px_60px_rgba(28,25,21,0.06)]">
            <p className="text-xs uppercase tracking-widest text-[#6b6458]">
              Bu gün · Bakı
            </p>
            <p className="mt-2 text-2xl font-semibold">3 randevu · 145 ₼</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex justify-between rounded-2xl bg-[#f4f1ea] px-4 py-3">
                <span>11:00 Leyla · Keratin</span>
                <span className="text-[#0f6b5c]">Təsdiqlənib</span>
              </li>
              <li className="flex justify-between rounded-2xl bg-[#f4f1ea] px-4 py-3">
                <span>14:30 Aysel · Manikür</span>
                <span className="text-[#c45c26]">Gözləyir</span>
              </li>
              <li className="flex justify-between rounded-2xl bg-[#f4f1ea] px-4 py-3">
                <span>WhatsApp: “10 dəqiqə gecikərəm”</span>
                <span className="text-[#c45c26]">Cavab gözləyir</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="necə" className="grid gap-4 md:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-3xl border border-[#e6dfd2] bg-[#fffcf7] p-6"
            >
              <h2 className="text-lg font-semibold">{f.title}</h2>
              <p className="mt-2 text-[#5c564c] leading-7">{f.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
