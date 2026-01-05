# GSM Flow: Fullstack Architecture Guide
A technical overview of the "SaaS-Engine-in-a-Box" architecture powered by Cloudflare.
## 1. Backend Architecture (Cloudflare Workers)
### API Layer: Hono.js
The server entry point is at `worker/index.ts`. We use **Hono** for its lightweight footprint and excellent TypeScript support.
- **User Routes**: Custom business logic resides in `worker/user-routes.ts`.
- **Core Utils**: High-performance abstractions for storage are in `worker/core-utils.ts` (Managed).
### Persistence: Durable Objects (DO)
We utilize a single `GlobalDurableObject` binding to handle stateful operations across multiple entities.
- **IndexedEntity**: A base class that provides automatic indexing for list operations.
- **CAS (Compare-And-Swap)**: All mutations use a versioned CAS mechanism to prevent race conditions during concurrent updates.
## 2. Frontend Architecture (React 18)
### State Management
- **Server State**: Managed via `@tanstack/react-query` for robust caching and loading states.
- **Client State**: Minimal local state using `useState` or lightweight `Zustand` stores (where required).
### Data Flow
The `api` client in `src/lib/api-client.ts` ensures all requests return a typed `ApiResponse<T>`.
```ts
const data = await api<UserProfile>('/api/me');
```
## 3. Data Entities
Entities are defined in `worker/entities.ts`. Each entity (User, Item, Ticket) inherits from `IndexedEntity`.
- **Seed Data**: Automated seeding is available via `ensureSeed(env)` to populate the UI for new developers.
## 4. Development & Deployment
### Commands
- `dev`: Start Vite dev server for frontend and local worker simulation.
- `build`: Production bundle generation.
- `deploy`: Push to Cloudflare via Wrangler.
### Folder Structure
- `/shared`: Cross-environment TypeScript types.
- `/src`: Frontend React application.
- `/worker`: Backend Hono + Durable Object logic.
## 5. Security Protocols
- **License Validation**: The `/api/validate-license` endpoint provides a cryptographic check for external node authorizations.
- **API Hardening**: CORS is restricted to authorized origins in production; logger middleware monitors all ingress signals.