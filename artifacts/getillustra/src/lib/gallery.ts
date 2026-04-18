export type Industry = "SaaS" | "Fintech" | "AI" | "Healthcare" | "Ecommerce";
export type Style = "3D" | "Flat" | "Isometric" | "Cartoon" | "Minimal";
export type Color = "Warm" | "Cool" | "Mono" | "Vibrant" | "Pastel";
export type Plan = "Free" | "Premium";

export interface GalleryItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  image: string;
  likes: number;
  description: string;
  visitUrl: string;
  previews: string[];
  tags: string[];
  industry: Industry;
  style: Style;
  color: Color;
  plan: Plan;
  trending?: boolean;
}

export const CATEGORIES = ["All", "2D", "3D", "Collage Art", "Doodle/Typo", "Isometric", "Mobile App", "Website"];
export const INDUSTRIES: Industry[] = ["SaaS", "Fintech", "AI", "Healthcare", "Ecommerce"];
export const STYLES: Style[] = ["3D", "Flat", "Isometric", "Cartoon", "Minimal"];
export const COLORS: Color[] = ["Warm", "Cool", "Mono", "Vibrant", "Pastel"];
export const PLANS: Plan[] = ["Free", "Premium"];

export const GALLERY: GalleryItem[] = [
  {
    id: 1, slug: "abstract-geometry", title: "Abstract Geometry", category: "3D",
    author: "Studio Nova", image: "/images/3d-1.png", likes: 342,
    description: "A study in form, shadow, and saturated gradients. Studio Nova builds sculptural 3D moments that anchor product pages and bring depth to brand systems without overwhelming the surrounding type.",
    visitUrl: "https://studionova.example.com",
    previews: ["/images/3d-1.png", "/images/3d-2.png", "/images/iso-1.png", "/images/iso-2.png"],
    tags: ["abstract", "gradient", "shapes", "hero"], industry: "SaaS", style: "3D", color: "Vibrant", plan: "Premium", trending: true,
  },
  {
    id: 2, slug: "modern-workspace", title: "Modern Workspace", category: "Isometric",
    author: "IsoLabs", image: "/images/iso-1.png", likes: 891,
    description: "An isometric exploration of focused, calm work — desks, lamps, plants, and small rituals. IsoLabs designs scenes that scale from hero illustration to tiny app icon without losing their warmth.",
    visitUrl: "https://isolabs.example.com",
    previews: ["/images/iso-1.png", "/images/iso-2.png", "/images/3d-1.png", "/images/web-1.png"],
    tags: ["workspace", "desk", "scene", "calm"], industry: "SaaS", style: "Isometric", color: "Pastel", plan: "Free", trending: true,
  },
  {
    id: 3, slug: "creative-chaos", title: "Creative Chaos", category: "Doodle/Typo",
    author: "Scribble Inc", image: "/images/doodle-1.png", likes: 420,
    description: "Hand-drawn marks meet expressive typography. Scribble Inc's work feels personal and unpolished in the best way — like the sketchbook page that became the campaign.",
    visitUrl: "https://scribbleinc.example.com",
    previews: ["/images/doodle-1.png", "/images/doodle-2.png", "/images/collage-1.png", "/images/2d-1.png"],
    tags: ["doodle", "typography", "hand-drawn"], industry: "Ecommerce", style: "Cartoon", color: "Mono", plan: "Free",
  },
  {
    id: 4, slug: "fintech-dashboard", title: "Fintech Dashboard", category: "Mobile App",
    author: "UI Masters", image: "/images/mobile-1.png", likes: 567,
    description: "Onboarding, balances, and transactions that actually feel friendly. UI Masters strips the cold edge off financial UI and replaces it with confident color and breathable hierarchy.",
    visitUrl: "https://uimasters.example.com",
    previews: ["/images/mobile-1.png", "/images/mobile-2.png", "/images/web-1.png", "/images/iso-2.png"],
    tags: ["dashboard", "fintech", "mobile", "ui"], industry: "Fintech", style: "Flat", color: "Cool", plan: "Premium", trending: true,
  },
  {
    id: 5, slug: "collaboration-hero", title: "Collaboration Hero", category: "Website",
    author: "Pixel Perfect", image: "/images/web-1.png", likes: 234,
    description: "A landing-page hero made for SaaS teams — characters mid-collaboration, soft depth, and a clear focal point that survives at any breakpoint.",
    visitUrl: "https://pixelperfect.example.com",
    previews: ["/images/web-1.png", "/images/mobile-1.png", "/images/iso-1.png", "/images/3d-2.png"],
    tags: ["hero", "team", "saas"], industry: "SaaS", style: "Flat", color: "Warm", plan: "Free",
  },
  {
    id: 6, slug: "vintage-surrealism", title: "Vintage Surrealism", category: "Collage Art",
    author: "Artisan Co", image: "/images/collage-1.png", likes: 678,
    description: "Cut-and-paste collage with a quiet wit. Artisan Co reaches into the archive and stitches together pieces that feel both familiar and slightly off-kilter.",
    visitUrl: "https://artisanco.example.com",
    previews: ["/images/collage-1.png", "/images/collage-2.png", "/images/doodle-2.png", "/images/2d-1.png"],
    tags: ["collage", "vintage", "editorial"], industry: "Ecommerce", style: "Minimal", color: "Mono", plan: "Premium",
  },
  {
    id: 7, slug: "friendly-mascot", title: "Friendly Mascot", category: "3D",
    author: "Clay World", image: "/images/3d-2.png", likes: 1120,
    description: "Soft-edged character work with a tactile, hand-modeled feel. Clay World's mascots earn the smile — they don't beg for it.",
    visitUrl: "https://clayworld.example.com",
    previews: ["/images/3d-2.png", "/images/3d-1.png", "/images/iso-2.png", "/images/mobile-2.png"],
    tags: ["mascot", "character", "3d"], industry: "AI", style: "3D", color: "Pastel", plan: "Premium", trending: true,
  },
  {
    id: 8, slug: "cozy-cafe", title: "Cozy Cafe", category: "Isometric",
    author: "IsoLabs", image: "/images/iso-2.png", likes: 890,
    description: "A neighborhood cafe rendered with care — steam, warm wood, and the kind of small details that reward a second look.",
    visitUrl: "https://isolabs.example.com/cafe",
    previews: ["/images/iso-2.png", "/images/iso-1.png", "/images/web-1.png", "/images/3d-1.png"],
    tags: ["cafe", "scene", "warm"], industry: "Ecommerce", style: "Isometric", color: "Warm", plan: "Free",
  },
  {
    id: 9, slug: "organic-flow", title: "Organic Flow", category: "2D",
    author: "Vector Space", image: "/images/2d-1.png", likes: 445,
    description: "Loose vector shapes that feel painted instead of plotted. Vector Space designs flat illustration with a pulse — never sterile, always intentional.",
    visitUrl: "https://vectorspace.example.com",
    previews: ["/images/2d-1.png", "/images/doodle-1.png", "/images/collage-2.png", "/images/web-1.png"],
    tags: ["organic", "shapes", "flat"], industry: "Healthcare", style: "Flat", color: "Pastel", plan: "Free",
  },
  {
    id: 10, slug: "rocket-onboarding", title: "Rocket Onboarding", category: "Mobile App",
    author: "UI Masters", image: "/images/mobile-2.png", likes: 334,
    description: "An onboarding flow that earns the tap-through. Bright, illustrated screens guide the user through setup without ever feeling like a chore.",
    visitUrl: "https://uimasters.example.com/rocket",
    previews: ["/images/mobile-2.png", "/images/mobile-1.png", "/images/iso-1.png", "/images/3d-2.png"],
    tags: ["onboarding", "mobile", "rocket"], industry: "AI", style: "Cartoon", color: "Vibrant", plan: "Premium",
  },
  {
    id: 11, slug: "floral-architecture", title: "Floral Architecture", category: "Collage Art",
    author: "Artisan Co", image: "/images/collage-2.png", likes: 789,
    description: "Botanical forms layered against built environments. Artisan Co's collages are slow design — they reward the viewer who lingers.",
    visitUrl: "https://artisanco.example.com/floral",
    previews: ["/images/collage-2.png", "/images/collage-1.png", "/images/doodle-1.png", "/images/2d-1.png"],
    tags: ["floral", "architecture", "collage"], industry: "Healthcare", style: "Minimal", color: "Cool", plan: "Premium",
  },
  {
    id: 12, slug: "energy-poster", title: "Energy Poster", category: "Doodle/Typo",
    author: "Scribble Inc", image: "/images/doodle-2.png", likes: 512,
    description: "Loud, kinetic, unapologetic. A poster series built for moments that need to grab the room and refuse to let go.",
    visitUrl: "https://scribbleinc.example.com/energy",
    previews: ["/images/doodle-2.png", "/images/doodle-1.png", "/images/collage-1.png", "/images/3d-1.png"],
    tags: ["poster", "kinetic", "type"], industry: "Fintech", style: "Cartoon", color: "Vibrant", plan: "Free",
  },
];
