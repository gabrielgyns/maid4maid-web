/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/utils';

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
  disabled?: boolean;
  classNames?: string;
};

export default function FormSwitchInput({
  form,
  name,
  label,
  formDescription,
  disabled = false,
  classNames,
}: FormSwitchInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            'flex flex-1 flex-row items-center justify-between gap-4 space-y-0 rounded-lg border p-4',
            classNames,
          )}
        >
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {formDescription && (
              <FormDescription>{formDescription}</FormDescription>
            )}
          </div>

          <FormControl>
            <Switch
              disabled={disabled}
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              aria-readonly
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
