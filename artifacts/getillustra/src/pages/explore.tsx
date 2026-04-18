import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { GALLERY, INDUSTRIES, STYLES, COLORS, PLANS, type Industry, type Style, type Color, type Plan } from "@/lib/gallery";
import { GalleryCard } from "@/components/GalleryCard";
import { Header, AnnouncementBar } from "@/components/Header";
import { SiteFooter } from "@/components/SiteFooter";

const PAGE_SIZE = 8;

const BENTO_SPANS = [
  "row-span-[28]", "row-span-[20]", "row-span-[24]", "row-span-[30]",
  "row-span-[22]", "row-span-[32]", "row-span-[18]", "row-span-[26]",
];

function FilterGroup<T extends string>({
  label, options, selected, onToggle,
}: { label: string; options: T[]; selected: Set<T>; onToggle: (v: T) => void }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.has(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                active
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Explore() {
  const [query, setQuery] = useState("");
  const [industries, setIndustries] = useState<Set<Industry>>(new Set());
  const [styles, setStyles] = useState<Set<Style>>(new Set());
  const [colors, setColors] = useState<Set<Color>>(new Set());
  const [plans, setPlans] = useState<Set<Plan>>(new Set());
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const toggle = <T extends string>(set: Set<T>, setSet: (s: Set<T>) => void, v: T) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setSet(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GALLERY.filter((it) => {
      if (industries.size && !industries.has(it.industry)) return false;
      if (styles.size && !styles.has(it.style)) return false;
      if (colors.size && !colors.has(it.color)) return false;
      if (plans.size && !plans.has(it.plan)) return false;
      if (q) {
        const hay = `${it.title} ${it.author} ${it.category} ${it.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, industries, styles, colors, plans]);

  useEffect(() => setVisible(PAGE_SIZE), [query, industries, styles, colors, plans]);

  // Infinite scroll: when sentinel enters viewport, load more (cycling through dataset).
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length * 4));
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtered.length]);

  const items = useMemo(() => {
    if (!filtered.length) return [];
    const out = [];
    for (let i = 0; i < visible; i++) out.push({ ...filtered[i % filtered.length], _key: i });
    return out;
  }, [filtered, visible]);

  const activeCount = industries.size + styles.size + colors.size + plans.size;

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <AnnouncementBar />
      <Header />

      <section className="px-3 md:px-4 pt-12 pb-8 w-full">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-muted-foreground mb-3">Explore</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.05] mb-4">
            Search the full library.
          </h1>
          <p className="text-lg text-muted-foreground">
            Filter by industry, style, color, and plan. Scroll to load more inspiration.
          </p>
        </div>

        <div className="relative mt-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, tag…"
            className="w-full pl-11 pr-10 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      <section className="px-3 md:px-4 pb-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-border/50 py-8 bg-background/50">
        <FilterGroup label="Industry" options={INDUSTRIES} selected={industries} onToggle={(v) => toggle(industries, setIndustries, v)} />
        <FilterGroup label="Style" options={STYLES} selected={styles} onToggle={(v) => toggle(styles, setStyles, v)} />
        <FilterGroup label="Color" options={COLORS} selected={colors} onToggle={(v) => toggle(colors, setColors, v)} />
        <FilterGroup label="Plan" options={PLANS} selected={plans} onToggle={(v) => toggle(plans, setPlans, v)} />
      </section>

      <section className="px-3 md:px-4 py-8 w-full flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {filtered.length} match{filtered.length === 1 ? "" : "es"}
            {activeCount > 0 && ` · ${activeCount} filter${activeCount === 1 ? "" : "s"} active`}
          </p>
          {activeCount > 0 && (
            <button
              onClick={() => { setIndustries(new Set()); setStyles(new Set()); setColors(new Set()); setPlans(new Set()); }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-foreground mb-2">Nothing matches yet</h3>
            <p className="text-muted-foreground">Try removing a filter or adjusting your search.</p>
          </div>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[10px]">
              {items.map((item, i) => (
                <motion.div
                  layout
                  key={item._key}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: (i % PAGE_SIZE) * 0.04 }}
                  className={BENTO_SPANS[i % BENTO_SPANS.length]}
                >
                  <GalleryCard item={item} />
                </motion.div>
              ))}
            </motion.div>

            <div ref={sentinelRef} className="h-20 flex items-center justify-center mt-8">
              <span className="text-sm text-muted-foreground">Loading more…</span>
            </div>
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
