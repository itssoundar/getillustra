import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { api } from "@/lib/api";

export function useSaves() {
  const { isSignedIn } = useUser();
  return useQuery({
    queryKey: ["saves"],
    queryFn: () => api.getSaves(),
    enabled: !!isSignedIn,
  });
}

export function useToggleSave() {
  const qc = useQueryClient();
  const add = useMutation({
    mutationFn: (slug: string) => api.addSave(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saves"] }),
  });
  const remove = useMutation({
    mutationFn: (slug: string) => api.removeSave(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saves"] }),
  });
  return { add, remove };
}

export function useIsSaved(slug: string) {
  const { data } = useSaves();
  return !!data?.saves.some((s) => s.illustration_slug === slug);
}
