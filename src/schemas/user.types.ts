export interface UserProfile {
  id: string;
  role: string;
  organizationId: string;
  avatar_url: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  login: string;
}
