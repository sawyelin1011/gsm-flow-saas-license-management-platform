import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity, SupportTicketEntity, InvoiceEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const userId = 'admin-demo';
  app.get('/api/health', (c) => ok(c, { 
    status: 'healthy', 
    timestamp: Date.now(), 
    message: 'GSM Flow Authority Node Operational' 
  }));
  // Profile
  app.get('/api/me', async (c) => {
    const user = new UserEntity(c.env, userId);
    if (!await user.exists()) await UserEntity.ensureSeed(c.env);
    return ok(c, await user.getProfile(c.env));
  });
  // Tenant & License Management
  app.get('/api/tenants', async (c) => {
    const page = await TenantEntity.list(c.env);
    const userTenants = (page.items || []).filter(t => t.ownerId === userId);
    return ok(c, { items: userTenants, next: page.next });
  });
  app.post('/api/tenants', async (c) => {
    try {
      const { name, domain } = await c.req.json();
      if (!name || name.trim().length < 2) return bad(c, 'Tenant identity too short: Minimum 2 characters required');
      if (!domain || !domain.includes('.')) return bad(c, 'Valid service domain required: Domain binding must be a FQDN');
      const normalizedDomain = domain.toLowerCase().trim();
      const allTenants = await TenantEntity.list(c.env);
      const isDuplicate = allTenants.items.some(t => t.domain.toLowerCase() === normalizedDomain);
      if (isDuplicate) return bad(c, `Conflict: Domain ${normalizedDomain} is already provisioned in the authority registry`);
      const user = new UserEntity(c.env, userId);
      const profile = await user.getProfile(c.env);
      if (profile.tenantCount >= profile.plan.tenantLimit) {
        return bad(c, `Authority limit reached: Upgrade your subscription to provision more GSM Tenants`);
      }
      const tenant = await TenantEntity.createForUser(c.env, {
        name: name.trim(),
        domain: normalizedDomain,
        ownerId: userId
      });
      return ok(c, tenant);
    } catch (e) {
      console.error('[Authority API] Provisioning Error:', e);
      return bad(c, 'Authority node failed to provision tenant record: Storage exception');
    }
  });
  app.delete('/api/tenants/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await TenantEntity.delete(c.env, id);
    return ok(c, { id, deleted });
  });
  // Service Authorization Gateway (External)
  app.post('/api/validate-license', async (c) => {
    try {
      const { key, domain } = await c.req.json();
      if (!key || !domain) return bad(c, 'License key and Domain target are required for service authorization');
      const tenantsPage = await TenantEntity.list(c.env);
      const tenant = tenantsPage.items.find(t => t.license.key === key);
      if (!tenant) {
        return ok(c, { 
          valid: false, 
          reason: 'Invalid license key: Record not found in authority database', 
          timestamp: Date.now() 
        });
      }
      if (tenant.status !== 'active') {
        return ok(c, { 
          valid: false, 
          reason: `License suspended: Current authority state is ${tenant.status}`, 
          timestamp: Date.now() 
        });
      }
      const normalizedTarget = domain.toLowerCase().trim();
      const normalizedBound = tenant.domain.toLowerCase().trim();
      if (normalizedTarget !== normalizedBound) {
        return ok(c, {
          valid: false,
          reason: 'Domain mismatch: This license key is strictly bound to a different service domain',
          timestamp: Date.now()
        });
      }
      // Update last validated timestamp (Side effect)
      const inst = new TenantEntity(c.env, tenant.id);
      await inst.patch({ lastValidated: Date.now() });
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
      return bad(c, 'Authority node communication exception: Validation protocol interrupted');
    }
  });
  // Support & Billing
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
  app.get('/api/billing/invoices', async (c) => {
    const invoices = await InvoiceEntity.getInvoicesByUser(c.env, userId);
    return ok(c, invoices);
  });
  // Admin Oversight
  app.get('/api/admin/stats', async (c) => {
    const users = await UserEntity.list(c.env);
    const tenants = await TenantEntity.list(c.env);
    const invoices = await InvoiceEntity.list(c.env);
    // Calculate real revenue from processed invoices
    const revenue = (invoices.items || []).reduce((acc, inv) => {
      return inv.status === 'paid' ? acc + inv.amount : acc;
    }, 0);
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
    if (!await user.exists()) return notFound(c, 'Operator not found in registry');
    await user.patch({ planId });
    return ok(c, { success: true });
  });
  app.get('/api/admin/tenants', async (c) => {
    const tenants = await TenantEntity.list(c.env);
    return ok(c, tenants);
  });
}