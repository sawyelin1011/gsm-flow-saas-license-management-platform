import type { AppUser, Plan, Tenant, Invoice, SupportTicket } from './types';
export const MOCK_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Node Starter',
    price: 29,
    interval: 'month',
    tenantLimit: 1,
    features: ['1 Managed Node', 'Domain Binding', 'Standard Support', 'Real-time Validation']
  },
  {
    id: 'pro',
    name: 'Cluster Pro',
    price: 89,
    interval: 'month',
    tenantLimit: 10,
    features: ['10 Managed Nodes', 'Priority Support', 'Advanced Analytics', 'API Access', 'Global Edge Validation']
  },
  {
    id: 'enterprise',
    name: 'Carrier Enterprise',
    price: 299,
    interval: 'month',
    tenantLimit: 100,
    features: ['Unlimited Nodes', '24/7 Dedicated Support', 'SLA Guarantee', 'Custom Integrations', 'White-labeling']
  }
];
export const MOCK_USERS: AppUser[] = [
  {
    id: 'admin-demo',
    name: 'Demo Admin',
    email: 'admin@gsmflow.com',
    planId: 'pro'
  }
];
export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Primary Cluster',
    domain: 'gsm.primary.local',
    status: 'active',
    license: {
      key: 'FLOW-ABCD-1234-EFGH',
      issuedAt: Date.now() - 86400000 * 5,
      signature: 'sig_a1b2c3d4'
    },
    ownerId: 'admin-demo',
    createdAt: Date.now() - 86400000 * 5
  }
];
export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-2025-001',
    userId: 'admin-demo',
    amount: 89,
    date: Date.now() - 86400000 * 10,
    status: 'paid',
    planName: 'Cluster Pro',
    currency: 'USD'
  }
];
export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'tick-001',
    userId: 'admin-demo',
    subject: 'Initial Cluster Sync',
    message: 'Probing the authority node for the first time. Latency looks excellent.',
    status: 'closed',
    category: 'technical',
    createdAt: Date.now() - 86400000 * 2
  }
];