import { z } from 'zod';

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Team name is required' }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  organizationId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Team = z.infer<typeof teamSchema>;
