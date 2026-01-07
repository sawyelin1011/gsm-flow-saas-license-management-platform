import { IndexedEntity } from "./core-utils";
import type { AppUser, Tenant, UserProfile, SupportTicket, Invoice } from "@shared/types";
import { MOCK_USERS, MOCK_PLANS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<AppUser> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: AppUser = { id: "", name: "", email: "", planId: "basic" };
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
    status: "active",
    license: { key: "", issuedAt: 0, signature: "" },
    ownerId: "",
    createdAt: 0
  };
  static generateLicenseKey(): string {
    const segments = Array.from({ length: 3 }, () =>
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
    return `FLOW-${segments.join('-')}`;
  }
  static async createForUser(env: any, data: { name: string; domain: string; ownerId: string }): Promise<Tenant> {
    const id = crypto.randomUUID();
    const key = this.generateLicenseKey();
    const tenant: Tenant = {
      ...data,
      id,
      domain: data.domain.toLowerCase().trim(),
      status: 'active',
      license: {
        key,
        issuedAt: Date.now(),
        signature: btoa(id + key).substring(0, 16)
      },
      createdAt: Date.now()
    };
    return await this.create(env, tenant);
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
    category: "general",
    createdAt: 0
  };
  static async getTicketsByUser(env: any, userId: string): Promise<SupportTicket[]> {
    const result = await this.list(env);
    return result.items.filter(t => t.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
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