import { useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns';

import { Spinner } from '../spinner';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CalendarHeader } from './calendar-header';
import { DayView } from './day-view';
import { MonthView } from './month-view';
import { Job, Team, ViewType } from './types/calendar.types';
import { WeekView } from './week-view';

export interface CalendarProps {
  jobs: Job[];
  teams: Team[];
  defaultView?: ViewType;
  onEventClick?: (jobId: string) => void;
  selectedEventId?: string | null;
  isLoading?: boolean;
  error?: string;
  onDateSelect?: (date: Date) => void;
}

export default function Calendar({
  jobs,
  teams,
  defaultView = 'month',
  onEventClick,
  selectedEventId,
  isLoading = false,
  error,
  onDateSelect,
}: CalendarProps) {
  const [view, setView] = useState<ViewType>(defaultView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Filter jobs by selected team
  const filteredJobs = selectedTeamId
    ? jobs.filter((job) => job.team.id === selectedTeamId)
    : jobs;

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }

    const moveDate =
      direction === 'next'
        ? view === 'month'
          ? addMonths
          : view === 'week'
            ? addWeeks
            : addDays
        : view === 'month'
          ? subMonths
          : view === 'week'
            ? subWeeks
            : subDays;

    setCurrentDate((prevDate) => moveDate(prevDate, 1));
  };

  const handleDateSelect = (date: Date) => {
    // Update the current date to the selected date
    setCurrentDate(date);

    // Call the parent component's onDateSelect if provided
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const renderCalendarView = () => {
    const commonProps = {
      jobs: filteredJobs,
      teams,
      currentDate,
      onJobClick: onEventClick,
      selectedJobId: selectedEventId,
      onDateSelect: handleDateSelect,
    };

    switch (view) {
      case 'month':
        return <MonthView {...commonProps} />;
      case 'week':
        return <WeekView {...commonProps} />;
      case 'day':
        return <DayView {...commonProps} />;
      default:
        return <WeekView {...commonProps} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
        teams={teams}
        selectedTeamId={selectedTeamId}
        onTeamSelect={setSelectedTeamId}
      />
      <div className="h-full overflow-auto">{renderCalendarView()}</div>
    </div>
  );
}
