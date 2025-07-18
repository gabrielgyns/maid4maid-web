import { useMemo } from 'react';
import { format, getMinutes, isPast } from 'date-fns';

import { Job } from '@/schemas/job.types';
import { cn } from '@/utils';

import { CalendarView } from './job-calendar';

// Format time with optional minutes (e.g., "2pm" or "2:30pm")
const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, getMinutes(date) === 0 ? 'ha' : 'h:mma').toLowerCase();
};

interface JobItemProps {
  view: CalendarView;
  job?: Job;
  isDragging?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  className?: string;
}

export function JobItem({ view, job, onClick, className }: JobItemProps) {
  if (!job) {
    return (
      <div className="flex h-6 items-center justify-center rounded bg-muted/50 px-2 text-xs text-muted-foreground">
        No job data
      </div>
    );
  }

  const fullName = `${job.client.firstName} ${job.client.lastName}`;
  const fullAddress = `${job.address.street} ${job.address.complement || ''} - ${job.address.city}, ${job.address.state}`;

  const displayStart = job.scheduledStartTime
    ? new Date(job.scheduledStartTime)
    : new Date(job.date);
  const displayEnd = job.scheduledEndTime
    ? new Date(job.scheduledEndTime)
    : new Date(job.date);
  const showTime = job.scheduledStartTime && job.scheduledEndTime;

  if (view === 'month') {
    return (
      <JobWrapper
        job={job}
        onClick={onClick}
        className={cn('items-center text-sm', className)}
      >
        <span className="flex items-center truncate">
          {showTime && (
            <span className="mr-1 truncate font-normal uppercase opacity-70 sm:text-xs">
              {formatTimeWithOptionalMinutes(displayStart)}
            </span>
          )}

          {fullName || fullAddress}
        </span>
      </JobWrapper>
    );
  }

  if (view === 'week') {
    return (
      <JobWrapper
        job={job}
        onClick={onClick}
        className={cn(
          'flex-col justify-start py-1 text-xs',
          view === 'week' ? 'text-[10px] sm:text-xs' : 'text-xs',
          className,
        )}
      >
        <span className="truncate text-base font-medium">{fullName}</span>

        {showTime && (
          <div className="truncate text-sm font-normal uppercase opacity-70">
            {formatTimeWithOptionalMinutes(displayStart)} -{' '}
            {formatTimeWithOptionalMinutes(displayEnd)}
          </div>
        )}

        <span className="mt-1 truncate text-sm text-muted-foreground">
          {fullAddress}
        </span>
      </JobWrapper>
    );
  }

  if (view === 'week-no-time') {
    return (
      <JobWrapper
        job={job}
        onClick={onClick}
        className={cn(
          'flex-col justify-start py-1 text-xs',
          `transition-all duration-300 will-change-transform hover:scale-x-100 hover:transform`,
          'hover:translate-x-2',
          className,
        )}
      >
        <div className="flex flex-col gap-1 py-1 font-medium">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-base font-bold">
              {fullName || `< Client Name >`}
            </span>

            <span
              className={cn(
                'text-[10px] text-muted-foreground',
                `rounded-full px-1.5 py-0.5`,
              )}
              style={{
                backgroundColor: `${job.team.color}20`,
              }}
            >
              #{job.team.name}
            </span>
          </div>

          <span className="truncate text-sm text-muted-foreground">
            {fullAddress}
          </span>
        </div>
      </JobWrapper>
    );
  }

  // Agenda View
  return (
    <JobWrapper
      job={job}
      onClick={onClick}
      className={cn(
        'flex-col justify-start py-1 text-xs',
        `transition-all duration-300 will-change-transform hover:scale-x-100 hover:transform`,
        'hover:translate-x-2',
        className,
      )}
    >
      <div className="flex flex-col gap-1 py-2 font-medium">
        <span className="text-base font-bold">
          {fullName || `<Client Name>`}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {showTime
              ? `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(displayEnd)}`
              : 'No start and end time provided.'}
          </span>
          <span className="flex items-center text-sm text-muted-foreground">
            #{job.team.name}
          </span>
        </div>
        <span className="truncate text-sm text-muted-foreground">
          {fullAddress}
        </span>
      </div>
    </JobWrapper>
  );
}

interface JobWrapperProps {
  job: Job;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
  currentTime?: Date;
  teamColor?: string;
}

function JobWrapper({ job, onClick, className, children }: JobWrapperProps) {
  const isJobInPast = useMemo(() => {
    const endTime = job.scheduledEndTime
      ? new Date(job.scheduledEndTime)
      : new Date(job.date);

    return isPast(endTime);
  }, [job]);

  const teamColor = job.team.color;

  return (
    <button
      className={cn(
        'flex h-full w-full select-none overflow-hidden rounded px-1 text-left font-medium outline-none',
        'rounded-sm border border-l-8 transition focus-visible:ring-2 focus-visible:ring-ring sm:px-2',
        `transition-all duration-300 will-change-transform hover:scale-x-105 hover:transform`,
        isJobInPast && 'line-through opacity-80',
        className,
      )}
      style={{
        borderColor: teamColor,
        backgroundColor: `${teamColor}20`,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
