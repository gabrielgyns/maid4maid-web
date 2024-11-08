import type { Organization } from '@/schemas/organization.types';

import { api } from './api.service';

export const organizationService = {
  async getOrganization() {
    const { data } = await api.get<Organization>('/organizations/current');

    return data;
  },

  async updateOrganization(orgData: Partial<Organization>) {
    const { data } = await api.patch<Organization>(
      '/organizations/current',
      orgData,
    );

    return data;
  },
};

// {
//     id: '16e38be2-0c37-48eb-99e4-1d3c5b5d0e97',
//     logoUrl: null,
//     name: 'MuveTech',
//     email: 'admin@muvetech.com',
//     phone: '1234567890',
//     address: '123 Main St.',
//     city: 'Springfield',
//     state: 'IL',
//     zipCode: '62701',
//     country: 'USA',
//     referralCode: null,
//     referredByCode: null,
//     additionalInformation: null,
//     stripeCustomerId: null,
//     isActive: true,
//     createdAt: 2024-08-03T23:04:16.780Z,
//     updatedAt: 2024-08-03T23:04:16.780Z
//   }
