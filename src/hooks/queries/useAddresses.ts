import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Address } from '@/schemas/address.types';
import { addressService } from '@/services/address.service';

const addressKeys = {
  all: ['addresses'],
  byClientId: (clientId: string) => ['addresses', { clientId }],
  detail: (id: string) => ['address', id],
};

export const useAddresses = () => {
  const queryClient = useQueryClient();

  // const getAddresses = useQuery({
  //   queryKey: addressKeys.all,
  //   queryFn: () => addressService.getAddresses(),
  // });

  const useAddressesByClientId = (clientId?: string) =>
    useQuery({
      queryKey: addressKeys.byClientId(clientId as string),
      queryFn: () => addressService.getAddressesByClientId(clientId as string),
      enabled: !!clientId,
    });

  // const useAddressById = (addressId: string) =>
  //   useQuery({
  //     queryKey: addressKeys.detail(addressId),
  //     queryFn: () => addressService.getAddressById(addressId),
  //     enabled: !!addressId,
  //   });

  const createAddress = useMutation({
    mutationFn: ({
      clientId,
      addressData,
    }: {
      clientId: string;
      addressData: Address;
    }) => addressService.createAddress(clientId, addressData),
    onSuccess: async (_data, { clientId }) => {
      await queryClient.invalidateQueries({
        queryKey: addressKeys.byClientId(clientId),
      });
    },
  });

  const updateAddressById = useMutation({
    mutationFn: (address: Address) => addressService.updateAddressById(address),
    onSuccess: async (_data, { clientId }) => {
      await queryClient.invalidateQueries({
        queryKey: addressKeys.byClientId(clientId as string),
      });
    },
  });

  const deleteAddressById = useMutation({
    mutationFn: ({ addressId }: { addressId: string; clientId: string }) =>
      addressService.deleteAddressById(addressId),
    onSuccess: async (_data, { clientId }) => {
      await queryClient.invalidateQueries({
        queryKey: addressKeys.byClientId(clientId),
      });
    },
  });

  return {
    // getAddresses,
    // getAddressById: useAddressById,
    getAddressesByClientId: useAddressesByClientId,
    createAddress,
    updateAddressById,
    deleteAddressById,
  };
};
