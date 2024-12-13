/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPinHouse } from 'lucide-react';
import { z } from 'zod';

import FormInput from '@/components/form/FormInput';
import FormSelectInput from '@/components/form/FormSelectInput';
import FormSwitchInput from '@/components/form/FormSwitchInput';
import FormTextareaInput from '@/components/form/FormTextareaInput';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAddresses } from '@/hooks/queries/useAddresses';
import { Address, addressSchema } from '@/schemas/address.types';
import { chargeByEnum, entryMethodEnum } from '@/schemas/common';

interface AddressFormProps {
  contentTrigger: React.ReactNode;
  address?: Address;
  clientId?: string;
  onSubmitNewClientAddress?: (data: Address) => void;
}

type FormData = z.infer<typeof addressSchema>;

export default function AddressForm({
  contentTrigger,
  address,
  clientId,
  onSubmitNewClientAddress,
}: AddressFormProps) {
  const [open, setOpen] = useState(false);

  const { updateAddressById, createAddress } = useAddresses();

  const form = useForm<FormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onBlur',
    defaultValues: address,
  });

  const handleFormSubmit = async (data: FormData) => {
    if (clientId) {
      if (address?.id) {
        await updateAddressById.mutateAsync(data);
      } else {
        await createAddress.mutateAsync({ clientId, addressData: data });
      }
    } else {
      // collect the data and send it to the parent component
      onSubmitNewClientAddress?.(data);
    }

    form.reset();
    setOpen(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <SheetTrigger asChild>{contentTrigger}</SheetTrigger>

      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        className="min-w-[35%] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <MapPinHouse className="h-6 w-6" />
            Address Information
          </SheetTitle>
          <SheetDescription>
            {address
              ? 'Update address information and save changes.'
              : !clientId
                ? "Addresses for new clients will be persisted after you save client's information."
                : 'Add a new address for a client.'}
          </SheetDescription>
        </SheetHeader>

        <Card className="mt-2 space-y-4 p-4">
          {/* TODO: All users DB should be with at least: House and Office options. */}
          <FormInput
            form={form}
            label="Address Type"
            name="addressType"
            disabled
          />

          <FormInput
            form={form}
            label="Reference (optional)"
            name="reference"
          />

          <FormInput form={form} label="Street*" name="street" />

          <FormInput
            form={form}
            label="Complement (optional)"
            name="complement"
          />

          <div className="grid grid-cols-3 gap-4">
            <FormInput form={form} label="City*" name="city" />
            <FormInput form={form} label="State*" name="state" />
            {/* TODO: ZipCode should have a mask in the future, based on the organization's country */}
            <FormInput form={form} label="Zip Code*" name="zipCode" />
          </div>

          <Separator />

          <div className="grid grid-cols-2 items-end gap-4">
            <FormSelectInput
              form={form}
              label="Charge By (optional)"
              name="chargeBy"
              options={Object.values(chargeByEnum.Values)}
            />

            <FormInput
              form={form}
              label="Charge Amount (optional)"
              name="chargeAmount"
            />
          </div>

          <div className="grid grid-cols-2 items-end gap-4">
            <FormSelectInput
              form={form}
              label="Entry Method (optional)"
              name="entryMethod"
              options={Object.values(entryMethodEnum.Values)}
            />
            <FormInput
              form={form}
              label="Entry Code (optional)"
              name="entryCode"
            />
          </div>

          <FormTextareaInput
            form={form}
            label="Other Information (optional)"
            name="otherInformation"
          />

          {/* TODO: Below... Latitude and Longitude */}
          {/* <div className="grid grid-cols-2 gap-4">
  <FormInput form={form} label="Entry Method" name="entry_method" />
  <FormInput form={form} label="Entry Code" name="entry_code" />
</div> */}

          <Separator />

          <div className="flex items-center justify-center gap-4">
            {/* grid grid-cols-2 gap-4 */}
            <FormSwitchInput form={form} name="isDefault" label="Is Default?" />

            <FormSwitchInput form={form} name="isBilling" label="Is Billing?" />
          </div>

          <Separator />

          <div className="flex justify-end gap-2">
            {/* TODO: Let the user know they gonna lost the filled inputs */}
            <Button
              variant="ghost"
              onClick={() => {
                form.reset();
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button
              disabled={updateAddressById.isPending || createAddress.isPending}
              onClick={form.handleSubmit(handleFormSubmit)}
            >
              {!address ? 'Add Address' : 'Save changes'}
            </Button>
          </div>
        </Card>
      </SheetContent>
    </Sheet>
  );
}
