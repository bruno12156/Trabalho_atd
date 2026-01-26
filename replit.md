# Replit.md

## Overview

This is a **Click Registration Application** - a simple web app that records user interactions through buttons. When a user clicks one of four buttons, the system logs the click with a daily sequential counter, timestamp, and stores it in a PostgreSQL database. The counter automatically resets at the start of each new day.

The project was built for educational purposes (ATD and LP courses) to demonstrate web development fundamentals including frontend/backend integration, database operations, and version control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for UI animations
- **Build Tool**: Vite with custom development plugins for Replit

The frontend follows a component-based architecture with:
- Feature components (`ClickButton`, `HistoryList`, `LastClickCard`)
- UI primitives from shadcn/ui in `client/src/components/ui/`
- Custom hooks for data fetching (`use-clicks.ts`)
- Path aliases: `@/` for client/src, `@shared/` for shared code

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript (ESM modules)
- **API Style**: REST with typed contracts in `shared/routes.ts`
- **Validation**: Zod schemas for request/response validation

The backend uses a storage abstraction pattern:
- `DatabaseStorage` class implements `IStorage` interface
- Routes defined in `server/routes.ts` using the shared API contract
- Development uses Vite middleware; production serves static files

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend/backend)
- **Migrations**: Drizzle Kit with `db:push` command

Database schema:
- `clicks` table: `id`, `buttonLabel`, `dailySequence`, `createdAt`
- Daily sequence counter resets based on `createdAt` date filtering

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle table definitions and Zod schemas
- `routes.ts`: API contract with paths, methods, and response types

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database queries and schema management
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### Frontend Libraries
- **date-fns**: Date formatting for display
- **Radix UI**: Accessible component primitives (full shadcn/ui suite)
- **TanStack Query**: Server state management with auto-refetching

### Development Tools
- **Vite**: Development server with HMR
- **esbuild**: Production bundling for server
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner

### Build & Deploy
- Development: `npm run dev` (tsx + Vite)
- Production: `npm run build` then `npm start`
- Database sync: `npm run db:push`