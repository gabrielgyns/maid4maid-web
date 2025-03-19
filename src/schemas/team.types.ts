import { z } from 'zod';

import { DEFAULT_COLOR } from '@/components/form/form-color-input';

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Team name is required' }),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6})$/, {
      message: 'Color must be a valid hex color code (e.g., #2563EB)',
    })
    .default(DEFAULT_COLOR),
  isActive: z.boolean().default(true),
  organizationId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Team = z.infer<typeof teamSchema>;
