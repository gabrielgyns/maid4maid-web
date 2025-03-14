import type { Organization } from '@/schemas/organization.types';

import api from './api.service';

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
