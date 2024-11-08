export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  settings?: {
    timezone?: string;
    dateFormat?: string;
    currency?: string;
  };
  logo_url?: string;
  created_at: string;
  updated_at: string;
}
