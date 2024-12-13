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
  options: any[];
  label: string;
  placeholder?: string;
  formDescription?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'>;

export default function FormSelectInput({
  form,
  name,
  label,
  options,
  formDescription,
  placeholder = 'Select an option',
}: FormInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-col">
          <FormLabel>{label}</FormLabel>

          <p>{field.value}</p>

          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((value) => (
                <SelectItem key={value} value={value}>
                  {transformConstant(value)}
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
