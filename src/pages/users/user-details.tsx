import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          title: t('Common.success'),
          description: t('Users.user_updated_successfully'),
        });
      } else {
        await createUserMutation.mutateAsync(data as User);

        toast({
          title: t('Common.success'),
          description: t('Users.user_created_successfully'),
        });
      }

      navigate('/users');
    } catch (error) {
      console.error('Error saving user:', error);

      toast({
        title: t('Users.error'),
        description: t('Users.error'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);

      toast({
        title: t('Common.success'),
        description: t('Users.user_deleted_successfully'),
      });

      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);

      toast({
        title: t('Common.error'),
        description: t('Users.failed_to_delete_user'),
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center p-8">{t('Users.user_loading')}</div>
    );
  }

  if (userError && id) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        {t('Users.user_error')}
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
