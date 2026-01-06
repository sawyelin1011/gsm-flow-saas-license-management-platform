import { IndexedEntity } from "./core-utils";
import type { AppUser, Item, UserProfile, SupportTicket, Invoice } from "@shared/types";
import { MOCK_USERS, MOCK_ITEMS, MOCK_PLANS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<AppUser> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: AppUser = { id: "", name: "", email: "", planId: "basic" };
  static seedData = MOCK_USERS;
  async getProfile(env: any): Promise<UserProfile> {
    const state = await this.getState();
    const plan = MOCK_PLANS.find(p => p.id === state.planId) || MOCK_PLANS[0];
    const items = await ItemEntity.list(env);
    const userItems = items.items.filter(it => it.ownerId === this.id);
    return {
      ...state,
      plan,
      itemCount: userItems.length
    };
  }
}
export class ItemEntity extends IndexedEntity<Item> {
  static readonly entityName = "item";
  static readonly indexName = "items";
  static readonly initialState: Item = {
    id: "",
    title: "",
    description: "",
    status: "active",
    category: "general",
    ownerId: "",
    createdAt: 0
  };
  static seedData = MOCK_ITEMS;
  static async createForItem(env: any, data: { title: string; description: string; category: string; ownerId: string }): Promise<Item> {
    const id = crypto.randomUUID();
    const item: Item = {
      ...data,
      id,
      status: 'active',
      createdAt: Date.now()
    };
    return await this.create(env, item);
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