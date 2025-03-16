/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Upload } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getInitialsFromName } from '@/utils';

type FormAvatarInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  firstName?: string;
  lastName?: string;
  formDescription?: string;
  disabled?: boolean;
};

export default function FormAvatarInput({
  form,
  name,
  label,
  firstName,
  lastName,
  formDescription,
  disabled = false,
}: FormAvatarInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const photoUrl = form.getValues('photoUrl') as string | undefined;
    const file = form.getValues(name) as File | undefined;

    if (file instanceof File) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (photoUrl) {
      setPreviewUrl(photoUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [form, name]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    form.setValue(name, file);
  };

  const initials =
    firstName && lastName
      ? getInitialsFromName(`${firstName} ${lastName}`)
      : getInitialsFromName('User');

  return (
    <FormField
      control={form.control}
      name={name}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="flex flex-col items-center space-y-4">
          <FormLabel>{label}</FormLabel>

          <Avatar className="h-24 w-24">
            <AvatarImage src={previewUrl || undefined} alt="User avatar" />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>

          <FormControl>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                disabled={disabled}
                onChange={handleFileChange}
                {...field}
              />
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => {
                  document.getElementById('avatar-upload')?.click();
                }}
                className="h-8 px-3 text-xs"
              >
                <Upload className="mr-2 h-3.5 w-3.5" />
                Upload Photo
              </Button>
            </div>
          </FormControl>

          {formDescription && (
            <FormDescription className="text-center text-xs">
              {formDescription}
            </FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
