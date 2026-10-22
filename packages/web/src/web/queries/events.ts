import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export type EventFilters = {
  type?: string;
  format?: "all" | "online" | "offline";
  free?: boolean;
  when?: "all" | "today" | "weekend" | "week";
  q?: string;
};

export function useEvents(filters: EventFilters = {}) {
  return useQuery(orpc.events.list.queryOptions({ input: filters, staleTime: 60_000 }));
}
export function useEvent(id: number) {
  return useQuery(orpc.events.get.queryOptions({ input: { id }, staleTime: 60_000 }));
}
