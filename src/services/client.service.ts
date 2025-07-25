import { Client } from '@/schemas/client.types';

import api from './api.service';

export const clientService = {
  async getClients() {
    const { data } = await api.get<Client[]>('/clients');

    return data;
  },

  async getClientById(clientId: string) {
    const { data } = await api.get<Client>(`/clients/${clientId}`);

    return data;
  },

  async createClient(clientData: Partial<Client>) {
    const addressesWithTempIds = clientData.addresses?.map((address) => {
      const { tempId: _tempId, ...restAddress } = address;

      return {
        ...restAddress,
        tempId: address.id,
      };
    });

    const { data } = await api.post<Client>('/clients', {
      ...clientData,
      addresses: addressesWithTempIds,
    });

    return data;
  },

  async updateClientById(clientData: Partial<Client>) {
    const { data } = await api.put<Client>(
      `/clients/${clientData.id}`,
      clientData,
    );

    return data;
  },

  async deleteClientById(clientId: string) {
    const { data } = await api.delete<Client>(`/clients/${clientId}`);

    return data;
  },
};
