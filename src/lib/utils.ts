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

// utils/form.ts
import { z } from 'zod';

/**
 * Cleans form data by removing null, undefined, empty strings, empty arrays, and empty objects from the input data based on a Zod schema.
 * @template T - Generic type extending z.ZodObject for type safety
 * @param {T} schema - The Zod schema object used to validate and transform the data
 * @param {z.infer<T>} data - The input data to be cleaned
 * @returns {Partial<z.infer<T>>} A new object containing only non-empty values that conform to the schema
 *
 * @example
 * const userSchema = z.object({
 *   name: z.string(),
 *   email: z.string(),
 *   age: z.number().optional()
 * });
 *
 * const data = {
 *   name: "John",
 *   email: "",
 *   age: null
 * };
 *
 * const cleaned = cleanFormData(userSchema, data);
 * // Result: { name: "John" }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cleanFormData = <T extends z.ZodObject<any>>(
  schema: T,
  data: z.infer<T>,
): Partial<z.infer<T>> => {
  const cleanSchema = schema.partial().transform((obj) => {
    const clean = {} as z.infer<T>;

    for (const [key, value] of Object.entries(obj)) {
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0) &&
        !(
          value &&
          typeof value === 'object' &&
          Object.keys(value as object).length === 0
        )
      ) {
        (clean as Record<string, unknown>)[key] = value;
      }
    }

    return clean;
  });

  return cleanSchema.parse(data);
};
