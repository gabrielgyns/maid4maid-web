import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDaysIcon, PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useJobs } from '@/hooks/queries/use-jobs';
import { useTeams } from '@/hooks/queries/use-teams';
import { Job } from '@/schemas/job.types';
import { Team } from '@/schemas/team.types';

import { JobCalendar } from './calendar';
import JobFormSheet from './job-form-sheet';
import { JobViewModal } from './job-view-modal';

export default function Schedule() {
  const { t } = useTranslation();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: jobs, isLoading: isJobsLoading } = useJobs({
    teamId: selectedTeam?.id,
  });
  const { data: teams, isLoading: isTeamsLoading } = useTeams();

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center text-2xl font-bold">
          <CalendarDaysIcon className="mr-2 inline h-6 w-6" />
          {t('Schedule.title')}
        </h1>

        <JobFormSheet
          contentTrigger={
            <Button
              type="button"
              disabled={isJobsLoading || isTeamsLoading}
              className="self-end"
            >
              <PlusCircle className="h-4 w-4" /> {t('Schedule.new_job')}
            </Button>
          }
        />
      </div>

      <JobCalendar
        jobs={jobs as Job[]}
        teams={teams as Team[]}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        onJobSelect={(job) => {
          setSelectedJob(job);
          setIsViewModalOpen(true);
        }}
      />

      {selectedJob && (
        <JobViewModal
          job={selectedJob}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
}
