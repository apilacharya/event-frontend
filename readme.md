# Event Planner Frontend

## Overview
React + TypeScript frontend for the Event Planner application.  
It supports authentication, event listing/filtering, event detail view, and event CRUD screens.

## Live App
- Production URL: https://event-frontend-taupe.vercel.app/

## Backend API Used
- Production API base URL: https://event-backend-eiff.onrender.com/api

## Key Features
- Login, signup, logout with cookie-based auth
- Event list with filters
- Event detail page
- Create, edit, and delete events (authenticated users)

## Tech Stack
- React 18 + TypeScript
- Vite
- MUI + Tailwind CSS
- React Query
- React Hook Form + Zod
- Zustand
- Axios

## Local Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Create `.env` in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
3. Start development server:
   ```bash
   pnpm run dev
   ```

## Scripts
- `pnpm run dev` - start Vite dev server
- `pnpm run build` - type-check and build production bundle
- `pnpm run preview` - preview production build locally

## Static Assets
Place public images in `frontend/public/` and reference with root paths, for example:
- `/hero.jpg`
- `/detail.png`
- `/favicon.svg`
