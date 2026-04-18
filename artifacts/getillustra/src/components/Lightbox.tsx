import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ArrowRight, ArrowLeft, Bookmark, Copy, Download,
  Link as LinkIcon, ChevronDown, Image as ImageIcon, Check, Lock,
} from "lucide-react";

export interface LightboxProps {
  open: boolean;
  images: string[];
  index: number;
  title: string;
  author: string;
  category: string;
  saved: boolean;
  canSave: boolean;
  canDownload: boolean;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  onToggleSave: () => void;
  onDownload: (i: number) => void;
}

export function Lightbox({
  open, images, index, title, author, category,
  saved, canSave, canDownload,
  onClose, onIndexChange, onToggleSave, onDownload,
}: LightboxProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, images.length, onClose, onIndexChange]);

  const copyLink = async () => {
    const absolute = new URL(images[index], window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-[1400px] bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 text-foreground">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                  <ImageIcon size={16} />
                </div>
                <span className="font-semibold text-base">{title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label={canSave ? (saved ? "Unsave" : "Save") : "Sign in to save"}
                  onClick={onToggleSave}
                  className={`hidden sm:flex w-9 h-9 rounded-full items-center justify-center transition-colors ${
                    saved ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {canSave ? (
                    <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                  ) : (
                    <Lock size={14} />
                  )}
                </button>
                <button
                  aria-label="Copy link"
                  onClick={copyLink}
                  className="hidden sm:flex w-9 h-9 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground items-center justify-center"
                >
                  {copied ? <Check size={16} /> : <LinkIcon size={16} />}
                </button>
                <button
                  aria-label="Close"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Stage */}
            <div className="flex-1 relative flex items-center justify-center px-4 pb-28 pt-2 overflow-hidden">
              {images.length > 1 && (
                <button
                  aria-label="Previous"
                  onClick={(e) => { e.stopPropagation(); onIndexChange((index - 1 + images.length) % images.length); }}
                  className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card border border-border text-foreground hover:bg-secondary items-center justify-center transition-colors shadow-md z-10"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={images[index]}
                  src={images[index]}
                  alt={`${title} preview ${index + 1}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                  draggable={false}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <button
                  aria-label="Next"
                  onClick={(e) => { e.stopPropagation(); onIndexChange((index + 1) % images.length); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-card border border-border text-foreground hover:bg-secondary items-center justify-center flex transition-colors shadow-md z-10"
                >
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            {/* Bottom action cluster */}
            <div className="absolute bottom-0 left-0 right-0 pb-6 pt-12 bg-gradient-to-t from-background/80 to-transparent flex flex-col items-center gap-4 pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={onToggleSave}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-colors ${
                    saved
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground border border-border hover:bg-secondary"
                  }`}
                >
                  {canSave ? (
                    <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                  ) : (
                    <Lock size={14} />
                  )}
                  {saved ? "Saved" : "Save"}
                </button>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card text-foreground border border-border text-sm font-semibold hover:bg-secondary transition-colors shadow-md"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => onDownload(index)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card text-foreground border border-border text-sm font-semibold hover:bg-secondary transition-colors shadow-md"
                >
                  {canDownload ? <Download size={14} /> : <Lock size={14} />}
                  Download
                </button>
              </div>

              <button
                onClick={onClose}
                className="pointer-events-auto inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs font-medium"
              >
                See similar <ChevronDown size={12} />
              </button>
            </div>

            {/* Footer meta */}
            <div className="absolute bottom-4 left-4 md:left-6 text-muted-foreground text-xs flex items-center gap-2 pointer-events-none">
              <span>Found in</span>
              <span className="px-2 py-0.5 rounded-md bg-secondary text-foreground font-medium">{category}</span>
              <span className="hidden sm:inline">· {author}</span>
            </div>
            <div className="absolute bottom-4 right-4 md:right-6 text-muted-foreground text-xs flex items-center gap-3 pointer-events-none">
              <span>{index + 1} / {images.length}</span>
              <span className="hidden sm:inline">More info</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
