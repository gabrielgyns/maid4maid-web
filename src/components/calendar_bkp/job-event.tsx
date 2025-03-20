import React from 'react';
import { format } from 'date-fns';

import { cn } from '@/utils';

import { Job, Team } from './types/calendar.types';

interface JobEventProps {
  job: Job;
  team?: Team;
  compact?: boolean;
  onClick?: (jobId: string) => void;
  isSelected?: boolean;
}

export const JobEvent: React.FC<JobEventProps> = ({
  job,
  team,
  compact = false,
  onClick,
  isSelected = false,
}) => {
  // Status colors for different job statuses
  const statusColors = {
    SCHEDULED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  };

  // Find the team data from the job
  const teamColor = team?.color || job.team?.color || '#6c757d';
  const teamName = team?.name || job.team?.name || 'Unassigned';
  const clientName =
    `${job.client?.firstName || ''} ${job.client?.lastName || ''}`.trim() ||
    'Unknown Client';
  const location = job.address
    ? `${job.address.street}, ${job.address.city}`
    : 'No location';
  const jobTypeName = job.jobType?.name || 'Unknown Type';

  // Format time for display
  const startTime = new Date(job.scheduledStartTime);
  const endTime = new Date(job.scheduledEndTime);
  const timeDisplay = `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;

  // Convert API data to appropriate UI representation
  const title = `${jobTypeName} - ${clientName}`;

  // For the compact view in month view
  if (compact) {
    return (
      <div
        className={cn(
          'mb-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-sm border px-1 py-0.5 text-xs',
          statusColors[job.status],
          isSelected && 'ring-2 ring-primary ring-offset-1',
        )}
        style={{ borderLeftColor: teamColor, borderLeftWidth: '3px' }}
        onClick={() => onClick?.(job.id)}
      >
        {title}
      </div>
    );
  }

  // For the regular view in week/day view
  return (
    <div
      className={cn(
        'flex flex-col rounded-md border p-2 text-sm shadow-sm',
        statusColors[job.status],
        isSelected && 'ring-2 ring-primary ring-offset-1',
      )}
      style={{ borderLeftColor: teamColor, borderLeftWidth: '3px' }}
      onClick={() => onClick?.(job.id)}
    >
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{timeDisplay}</div>
      <div className="mt-1 text-xs">{location}</div>
      <div
        className="mt-auto pt-1 text-xs font-medium"
        style={{ color: teamColor }}
      >
        {teamName}
      </div>
    </div>
  );
};
