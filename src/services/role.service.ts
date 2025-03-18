import { Role } from '@/schemas/role.types';

import api from './api.service';

export const rolesService = {
  async getAllRoles(): Promise<Role[]> {
    const { data } = await api.get<Role[]>('/roles');
    return data;
  },

  async getRoleById(id: string): Promise<Role> {
    const { data } = await api.get<Role>(`/roles/${id}`);
    return data;
  },

  async getAvailablePermissions(): Promise<string[]> {
    const { data } = await api.get<string[]>('/roles/permissions');
    return data;
  },

  async getGroupedPermissions(): Promise<Record<string, string[]>> {
    const { data } = await api.get<Record<string, string[]>>(
      '/roles/permissions/grouped',
    );
    return data;
  },

  async createRole(role: Partial<Role>): Promise<Role> {
    const { data } = await api.post<Role>('/roles', role);
    return data;
  },

  async updateRole(id: string, role: Partial<Role>): Promise<Role> {
    const { data } = await api.patch<Role>(`/roles/${id}`, role);
    return data;
  },

  async deleteRole(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  },
};
