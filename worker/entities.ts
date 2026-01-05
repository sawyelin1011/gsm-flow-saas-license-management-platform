import { IndexedEntity } from "./core-utils";
import type { User, Tenant, UserProfile, Plan, SupportTicket, Invoice } from "@shared/types";
import { MOCK_USERS, MOCK_TENANTS, MOCK_PLANS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", email: "", planId: "starter" };
  static seedData = MOCK_USERS;
  async getProfile(env: any): Promise<UserProfile> {
    const state = await this.getState();
    const plan = MOCK_PLANS.find(p => p.id === state.planId) || MOCK_PLANS[0];
    const tenants = await TenantEntity.list(env);
    const userTenants = tenants.items.filter(t => t.ownerId === this.id);
    return {
      ...state,
      plan,
      tenantCount: userTenants.length
    };
  }
}
export class TenantEntity extends IndexedEntity<Tenant> {
  static readonly entityName = "tenant";
  static readonly indexName = "tenants";
  static readonly initialState: Tenant = {
    id: "",
    name: "",
    domain: "",
    licenseKey: "",
    status: "active",
    ownerId: "",
    createdAt: 0
  };
  static seedData = MOCK_TENANTS;
  static async createForUser(env: any, data: { name: string; domain: string; ownerId: string }): Promise<Tenant> {
    const id = crypto.randomUUID();
    const licenseKey = `GF-${crypto.randomUUID().split('-')[0].toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const tenant: Tenant = {
      ...data,
      id,
      licenseKey,
      status: 'active',
      createdAt: Date.now()
    };
    return await this.create(env, tenant);
  }
  async validate(domain: string): Promise<boolean> {
    const state = await this.getState();
    return state.status === 'active' && state.domain === domain;
  }
  async toggleStatus(): Promise<Tenant> {
    return await this.mutate((s) => ({
      ...s,
      status: s.status === 'active' ? 'suspended' : 'active'
    }));
  }
}
export class SupportTicketEntity extends IndexedEntity<SupportTicket> {
  static readonly entityName = "ticket";
  static readonly indexName = "tickets";
  static readonly initialState: SupportTicket = {
    id: "",
    userId: "",
    subject: "",
    message: "",
    status: "open",
    category: "technical",
    createdAt: 0
  };
  static async getTicketsByUser(env: any, userId: string): Promise<SupportTicket[]> {
    const result = await this.list(env);
    return result.items.filter(t => t.userId === userId);
  }
}
export class InvoiceEntity extends IndexedEntity<Invoice> {
  static readonly entityName = "invoice";
  static readonly indexName = "invoices";
  static readonly initialState: Invoice = {
    id: "",
    userId: "",
    amount: 0,
    date: 0,
    status: "paid",
    planName: "",
    currency: "USD"
  };
  static async getInvoicesByUser(env: any, userId: string): Promise<Invoice[]> {
    const result = await this.list(env);
    return result.items.filter(i => i.userId === userId).sort((a, b) => b.date - a.date);
  }
}