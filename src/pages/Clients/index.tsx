import { useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle } from 'lucide-react';

import { DataTable } from '@/components/DataTable';
import { ActionsCell } from '@/components/DataTable/ActionsCell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useClients, useDeleteClient } from '@/hooks/queries/useClients';
import { getFullAddress } from '@/lib/utils';
import { Client } from '@/schemas/client.types';

type RowType = {
  row: {
    original: Client;
  };
};

export default function Clients() {
  const navigate = useNavigate();
  const deleteClientMutate = useDeleteClient();
  const { data: clients, isLoading, error } = useClients();

  if (isLoading) return <Loader2 className="size-4 animate-spin" />; // TODO: Add a skeleton
  if (error)
    return (
      <div>
        Error: {error?.message}{' '}
        <p className="italic text-muted-foreground">
          This message is temporary
        </p>
      </div>
    );

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
      cell: ({ row }: RowType) =>
        `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone1',
      header: 'Primary Phone',
    },
    {
      accessorKey: 'fullAddress',
      header: 'First Address',
      cell: ({ row }: RowType) =>
        row.original.addresses.length > 0
          ? getFullAddress(row.original.addresses[0])
          : 'No address yet 😕',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: RowType) => (
        <ActionsCell
          row={row}
          onEdit={() => handleEditClient(row.original.id!)}
          onDelete={async () => {
            console.log('Deleting client:', row.original.id);
            await deleteClientMutate.mutateAsync(row.original.id!);
          }}
        />
      ),
    },
  ];

  const handleCreateNewClient = () => {
    navigate('/clients/new');
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/edit/${clientId}`);
  };

  return (
    <div className="flex flex-col">
      <Button
        onClick={handleCreateNewClient}
        className="mb-4 self-end"
        type="button"
      >
        <PlusCircle /> Add New Client
      </Button>
      <DataTable columns={columns} data={clients ?? []} />
    </div>
  );
}
