import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Figma, ExternalLink, Image as ImageIcon, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GALLERY, CATEGORIES } from "@/lib/gallery";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGallery = activeCategory === "All" 
    ? GALLERY 
    : GALLERY.filter(item => item.category === activeCategory);

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
        <div className="flex items-center gap-2">
          <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
            <ImageIcon size={18} />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Getillustra</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Gallery</a>
          <a href="#" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Pricing</a>
          <a href="#" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Submit</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:flex">Sign in</Button>
          <Button className="rounded-full shadow-sm hover-elevate">Get Pro Access</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute top-10 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          Trusted by 100+ top creators & designers
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
        >
          The internet's finest <span className="text-primary italic">illustration</span> gallery.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Discover curated digital illustrations for your next project. 
          Stop scrolling through generic stock sites. Start designing with intention.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="rounded-full w-full sm:w-auto text-base h-12 px-8 shadow-md hover-elevate">
            Browse the Gallery
          </Button>
          <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto text-base h-12 px-8 bg-card border-border hover:bg-secondary">
            Get Figma Plugin <ExternalLink size={16} className="ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Filter Row */}
      <section className="px-6 md:px-12 py-6 border-y border-border/50 bg-background/50 sticky top-[73px] z-40 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto w-full">
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
      <section className="py-8 px-3 md:px-4 w-full flex-1">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {filteredGallery.map((item, index) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={item.id} 
              className="group cursor-pointer"
            >
              <Link href={`/${item.slug}`} className="block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4 border border-border/50">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/800x600/f5f0eb/262626?text=${encodeURIComponent(item.title)}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-medium">{item.title}</span>
                    <button className="bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-colors">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-none shadow-sm text-foreground">
                    {item.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                    {item.author.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.author}</span>
                </div>
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                  {item.likes}
                </span>
              </div>
              </Link>
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
            <Button variant="outline" size="lg" className="rounded-full bg-card">
              Load More Inspiration
            </Button>
          </div>
        )}
      </section>

      {/* Figma Plugin Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-primary/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white border border-border px-3 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Figma size={16} className="text-primary" />
              Official Figma Plugin
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Design straight from your canvas.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Stop switching tabs. Browse, search, and insert premium illustrations directly into your Figma files with our free plugin. 
              The perfect workflow for modern product teams.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Check size={14} />
                </div>
                Drag and drop instantly
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Check size={14} />
                </div>
                High-resolution vector & PNG options
              </li>
              <li className="flex items-center gap-3 text-foreground font-medium">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Check size={14} />
                </div>
                Always in sync with the web gallery
              </li>
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
                <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
                  <img src="/images/iso-1.png" alt="Demo" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
                  <img src="/images/3d-1.png" alt="Demo" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
                  <img src="/images/doodle-1.png" alt="Demo" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
                  <img src="/images/web-1.png" alt="Demo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-medium text-sm mt-4 shadow-sm">
                Insert into Canvas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary w-6 h-6 rounded flex items-center justify-center text-primary-foreground">
              <ImageIcon size={12} />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">Getillustra</span>
          </div>
          
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
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
