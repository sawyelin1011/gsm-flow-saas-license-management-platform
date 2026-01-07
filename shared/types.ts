export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface AppUser {
  id: string;
  name: string;
  email: string;
  planId: string;
}
export interface UserProfile extends AppUser {
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
export type TenantStatus = 'active' | 'revoked' | 'suspended';
export interface License {
  key: string;
  issuedAt: number;
  signature: string;
}
export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: TenantStatus;
  license: License;
  ownerId: string;
  createdAt: number;
  lastValidated?: number;
}
export interface SystemStats {
  operatorCount: number;
  tenantCount: number;
  revenue: number;
  health: string;
}
export interface LicenseValidationResponse {
  valid: boolean;
  reason?: string;
  details?: {
    id: string;
    name: string;
    status: string;
    authorizedAt: number;
    domain: string;
  };
  timestamp: number;
}
export type SupportTicketStatus = 'open' | 'closed';
export type SupportTicketCategory = 'technical' | 'billing' | 'account' | 'general';
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