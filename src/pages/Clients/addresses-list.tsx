import { Pencil, Trash2 } from 'lucide-react';

import Badge from '@/components/badge.tsx';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Address } from '@/schemas/address.types';

import AddressForm from './address-form';

interface AddressesListProps {
  addresses: Address[];
  clientId?: string;
  onEditAddress: (address: Address) => void;
  onDeleteAddress: (addressId: string) => void;
}

export function AddressesList({
  addresses,
  clientId,
  onEditAddress,
  onDeleteAddress,
}: AddressesListProps) {
  return (
    <>
      {addresses.length === 0 && <NoAddressesList />}

      {addresses.map((address, index) => {
        const addressId = clientId ? address.id : address.tempId;

        return (
          <Card
            key={addressId}
            className="mb-3 flex items-start justify-between p-4"
          >
            <div>
              <div className="space-x-2">
                {address.isDefault && <Badge text="Default" className="mb-1" />}
                {address.isBilling && (
                  <Badge text="Billing" variant="success" className="mb-1" />
                )}
              </div>

              {/* TODO: Add names/nicks/apelidos for the addresses (if it's nice to have) */}
              <h3 className="font-bold">Address {index + 1}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {`${address.street}, ${address.complement} - ${address.city}, ${address.state}, ${address.zipCode}`}
              </p>
            </div>

            <div className="flex gap-2">
              <AddressForm
                contentTrigger={
                  <Button size="icon" variant="outline">
                    <Pencil />
                  </Button>
                }
                clientId={clientId}
                address={address}
                onSubmitNewClientAddress={onEditAddress}
              />

              <ConfirmDialog
                title="Delete Address"
                description="Are you sure? This action cannot be undone."
                onConfirm={() => onDeleteAddress(addressId as string)}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  //   disabled={
                  //     deleteAddressById?.isPending &&
                  //     deleteAddressById.variables.addressId === address.id
                  //   }
                >
                  {/* {deleteAddressById?.isPending &&
                  deleteAddressById.variables.addressId === address.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 />
                  )} */}
                  <Trash2 />
                </Button>
              </ConfirmDialog>
            </div>
          </Card>
        );
      })}
    </>
  );
}

const NoAddressesList = () => {
  return (
    <div className="flex-1">
      <div className="relative">
        <div className="space-y-3 blur-[2px]">
          {[1, 2].map((index) => (
            <Card
              className="mb-3 flex items-start justify-between p-4"
              key={`placeholder-${index}`}
            >
              <div>
                <div className="space-x-2">
                  <Badge text="Default" variant="default" className="mb-1" />

                  <Badge text="Billing" variant="success" className="mb-1" />
                </div>
                <h3 className="font-bold">Address {index}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  123 Sample Street, Apt 4B - City, State, 12345
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => {}}
                  disabled
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => {}}
                  disabled
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-lg px-6 py-3 shadow-sm ring-1 ring-gray-200">
            <p className="text-lg font-medium">No addresses yet 😢</p>
          </div>
        </div>
      </div>
    </div>
  );
};
