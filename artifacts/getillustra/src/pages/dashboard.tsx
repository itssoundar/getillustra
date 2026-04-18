import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useUser } from "@clerk/react";
import { Bookmark, Clock, Sparkles } from "lucide-react";
import { Header, AnnouncementBar } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";
import { GalleryCard } from "@/components/GalleryCard";
import { useSaves } from "@/hooks/useSaves";
import { GALLERY } from "@/lib/gallery";
import { getRecentlyViewed } from "@/lib/recentlyViewed";

function Section({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="px-3 md:px-4 pb-16 w-full">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      <p className="text-muted-foreground mb-8">{subtitle}</p>
      {children}
    </section>
  );
}

function Grid({ slugs }: { slugs: string[] }) {
  const items = slugs.map((s) => GALLERY.find((g) => g.slug === s)).filter(Boolean) as typeof GALLERY;
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <motion.div
          key={it.slug}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          className="aspect-[4/3]"
        >
          <GalleryCard item={it} />
        </motion.div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const { data, isLoading } = useSaves();
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(getRecentlyViewed()), []);

  const savedSlugs = data?.saves.map((s) => s.illustration_slug) ?? [];
  const recommended = GALLERY.filter((g) => g.trending).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <AnnouncementBar />
      <Header />

      <section className="px-3 md:px-4 pt-12 pb-10 w-full">
        <p className="text-sm font-medium text-muted-foreground mb-3">Your dashboard</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}.
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
          Your saved illustrations, recently viewed pieces, and fresh picks curated for your taste.
        </p>
      </section>

      <Section icon={<Bookmark size={18} />} title="Saved pins" subtitle="Everything you've bookmarked, ready to revisit.">
        {isLoading ? (
          <p className="text-muted-foreground">Loading your saves…</p>
        ) : savedSlugs.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-foreground font-medium mb-2">Nothing saved yet.</p>
            <p className="text-muted-foreground mb-6">Tap the bookmark on any illustration to keep it here.</p>
            <Link href="/explore" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity">
              Browse the gallery
            </Link>
          </div>
        ) : (
          <Grid slugs={savedSlugs} />
        )}
      </Section>

      {recent.length > 0 && (
        <Section icon={<Clock size={18} />} title="Recently viewed" subtitle="Pick up where you left off.">
          <Grid slugs={recent} />
        </Section>
      )}

      <Section icon={<Sparkles size={18} />} title="Recommended for you" subtitle="Trending illustrations selected by the community.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {recommended.map((it) => (
            <div key={it.slug} className="aspect-[4/3]">
              <GalleryCard item={it} />
            </div>
          ))}
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
