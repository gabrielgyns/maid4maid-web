import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { CreateJobInput, Job } from '@/schemas/job.types';
import { jobService } from '@/services/job.service';

export const JOBS_KEYS = {
  all: ['jobs'] as const,
  lists: () => [...JOBS_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...JOBS_KEYS.lists(), { filters }] as const,
  details: () => [...JOBS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...JOBS_KEYS.details(), id] as const,
  types: () => [...JOBS_KEYS.all, 'types'] as const,
};

/**
 * Hook to fetch all jobs
 */
export const useJobs = () => {
  return useQuery({
    queryKey: JOBS_KEYS.lists(),
    queryFn: async () => await jobService.getAll(),
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
    mutationFn: (data: CreateJobInput) => jobService.create(data),
    onSuccess: async () => {
      toast.success('Job created successfully');
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.lists() });
    },
    onError: (error) => {
      toast.error(
        `Failed to create job: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    },
  });
};

/**
 * Hook to update a job
 */
export const useUpdateJob = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Job>) => jobService.update(id, data),
    onSuccess: async () => {
      toast.success('Job updated successfully');
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.detail(id) });
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.lists() });
    },
    onError: (error) => {
      toast.error(
        `Failed to update job: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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
      toast.success('Job deleted successfully');
      await queryClient.invalidateQueries({ queryKey: JOBS_KEYS.lists() });
    },
    onError: (error) => {
      toast.error(
        `Failed to delete job: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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
