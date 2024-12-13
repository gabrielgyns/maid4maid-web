import { useQuery } from '@tanstack/react-query';

import { usersService } from '@/services/user.service';

const usersKeys = {
  all: ['users'],
};

export const useUsers = () => {
  //   const queryClient = useQueryClient();

  const getUsers = useQuery({
    queryKey: usersKeys.all,
    queryFn: () => usersService.getUsers(),
  });

  return {
    getUsers,
  };
};
