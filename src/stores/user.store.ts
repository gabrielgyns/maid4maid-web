import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserProfile } from '@/schemas/user.types';
import { usersService } from '@/services/user.service';

export interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user: UserProfile) => set({ user }),

      clearUser: () => set({ user: null }),

      updateProfile: (profile: Partial<UserProfile>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...profile } : null,
        })),

      fetchProfile: async () => {
        set({ isLoading: true });

        try {
          // TODO: Move to ReactQuery
          const profile = await usersService.getProfile();

          set((state) => ({
            user: state.user ? { ...state.user, ...profile } : profile,
          }));
        } catch (error) {
          console.error('Error while fetching the profile:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: '@Maid4Maid:User',
      skipHydration: true,
    },
  ),
);
