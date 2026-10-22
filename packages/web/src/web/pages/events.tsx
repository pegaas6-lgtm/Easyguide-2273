import { useState } from "react";
import { Search } from "lucide-react";
import { useEvents, type EventFilters } from "../queries/events";
import { EventCard, Skeleton } from "../components/cards";
import { eventTypes } from "../lib/labels";

const whens = [
  { id: "all", label: "Будь-коли" },
  { id: "today", label: "Сьогодні" },
  { id: "weekend", label: "Вихідні" },
  { id: "week", label: "Цей тиждень" },
] as const;

const formats = [
  { id: "all", label: "Усі формати" },
  { id: "offline", label: "Наживо" },
  { id: "online", label: "Онлайн" },
] as const;

export default function EventsPage() {
  const [f, setF] = useState<EventFilters>({ type: "all", when: "all", format: "all", free: false });
  const [q, setQ] = useState("");
  const events = useEvents({ ...f, q: q || undefined });

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-12">
      <p className="eyebrow">Афіша Львова</p>
      <h1 className="mt-1 text-4xl font-semibold md:text-6xl">
        Події <em className="font-normal italic text-terracotta">і не тільки</em>
      </h1>
      <p className="mt-3 max-w-xl text-ink-soft">Концерти, екскурсії, вебінари, тренінги та майстер-класи — наживо у Львові й онлайн.</p>

      <div className="mt-8 flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-2.5 focus-within:border-ink/40">
        <Search className="size-4 text-ink-soft" />
        <input
          aria-label="Пошук"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук: джаз, кава, UX…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/70"
        />
      </div>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
        {eventTypes.map((t) => (
          <button key={t.id} className="chip" data-active={f.type === t.id} onClick={() => setF({ ...f, type: t.id })}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5">
        {whens.map((w) => (
          <button key={w.id} className="chip" data-active={f.when === w.id} onClick={() => setF({ ...f, when: w.id })}>
            {w.label}
          </button>
        ))}
        <span className="mx-1 w-px shrink-0 bg-ink/15" />
        {formats.map((w) => (
          <button key={w.id} className="chip" data-active={f.format === w.id} onClick={() => setF({ ...f, format: w.id })}>
            {w.label}
          </button>
        ))}
        <button className="chip" data-active={f.free} onClick={() => setF({ ...f, free: !f.free })}>
          Безкоштовні
        </button>
      </div>

      <div className="mt-8 grid gap-2 md:grid-cols-2">
        {events.isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : events.data?.length ? (
          events.data.map((e) => <EventCard key={e.id} e={e} />)
        ) : (
          <div className="col-span-full rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink-soft">
            Нічого не знайшлося. Спробуй змінити фільтри.
          </div>
        )}
      </div>
      <p className="mt-10 text-xs text-ink-soft">* У прототипі події демонстраційні.</p>
    </div>
  );
}
