import { Link } from "wouter";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Coffee, Landmark, Route, Sparkles, Trees } from "lucide-react";
import { useEvents } from "../queries/events";
import { usePlaces } from "../queries/places";
import { EventCard, PlaceCard, Skeleton } from "../components/cards";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
});

const quick = [
  { to: "/events", label: "Події", sub: "концерти, вебінари, тренінги", icon: CalendarDays },
  { to: "/places?c=cafe", label: "Кафе", sub: "кава, шоколад, кухня", icon: Coffee },
  { to: "/places?c=history", label: "Пам'ятки", sub: "історія на кожному кроці", icon: Landmark },
  { to: "/places?c=park", label: "Парки", sub: "зелений Львів", icon: Trees },
];

export default function Index() {
  const events = useEvents({ when: "week" });
  const places = usePlaces();
  const featured = ["rynok", "vysokyi-zamok", "opera", "lychakiv", "kopalnia"];
  const featuredPlaces = (places.data ?? []).filter((p) => featured.includes(p.id)).sort((a, b) => featured.indexOf(a.id) - featured.indexOf(b.id));

  return (
    <div>
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-5 pt-5 md:pt-8">
        <motion.div {...fade(0)} className="relative h-[62vh] min-h-[420px] overflow-hidden rounded-[2rem] md:h-[560px]">
          <img src="/images/places/hero.jpg" alt="Площа Ринок у Львові ввечері" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
            <motion.p {...fade(1)} className="eyebrow !text-paper/80">Львів · осінь 2026</motion.p>
            <motion.h1 {...fade(2)} className="mt-3 max-w-3xl text-[2.6rem] font-semibold leading-[1.02] text-paper md:text-7xl">
              Куди піти <em className="font-normal italic text-ochre">сьогодні</em> — і що там побачити
            </motion.h1>
            <motion.p {...fade(3)} className="mt-4 max-w-xl text-paper/80 md:text-lg">
              Події, кав'ярні, музеї та маршрути прогулянок з історіями від AI-гіда. Все в одному місці.
            </motion.p>
            <motion.div {...fade(4)} className="mt-6 flex flex-wrap gap-3">
              <Link to="/walk" className="btn-primary">
                <Sparkles className="size-4" /> Скласти маршрут
              </Link>
              <Link to="/events" className="btn-ghost !border-paper/40 !text-paper hover:!border-paper">
                Що відбувається
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick tiles overlap hero */}
        <motion.div {...fade(5)} className="relative z-10 -mt-8 grid grid-cols-2 gap-2 px-2 md:-mt-12 md:grid-cols-4 md:gap-3 md:px-10">
          {quick.map((q) => (
            <Link key={q.label} to={q.to} className="group rounded-2xl border border-ink/10 bg-paper p-4 shadow-lg shadow-ink/5 transition hover:-translate-y-0.5">
              <q.icon className="size-5 text-terracotta" strokeWidth={1.8} />
              <div className="mt-3 font-display text-lg font-semibold">{q.label}</div>
              <div className="text-xs text-ink-soft">{q.sub}</div>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* THIS WEEK */}
      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Найближчі 7 днів</p>
            <h2 className="mt-1 text-3xl font-semibold md:text-4xl">Цього тижня у Львові</h2>
          </div>
          <Link to="/events" className="hidden items-center gap-1 text-sm font-medium text-terracotta sm:inline-flex">
            Усі події <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-2 md:grid-cols-2">
          {events.isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
            : events.data?.slice(0, 6).map((e) => <EventCard key={e.id} e={e} />)}
        </div>
        <Link to="/events" className="btn-ghost mt-4 w-full sm:hidden">
          Усі події
        </Link>
      </section>

      {/* AI WALK BANNER */}
      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="relative overflow-hidden rounded-[2rem] bg-forest p-7 text-paper md:p-12">
          <svg className="pointer-events-none absolute -right-10 -top-10 h-[130%] opacity-[0.12]" viewBox="0 0 400 400" fill="none">
            <path d="M40 360 C 120 300, 80 220, 170 200 S 300 160, 260 80 S 330 20, 380 40" stroke="#F4ECDF" strokeWidth="3" strokeDasharray="8 10" />
            {[[40, 360], [170, 200], [260, 80], [380, 40]].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="10" fill="#F4ECDF" />
            ))}
          </svg>
          <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <p className="eyebrow !text-ochre">AI-гід</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-5xl">
                Скажи, що любиш — <em className="font-normal italic">ми проведемо</em>
              </h2>
              <p className="mt-4 max-w-md text-paper/75">
                Кава, бароко, легенди чи парки? Обери інтереси й час — гід складе пішохідний маршрут на карті та розповість історію кожної зупинки.
              </p>
              <Link to="/walk" className="btn-primary mt-6">
                <Route className="size-4" /> Спробувати
              </Link>
            </div>
            <div className="hidden grid-cols-3 gap-2 md:grid">
              {["ratusha", "boim", "st-george", "kryivka", "armenian", "stryiskyi"].map((id, i) => (
                <img
                  key={id}
                  src={`/images/places/${id}.jpg`}
                  alt=""
                  className={`aspect-square w-full rounded-xl object-cover ${i % 2 ? "translate-y-4" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLACES */}
      <section className="mx-auto mt-16 max-w-6xl px-5 pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Must see</p>
            <h2 className="mt-1 text-3xl font-semibold md:text-4xl">Місця, з яких почати</h2>
          </div>
          <Link to="/places" className="hidden items-center gap-1 text-sm font-medium text-terracotta sm:inline-flex">
            Усі місця <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="no-scrollbar -mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {places.isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-56 shrink-0 md:w-auto" />)
            : featuredPlaces.map((p) => <PlaceCard key={p.id} p={p} tall className="w-60 shrink-0 snap-start md:w-auto" />)}
        </div>
      </section>
    </div>
  );
}
