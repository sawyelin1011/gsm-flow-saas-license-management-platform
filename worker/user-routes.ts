import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ItemEntity, SupportTicketEntity, InvoiceEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { MOCK_PLANS } from "@shared/mock-data";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  const userId = 'admin-demo';
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
  // API TESTER
  app.post('/api/test', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const headers: Record<string, string> = {};
    c.req.header().forEach((v, k) => { headers[k] = v; });
    return ok(c, {
      message: "Worker endpoint active",
      timestamp: new Date().toISOString(),
      method: c.req.method,
      headers,
      echo: body
    });
  });
  // ADMIN STATS
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
  // EXPORT
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
  // BILLING & SUPPORT (Simplified Generic)
  app.get('/api/billing/invoices', async (c) => {
    const invs = await InvoiceEntity.getInvoicesByUser(c.env, userId);
    return ok(c, invs);
  });
  app.get('/api/support', async (c) => {
    const tix = await SupportTicketEntity.getTicketsByUser(c.env, userId);
    return ok(c, tix);
  });
}