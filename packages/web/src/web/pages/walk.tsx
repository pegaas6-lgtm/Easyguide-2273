import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "motion/react";
import { Footprints, Lightbulb, Loader2, MapPinned, RotateCcw, Sparkles, Timer } from "lucide-react";
import { useGenerateWalk } from "../queries/walks";
import { usePlaces } from "../queries/places";
import { MapView } from "../components/map-view";
import { fmtDuration } from "../lib/labels";

const interestOptions = [
  "Історія та легенди",
  "Архітектура",
  "Храми",
  "Кава та солодке",
  "Галицька кухня",
  "Музеї та мистецтво",
  "Парки та природа",
  "Панорами та фото",
  "Незвичні місця",
  "З дітьми",
];

const durations = [
  { id: "short", label: "1–2 год" },
  { id: "half", label: "Пів дня" },
  { id: "day", label: "Цілий день" },
] as const;

const paces = [
  { id: "slow", label: "Неспішно" },
  { id: "normal", label: "Звичайно" },
  { id: "fast", label: "Активно" },
] as const;

const loadingLines = [
  "Гід зав'язує шнурки…",
  "Перевіряємо, чи відчинена кав'ярня…",
  "Згадуємо легенди Старого міста…",
  "Прокладаємо шлях бруківкою…",
];

export default function WalkPage() {
  const search = new URLSearchParams(useSearch());
  const places = usePlaces();
  const gen = useGenerateWalk();
  const [interests, setInterests] = useState<string[]>(["Історія та легенди", "Кава та солодке"]);
  const [duration, setDuration] = useState<"short" | "half" | "day">("short");
  const [pace, setPace] = useState<"slow" | "normal" | "fast">("normal");
  const [startId, setStartId] = useState(search.get("start") ?? "");
  const [note, setNote] = useState("");
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (!gen.isPending) return;
    const t = setInterval(() => setLine((l) => (l + 1) % loadingLines.length), 1800);
    return () => clearInterval(t);
  }, [gen.isPending]);

  const toggle = (i: string) => setInterests((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  const submit = () => {
    gen.mutate({ interests, duration, pace, startId: startId || undefined, note: note || undefined });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const r = gen.data;

  if (r) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-6 md:py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow !text-terracotta">Твій маршрут</p>
            <h1 className="mt-1 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">{r.title}</h1>
          </div>
          <button className="btn-ghost" onClick={() => gen.reset()}>
            <RotateCcw className="size-4" /> Новий маршрут
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Stat icon={MapPinned} value={`${r.stops.length} зупинок`} />
          <Stat icon={Footprints} value={`${(r.distance / 1000).toFixed(1)} км пішки`} />
          <Stat icon={Timer} value={`~${fmtDuration(r.totalMinutes)} разом`} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100dvh-8rem)]">
            <div className="h-[48vh] overflow-hidden rounded-2xl border border-ink/10 lg:h-full">
              <MapView
                numbered
                className="h-full w-full"
                path={r.path}
                points={r.stops.map((s) => ({ id: s.placeId, lat: s.place.lat, lng: s.place.lng, name: s.place.name, href: `/places/${s.placeId}` }))}
              />
            </div>
          </div>

          <div>
            <p className="font-display text-xl italic leading-relaxed text-ink/85">{r.intro}</p>
            <ol className="mt-8 space-y-0">
              {r.stops.map((s, i) => (
                <motion.li
                  key={s.placeId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                  className="relative pb-10 pl-12"
                >
                  {i < r.stops.length - 1 && <span className="absolute left-[15px] top-9 bottom-0 border-l-2 border-dashed border-terracotta/40" />}
                  <span className="absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-terracotta text-sm font-semibold text-white ring-4 ring-paper">
                    {i + 1}
                  </span>
                  <Link to={`/places/${s.placeId}`} className="group flex items-center gap-3">
                    <img src={s.place.image} alt="" className="size-14 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-display text-xl font-semibold leading-tight group-hover:text-terracotta">{s.place.name}</h3>
                      <p className="text-xs text-ink-soft">
                        {s.place.address} · ~{s.minutes} хв
                      </p>
                    </div>
                  </Link>
                  <p className="mt-3 leading-relaxed text-ink/85">{s.story}</p>
                  {s.tip && (
                    <p className="mt-3 flex gap-2 rounded-xl bg-ochre/15 p-3 text-sm text-[#5e4210]">
                      <Lightbulb className="mt-0.5 size-4 shrink-0" /> {s.tip}
                    </p>
                  )}
                </motion.li>
              ))}
            </ol>
            <p className="rounded-2xl bg-forest p-5 font-display text-lg italic text-paper">{r.outro}</p>
            <a
              className="btn-primary mt-4 w-full"
              target="_blank"
              rel="noreferrer"
              href={`https://www.google.com/maps/dir/${r.stops.map((s) => `${s.place.lat},${s.place.lng}`).join("/")}/data=!4m2!4m1!3e2`}
            >
              Відкрити в Google Maps
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:py-12">
      <p className="eyebrow !text-terracotta">AI-гід</p>
      <h1 className="mt-1 text-4xl font-semibold leading-[1.05] md:text-6xl">
        Склади свою <em className="font-normal italic text-terracotta">прогулянку</em>
      </h1>
      <p className="mt-3 text-ink-soft">Обери, що тобі цікаво — гід підбере зупинки, прокладе пішохідний маршрут і розповість історію кожного місця.</p>

      {gen.isPending ? (
        <div className="mt-12 flex flex-col items-center rounded-[2rem] border border-dashed border-terracotta/40 px-6 py-16 text-center">
          <Loader2 className="size-10 animate-spin text-terracotta" />
          <motion.p key={line} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 font-display text-xl italic">
            {loadingLines[line]}
          </motion.p>
          <p className="mt-2 text-sm text-ink-soft">Зазвичай це займає 10–20 секунд</p>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          <Field label="Що тобі цікаво?">
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((i) => (
                <button key={i} className="chip" data-active={interests.includes(i)} onClick={() => toggle(i)}>
                  {i}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid gap-8 sm:grid-cols-2">
            <Field label="Скільки часу?">
              <div className="flex flex-wrap gap-2">
                {durations.map((d) => (
                  <button key={d.id} className="chip" data-active={duration === d.id} onClick={() => setDuration(d.id)}>
                    {d.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Темп">
              <div className="flex flex-wrap gap-2">
                {paces.map((p) => (
                  <button key={p.id} className="chip" data-active={pace === p.id} onClick={() => setPace(p.id)}>
                    {p.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field label="Звідки стартуємо?">
            <select
              aria-label="Точка старту"
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-paper/70 px-4 py-3 text-sm outline-none focus:border-ink/40"
            >
              <option value="">Гід вирішить сам</option>
              {places.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Побажання (необов'язково)">
            <textarea
              aria-label="Побажання"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Напр.: хочу закінчити заходом сонця з панорамою, без музеїв"
              className="w-full resize-none rounded-xl border border-ink/15 bg-paper/70 px-4 py-3 text-sm outline-none placeholder:text-ink-soft/70 focus:border-ink/40"
            />
          </Field>

          {gen.isError && <p className="rounded-xl bg-terracotta/10 p-3 text-sm text-terracotta">{gen.error.message}</p>}

          <button className="btn-primary w-full !py-4 text-base" disabled={!interests.length} onClick={submit}>
            <Sparkles className="size-5" /> Скласти маршрут
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 font-display text-lg font-semibold">{label}</div>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, value }: { icon: typeof Timer; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-paper-2 px-4 py-2 text-sm font-medium">
      <Icon className="size-4 text-terracotta" /> {value}
    </span>
  );
}
