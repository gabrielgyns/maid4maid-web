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
import { Textarea } from '../ui/textarea';

type FormTextareaProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  formDescription?: string;
} & Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, 'form'>;

const FormTextareaInput = ({
  form,
  name,
  label,
  formDescription,
  ...props
}: FormTextareaProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FormControl>
            <Textarea {...field} {...props} />
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

export default FormTextareaInput;
