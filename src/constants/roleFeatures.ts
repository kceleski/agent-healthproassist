
export type UserRole = 'consultant' | 'agent' | 'facility_manager' | 'admin';
export type SubscriptionTier = 'basic' | 'premium' | 'enterprise';

export interface RoleFeature {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
  tiers: SubscriptionTier[];
  component?: string;
}

export const roleFeatures: RoleFeature[] = [
  {
    id: 'crm',
    name: 'Customer Relationship Management',
    description: 'Manage client relationships and placement activities',
    roles: ['consultant', 'agent'],
    tiers: ['premium', 'enterprise'],
    component: 'CRMDashboard'
  },
  {
    id: 'facility_management',
    name: 'Facility Management',
    description: 'Edit facility listings, services, and amenities',
    roles: ['facility_manager', 'admin'],
    tiers: ['basic', 'premium', 'enterprise'],
    component: 'FacilityManagement'
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'View referrals, engagement, and financial metrics',
    roles: ['consultant', 'agent', 'facility_manager', 'admin'],
    tiers: ['premium', 'enterprise'],
    component: 'AnalyticsDashboard'
  },
  {
    id: 'calendar',
    name: 'Calendar & Scheduling',
    description: 'Manage tours, appointments, and scheduling',
    roles: ['consultant', 'agent', 'facility_manager'],
    tiers: ['basic', 'premium', 'enterprise'],
    component: 'CalendarScheduling'
  },
  {
    id: 'admin_tools',
    name: 'Admin Tools',
    description: 'User management and system administration',
    roles: ['admin'],
    tiers: ['enterprise'],
    component: 'AdminTools'
  }
];

export const getUserAccessibleFeatures = (role: UserRole, tier: SubscriptionTier): RoleFeature[] => {
  return roleFeatures.filter(feature => 
    feature.roles.includes(role) && feature.tiers.includes(tier)
  );
};
