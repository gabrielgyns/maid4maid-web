import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils';

export type ComboboxOption<T = unknown> = {
  value: string;
  label: string;
  /** Data is an optional field to store the original data */
  data?: T;
};

interface ComboboxProps<T = unknown>
  extends React.HTMLAttributes<HTMLButtonElement> {
  options: ComboboxOption<T>[];
  placeholder?: string;
  searchPlaceholder?: string;
  notFoundMessage?: string;
  /** The width of the popover search input */
  popoverSearchWidth?: string;
  value?: string | null;
  onValueChange: (option: ComboboxOption<T> | null) => void;
  disabled?: boolean;
  /** Whether to allow clearing the selected option by selecting the same option */
  allowClear?: boolean;
  /** Whether to search by 'value' or 'label'. Default is 'label' */
  searchBy?: 'value' | 'label';
}

export function Combobox<T = unknown>({
  options,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search an option...',
  notFoundMessage = 'No option found.',
  popoverSearchWidth = 'w-[20rem]',
  value,
  onValueChange,
  disabled = false,
  allowClear = false,
  searchBy = 'label',
  className,
  ...props
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value],
  );

  const handleSelect = (currentValue: string) => {
    if (currentValue === value) {
      if (allowClear) {
        onValueChange(null);
      }
    } else {
      const selectedOption = options.find(
        (option) => option.value === currentValue,
      );
      onValueChange(selectedOption || null);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-full justify-between', className)}
          {...props}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn('p-0', popoverSearchWidth)}>
        <Command className="flex">
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{notFoundMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={searchBy === 'label' ? option.label : option.value}
                  onSelect={(searchValue) => {
                    // Find the option by the search criteria
                    const foundOption = options.find((opt) =>
                      searchBy === 'label'
                        ? opt.label.toLowerCase() === searchValue.toLowerCase()
                        : opt.value === searchValue,
                    );

                    if (foundOption) {
                      handleSelect(foundOption.value);
                    }
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Utility function to create a ComboboxOption from an item
 * @param item - The item to create a ComboboxOption from
 * @param getValue - A function to get the value of the item
 * @param getLabel - A function to get the label of the item
 * @returns A ComboboxOption
 */
export const createComboboxOption = <T,>(
  item: T,
  getValue: (item: T) => string,
  getLabel: (item: T) => string,
): ComboboxOption<T> => ({
  value: getValue(item),
  label: getLabel(item),
  data: item,
});

/**
 * Utility function to create an array of ComboboxOptions from an array of items
 * @param items - The items to create ComboboxOptions from
 * @param getValue - A function to get the value of the item
 * @param getLabel - A function to get the label of the item
 * @returns An array of ComboboxOptions
 */
export const createComboboxOptions = <T,>(
  items: T[],
  getValue: (item: T) => string,
  getLabel: (item: T) => string,
): ComboboxOption<T>[] => {
  return items.map((item) => createComboboxOption(item, getValue, getLabel));
};
