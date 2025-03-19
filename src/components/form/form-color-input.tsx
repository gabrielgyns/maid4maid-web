/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
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

export const DEFAULT_COLOR = '#2563EB';
export const PRESET_COLORS = [
  { value: '#2563EB', name: 'Blue' },
  { value: '#16A34A', name: 'Green' },
  { value: '#DC2626', name: 'Red' },
  { value: '#CA8A04', name: 'Yellow' },
  { value: '#9333EA', name: 'Purple' },
  { value: '#EA580C', name: 'Orange' },
  { value: '#0EA5E9', name: 'Sky Blue' },
  { value: '#14B8A6', name: 'Teal' },
  { value: '#EC4899', name: 'Pink' },
  { value: '#6366F1', name: 'Indigo' },
  { value: '#8B5CF6', name: 'Violet' },
  { value: '#84CC16', name: 'Lime' },
  { value: '#6B7280', name: 'Gray' },
  { value: '#171717', name: 'Black' },
];

type FormColorInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  rightLabelElement?: React.ReactNode;
  formDescription?: string;
  showPresets?: boolean;
};

const FormColorInput = ({
  form,
  name,
  label,
  rightLabelElement,
  formDescription,
  showPresets = true,
}: FormColorInputProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const currentColor = (field.value as string) || DEFAULT_COLOR;
        const currentColorName =
          PRESET_COLORS.find((c) => c.value === currentColor)?.name || '';

        return (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel>{label}</FormLabel>
              {rightLabelElement}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <FormControl>
                  <div
                    className="h-10 w-10 cursor-pointer rounded-md border border-input shadow-sm"
                    style={{ backgroundColor: currentColor }}
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                  >
                    <Input
                      type="color"
                      {...field}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      value={currentColor}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setIsPickerOpen(false);
                      }}
                    />
                  </div>
                </FormControl>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={currentColor}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="font-mono uppercase"
                  maxLength={7}
                />
                {currentColorName && (
                  <span className="text-xs text-muted-foreground">
                    {currentColorName}
                  </span>
                )}
              </div>
            </div>

            {showPresets && (
              <div className="mt-2 rounded-md border border-border p-3">
                <div className="mb-3 text-xs text-muted-foreground">
                  Preset Colors:
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => field.onChange(color.value)}
                      className={`h-8 w-8 rounded-md border transition-all hover:scale-110 ${
                        currentColor === color.value
                          ? 'ring-2 ring-ring ring-offset-1'
                          : 'border-input'
                      } `}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      aria-label={`Color ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {formDescription && (
              <FormDescription>{formDescription}</FormDescription>
            )}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormColorInput;
