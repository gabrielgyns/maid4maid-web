import { useMutation, useQuery } from '@tanstack/react-query';

import type { Role } from '@/schemas/role.types';
import { rolesService } from '@/services/role.service';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getAllRoles(),
  });
};

export const useRoleById = (id: string) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => rolesService.getRoleById(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  return useMutation({
    mutationFn: (role: Partial<Role>) => rolesService.createRole(role),
  });
};

export const useUpdateRole = () => {
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Partial<Role> }) =>
      rolesService.updateRole(id, role),
  });
};

export const useDeleteRole = () => {
  return useMutation({
    mutationFn: (id: string) => rolesService.deleteRole(id),
  });
};

export const useAvailablePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => rolesService.getAvailablePermissions(),
  });
};

export const useGroupedPermissions = () => {
  return useQuery({
    queryKey: ['permissions', 'grouped'],
    queryFn: () => rolesService.getGroupedPermissions(),
  });
};
