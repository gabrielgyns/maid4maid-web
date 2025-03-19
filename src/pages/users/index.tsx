import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CircleCheck,
  CircleX,
  PlusCircle,
  Users as UsersIcon,
} from 'lucide-react';

import { DataTable } from '@/components/data-table';
import { ActionsCell } from '@/components/data-table/actions-cell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteUser, useUsers } from '@/hooks/queries/use-users';
import { User } from '@/schemas/user.types';
import { useUserStore } from '@/stores/user.store';

import { UserUsageAlert } from './user-usage-alert';

type RowType = {
  row: {
    original: User;
  };
};

export default function Users() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useUserStore();
  const deleteUserMutation = useDeleteUser();

  const { data: users, isLoading, error } = useUsers();

  // TODO: Plan limits - would typically come from user's subscription info
  const maxUsers = 8;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Error: {error?.message}{' '}
        <p className="italic text-muted-foreground">
          This message is temporary
        </p>
      </div>
    );
  }

  const columns = [
    {
      accessorKey: 'photoUrl',
      header: '#',
      cell: ({ row }: RowType) => (
        <Avatar className="size-12">
          <AvatarImage
            src={row.original.photoUrl}
            alt={row.original.firstName}
          />
          <AvatarFallback>
            {row.original.firstName.charAt(0)}
            {row.original.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: 'fullName',
      header: t('Users.table.name'),
      cell: ({ row }: RowType) => {
        const youHtml = (
          <span className="text-xs text-muted-foreground">(You)</span>
        );

        return (
          <>
            {row.original.firstName} {row.original.lastName}{' '}
            {row.original.login === user?.login && youHtml}
          </>
        );
      },
    },
    {
      accessorKey: 'login',
      header: t('Users.table.username'),
    },
    {
      accessorKey: 'phone',
      header: t('Users.table.primary_phone'),
    },
    {
      accessorKey: 'isDriver',
      header: t('Users.table.is_driver_question'),
      cell: ({ row }: RowType) =>
        row.original.isDriver ? (
          <CircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <CircleX className="h-5 w-5 text-red-600 dark:text-red-400" />
        ),
    },
    {
      accessorKey: 'actions',
      header: t('Users.table.actions'),
      cell: ({ row }: RowType) => (
        <ActionsCell
          row={row}
          onEdit={() => handleEditUser(row.original.id!)}
          onDelete={async () => {
            await deleteUserMutation.mutateAsync(row.original.id!);
          }}
          deleteTitle={t('Users.delete_user_dialog.title')}
          deleteDescription={t('Users.delete_user_dialog.description')}
        />
      ),
    },
  ];

  const handleCreateNewUser = () => {
    navigate('/users/new');
  };

  const handleEditUser = (userId: string) => {
    navigate(`/users/edit/${userId}`);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <UsersIcon className="mr-2 inline h-6 w-6" />
          {t('Users.title')}
        </h1>
        <Button
          onClick={handleCreateNewUser}
          className="self-end"
          type="button"
          disabled={users && users.length >= maxUsers}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> {t('Users.add_user')}
        </Button>
      </div>

      <DataTable columns={columns} data={users ?? []} />

      <UserUsageAlert userCount={users?.length || 0} maxUsers={maxUsers} />
    </div>
  );
}
