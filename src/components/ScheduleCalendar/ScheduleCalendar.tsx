import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import './calendar-dark-theme.css';

interface Job {
  id: string;
  title: string;
  start: string;
  end: string;
  teamId?: string;
  teamName?: string;
  teamColor?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// Mock data for testing
const mockJobs: Job[] = [
  // Eventos hoje - Manhã
  {
    id: '1',
    title: 'Casa da Ana',
    start: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    teamId: '1',
    teamName: 'Time A',
    teamColor: '#4CAF50',
    status: 'SCHEDULED',
  },
  {
    id: '2',
    title: 'Apartamento do João',
    start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    teamId: '2',
    teamName: 'Time B',
    teamColor: '#2196F3',
    status: 'IN_PROGRESS',
  },

  // Eventos concorrentes - mesmo horário, times diferentes (manhã)
  {
    id: '3',
    title: 'Escritório Central',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
    teamId: '3',
    teamName: 'Time C',
    teamColor: '#F44336',
    status: 'SCHEDULED',
  },
  {
    id: '4',
    title: 'Residência Silva',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(11, 30, 0, 0)).toISOString(),
    teamId: '1',
    teamName: 'Time A',
    teamColor: '#4CAF50',
    status: 'IN_PROGRESS',
  },

  // Eventos hoje - Tarde
  {
    id: '5',
    title: 'Condomínio Flores',
    start: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
    teamId: '3',
    teamName: 'Time C',
    teamColor: '#F44336',
    status: 'SCHEDULED',
  },

  // Eventos concorrentes - mesmo horário, times diferentes (tarde)
  {
    id: '6',
    title: 'Casa de Praia',
    start: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    teamId: '1',
    teamName: 'Time A',
    teamColor: '#4CAF50',
    status: 'SCHEDULED',
  },
  {
    id: '7',
    title: 'Escritório Torres',
    start: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
    teamId: '2',
    teamName: 'Time B',
    teamColor: '#2196F3',
    status: 'SCHEDULED',
  },

