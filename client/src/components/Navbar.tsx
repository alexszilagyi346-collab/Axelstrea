import { Link, useLocation } from "wouter";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import SearchOverlay from "./SearchOverlay";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="font-display text-2xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors duration-300">
                AXEL<span className="text-primary text-glow">SUB</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <div className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === "/" ? "text-primary" : "text-muted-foreground"}`}>
                Home
              </div>
            </Link>
            <div className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">
              Popular
            </div>
            <div className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer transition-colors">
              New Release
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchOverlay />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <LayoutDashboard className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
                <LogOut className="w-5 h-5" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-primary text-black font-bold hover:bg-primary/90 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            >
              Bejelentkezés
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
