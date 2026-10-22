import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function usePlaces(category?: string, q?: string) {
  return useQuery(orpc.places.list.queryOptions({ input: { category, q }, staleTime: 60_000 }));
}
export function usePlace(id: string) {
  return useQuery(orpc.places.get.queryOptions({ input: { id }, staleTime: 60_000 }));
}
