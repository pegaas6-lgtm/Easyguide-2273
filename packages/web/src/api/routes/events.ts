import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

export const events = {
  list: base
    .input(
      z
        .object({
          type: z.string().optional(),
          format: z.enum(["all", "online", "offline"]).optional(),
          free: z.boolean().optional(),
          when: z.enum(["all", "today", "weekend", "week"]).optional(),
          q: z.string().optional(),
        })
        .optional(),
    )
    .handler(async ({ input }) => {
      const rows = await db.select().from(schema.events).orderBy(asc(schema.events.startsAt));
      const now = new Date();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      const day = 86400000;
      const q = input?.q?.trim().toLowerCase();
      return rows.filter((e) => {
        const end = e.startsAt.getTime() + e.durationMinutes * 60000;
        if (end < now.getTime()) return false;
        if (input?.type && input.type !== "all" && e.type !== input.type) return false;
        if (input?.format && input.format !== "all" && e.format !== input.format) return false;
        if (input?.free && e.price > 0) return false;
        if (q && !`${e.title} ${e.venue} ${e.description}`.toLowerCase().includes(q)) return false;
        const t = e.startsAt.getTime();
        if (input?.when === "today") return t < startOfToday.getTime() + day;
        if (input?.when === "week") return t < startOfToday.getTime() + 7 * day;
        if (input?.when === "weekend") {
          const dow = startOfToday.getDay();
          const toSat = (6 - dow + 7) % 7;
          const sat = startOfToday.getTime() + toSat * day;
          return (t >= sat && t < sat + 2 * day) || (dow === 0 && t < startOfToday.getTime() + day);
        }
        return true;
      });
    }),
  get: base.input(z.object({ id: z.number() })).handler(async ({ input }) => {
    const [event] = await db.select().from(schema.events).where(eq(schema.events.id, input.id));
    if (!event) throw new ORPCError("NOT_FOUND", { message: "Подію не знайдено" });
    const place = event.placeId
      ? (await db.select().from(schema.places).where(eq(schema.places.id, event.placeId)))[0]
      : undefined;
    return { ...event, place: place ?? null };
  }),
};
