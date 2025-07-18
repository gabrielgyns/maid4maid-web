import { useMemo } from 'react';
import { addDays, format, isToday } from 'date-fns';
import { CalendarDaysIcon } from 'lucide-react';

import { Job } from '@/schemas/job.types';
import { cn } from '@/utils';

import { getJobsForDay } from './calendar-utils';
import { AGENDA_DAYS_TO_SHOW } from './constants';
import { JobItem } from './job-item';

interface AgendaViewProps {
  currentDate: Date;
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

export function AgendaView({
  currentDate,
  jobs,
  onJobSelect,
}: AgendaViewProps) {
  const days = useMemo(() => {
    return Array.from({ length: AGENDA_DAYS_TO_SHOW }, (_, i) =>
      addDays(new Date(currentDate), i),
    );
  }, [currentDate]);

  const handleJobClick = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    onJobSelect(job);
  };

  const hasEvents = days.some((day) => getJobsForDay(jobs, day).length > 0);

  return (
    <div className="border-t border-border/70 ps-4">
      {!hasEvents ? (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <CalendarDaysIcon
            size={32}
            className="mb-2 text-muted-foreground/50"
          />
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground">
            There are no jobs scheduled for this time period.
          </p>
        </div>
      ) : (
        days.map((day) => {
          const dayJobs = getJobsForDay(jobs, day);

          if (dayJobs.length === 0) return null;

          return (
            <div
              key={day.toString()}
              className="relative my-12 border-t border-border/70"
            >
              <span
                className={cn(
                  'absolute -top-3 left-0 flex h-6 items-center bg-background pe-4 !text-lg uppercase sm:pe-4 sm:text-xs',
                  { 'font-medium text-primary': isToday(day) },
                )}
                data-today={isToday(day) || undefined}
              >
                {format(day, 'd MMM, EEEE')}
              </span>
              <div className="mt-6 space-y-2">
                {dayJobs.map((job) => (
                  <JobItem
                    key={job.id}
                    view="agenda"
                    job={job}
                    onClick={(e) => handleJobClick(job, e)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
