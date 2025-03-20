import { useTranslation } from 'react-i18next';
import { DateSelectArg } from '@fullcalendar/core';

import { ScheduleCalendar } from '@/components/ScheduleCalendar';

export default function Schedule() {
  const { t } = useTranslation();

  const handleJobSelect = (jobId: string) => {
    console.log('Job selecionado:', jobId);
    // Aqui você pode abrir um modal de detalhes do job ou navegar para página de detalhes
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log('Data selecionada:', selectInfo);
    // Aqui você pode abrir um modal para criar um novo job
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('Schedule.title')}</h1>
        {/* Aqui você pode adicionar botões de ação, como "Novo Agendamento" */}
      </div>

      <ScheduleCalendar
        onJobSelect={handleJobSelect}
        onDateSelect={handleDateSelect}
      />
    </div>
  );
}
