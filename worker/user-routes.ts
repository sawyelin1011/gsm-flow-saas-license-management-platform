import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity, SupportTicketEntity, InvoiceEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
const MOCK_PLANS = [
  {id: 'basic', name: 'Node Starter', price: 29, tenantLimit: 1},
  {id: 'pro', name: 'Cluster Pro', price: 89, tenantLimit: 10},
  {id: 'enterprise', name: 'Carrier Enterprise', price: 299, tenantLimit: 100}
];
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const userId = 'admin-demo';
  app.get('/api/health', (c) => ok(c, { status: 'healthy', timestamp: Date.now(), message: 'GSM Flow API operational' }));
  app.post('/api/validate-license', async (c) => {
    try {
      const { key, domain } = await c.req.json();
      if (!key || !domain) return bad(c, 'License key and domain target are required');
      const tenantsPage = await TenantEntity.list(c.env);
      const tenant = tenantsPage.items.find(t => t.license.key === key);
      if (!tenant) {
        return ok(c, { valid: false, reason: 'License key not found in registry', timestamp: Date.now() });
      }
      if (tenant.status !== 'active') {
        return ok(c, { valid: false, reason: `License status is ${tenant.status}`, timestamp: Date.now() });
      }
      const normalizedTarget = domain.toLowerCase().trim();
      const normalizedBound = tenant.domain.toLowerCase().trim();
      if (normalizedTarget !== normalizedBound) {
        return ok(c, { valid: false, reason: 'Domain mismatch: Node not authorized for this target', timestamp: Date.now() });
      }
      return ok(c, {
        valid: true,
        details: {
          id: tenant.id,
          name: tenant.name,
          status: tenant.status,
          authorizedAt: tenant.createdAt,
          domain: tenant.domain
        },
        timestamp: Date.now()
      });
    } catch (e) {
      return bad(c, 'Authority node internal error');
    }
  });
  app.get('/api/me', async (c) => {
    const user = new UserEntity(c.env, userId);
    if (!await user.exists()) await UserEntity.ensureSeed(c.env);
    return ok(c, await user.getProfile(c.env));
  });
  app.get('/api/tenants', async (c) => {
    const page = await TenantEntity.list(c.env);
    const userTenants = (page.items || []).filter(t => t.ownerId === userId);
    return ok(c, { items: userTenants, next: page.next });
  });
  app.post('/api/tenants', async (c) => {
    try {
      const { name, domain } = await c.req.json();
      if (!name || name.length < 2) return bad(c, 'Name too short');
      if (!domain || !domain.includes('.')) return bad(c, 'Invalid domain format');
      const user = new UserEntity(c.env, userId);
      const profile = await user.getProfile(c.env);
      if (profile.tenantCount >= profile.plan.tenantLimit) {
        return bad(c, 'Tenant limit reached for current plan');
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
  app.get('/api/admin/stats', async (c) => {
    const users = await UserEntity.list(c.env);
    const tenants = await TenantEntity.list(c.env);
    const invoices = await InvoiceEntity.list(c.env);
    const rev = (invoices.items || []).reduce((acc, inv) => acc + inv.amount, 0);
    return ok(c, {
      operatorCount: users.items.length,
      tenantCount: tenants.items.length,
      revenue: rev,
      health: 'Operational'
    });
  });
  app.get('/api/admin/tenants', async (c) => {
    const tenants = await TenantEntity.list(c.env);
    return ok(c, tenants);
  });
}