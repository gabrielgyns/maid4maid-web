import { z } from 'zod';

import { addressSchema } from './address.types';
import { clientSchema } from './client.types';
import { teamSchema } from './team.types';
import { userSchema } from './user.types';

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
  id: z.string().uuid(),
  name: z.string(),
  short: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

const baseJobSchema = z.object({
  id: z.string().optional(),
  status: z.nativeEnum(JobStatus).default(JobStatus.SCHEDULED),
  date: z.coerce.date(),
  order: z.number().optional(),
  scheduledStartTime: z
    .string()
    .regex(timeRegex, 'Invalid time format')
    .optional(),
  scheduledEndTime: z
    .string()
    .regex(timeRegex, 'Invalid time format')
    .optional(),
  trackedStartTime: z
    .string()
    .regex(timeRegex, 'Invalid time format')
    .optional(),
  trackedEndTime: z.string().regex(timeRegex, 'Invalid time format').optional(),
  chargeAmount: z.string().optional(),
  chargeBy: z.nativeEnum(ChargeBy).optional(),
  otherInformation: z.string().optional(),
  isPaid: z.boolean().default(false),
  cancelReason: z.string().optional(),

  // Form fields (IDs instead of objects)
  jobTypeId: z.string().uuid().optional(),
  clientId: z.string().uuid(),
  addressId: z.string().uuid(),
  teamId: z.string().uuid(),
  createdById: z.string().uuid().optional(),
});

export const jobFormSchema = baseJobSchema.transform((data) => {
  const combineDateAndTime = (
    date: Date,
    time?: string,
  ): string | undefined => {
    if (!time) return undefined;
    const [hours, minutes, seconds = '00'] = time.split(':');
    const combined = new Date(date);
    combined.setHours(
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds || '0'),
      0,
    );
    return combined.toISOString();
  };

  return {
    ...data,
    scheduledStartTime: combineDateAndTime(data.date, data.scheduledStartTime),
    scheduledEndTime: combineDateAndTime(data.date, data.scheduledEndTime),
  };
});

export const jobSchema = baseJobSchema
  .extend({
    jobType: jobTypeSchema.optional(),
    client: clientSchema,
    address: addressSchema,
    team: teamSchema,
    createdBy: userSchema.optional(),
  })
  .omit({
    jobTypeId: true,
    clientId: true,
    addressId: true,
    teamId: true,
    createdById: true,
  });

export type Job = z.infer<typeof jobSchema>;
export type JobType = z.infer<typeof jobTypeSchema>;
export type JobForm = z.infer<typeof jobFormSchema>;
