/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Switch } from '../ui/switch';

type FormSwitchInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  formDescription?: string;
};

export default function FormSwitchInput({
  form,
  name,
  label,
  formDescription,
}: FormSwitchInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-1 flex-row items-center justify-center gap-4 space-y-0 rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {formDescription && (
              <FormDescription>{formDescription}</FormDescription>
            )}
          </div>

          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-readonly
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
