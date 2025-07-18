import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Job } from '@/schemas/job.types';
import { Team } from '@/schemas/team.types';

import { AgendaView } from './agenda-view';
import { AGENDA_DAYS_TO_SHOW } from './constants';
import { MonthView } from './month-view';
import { WeekView } from './week-view';

export type CalendarView = 'month' | 'week' | 'agenda' | 'week-no-time';

interface JobCalendarProps {
  jobs: Partial<Job>[];
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
  /** This will open a modal with the job details */
  onJobSelect: (job: Job) => void;
}

export function JobCalendar({
  jobs = [],
  teams = [],
  selectedTeam,
  setSelectedTeam,
  onJobSelect,
}: JobCalendarProps) {
  const [view, setView] = useState<CalendarView>('agenda');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        // isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          setView('month');
          break;
        case 'w':
          setView('week');
          break;
        case 'a':
          setView('agenda');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === 'agenda') {
      // In agenda view, go back 30 days (a full month)
      setCurrentDate(addDays(currentDate, -AGENDA_DAYS_TO_SHOW));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === 'agenda') {
      // In agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AGENDA_DAYS_TO_SHOW));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleJobSelect = (job: Job) => {
    onJobSelect(job);
  };

  const viewTitle = useMemo(() => {
    const startWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
    const endWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

    const startAgenda = currentDate;
    const endAgenda = addDays(currentDate, AGENDA_DAYS_TO_SHOW - 1);

    switch (view) {
      case 'week':
        if (isSameMonth(startWeek, endWeek)) {
          // If only one month (June 2025)
          return format(startWeek, 'MMMM yyyy');
        } else {
          // If multiple months (Jun - Jul 2025)
          return `${format(startWeek, 'MMM')} - ${format(endWeek, 'MMM yyyy')}`;
        }
      case 'agenda':
        if (isSameMonth(startAgenda, endAgenda)) {
          // If only one month (June 2025)
          return format(startAgenda, 'MMMM yyyy');
        } else {
          // If multiple months (Jun - Jul 2025)
          return `${format(startAgenda, 'MMM')} - ${format(endAgenda, 'MMM yyyy')}`;
        }
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  }, [currentDate, view]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between gap-2">
        {/* CALENDAR FILTERS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="max-sm:px-2! flex w-40 justify-between gap-1.5 max-sm:h-8 max-sm:gap-1"
            >
              <span className="capitalize">
                {selectedTeam?.name || 'Teams'}
              </span>
              <ChevronDownIcon
                className="-me-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-40">
            <DropdownMenuItem
              key={'all'}
              onClick={() => setSelectedTeam(null)}
              className="flex cursor-pointer items-center justify-between gap-5"
            >
              <span className="">All Teams</span>
              <span
                className={`h-2 w-2 rounded-full border border-primary bg-transparent dark:border-primary-foreground`}
              />
            </DropdownMenuItem>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="flex cursor-pointer items-center justify-between gap-5"
              >
                <span className="">{team.name}</span>
                <span
                  className={`h-2 w-2 rounded-full`}
                  style={{ backgroundColor: team.color }}
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Title, Previous and Next Buttons */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="max-sm:size-8"
            onClick={handlePrevious}
            aria-label="Previous"
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </Button>

          {/* Calendar Title */}
          <h2 className="lg:peer-data-[state=invisible]:-translate-x-7.5 w-48 text-center text-xl font-semibold transition-transform duration-300 ease-in-out">
            {viewTitle}
          </h2>

          <Button
            variant="ghost"
            size="icon"
            className="max-sm:size-8"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </Button>
        </div>

        {/* CALENDAR CONTROLS BUTTONS */}
        <div className="flex items-center gap-2">
          {/* Today Button */}
          <Button className="max-sm:px-2.5! max-sm:h-8" onClick={handleToday}>
            Today
          </Button>

          {/* View Selector Buttons */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="max-sm:px-2! gap-1.5 max-sm:h-8 max-sm:gap-1"
              >
                <span className="capitalize">{view}</span>
                <ChevronDownIcon
                  className="-me-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setView('agenda')}>
                Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('month')}>
                Month <DropdownMenuShortcut>M</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('week')}>
                Week <DropdownMenuShortcut>W</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* CALENDAR VIEWS */}
      <div className="flex flex-1 flex-col py-4">
        {view === 'agenda' && (
          <AgendaView
            currentDate={currentDate}
            jobs={jobs as Job[]}
            onJobSelect={handleJobSelect}
          />
        )}
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            jobs={jobs as Job[]}
            onJobSelect={handleJobSelect}
          />
        )}
        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            jobs={jobs as Job[]}
            onJobSelect={handleJobSelect}
          />
        )}
      </div>
    </div>
  );
}
