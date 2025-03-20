// These types are temporarily defined here but should be imported from the shared types file
// once they are properly defined with the backend models.

import { Job as JobSchema } from '@/schemas/job.types';
import { Team as TeamSchema } from '@/schemas/team.types';

export type JobStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type Team = TeamSchema;

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phone1: string;
  email?: string;
};

export type Address = {
  id: string;
  street: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
};

export type JobType = {
  id: string;
  name: string;
  short: string;
};

export type Job = JobSchema;

export type ViewType = 'month' | 'week' | 'day';

// Props for view components
export interface ViewProps {
  jobs: Job[];
  teams: Team[];
  currentDate: Date;
  onJobClick?: (jobId: string) => void;
  selectedJobId?: string | null;
  onDateSelect?: (date: Date) => void;
}
