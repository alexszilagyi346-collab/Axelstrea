import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { db } from "./db";
import { animes, episodes } from "@shared/schema";

async function fetchMalAnime(id: number) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!response.ok) {
      console.error(`Jikan API error for ID ${id}: ${response.status} ${response.statusText}`);
      return null;
    }
    const { data } = await response.json();
    if (!data) return null;
    return {
      title: data.title_english || data.title,
      description: data.synopsis || "Nincs leírás magyar nyelven.",
      coverUrl: data.images.jpg.large_image_url,
      rating: data.score?.toString() || "0.0",
      malId: id,
      genres: data.genres?.map((g: any) => g.name) || []
    };
  } catch (error) {
    console.error(`Fetch error for MAL ID ${id}:`, error);
    return null;
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get(api.animes.list.path, async (req, res) => {
    const animes = await storage.getAnimes();
    res.json(animes);
  });

  app.get(api.animes.get.path, async (req, res) => {
    const anime = await storage.getAnime(Number(req.params.id));
    if (!anime) return res.status(404).json({ message: "Anime not found" });
    res.json(anime);
  });

  app.post("/api/admin/anime", async (req, res) => {
    const { malId, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const malData = await fetchMalAnime(malId);
    if (!malData) return res.status(400).json({ message: "Invalid MAL ID" });

    const anime = await storage.createAnime(malData);
    await storage.createEpisode({
      animeId: anime.id,
      number: 1,
      title: "1. Rész",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
    });
    res.status(201).json(anime);
  });

  app.delete("/api/admin/anime/:id", async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const anime = await storage.getAnime(Number(id));
    if (!anime) return res.status(404).json({ message: "Anime not found" });

    await storage.deleteAnime(Number(id));
    res.json({ success: true });
  });

  app.post("/api/admin/anime/manual", async (req, res) => {
    const { title, description, coverUrl, rating, videoUrl, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const anime = await storage.createAnime({
      title,
      description,
      coverUrl,
      rating: rating || "0.0",
      malId: null,
      genres: []
    });

    await storage.createEpisode({
      animeId: anime.id,
      number: 1,
      title: "1. Rész",
      videoUrl: videoUrl,
      thumbnailUrl: null
    });

    res.status(201).json(anime);
  });

  app.post("/api/history", async (req, res) => {
    const user = req.user as any;
    if (!user) return res.json([]);
    const { episodeId } = req.body;
    const history = await storage.addWatchHistory({
      userId: user.id,
      episodeId,
      watchedAt: new Date().toISOString()
    });
    res.json(history);
  });

  app.get("/api/history", async (req, res) => {
    const user = req.user as any;
    if (!user) return res.json([]);
    const history = await storage.getWatchHistory(user.id);
    res.json(history);
  });

  // Seed data from MAL
  const existing = await storage.getAnimes();
  if (existing.length === 0) {
    // Corrected MAL IDs
    // 30: Evangelion, 50059: Cyberpunk, 38000: Demon Slayer, 40748: Jujutsu Kaisen
    // 61128: Yuusha Party, 59517: Chitose-kun, 61517: Kingdom S6
    const malIds = [30, 50059, 38000, 40748, 61128, 61517, 59517];
    
    for (const malId of malIds) {
      try {
        const malData = await fetchMalAnime(malId);
        if (malData) {
          const anime = await storage.createAnime(malData);
          await storage.createEpisode({
            animeId: anime.id,
            number: 1,
            title: "1. Rész",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
          });
        }
        // Jikan rate limit: 3 requests per second
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to fetch MAL ID ${malId}:`, error);
      }
    }
  }

  return httpServer;
}
