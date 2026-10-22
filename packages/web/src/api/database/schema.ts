import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const places = sqliteTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // history | church | museum | park | cafe | viewpoint
  short: text("short").notNull(),
  history: text("history").notNull(),
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  image: text("image").notNull(),
  visitMinutes: integer("visit_minutes").notNull(),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  hours: text("hours"),
  price: text("price"),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type").notNull(), // webinar | training | concert | lecture | exhibition | tour | festival | workshop
  format: text("format").notNull(), // online | offline
  startsAt: integer("starts_at", { mode: "timestamp" }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  price: integer("price").notNull(), // UAH, 0 = free
  venue: text("venue").notNull(),
  placeId: text("place_id"),
  address: text("address"),
  lat: real("lat"),
  lng: real("lng"),
  organizer: text("organizer").notNull(),
  description: text("description").notNull(),
  image: text("image"),
});
