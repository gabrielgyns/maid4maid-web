import { useNavigate, useParams } from 'react-router-dom';

import { useAddresses } from '@/hooks/queries/use-addresses';
import {
  useClient,
  useCreateClient,
  useDeleteClient,
  useUpdateClient,
} from '@/hooks/queries/use-clients';
import { useToast } from '@/hooks/use-toast';
import { Address } from '@/schemas/address.types';
import { Client } from '@/schemas/client.types';

import { ClientForm } from './client-form';

// I could be importing the ClientForm directly instead of have a ClientDetails component
// but I think separating the concerns is better for now.
export default function ClientsDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: client,
    isLoading: isClientLoading,
    // error: isClientError,
  } = useClient(id);

  const { getAddressesByClientId } = useAddresses();

  const {
    data: addresses,
    isLoading: isAddressesLoading,
    // error: addressesError,
  } = getAddressesByClientId(id);

  // mutations - TODO: Improve this, the hooks, etc
  const updateClientMutate = useUpdateClient();
  const createClientMutate = useCreateClient();
  const deleteClientMutate = useDeleteClient();

  const handleSubmit = async (data: Partial<Client>) => {
    if (id) {
      await updateClientMutate.mutateAsync({ id, ...data });
    } else {
      await createClientMutate.mutateAsync(data);
    }

    navigate('/clients');

    toast({
      title: 'Clients',
      description: 'Client saved successfully',
    });
  };

  const handleDelete = async (clientId: string) => {
    await deleteClientMutate.mutateAsync(clientId);

    navigate('/clients');

    toast({
      title: 'Clients',
      description: 'Client deleted successfully',
    });
  };

  if (isClientLoading || isAddressesLoading) return <div>Loading...</div>; // TODO: Loader Component... Create a Skeleton where show Skeleton for address or client

  // Normalizes client data by replacing null values with undefined.
  const normalizedDataClient = {
    ...Object.fromEntries(
      Object.entries(client || {}).map(([key, value]) => [
        key,
        value ?? undefined,
      ]),
    ),
  };

  // Normalizes address data by replacing null values with undefined.
  const normalizedDataAddresses = addresses?.map((address) =>
    Object.fromEntries(
      Object.entries(address).map(([key, value]) => [key, value ?? undefined]),
    ),
  );

  return (
    <ClientForm
      client={normalizedDataClient as Client}
      addresses={normalizedDataAddresses as Address[]}
      isLoading={updateClientMutate.isPending || createClientMutate.isPending}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}
