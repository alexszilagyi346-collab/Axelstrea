# AxelSub - Anime Streaming Platform

## Overview

AxelSub is an anime streaming web application built with a React frontend and Express backend. The platform allows users to browse anime titles, view details, and watch episodes through an embedded video player that supports both direct video files and external iframe embeds (indavideo, voe).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and hover effects
- **Build Tool**: Vite

The frontend follows a page-based structure with reusable components. Pages include Home (anime listing), AnimeDetail (show details with episode list), and Watch (video player page).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts`
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Storage Pattern**: Repository pattern via `storage.ts` abstracting database operations

The server handles API routes for fetching anime and episodes, with seed data automatically created on first run if the database is empty.

### Shared Code
- **Schema**: Database models defined in `shared/schema.ts` using Drizzle. This file contains the authoritative definition of all data models (Animes, Episodes, Users, Sessions, Watch History).
- **Routes**: API route definitions with Zod validation in `shared/routes.ts`.
- **Type Safety**: Full TypeScript coverage with shared types between frontend and backend.

### Data Model (Authority: `shared/schema.ts`)
- **Animes**: id, title, description, coverUrl, rating, malId, genres
- **Episodes**: id, animeId (foreign key), number, title, videoUrl, thumbnailUrl
- **Users**: id, username, email, password, profileImage
- **Watch History**: id, userId, episodeId, watchedAt
- Relationship: One anime has many episodes.

### Development vs Production
- Development: Vite dev server with HMR, proxied through Express
- Production: Vite builds to `dist/public`, Express serves static files

## External Dependencies

### Database
- **PostgreSQL**: Primary database (connection via `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migrations and schema push (`db:push` command)

### Key NPM Packages
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- `@tanstack/react-query`: Data fetching and caching
- `framer-motion`: Animation library
- `lucide-react`: Icon library
- `wouter`: Client-side routing
- `zod`: Runtime type validation

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required for database operations)