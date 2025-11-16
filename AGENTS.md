# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds all runtime code: routing sits in `App.tsx`, screens live in `pages/`, reusable UI in `components/`, shared hooks in `hooks/`, app state in `state/`, and helpers in `lib/`.  
- Global styles live in `src/App.css` and `src/index.css`; Tailwind tokens and shadcn blocks are defined by `tailwind.config.ts` and `components.json`. Static assets belong in `public/`.  
- `tsconfig.json` maps `@/` to `src/`; prefer the alias for new imports to keep modules shallow.

## Build, Test, and Development Commands
- `npm run dev` — start the Vite dev server at http://localhost:5173 with hot reload.  
- `npm run build` — produce optimized assets in `dist/`.  
- `npm run build:dev` — run the same build in development mode when debugging config-only issues.  
- `npm run preview` — serve `dist/` locally to validate deploy artifacts.  
- `npm run lint` — execute ESLint via `eslint.config.js`; run it before every commit.

## Coding Style & Naming Conventions
- Author React function components in TypeScript (`.tsx`) with 2-space indentation and trailing commas, mirroring `App.tsx`.  
- Use PascalCase for components/contexts, camelCase for hooks/utilities, and kebab-case for static assets; keep file names descriptive of the QR feature they serve.  
- Favor Tailwind utilities and the `cn` helper over inline styles, and reuse shadcn primitives before creating new UI wrappers.  
- Define prop, hook, and store types explicitly; share reusable contracts through `lib/` or a small `types/` module.  
- Prefer fixing lint warnings to disabling them; document any necessary exemptions inline.

## Testing Guidelines
- No runner ships yet; when adding coverage, install Vitest + React Testing Library and store specs under `src/__tests__/` or as colocated `*.test.tsx`.  
- Name tests after the feature (e.g., `qr-form.test.tsx`) and cover payload validation, QR rendering failures, download flows, and toast behavior.  
- Manual QA should confirm the QR preview, download action, error surfaces, and theme switching in both `dev` and `preview`.

## Commit & Pull Request Guidelines
- History uses short imperative summaries (`first commit`); continue with commands like `Add download controls`.  
- Keep each commit focused, referencing impacted directories or scripts in the body when helpful.  
- Pull requests must describe user impact, link issues, attach `npm run build` or lint output, provide screenshots/GIFs for UI updates, and call out new dependencies or environment requirements.
