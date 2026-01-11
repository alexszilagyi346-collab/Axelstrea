import { db } from "./db";
import { animes, episodes, users, watchHistory, type Anime, type Episode, type InsertAnime, type InsertEpisode, type User, type InsertUser, type WatchHistory, type InsertWatchHistory } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getAnimes(): Promise<Anime[]>;
  getAnime(id: number): Promise<(Anime & { episodes: Episode[] }) | undefined>;
  getAnimeByMalId(malId: number): Promise<Anime | undefined>;
  createAnime(anime: InsertAnime): Promise<Anime>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  deleteAnime(id: number): Promise<void>;
  
  // Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // History
  getWatchHistory(userId: number): Promise<(WatchHistory & { episode: Episode & { anime: Anime } })[]>;
  addWatchHistory(history: InsertWatchHistory): Promise<WatchHistory>;
}

export class DatabaseStorage implements IStorage {
  async getAnimes(): Promise<Anime[]> {
    return await db.select().from(animes);
  }

  async getAnime(id: number): Promise<(Anime & { episodes: Episode[] }) | undefined> {
    const anime = await db.query.animes.findFirst({
      where: eq(animes.id, id),
      with: { episodes: true }
    });
    return anime;
  }

  async getAnimeByMalId(malId: number): Promise<Anime | undefined> {
    const [anime] = await db.select().from(animes).where(eq(animes.malId, malId));
    return anime;
  }

  async createAnime(insertAnime: InsertAnime): Promise<Anime> {
    const [anime] = await db.insert(animes).values(insertAnime).returning();
    return anime;
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const [episode] = await db.insert(episodes).values(insertEpisode).returning();
    return episode;
  }

  async deleteAnime(id: number): Promise<void> {
    await db.delete(episodes).where(eq(episodes.animeId, id));
    await db.delete(animes).where(eq(animes.id, id));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getWatchHistory(userId: number): Promise<(WatchHistory & { episode: Episode & { anime: Anime } })[]> {
    return await db.query.watchHistory.findMany({
      where: eq(watchHistory.userId, userId),
      with: {
        episode: {
          with: { anime: true }
        }
      },
      orderBy: [desc(watchHistory.watchedAt)]
    }) as any;
  }

  async addWatchHistory(history: InsertWatchHistory): Promise<WatchHistory> {
    const [existing] = await db.select().from(watchHistory)
      .where(and(eq(watchHistory.userId, history.userId), eq(watchHistory.episodeId, history.episodeId)));
    
    if (existing) {
      const [updated] = await db.update(watchHistory)
        .set({ watchedAt: history.watchedAt })
        .where(eq(watchHistory.id, existing.id))
        .returning();
      return updated;
    }

    const [newHistory] = await db.insert(watchHistory).values(history).returning();
    return newHistory;
  }
}

export const storage = new DatabaseStorage();
