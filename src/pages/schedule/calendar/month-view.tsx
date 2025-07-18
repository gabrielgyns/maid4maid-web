import { useMemo } from 'react';
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import { Job } from '@/schemas/job.types';
import { cn } from '@/utils';

import { getSortedJobsForDay } from './calendar-utils';
import { JobItem } from './job-item';
import { MoreJobsPopover } from './more-jobs-popover';

interface Props {
  currentDate: Date;
  jobs?: Job[];
  onJobSelect?: (job: Job) => void;
}
export function MonthView({ currentDate, jobs, onJobSelect }: Props) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);

    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date()), i);
      return format(date, 'EEE');
    });
  }, []);

  const weeks = useMemo(() => {
    const result = [];
    let week = [];

    for (let i = 0; i < days.length; i++) {
      week.push(days[i]);
      if (week.length === 7 || i === days.length - 1) {
        result.push(week);
        week = [];
      }
    }

    return result;
  }, [days]);

  return (
    <div data-slot="month-view" className="contents">
      {/* HEADER - WEEKDAYS */}
      <div className="grid grid-cols-7 border-y uppercase">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm text-muted-foreground/70"
          >
            {day}
          </div>
        ))}
      </div>

      {/* BODY - DAYS */}
      <div className="grid flex-1 auto-rows-fr">
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className="grid grid-cols-7 [&:last-child>*]:border-b-0"
          >
            {week.map((day) => {
              if (!day) return null;

              const isCurrentMonth = isSameMonth(day, currentDate);
              const dayJobs = getSortedJobsForDay(jobs || [], day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'min-h-[120px] border-b border-r p-1 last:border-r-0',
                    !isCurrentMonth && 'bg-muted/25 text-muted-foreground/70',
                  )}
                >
                  {/* Day number */}
                  <div
                    className={cn(
                      'mb-1 inline-flex size-6 items-center justify-center text-sm',
                      isToday(day)
                        ? 'rounded-full bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground/70',
                    )}
                  >
                    {format(day, 'd')}
                  </div>

                  {/* Jobs for this day */}
                  {!!dayJobs && dayJobs.length > 0 && (
                    <div className="space-y-1">
                      {dayJobs?.slice(0, 5).map((job, index) => (
                        <JobItem
                          key={job.id || index}
                          view="month"
                          job={job}
                          onClick={(e) => {
                            e.stopPropagation();
                            onJobSelect?.(job);
                          }}
                        />
                      ))}

                      <MoreJobsPopover
                        jobs={dayJobs || []}
                        onJobSelect={onJobSelect}
                        maxVisible={5}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
