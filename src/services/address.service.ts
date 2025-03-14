import { Address } from '@/schemas/address.types';

import api from './api.service';

export const addressService = {
  async getAddresses() {
    const { data } = await api.get<Address[]>('/addresses');

    return data;
  },

  async getAddressById(addressId: string) {
    const { data } = await api.get<Address>(`/addresses/${addressId}`);

    return data;
  },

  async getAddressesByClientId(clientId: string) {
    const { data } = await api.get<Address[]>(`/clients/${clientId}/addresses`);

    return data;
  },

  // This address will be created for a specific client always.
  // When the client is new (not created yet), the address will go with the client (in POST /clients).
  async createAddress(clientId: string, addressData: Address) {
    const { data } = await api.post<Address>('/addresses', {
      address: addressData,
      clientId,
    });

    return data;
  },

  async updateAddressById(addressData: Address) {
    const { data } = await api.put<Address>(
      `/addresses/${addressData.id}`,
      addressData,
    );

    return data;
  },

  async deleteAddressById(addressId: string) {
    const { data } = await api.delete<Address>(`/addresses/${addressId}`);

    return data;
  },
};
