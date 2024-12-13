import { z } from 'zod';

import { chargeByEnum, entryMethodEnum } from './commons';

export const addressTypeSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  organizationId: z.string(),
});

export type AddressType = z.infer<typeof addressTypeSchema>;

export const addressSchema = z.object({
  id: z.string().uuid().optional(),
  tempId: z.string().uuid().optional(), // Only used in Frontend for new addresses
  clientId: z.string().uuid().optional(),
  addressTypeId: z.string().uuid().optional(),
  reference: z.string().optional(),
  street: z.string(),
  complement: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  isDefault: z.boolean().default(false),
  isBilling: z.boolean().default(false),
  chargeAmount: z
    .string()
    .transform((value) => Number(value))
    .optional(),
  chargeBy: chargeByEnum.optional(),
  entryMethod: entryMethodEnum.optional(),
  entryCode: z.string().optional(),
  otherInformation: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean().default(true),
  lastUsedAt: z.date().optional(),
});

export type Address = z.infer<typeof addressSchema>;
