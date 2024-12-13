import { User, UserProfile } from '@/schemas/user.types';

import { api } from './api.service';

interface GetProfileResponse extends UserProfile {
  first_name: string;
  last_name: string;
  is_driver: boolean;
}

export const usersService = {
  async getProfile() {
    const { data } = await api.get<GetProfileResponse>('/users/me');

    return {
      ...data,
      full_name: `${data.first_name} ${data.last_name}`,
    };
  },

  async getUsers() {
    const { data } = await api.get<User[]>('/users');

    return data;
  },
};
