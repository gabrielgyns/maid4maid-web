import { z } from 'zod';

export const organizationSchema = z.object({
  id: z.string(),
  logoUrl: z.string().optional(),
  name: z.string().min(1, 'Organization name is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  country: z.string().min(1, 'Country is required'),
  referralCode: z.string().optional(),
  referredByCode: z.string().optional(),
  additionalInformation: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});

export type Organization = z.infer<typeof organizationSchema>;
