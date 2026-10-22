import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, MapPin, Ticket, User, Wifi } from "lucide-react";
import { useEvent } from "../queries/events";
import { Skeleton } from "../components/cards";
import { MapView } from "../components/map-view";
import { eventTypeLabel, fmtDuration, fmtFull, fmtPrice } from "../lib/labels";

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const ev = useEvent(Number(id));

  if (ev.isLoading)
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-5 py-8">
        <Skeleton className="aspect-[16/9]" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24" />
      </div>
    );
  if (!ev.data) return <div className="p-10 text-center text-ink-soft">Подію не знайдено</div>;
  const e = ev.data;

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 md:py-10">
      <Link to="/events" className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" /> Усі події
      </Link>

      <div className="mt-4 overflow-hidden rounded-[1.75rem]">
        {e.image ? (
          <img src={e.image} alt="" className="aspect-[16/9] w-full object-cover" />
        ) : (
          <div className="grid aspect-[16/7] place-items-center bg-gradient-to-br from-forest to-[#2f5a43] text-paper">
            <Wifi className="size-14 opacity-70" strokeWidth={1.3} />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_280px]">
        <div>
          <p className="eyebrow !text-terracotta">
            {eventTypeLabel[e.type]} · {e.format === "online" ? "онлайн" : "наживо"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-5xl">{e.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/85">{e.description}</p>

          {e.place && (
            <Link to={`/places/${e.place.id}`} className="mt-8 flex items-center gap-4 rounded-2xl border border-ink/10 p-3 transition hover:bg-paper-2/60">
              <img src={e.place.image} alt="" className="size-16 rounded-xl object-cover" />
              <div>
                <p className="eyebrow">Місце проведення</p>
                <p className="font-display text-lg font-semibold">{e.place.name}</p>
                <p className="text-sm text-ink-soft">{e.place.short}</p>
              </div>
            </Link>
          )}
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-ink/10 bg-paper/70 p-5 md:sticky md:top-24">
          <Row icon={Clock} title={fmtFull(e.startsAt)} sub={fmtDuration(e.durationMinutes)} />
          <Row icon={MapPin} title={e.venue} sub={e.address ?? (e.format === "online" ? "Посилання після реєстрації" : undefined)} />
          <Row icon={User} title={e.organizer} sub="Організатор" />
          <div className="border-t border-dashed border-ink/20 pt-4">
            <div className="font-display text-2xl font-semibold">{fmtPrice(e.price)}</div>
            <button className="btn-primary mt-3 w-full" onClick={() => alert("У прототипі бронювання ще не підключене 🙂")}>
              <Ticket className="size-4" /> {e.price ? "Купити квиток" : "Зареєструватися"}
            </button>
          </div>
        </aside>
      </div>

      {e.lat && e.lng && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-ink/10">
          <MapView points={[{ id: "e", lat: e.lat, lng: e.lng, name: e.venue }]} className="h-72 w-full" />
        </div>
      )}
    </div>
  );
}

function Row({ icon: Icon, title, sub }: { icon: typeof Clock; title: string; sub?: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-terracotta" />
      <div>
        <div className="text-sm font-medium first-letter:uppercase">{title}</div>
        {sub && <div className="text-xs text-ink-soft">{sub}</div>}
      </div>
    </div>
  );
}
