import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { JobForm, JobStatus } from '@/schemas/job.types';
import { jobService } from '@/services/job.service';

export interface JobFilters {
  teamId?: string;
  status?: JobStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const JOBS_KEYS = {
  all: ['jobs'] as const,
  lists: () => [...JOBS_KEYS.all, 'list'] as const,
  list: (filters: JobFilters) => [...JOBS_KEYS.lists(), { filters }] as const,
  details: () => [...JOBS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...JOBS_KEYS.details(), id] as const,
  types: () => [...JOBS_KEYS.all, 'types'] as const,
};

/**
 * Hook to fetch all jobs
 */
export const useJobs = (filters?: JobFilters) => {
  return useQuery({
    queryKey: [...JOBS_KEYS.lists(), { filters }],
    queryFn: async () => await jobService.getAll(filters),
  });
};

/**
 * Hook to fetch a job by ID
 */
export const useJob = (id: string) => {
  return useQuery({
    queryKey: JOBS_KEYS.detail(id),
    queryFn: () => jobService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new job
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobForm>) => jobService.create(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.all });
    },
  });
};

/**
 * Hook to update a job
 */
export const useUpdateJob = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<JobForm>) => jobService.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.all });
    },
  });
};

/**
 * Hook to delete a job
 */
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.lists() });
    },
  });
};

/**
 * Hook to fetch all job types
 */
export const useJobTypes = () => {
  return useQuery({
    queryKey: JOBS_KEYS.types(),
    queryFn: async () => await jobService.getJobTypes(),
  });
};
