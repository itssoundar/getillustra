import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export type SaveRow = { illustration_slug: string; created_at: string };

export function useSaves() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saves", user?.id ?? "anon"],
    queryFn: async (): Promise<{ saves: SaveRow[] }> => {
      if (!user) return { saves: [] };
      const { data, error } = await supabase
        .from("saves")
        .select("illustration_slug, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return { saves: (data ?? []) as SaveRow[] };
    },
    enabled: !!user,
  });
}

export function useToggleSave() {
  const qc = useQueryClient();
  const { user } = useAuth();

  const add = useMutation({
    mutationFn: async (slug: string) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("saves")
        .insert({ user_id: user.id, illustration_slug: slug });
      if (error && !`${error.message}`.toLowerCase().includes("duplicate")) throw error;
      return { ok: true as const };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saves"] }),
  });

  const remove = useMutation({
    mutationFn: async (slug: string) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("saves")
        .delete()
        .eq("illustration_slug", slug);
      if (error) throw error;
      return { ok: true as const };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saves"] }),
  });

  return { add, remove };
}

export function useIsSaved(slug: string) {
  const { data } = useSaves();
  return !!data?.saves.some((s) => s.illustration_slug === slug);
}
