/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  Loader2,
  MapPin,
  NotepadText,
  PlusCircle,
  User,
  UserPen,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { FloatingActionBar } from '@/components/floating-action-bar';
import { DatePickerInput } from '@/components/form/date-picker-input';
import FormInput from '@/components/form/form-input';
import FormSelectInput from '@/components/form/form-select-input';
import FormSwitchInput from '@/components/form/form-switch-input';
import FormTextareaInput from '@/components/form/form-textarea-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useAddresses } from '@/hooks/queries/use-addresses';
import { Address } from '@/schemas/address.types';
import { Client, clientFormSchema } from '@/schemas/client.types';
import {
  paymentMethodEnum,
  preferredDayEnum,
  preferredFrequencyEnum,
} from '@/schemas/commons';
import { cn } from '@/utils';

import ConfirmDialog from '../../components/confirm-dialog';
import AddressForm from './address-form';
import { AddressesList } from './addresses-list';

type FormData = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  client?: Client;
  addresses?: Address[];
  isLoading?: boolean;
  onSubmit: (data: FormData) => Promise<void>;
  onDelete?: (clientId: string) => Promise<void>;
}

export function ClientForm({
  client,
  addresses,
  isLoading = false,
  onSubmit,
  onDelete,
}: ClientFormProps) {
  const navigate = useNavigate();

  const [newAddresses, setNewAddresses] = useState<Address[]>([]);

  const { deleteAddressById } = useAddresses(); // Im using in here, but actually should have come from the parent component.

  const form = useForm<FormData>({
    resolver: zodResolver(clientFormSchema),
    mode: 'onBlur',
    values: client,
  });

  const handleUpdateNewClientAddress = (address: Address) => {
    const newAddressessFiltered = newAddresses.filter(
      (addr) => addr.tempId !== address.tempId,
    );

    setNewAddresses([...newAddressessFiltered, address]);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (client?.id) {
      await deleteAddressById.mutateAsync({ addressId, clientId: client.id });
    } else {
      setNewAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address.tempId !== addressId),
      );
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (client?.id) {
      await onSubmit(data);
    } else {
      await onSubmit({ ...data, addresses: newAddresses });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="mb-16 flex gap-4 px-10"
        >
          <div className="flex-1 space-y-4">
            <h3 className="flex items-center gap-2 text-3xl font-semibold">
              <UserPen className="h-7 w-7" />
              Client Information
            </h3>

            {/* Personal Information */}
            <Card className="space-y-4 p-4">
              <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
                <User className="h-5 w-5" />
                Personal Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormInput form={form} label="First name" name="firstName" />
                <FormInput form={form} label="Last name" name="lastName" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  label="Email"
                  name="email"
                  type="email"
                />

                <DatePickerInput
                  form={form}
                  label="Birth date"
                  name="birthday"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput form={form} label="Primary Phone" name="phone1" />
                <FormInput form={form} label="Secondary Phone" name="phone2" />
              </div>
            </Card>

            {/* Service Preferences */}
            <Card className="space-y-4 p-4">
              <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
                <NotepadText className="h-5 w-5" />
                Service Preferences
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <FormSelectInput
                  form={form}
                  label="Preferred Frequency"
                  name="preferredFrequency"
                  options={Object.values(preferredFrequencyEnum.Values).map(
                    (value) => ({
                      id: value,
                      name: value,
                    }),
                  )}
                />

                <FormSelectInput
                  form={form}
                  label="Preferred Day"
                  name="preferredDay"
                  options={Object.values(preferredDayEnum.Values).map(
                    (value) => ({
                      id: value,
                      name: value,
                    }),
                  )}
                />
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="space-y-4 p-4">
              <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h3>

              <FormSelectInput
                form={form}
                label="Preferred Payment Method"
                name="preferredPaymentMethod"
                options={Object.values(paymentMethodEnum.Values).map(
                  (value) => ({
                    id: value,
                    name: value,
                  }),
                )}
              />

              <FormTextareaInput
                form={form}
                label="Other details"
                name="paymentInformation"
              />
            </Card>

            {/* Additional Information */}
            <Card className="space-y-4 p-4">
              <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
                <PlusCircle className="h-5 w-5" />
                Additional Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <DatePickerInput
                  form={form}
                  label="Client since"
                  name="clientSince"
                />

                <FormInput form={form} label="Source" name="source" />
              </div>

              <FormTextareaInput
                form={form}
                label="Other information"
                name="otherInformation"
              />

              <FormSwitchInput
                form={form}
                name="isActive"
                label="Is client active?"
                formDescription="If the client is not active, it will not be able to schedule services."
              />
            </Card>
          </div>

          {/* Addresses Informations */}
          <div className="flex-1">
            <div className="flex items-center justify-between pb-4">
              <h3 className="flex items-center gap-2 text-3xl font-semibold">
                <MapPin className="h-7 w-7" />
                Address Information
              </h3>

              <AddressForm
                contentTrigger={
                  <Button size="sm" variant="outline">
                    <PlusCircle />
                    New Address
                  </Button>
                }
                clientId={client?.id}
                onSubmitNewClientAddress={(newAddress: Address) =>
                  setNewAddresses((prevAddresses) => [
                    ...prevAddresses,
                    { ...newAddress, tempId: uuidv4() },
                  ])
                }
              />
            </div>

            <AddressesList
              addresses={(client?.id ? addresses : newAddresses) || []}
              clientId={client?.id}
              onEditAddress={handleUpdateNewClientAddress}
              onDeleteAddress={handleDeleteAddress}
            />
          </div>

          <FloatingActionBar>
            <div
              className={cn('flex flex-1 justify-between', {
                'justify-end': !client?.id,
              })}
            >
              {client?.id && (
                <ConfirmDialog
                  onConfirm={() => onDelete && onDelete(client.id as string)}
                  title={'Delete Client'}
                  description="Are you sure you want to delete this client? This action cannot be undone."
                >
                  <Button size="sm" variant="destructive">
                    Delete Client
                  </Button>
                </ConfirmDialog>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    navigate('/clients');
                  }}
                >
                  Cancel
                </Button>

                <Button size="sm" type="submit" disabled={isLoading}>
                  Save Changes
                  {isLoading && (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          </FloatingActionBar>
        </form>
      </Form>
    </>
  );
}
