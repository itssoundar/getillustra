import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight, Image as ImageIcon, Figma, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GALLERY } from "@/lib/gallery";

export default function Detail() {
  const params = useParams<{ slug: string }>();
  const item = GALLERY.find((g) => g.slug === params.slug);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-3">Illustration not found</h1>
        <p className="text-muted-foreground mb-8">This piece may have been moved or removed from the gallery.</p>
        <Link href="/">
          <Button className="rounded-full">Back to gallery</Button>
        </Link>
      </div>
    );
  }

  const related = GALLERY.filter((g) => g.category === item.category && g.id !== item.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* Top Strip */}
      <a
        href="https://www.figma.com/community/plugin/1542480874133957666"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-primary text-primary-foreground px-4 py-2 text-center text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Figma size={16} />
        <span>Getillustra for Figma is now live! Install the plugin to drag & drop directly into your canvas.</span>
        <ArrowRight size={14} className="opacity-80" />
      </a>

      {/* Navigation */}
      <header className="glass-nav py-4 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
            <ImageIcon size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Getillustra</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Gallery</Link>
          <a href="#" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Pricing</a>
          <a href="#" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Submit</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:flex">Sign in</Button>
          <Button className="rounded-full shadow-sm hover-elevate">Get Pro Access</Button>
        </div>
      </header>

      {/* Header */}
      <section className="px-6 md:px-12 pt-10 pb-12 max-w-[1400px] mx-auto w-full">
        <Link href="/">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors shadow-sm">
            <ArrowLeft size={16} />
            Back
          </button>
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
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            {item.description}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a href={item.visitUrl} target="_blank" rel="noopener noreferrer">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm">
                Visit
                <ArrowUpRight size={16} />
              </button>
            </a>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {item.author.charAt(0)}
              </div>
              <span className="text-sm font-medium text-muted-foreground pr-2">{item.author}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Preview Stack */}
      <section className="px-6 md:px-12 max-w-[1400px] mx-auto w-full pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {item.previews.map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
              className="rounded-3xl overflow-hidden bg-secondary border border-border/60 aspect-[4/3]"
            >
              <img
                src={src}
                alt={`${item.title} preview ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/1200x900/f5f0eb/262626?text=${encodeURIComponent(item.title)}`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-6 md:px-12 max-w-[1400px] mx-auto w-full pb-24">
          <div className="border-t border-border pt-12 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">More from this category</h2>
            <p className="text-muted-foreground">Discover additional inspiration curated for {item.category}.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/${r.slug}`} className="group cursor-pointer block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4 border border-border/50">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://placehold.co/800x600/f5f0eb/262626?text=${encodeURIComponent(r.title)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="flex items-center justify-between text-white w-full">
                        <span className="font-medium">View {r.title}</span>
                        <span className="bg-white/20 backdrop-blur-md rounded-full p-2">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-1">
                    <p className="font-medium text-foreground">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.author}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary w-6 h-6 rounded flex items-center justify-center text-primary-foreground">
              <ImageIcon size={12} />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Getillustra</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Submit Art</a>
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Figma</a>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Getillustra. Designed for creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
