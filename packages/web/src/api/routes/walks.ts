import { z } from "zod";
import { generateText, Output } from "ai";
import dedent from "dedent";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { gateway } from "../agent/gateway";

const durationLabel = {
  short: { label: "1–2 години", minutes: 100, stops: "3–4" },
  half: { label: "пів дня (3–4 години)", minutes: 210, stops: "5–6" },
  day: { label: "цілий день (6–8 годин)", minutes: 420, stops: "7–9" },
} as const;

const paceLabel = { slow: "неспішний", normal: "звичайний", fast: "активний" } as const;

const aiSchema = z.object({
  title: z.string().describe("Коротка поетична назва маршруту"),
  intro: z.string().describe("2–3 речення вступу від гіда"),
  stops: z.array(
    z.object({
      placeId: z.string(),
      minutes: z.number().describe("Скільки хвилин провести на зупинці"),
      story: z.string().describe("Розповідь гіда 3–5 речень: історія, легенда, цікавий факт"),
      tip: z.string().describe("Практична порада: що подивитись, де фото, що скуштувати"),
    }),
  ),
  outro: z.string().describe("1–2 речення завершення"),
});

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function orderByNearest<T extends { lat: number; lng: number }>(items: T[]): T[] {
  if (items.length < 3) return items;
  const rest = items.slice(1);
  const out = [items[0]!];
  while (rest.length) {
    const last = out[out.length - 1]!;
    let best = 0;
    for (let i = 1; i < rest.length; i++) if (haversine(last, rest[i]!) < haversine(last, rest[best]!)) best = i;
    out.push(rest.splice(best, 1)[0]!);
  }
  return out;
}

async function walkingGeometry(points: { lat: number; lng: number }[]) {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  try {
    const res = await fetch(
      `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coords}?overview=full&geometries=geojson`,
      { signal: AbortSignal.timeout(8000), headers: { "User-Agent": "EasyGuide/1.0" } },
    );
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      routes?: { distance: number; geometry: { coordinates: [number, number][] } }[];
    };
    const route = data.routes?.[0];
    if (!route) throw new Error("no route");
    return {
      path: route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]),
      distance: Math.round(route.distance),
      exact: true,
    };
  } catch {
    let d = 0;
    for (let i = 1; i < points.length; i++) d += haversine(points[i - 1]!, points[i]!);
    return {
      path: points.map((p) => [p.lat, p.lng] as [number, number]),
      distance: Math.round(d * 1.3),
      exact: false,
    };
  }
}

export const walks = {
  generate: base
    .input(
      z.object({
        interests: z.array(z.string()).min(1),
        duration: z.enum(["short", "half", "day"]),
        pace: z.enum(["slow", "normal", "fast"]),
        startId: z.string().optional(),
        note: z.string().max(300).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const all = await db.select().from(schema.places);
      const byId = new Map(all.map((p) => [p.id, p]));
      const start = input.startId ? byId.get(input.startId) : undefined;
      const d = durationLabel[input.duration];

      const catalog = all
        .map(
          (p) =>
            `${p.id} | ${p.name} | ${p.category} | ${p.tags.join(", ")} | ${p.lat.toFixed(4)},${p.lng.toFixed(4)} | ~${p.visitMinutes} хв | ${p.short}`,
        )
        .join("\n");

      const prompt = dedent`
        Ти — досвідчений, дотепний львівський гід. Склади пішохідний маршрут по Львову.

        Інтереси гостя: ${input.interests.join(", ")}
        Тривалість: ${d.label} (разом з переходами)
        Темп: ${paceLabel[input.pace]}
        ${start ? `Старт обов'язково з: ${start.id} (${start.name})` : "Старт: на твій вибір, найлогічніша точка"}
        ${input.note ? `Побажання гостя: ${input.note}` : ""}

        Обирай ЛИШЕ місця з каталогу нижче, використовуй точний id. Обери ${d.stops} зупинок.
        Зупинки мають бути близько одна до одної (дивись координати) і йти логічною пішою лінією без повернень.
        Якщо маршрут довший за 2 години — додай одну кав'ярню чи ресторан (category cafe) для перерви.
        Для далеких місць (Шевченківський гай, Личаківський цвинтар, Стрийський парк, вокзал) — лише якщо дозволяє тривалість.
        Розповіді пиши живою українською, як гід: факти, легенди, деталі, на які варто звернути увагу.
        Не посилайся на попередні чи наступні зупинки в тексті розповіді.

        Каталог (id | назва | категорія | теги | координати | час | опис):
        ${catalog}
      `;

      let output: z.infer<typeof aiSchema> | undefined;
      for (const model of ["google/gemini-3-flash", "openai/gpt-5.4-mini"]) {
        try {
          const res = await generateText({ model: gateway(model), output: Output.object({ schema: aiSchema }), prompt });
          output = res.output;
          if (output?.stops?.length) break;
        } catch (e) {
          console.error("walk generation failed with", model, e);
        }
      }
      if (!output?.stops?.length) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", { message: "Не вдалося скласти маршрут, спробуйте ще раз" });
      }

      const seen = new Set<string>();
      let stops = output.stops
        .filter((s) => byId.has(s.placeId) && !seen.has(s.placeId) && seen.add(s.placeId))
        .map((s) => ({ ...s, place: byId.get(s.placeId)! }));
      if (start && stops[0]?.placeId !== start.id) {
        const existing = stops.find((s) => s.placeId === start.id);
        stops = [
          existing ?? { placeId: start.id, minutes: start.visitMinutes, story: start.history, tip: "", place: start },
          ...stops.filter((s) => s.placeId !== start.id),
        ];
      }
      const ordered = orderByNearest(stops.map((s) => ({ ...s, lat: s.place.lat, lng: s.place.lng })));
      const geo = await walkingGeometry(ordered);
      const speed = { slow: 65, normal: 80, fast: 95 }[input.pace]; // metres per minute
      const walkMinutes = Math.round(geo.distance / speed);
      const stayMinutes = ordered.reduce((a, s) => a + s.minutes, 0);

      return {
        title: output.title,
        intro: output.intro,
        outro: output.outro,
        stops: ordered.map(({ lat: _lat, lng: _lng, ...s }) => s),
        path: geo.path,
        exactPath: geo.exact,
        distance: geo.distance,
        walkMinutes,
        totalMinutes: walkMinutes + stayMinutes,
      };
    }),
};
