import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Organization } from '@/schemas/organization.types';
import { organizationService } from '@/services/organization.service';

export interface OrganizationState {
  organization: Organization | null;
  isLoading: boolean;
  setOrganization: (org: Organization) => void;
  clearOrganization: () => void;
  updateOrganization: (data: Partial<Organization>) => void;
  fetchOrganization: () => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set) => ({
      organization: null,
      isLoading: false,

      setOrganization: (organization: Organization) => set({ organization }),

      clearOrganization: () => set({ organization: null }),

      updateOrganization: (data: Partial<Organization>) => {
        set({ isLoading: true });

        void (async () => {
          try {
            const updated = await organizationService.updateOrganization(data);

            set({ organization: updated });
          } catch (error) {
            console.error('Failed to update organization:', error);
          } finally {
            set({ isLoading: false });
          }
        })();
      },

      fetchOrganization: async () => {
        set({ isLoading: true });

        try {
          const org = await organizationService.getOrganization();

          set({ organization: org });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: '@CRMaidEasy:organization',
      skipHydration: true,
    },
  ),
);
