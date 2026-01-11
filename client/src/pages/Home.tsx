import { Navbar } from "@/components/Navbar";
import { AnimeCard } from "@/components/AnimeCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { useAnimes } from "@/hooks/use-animes";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: animes, isLoading, error } = useAnimes();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      {!isLoading && animes && animes.length > 0 ? (
        <HeroCarousel animes={animes.slice(0, 5)} />
      ) : (
        <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
          {/* Abstract animated background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay z-0"></div>
          
          <div className="container relative z-10 px-4 text-center space-y-6">
            <div className="inline-block px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase mb-4">
              Üdvözöl az AxelSub
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-white">
              Nézz Animét <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white text-glow">
                Határok Nélkül
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-lg text-muted-foreground">
              A legjobb hely a kedvenc anime sorozataid streamelésére kiváló minőségben.
              Gyors, megbízható és mindig ingyenes.
            </p>
          </div>
          
          {/* Gradient fade to content */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Népszerű Most
          </h2>
          <div className="hidden md:flex gap-2">
            {['Összes', 'Akció', 'Kaland', 'Fantasy'].map((filter) => (
              <button 
                key={filter}
                className="px-4 py-1.5 rounded-full text-sm font-medium border border-border/50 bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-12">
            Hiba történt az animék betöltésekor. Kérjük, próbálja újra később.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {animes?.map((anime, idx) => (
              <AnimeCard key={anime.id} anime={anime} index={idx} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/20 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-display font-bold text-2xl text-white mb-4">
            AXEL<span className="text-primary">SUB</span>
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Jogi nyilatkozat: Ez az oldal nem tárol fájlokat a szerverén. Minden tartalom külső felektől származik.
          </p>
          <div className="mt-8 text-xs text-muted-foreground/60">
            © 2024 AxelSub. Minden jog fenntartva.
          </div>
        </div>
      </footer>
    </div>
  );
}
