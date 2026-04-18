import { supabase } from "./supabase";

export const api = {
  subscribeNewsletter: async (email: string) => {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    // Treat duplicates as success (already subscribed)
    if (error && !`${error.message}`.toLowerCase().includes("duplicate")) {
      throw new Error(error.message);
    }
    return { ok: true as const };
  },
};
