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

### Enhanced Expandable Tooltip System (January 30, 2025)
- **Complete Expandable Tooltip Implementation** - Two-tier tooltip system with basic hover and enhanced modal views
- Database schema enhanced with `expandedContent` and `hasExpandedContent` fields for rich content storage
- **ExpandedTooltipDialog Component** - Full-screen modal with rich content editing capabilities
  - Support for text blocks, tables, and images in structured format
  - Interactive content editor with add/remove functionality for content blocks
  - Table editor with dynamic headers and rows
  - **Local Image Upload Support** - Camera button for selecting and uploading local images
  - Image support with URL, alt text, and caption fields
- **Enhanced TooltipText Component** - Always shows expand button ("View Enhanced Details" or "Add Enhanced Content")
- **Rich Content Editing Interface** - GUI-based editor for creating detailed tooltip content
- **Event Handling Improvements** - Prevents technique rolling when tooltip dialogs are open
- Accessibility improvements with proper dialog descriptions
- Real-time preview and editing capabilities for all content types

### Spirit Die Pool Enhancements (January 30, 2025)
- **Fixed Missing Dice Restore Buttons** - Restore buttons now visible for completely removed dice
- **Visual Placeholder for Missing Dice** - Dashed borders show where removed dice were originally
- **Long Rest Button Added** - Always-visible button to restore all dice to original values
- **Improved Layout Consistency** - All dice positions maintained regardless of current state
- Enhanced user experience with clear visual feedback for dice reduction and restoration

### Portrait Upload System
- Added `portraitUrl` field to characters schema for image storage
- Implemented multer-based file upload with 5MB limit and image validation
- Created portrait upload component with preview, upload, and delete functionality
- Added camera icon overlay on character cards for easy portrait management
- Portraits are stored in `/uploads/portraits/` directory and served statically
- Automatic cleanup of old portrait files when updating or deleting
- **Advanced Image Crop Editor** - Drag and zoom controls for perfect portrait positioning
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
- **Level Editor Component** - Edit character levels directly from character sheet
- Small "Edit" button next to level display in character header
- Dialog interface for updating character level (1-20) with validation
- Current level display and input field for new level
- **Automatic Spirit Die Pool Updates** - Spirit dice automatically update to match new level
- Resets any custom dice overrides when level changes
- Automatic character cache invalidation for real-time updates
- Toast notifications for successful updates and error handling

### Comprehensive Glossary System
- **Basic Hover Tooltips** - Quick reference definitions appear on hover over keyword matches
- **Expandable Enhanced Tooltips** - Modal dialogs with rich content including tables, images, and detailed text
- **Smart Content Detection** - System automatically detects when enhanced content exists and shows expand button
- **Rich Content Editor** - Full GUI for creating and editing enhanced tooltip content with multiple content types
- **Keyword Matching** - Case-insensitive automatic detection of glossary terms in all text content
- Sample enhanced content demonstrates table formatting for die sizes, SP investment levels, and strategic considerations

### Data Synchronization Fix (January 29, 2025)
- **RESOLVED: Character Level Display Bug** - Fixed stale character data in character sheet
- Implemented fresh character data fetching with separate API query
- Character level now updates immediately in header after level changes
- **RESOLVED: Restore Button Bug** - Fixed incorrect restore button appearance after level changes
- Enhanced level editor to delete/recreate spirit die pools on level changes
- Added DELETE route and storage methods for spirit die pools
- Spirit dice now properly recognize new level-based dice as "original" dice
- Restore buttons only appear when dice have been legitimately reduced by failed technique rolls

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