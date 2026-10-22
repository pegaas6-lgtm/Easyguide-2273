import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

export const places = {
  list: base
    .input(z.object({ category: z.string().optional(), q: z.string().optional() }).optional())
    .handler(async ({ input }) => {
      const rows = await db.select().from(schema.places).orderBy(asc(schema.places.name));
      const q = input?.q?.trim().toLowerCase();
      return rows.filter(
        (p) =>
          (!input?.category || input.category === "all" || p.category === input.category) &&
          (!q || `${p.name} ${p.short} ${p.tags.join(" ")}`.toLowerCase().includes(q)),
      );
    }),
  get: base.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const [place] = await db.select().from(schema.places).where(eq(schema.places.id, input.id));
    if (!place) throw new ORPCError("NOT_FOUND", { message: "Місце не знайдено" });
    const events = await db
      .select()
      .from(schema.events)
      .where(eq(schema.events.placeId, input.id))
      .orderBy(asc(schema.events.startsAt));
    return { ...place, events };
  }),
};
