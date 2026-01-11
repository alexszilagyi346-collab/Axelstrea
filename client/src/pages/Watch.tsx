import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useEpisode, useAnime } from "@/hooks/use-animes";
import { Loader2, ChevronLeft, SkipForward, SkipBack, List } from "lucide-react";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Watch() {
  const { episodeId } = useParams();
  const { data: episode, isLoading, error } = useEpisode(Number(episodeId));
  const { data: anime } = useAnime(episode?.animeId ?? 0);

  useEffect(() => {
    if (episode) {
      apiRequest("POST", "/api/history", { episodeId: episode.id }).catch(() => {});
    }
  }, [episode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-destructive">Episode not found</h1>
        <Link href="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link href={`/anime/${episode.animeId}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to Anime
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
            <span className="text-primary mr-3">EP {episode.number}</span>
            {episode.title}
          </h1>
          {anime && <p className="text-muted-foreground text-sm mt-1">{anime.title}</p>}
        </div>

        {/* Video Player Container */}
        <div className="mb-8 overflow-hidden rounded-xl border border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
          <VideoPlayer src={episode.videoUrl} poster={episode.thumbnailUrl ?? undefined} />
        </div>

        {/* Controls / Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">You are watching</p>
            <p className="font-semibold text-white">Episode {episode.number}: {episode.title}</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-white text-sm font-medium transition-colors">
              <SkipBack className="w-4 h-4" /> Prev
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-white text-sm font-medium transition-colors">
              Next <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Episode List (Mini) */}
        {anime && (
          <div className="mt-12">
            <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
              <List className="w-5 h-5 text-primary" />
              All Episodes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {anime.episodes?.map((ep) => (
                <Link key={ep.id} href={`/watch/${ep.id}`}>
                  <div className={`
                    p-3 rounded-lg border text-center cursor-pointer transition-all
                    ${ep.id === episode.id 
                      ? "bg-primary text-black border-primary font-bold" 
                      : "bg-secondary/40 border-border text-muted-foreground hover:border-primary/50 hover:text-white"
                    }
                  `}>
                    <div className="text-xs mb-1">EP</div>
                    <div className="text-lg font-mono">{ep.number}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
