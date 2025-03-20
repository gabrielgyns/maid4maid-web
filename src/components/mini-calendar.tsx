import { useMemo } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Job } from '@/schemas/job.types';
import { cn } from '@/utils';

import { Button } from './ui/button';

interface MiniCalendarProps {
  jobs?: Job[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDateSelect?: (date: Date) => void;
}

export const MiniCalendar = ({
  jobs = [],
  currentDate,
  onDateChange,
  onDateSelect,
}: MiniCalendarProps) => {
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth);
  const endDate = endOfWeek(lastDayOfMonth);

  const days = useMemo(
    () => eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate],
  );

  const hasJobsOnDate = (date: Date) => {
    return jobs.some((job) => isSameDay(job.scheduledStartTime, date));
  };

  const handlePreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  return (
    <div className="w-full max-w-[300px] rounded-lg border bg-white p-3 shadow dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const dayHasJobs = hasJobsOnDate(day);
          const isSelected = isSameDay(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <Button
              key={i}
              variant="ghost"
              size="icon"
              className={cn(
                'relative h-8 w-8 p-0 font-normal',
                !isCurrentMonth && 'text-gray-300 dark:text-gray-600',
                isSelected &&
                  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                isTodayDate &&
                  !isSelected &&
                  'font-bold text-blue-700 dark:text-blue-400',
              )}
              onClick={() => onDateSelect?.(day)}
            >
              <span>{format(day, 'd')}</span>
              {dayHasJobs && isCurrentMonth && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600 dark:bg-blue-500" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
