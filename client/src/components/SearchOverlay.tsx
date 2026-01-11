import { useState, useMemo } from "react";
import { useAnimes } from "@/hooks/use-animes";
import { AnimeCard } from "@/components/AnimeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { data: animes } = useAnimes();

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    animes?.forEach(a => a.genres?.forEach(g => genres.add(g)));
    return Array.from(genres);
  }, [animes]);

  const filtered = useMemo(() => {
    return animes?.filter(a => {
      const matchesQuery = a.title.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = !selectedGenre || a.genres?.includes(selectedGenre);
      return matchesQuery && matchesGenre;
    });
  }, [animes, query, selectedGenre]);

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(true)}
        className="text-[#00f3ff]"
      >
        <Search className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl p-4 md:p-8 overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    autoFocus
                    placeholder="Keress animét..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 h-14 bg-secondary/50 border-primary/20 text-xl focus-visible:ring-primary"
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-8 h-8" />
                </Button>
              </div>

              <div className="mb-12">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Grid className="w-4 h-4" /> Népszerű Műfajok
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedGenre === null ? "default" : "outline"}
                    onClick={() => setSelectedGenre(null)}
                    className={selectedGenre === null ? "bg-primary text-black" : "border-primary/20"}
                  >
                    Összes
                  </Button>
                  {allGenres.map(genre => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      onClick={() => setSelectedGenre(genre)}
                      className={selectedGenre === genre ? "bg-primary text-black" : "border-primary/20"}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filtered?.map((anime, idx) => (
                  <div key={anime.id} onClick={() => setIsOpen(false)}>
                    <AnimeCard anime={anime} index={idx} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
