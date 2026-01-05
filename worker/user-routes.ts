import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity, SupportTicketEntity, InvoiceEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { MOCK_PLANS } from "@shared/mock-data";
import type { SupportTicketCategory, TenantStatus } from "@shared/types";
const licenseCache = new Map<string, { result: any; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const userId = 'admin-demo'; // Shared mock user context
  // USER PROFILE
  app.get('/api/me', async (c) => {
    const user = new UserEntity(c.env, userId);
    if (!await user.exists()) {
      await UserEntity.ensureSeed(c.env);
    }
    return ok(c, await user.getProfile(c.env));
  });
  // BILLING
  app.get('/api/billing/invoices', async (c) => {
    const invoices = await InvoiceEntity.getInvoicesByUser(c.env, userId);
    return ok(c, invoices);
  });
  app.post('/api/billing/upgrade', async (c) => {
    const { planId } = (await c.req.json()) as { planId: string };
    const plan = MOCK_PLANS.find(p => p.id === planId);
    if (!plan) return bad(c, 'Invalid plan');
    const user = new UserEntity(c.env, userId);
    await user.patch({ planId });
    // Generate mock invoice
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
  });
  // TENANTS
  app.get('/api/tenants', async (c) => {
    await TenantEntity.ensureSeed(c.env);
    const page = await TenantEntity.list(c.env);
    const userTenants = page.items.filter(t => t.ownerId === userId);
    return ok(c, { items: userTenants, next: page.next });
  });
  app.post('/api/tenants', async (c) => {
    const { name, domain } = (await c.req.json()) as { name?: string; domain?: string };
    if (!name?.trim() || !domain?.trim()) return bad(c, 'name and domain required');
    const tenant = await TenantEntity.createForUser(c.env, {
      name: name.trim(),
      domain: domain.trim(),
      ownerId: userId
    });
    return ok(c, tenant);
  });
  app.patch('/api/tenants/:id/status', async (c) => {
    const id = c.req.param('id');
    const inst = new TenantEntity(c.env, id);
    if (!await inst.exists()) return notFound(c);
    const updated = await inst.toggleStatus();
    return ok(c, updated);
  });
  app.delete('/api/tenants/:id', async (c) => ok(c, {
    id: c.req.param('id'),
    deleted: await TenantEntity.delete(c.env, c.req.param('id'))
  }));
  // SUPPORT
  app.get('/api/support', async (c) => {
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
  // DATA EXPORT
  app.get('/api/export', async (c) => {
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
  });
  // PUBLIC LICENSE VALIDATION
  app.post('/api/validate-license', async (c) => {
    const { key, domain } = (await c.req.json()) as { key?: string; domain?: string };
    if (!key || !domain) return bad(c, 'key and domain required');
    const cacheKey = `${key}:${domain}`;
    const cached = licenseCache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return ok(c, cached.result);
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
      tenant: isValid ? { name: tenant.name, domain: tenant.domain, status: tenant.status } : undefined,
      message: isValid ? 'License valid' : 'Domain mismatch or license suspended'
    };
    licenseCache.set(cacheKey, { result, expires: Date.now() + CACHE_TTL });
    return ok(c, result);
  });
  // ADMIN
  app.get('/api/admin/stats', async (c) => {
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
  });
  app.get('/api/admin/users', async (c) => ok(c, (await UserEntity.list(c.env)).items));
  app.get('/api/admin/tenants', async (c) => ok(c, await TenantEntity.list(c.env)));
}