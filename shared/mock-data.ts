import type { AppUser, Plan, Tenant, Invoice, SupportTicket } from './types';
export const MOCK_PLANS: Plan[] = [
  {
    id: 'launch',
    name: 'Launch Plan',
    price: 49,
    interval: 'month',
    tenantLimit: 1,
    features: [
      '1 GSM Tenant Provisioning',
      'Remote Service Management',
      'Standard Support',
      'Real-time License Validation'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    price: 149,
    interval: 'month',
    tenantLimit: 10,
    features: [
      '10 GSM Tenants',
      'Priority Authority Support',
      'Automated Service Updates',
      'Advanced API Analytics',
      'Global Edge Validation'
    ]
  },
  {
    id: 'agency',
    name: 'Agency Plan',
    price: 499,
    interval: 'month',
    tenantLimit: 100,
    features: [
      '100 GSM Tenants',
      'White-label Service Portal',
      '24/7 Dedicated Support',
      'Custom Integration Hooks',
      'SLA Guarantee'
    ]
  }
];
export const MOCK_USERS: AppUser[] = [
  {
    id: 'admin-demo',
    name: 'Demo Operator',
    email: 'admin@gsmflow.com',
    planId: 'growth'
  }
];
export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'London Central Service',
    domain: 'gsm.london.service',
    status: 'active',
    license: {
      key: 'FLOW-GSM-8822-XJ99',
      issuedAt: Date.now() - 86400000 * 5,
      signature: 'sig_gsm_a1b2'
    },
    ownerId: 'admin-demo',
    createdAt: Date.now() - 86400000 * 5
  }
];
export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-2025-gsm-001',
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
    subject: 'Tenant Provisioning Latency',
    message: 'Investigating response times for new service license generation in Southeast Asia.',
    status: 'closed',
    category: 'technical',
    createdAt: Date.now() - 86400000 * 2
  }
];