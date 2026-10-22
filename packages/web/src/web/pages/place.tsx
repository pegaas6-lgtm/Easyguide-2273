import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, MapPin, Route, Ticket } from "lucide-react";
import { usePlace } from "../queries/places";
import { EventCard, Skeleton } from "../components/cards";
import { MapView } from "../components/map-view";
import { fmtDuration, placeCategoryLabel } from "../lib/labels";

export default function PlacePage() {
  const { id } = useParams<{ id: string }>();
  const place = usePlace(id);

  if (place.isLoading)
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-5 py-8">
        <Skeleton className="h-[50vh]" />
        <Skeleton className="h-10 w-1/2" />
      </div>
    );
  if (!place.data) return <div className="p-10 text-center text-ink-soft">Місце не знайдено</div>;
  const p = place.data;

  return (
    <div>
      <div className="relative mx-auto max-w-6xl px-5 pt-5">
        <div className="relative h-[52vh] min-h-[340px] overflow-hidden rounded-[2rem]">
          <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/20" />
          <Link to="/places" className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-paper/90 px-3 py-1.5 text-sm">
            <ArrowLeft className="size-4" /> Місця
          </Link>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="eyebrow !text-paper/80">{placeCategoryLabel[p.category]}</p>
            <h1 className="mt-2 text-4xl font-semibold leading-none text-paper md:text-6xl">{p.name}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-[1fr_320px]">
        <article>
          <p className="font-display text-2xl italic leading-snug text-ink/90">{p.short}</p>
          <h2 className="mt-8 eyebrow">Історія</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink/85 first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-terracotta">
            {p.history}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full bg-paper-2 px-3 py-1 text-xs">
                #{t}
              </span>
            ))}
          </div>

          {p.events.length > 0 && (
            <>
              <h2 className="mt-12 text-2xl font-semibold">Події тут</h2>
              <div className="mt-4 grid gap-2">
                {p.events.map((e) => (
                  <EventCard key={e.id} e={{ ...e }} />
                ))}
              </div>
            </>
          )}
        </article>

        <aside className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-ink/10 bg-paper/70 p-5">
            <Info icon={MapPin} label="Адреса" value={p.address} />
            {p.hours && <Info icon={Clock} label="Години роботи" value={p.hours} />}
            {p.price && <Info icon={Ticket} label="Вартість" value={p.price} />}
            <Info icon={Clock} label="Скільки закласти часу" value={`~${fmtDuration(p.visitMinutes)}`} />
          </div>
          <div className="overflow-hidden rounded-2xl border border-ink/10">
            <MapView points={[{ id: p.id, lat: p.lat, lng: p.lng, name: p.name }]} className="h-56 w-full" />
          </div>
          <Link to={`/walk?start=${p.id}`} className="btn-primary w-full">
            <Route className="size-4" /> Маршрут звідси
          </Link>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost w-full"
          >
            Як дістатися
          </a>
        </aside>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-terracotta" />
      <div>
        <div className="text-xs text-ink-soft">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
