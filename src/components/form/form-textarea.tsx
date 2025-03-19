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
  rightLabelElement?: React.ReactNode;
  formDescription?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'form'>;

const FormTextarea = ({
  form,
  name,
  label,
  rightLabelElement,
  formDescription,
  ...props
}: FormTextareaProps) => {
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

export default FormTextarea;
