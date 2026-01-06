import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity, SupportTicketEntity, InvoiceEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MOCK_PLANS } from "@shared/mock-data";
import type { SupportTicketCategory } from "@shared/types";
const DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
const licenseCache = new Map<string, { result: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const userId = 'admin-demo';
  // USER PROFILE
  app.get('/api/me', async (c) => {
    try {
      const user = new UserEntity(c.env, userId);
      if (!await user.exists()) {
        await UserEntity.ensureSeed(c.env);
      }
      return ok(c, await user.getProfile(c.env));
    } catch (e) {
      console.error('[API] Profile Error:', e);
      return bad(c, 'Failed to retrieve profile data');
    }
  });
  // BILLING
  app.get('/api/billing/invoices', async (c) => {
    try {
      const invoices = await InvoiceEntity.getInvoicesByUser(c.env, userId);
      return ok(c, invoices);
    } catch (e) {
      return ok(c, []);
    }
  });
  app.post('/api/billing/upgrade', async (c) => {
    try {
      const { planId } = (await c.req.json()) as { planId: string };
      const plan = MOCK_PLANS.find(p => p.id === planId);
      if (!plan) return bad(c, 'Requested plan does not exist');
      const user = new UserEntity(c.env, userId);
      const profile = await user.getProfile(c.env);
      if (profile.tenantCount > plan.tenantLimit) {
        return bad(c, `Cannot migrate to ${plan.name}. Existing nodes (${profile.tenantCount}) exceed new plan limit (${plan.tenantLimit}).`);
      }
      await user.patch({ planId });
      await InvoiceEntity.create(c.env, {
        id: crypto.randomUUID(),
        userId,
        amount: plan.price,
        date: Date.now(),
        status: 'paid',
        planName: plan.name,
        currency: 'USD'
      });
      return ok(c, await user.getProfile(c.env));
    } catch (e) {
      return bad(c, 'System error during plan transition');
    }
  });
  // TENANTS
  app.get('/api/tenants', async (c) => {
    try {
      await TenantEntity.ensureSeed(c.env);
      const page = await TenantEntity.list(c.env);
      const userTenants = page.items.filter(t => t.ownerId === userId);
      return ok(c, { items: userTenants, next: page.next });
    } catch (e) {
      return bad(c, 'Failed to fetch node list');
    }
  });
  app.post('/api/tenants', async (c) => {
    try {
      const { name, domain } = (await c.req.json()) as { name?: string; domain?: string };
      if (!name || name.trim().length < 3) return bad(c, 'Node identifier must be at least 3 characters');
      if (!domain || !DOMAIN_REGEX.test(domain.trim())) return bad(c, 'Valid FQDN is required (e.g., node.service.com)');
      const user = new UserEntity(c.env, userId);
      const profile = await user.getProfile(c.env);
      if (profile.tenantCount >= profile.plan.tenantLimit) {
        return bad(c, `Plan limit reached. Upgrade required for additional nodes.`);
      }
      const tenant = await TenantEntity.createForUser(c.env, {
        name: name.trim(),
        domain: domain.trim(),
        ownerId: userId
      });
      return ok(c, tenant);
    } catch (e) {
      return bad(c, 'Failed to provision new node');
    }
  });
  app.patch('/api/tenants/:id/status', async (c) => {
    try {
      const id = c.req.param('id');
      const inst = new TenantEntity(c.env, id);
      if (!await inst.exists()) return notFound(c, 'Node not found');
      const updated = await inst.toggleStatus();
      return ok(c, updated);
    } catch (e) {
      return bad(c, 'Conflict detected during status transition');
    }
  });
  app.delete('/api/tenants/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const deleted = await TenantEntity.delete(c.env, id);
      return ok(c, { id, deleted });
    } catch (e) {
      return bad(c, 'Failed to purge node data');
    }
  });
  // SUPPORT
  app.get('/api/support', async (c) => {
    try {
      const tickets = await SupportTicketEntity.getTicketsByUser(c.env, userId);
      return ok(c, tickets);
    } catch (e) {
      return ok(c, []);
    }
  });
  app.post('/api/support', async (c) => {
    try {
      const { subject, message, category } = (await c.req.json()) as {
        subject?: string;
        message?: string;
        category?: SupportTicketCategory
      };
      if (!subject || subject.trim().length < 5) return bad(c, 'Subject is too short');
      if (!message || message.trim().length < 20) return bad(c, 'Details are too short');
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
    } catch (e) {
      return bad(c, 'Failed to submit support request');
    }
  });
  // PUBLIC LICENSE VALIDATION (Cachable Endpoint)
  app.post('/api/validate-license', async (c) => {
    try {
      const { key, domain } = (await c.req.json()) as { key?: string; domain?: string };
      if (!key || !domain) return bad(c, 'Signature and domain are required');
      const cacheKey = `${key}:${domain}`;
      const cached = licenseCache.get(cacheKey);
      if (cached && cached.expires > Date.now()) return ok(c, cached.result);
      const page = await TenantEntity.list(c.env);
      const tenant = page.items.find(t => t.licenseKey === key);
      if (!tenant) {
        const result = { valid: false, message: 'Invalid signature' };
        licenseCache.set(cacheKey, { result, expires: Date.now() + CACHE_TTL });
        return ok(c, result);
      }
      const inst = new TenantEntity(c.env, tenant.id);
      const isValid = await inst.validate(domain);
      const result = {
        valid: isValid,
        tenant: isValid ? { name: tenant.name, domain: tenant.domain, status: tenant.status } : undefined,
        message: isValid ? 'Authorized' : 'Authorization mismatch'
      };
      licenseCache.set(cacheKey, { result, expires: Date.now() + CACHE_TTL });
      return ok(c, result);
    } catch (e) {
      return bad(c, 'Validation engine timeout');
    }
  });
  // ADMIN ENDPOINTS
  app.get('/api/admin/stats', async (c) => {
    try {
      const users = await UserEntity.list(c.env);
      const tenants = await TenantEntity.list(c.env);
      const allInvoices = await InvoiceEntity.list(c.env);
      const totalRev = allInvoices.items.reduce((acc, inv) => acc + inv.amount, 0);
      return ok(c, {
        userCount: users.items.length,
        tenantCount: tenants.items.length,
        revenue: totalRev,
        trafficTrend: 'up'
      });
    } catch (e) {
      return bad(c, 'Admin data fetch failed');
    }
  });
  app.get('/api/admin/users', async (c) => {
    try {
      return ok(c, (await UserEntity.list(c.env)).items);
    } catch (e) {
      return ok(c, []);
    }
  });
  app.get('/api/admin/tenants', async (c) => {
    try {
      return ok(c, await TenantEntity.list(c.env));
    } catch (e) {
      return ok(c, { items: [], next: null });
    }
  });
  app.get('/api/export', async (c) => {
    try {
      const user = new UserEntity(c.env, userId);
      const profile = await user.getProfile(c.env);
      const tenants = (await TenantEntity.list(c.env)).items.filter(t => t.ownerId === userId);
      const tickets = await SupportTicketEntity.getTicketsByUser(c.env, userId);
      const invoices = await InvoiceEntity.getInvoicesByUser(c.env, userId);
      return ok(c, {
        profile,
        tenants,
        tickets,
        invoices,
        exportedAt: Date.now()
      });
    } catch (e) {
      return bad(c, 'Export failed');
    }
  });
}