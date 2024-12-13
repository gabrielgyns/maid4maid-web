import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Client } from '@/schemas/client.types';
import { clientService } from '@/services/client.service';

// TODO: review all the keys, don't need all of them I guess
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

export function useClients() {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: () => clientService.getClients(),
  });
}

export function useClient(clientId?: string) {
  return useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => clientService.getClientById(clientId as string),
    enabled: !!clientId,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientData: Partial<Client>) =>
      clientService.createClient(clientData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Client>) => clientService.updateClientById(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => clientService.deleteClientById(clientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}
