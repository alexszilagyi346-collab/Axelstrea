import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Plus, Globe, Pencil, Upload } from "lucide-react";
import type { Anime } from "@shared/schema";
import { ObjectUploader } from "@/components/ObjectUploader";

export default function Admin() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [malId, setMalId] = useState("");
  const [mode, setMode] = useState<"mal" | "manual">("mal");

  // Manual fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [rating, setRating] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const { data: animes, isLoading } = useQuery<Anime[]>({
    queryKey: ["/api/animes"],
  });

  const addMalMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", "/api/admin/anime", { malId: id, password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      toast({ title: "Sikeres hozzáadás", description: "Az anime bekerült a rendszerbe." });
      setMalId("");
    },
    onError: () => {
      toast({ title: "Hiba", description: "Ellenőrizd a jelszót és a MAL ID-t.", variant: "destructive" });
    },
  });

  const addManualMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/anime/manual", { 
        title, description, coverUrl, rating, videoUrl, password 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      toast({ title: "Sikeres hozzáadás", description: "A manuális projekt bekerült." });
      setTitle(""); setDescription(""); setCoverUrl(""); setRating(""); setVideoUrl("");
    },
    onError: () => {
      toast({ title: "Hiba", description: "Nem sikerült a manuális hozzáadás.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/anime/${id}`, { password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animes"] });
      toast({ title: "Sikeres törlés", description: "Törölve." });
    },
  });

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-[#0b0f19] border-[#00f3ff]/20 mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#00f3ff]">Adminisztráció</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={mode === "mal" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMode("mal")}
              className={mode === "mal" ? "bg-[#00f3ff] text-black" : "border-[#00f3ff]/20 text-[#00f3ff]"}
            >
              <Globe className="w-4 h-4 mr-2" /> MAL ID
            </Button>
            <Button 
              variant={mode === "manual" ? "default" : "outline"} 
              size="sm"
              onClick={() => setMode("manual")}
              className={mode === "manual" ? "bg-[#00f3ff] text-black" : "border-[#00f3ff]/20 text-[#00f3ff]"}
            >
              <Pencil className="w-4 h-4 mr-2" /> Manuális
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Admin Jelszó"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#1a202c] border-[#00f3ff]/20 mb-4"
          />

          {mode === "mal" ? (
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="MyAnimeList ID (pl. 12171)"
                value={malId}
                onChange={(e) => setMalId(e.target.value)}
                className="bg-[#1a202c] border-[#00f3ff]/20"
              />
              <Button
                onClick={() => addMalMutation.mutate(Number(malId))}
                disabled={addMalMutation.isPending || !malId || !password}
                className="bg-[#00f3ff] text-[#0b0f19]"
              >
                {addMalMutation.isPending ? <Loader2 className="animate-spin" /> : "Hozzáadás"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input placeholder="Cím" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#1a202c] border-[#00f3ff]/20" />
              <Textarea placeholder="Leírás" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#1a202c] border-[#00f3ff]/20" />
              <Input placeholder="Borítókép URL" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="bg-[#1a202c] border-[#00f3ff]/20" />
              <Input placeholder="Értékelés (pl. 8.5)" value={rating} onChange={(e) => setRating(e.target.value)} className="bg-[#1a202c] border-[#00f3ff]/20" />
              
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Videófájl feltöltése vagy URL megadása</label>
                <div className="flex gap-2">
                  <Input placeholder="Video URL (.mp4 vagy indavideo/voe link)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="bg-[#1a202c] border-[#00f3ff]/20" />
                  <ObjectUploader
                    onGetUploadParameters={async (file) => {
                      const res = await apiRequest("POST", "/api/uploads/request-url", {
                        name: file.name,
                        size: file.size,
                        contentType: file.type,
                      });
                      const { uploadURL, publicUrl } = await res.json();
                      return { method: "PUT", url: uploadURL, headers: { "Content-Type": file.type }, publicUrl };
                    }}
                    onComplete={(result) => {
                      if (result.successful?.[0]) {
                        const publicUrl = (result.successful[0] as any).uploadURL.split('?')[0];
                        setVideoUrl(publicUrl);
                        toast({ title: "Feltöltés kész", description: "A videó elérési útja frissítve." });
                      }
                    }}
                  >
                    <Button variant="outline" className="border-[#00f3ff]/20 text-[#00f3ff]">
                      <Upload className="w-4 h-4 mr-2" /> Feltöltés
                    </Button>
                  </ObjectUploader>
                </div>
              </div>

              <Button
                onClick={() => addManualMutation.mutate()}
                disabled={addManualMutation.isPending || !title || !videoUrl || !password}
                className="w-full bg-[#00f3ff] text-[#0b0f19]"
              >
                {addManualMutation.isPending ? <Loader2 className="animate-spin" /> : "Manuális Projekt Létrehozása"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white mb-4">Aktuális Projektek</h2>
        {animes?.map((anime) => (
          <Card key={anime.id} className="bg-[#0b0f19] border-[#00f3ff]/10">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <img src={anime.coverUrl} className="w-12 h-16 object-cover rounded" alt="" />
                <div>
                  <h3 className="font-bold text-white">{anime.title}</h3>
                  <p className="text-sm text-gray-400">{anime.malId ? `MAL ID: ${anime.malId}` : "Manuális feltöltés"}</p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => confirm("Törlöd?") && deleteMutation.mutate(anime.id)}
                disabled={deleteMutation.isPending || !password}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
