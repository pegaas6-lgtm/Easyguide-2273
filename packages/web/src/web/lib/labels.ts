export const placeCategories = [
  { id: "all", label: "Усе" },
  { id: "history", label: "Пам'ятки" },
  { id: "church", label: "Храми" },
  { id: "museum", label: "Музеї" },
  { id: "park", label: "Парки" },
  { id: "cafe", label: "Кафе та ресторани" },
  { id: "viewpoint", label: "Оглядові" },
] as const;

export const placeCategoryLabel: Record<string, string> = Object.fromEntries(
  placeCategories.map((c) => [c.id, c.label]),
);

export const eventTypes = [
  { id: "all", label: "Усі" },
  { id: "concert", label: "Концерти" },
  { id: "tour", label: "Екскурсії" },
  { id: "webinar", label: "Вебінари" },
  { id: "training", label: "Тренінги" },
  { id: "lecture", label: "Лекції" },
  { id: "workshop", label: "Майстер-класи" },
  { id: "exhibition", label: "Виставки" },
  { id: "festival", label: "Фестивалі" },
] as const;

export const eventTypeLabel: Record<string, string> = {
  concert: "Концерт",
  tour: "Екскурсія",
  webinar: "Вебінар",
  training: "Тренінг",
  lecture: "Лекція",
  workshop: "Майстер-клас",
  exhibition: "Виставка",
  festival: "Фестиваль",
};

const tz = "Europe/Kyiv";
export function fmtDay(d: Date) {
  return new Intl.DateTimeFormat("uk-UA", { day: "numeric", timeZone: tz }).format(d);
}
export function fmtMonthShort(d: Date) {
  return new Intl.DateTimeFormat("uk-UA", { month: "short", timeZone: tz }).format(d).replace(".", "");
}
export function fmtWeekday(d: Date) {
  return new Intl.DateTimeFormat("uk-UA", { weekday: "short", timeZone: tz }).format(d);
}
export function fmtTime(d: Date) {
  return new Intl.DateTimeFormat("uk-UA", { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(d);
}
export function fmtFull(d: Date) {
  return new Intl.DateTimeFormat("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: tz,
  }).format(d);
}
export function fmtPrice(p: number) {
  return p === 0 ? "Безкоштовно" : `${p} грн`;
}
export function fmtDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} хв`;
  return m ? `${h} год ${m} хв` : `${h} год`;
}
