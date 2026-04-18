import { motion, AnimatePresence } from "framer-motion";
import { SignIn } from "@clerk/react";
import { X } from "lucide-react";
import { useEffect } from "react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function LoginRequired({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  reason?: "save" | "download";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
            className="relative"
          >
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-card border border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center justify-center transition-colors shadow-md"
            >
              <X size={18} />
            </button>

            <SignIn
              routing="path"
              path={`${basePath}/sign-in`}
              signUpUrl={`${basePath}/sign-up`}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
