import React from 'react';
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from 'date-fns';

import { cn } from '@/utils';

import { JobEvent } from './job-event';
import { ViewProps } from './types/calendar.types';

export const WeekView: React.FC<ViewProps> = ({
  currentDate,
  jobs,
  onJobClick,
  selectedJobId,
}) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const today = new Date();

  const getJobsForDay = (date: Date) =>
    jobs.filter((job) => isSameDay(new Date(job.scheduledStartTime), date));

  return (
    <div className="grid flex-1 grid-cols-7">
      {days.map((day, idx) => (
        <div
          key={idx}
          className={cn(
            'min-h-screen border-b border-r first:border-l',
            isSameDay(day, today) && 'bg-blue-50 dark:bg-blue-950',
          )}
        >
          <div className="border-b p-2 text-center">
            <div
              className={cn(
                'text-sm font-medium',
                isSameDay(day, today) && 'text-blue-700 dark:text-blue-300',
              )}
            >
              {format(day, 'EEE')}
            </div>

            <div
              className={cn(
                'text-lg',
                isSameDay(day, today) && 'text-blue-700 dark:text-blue-300',
              )}
            >
              {format(day, 'd')}
            </div>
          </div>

          <div className="space-y-2 p-2">
            {getJobsForDay(day).map((job) => {
              const team = job.team;
              return (
                <JobEvent
                  key={job.id}
                  job={job}
                  team={team}
                  compact
                  onClick={onJobClick}
                  isSelected={selectedJobId === job.id}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
