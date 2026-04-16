# Cryptopedia – Hong Kong Crypto Research Hub

An HK‑centric crypto encyclopedia for prices, context, and learning — built with Next.js and TypeScript.

## Overview

Cryptopedia (Crypto通) is a Hong Kong–focused crypto information hub for retail users and beginners who want a clean way to explore market data, understand assets, and follow relevant local developments.

The app provides a live market overview, asset pages, “new coins” discovery, exchange/wallet comparison, Hong Kong‑centric news, and structured educational guides. It’s designed to be approachable, while still offering data‑driven pages that experienced users can use as a starting point for deeper research.

This project is **information and education only**: no private keys, no trading execution, and no custody.

## Features

- **Live market overview**: prices, % changes, volume, market cap, sortable tables, responsive UI
- **Asset detail pages**: per‑asset pages with charts and key stats
- **Charts**: interactive chart views with common timeframes and indicators (where available)
- **New coins discovery**: newly listed / trending assets pages for exploration
- **Exchanges & wallets**: comparison pages and filters for common selection criteria
- **Hong Kong news focus**: HK‑relevant regulatory / market updates surfaced in a dedicated section
- **Educational guides**: structured guides covering basics → advanced concepts
- **Watchlist**: quick tracking for selected assets (local persistence)
- **Auth (coming soon)**: placeholder flows/pages for future sign‑in (e.g., Google)
- **Ad‑friendly layout**: sponsor placements/slots designed to be non‑intrusive and clearly labeled

## Tech stack

- **Framework**: Next.js (App Router), React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data source**: CoinGecko API (with an internal caching layer)
- **Deployment**: AWS Lightsail (single instance today; designed to scale later)
- **Analytics/monitoring (optional placeholders)**: Google Analytics / Plausible / Sentry (IDs/config via env)

## Getting started (local development)

### Prerequisites

- **Node.js**: 18+ (recommended: latest LTS)
- **Package manager**: npm (or pnpm/yarn — pick one and be consistent)

### Setup

1) Clone:

```bash
git clone <your-repo-url>
cd crypto-info
```

2) Install dependencies:

```bash
npm install
```

3) Configure environment variables:

```bash
cp .env.local.example .env.local 2>/dev/null || true
# Or create .env.local manually if you need to override defaults
```

4) Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build (local)

```bash
npm run build
npm run start
```

## Architecture

### Project Structure

The codebase follows a clear, scalable structure:

```
app/                    # Next.js App Router routes (pages only)
  api/                  # API route handlers
  [routes]/            # Page components
src/
  components/
    layout/            # PageShell, Navbar, Footer, AuthSheet
    market/            # MarketTable, CryptoRow, ExchangeCard, WalletCard, etc.
    assets/            # AssetDetailClient, AssetSelector, PriceChart
    charts/            # TradingChart, TimeframeSelector
    ads/               # SidebarSponsoredCard, SponsoredPlacementNotice
    common/            # Shared UI: Button, Card, Badge, SectionHeader, LoadingSkeleton
  lib/
    api/               # coingecko.ts, binance.ts
    cache/             # Cache helpers (index.ts)
    formatting/        # Number/price/percent/date formatting utilities
    constants/         # Navigation config, routes, brand colors
  hooks/               # usePricesPolling, useToast
  types/               # TypeScript type definitions (market, asset, chart, etc.)
```

### Key Design Decisions

- **Separation of concerns**: Routes (`app/`) are separate from business logic (`src/lib/`) and UI components (`src/components/`)
- **Centralized API layer**: All external API calls (CoinGecko, Binance) are abstracted in `src/lib/api/`
- **Unified caching**: Single cache helper (`src/lib/cache/`) used across the application
- **Shared UI components**: Common UI patterns (buttons, cards, badges) are centralized in `src/components/common/`
- **Type safety**: All types are defined in `src/types/` and imported consistently

### Data Flow

1. **Server-side**: Pages fetch initial data using API helpers from `src/lib/api/`
2. **Caching**: All API responses are cached with TTL via `src/lib/cache/`
3. **Client-side**: Components use hooks (`usePricesPolling`) for real-time updates
4. **Formatting**: All display formatting is handled by utilities in `src/lib/formatting/`

### Deployment (AWS Lightsail)

The app is deployed as a standard Next.js Node process on a Lightsail instance. Today it runs as a single instance; the code is structured to allow later scaling (e.g., external cache, CDN, multiple instances behind a load balancer).

## Development & coding conventions

- **TypeScript-first**: prefer explicit types for public functions and shared data structures.
- **Linting/formatting**: run lint before opening a PR.

```bash
npm run lint
```

- **Commits/PRs**: use a conventional prefix to keep history readable:
  - `feat:` new user-facing functionality
  - `fix:` bug fixes
  - `refactor:` non-functional changes
  - `chore:` tooling/deps
  - `docs:` documentation

- **Tests**: if/when a test runner is configured, add and run tests for non-trivial logic changes.

## Roadmap / planned improvements

- **Real authentication** (replace placeholders) and synced user settings
- **Richer watchlist/portfolio** (still non-custodial; user-owned data only)
- **Deeper HK regulatory coverage** (more sources, better tagging, timelines)
- **More localization** (broader Chinese coverage and improved terminology consistency)
- **Performance & caching** (stronger cache invalidation, edge/CDN strategy, better rate-limit handling)

## Disclaimer

Cryptopedia / Crypto通 is provided **for informational and educational purposes only**. It does not constitute investment advice, financial advice, trading advice, or any other kind of professional advice. You are solely responsible for your investment decisions and should do your own research (DYOR).

## License
License: **TBA**.
