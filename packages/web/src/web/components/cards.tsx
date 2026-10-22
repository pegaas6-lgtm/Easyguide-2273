import { Link } from "wouter";
import { Clock, MapPin, Wifi } from "lucide-react";
import type { AppRouterClient } from "../../api";
import {
  eventTypeLabel,
  fmtDay,
  fmtMonthShort,
  fmtPrice,
  fmtTime,
  fmtWeekday,
  placeCategoryLabel,
} from "../lib/labels";
import { cn } from "../lib/utils";

export type EventItem = Awaited<ReturnType<AppRouterClient["events"]["list"]>>[number];
export type PlaceItem = Awaited<ReturnType<AppRouterClient["places"]["list"]>>[number];

const onlineBg: Record<string, string> = {
  webinar: "from-forest to-[#2f5a43]",
  training: "from-[#7a3a22] to-terracotta",
  lecture: "from-[#3b2d1f] to-[#6b5b4b]",
};

export function EventCard({ e, className }: { e: EventItem; className?: string }) {
  return (
    <Link to={`/events/${e.id}`} className={cn("group flex gap-4 rounded-2xl p-2 transition hover:bg-paper-2/60", className)}>
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-36">
        {e.image ? (
          <img src={e.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className={cn("grid h-full w-full place-items-center bg-gradient-to-br text-paper", onlineBg[e.type] ?? onlineBg.webinar)}>
            <Wifi className="size-8 opacity-80" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute left-2 top-2 rounded-lg bg-paper/95 px-2 py-1 text-center leading-none shadow-sm">
          <div className="font-display text-lg font-semibold">{fmtDay(e.startsAt)}</div>
          <div className="text-[10px] uppercase tracking-wide text-ink-soft">{fmtMonthShort(e.startsAt)}</div>
        </div>
      </div>
      <div className="min-w-0 flex-1 py-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow !text-terracotta">{eventTypeLabel[e.type]}</span>
          {e.format === "online" && <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium text-forest">ОНЛАЙН</span>}
          {e.price === 0 && <span className="rounded-full bg-ochre/25 px-2 py-0.5 text-[10px] font-medium text-[#7a5410]">FREE</span>}
        </div>
        <h3 className="mt-1 line-clamp-2 font-display text-lg font-semibold leading-snug">{e.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {fmtWeekday(e.startsAt)}, {fmtTime(e.startsAt)}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{e.venue}</span>
          </span>
        </div>
        <div className="mt-2 text-sm font-medium">{fmtPrice(e.price)}</div>
      </div>
    </Link>
  );
}

export function PlaceCard({ p, className, tall }: { p: PlaceItem; className?: string; tall?: boolean }) {
  return (
    <Link to={`/places/${p.id}`} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden rounded-[1.25rem] bg-paper-2", tall ? "aspect-[3/4]" : "aspect-[4/3]")}>
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium">
          {placeCategoryLabel[p.category]}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 text-paper">
          <h3 className="font-display text-xl font-semibold leading-tight">{p.name}</h3>
        </div>
      </div>
      <p className="mt-2.5 line-clamp-2 text-sm text-ink-soft">{p.short}</p>
    </Link>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-ink/[0.07]", className)} />;
}
