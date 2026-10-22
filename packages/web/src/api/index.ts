import type { RouterClient } from "@orpc/server";
import { createApp } from "./__core/app";
import { ping } from "./routes/ping";
import { places } from "./routes/places";
import { events } from "./routes/events";
import { walks } from "./routes/walks";

export const router = {
  ping,
  places,
  events,
  walks,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);

export default app;
