import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleX, Loader2, PlusCircle } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import { ActionsCell } from '@/components/data-table/actions-cell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useUsers } from '@/hooks/queries/use-users';
import { User } from '@/schemas/user.types';
import { useUserStore } from '@/stores/user.store';

type RowType = {
  row: {
    original: User;
  };
};

export default function Users() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { getUsers, deleteUserById } = useUsers();

  const { data: users, isLoading, error } = getUsers;

  if (isLoading) {
    // TODO: Add a skeleton
    return <Loader2 className="size-4 animate-spin" />;
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
      header: 'Name',
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
      header: 'Login',
    },
    {
      accessorKey: 'phone',
      header: 'Primary Phone',
    },
    {
      accessorKey: 'isDriver',
      header: 'Is Driver?',
      cell: ({ row }: RowType) =>
        row.original.isDriver ? (
          <CircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <CircleX className="h-5 w-5 text-red-600 dark:text-red-400" />
        ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: RowType) => (
        <ActionsCell
          row={row}
          onEdit={() => handleEditUser(row.original.id)}
          onDelete={async () => {
            await deleteUserById.mutateAsync(row.original.id);
          }}
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
      <Button
        onClick={handleCreateNewUser}
        className="mb-4 self-end"
        type="button"
      >
        <PlusCircle /> Add New User
      </Button>
      <DataTable columns={columns} data={users ?? []} />
    </div>
  );
}
