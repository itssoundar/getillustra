import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Detail from "@/pages/detail";
import Explore from "@/pages/explore";
import Dashboard from "@/pages/dashboard";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sign-in"><Redirect to="/" /></Route>
      <Route path="/sign-up"><Redirect to="/" /></Route>
      <Route path="/:slug" component={Detail} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Routes />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}
