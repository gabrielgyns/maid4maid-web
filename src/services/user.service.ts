import { User, UserProfile } from '@/schemas/user.types';

import api from './api.service';

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
    const formData = new FormData();

    const avatar = userData.file;

    const { file: _file, ...userDataWithoutFile } = userData;

    Object.entries(userDataWithoutFile).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (avatar instanceof File) {
      formData.append('avatar', avatar);
    }

    const { data } = await api.post<User>('/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  async updateUserById(userData: User) {
    if (userData.id && userData.file instanceof File) {
      return await this.uploadAvatar(userData.id, userData.file);
    }

    const {
      file: _file,
      photoUrl: _photoUrl,
      ...userDataWithoutFile
    } = userData;

    const { data } = await api.put<User>(
      `/users/${userData.id}`,
      userDataWithoutFile,
    );

    return data;
  },

  async uploadAvatar(userId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<User>(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  },

  async deleteUserById(userId: string) {
    await api.delete(`/users/${userId}`);
  },

  async resetUserPassword(userId: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>(
      `/users/${userId}/reset-password`,
    );

    return data;
  },
};
