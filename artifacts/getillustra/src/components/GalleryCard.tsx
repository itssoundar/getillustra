import { Link } from "wouter";
import { Show } from "@clerk/react";
import { ArrowRight, Heart, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsSaved, useToggleSave } from "@/hooks/useSaves";
import type { GalleryItem } from "@/lib/gallery";

export function GalleryCard({ item }: { item: GalleryItem }) {
  const saved = useIsSaved(item.slug);
  const { add, remove } = useToggleSave();

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (saved) remove.mutate(item.slug);
    else add.mutate(item.slug);
  };

  return (
    <div className="group cursor-pointer h-full">
      <Link href={`/${item.slug}`} className="block h-full">
        <div className="relative h-full rounded-2xl overflow-hidden bg-secondary border border-border/50">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-[1.04]"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.src = `https://placehold.co/800x600/f5f0eb/262626?text=${encodeURIComponent(item.title)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex items-center justify-between text-white">
              <span className="font-medium">{item.title}</span>
              <span className="bg-white/20 backdrop-blur-md rounded-full p-2">
                <ArrowRight size={16} />
              </span>
            </div>
          </div>

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-none shadow-sm text-foreground">
              {item.category}
            </Badge>
            {item.plan === "Premium" && (
              <Badge className="bg-primary text-primary-foreground border-none shadow-sm">Pro</Badge>
            )}
          </div>

          <Show when="signed-in">
            <button
              onClick={onToggle}
              aria-label={saved ? "Unsave" : "Save"}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-sm transition-colors ${
                saved
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/80 text-foreground hover:bg-background"
              }`}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            </button>
          </Show>
        </div>
        <div className="flex items-center justify-between px-1 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
              {item.author.charAt(0)}
            </div>
            <span className="text-sm font-medium text-muted-foreground">{item.author}</span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Heart size={12} />
            {item.likes}
          </span>
        </div>
      </Link>
    </div>
  );
}
