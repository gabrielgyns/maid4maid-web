/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { UseFormReturn } from 'react-hook-form';

import { transformConstant } from '@/utils';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type FormInputProps = {
  form: UseFormReturn<any>;
  name: string;
  options: { id: string; name: string }[];
  label: string;
  placeholder?: string;
  formDescription?: string;
  classNames?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'>;

export default function FormSelectInput({
  form,
  name,
  label,
  options,
  formDescription,
  placeholder = 'Select an option',
  classNames,
  disabled,
}: Omit<FormInputProps, 'className'>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={classNames}>
          <FormLabel>{label}</FormLabel>

          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="!mt-0.5">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {transformConstant(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {formDescription && (
            <FormDescription>{formDescription}</FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
