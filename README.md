# Anesis Web

`anesis-web` is the Next.js frontend for the Anesis platform. It provides:

- the public marketing site
- documentation pages
- the template registry
- account pages for authenticated users
- an admin area for platform management
- CLI auth callback screens

The app talks to `anesis-server` for auth, user data, and template data.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Query
- Radix UI / shadcn-style primitives

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env .env.local
```

Current local API target:

```env
NEXT_PUBLIC_API_URL=/api/backend
API_PROXY_URL=http://localhost:4000
```

`NEXT_PUBLIC_API_URL` points browser requests at the frontend proxy, while
`API_PROXY_URL` tells Next.js where to rewrite `/api/backend/*` requests. This
matches the local server callback URL
`http://localhost:3000/api/backend/auth/callback`.

For production deployments where the browser app and API live on different
sites, route browser API traffic through the frontend origin so Safari can keep
the `httpOnly` auth cookie in a first-party context:

```env
NEXT_PUBLIC_API_URL=/api/backend
API_PROXY_URL=https://anesis-server.onrender.com
```

`API_PROXY_URL` is used by `next.config.ts` to rewrite `/api/backend/*` to the
server. The server's `WEB_CALLBACK_URL` must point at the same rewritten
callback path, for example
`https://anesis-cli.vercel.app/api/backend/auth/callback`.

3. Start the frontend:

```bash
npm run dev
```

If you need the legacy webpack dev server for comparison or debugging, run:

```bash
npm run dev:webpack
```

4. Open:

```text
http://localhost:3000
```

To get full functionality, run `anesis-server` locally on port `4000`.

## Scripts

```bash
npm run dev
npm run dev:webpack
npm run build
npm run start
npm run typecheck
npm run test
```

## App Areas

- `/` landing page with featured templates and product overview
- `/docs` documentation hub with installation, CLI, templates, and reference pages
- `/templates` public template registry with filters and pagination
- `/user/[login]` public user profile page
- `/account` authenticated account area
- `/admin` admin dashboard, templates, and users
- `/cli/success` and `/cli/error` callback result screens for CLI auth flow

## Project Structure

```text
src/
  app/          route segments and page layouts
  api/          shared API client
  components/   UI, docs, admin, templates, header/footer
  config/       environment helpers
  constants/    navigation and static config
  hooks/        React Query hooks and view hooks
  lib/          parsing and URL validation helpers
  providers/    React Query and theme providers
  services/     API-facing service functions
  types/        shared TypeScript types
```

## Data Flow

- `src/api/client.ts` centralizes fetch logic and API error handling
- `src/services/*` defines API-specific operations
- `src/hooks/*` wraps services with React Query
- `src/lib/api-contracts.ts` validates and normalizes API responses

## Notes

- GitHub login/logout depends on `anesis-server`.
- Admin moderation UI is present, but some destructive admin actions still require backend mutation endpoints.
- `npm run dev` uses Turbopack by default. `npm run dev:webpack` remains available as a fallback if you need to compare dev-server behavior.
