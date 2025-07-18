import { enUS, es, ptBR } from 'react-day-picker/locale';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Address } from '@/schemas/address.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsFromName(name = '??') {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
}

export function transformConstant(constant: string): string {
  return constant
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getFullAddress(address: Address) {
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
}

export function getDayPickerLocale(locale: string) {
  switch (locale) {
    case 'pt':
      return ptBR;
    case 'es':
      return es;
    default:
      return enUS;
  }
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
