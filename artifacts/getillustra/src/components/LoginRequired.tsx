import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useClerk } from "@clerk/react";
import { X, Mail, ShieldCheck } from "lucide-react";
import { useEffect } from "react";

export function LoginRequired({
  open,
  onClose,
  reason = "save",
}: {
  open: boolean;
  onClose: () => void;
  reason?: "save" | "download";
}) {
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const continueWithGoogle = () => {
    onClose();
    if (openSignIn) {
      openSignIn({ redirectUrl: window.location.href });
    } else {
      window.location.href = "/sign-in";
    }
  };

  const action = reason === "download" ? "download" : "save";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[110] bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8"
          >
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
              <ShieldCheck size={22} />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Login Required
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Please login to {action} illustrations and unlock your personal
              gallery.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={continueWithGoogle}
                className="w-full h-12 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <Link
                href="/sign-in"
                onClick={onClose}
                className="w-full h-12 rounded-full bg-card border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-3"
              >
                <Mail size={16} />
                Email Login
              </Link>
              <button
                onClick={onClose}
                className="w-full h-11 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              New here?{" "}
              <Link
                href="/sign-up"
                onClick={onClose}
                className="text-primary font-medium hover:underline"
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#fff" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"/>
      <path fill="#fff" opacity=".85" d="M9 18c2.43 0 4.46-.8 5.95-2.18l-2.91-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.92v2.33A9 9 0 0 0 9 18Z"/>
      <path fill="#fff" opacity=".7" d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.92A9 9 0 0 0 0 9c0 1.45.35 2.82.92 4.04l3.05-2.33Z"/>
      <path fill="#fff" opacity=".5" d="M9 3.58c1.32 0 2.5.45 3.43 1.35l2.58-2.58A9 9 0 0 0 .92 4.96l3.05 2.33C4.68 5.16 6.66 3.58 9 3.58Z"/>
    </svg>
  );
}
