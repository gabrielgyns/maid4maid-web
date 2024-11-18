import { useQuery } from '@tanstack/react-query';

import { clientService } from '@/services/client.service';

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

// export function useCreateClient() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (clientData: Client) => clientService.createClient(clientData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['clients'] });
//     },
//   });
// }

// export function useUpdateClient() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
//       clientService.updateClientById(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['clients'] });
//     },
//   });
// }

// export function useDeleteClient() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (clientId: string) => clientService.deleteClientById(clientId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['clients'] });
//     },
//   });
// }
