import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, TenantEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // USER PROFILE
  app.get('/api/me', async (c) => {
    // In a real app, this ID comes from auth context/session
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
  // PUBLIC LICENSE VALIDATION
  app.post('/api/validate-license', async (c) => {
    const { key, domain } = (await c.req.json()) as { key?: string; domain?: string };
    if (!key || !domain) return bad(c, 'key and domain required');
    const page = await TenantEntity.list(c.env);
    const tenant = page.items.find(t => t.licenseKey === key);
    if (!tenant) return ok(c, { valid: false, message: 'Invalid license key' });
    const inst = new TenantEntity(c.env, tenant.id);
    const isValid = await inst.validate(domain);
    return ok(c, {
      valid: isValid,
      tenant: isValid ? {
        name: tenant.name,
        domain: tenant.domain,
        status: tenant.status
      } : undefined,
      message: isValid ? 'License valid' : 'Domain mismatch or license suspended'
    });
  });
  app.delete('/api/tenants/:id', async (c) => ok(c, { 
    id: c.req.param('id'), 
    deleted: await TenantEntity.delete(c.env, c.req.param('id')) 
  }));
}