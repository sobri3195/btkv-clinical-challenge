# BTKV Clinical Challenge

Mobile-first, frontend-only educational simulation for structured clinical reasoning in cardiothoracic and vascular surgery. It is designed for medical students, prospective residents, residents, and clinicians practicing diagnostic synthesis, operative judgment, and perioperative planning.

## Features

- A featured research and innovation focus: **Development and Bench Validation of an IoT-Based Digital Chest Drain Monitoring System for Cardiothoracic Surgical Education**.
- 18 fictional, de-identified BTKV cases across cardiac, congenital, thoracic, vascular, emergency, perioperative, and postoperative critical care domains.
- Staged five-part challenges, answer feedback, hints, an Operative Planning Board, and score summaries.
- Catalog filtering and sorting, full-text search, favorites, local progress dashboard, quick-reference library, and light/dark/system themes.
- Responsive mobile bottom navigation and desktop sidebar, accessible focus states, and reduced-motion support.
- No account, backend, database, analytics, API, environment variables, or real patient imagery.

## Technology

Vite, React, TypeScript, React Router, Lucide React, and responsive utility-inspired CSS. All application content ships as local TypeScript data.

## Installation and development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To validate a production release:

```bash
npm run lint
npm run build
npm run preview
```

## Deploy to Vercel

Import this repository into Vercel, use `npm run build` as the build command and `dist` as the output directory. `vercel.json` rewrites all paths to `index.html`, allowing React Router routes to load directly and survive refreshes. No environment variables or functions are required.

## Project and case data

The source is organized into `components`, `data`, `hooks`, `pages`, `types`, and app entry files. Cases live in `src/data/cases.ts` and conform to the strict `BTKVCase` interface in `src/types/index.ts`. To add a case, add a seed entry or a complete typed object, assign a unique `id` and `slug`, include clinical observations and five staged questions, then verify catalog, detail, challenge, planning, and result routes.

## Local storage

The app uses `btkv:favorites`, `btkv:progress`, `btkv:challenge-sessions`, `btkv:search-history`, `btkv:theme`, `btkv:splash-seen`, and `btkv:recent-cases`. Defensive parsing falls back safely if saved JSON is corrupt. Data never leaves the browser.

## Medical disclaimer

> BTKV Clinical Challenge is an educational simulation. It is not intended to diagnose patients, determine surgical eligibility, replace institutional protocols, or substitute for supervision by a qualified cardiothoracic and vascular surgeon.
