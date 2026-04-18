import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Download, X, LogIn, Loader2, Mail, Check } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function LoginRequired({
  open,
  onClose,
  reason = "save",
}: {
  open: boolean;
  onClose: () => void;
  reason?: "save" | "download" | "signin";
}) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<null | "google" | "email">(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      // reset transient state when closing
      setBusy(null);
      setSent(false);
      setError(null);
    }
  }, [open]);

  const copy = {
    save: {
      heading: "Sign in to save illustrations",
      subtitle: "Create your personal collection and access your saved illustrations from any device.",
      Icon: Bookmark,
    },
    download: {
      heading: "Sign in to download illustrations",
      subtitle: "Get instant access to high-quality downloads and unlock your personal library.",
      Icon: Download,
    },
    signin: {
      heading: "Welcome to Getillustra",
      subtitle: "Sign in to save, download, and build your personal library of illustrations.",
      Icon: LogIn,
    },
  }[reason];
  const { heading, subtitle, Icon } = copy;

  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}${window.location.search}`
      : undefined;

  const oauth = async (provider: "google") => {
    setError(null);
    setBusy(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      setError(error.message);
      setBusy(null);
    }
  };

  const sendMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setBusy("email");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    setBusy(null);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] my-auto bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center px-8 pt-10 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-2">
                {heading}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="px-8 pb-8 space-y-3">
              {sent ? (
                <div className="rounded-2xl border border-border bg-secondary/40 p-5 text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-3">
                    <Check size={18} />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Check your inbox</p>
                  <p className="text-sm text-muted-foreground">
                    We sent a magic link to <span className="font-medium text-foreground">{email}</span>. Click it to finish signing in.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => oauth("google")}
                    disabled={!!busy}
                    className="w-full flex items-center justify-center gap-3 h-11 rounded-full border border-border bg-card hover:bg-secondary text-foreground text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {busy === "google" ? <Loader2 size={16} className="animate-spin" /> : <FcGoogle size={18} />}
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <form onSubmit={sendMagic} className="space-y-3">
                    <label className="block">
                      <span className="text-xs font-semibold text-muted-foreground tracking-wide">EMAIL ADDRESS</span>
                      <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1.5 w-full h-11 px-4 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={!!busy || !email.trim()}
                      className="w-full flex items-center justify-center gap-2 h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {busy === "email" ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                      Send magic link
                    </button>
                  </form>

                  {error && (
                    <p className="text-xs text-center text-red-500 pt-1">{error}</p>
                  )}

                  <p className="text-[11px] text-center text-muted-foreground pt-2 leading-relaxed">
                    By continuing you agree to our Terms and acknowledge our Privacy Policy.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
