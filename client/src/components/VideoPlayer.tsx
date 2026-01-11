import { Link } from "wouter";
import { useState, useRef, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // We assume that a "manual" video from the user's server or a direct link 
  // is one that is NOT an iframe embed.
  const isExternal = src.includes("indavideo") || src.includes("voe") || src.includes("iframe");

  useEffect(() => {
    setError(null);
    setLoading(true);
    setShowIframe(isExternal);
  }, [src, isExternal]);

  const handleVideoError = () => {
    setLoading(false);
    if (!showIframe) {
      console.log("Video playback failed, falling back to iframe/link");
      setError("A natív lejátszás sikertelen. Próbálkozás iframe fallback-el...");
      setShowIframe(true);
    } else {
      setError("A videó nem tölthető be. Ellenőrizd a forrást.");
    }
  };

  const handleLoadedData = () => {
    setLoading(false);
  };

  return (
    <div className="w-full relative group bg-black">
      {/* Glow Effect Background - Neon RGB for internal/manual videos */}
      <div className={`absolute -inset-1 ${!showIframe ? 'neon-rgb-border opacity-100' : 'bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-75'} rounded-2xl blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200`}></div>
      
      <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black border ${!showIframe ? 'border-transparent' : 'border-primary/20'} shadow-2xl`}>
        {loading && !showIframe && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 right-4 z-40">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {showIframe ? (
          <iframe
            src={src}
            className="w-full h-full border-none"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              controls
              playsInline
              crossOrigin="anonymous"
              className="w-full h-full"
              onError={handleVideoError}
              onLoadedData={handleLoadedData}
              onWaiting={() => setLoading(true)}
              onPlaying={() => setLoading(false)}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* AXELSUB Overlay with RGB effect */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
              <Link href="/">
                <span className="text-2xl font-black neon-rgb-text cursor-pointer select-none tracking-tighter pointer-events-auto">
                  AXELSUB
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {showIframe && !isExternal && (
        <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-border flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Ha a videó nem jelenik meg, próbáld megnyitni közvetlenül:
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={src} target="_blank" rel="noopener noreferrer">Megnyitás új lapon</a>
          </Button>
        </div>
      )}
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-xl border border-white/5 z-10"></div>
    </div>
  );
}
