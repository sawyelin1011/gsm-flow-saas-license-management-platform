import type { AppUser, Plan, Item } from './types';
export const MOCK_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Tier',
    price: 29,
    interval: 'month',
    itemLimit: 5,
    features: ['5 Project Items', 'Community Support', 'Basic Analytics']
  },
  {
    id: 'pro',
    name: 'Pro Tier',
    price: 89,
    interval: 'month',
    itemLimit: 25,
    features: ['25 Project Items', 'Priority Email Support', 'Advanced Exports', 'API Access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Tier',
    price: 299,
    interval: 'month',
    itemLimit: 1000,
    features: ['Unlimited Items', '24/7 Dedicated Support', 'Custom Integrations', 'SLA Guarantee']
  }
];
export const MOCK_USERS: AppUser[] = [
  {
    id: 'admin-demo',
    name: 'Demo Admin',
    email: 'admin@boilerplate.local',
    planId: 'pro'
  }
];
export const MOCK_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'Prototype Delta',
    description: 'Initial architectural framework for the project.',
    status: 'active',
    category: 'Development',
    ownerId: 'admin-demo',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'item-2',
    title: 'Marketing Assets',
    description: 'Banners, icons, and landing page wireframes.',
    status: 'pending',
    category: 'Design',
    ownerId: 'admin-demo',
    createdAt: Date.now() - 86400000 * 1
  }
];