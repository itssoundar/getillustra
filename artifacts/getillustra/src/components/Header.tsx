import { Link, useLocation } from "wouter";
import { Show, useUser, useClerk } from "@clerk/react";
import { Image as ImageIcon, Sun, Moon, LogOut, LayoutDashboard, Figma, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function AnnouncementBar() {
  return (
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
  );
}

export function Header() {
  const { theme, toggle } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location] = useLocation();

  const navLink = (to: string, label: string) => {
    const active = location === to;
    return (
      <Link
        href={to}
        className={`font-medium text-sm transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="glass-nav py-4 px-8 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
          <ImageIcon size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">Getillustra</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {navLink("/", "Gallery")}
        {navLink("/explore", "Explore")}
        <a href="#pricing" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Pricing</a>
        <a href="#submit" className="text-muted-foreground hover:text-foreground font-medium transition-colors text-sm">Submit</a>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <Show when="signed-out">
          <Link href="/sign-in">
            <Button variant="ghost" className="hidden sm:flex">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="rounded-full shadow-sm hover-elevate">Get Pro Access</Button>
          </Link>
        </Show>

        <Show when="signed-in">
          <Link href="/dashboard">
            <Button variant="ghost" className="hidden sm:inline-flex gap-2">
              <LayoutDashboard size={16} />
              Dashboard
            </Button>
          </Link>
          <button
            onClick={() => signOut()}
            aria-label="Sign out"
            className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            title={user?.primaryEmailAddress?.emailAddress || "Sign out"}
          >
            <LogOut size={16} />
          </button>
          <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
            {(user?.firstName?.[0] || user?.primaryEmailAddress?.emailAddress?.[0] || "U").toUpperCase()}
          </div>
        </Show>
      </div>
    </header>
  );
}
