import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity, SupportTicketEntity, InvoiceEntity, SessionEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
async function getAuth(c: any): Promise<string | null> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const session = new SessionEntity(c.env, token);
  const state = await session.getState();
  if (!state.userId || state.expiresAt < Date.now()) return null;
  return state.userId;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Auth
  app.post('/api/auth/signup', async (c) => {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) return bad(c, 'Missing fields');
    const allUsers = await UserEntity.list(c.env);
    if (allUsers.items.some(u => u.email === email)) return bad(c, 'Email already exists');
    const id = crypto.randomUUID();
    const passwordHash = await UserEntity.hashPassword(password);
    const user = await UserEntity.create(c.env, { id, email, name, planId: 'launch', passwordHash });
    const token = crypto.randomUUID();
    await SessionEntity.create(c.env, { sessionId: token, userId: id, expiresAt: Date.now() + 86400000 * 7 });
    const profile = await new UserEntity(c.env, id).getProfile(c.env);
    return ok(c, { token, user: profile });
  });
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json();
    const allUsers = await UserEntity.list(c.env);
    const user = allUsers.items.find(u => u.email === email);
    if (!user) return bad(c, 'Invalid credentials');
    const hash = await UserEntity.hashPassword(password);
    if (user.passwordHash !== hash) return bad(c, 'Invalid credentials');
    const token = crypto.randomUUID();
    await SessionEntity.create(c.env, { sessionId: token, userId: user.id, expiresAt: Date.now() + 86400000 * 7 });
    const profile = await new UserEntity(c.env, user.id).getProfile(c.env);
    return ok(c, { token, user: profile });
  });
  // Protected Routes
  app.get('/api/me', async (c) => {
    const uid = await getAuth(c);
    if (!uid) return c.json({ success: false, error: 'Unauthorized' }, 401);
    const user = new UserEntity(c.env, uid);
    return ok(c, await user.getProfile(c.env));
  });
  app.get('/api/tenants', async (c) => {
    const uid = await getAuth(c);
    if (!uid) return c.json({ success: false, error: 'Unauthorized' }, 401);
    const page = await TenantEntity.list(c.env);
    const userTenants = (page.items || []).filter(t => t.ownerId === uid);
    return ok(c, { items: userTenants, next: page.next });
  });
  app.post('/api/tenants', async (c) => {
    const uid = await getAuth(c);
    if (!uid) return c.json({ success: false, error: 'Unauthorized' }, 401);
    const { name, domain } = await c.req.json();
    const user = new UserEntity(c.env, uid);
    const profile = await user.getProfile(c.env);
    if (profile.tenantCount >= profile.plan.tenantLimit) {
      return c.json({ success: false, error: 'Plan limit reached', code: 'PLAN_LIMIT_REACHED' }, 400);
    }
    const tenant = await TenantEntity.createForUser(c.env, { name, domain, ownerId: uid });
    return ok(c, tenant);
  });
  app.delete('/api/tenants/:id', async (c) => {
    const uid = await getAuth(c);
    if (!uid) return c.json({ success: false, error: 'Unauthorized' }, 401);
    const tid = c.req.param('id');
    const inst = new TenantEntity(c.env, tid);
    const state = await inst.getState();
    if (state.ownerId !== uid) return bad(c, 'Access denied');
    await TenantEntity.delete(c.env, tid);
    return ok(c, { id: tid, deleted: true });
  });
  app.post('/api/validate-license', async (c) => {
    const { key, domain } = await c.req.json();
    const page = await TenantEntity.list(c.env);
    const tenant = page.items.find(t => t.license.key === key);
    if (!tenant) return ok(c, { valid: false, reason: 'License not found' });
    const validation = await TenantEntity.validateKey(tenant, key, domain);
    if (validation.valid) {
      await new TenantEntity(c.env, tenant.id).patch({ lastValidated: Date.now() });
    }
    return ok(c, {
      valid: validation.valid,
      reason: validation.reason,
      details: validation.valid ? {
        id: tenant.id,
        name: tenant.name,
        status: tenant.status,
        authorizedAt: tenant.createdAt,
        domain: tenant.domain
      } : undefined,
      timestamp: Date.now()
    });
  });
  app.get('/api/billing/invoices', async (c) => {
    const uid = await getAuth(c);
    if (!uid) return c.json({ success: false, error: 'Unauthorized' }, 401);
    const invoices = await InvoiceEntity.list(c.env);
    return ok(c, invoices.items.filter(i => i.userId === uid));
  });
  app.get('/api/support', async (c) => {
    const uid = await getAuth(c);
    if (!uid) return c.json({ success: false, error: 'Unauthorized' }, 401);
    const tickets = await SupportTicketEntity.list(c.env);
    return ok(c, tickets.items.filter(t => t.userId === uid));
  });
  app.get('/api/admin/stats', async (c) => {
    const uid = await getAuth(c);
    if (uid !== 'admin-demo') return bad(c, 'Admin only');
    const users = await UserEntity.list(c.env);
    const tenants = await TenantEntity.list(c.env);
    return ok(c, {
      operatorCount: users.items.length,
      tenantCount: tenants.items.length,
      revenue: 0,
      health: 'Nominal'
    });
  });
}