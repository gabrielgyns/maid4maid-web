import { z } from 'zod';

import { organizationSchema } from '@/schemas/organization.types';
import { userSchema } from '@/schemas/user.types';

// Used basically for the Organization Step validation .
export const registrationOrgSchema = organizationSchema.omit({ id: true });

// Used basically for the Master User Step validation.
// We removed the password field from the userSchema
// because we want to use only in the registration form.
export const registrationUserSchema = userSchema
  .extend({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string(),
  })
  .omit({ id: true })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export const formSchema = z.object({
  organization: registrationOrgSchema,
  userMaster: registrationUserSchema,
  // plan: z.object({})
});
