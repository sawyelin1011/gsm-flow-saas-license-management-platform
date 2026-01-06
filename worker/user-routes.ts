import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ItemEntity, SupportTicketEntity, InvoiceEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';

const MOCK_PLANS = [
  {id: 'basic', name: 'Basic', price: 0},
  {id: 'pro', name: 'Pro', price: 29},
  {id: 'enterprise', name: 'Enterprise', price: 99}
];
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const userId = 'admin-demo';
  // ROOT / API DISCOVERY
  app.get('/api', (c) => ok(c, { message: "GSM Flow SaaS API v1.0", status: "online" }));
  // PROFILE
  app.get('/api/me', async (c) => {
    try {
      const user = new UserEntity(c.env, userId);
      if (!await user.exists()) {
        await UserEntity.ensureSeed(c.env);
      }
      return ok(c, await user.getProfile(c.env));
    } catch (e) {
      return bad(c, 'Failed to retrieve profile');
    }
  });
  // ITEMS CRUD
  app.get('/api/items', async (c) => {
    try {
      await ItemEntity.ensureSeed(c.env);
      const page = await ItemEntity.list(c.env);
      const userItems = page.items.filter(i => i.ownerId === userId);
      return ok(c, { items: userItems, next: page.next });
    } catch (e) {
      return bad(c, 'Failed to fetch items');
    }
  });
  app.post('/api/items', async (c) => {
    try {
      const { title, description, category } = await c.req.json();
      if (!title || title.length < 2) return bad(c, 'Title too short');
      const item = await ItemEntity.createForItem(c.env, {
        title,
        description: description || '',
        category: category || 'General',
        ownerId: userId
      });
      return ok(c, item);
    } catch (e) {
      return bad(c, 'Failed to create item');
    }
  });
  app.delete('/api/items/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const deleted = await ItemEntity.delete(c.env, id);
      return ok(c, { id, deleted });
    } catch (e) {
      return bad(c, 'Delete operation failed');
    }
  });
  // BILLING
  app.post('/api/billing/upgrade', async (c) => {
    try {
      const { planId } = await c.req.json();
      const plan = MOCK_PLANS.find(p => p.id === planId);
      if (!plan) return bad(c, 'Invalid plan identifier');
      const user = new UserEntity(c.env, userId);
      await user.mutate(s => ({ ...s, planId }));
      // Create a mock invoice for the upgrade
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
      return bad(c, 'Billing operation failed');
    }
  });
  app.get('/api/billing/invoices', async (c) => {
    try {
      const invs = await InvoiceEntity.getInvoicesByUser(c.env, userId);
      return ok(c, invs);
    } catch (e) {
      return bad(c, 'Failed to fetch invoices');
    }
  });
  // SUPPORT
  app.get('/api/support', async (c) => {
    try {
      const tix = await SupportTicketEntity.getTicketsByUser(c.env, userId);
      return ok(c, tix);
    } catch (e) {
      return bad(c, 'Failed to fetch tickets');
    }
  });
  app.post('/api/support', async (c) => {
    try {
      const { subject, message, category } = await c.req.json();
      const ticket = await SupportTicketEntity.create(c.env, {
        id: crypto.randomUUID(),
        userId,
        subject,
        message,
        category: category || 'general',
        status: 'open',
        createdAt: Date.now()
      });
      return ok(c, ticket);
    } catch (e) {
      return bad(c, 'Failed to log ticket');
    }
  });
  // ADMIN ENDPOINTS
  app.get('/api/admin/stats', async (c) => {
    try {
      const users = await UserEntity.list(c.env);
      const items = await ItemEntity.list(c.env);
      const invoices = await InvoiceEntity.list(c.env);
      const rev = invoices.items.reduce((acc, inv) => acc + inv.amount, 0);
      return ok(c, {
        userCount: users.items.length,
        itemCount: items.items.length,
        revenue: rev,
        health: 'Operational'
      });
    } catch (e) {
      return bad(c, 'Admin stats failed');
    }
  });
  app.get('/api/admin/users', async (c) => {
    try {
      const users = await UserEntity.list(c.env);
      return ok(c, users.items);
    } catch (e) {
      return bad(c, 'Failed to fetch operator registry');
    }
  });
  app.post('/api/admin/users/:id/plan', async (c) => {
    try {
      const id = c.req.param('id');
      const { planId } = await c.req.json();
      const user = new UserEntity(c.env, id);
      if (!await user.exists()) return notFound(c, 'User not found');
      await user.patch({ planId });
      return ok(c, { success: true });
    } catch (e) {
      return bad(c, 'Authority elevation failed');
    }
  });
  app.get('/api/admin/tenants', async (c) => {
    try {
      const items = await ItemEntity.list(c.env);
      // Map Item to the structure Admin Dashboard expects for "Tenants"
      const tenants = items.items.map(it => ({
        id: it.id,
        name: it.title,
        domain: it.category.toLowerCase().includes('.') ? it.category : `${it.id.slice(0, 4)}.node.local`,
        status: it.status,
        ownerId: it.ownerId,
        createdAt: it.createdAt
      }));
      return ok(c, { items: tenants, next: items.next });
    } catch (e) {
      return bad(c, 'Failed to fetch cluster nodes');
    }
  });
  // TESTER / UTILS
  app.post('/api/test', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    return ok(c, {
      message: "Worker endpoint active",
      timestamp: new Date().toISOString(),
      echo: body
    });
  });
  app.get('/api/export', async (c) => {
    try {
      const user = new UserEntity(c.env, userId);
      const profile = await user.getProfile(c.env);
      const items = (await ItemEntity.list(c.env)).items.filter(i => i.ownerId === userId);
      return ok(c, { profile, items, exportedAt: Date.now() });
    } catch (e) {
      return bad(c, 'Export failed');
    }
  });
}