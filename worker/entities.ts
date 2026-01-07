import { IndexedEntity } from "./core-utils";
import type { AppUser, Tenant, UserProfile, SupportTicket, Invoice, Plan } from "@shared/types";
export class UserEntity extends IndexedEntity<AppUser> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: AppUser = { id: "", name: "", email: "", planId: "launch" };
  static readonly seedData: AppUser[] = [{id: 'admin-demo', name: 'GSM Authority Admin', email: 'admin@gsmflow.com', planId: 'growth'}];
  async getProfile(env: any): Promise<UserProfile> {
    const state = await this.getState();
    const MOCK_PLANS: Plan[] = [
      {id: 'launch', name: 'Launch', tenantLimit: 1, price: 49, interval: 'month', features: []},
      {id: 'growth', name: 'Growth', tenantLimit: 10, price: 149, interval: 'month', features: ['Priority support']},
      {id: 'agency', name: 'Agency', tenantLimit: 100, price: 499, interval: 'month', features: ['White-label', 'Early access']}
    ];
    const plan = MOCK_PLANS.find(p => p.id === state.planId) || MOCK_PLANS[0];
    const tenants = await TenantEntity.list(env);
    const userTenants = (tenants.items || []).filter(t => t.ownerId === this.id);
    return {
      ...state,
      plan,
      tenantCount: userTenants.length
    };
  }
  static async ensureSeed(env: any): Promise<void> {
    const result = await this.list(env);
    if (!result.items || result.items.length === 0) {
      for (const data of this.seedData) {
        await this.create(env, data);
      }
    }
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
    return `GSM-${segments.join('-')}`;
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
    console.log(`[Authority Node] Provisioning new GSM Tenant: ${tenant.name} for domain ${tenant.domain}`);
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
    return (result.items || []).filter(t => t.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
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
    return (result.items || []).filter(i => i.userId === userId).sort((a, b) => b.date - a.date);
  }
}