  // Evento amanhã
  {
    id: '8',
    title: 'Escritório Renata',
    start: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      return tomorrow.toISOString();
    })(),
    end: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(13, 0, 0, 0);
      return tomorrow.toISOString();
    })(),
    teamId: '1',
    teamName: 'Time A',
    teamColor: '#4CAF50',
    status: 'SCHEDULED',
  },

  // Mais eventos amanhã - concorrentes
  {
    id: '9',
    title: 'Loja Centro',
    start: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow.toISOString();
    })(),
    end: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(11, 30, 0, 0);
      return tomorrow.toISOString();
    })(),
    teamId: '2',
    teamName: 'Time B',
    teamColor: '#2196F3',
    status: 'SCHEDULED',
  },
  {
    id: '10',
    title: 'Consultório Médico',
    start: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 30, 0, 0);
      return tomorrow.toISOString();
    })(),
    end: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);
      return tomorrow.toISOString();
    })(),
    teamId: '3',
    teamName: 'Time C',
    teamColor: '#F44336',
    status: 'SCHEDULED',
  },

  // Dia depois de amanhã
  {
    id: '11',
    title: 'Cobertura Jardins',
    start: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(13, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    end: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(17, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    teamId: '1',
    teamName: 'Time A',
    teamColor: '#4CAF50',
    status: 'SCHEDULED',
  },

  // Três times simultâneos
  {
    id: '12',
    title: 'Hotel Central',
    start: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(9, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    end: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(11, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    teamId: '1',
    teamName: 'Time A',
    teamColor: '#4CAF50',
    status: 'SCHEDULED',
  },
  {
    id: '13',
    title: 'Restaurante Gourmet',
    start: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(9, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    end: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(12, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    teamId: '2',
    teamName: 'Time B',
    teamColor: '#2196F3',
    status: 'SCHEDULED',
  },
  {
    id: '14',
    title: 'Academia Elite',
    start: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(9, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    end: (() => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      dayAfterTomorrow.setHours(13, 0, 0, 0);
      return dayAfterTomorrow.toISOString();
    })(),
    teamId: '3',
    teamName: 'Time C',
    teamColor: '#F44336',
    status: 'SCHEDULED',
  },

  // Eventos com outros status
  {
    id: '15',
    title: 'Mansão Verdes',
    start: (() => {
      const today = new Date();
      today.setHours(8, 0, 0, 0);
      return today.toISOString();
    })(),
    end: (() => {
      const today = new Date();
      today.setHours(10, 0, 0, 0);
      return today.toISOString();
    })(),
    teamId: '1',
    teamName: 'Time A',
    teamColor: '#4CAF50',
    status: 'COMPLETED',
  },
  {
    id: '16',
    title: 'Clínica Saúde',
    start: (() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(14, 0, 0, 0);
      return yesterday.toISOString();
    })(),
    end: (() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(17, 0, 0, 0);
      return yesterday.toISOString();
    })(),
    teamId: '2',
    teamName: 'Time B',
    teamColor: '#2196F3',
    status: 'CANCELLED',
  },
];

// Mock teams data for testing
const mockTeams = [
  { id: '1', name: 'Time A', color: '#4CAF50' },
  { id: '2', name: 'Time B', color: '#2196F3' },
  { id: '3', name: 'Time C', color: '#F44336' },
];

const eventStatusColors = {
  SCHEDULED: '#3498db',
  IN_PROGRESS: '#f39c12',
  COMPLETED: '#2ecc71',
  CANCELLED: '#e74c3c',
} as const;

type JobStatus = keyof typeof eventStatusColors;

export interface ScheduleCalendarProps {
  onJobSelect?: (jobId: string) => void;
  onDateSelect?: (arg: DateSelectArg) => void;
}

export function ScheduleCalendar({
  onJobSelect,
  onDateSelect,
}: ScheduleCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<
    'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
  >('timeGridWeek');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const getCurrentLocale = () => {
    return i18n.language.startsWith('pt') ? 'pt-br' : 'en-us';
  };

  const getDateFnsLocale = () => {
    return i18n.language.startsWith('pt') ? ptBR : enUS;
  };

  const formatCalendarTitle = () => {
    const locale = getDateFnsLocale();

    if (currentView === 'dayGridMonth') {
      return format(currentDate, 'MMMM yyyy', { locale });
    } else if (currentView === 'timeGridWeek') {
      const startOfWeek = calendarRef.current?.getApi().view.activeStart;
      const endOfWeek = calendarRef.current?.getApi().view.activeEnd;

      if (startOfWeek && endOfWeek) {
        const endDate = new Date(endOfWeek);
        endDate.setDate(endDate.getDate() - 1); // Subtract one day from end date

        if (startOfWeek.getMonth() === endDate.getMonth()) {
          // Same month
          return `${format(startOfWeek, 'd', { locale })} - ${format(endDate, 'd MMM yyyy', { locale })}`;
        } else {
          // Different months
          return `${format(startOfWeek, 'd MMM', { locale })} - ${format(endDate, 'd MMM yyyy', { locale })}`;
        }
      }
    } else if (currentView === 'timeGridDay') {
      return format(currentDate, 'EEEE, d MMMM yyyy', { locale });
    }

    return '';
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (onJobSelect) {
      onJobSelect(clickInfo.event.id);
    }
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (onDateSelect) {
      onDateSelect(selectInfo);
    }
  };

  const handleTodayClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
      setCurrentDate(new Date());
    }
  };

  const handlePrevClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleNextClick = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  const handleViewChange = (
    view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay',
  ) => {
    setCurrentView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  // Filter jobs by selected team
  const filteredJobs = selectedTeam
    ? mockJobs.filter((job) => job.teamId === selectedTeam)
    : mockJobs;

  const calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: currentView,
    headerToolbar: false, // We'll create our own header
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    events: filteredJobs.map((job) => ({
      id: job.id,
      title: job.title,
      start: job.start,
      end: job.end,
      backgroundColor: job.teamColor || eventStatusColors[job.status],
      borderColor: job.teamColor || eventStatusColors[job.status],
      extendedProps: {
        teamName: job.teamName,
        status: job.status,
        statusColor: eventStatusColors[job.status],
      },
    })),
    eventClick: handleEventClick,
    select: handleDateSelect,
    eventContent: (info) => {
      const status = info.event.extendedProps.status as JobStatus;
      const statusColor = info.event.extendedProps.statusColor as string;

      return (
        <div className="overflow-hidden p-1">
          <div className="truncate text-sm font-semibold">
            {info.event.title}
          </div>
          <div className="flex items-center gap-2">
            <div className="truncate text-xs">
              {info.event.extendedProps.teamName}
            </div>
            <div
              className="rounded-sm border border-gray-300 px-1.5 text-xs font-medium"
              style={{
                backgroundColor: statusColor,
                color: 'white',
              }}
            >
              {t(`Schedule.status.${status.toLowerCase()}`)}
            </div>
          </div>
        </div>
      );
    },
    locale: getCurrentLocale(),
    datesSet: (dateInfo) => {
      setCurrentDate(dateInfo.view.currentStart);
    },
  };

  return (
    <div className="">
      <div className="flex items-center justify-between border-b py-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={currentView === 'dayGridMonth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('dayGridMonth')}
            >
              {t('Schedule.month')}
            </Button>
            <Button
              variant={currentView === 'timeGridWeek' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('timeGridWeek')}
            >
              {t('Schedule.week')}
            </Button>
            <Button
              variant={currentView === 'timeGridDay' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewChange('timeGridDay')}
            >
              {t('Schedule.day')}
            </Button>
          </div>
          <div className="text-lg font-semibold">{formatCalendarTitle()}</div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handlePrevClick}>
            &lt;
          </Button>
          <Button size="sm" onClick={handleTodayClick}>
            {t('Schedule.today')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleNextClick}>
            &gt;
          </Button>
        </div>
      </div>
      <div className="py-3">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium">
            {t('Schedule.team_filter')}:
          </div>
          <Select
            value={selectedTeam || 'all'}
            onValueChange={(value) =>
              setSelectedTeam(value === 'all' ? null : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('Schedule.all_teams')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('Schedule.all_teams')}</SelectItem>
              {mockTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[calc(100vh-16rem)]">
        <FullCalendar ref={calendarRef} {...calendarOptions} />
      </div>
    </div>
  );
}
