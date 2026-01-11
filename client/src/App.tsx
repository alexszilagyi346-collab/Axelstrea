import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AnimeDetail from "@/pages/AnimeDetail";
import Watch from "@/pages/Watch";
import Admin from "@/pages/Admin";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Link } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/anime/:id" component={AnimeDetail} />
      <Route path="/watch/:episodeId" component={Watch} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="min-h-screen w-full bg-[#0b0f19]">
            <nav className="p-4 border-b border-[#00f3ff]/10 flex gap-4">
              <Link href="/" className="text-[#00f3ff] hover:underline">Főoldal</Link>
              <Link href="/admin" className="text-[#00f3ff] hover:underline">Admin</Link>
            </nav>
            <Toaster />
            <Router />
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
