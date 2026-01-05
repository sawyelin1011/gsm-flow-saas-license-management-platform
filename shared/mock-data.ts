import type { User, Plan, Tenant } from './types';
export const MOCK_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    interval: 'month',
    tenantLimit: 2,
    features: ['2 GSM Installations', 'Standard Support', 'Daily Backups']
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 149,
    interval: 'month',
    tenantLimit: 10,
    features: ['10 GSM Installations', 'Priority Support', 'Real-time Monitoring', 'API Access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    interval: 'month',
    tenantLimit: 100,
    features: ['Unlimited Installations', 'Dedicated Support', 'Custom Domain Branding', 'SLA Guarantee']
  }
];
export const MOCK_USERS: User[] = [
  {
    id: 'admin-demo',
    name: 'John Doe',
    email: 'john@gsmflow.com',
    planId: 'professional'
  }
];
export const MOCK_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Main Hub',
    domain: 'hub.gsmflow.local',
    licenseKey: 'GSM-XXXX-YYYY-ZZZZ',
    status: 'active',
    ownerId: 'admin-demo',
    createdAt: Date.now() - 86400000 * 5
  }
];