import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { Show } from "@clerk/react";
import { ArrowLeft, ArrowUpRight, Bookmark, Download, Share2, Check, MoreHorizontal, Link as LinkIcon, Copy, X, Figma } from "lucide-react";
import { GALLERY } from "@/lib/gallery";
import { Header, AnnouncementBar } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryCard } from "@/components/GalleryCard";
import { useIsSaved, useToggleSave } from "@/hooks/useSaves";
import { recordView } from "@/lib/recentlyViewed";
import { Lightbox } from "@/components/Lightbox";

export default function Detail() {
  const params = useParams<{ slug: string }>();
  const item = GALLERY.find((g) => g.slug === params.slug);
  const saved = useIsSaved(params.slug);
  const { add, remove } = useToggleSave();
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [tileCopied, setTileCopied] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const toggleSelect = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const copyTileLink = async (src: string, i: number) => {
    const absolute = new URL(src, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(absolute);
      setTileCopied(i);
      setTimeout(() => setTileCopied((v) => (v === i ? null : v)), 1500);
    } catch {
      // ignore
    }
    setOpenMenu(null);
  };

  const downloadTile = (src: string, i: number) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `${params.slug}-${i + 1}.png`;
    a.click();
    setOpenMenu(null);
  };

  const downloadSelected = () => {
    if (!item) return;
    Array.from(selected).forEach((i, idx) => {
      setTimeout(() => downloadTile(item.previews[i], i), idx * 250);
    });
  };

  const copySelectedLinks = async () => {
    if (!item) return;
    const urls = Array.from(selected).map((i) =>
      new URL(item.previews[i], window.location.origin).toString(),
    );
    try {
      await navigator.clipboard.writeText(urls.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const saveAllSelected = () => {
    if (!item) return;
    if (!saved) add.mutate(item.slug);
    setSelected(new Set());
  };

  useEffect(() => {
    if (item) recordView(item.slug);
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">Illustration not found</h1>
          <p className="text-muted-foreground mb-8">This piece may have been moved or removed from the gallery.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm">
            Back to gallery
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const related = GALLERY.filter((g) => g.category === item.category && g.id !== item.id).slice(0, 4);

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: item.title, url }); return; } catch { /* fallback */ }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onDownload = () => {
    const a = document.createElement("a");
    a.href = item.image;
    a.download = `${item.slug}.png`;
    a.click();
  };

  const onSave = () => (saved ? remove.mutate(item.slug) : add.mutate(item.slug));

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <AnnouncementBar />
      <Header />

      <section className="px-3 md:px-4 pt-10 pb-12 w-full">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors shadow-sm">
          <ArrowLeft size={16} />
          Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 max-w-3xl"
        >
          <p className="text-sm font-medium text-muted-foreground tracking-wide mb-4">{item.category}</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
            {item.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">{item.industry}</span>
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">{item.style}</span>
            <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">{item.color}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.plan === "Premium" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {item.plan}
            </span>
            {item.tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full border border-border text-muted-foreground text-xs font-medium">#{t}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a href={item.visitUrl} target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
                Visit <ArrowUpRight size={16} />
              </button>
            </a>

            <Show when="signed-in">
              <button
                onClick={onSave}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-colors shadow-sm ${
                  saved
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-secondary"
                }`}
              >
                <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                {saved ? "Saved" : "Save"}
              </button>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors shadow-sm">
                <Bookmark size={16} />
                Save
              </Link>
            </Show>

            <button onClick={onDownload} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors shadow-sm">
              <Download size={16} />
              Download
            </button>

            <button onClick={onShare} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-semibold hover:bg-secondary transition-colors shadow-sm">
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? "Link copied" : "Share"}
            </button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {item.author.charAt(0)}
              </div>
              <span className="text-sm font-medium text-muted-foreground pr-2">{item.author}</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-3 md:px-4 w-full pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.previews.map((src, i) => {
            const isSelected = selected.has(i);
            const isMenuOpen = openMenu === i;
            return (
              <motion.div
                key={`${src}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                className={`group relative rounded-3xl overflow-hidden bg-secondary border aspect-[4/3] transition-all ${
                  isSelected ? "border-primary ring-2 ring-primary/40" : "border-border/60"
                }`}
              >
                <img
                  src={src}
                  alt={`${item.title} preview ${i + 1}`}
                  className="w-full h-full object-cover cursor-zoom-in"
                  loading="lazy"
                  onClick={() => setLightboxIndex(i)}
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.src = `https://placehold.co/1200x900/f5f0eb/262626?text=${encodeURIComponent(item.title)}`;
                  }}
                />

                {/* Hover gradient */}
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 transition-opacity duration-200 ${
                  isSelected || isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`} />

                {/* Top-left: select radio */}
                <button
                  onClick={() => toggleSelect(i)}
                  aria-label={isSelected ? "Deselect" : "Select"}
                  className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground opacity-100 shadow-md"
                      : "bg-white/85 backdrop-blur-md text-foreground opacity-0 group-hover:opacity-100 hover:bg-white"
                  }`}
                >
                  {isSelected ? (
                    <Check size={16} strokeWidth={3} />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                </button>

                {/* Top-right: more menu */}
                <div className={`absolute top-3 right-3 transition-opacity ${
                  isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  <button
                    onClick={() => setOpenMenu(isMenuOpen ? null : i)}
                    aria-label="More actions"
                    className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-md text-foreground flex items-center justify-center hover:bg-white shadow-sm"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-2 w-48 rounded-2xl bg-card border border-border shadow-xl overflow-hidden z-10"
                      >
                        <button
                          onClick={() => downloadTile(src, i)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left"
                        >
                          <Download size={15} /> Download
                        </button>
                        <button
                          onClick={() => copyTileLink(src, i)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left"
                        >
                          <LinkIcon size={15} />
                          {tileCopied === i ? "Link copied" : "Copy link"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom: Save + Copy */}
                <div className={`absolute bottom-3 left-3 right-3 flex items-center gap-2 transition-opacity ${
                  isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  <button
                    onClick={() => (saved ? remove.mutate(item.slug) : add.mutate(item.slug))}
                    className="flex-1 px-4 py-2.5 rounded-full bg-white text-foreground text-sm font-semibold shadow-sm hover:bg-white/95 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                    {saved ? "Saved" : "Save"}
                  </button>
                  <button
                    onClick={() => copyTileLink(src, i)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-foreground/85 text-background text-sm font-semibold backdrop-blur-md hover:bg-foreground transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy size={14} />
                    {tileCopied === i ? "Copied" : "Copy"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Floating multi-select bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 md:gap-4 px-3 py-2 rounded-full bg-foreground/95 backdrop-blur-xl text-background shadow-2xl">
              <span className="pl-3 pr-1 text-sm font-medium whitespace-nowrap">
                {selected.size} selected
              </span>
              <button
                onClick={() => setSelected(new Set())}
                className="px-3 py-2 text-sm font-medium opacity-80 hover:opacity-100 hover:bg-white/10 rounded-full transition-colors"
              >
                Clear
              </button>
              <button
                onClick={downloadSelected}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-white/10 rounded-full transition-colors"
              >
                <Download size={16} />
                <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold tracking-wide">PRO</span>
              </button>
              <button
                onClick={copySelectedLinks}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-white/10 rounded-full transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                <Figma size={14} className="opacity-70" />
              </button>
              <button
                onClick={saveAllSelected}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-foreground text-sm font-semibold hover:bg-white/95 transition-colors"
              >
                <Bookmark size={14} />
                Save
              </button>
              <button
                onClick={() => setSelected(new Set())}
                aria-label="Close"
                className="w-8 h-8 ml-1 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        open={lightboxIndex !== null}
        images={item.previews}
        index={lightboxIndex ?? 0}
        title={item.title}
        author={item.author}
        category={item.category}
        saved={saved}
        onToggleSave={() => (saved ? remove.mutate(item.slug) : add.mutate(item.slug))}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(i) => setLightboxIndex(i)}
      />

      {related.length > 0 && (
        <section className="px-3 md:px-4 w-full pb-24">
          <div className="border-t border-border pt-12 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">More from this category</h2>
            <p className="text-muted-foreground">Discover additional inspiration curated for {item.category}.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((r) => (
              <div key={r.id} className="aspect-[4/3]">
                <GalleryCard item={r} />
              </div>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
