import { z } from 'zod';

import { rolesEnum } from './commons';

export interface UserProfile {
  id: string;
  role: {
    id: string;
    name: string;
    permissions: Record<string, boolean>;
  };
  organizationId: string;
  avatar_url: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  login: string;
}

export const userSchema = z.object({
  id: z.string().optional(),
  photoUrl: z.string().url().optional(),
  role: rolesEnum.optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  login: z.string().min(3, 'Login should have at least 3 characters'),
  isDriver: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLoginAt: z.union([z.string(), z.date()]).optional(),
  defaultTeamId: z.string().optional(),
  roleId: z.string().optional(),
  file: z.instanceof(File).optional(),
});

export type User = z.infer<typeof userSchema>;
