import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Figma, ExternalLink, Image as ImageIcon, Search, Check, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GALLERY, CATEGORIES } from "@/lib/gallery";
import { Header, AnnouncementBar } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryCard } from "@/components/GalleryCard";
import { api } from "@/lib/api";

const BENTO_SPANS = [
  "row-span-[28]", "row-span-[20]", "row-span-[24]", "row-span-[30]",
  "row-span-[22]", "row-span-[32]", "row-span-[18]", "row-span-[26]",
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const filteredGallery = activeCategory === "All"
    ? GALLERY
    : GALLERY.filter((item) => item.category === activeCategory);

  const trending = GALLERY.filter((g) => g.trending).slice(0, 4);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus("loading");
    try {
      await api.subscribeNewsletter(email);
      setSubStatus("ok");
      setEmail("");
    } catch {
      setSubStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-20 px-8 text-center max-w-4xl mx-auto relative">
        <div className="absolute top-10 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Trusted by 100+ top creators & designers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
        >
          Discover beautiful <span className="text-primary italic">product</span> illustrations.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Curated inspiration for designers, startups, and product teams. Stop scrolling generic stock — start designing with intention.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/explore">
            <Button size="lg" className="rounded-full w-full sm:w-auto text-base h-12 px-8 shadow-md hover-elevate">
              Explore the Library
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-base h-12 px-8 bg-card border-border hover:bg-secondary">
            Get Figma Plugin <ExternalLink size={16} className="ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Trending */}
      <section className="px-8 pb-12 w-full">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
              <Sparkles size={14} /> Trending this week
            </p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Hand-picked highlights</h2>
          </div>
          <Link href="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {trending.map((it) => (
            <div key={it.slug} className="aspect-[4/3]">
              <GalleryCard item={it} />
            </div>
          ))}
        </div>
      </section>

      {/* Filter Row */}
      <section className="px-8 py-6 border-y border-border/50 bg-background/50 sticky top-[73px] z-40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div className="flex-1 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-card text-muted-foreground border border-border hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search styles, tags..."
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 px-8 w-full flex-1">
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[10px]">
          {filteredGallery.map((item, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              key={item.id}
              className={BENTO_SPANS[index % BENTO_SPANS.length]}
            >
              <GalleryCard item={item} />
            </motion.div>
          ))}
        </motion.div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-foreground mb-2">No illustrations found</h3>
            <p className="text-muted-foreground">Try selecting a different category.</p>
          </div>
        )}

        {filteredGallery.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Link href="/explore">
              <Button variant="outline" size="lg" className="rounded-full bg-card">
                Load More Inspiration
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Figma Plugin */}
      <section className="py-24 px-8 relative overflow-hidden bg-primary/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Figma size={16} className="text-primary" />
              Official Figma Plugin
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Design straight from your canvas.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Stop switching tabs. Browse, search, and insert premium illustrations directly into your Figma files with our free plugin.
            </p>
            <ul className="space-y-4 mb-10">
              {["Drag and drop instantly", "High-resolution vector & PNG options", "Always in sync with the web gallery"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-foreground font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Check size={14} />
                  </div>
                  {t}
                </li>
              ))}
            </ul>
            <Button size="lg" className="rounded-full h-12 px-8 shadow-md hover-elevate">
              Install Plugin for Free
            </Button>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] -rotate-6 scale-105"></div>
            <div className="relative bg-card border border-border rounded-[2rem] p-6 shadow-xl w-full max-w-md mx-auto md:ml-auto">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <ImageIcon size={16} />
                  </div>
                  <span className="font-semibold">Getillustra</span>
                </div>
                <Search size={18} className="text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {["/images/iso-1.png", "/images/3d-1.png", "/images/doodle-1.png", "/images/web-1.png"].map((src) => (
                  <div key={src} className="aspect-square bg-secondary rounded-xl overflow-hidden">
                    <img src={src} alt="Demo" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-medium text-sm mt-4 shadow-sm">
                Insert into Canvas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 px-8 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
            <Mail size={14} className="text-primary" />
            Newsletter
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Fresh inspiration in your inbox.
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            One short email each Monday with the week's best illustration finds. No spam, ever.
          </p>
          <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="flex-1 px-5 py-3 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <Button type="submit" size="lg" className="rounded-full px-6 shadow-sm" disabled={subStatus === "loading"}>
              {subStatus === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
          {subStatus === "ok" && <p className="mt-4 text-sm text-primary font-medium">Thanks — you're on the list.</p>}
          {subStatus === "error" && <p className="mt-4 text-sm text-destructive font-medium">Couldn't subscribe. Try again.</p>}
        </div>
      </section>

      <SiteFooter />

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
