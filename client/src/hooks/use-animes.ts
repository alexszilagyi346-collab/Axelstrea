import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useAnimes() {
  return useQuery({
    queryKey: [api.animes.list.path],
    queryFn: async () => {
      const res = await fetch(api.animes.list.path);
      if (!res.ok) throw new Error("Failed to fetch animes");
      return api.animes.list.responses[200].parse(await res.json());
    },
  });
}

export function useAnime(id: number) {
  return useQuery({
    queryKey: [api.animes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.animes.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch anime details");
      return api.animes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useEpisode(id: number) {
  return useQuery({
    queryKey: [api.episodes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.episodes.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch episode");
      return api.episodes.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
