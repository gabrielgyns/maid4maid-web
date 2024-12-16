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

  async getUserById(userId: string) {
    const { data } = await api.get<User>(`/users/${userId}`);

    return data;
  },

  async createUser(userData: User) {
    const { data } = await api.post<User>('/users', userData);

    return data;
  },

  async updateUserById(userData: User) {
    const { data } = await api.put<User>(`/users/${userData.id}`, userData);

    return data;
  },

  async deleteUserById(userId: string) {
    await api.delete(`/users/${userId}`);
  },
};
