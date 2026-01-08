import type { AppUser, Plan, Tenant, Invoice, SupportTicket } from './types';
export const MOCK_PLANS: Plan[] = [
  {
    id: 'launch',
    name: 'Launch Plan',
    price: 49,
    interval: 'month',
    tenantLimit: 1,
    features: [
      '1 Sovereign Service Node',
      'Custom Domain Unlocking Portal',
      'Remote Service Authority',
      'Zero Transaction Fees',
      'Standard Support'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    price: 149,
    interval: 'month',
    tenantLimit: 10,
    features: [
      '10 Sovereign Service Nodes',
      'Automated API Gateway',
      'White-labeled Operator Portal',
      'Advanced Node Analytics',
      'Priority Support'
    ]
  },
  {
    id: 'agency',
    name: 'Agency Plan',
    price: 499,
    interval: 'month',
    tenantLimit: 100,
    features: [
      '100 Sovereign Service Nodes',
      'Wholesale API Handshakes',
      'Custom Integration Hooks',
      'Dedicated Authority Engineer',
      'Full SLA Guarantee'
    ]
  }
];
export const MOCK_USERS: AppUser[] = [
  {
    id: 'admin-demo',
    name: 'Global Authority Admin',
    email: 'admin@gsmflow.com',
    planId: 'agency'
  }
];
export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'node-1',
    name: 'Sovereign Cluster Alpha',
    domain: 'unlock.alpha.local',
    status: 'active',
    license: {
      key: 'FLOW-SOV-8822-XJ99',
      issuedAt: Date.now() - 86400000 * 5,
      signature: 'sig_gsm_sov_a1b2'
    },
    ownerId: 'admin-demo',
    createdAt: Date.now() - 86400000 * 5
  }
];
export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-2025-sov-001',
    userId: 'admin-demo',
    amount: 149,
    date: Date.now() - 86400000 * 10,
    status: 'paid',
    planName: 'Growth Plan',
    currency: 'USD'
  }
];
export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'tick-001',
    userId: 'admin-demo',
    subject: 'Sovereign Node Latency Audit',
    message: 'Investigating edge validation speeds in Southeast Asian clusters.',
    status: 'closed',
    category: 'technical',
    createdAt: Date.now() - 86400000 * 2
  }
];