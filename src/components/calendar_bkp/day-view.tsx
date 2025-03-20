import React from 'react';
import { format, isSameDay } from 'date-fns';

import { JobEvent } from './job-event';
import { Job, ViewProps } from './types/calendar.types';

export const DayView: React.FC<ViewProps> = ({
  currentDate,
  jobs,
  onJobClick,
  selectedJobId,
}) => {
  const HOURS_IN_DAY = 24;
  const HOUR_HEIGHT = 60; // pixels

  // Filter jobs for current date
  const dayJobs = jobs.filter((job) =>
    isSameDay(new Date(job.scheduledStartTime), currentDate),
  );

  // Generate hour rows for the day
  const hours = Array.from({ length: HOURS_IN_DAY }, (_, i) => i);

  // Calculate position and height for a job in the day view
  const getJobPosition = (job: Job) => {
    const startTime = new Date(job.scheduledStartTime);
    const endTime = new Date(job.scheduledEndTime);

    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();

    // Calculate position from the top (based on start time)
    const top = startHour * HOUR_HEIGHT + (startMinute / 60) * HOUR_HEIGHT;

    // Calculate the height (based on duration)
    const durationHours = endHour - startHour + (endMinute - startMinute) / 60;
    const height = Math.max(durationHours * HOUR_HEIGHT, 30); // Minimum height of 30px

    return { top, height };
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b py-2 text-center font-semibold">
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
      </div>

      <div className="relative flex flex-1">
        {/* Time column */}
        <div className="w-20 flex-shrink-0 border-r">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[60px] border-b pr-2 pt-0 text-right text-xs"
            >
              {hour === 0
                ? '12 AM'
                : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                    ? '12 PM'
                    : `${hour - 12} PM`}
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="relative flex-1">
          {/* Hour lines */}
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-b" />
          ))}

          {/* Current time indicator */}
          <div
            className="absolute left-0 right-0 z-10 border-t-2 border-red-500"
            style={{
              top: `${(new Date().getHours() + new Date().getMinutes() / 60) * HOUR_HEIGHT}px`,
            }}
          >
            <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500" />
          </div>

          {/* Job events */}
          {dayJobs.map((job) => {
            const { top, height } = getJobPosition(job);
            const team = job.team;

            return (
              <div
                key={job.id}
                className="absolute w-full px-2"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                }}
              >
                <JobEvent
                  job={job}
                  team={team}
                  onClick={onJobClick}
                  isSelected={selectedJobId === job.id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
