export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  planId: string;
}
export interface UserProfile extends User {
  plan: Plan;
  tenantCount: number;
}
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  tenantLimit: number;
  features: string[];
}
export type TenantStatus = 'active' | 'suspended' | 'expired';
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  licenseKey: string;
  status: TenantStatus;
  ownerId: string;
  createdAt: number;
}
export interface LicenseValidation {
  valid: boolean;
  tenant?: {
    name: string;
    domain: string;
    status: TenantStatus;
  };
  message?: string;
}
export type SupportTicketStatus = 'open' | 'closed';
export type SupportTicketCategory = 'technical' | 'billing' | 'account';
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  category: SupportTicketCategory;
  createdAt: number;
}
export type InvoiceStatus = 'paid' | 'pending' | 'failed';
export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  date: number;
  status: InvoiceStatus;
  planName: string;
  currency: string;
}
export interface UserDataExport {
  profile: UserProfile;
  tenants: Tenant[];
  tickets: SupportTicket[];
  invoices: Invoice[];
  exportedAt: number;
}
// Keep legacy for template compatibility if needed elsewhere
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}