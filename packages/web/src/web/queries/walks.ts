import { useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useGenerateWalk() {
  return useMutation(orpc.walks.generate.mutationOptions());
}
