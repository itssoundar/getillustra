import { Link } from "wouter";
import { Image as ImageIcon } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-card border-t border-border py-12 px-3 md:px-4 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary w-6 h-6 rounded flex items-center justify-center text-primary-foreground">
            <ImageIcon size={12} />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">Getillustra</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <a href="#newsletter" className="hover:text-foreground transition-colors">Newsletter</a>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Getillustra. Designed for creators.
        </p>
      </div>
    </footer>
  );
}
