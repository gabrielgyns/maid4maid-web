import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Job } from '@/schemas/job.types';
import { cn } from '@/utils';

import { CalendarView } from './job-calendar';
import { JobItem } from './job-item';

interface MoreJobsPopoverProps {
  jobs: Job[];
  onJobSelect?: (job: Job) => void;
  maxVisible: number;
  view: CalendarView;
}

export function MoreJobsPopover({
  jobs,
  onJobSelect,
  maxVisible = 5,
  view = 'month',
}: MoreJobsPopoverProps) {
  const remainingJobs = jobs.slice(maxVisible);

  if (remainingJobs.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            '!mt-2.5 w-full rounded-md border border-primary/30 py-1 text-center text-xs text-foreground transition-colors',
            'transition-all duration-300 will-change-transform hover:bg-primary/10 hover:text-foreground',
          )}
        >
          +{remainingJobs.length} more
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="top-2 w-80 border border-primary"
        align="center"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-1">
          <h4 className="mb-2 text-sm font-medium">
            More jobs for this day ({remainingJobs.length})
          </h4>

          {remainingJobs.map((job, index) => (
            <div key={job.id || index} className="w-full">
              <JobItem
                view={view}
                job={job}
                onClick={(e) => {
                  e.stopPropagation();
                  onJobSelect?.(job);
                }}
                className="w-full justify-start"
              />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
