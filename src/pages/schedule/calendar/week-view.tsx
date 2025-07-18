import { useMemo } from 'react';
import {
  addHours,
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  format,
  getHours,
  getMinutes,
  isToday,
  startOfDay,
  startOfWeek,
} from 'date-fns';

import { Job } from '@/schemas/job.types';
import { cn } from '@/utils';

import { getSortedJobsForDay, separateJobsByTime } from './calendar-utils';
import { END_HOUR, HOUR_HEIGHT, START_HOUR } from './constants';
import { JobItem } from './job-item';
import { MoreJobsPopover } from './more-jobs-popover';

interface WeekViewProps {
  currentDate: Date;
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

interface PositionedJob {
  job: Job;
  top: number;
  height: number;
  dayIndex: number;
}

export function WeekView({ currentDate, jobs, onJobSelect }: WeekViewProps) {
  const days = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  }, [currentDate]);

  const hours = useMemo(() => {
    const dayStart = startOfDay(new Date());
    return eachHourOfInterval({
      start: addHours(dayStart, START_HOUR),
      end: addHours(dayStart, END_HOUR - 1),
    });
  }, []);

  // Get jobs without time for the week (all-day section)
  const jobsWithoutTime = useMemo(() => {
    return days.map((day) => {
      const dayJobs = getSortedJobsForDay(jobs, day);
      const { withoutTime } = separateJobsByTime(dayJobs);
      return withoutTime;
    });
  }, [jobs, days]);

  // Get positioned jobs with time for each day
  const positionedJobs = useMemo(() => {
    const positioned: PositionedJob[] = [];

    days.forEach((day, dayIndex) => {
      const dayJobs = getSortedJobsForDay(jobs, day);
      const { withTime } = separateJobsByTime(dayJobs);

      withTime.forEach((job) => {
        const startTime = new Date(job.scheduledStartTime!);
        const endTime = new Date(job.scheduledEndTime!);

        const startHour = getHours(startTime) + getMinutes(startTime) / 60;
        const endHour = getHours(endTime) + getMinutes(endTime) / 60;

        // Calculate position within the visible hours
        const top = (startHour - START_HOUR) * HOUR_HEIGHT;
        const height = (endHour - startHour) * HOUR_HEIGHT;

        // Only show if within visible hours
        if (startHour >= START_HOUR && startHour < END_HOUR) {
          positioned.push({
            job,
            top: Math.max(0, top),
            height: Math.max(30, height), // Minimum height
            dayIndex,
          });
        }
      });
    });

    return positioned;
  }, [jobs, days]);

  const hasJobsWithoutTime = jobsWithoutTime.some(
    (dayJobs) => dayJobs.length > 0,
  );

  return (
    <div data-slot="week-view" className="flex h-full flex-col bg-background">
      {/* Header with days */}
      <div className="sticky top-0 z-30 grid grid-cols-[120px_repeat(7,minmax(0,1fr))] border-b border-border bg-background shadow-sm">
        <div className="flex items-center justify-center border-r border-border px-2 py-3">
          <span className="text-xs font-medium text-muted-foreground">
            {format(currentDate, 'O')}
          </span>
        </div>

        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              'flex flex-col items-center justify-center border-r border-border px-2 py-3 last:border-r-0',
              isToday(day) && 'bg-blue-50 dark:bg-blue-950/20',
            )}
          >
            <div className="text-xs font-medium uppercase text-muted-foreground">
              <span className="hidden sm:inline">{format(day, 'EEE')}</span>
              <span className="sm:hidden">{format(day, 'E')[0]}</span>
            </div>
            <div
              className={cn(
                'mt-1 flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold',
                isToday(day) ? 'bg-blue-600 text-white' : 'text-foreground',
              )}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Jobs without time section */}
      {hasJobsWithoutTime && (
        <div className="border-b border-border bg-muted/50">
          <div className="grid grid-cols-[120px_repeat(7,minmax(0,1fr))]">
            <div className="flex items-center border-r border-border px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                Jobs without defined time
              </span>
            </div>

            {days.map((day, dayIndex) => {
              const dayJobsWithoutTime = jobsWithoutTime[dayIndex];

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    'relative min-h-[80px] border-r border-border p-2 last:border-r-0',
                    isToday(day) && 'bg-blue-50/30 dark:bg-blue-950/10',
                  )}
                >
                  <div className="space-y-1">
                    {dayJobsWithoutTime.slice(0, 6).map((job, index) => (
                      <JobItem
                        key={job.id || index}
                        view="week-no-time"
                        job={job}
                        onClick={(e) => {
                          e.stopPropagation();
                          onJobSelect(job);
                        }}
                        className="w-full text-xs"
                      />
                    ))}

                    <MoreJobsPopover
                      jobs={dayJobsWithoutTime || []}
                      onJobSelect={onJobSelect}
                      maxVisible={6}
                      view="week-no-time"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Time grid */}
      <div className="grid flex-1 grid-cols-[120px_repeat(7,minmax(0,1fr))] pt-3">
        {/* Time column */}
        <div className="grid auto-cols-fr border-r">
          {hours.map((hour) => (
            <div
              key={hour.toString()}
              className="relative border-b border-border/70 last:border-b-0"
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span className="absolute -top-3 left-0 flex h-6 w-16 max-w-full items-center justify-end bg-background pe-2 text-[10px] text-muted-foreground/70 sm:pe-4 sm:text-xs">
                {getHours(hour) === 0
                  ? '12 AM'
                  : getHours(hour) === 12
                    ? '12 PM'
                    : getHours(hour) < 12
                      ? `${getHours(hour)} AM`
                      : `${getHours(hour) - 12} PM`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, dayIndex) => (
          <div
            key={day.toString()}
            className={cn(
              'relative border-r border-border last:border-r-0',
              isToday(day) && 'bg-blue-50/20 dark:bg-blue-950/10',
            )}
          >
            {/* Time grid cells */}
            {hours.map((hour) => {
              const hourValue = getHours(hour);

              return (
                <div
                  key={hour.toString()}
                  className="relative border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/30"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  onClick={() => {
                    const startTime = new Date(day);
                    startTime.setHours(hourValue, 0, 0, 0);
                  }}
                >
                  {/* Hour divider line */}
                  <div className="absolute left-0 right-0 top-0 h-px bg-border/30" />

                  {/* Quarter-hour subtle guides */}
                  <div className="absolute left-0 right-0 top-1/4 h-px bg-border/10" />
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-border/20" />
                  <div className="absolute left-0 right-0 top-3/4 h-px bg-border/10" />
                </div>
              );
            })}

            {/* Positioned jobs with time */}
            {positionedJobs
              .filter((positioned) => positioned.dayIndex === dayIndex)
              .map((positioned) => (
                <div
                  key={positioned.job.id}
                  className="absolute left-1 right-1 z-10"
                  style={{
                    top: `${positioned.top + 2}px`,
                    height: `${Math.max(positioned.height - 4, 30)}px`,
                  }}
                >
                  <JobItem
                    view="week"
                    job={positioned.job}
                    onClick={(e) => {
                      e.stopPropagation();
                      onJobSelect(positioned.job);
                    }}
                    className="h-full w-full rounded-md shadow-sm"
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
