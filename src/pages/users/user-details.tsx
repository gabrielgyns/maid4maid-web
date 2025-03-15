import { useNavigate, useParams } from 'react-router-dom';

import { useUsers } from '@/hooks/queries/use-users';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/schemas/user.types';

import UserForm from './user-form';

export default function UserDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { getUserById, createUser, updateUserById, deleteUserById } =
    useUsers();

  const {
    data: user,
    // isLoading: isUserLoading,
    // error: isUserError,
  } = getUserById(id);

  const handleSubmit = async (data: Partial<User>) => {
    if (id) {
      await updateUserById.mutateAsync({ id, ...data } as User);
    } else {
      await createUser.mutateAsync(data as User);
    }

    navigate('/users');

    toast({
      title: 'Users',
      description: 'User saved successfully',
    });
  };

  const handleDelete = async (userId: string) => {
    await deleteUserById.mutateAsync(userId);

    navigate('/users');

    toast({
      title: 'Users',
      description: 'User deleted successfully',
    });
  };

  // Normalizes client data by replacing null values with undefined.
  const normalizedDataUser = {
    ...Object.fromEntries(
      Object.entries(user || {}).map(([key, value]) => [
        key,
        value ?? undefined,
      ]),
    ),
  };

  return (
    <UserForm
      user={normalizedDataUser as User}
      isLoading={updateUserById.isPending || createUser.isPending}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}
