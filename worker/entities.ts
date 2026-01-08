import { IndexedEntity } from "./core-utils";
import type { AppUser, Tenant, UserProfile, SupportTicket, Invoice, Plan, SessionInfo } from "@shared/types";
export class UserEntity extends IndexedEntity<AppUser & { passwordHash: string }> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState = { id: "", name: "", email: "", planId: "launch", passwordHash: "" };
  async getProfile(env: any): Promise<UserProfile> {
    const state = await this.getState();
    const MOCK_PLANS: Plan[] = [
      { id: 'launch', name: 'Launch', tenantLimit: 1, price: 49, interval: 'month', features: ['Basic Support'] },
      { id: 'growth', name: 'Growth', tenantLimit: 10, price: 149, interval: 'month', features: ['Priority support'] },
      { id: 'agency', name: 'Agency', tenantLimit: 100, price: 499, interval: 'month', features: ['White-label', 'Early access'] }
    ];
    const plan = MOCK_PLANS.find(p => p.id === state.planId) || MOCK_PLANS[0];
    const tenantsResult = await TenantEntity.list(env);
    const userTenants = (tenantsResult.items || []).filter(t => t.ownerId === this.id);
    return {
      id: state.id,
      name: state.name,
      email: state.email,
      planId: state.planId,
      plan,
      tenantCount: userTenants.length,
      isAdmin: state.id === 'admin-demo'
    };
  }
  static async hashPassword(password: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const pwHash = await UserEntity.hashPassword(password);
    return pwHash === storedHash;
  }
  static async ensureSeed(env: any) {
    const page = await UserEntity.list(env);
    if (page.items.length === 0) {
      const passwordHash = await UserEntity.hashPassword('password123');
      await UserEntity.create(env, {
        id: 'admin-demo',
        name: 'Global Admin',
        email: 'admin@gsmflow.com',
        planId: 'agency',
        passwordHash
      });
    }
  }
}
export class SessionEntity extends IndexedEntity<SessionInfo> {
  static readonly entityName = "session";
  static readonly indexName = "sessions";
  static readonly initialState: SessionInfo = { id: "", sessionId: "", userId: "", expiresAt: 0 };
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
  static async generateSignature(tenantId: string, key: string): Promise<string> {
    const secret = "GSM_FLOW_MASTER_SECRET_2025";
    const enc = new TextEncoder();
    const keyData = enc.encode(secret);
    const msg = enc.encode(`${tenantId}:${key}`);
    const cryptoKey = await crypto.subtle.importKey(
      "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msg);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }
  static async createForUser(env: any, data: { name: string; domain: string; ownerId: string }): Promise<Tenant> {
    const id = crypto.randomUUID();
    const key = `GSM-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const signature = await this.generateSignature(id, key);
    const tenant: Tenant = {
      ...data,
      id,
      domain: data.domain.toLowerCase().trim(),
      status: 'active',
      license: {
        key,
        issuedAt: Date.now(),
        signature
      },
      createdAt: Date.now()
    };
    return await this.create(env, tenant);
  }
  static async validateKey(tenant: Tenant, key: string, domain: string): Promise<{ valid: boolean; reason?: string }> {
    if (tenant.license.key !== key) return { valid: false, reason: "Invalid key" };
    if (tenant.domain.toLowerCase() !== domain.toLowerCase()) return { valid: false, reason: "Domain mismatch" };
    if (tenant.status !== 'active') return { valid: false, reason: `Status is ${tenant.status}` };
    const expectedSig = await this.generateSignature(tenant.id, key);
    if (tenant.license.signature !== expectedSig) return { valid: false, reason: "Signature corruption" };
    return { valid: true };
  }
}
export class SupportTicketEntity extends IndexedEntity<SupportTicket> {
  static readonly entityName = "ticket";
  static readonly indexName = "tickets";
  static readonly initialState: SupportTicket = {
    id: "", userId: "", subject: "", message: "", status: "open", category: "general", createdAt: 0
  };
}
export class InvoiceEntity extends IndexedEntity<Invoice> {
  static readonly entityName = "invoice";
  static readonly indexName = "invoices";
  static readonly initialState: Invoice = {
    id: "", userId: "", amount: 0, date: 0, status: "paid", planName: "", currency: "USD"
  };
}