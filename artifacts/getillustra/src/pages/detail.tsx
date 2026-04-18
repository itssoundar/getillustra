import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { useUser } from "@clerk/react";
import { ArrowLeft, ArrowUpRight, Bookmark, Download, Share2, Check, Lock } from "lucide-react";
import { GALLERY } from "@/lib/gallery";
import { Header, AnnouncementBar } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryCard } from "@/components/GalleryCard";
import { useIsSaved, useToggleSave } from "@/hooks/useSaves";
import { recordView } from "@/lib/recentlyViewed";
import { Lightbox } from "@/components/Lightbox";
import { LoginRequired } from "@/components/LoginRequired";

export default function Detail() {
  const params = useParams<{ slug: string }>();
  const item = GALLERY.find((g) => g.slug === params.slug);
  const { isSignedIn } = useUser();
  const saved = useIsSaved(params.slug);
  const { add, remove } = useToggleSave();
  const [copied, setCopied] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [authPrompt, setAuthPrompt] = useState<null | "save" | "download">(null);

  useEffect(() => {
    if (item) recordView(item.slug);
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
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

  const downloadAsset = (src: string, idx: number) => {
    if (!isSignedIn) { setAuthPrompt("download"); return; }
    const a = document.createElement("a");
    a.href = src;
    a.download = `${params.slug}-${idx + 1}.png`;
    a.click();
  };

  const toggleAssetSave = () => {
    if (!isSignedIn) { setAuthPrompt("save"); return; }
    if (saved) remove.mutate(item.slug);
    else add.mutate(item.slug);
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <AnnouncementBar />
      <Header />

      <section className="px-8 pt-10 pb-12 w-full">
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

      <section className="px-8 w-full pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {item.previews.map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
              onClick={() => setLightboxIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLightboxIndex(i);
                }
              }}
              className="group relative rounded-3xl overflow-hidden bg-secondary border border-border/60 aspect-[4/3] transition-all cursor-zoom-in hover:border-border"
            >
              <img
                src={src}
                alt={`${item.title} preview ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.src = `https://placehold.co/1200x900/f5f0eb/262626?text=${encodeURIComponent(item.title)}`;
                }}
              />

              {/* Hover gradient */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Hover actions: Download + Save (or Lock if signed out) */}
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); downloadAsset(src, i); }}
                  aria-label={isSignedIn ? "Download" : "Sign in to download"}
                  title={isSignedIn ? "Download" : "Sign in to download"}
                  className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-foreground flex items-center justify-center shadow-md hover:bg-white transition-colors"
                >
                  {isSignedIn ? <Download size={16} /> : <Lock size={14} />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleAssetSave(); }}
                  aria-label={isSignedIn ? (saved ? "Unsave" : "Save") : "Sign in to save"}
                  title={isSignedIn ? (saved ? "Unsave" : "Save") : "Sign in to save"}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-colors ${
                    isSignedIn && saved
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/90 text-foreground hover:bg-white"
                  }`}
                >
                  {isSignedIn ? (
                    <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                  ) : (
                    <Lock size={14} />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Lightbox
        open={lightboxIndex !== null}
        images={item.previews}
        index={lightboxIndex ?? 0}
        title={item.title}
        author={item.author}
        category={item.category}
        saved={isSignedIn ? saved : false}
        canSave={!!isSignedIn}
        canDownload={!!isSignedIn}
        onToggleSave={toggleAssetSave}
        onDownload={(i) => downloadAsset(item.previews[i], i)}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={(i) => setLightboxIndex(i)}
      />

      <LoginRequired
        open={authPrompt !== null}
        reason={authPrompt ?? "save"}
        onClose={() => setAuthPrompt(null)}
      />

      {related.length > 0 && (
        <section className="px-8 w-full pb-24">
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
