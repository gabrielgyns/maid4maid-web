import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { User } from '@/schemas/user.types';
import { usersService } from '@/services/user.service';

const usersKeys = {
  all: ['users'],
  byId: (userId: string) => ['users', { userId }],
  byLogin: (login: string) => ['users', { login }],
};

export const useUsers = () => {
  const queryClient = useQueryClient();

  const getUsers = useQuery({
    queryKey: usersKeys.all,
    queryFn: () => usersService.getUsers(),
  });

  const useUserById = (userId?: string) =>
    useQuery({
      queryKey: usersKeys.byId(userId as string),
      queryFn: () => usersService.getUserById(userId as string),
      enabled: !!userId,
    });

  const createUser = useMutation({
    mutationFn: (userData: User) => usersService.createUser(userData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });

  const updateUserById = useMutation({
    mutationFn: (userData: User) => usersService.updateUserById(userData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });

  const deleteUserById = useMutation({
    mutationFn: (userId: string) => usersService.deleteUserById(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: usersKeys.all,
      });
    },
  });

  return {
    getUsers,
    getUserById: useUserById,
    createUser,
    updateUserById,
    deleteUserById,
  };
};
