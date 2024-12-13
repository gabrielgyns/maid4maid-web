import { useEffect, useState } from 'react';

import { transformConstant } from '@/lib/utils';

import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface SelectInputProps {
  options: string[];
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
}

export function SelectInput({
  name,
  label,
  options,
  defaultValue,
  placeholder = 'Select an option',
  ...rest
}: SelectInputProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={name}>{label}</Label>}

      <Select value={value} onValueChange={setValue} name={name} {...rest}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((value: string) => (
            <SelectItem key={value} value={value}>
              {transformConstant(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
