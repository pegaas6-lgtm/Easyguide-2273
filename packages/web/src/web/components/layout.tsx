import { Link, useLocation } from "wouter";
import { CalendarDays, Compass, Landmark, Route } from "lucide-react";
import { cn } from "../lib/utils";

const nav = [
  { to: "/", label: "Головна", icon: Compass },
  { to: "/events", label: "Події", icon: CalendarDays },
  { to: "/places", label: "Місця", icon: Landmark },
  { to: "/walk", label: "Маршрут", icon: Route },
];

function isActive(loc: string, to: string) {
  return to === "/" ? loc === "/" : loc.startsWith(to);
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", light ? "text-paper" : "text-ink")}>
      <span className="grid size-9 place-items-center rounded-full bg-terracotta text-white">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">
        Easy <em className="font-normal italic text-terracotta">Guide</em>
      </span>
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [loc] = useLocation();
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-[1000] border-b border-ink/10 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.slice(1).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(loc, n.to) ? "bg-ink text-paper" : "text-ink/75 hover:text-ink",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="rounded-full border border-ink/15 px-3 py-1 text-xs font-medium text-ink-soft">
            Львів
          </span>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <footer className="hidden bg-forest text-paper/80 md:block">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-8 px-5 py-12">
          <div>
            <Logo light />
            <p className="mt-3 max-w-sm text-sm text-paper/60">
              Все, куди можна піти у Львові: події, місця та маршрути прогулянок, складені AI-гідом.
            </p>
          </div>
          <p className="text-xs text-paper/50">Фото: Wikimedia Commons · Карта © OpenStreetMap</p>
        </div>
      </footer>

      <nav className="fixed inset-x-3 bottom-3 z-[1000] grid grid-cols-4 rounded-2xl border border-ink/10 bg-paper/95 p-1.5 shadow-lg shadow-ink/10 backdrop-blur-md md:hidden">
        {nav.map((n) => {
          const active = isActive(loc, n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition-colors",
                active ? "bg-forest text-paper" : "text-ink-soft",
              )}
            >
              <n.icon className="size-5" strokeWidth={1.8} />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
