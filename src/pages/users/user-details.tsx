import { useNavigate, useParams } from 'react-router-dom';

import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUser,
} from '@/hooks/queries/use-users';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/schemas/user.types';

import UserForm from './user-form';

export default function UserDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUser(id);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleSubmit = async (data: Partial<User>) => {
    try {
      if (id) {
        const updateData = {
          id,
          ...data,
          photoUrl: data.file instanceof File ? undefined : user?.photoUrl,
        } as User;

        await updateUserMutation.mutateAsync(updateData);

        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
      } else {
        await createUserMutation.mutateAsync(data as User);

        toast({
          title: 'Success',
          description: 'User created successfully',
        });
      }

      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);

      toast({
        title: 'Error',
        description: 'Failed to save user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });

      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);

      toast({
        title: 'Error',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading) {
    return <div className="flex justify-center p-8">Loading user data...</div>;
  }

  if (userError && id) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        Error loading user: {userError.message}
      </div>
    );
  }

  const normalizedUser =
    id && user
      ? {
          ...Object.fromEntries(
            Object.entries(user).map(([key, value]) => [
              key,
              value === null ? undefined : value,
            ]),
          ),
        }
      : undefined;

  return (
    <UserForm
      user={normalizedUser as User}
      isLoading={updateUserMutation.isPending || createUserMutation.isPending}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}
