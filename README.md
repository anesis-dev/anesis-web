# Oxide Web

`oxide-web` is the Next.js frontend for the Oxide platform. It provides:

- the public marketing site
- documentation pages
- the template registry
- account pages for authenticated users
- an admin area for platform management
- CLI auth callback screens

The app talks to `oxide-server` for auth, user data, and template data.

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
NEXT_PUBLIC_API_URL=http://localhost:4000
```

`NEXT_PUBLIC_API_URL` is recommended, but the app also falls back to `http://localhost:4000` in local development if the variable is missing or invalid.

3. Start the frontend:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

To get full functionality, run `oxide-server` locally on port `4000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
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

- GitHub login/logout depends on `oxide-server`.
- Admin moderation UI is present, but some destructive admin actions still require backend mutation endpoints.
- Production builds may require internet access for Google Fonts used by `next/font`.
