/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

type FormInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  rightLabelElement?: React.ReactNode;
  type?: string;
  formDescription?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'form'>;

const FormInput = ({
  form,
  name,
  label,
  rightLabelElement,
  type = 'text',
  formDescription,
  ...props
}: FormInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label}</FormLabel>
            {rightLabelElement}
          </div>

          <FormControl>
            <Input type={type} {...field} {...props} />
          </FormControl>

          {formDescription && (
            <FormDescription>{formDescription}</FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
