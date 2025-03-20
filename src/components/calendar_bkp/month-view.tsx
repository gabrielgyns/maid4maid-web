import React, { useState } from 'react';
import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subDays,
} from 'date-fns';
import { X } from 'lucide-react';

import { cn } from '@/utils';

import { JobEvent } from './job-event';
import { ViewProps } from './types/calendar.types';

export const MonthView: React.FC<ViewProps> = ({
  currentDate,
  jobs,
  onJobClick,
  selectedJobId,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const today = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);

  // Calculate days from previous month to fill the first week
  const dayOfWeek = getDay(firstDayOfMonth);
  const startDay = subDays(firstDayOfMonth, dayOfWeek);

  // Create a grid with 6 weeks (42 days) to ensure consistent height
  const endDay = addDays(startDay, 41);

  const days = eachDayOfInterval({ start: startDay, end: endDay });

  const getJobsForDay = (date: Date) =>
    jobs.filter((job) => isSameDay(new Date(job.scheduledStartTime), date));

  // Configure how many jobs to show based on screen size
  const MAX_JOBS_TO_DISPLAY = 8; // Show up to 8 jobs, then show "+X more" button

  // Determine max jobs for each row to ensure consistent row heights
  const getRowMaxJobs = (weekStartIdx: number) => {
    // Look at all days in this week (7 days)
    let maxJobs = 0;
    for (let i = 0; i < 7; i++) {
      if (weekStartIdx + i < days.length) {
        const dayJobs = getJobsForDay(days[weekStartIdx + i]).length;
        maxJobs = Math.max(maxJobs, dayJobs);
      }
    }
    return maxJobs;
  };

  // Calculate consistent height for a row based on max jobs in that row
  const getRowHeight = (weekStartIdx: number) => {
    const maxJobsInRow = getRowMaxJobs(weekStartIdx);
    const baseHeight = 150; // Base height for cells with no jobs
    const jobHeight = 35; // Approximate height per job
    const maxJobsForHeight = 8; // Max number of jobs to consider for height
    const actualJobs = Math.min(maxJobsInRow, maxJobsForHeight);

    // Calculate height based on job count (minimum 150px)
    const height = Math.max(baseHeight, baseHeight + actualJobs * jobHeight);
    return height;
  };

  // Get the job container height (subtract padding/header)
  const getJobContainerHeight = (rowHeight: number) => {
    return rowHeight - 50; // Subtract space for day header and padding
  };

  const handleViewMore = (day: Date) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDay(null);
  };

  const selectedDayJobs = selectedDay ? getJobsForDay(selectedDay) : [];

  return (
    <>
      <div className="grid h-full grid-cols-7">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="sticky top-0 z-10 border-b bg-background p-2 text-center font-medium"
          >
            {day}
          </div>
        ))}

        {/* Calendar days - grouped by weeks for consistent row heights */}
        {Array.from({ length: 6 }).map((_, weekIdx) => {
          const weekStartIdx = weekIdx * 7;
          const rowHeight = getRowHeight(weekStartIdx);
          const containerHeight = getJobContainerHeight(rowHeight);

          return days
            .slice(weekStartIdx, weekStartIdx + 7)
            .map((day, dayIdx) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, today);
              const dayJobs = getJobsForDay(day);

              return (
                <div
                  key={`${weekIdx}-${dayIdx}`}
                  className={cn(
                    'border p-1',
                    // Use consistent height for the entire row
                    `h-[${rowHeight}px]`,
                    !isCurrentMonth &&
                      'bg-gray-50 text-gray-400 dark:bg-gray-900 dark:text-gray-500',
                    isToday && 'bg-blue-50 dark:bg-blue-950',
                  )}
                >
                  <div className="mb-1 flex min-h-[28px] items-center justify-between">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isToday &&
                          'flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white',
                      )}
                    >
                      {format(day, 'd')}
                    </span>

                    {isCurrentMonth && dayJobs.length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {dayJobs.length} jobs
                      </span>
                    )}
                  </div>

                  {/* Job container with consistent height within row */}
                  <div
                    className={cn(
                      'space-y-1 overflow-y-auto',
                      `max-h-[${containerHeight}px]`,
                    )}
                    style={{
                      scrollbarWidth: 'thin',
                      msOverflowStyle: 'none',
                    }}
                  >
                    {dayJobs.slice(0, MAX_JOBS_TO_DISPLAY).map((job) => {
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

                    {dayJobs.length > MAX_JOBS_TO_DISPLAY && (
                      <button
                        className="mt-1 w-full rounded bg-blue-50 py-1 text-center text-xs text-blue-600 hover:text-blue-800 dark:bg-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
                        onClick={() => handleViewMore(day)}
                      >
                        +{dayJobs.length - MAX_JOBS_TO_DISPLAY} more
                      </button>
                    )}
                  </div>
                </div>
              );
            });
        })}
      </div>

      {/* View more modal */}
      {showModal && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800 dark:text-white">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
              <h3 className="text-lg font-semibold">
                Jobs for {format(selectedDay, 'MMMM d, yyyy')}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {selectedDayJobs.length > 0 ? (
                selectedDayJobs.map((job) => {
                  const team = job.team;
                  return (
                    <JobEvent
                      key={job.id}
                      job={job}
                      team={team}
                      onClick={onJobClick}
                      isSelected={selectedJobId === job.id}
                    />
                  );
                })
              ) : (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No jobs for this day
                </p>
              )}
            </div>
            <div className="border-t px-4 py-3 dark:border-gray-700">
              <button
                onClick={closeModal}
                className="w-full rounded bg-gray-200 py-2 text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
