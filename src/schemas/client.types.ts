import { z } from 'zod';

import { addressSchema } from './address.types';
import {
  paymentMethodEnum,
  preferredDayEnum,
  preferredFrequencyEnum,
} from './commons';

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  photoUrl: z.string().url().optional(),
  firstName: z.string(),
  lastName: z.string(),
  birthday: z.date().optional(),
  phone1: z.string(),
  phone2: z.string().optional(),
  email: z.string().email().optional(),
  addresses: z
    .array(addressSchema)
    .optional()
    .transform((value) => value || []),
  preferredFrequency: preferredFrequencyEnum.optional(),
  preferredDay: preferredDayEnum.optional(),
  paymentMethod: paymentMethodEnum.optional(),
  paymentInformation: z.string().optional(),
  clientSince: z.date().optional(),
  source: z.string().optional(),
  otherInformation: z.string().optional(),
  isActive: z.boolean().default(true),
  organizationId: z.string().uuid(),
});

export type Client = z.infer<typeof clientSchema>;

export const clientFormSchema = clientSchema.omit({
  organizationId: true, // The organizationId will be set by cookies information
});
