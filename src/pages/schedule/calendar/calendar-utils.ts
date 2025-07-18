import { isSameDay } from 'date-fns';

import { Job, JobStatus } from '@/schemas/job.types';

/**
 * Verifica se um job tem horário agendado
 */
export function hasScheduledTime(job: Job): boolean {
  return Boolean(job.scheduledStartTime && job.scheduledEndTime);
}

/**
 * Verifica se um job está em um dia específico
 */
export function isJobOnDay(job: Job, day: Date): boolean {
  return isSameDay(new Date(job.date), day);
}

/**
 * Filtra jobs para um dia específico
 */
export function getJobsForDay(jobs: Job[], day: Date): Job[] {
  return jobs.filter((job) => isJobOnDay(job, day));
}

/**
 * Ordena jobs por prioridade:
 * 1. Jobs com horário agendado (ordenados por horário de início)
 * 2. Jobs sem horário agendado (ordenados por status e order)
 */
export function sortJobs(jobs: Job[]): Job[] {
  return [...jobs].sort((a, b) => {
    const aHasTime = hasScheduledTime(a);
    const bHasTime = hasScheduledTime(b);

    // Prioridade 1: Jobs com horário vêm primeiro
    if (aHasTime && !bHasTime) return -1;
    if (!aHasTime && bHasTime) return 1;

    // Prioridade 2: Entre jobs com horário, ordenar por horário de início
    if (aHasTime && bHasTime) {
      const aStartTime = new Date(a.scheduledStartTime!).getTime();
      const bStartTime = new Date(b.scheduledStartTime!).getTime();
      return aStartTime - bStartTime;
    }

    // Prioridade 3: Entre jobs sem horário, ordenar por status e order
    if (!aHasTime && !bHasTime) {
      const statusOrder: Record<JobStatus, number> = {
        [JobStatus.SCHEDULED]: 0,
        [JobStatus.IN_PROGRESS]: 1,
        [JobStatus.COMPLETED]: 2,
        [JobStatus.CANCELLED]: 3,
      };

      const aStatusOrder = statusOrder[a.status];
      const bStatusOrder = statusOrder[b.status];

      if (aStatusOrder !== bStatusOrder) {
        return aStatusOrder - bStatusOrder;
      }

      // Se mesmo status, ordenar por order
      return (a.order || 0) - (b.order || 0);
    }

    return 0;
  });
}

/**
 * Obtém jobs ordenados para um dia específico
 */
export function getSortedJobsForDay(jobs: Job[], day: Date): Job[] {
  const dayJobs = getJobsForDay(jobs, day);
  return sortJobs(dayJobs);
}

/**
 * Separa jobs com e sem horário agendado
 */
export function separateJobsByTime(jobs: Job[]): {
  withTime: Job[];
  withoutTime: Job[];
} {
  const withTime = jobs.filter(hasScheduledTime);
  const withoutTime = jobs.filter((job) => !hasScheduledTime(job));

  return {
    withTime: withTime.sort((a, b) => {
      const aTime = new Date(a.scheduledStartTime!).getTime();
      const bTime = new Date(b.scheduledStartTime!).getTime();
      return aTime - bTime;
    }),
    withoutTime: withoutTime.sort((a, b) => (a.order || 0) - (b.order || 0)),
  };
}

/**
 * Obtém jobs para uma semana específica
 */
export function getJobsForWeek(
  jobs: Job[],
  startOfWeek: Date,
  endOfWeek: Date,
): Job[] {
  return jobs.filter((job) => {
    const jobDate = new Date(job.date);
    return jobDate >= startOfWeek && jobDate <= endOfWeek;
  });
}

/**
 * Agrupa jobs por dia
 */
export function groupJobsByDay(jobs: Job[]): Map<string, Job[]> {
  const grouped = new Map<string, Job[]>();

  jobs.forEach((job) => {
    const dayKey = new Date(job.date).toDateString();
    const existingJobs = grouped.get(dayKey) || [];
    grouped.set(dayKey, [...existingJobs, job]);
  });

  // Ordenar jobs dentro de cada dia
  grouped.forEach((dayJobs, day) => {
    grouped.set(day, sortJobs(dayJobs));
  });

  return grouped;
}

/**
 * Formata horário de um job
 */
export function formatJobTime(job: Job): string | null {
  if (!hasScheduledTime(job)) return null;

  const startTime = new Date(job.scheduledStartTime!);
  const endTime = new Date(job.scheduledEndTime!);

  const formatTime = (date: Date) => {
    return date
      .toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Verifica se um job está no passado
 */
export function isJobInPast(job: Job): boolean {
  const now = new Date();
  const endTime = hasScheduledTime(job)
    ? new Date(job.scheduledEndTime!)
    : new Date(job.date);

  return endTime < now;
}
