import { Link } from "wouter";
import { Play, Star } from "lucide-react";
import { type Anime } from "@shared/schema";
import { motion } from "framer-motion";

interface AnimeCardProps {
  anime: Anime;
  index: number;
}

export function AnimeCard({ anime, index }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group relative cursor-pointer"
      >
        {/* Card Image Container */}
        <div className={`relative aspect-[2/3] overflow-hidden rounded-xl border ${!anime.malId ? 'neon-rgb-border border-transparent' : 'border-border/50'} bg-secondary box-glow-hover transition-all duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <img
            src={anime.coverUrl}
            alt={anime.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {!anime.malId && (
            <div className="absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded bg-[#00f3ff] text-black text-[10px] font-bold animate-pulse">
              MANUÁLIS
            </div>
          )}

          {/* Hover Overlay with Play Button */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.6)] transform scale-50 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-6 w-6 text-black fill-current ml-1" />
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 z-20 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{anime.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 space-y-1">
          <h3 className="font-display font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {anime.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {anime.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
