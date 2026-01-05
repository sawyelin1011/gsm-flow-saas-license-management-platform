# Cloudflare Workers SaaS Template

[![[cloudflarebutton]]](https://workers.cloudflare.com)

A production-ready full-stack SaaS starter template powered by Cloudflare Workers. Features a stateful backend using Durable Objects for entities like Users and ChatBoards, paired with a modern React frontend using shadcn/ui, TailwindCSS, TanStack Query, and TypeScript.

This template demonstrates a chat application with indexed entity listing, pagination, CRUD operations, and nested messaging—all running on Cloudflare's edge network with zero server management.

## ✨ Key Features

- **Stateful Backend**: Single `GlobalDurableObject` for efficient multi-entity storage (Users, Chats) with optimistic concurrency control (CAS).
- **Indexed Listing**: Automatic prefix-based indexes for paginated queries without external databases.
- **Real-time Chat**: Per-chat Durable Object storage for messages with transactional mutations.
- **Modern Frontend**: React 18 + Vite, shadcn/ui components, dark mode, responsive sidebar layout, error boundaries.
- **Type-Safe API**: Shared types between frontend/backend, Hono routing with CORS and error handling.
- **Production-Ready**: TypeScript everywhere, TailwindCSS with custom design tokens, TanStack Query for data fetching/mutations.
- **Edge Deployment**: Zero-config deployment to Cloudflare Workers with Workers Assets for SPA hosting.
- **Developer Experience**: Hot reload, linting, type generation, and one-command deployment.

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Hono, Durable Objects, TypeScript |
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, React Router, Zustand, Framer Motion |
| **UI/UX** | Lucide Icons, Sonner Toasts, Headless UI, Radix Primitives |
| **Dev Tools** | Bun, ESLint, Wrangler, Vitest (ready for tests) |
| **Deployment** | Cloudflare Workers & Pages (SPA + API) |

## 🚀 Quick Start

1. **Prerequisites**:
   - [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`)
   - [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler@latest init`)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   bun install
   ```

3. **Login to Cloudflare**:
   ```bash
   bunx wrangler@latest login
   ```

4. **Development**:
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (frontend) with API at `/api/*`.

5. **Type Generation** (Workers types):
   ```bash
   bun run cf-typegen
   ```

## 💻 Development Workflow

- **Frontend HMR**: `bun run dev` – Auto-reloads on src/ changes.
- **Backend Routes**: Add to `worker/user-routes.ts` (auto-loaded, hot-reload in dev).
- **New Entities**: Extend `IndexedEntity` in `worker/entities.ts` – auto-indexing & seeding included.
- **Custom Styling**: Edit `tailwind.config.js` & `src/index.css`.
- **Linting**: `bun run lint`.
- **Preview Build**: `bun run preview`.
- **Seed Data**: Mock users/chats/messages load on first API call.

### API Examples

```bash
# List users (paginated)
curl "http://localhost:8787/api/users?limit=10"

# Create user
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'

# List chats
curl "http://localhost:8787/api/chats"

# Send message to chat
curl -X POST http://localhost:8787/api/chats/c1/messages \
  -H "Content-Type: application/json" \
  -d '{"userId": "u1", "text": "Hello!"}'
```

Frontend uses `api()` helper in `src/lib/api-client.ts` for type-safe fetches.

## 🌐 Deployment

1. **Build & Deploy**:
   ```bash
   bun run deploy
   ```
   Deploys Worker + static assets to your Cloudflare account.

2. **Configure Custom Domain** (optional):
   ```bash
   bunx wrangler@latest deploy --var CLOUDFLARE_API_TOKEN:your-token
   ```

3. **One-Click Deploy**:
   [![[cloudflarebutton]]](https://workers.cloudflare.com)

**Note**: Ensure `wrangler.jsonc` has your account ID if needed. Durable Objects use SQLite storage (auto-migrates).

## 📚 Project Structure

```
├── src/              # React frontend (Vite)
├── worker/           # Cloudflare Worker API (Hono + DOs)
├── shared/           # Shared types & mocks
├── tailwind.config.js # Design system
└── wrangler.jsonc    # Deployment config
```

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. Make changes in `src/` or `worker/user-routes.ts`.
4. Test with `bun run dev`.
5. PR to `main`.

## 🔒 License

MIT. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- Questions? Open an issue.

Built with ❤️ for the Cloudflare ecosystem.