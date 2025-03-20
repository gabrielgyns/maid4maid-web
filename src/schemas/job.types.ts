import { z } from 'zod';

import { addressSchema } from './address.types';
import { clientSchema } from './client.types';
import { teamSchema } from './team.types';

export enum JobStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ChargeBy {
  FIXED = 'FIXED',
  PRESET_HOURS = 'PRESET_HOURS',
  WORKED_HOURS = 'WORKED_HOURS',
  PRESET_CLEANER_HOURS = 'PRESET_CLEANER_HOURS',
  WORKED_CLEANER_HOURS = 'WORKED_CLEANER_HOURS',
}

export const jobTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  short: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export const jobSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(JobStatus),
  date: z.string().datetime().optional(),
  scheduledStartTime: z.string().datetime(),
  scheduledEndTime: z.string().datetime(),
  trackedStartTime: z.string().datetime().optional(),
  trackedEndTime: z.string().datetime().optional(),
  chargeAmount: z.number().optional(),
  chargeBy: z.nativeEnum(ChargeBy).optional(),
  otherInformation: z.string().optional(),
  isPaid: z.boolean().default(false),
  cancelReason: z.string().optional(),

  jobType: jobTypeSchema,
  client: clientSchema,
  address: addressSchema,
  team: teamSchema,
});

export const createJobSchema = z.object({
  status: z.nativeEnum(JobStatus).default(JobStatus.SCHEDULED),
  scheduledStartTime: z.string().datetime(),
  scheduledEndTime: z.string().datetime(),
  chargeAmount: z.number().optional(),
  chargeBy: z.nativeEnum(ChargeBy).optional(),
  otherInformation: z.string().optional(),
  isPaid: z.boolean().default(false),

  jobTypeId: z.string(),
  clientId: z.string(),
  addressId: z.string(),
  teamId: z.string(),
});

export type Job = z.infer<typeof jobSchema>;
export type JobType = z.infer<typeof jobTypeSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
