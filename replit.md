# Pet Adoption Management System

## Overview

This is a pet adoption management system that helps connect pets in need with loving families. The application features a modern web interface for browsing available pets, submitting adoption applications, and managing the adoption process. It includes both public-facing pages for potential adopters and staff dashboard functionality for managing pets and applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight React router alternative)
- **Styling**: Tailwind CSS for utility-first styling with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod for form validation and type safety
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with structured endpoints for pets, applications, and adoptions
- **Data Storage**: Currently using in-memory storage with plans for PostgreSQL integration via Drizzle ORM
- **Validation**: Zod schemas shared between frontend and backend for consistent data validation
- **Development**: TypeScript throughout with hot reloading via Vite middleware

### Database Schema Design
The system uses Drizzle ORM with PostgreSQL dialect for database operations:
- **pets**: Core pet information including species, breed, age, health status, and adoption status
- **applications**: User applications to adopt specific pets with personal information and living conditions
- **adoptions**: Records of completed adoptions linking pets to their new families

### File Structure
- `/client`: React frontend application with components, pages, and utilities
- `/server`: Express backend with API routes and business logic
- `/shared`: Common TypeScript schemas and types used by both frontend and backend
- Components organized by feature with reusable UI components in `/client/src/components/ui`

### Key Features
- Pet browsing with filtering by species, age, and search functionality
- Multi-step application form with progress tracking
- Staff dashboard for managing pets and reviewing applications
- Adoption history showcase with success stories
- Responsive design optimized for mobile and desktop

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with migration support

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: High-quality component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI components for React

### Development Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Static type checking throughout the application
- **ESBuild**: Fast JavaScript bundler for production builds

### State Management
- **TanStack Query**: Powerful data synchronization for React with caching and background updates
- **React Hook Form**: Performant forms with easy validation

### Validation & Type Safety
- **Zod**: Schema validation library for runtime type checking
- **drizzle-zod**: Integration between Drizzle ORM and Zod for database schema validation

The architecture emphasizes type safety, developer experience, and maintainability while providing a smooth user experience for both adopters and staff members managing the adoption process.