import { useEffect, useRef } from "react";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { ClerkProvider, useClerk } from "@clerk/react";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Detail from "@/pages/detail";
import Explore from "@/pages/explore";
import Dashboard from "@/pages/dashboard";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

const clerkAppearance = {
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(11, 70%, 60%)",
    colorBackground: "hsl(0, 0%, 100%)",
    colorInputBackground: "hsl(35, 30%, 98%)",
    colorText: "hsl(30, 10%, 15%)",
    colorTextSecondary: "hsl(30, 10%, 45%)",
    colorInputText: "hsl(30, 10%, 15%)",
    colorNeutral: "hsl(30, 10%, 15%)",
    borderRadius: "1rem",
    fontFamily: "'Instrument Sans', sans-serif",
    fontFamilyButtons: "'Instrument Sans', sans-serif",
    fontSize: "15px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "rounded-2xl w-full overflow-hidden border border-[hsl(35,20%,90%)] shadow-xl bg-white",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    main: "gap-4",
    headerTitle: { color: "hsl(30, 10%, 15%)", fontWeight: "700" },
    headerSubtitle: { color: "hsl(30, 10%, 45%)" },
    socialButtonsBlockButton: "border border-[hsl(35,20%,90%)] hover:bg-[hsl(35,20%,94%)] rounded-full",
    socialButtonsBlockButtonText: { color: "hsl(30, 10%, 15%)", fontWeight: "600" },
    formFieldLabel: { color: "hsl(30, 10%, 25%)", fontWeight: "600" },
    formFieldInput: "rounded-xl border-[hsl(35,20%,90%)] focus:border-[hsl(11,70%,60%)] focus:ring-2 focus:ring-[hsl(11,70%,60%)]/20",
    formButtonPrimary: "bg-[hsl(11,70%,60%)] hover:bg-[hsl(11,70%,55%)] rounded-full font-semibold shadow-sm",
    footerAction: "justify-center",
    footerActionText: { color: "hsl(30, 10%, 45%)" },
    footerActionLink: { color: "hsl(11, 70%, 50%)", fontWeight: "600" },
    dividerLine: "bg-[hsl(35,20%,90%)]",
    dividerText: { color: "hsl(30, 10%, 45%)" },
    identityPreviewEditButton: { color: "hsl(11, 70%, 50%)" },
    formFieldSuccessText: { color: "hsl(160, 50%, 35%)" },
    alert: "rounded-xl border border-[hsl(35,20%,90%)] bg-[hsl(35,20%,94%)]",
    alertText: { color: "hsl(30, 10%, 25%)" },
    otpCodeFieldInput: "rounded-xl border-[hsl(35,20%,90%)]",
    formFieldRow: "gap-2",
    logoBox: "justify-center",
    logoImage: "h-10 w-auto",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);
  return null;
}

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route path="/:slug" component={Detail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to keep building your collection" } },
        signUp: { start: { title: "Create your account", subtitle: "Save illustrations and build boards" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <ThemeProvider>
          <TooltipProvider>
            <Routes />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}
