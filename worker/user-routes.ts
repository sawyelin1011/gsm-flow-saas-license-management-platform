import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity, SupportTicketEntity, InvoiceEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MOCK_PLANS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const userId = 'admin-demo';
  app.get('/api/health', (c) => ok(c, { status: 'healthy', timestamp: Date.now(), message: 'GSM Flow API operational' }));
  // Profile
  app.get('/api/me', async (c) => {
    const user = new UserEntity(c.env, userId);
    if (!await user.exists()) await UserEntity.ensureSeed(c.env);
    return ok(c, await user.getProfile(c.env));
  });
  // Tenants & Licensing
  app.get('/api/tenants', async (c) => {
    const page = await TenantEntity.list(c.env);
    const userTenants = (page.items || []).filter(t => t.ownerId === userId);
    return ok(c, { items: userTenants, next: page.next });
  });
  app.post('/api/tenants', async (c) => {
    try {
      const { name, domain } = await c.req.json();
      if (!name || name.length < 2) return bad(c, 'Identifier too short');
      if (!domain || !domain.includes('.')) return bad(c, 'Valid FQDN domain required');
      const user = new UserEntity(c.env, userId);
      const profile = await user.getProfile(c.env);
      if (profile.tenantCount >= profile.plan.tenantLimit) {
        return bad(c, `Registry capacity reached (${profile.plan.tenantLimit} nodes max)`);
      }
      const tenant = await TenantEntity.createForUser(c.env, { name, domain, ownerId: userId });
      return ok(c, tenant);
    } catch (e) {
      return bad(c, 'Failed to provision tenant');
    }
  });
  app.delete('/api/tenants/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await TenantEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // License Validation Gateway (Public-facing simulation)
  app.post('/api/validate-license', async (c) => {
    try {
      const { key, domain } = await c.req.json();
      if (!key || !domain) return bad(c, 'Key and Domain target are required for signal verification');
      const tenantsPage = await TenantEntity.list(c.env);
      const tenant = tenantsPage.items.find(t => t.license.key === key);
      if (!tenant) return ok(c, { valid: false, reason: 'Registry Mismatch: License key not found', timestamp: Date.now() });
      if (tenant.status !== 'active') return ok(c, { valid: false, reason: `Status Exception: License is currently ${tenant.status}`, timestamp: Date.now() });
      const normalizedTarget = domain.toLowerCase().trim();
      const normalizedBound = tenant.domain.toLowerCase().trim();
      if (normalizedTarget !== normalizedBound) {
        return ok(c, { valid: false, reason: 'Authority Mismatch: Node not authorized for this domain target', timestamp: Date.now() });
      }
      return ok(c, {
        valid: true,
        details: { id: tenant.id, name: tenant.name, status: tenant.status, authorizedAt: tenant.createdAt, domain: tenant.domain },
        timestamp: Date.now()
      });
    } catch (e) {
      return bad(c, 'Authority node internal error');
    }
  });
  // Support
  app.get('/api/support', async (c) => {
    const tickets = await SupportTicketEntity.getTicketsByUser(c.env, userId);
    return ok(c, tickets);
  });
  app.post('/api/support', async (c) => {
    const { subject, message, category } = await c.req.json();
    const ticket = await SupportTicketEntity.create(c.env, {
      id: crypto.randomUUID(),
      userId,
      subject,
      message,
      status: 'open',
      category,
      createdAt: Date.now()
    });
    return ok(c, ticket);
  });
  // Billing
  app.get('/api/billing/invoices', async (c) => {
    const invoices = await InvoiceEntity.getInvoicesByUser(c.env, userId);
    return ok(c, invoices);
  });
  // Admin Oversight
  app.get('/api/admin/stats', async (c) => {
    const users = await UserEntity.list(c.env);
    const tenants = await TenantEntity.list(c.env);
    const invoices = await InvoiceEntity.list(c.env);
    const revenue = (invoices.items || []).reduce((acc, inv) => acc + inv.amount, 0);
    return ok(c, {
      operatorCount: users.items.length,
      tenantCount: tenants.items.length,
      revenue,
      health: 'Nominal'
    });
  });
  app.get('/api/admin/users', async (c) => {
    const users = await UserEntity.list(c.env);
    return ok(c, users.items);
  });
  app.post('/api/admin/users/:id/plan', async (c) => {
    const id = c.req.param('id');
    const { planId } = await c.req.json();
    const user = new UserEntity(c.env, id);
    if (!await user.exists()) return notFound(c, 'Operator not found');
    await user.patch({ planId });
    return ok(c, { success: true });
  });
  app.get('/api/admin/tenants', async (c) => {
    const tenants = await TenantEntity.list(c.env);
    return ok(c, tenants);
  });
}