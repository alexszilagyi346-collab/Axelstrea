import { useState, useEffect } from "react";
import { Link } from "wouter";
import { type Anime } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroCarouselProps {
  animes: Anime[];
}

export function HeroCarousel({ animes }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!animes.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [animes.length]);

  if (!animes.length) return null;

  const currentAnime = animes[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % animes.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);

  return (
    <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAnime.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image with Wash */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentAnime.coverUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          </div>

          <div className="container relative z-20 h-full flex flex-col justify-center px-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Kiemelt Anime
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight leading-tight">
                {currentAnime.title}
              </h1>
              
              <p className="text-lg text-muted-foreground line-clamp-3 md:line-clamp-4 italic">
                {currentAnime.description}
              </p>

              <div className="flex items-center gap-4 pt-4">
                <Link href={`/anime/${currentAnime.id}`}>
                  <Button size="lg" className="gap-2 font-bold shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                    <Play className="w-5 h-5 fill-current" />
                    Megtekintés
                  </Button>
                </Link>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Értékelés</span>
                  <span className="text-2xl font-display font-bold text-primary">★ {currentAnime.rating}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-8 z-30 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="rounded-full border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/20 hover:border-primary transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="rounded-full border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/20 hover:border-primary transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {animes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
