import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { useAnime } from "@/hooks/use-animes";
import { Loader2, Play, Calendar, Star, Clock, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AnimeDetail() {
  const { id } = useParams();
  const { data: anime, isLoading, error } = useAnime(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-destructive">Anime not found</h1>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />

      {/* Backdrop Image */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <img 
          src={anime.coverUrl} 
          alt={anime.title} 
          className="w-full h-full object-cover blur-sm opacity-50 scale-105"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-32">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar / Cover */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full md:w-[300px] flex-shrink-0"
          >
            <div className={`rounded-xl overflow-hidden border ${!anime.malId ? 'neon-rgb-border border-transparent' : 'border-border'} bg-secondary shadow-2xl relative group`}>
              <img 
                src={anime.coverUrl} 
                alt={anime.title} 
                className="w-full aspect-[2/3] object-cover"
              />
              {!anime.malId && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-[#00f3ff]/50 text-[#00f3ff] text-[10px] font-bold tracking-widest uppercase animate-pulse">
                    Manuális Projekt
                  </span>
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-white/10 rounded-xl" />
            </div>
            
            <button className="w-full mt-4 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]">
              <Play className="w-5 h-5 fill-black" />
              Watch Now
            </button>
          </motion.div>

          {/* Info */}
          <div className="flex-1 space-y-6 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2 leading-tight">
                {anime.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1 text-primary">
                  <Star className="w-4 h-4 fill-current" /> {anime.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> 2024
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 24 min
                </span>
                <span className="px-2 py-0.5 rounded border border-border bg-secondary/50 text-xs">HD</span>
              </div>

              <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">
                {anime.description}
              </p>
            </motion.div>

            {/* Episodes Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Episodes
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {anime.episodes?.map((ep) => (
                  <Link key={ep.id} href={`/watch/${ep.id}`}>
                    <div className="group p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-mono group-hover:bg-primary group-hover:text-black transition-colors">
                          {ep.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate group-hover:text-primary transition-colors">
                            {ep.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">Episode {ep.number}</p>
                        </div>
                        <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      
                      {/* Hover glow background */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
