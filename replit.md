# Character Sheet Application

## Overview

This is a full-stack character sheet application designed for tabletop RPGs, specifically focused on managing "Spirit Dice" mechanics. The application features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM. It uses shadcn/ui components for a polished user interface with Tailwind CSS styling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Backend Separation
The application follows a clear separation between frontend and backend:
- **Frontend**: React SPA located in `/client` directory
- **Backend**: Express.js API server in `/server` directory
- **Shared**: Common schema definitions and types in `/shared` directory

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, TanStack Query, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state, React hooks for local state

## Recent Changes (January 2025)

### Portrait Upload System
- Added `portraitUrl` field to characters schema for image storage
- Implemented multer-based file upload with 5MB limit and image validation
- Created portrait upload component with preview, upload, and delete functionality
- Added camera icon overlay on character cards for easy portrait management
- Portraits are stored in `/uploads/portraits/` directory and served statically
- Automatic cleanup of old portrait files when updating or deleting
- **NEW: Advanced Image Crop Editor** - Drag and zoom controls for perfect portrait positioning
  - Interactive canvas-based editor with circular crop preview
  - Zoom slider for precise image scaling (0.2x to 3x)
  - Drag functionality to position image within crop area
  - Reset button to center image
  - Real-time preview of final circular portrait

### Main Menu Navigation
- Replaced character switching with dedicated main menu system
- Main menu displays all characters in a card grid layout with portraits
- Added theme toggle (light/dark mode) across the application
- Character sheets now have "Main Menu" button instead of character selector
- Proper routing between main menu (/) and character sheets (/character/:id)

### Level Management System
- **NEW: Level Editor Component** - Edit character levels directly from character sheet
- Small "Edit" button next to level display in character header
- Dialog interface for updating character level (1-20) with validation
- Current level display and input field for new level
- Automatic character cache invalidation for real-time updates
- Toast notifications for successful updates and error handling

## Key Components

### Database Schema (`shared/schema.ts`)
Defines four main entities:
- **Characters**: Basic character information (name, path, level, portrait)
- **Spirit Die Pools**: Character-specific dice pools with configurable sizes
- **Techniques**: Special abilities with SP (Spirit Point) effects
- **Active Effects**: Temporary character modifiers

### Backend Architecture (`server/`)
- **Storage Layer**: In-memory storage implementation (`MemStorage`) with interface for future database integration
- **API Routes**: RESTful endpoints for CRUD operations on all entities
- **Express Setup**: Middleware for logging, JSON parsing, and error handling

### Frontend Architecture (`client/src/`)
- **Component Structure**: Modular UI components with clear separation of concerns
- **State Management**: Custom hooks for character state management
- **API Integration**: Centralized API client with TanStack Query
- **Routing**: Simple page-based routing with Wouter

## Data Flow

### Character Data Management
1. Character data flows from the backend storage through REST APIs
2. Frontend uses TanStack Query for caching and synchronization
3. Mutations trigger optimistic updates and cache invalidation
4. Toast notifications provide user feedback

### Spirit Die Mechanics
1. Characters have configurable spirit die pools (count and size)
2. Techniques consume Spirit Points (SP) and trigger die rolls
3. Failed rolls reduce die sizes, successful rolls maintain them
4. Long rests restore all dice to original configuration

### Real-time Updates
- API calls include request/response logging
- Optimistic updates provide immediate UI feedback
- Cache invalidation ensures data consistency

## External Dependencies

### UI Framework
- **Radix UI**: Accessible primitive components
- **shadcn/ui**: Pre-built component library
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Data Management
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database queries
- **Neon Database**: PostgreSQL hosting (configured but not actively used)

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Production bundling for backend

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation
- In-memory storage for rapid development
- Replit-specific plugins for development experience

### Production Build
- Frontend: Vite builds to `dist/public`
- Backend: ESBuild bundles server to `dist/index.js`
- Single deployment target serving both frontend and API

### Database Migration
- Drizzle configured for PostgreSQL
- Migration files generated to `/migrations`
- Environment variable `DATABASE_URL` required for production
- Current implementation uses in-memory storage as fallback

### Key Configuration Files
- **Vite Config**: Frontend build configuration with path aliases
- **Drizzle Config**: Database schema and migration settings
- **Tailwind Config**: UI theming and component styling
- **TypeScript Config**: Shared configuration for all packages

The architecture supports easy transition from development (in-memory storage) to production (PostgreSQL) through the storage interface abstraction.