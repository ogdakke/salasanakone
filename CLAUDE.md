# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Salasanakone is a Finnish/English passphrase generator web application. It generates secure passphrases using Finnish/English words or random characters. Live at [salasanakone.com](https://salasanakone.com).

## Commands

```bash
pnpm install              # Install dependencies
pnpm run dev              # Development server with HMR
pnpm run build            # Production build
pnpm run test             # Run tests (Vitest)
pnpm run test:coverage    # Tests with coverage
pnpm run lint             # Run all linters (Biome + TypeScript)
pnpm run lint:type-check  # TypeScript type checking only
pnpm run format:write     # Format code with Biome
pnpm run lint-fix-unsafe  # Auto-fix lint issues
```

## Architecture

### State Management

- **FormContext** (`src/Components/FormContext.tsx`) - Form state with `usePersistedReducer` for localStorage sync
- **ResultContext** (`src/common/providers/`) - Password output state
- Reducer pattern in `src/services/reducers/`

### Core Services

- **Password Generation** (`src/services/createCrypto.ts`) - Main `createPassphrase()` function
- **Password Strength** (`src/services/zxcvbn.worker.ts`) - Web Worker using @zxcvbn-ts for strength analysis
- **Database** (`src/services/database/`) - IndexedDB utilities for language datasets

### Key Components

- `src/Components/form.tsx` - Main form (lazy-loaded)
- `src/Components/result.tsx` - Password display
- `src/Components/island.tsx` / `fullIsland.tsx` - Strength visualization
- `src/Components/ui/` - Radix UI primitives (checkbox, slider, popover, etc.)

### Configuration

- Form validation: `src/config/form-config/`
- Password rules: `src/config/crypto-config/`
- Type definitions: `src/models/`

### Path Aliases

```
@/*        → ./src/*
@config/*  → ./config/*
```

## Tech Stack

- **Build**: Vite + pnpm (not npm/yarn)
- **Framework**: React 18 with TypeScript (strict mode)
- **UI**: Radix UI components, Framer Motion animations, Iconoir icons
- **Linting**: Biome (not ESLint)
- **Testing**: Vitest with jsdom
- **PWA**: vite-plugin-pwa with Workbox

## Code Style

Biome config: 2-space indent, 100 char line width, double quotes, semicolons as needed, CRLF line endings.
