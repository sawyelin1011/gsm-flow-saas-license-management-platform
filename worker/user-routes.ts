import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity, SupportTicketEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { MOCK_USERS } from "@shared/mock-data";
import type { SupportTicketCategory } from "@shared/types";
// In-memory cache for license validations (simple Map)
// In a real Worker, this lives for the life of the isolate.
const licenseCache = new Map<string, { result: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // USER PROFILE
  app.get('/api/me', async (c) => {
    const userId = 'admin-demo';
    const user = new UserEntity(c.env, userId);
    if (!await user.exists()) {
      await UserEntity.ensureSeed(c.env);
    }
    return ok(c, await user.getProfile(c.env));
  });
  // TENANTS
  app.get('/api/tenants', async (c) => {
    await TenantEntity.ensureSeed(c.env);
    const userId = 'admin-demo';
    const page = await TenantEntity.list(c.env);
    const userTenants = page.items.filter(t => t.ownerId === userId);
    return ok(c, { items: userTenants, next: page.next });
  });
  app.post('/api/tenants', async (c) => {
    const { name, domain } = (await c.req.json()) as { name?: string; domain?: string };
    if (!name?.trim() || !domain?.trim()) return bad(c, 'name and domain required');
    const userId = 'admin-demo';
    const tenant = await TenantEntity.createForUser(c.env, {
      name: name.trim(),
      domain: domain.trim(),
      ownerId: userId
    });
    return ok(c, tenant);
  });
  // SUPPORT TICKETS
  app.get('/api/support', async (c) => {
    const userId = 'admin-demo';
    const tickets = await SupportTicketEntity.getTicketsByUser(c.env, userId);
    return ok(c, tickets);
  });
  app.post('/api/support', async (c) => {
    const { subject, message, category } = (await c.req.json()) as { 
      subject?: string; 
      message?: string; 
      category?: SupportTicketCategory 
    };
    if (!subject?.trim() || !message?.trim()) return bad(c, 'subject and message required');
    const userId = 'admin-demo';
    const ticket = await SupportTicketEntity.create(c.env, {
      id: crypto.randomUUID(),
      userId,
      subject: subject.trim(),
      message: message.trim(),
      category: category || 'technical',
      status: 'open',
      createdAt: Date.now()
    });
    return ok(c, ticket);
  });
  // PUBLIC LICENSE VALIDATION (With Caching)
  app.post('/api/validate-license', async (c) => {
    const { key, domain } = (await c.req.json()) as { key?: string; domain?: string };
    if (!key || !domain) return bad(c, 'key and domain required');
    const cacheKey = `${key}:${domain}`;
    const cached = licenseCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return ok(c, cached.result);
    }
    const page = await TenantEntity.list(c.env);
    const tenant = page.items.find(t => t.licenseKey === key);
    if (!tenant) {
      const result = { valid: false, message: 'Invalid license key' };
      licenseCache.set(cacheKey, { result, expires: Date.now() + CACHE_TTL });
      return ok(c, result);
    }
    const inst = new TenantEntity(c.env, tenant.id);
    const isValid = await inst.validate(domain);
    const result = {
      valid: isValid,
      tenant: isValid ? {
        name: tenant.name,
        domain: tenant.domain,
        status: tenant.status
      } : undefined,
      message: isValid ? 'License valid' : 'Domain mismatch or license suspended'
    };
    licenseCache.set(cacheKey, { result, expires: Date.now() + CACHE_TTL });
    return ok(c, result);
  });
  app.delete('/api/tenants/:id', async (c) => ok(c, {
    id: c.req.param('id'),
    deleted: await TenantEntity.delete(c.env, c.req.param('id'))
  }));
  // ADMIN ROUTES
  const adminMiddleware = async (c: any, next: any) => {
    const userId = 'admin-demo'; 
    if (userId !== 'admin-demo') return bad(c, 'unauthorized');
    await next();
  };
  app.get('/api/admin/stats', adminMiddleware, async (c) => {
    const users = await UserEntity.list(c.env);
    const tenants = await TenantEntity.list(c.env);
    return ok(c, {
      userCount: users.items.length,
      tenantCount: tenants.items.length,
      revenue: users.items.length * 149,
      trafficTrend: 'up'
    });
  });
  app.get('/api/admin/tickets', adminMiddleware, async (c) => {
    const tickets = await SupportTicketEntity.list(c.env);
    return ok(c, tickets.items);
  });
  app.get('/api/admin/users', adminMiddleware, async (c) => {
    const list = await UserEntity.list(c.env);
    return ok(c, list.items);
  });
  app.get('/api/admin/tenants', adminMiddleware, async (c) => {
    const list = await TenantEntity.list(c.env);
    return ok(c, list);
  });
  app.post('/api/admin/users/:id/plan', adminMiddleware, async (c) => {
    const userId = c.req.param('id');
    const { planId } = await c.req.json() as { planId: string };
    const user = new UserEntity(c.env, userId);
    if (!await user.exists()) return notFound(c, 'user not found');
    await user.patch({ planId });
    return ok(c, { success: true });
  });
}