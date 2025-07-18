import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleCheck, CircleX, PlusCircle, Users } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import { ActionsCell } from '@/components/data-table/actions-cell';
import {
  DEFAULT_COLOR,
  PRESET_COLORS,
} from '@/components/form/form-color-input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useCreateTeam,
  useDeleteTeam,
  useTeams,
  useUpdateTeam,
} from '@/hooks/queries/use-teams';
import { useToast } from '@/hooks/use-toast';
import { Team } from '@/schemas/team.types';

import TeamModal from './team-modal';
import { TeamUsageAlert } from './team-usage-alert';

type RowType = {
  row: {
    original: Team;
  };
};

export default function Teams() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const deleteTeamMutation = useDeleteTeam();
  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Partial<Team> | undefined>(
    undefined,
  );

  const { data: teams, isLoading, error } = useTeams();

  // TODO: Plan limits - these would typically come from a user's subscription info
  const maxTeams = 3;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Error: {error?.message}{' '}
        <p className="italic text-muted-foreground">
          This message is temporary
        </p>
      </div>
    );
  }

  const teamCount = teams?.length || 0;
  const isAtLimit = teamCount >= maxTeams;

  const handleCreateTeam = async (data: Partial<Team>) => {
    if (isAtLimit) {
      toast({
        title: t('Teams.title'),
        description: t('Teams.limit_reached'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await createTeamMutation.mutateAsync(data);

      toast({
        title: t('Teams.title'),
        description: t('Teams.create_success'),
      });

      setIsModalOpen(false);
      setCurrentTeam(undefined);
    } catch (error) {
      console.error('Failed to create team:', error);

      toast({
        title: t('Teams.title'),
        description: t('Teams.create_error'),
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTeam = async (data: Partial<Team>) => {
    if (!currentTeam?.id) return;

    try {
      await updateTeamMutation.mutateAsync({
        id: currentTeam.id,
        team: data,
      });

      toast({
        title: t('Teams.title'),
        description: t('Teams.update_success'),
      });

      setIsModalOpen(false);
      setCurrentTeam(undefined);
    } catch (error) {
      console.error('Failed to update team:', error);

      toast({
        title: t('Teams.title'),
        description: t('Teams.update_error'),
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await deleteTeamMutation.mutateAsync(teamId);

      toast({
        title: t('Teams.title'),
        description: t('Teams.delete_success'),
      });
    } catch (error) {
      console.error('Failed to delete team:', error);

      toast({
        title: t('Teams.title'),
        description: t('Teams.delete_error'),
        variant: 'destructive',
      });
    }
  };

  const openCreateModal = () => {
    if (isAtLimit) {
      toast({
        title: t('Teams.title'),
        description: t('Teams.limit_reached'),
        variant: 'destructive',
      });
      return;
    }

    setCurrentTeam(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (team: Team) => {
    setCurrentTeam(team);
    setIsModalOpen(true);
  };

  const columns = [
    {
      accessorKey: 'color',
      header: '#',
      cell: ({ row }: RowType) => {
        const color = row.original.color || DEFAULT_COLOR;
        const colorName = PRESET_COLORS.find((c) => c.value === color)?.name;

        return (
          <div className="flex items-center">
            <div
              className="mr-2 h-6 w-6 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
              title={colorName ? `${colorName} (${color})` : color}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: t('Teams.table.name'),
    },
    {
      accessorKey: 'description',
      header: t('Teams.table.description'),
    },
    {
      accessorKey: 'isActive',
      header: t('Teams.table.is_active'),
      cell: ({ row }: RowType) =>
        row.original.isActive ? (
          <CircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <CircleX className="h-5 w-5 text-red-600 dark:text-red-400" />
        ),
    },
    {
      accessorKey: 'actions',
      header: t('Teams.table.actions'),
      cell: ({ row }: RowType) => (
        <ActionsCell
          row={row}
          onEdit={() => openEditModal(row.original)}
          onDelete={async () => {
            await handleDeleteTeam(row.original.id!);
          }}
          deleteTitle={t('Teams.delete_team_dialog.title')}
          deleteDescription={t('Teams.delete_team_dialog.description')}
        />
      ),
    },
  ];

  // TODO: Add -> Total Clients | Clients with Jobs | Clients without scheduled Jobs
  // TODO: Maybe a grid 2x2 to the List and a Map with pinned clients?
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Users className="mr-2 inline h-6 w-6" />
          {t('Teams.title')}
        </h1>
        <Button
          onClick={openCreateModal}
          className="self-end"
          type="button"
          disabled={isAtLimit}
        >
          <PlusCircle className="h-4 w-4" /> {t('Teams.add_team')}
        </Button>
      </div>

      <DataTable columns={columns} data={teams ?? []} />

      <TeamUsageAlert teamCount={teamCount} maxTeams={maxTeams} />

      <TeamModal
        team={currentTeam}
        isOpen={isModalOpen}
        isLoading={createTeamMutation.isPending || updateTeamMutation.isPending}
        onClose={() => setIsModalOpen(false)}
        onSubmit={currentTeam?.id ? handleUpdateTeam : handleCreateTeam}
      />
    </div>
  );
}
