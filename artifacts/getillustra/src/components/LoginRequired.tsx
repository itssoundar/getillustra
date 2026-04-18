import { motion, AnimatePresence } from "framer-motion";
import { SignIn } from "@clerk/react";
import { Bookmark, Download, X } from "lucide-react";
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

  const isSave = reason === "save";
  const heading = isSave ? "Sign in to save illustrations" : "Sign in to download illustrations";
  const subtitle = isSave
    ? "Create your personal collection and access your saved illustrations from any device."
    : "Get instant access to high-quality downloads and unlock your personal library.";
  const Icon = isSave ? Bookmark : Download;

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
            className="relative my-auto"
          >
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center justify-center transition-colors shadow-md"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center mb-5 px-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                {heading}
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                {subtitle}
              </p>
            </div>

            <SignIn
              routing="virtual"
              signUpUrl="/sign-up"
              fallbackRedirectUrl={typeof window !== "undefined" ? window.location.pathname + window.location.search : "/"}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
