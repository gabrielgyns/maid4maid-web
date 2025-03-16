import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { User } from '@/schemas/user.types';
import { usersService } from '@/services/user.service';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => usersService.getUsers(),
  });
}

export function useUser(userId?: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersService.getUserById(userId as string),
    enabled: !!userId,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) =>
      usersService.createUser(userData as User),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: User) => usersService.updateUserById(userData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.deleteUserById(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useResetUserPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.resetUserPassword(userId),
    onSuccess: (_, userId) => {
      void queryClient.invalidateQueries({
        queryKey: ['users', userId],
      });
    },
  });
}
