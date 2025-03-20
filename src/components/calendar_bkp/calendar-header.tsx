import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { FilterToggle } from './filter-toggle';
import { Team, ViewType } from './types/calendar.types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
  onViewChange: (view: ViewType) => void;
  teams: Team[];
  selectedTeamId: string | null;
  onTeamSelect: (teamId: string | null) => void;
}

const views: ViewType[] = ['month', 'week', 'day'];

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onNavigate,
  onViewChange,
  teams,
  selectedTeamId,
  onTeamSelect,
}) => {
  const getDateTitle = () => {
    // Variables for week view needed outside the switch
    let weekStart: Date;
    let weekEnd: Date;

    // Format date based on current view
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        // Get first and last day of current week view
        weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // If same month, show "Month D-D, YYYY"
        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${format(weekStart, 'MMMM d')} - ${format(weekEnd, 'd, yyyy')}`;
        }
        // If different months, show "Month D - Month D, YYYY"
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'MMMM d, yyyy (EEEE)');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="flex flex-col space-y-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Button
          onClick={() => onNavigate('today')}
          variant="outline"
          size="sm"
          className="sm:size-default"
        >
          Today
        </Button>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('prev')}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h2 className="text-base font-semibold sm:text-xl">
            {getDateTitle()}
          </h2>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate('next')}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <Tabs
          value={view}
          onValueChange={(value) => onViewChange(value as ViewType)}
          className="mt-2 sm:mt-0"
        >
          <TabsList>
            {views.map((viewType) => (
              <TabsTrigger
                key={viewType}
                value={viewType}
                className="capitalize"
              >
                {viewType}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex-none">
          <FilterToggle
            teams={teams}
            selectedTeamId={selectedTeamId}
            onTeamSelect={onTeamSelect}
          />
        </div>
      </div>
    </div>
  );
};
