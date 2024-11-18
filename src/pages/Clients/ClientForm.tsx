/* eslint-disable @typescript-eslint/no-misused-promises */
// import { Dialog } from "@/components/ui/dialog";

import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreditCard,
  MapPin,
  NotepadText,
  PlusCircle,
  User,
} from 'lucide-react';
import { z } from 'zod';

import { ActionsCell } from '@/components/DataTable/ActionsCell';
import { DatePickerInput } from '@/components/form/DatePickerInput';
import FormInput from '@/components/form/FormInput';
import FormSelectInput from '@/components/form/FormSelectInput';
import FormSwitchInput from '@/components/form/FormSwitchInput';
import FormTextareaInput from '@/components/form/FormTextareaInput';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { TableCell, TableRow } from '@/components/ui/table';
import { useClient } from '@/hooks/queries';
import { Address } from '@/schemas/address.types';
import { clientSchema } from '@/schemas/client.types';
import {
  paymentMethodEnum,
  preferredDayEnum,
  preferredFrequencyEnum,
} from '@/schemas/common';

type FormData = z.infer<typeof clientSchema>;

export function ClientForm() {
  const { id } = useParams();

  const {
    data: client,
    // isLoading,
    // error,
  } = useClient(id);

  console.log('GSS client', client);

  const form = useForm<FormData>({
    resolver: zodResolver(clientSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // await register(data);
    console.log('GSS data', data);
  };

  const renderTableRow = (
    item: Address,
    newAddress = false,
    index?: number,
  ) => (
    <TableRow
      className={`w-full ${newAddress && 'bg-primary-foreground'}`}
      key={item.id || index}
    >
      <TableCell className="w-[30%] text-center">{item.street}</TableCell>
      <TableCell className="w-[30%] text-center">{item.complement}</TableCell>
      <TableCell className="w-[15%] text-center">{item.city}</TableCell>
      <TableCell className="w-[10%] text-center">{item.state}</TableCell>
      <TableCell className="w-[10%] text-center">{item.zipCode}</TableCell>
      <TableCell className="w-[5%] text-center">
        <ActionsCell
          onEdit={() => console.log(item)}
          onDelete={() => console.log((item?.id || index) as string)}
          row={{
            original: undefined,
          }}
        />
      </TableCell>
    </TableRow>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="m-4 grid grid-cols-2 gap-8"
      >
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
            <User className="h-5 w-5" />
            Personal Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <FormInput form={form} label="First name" name="firstName" />
            <FormInput form={form} label="Last name" name="lastName" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput form={form} label="Email" name="email" type="email" />

            <DatePickerInput form={form} label="Birth date" name="birthday" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput form={form} label="Primary Phone" name="phone1" />
            <FormInput form={form} label="Secondary Phone" name="phone2" />
          </div>
          <Separator />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
            <MapPin className="h-5 w-5" />
            Address Information
          </h3>

          {renderTableRow(client?.addresses[0] || ({} as Address), false, 0)}
          <Separator />
        </div>

        {/* Service Preferences */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
            <NotepadText className="h-5 w-5" />
            Service Preferences
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <FormSelectInput
              form={form}
              label="Preferred Frequency"
              name="preferredFrequency"
              options={Object.values(preferredFrequencyEnum.Values)}
            />

            <FormSelectInput
              form={form}
              label="Preferred Day"
              name="preferredDay"
              options={Object.values(preferredDayEnum.Values)}
            />
          </div>
          <Separator />
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </h3>

          <FormSelectInput
            form={form}
            label="Preferred Payment Method"
            name="preferredPaymentMethod"
            options={Object.values(paymentMethodEnum.Values)}
          />

          <FormTextareaInput
            form={form}
            label="Other details"
            name="paymentInformation"
          />
          <Separator />
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
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
        </div>
      </form>
    </Form>
  );
}
