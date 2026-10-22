import { useState } from "react";
import { useSearch } from "wouter";
import { List, Map as MapIcon, Search } from "lucide-react";
import { usePlaces } from "../queries/places";
import { PlaceCard, Skeleton } from "../components/cards";
import { MapView } from "../components/map-view";
import { placeCategories } from "../lib/labels";

export default function PlacesPage() {
  const search = new URLSearchParams(useSearch());
  const [cat, setCat] = useState(search.get("c") ?? "all");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const places = usePlaces(cat, q || undefined);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">33 місця для старту</p>
          <h1 className="mt-1 text-4xl font-semibold md:text-6xl">
            Місця <em className="font-normal italic text-terracotta">Львова</em>
          </h1>
        </div>
        <div className="flex rounded-full border border-ink/15 p-1">
          <button className="chip !border-0" data-active={view === "list"} onClick={() => setView("list")}>
            <List className="size-4" /> Список
          </button>
          <button className="chip !border-0" data-active={view === "map"} onClick={() => setView("map")}>
            <MapIcon className="size-4" /> Карта
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-2.5 focus-within:border-ink/40">
        <Search className="size-4 text-ink-soft" />
        <input
          aria-label="Пошук"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук: бароко, кава, панорама…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/70"
        />
      </div>
      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
        {placeCategories.map((c) => (
          <button key={c.id} className="chip" data-active={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {view === "map" ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-ink/10">
          {places.isLoading ? (
            <Skeleton className="h-[65vh]" />
          ) : (
            <MapView
              className="h-[65vh] w-full"
              points={(places.data ?? []).map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, name: p.name, href: `/places/${p.id}` }))}
            />
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {places.isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)
            : places.data?.map((p) => <PlaceCard key={p.id} p={p} />)}
          {places.data?.length === 0 && <p className="col-span-full text-center text-ink-soft">Нічого не знайшлося.</p>}
        </div>
      )}
    </div>
  );
}
