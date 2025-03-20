import { CreateJobInput, Job, JobType } from '@/schemas/job.types';

import api from './api.service';

const BASE_URL = '/jobs';
const JOB_TYPES_URL = '/job-types';

export const jobService = {
  async getAll(): Promise<Job[]> {
    const { data } = await api.get<Job[]>(BASE_URL);
    return data;
  },

  async getById(id: string): Promise<Job> {
    const { data } = await api.get<Job>(`${BASE_URL}/${id}`);
    return data;
  },

  async create(jobData: CreateJobInput): Promise<Job> {
    const { data } = await api.post<Job>(BASE_URL, jobData);
    return data;
  },

  async update(id: string, jobData: Partial<Job>): Promise<Job> {
    const { data } = await api.put<Job>(`${BASE_URL}/${id}`, jobData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  async getJobTypes(): Promise<JobType[]> {
    const { data } = await api.get<JobType[]>(JOB_TYPES_URL);
    return data;
  },

  async createJobType(jobTypeData: Omit<JobType, 'id'>): Promise<JobType> {
    const { data } = await api.post<JobType>(JOB_TYPES_URL, jobTypeData);
    return data;
  },

  async updateJobType(
    id: string,
    jobTypeData: Partial<JobType>,
  ): Promise<JobType> {
    const { data } = await api.put<JobType>(
      `${JOB_TYPES_URL}/${id}`,
      jobTypeData,
    );
    return data;
  },

  async deleteJobType(id: string): Promise<void> {
    await api.delete(`${JOB_TYPES_URL}/${id}`);
  },
};
