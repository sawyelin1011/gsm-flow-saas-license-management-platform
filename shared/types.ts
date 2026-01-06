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
  itemCount: number;
}
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  itemLimit: number;
  features: string[];
}
export type ItemStatus = 'active' | 'pending' | 'archived';
export interface Item {
  id: string;
  title: string;
  description: string;
  status: ItemStatus;
  category: string;
  ownerId: string;
  createdAt: number;
  metadata?: Record<string, any>;
}
export interface SystemStats {
  userCount: number;
  itemCount: number;
  revenue: number;
  health: string;
}
export interface ApiTestResponse {
  message: string;
  timestamp: string;
  method: string;
  headers: Record<string, string>;
  echo: any;
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
export interface UserDataExport {
  profile: UserProfile;
  items: Item[];
  tickets: SupportTicket[];
  invoices: Invoice[];
  exportedAt: number;
}