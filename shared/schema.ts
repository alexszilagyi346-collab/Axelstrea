/**
 * ANIME ADATOK ÉS ADATBÁZIS SÉMA (Anime Data and DB Schema)
 * Ez a fájl tartalmazza az alkalmazás összes adatmodelljét.
 */

import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const animes = pgTable("animes", {
  id: serial("id").primaryKey(),
  malId: integer("mal_id").unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coverUrl: text("cover_url").notNull(),
  rating: text("rating").default("0.0"),
  genres: text("genres").array(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  episodeId: integer("episode_id").notNull(),
  watchedAt: text("watched_at").notNull(),
});

export const animesRelations = relations(animes, ({ many }) => ({
  episodes: many(episodes),
}));

export const episodesRelations = relations(episodes, ({ one }) => ({
  anime: one(animes, {
    fields: [episodes.animeId],
    references: [animes.id],
  }),
}));

export const insertAnimeSchema = createInsertSchema(animes).omit({ id: true });
export const insertEpisodeSchema = createInsertSchema(episodes).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertWatchHistorySchema = createInsertSchema(watchHistory).omit({ id: true });

export type Anime = typeof animes.$inferSelect;
export type InsertAnime = z.infer<typeof insertAnimeSchema>;
export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WatchHistory = typeof watchHistory.$inferSelect;
export type InsertWatchHistory = z.infer<typeof insertWatchHistorySchema>;
