import { type ClassValue,clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
