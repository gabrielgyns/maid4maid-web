import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Team } from '@/schemas/team.types';
import { teamService } from '@/services/team.service';

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getAllTeams(),
  });
};

export const useTeamById = (id: string) => {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamService.getTeamById(id),
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (team: Partial<Team>) => teamService.createTeam(team),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, team }: { id: string; team: Partial<Team> }) =>
      teamService.updateTeam(id, team),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
      void queryClient.invalidateQueries({ queryKey: ['teams', variables.id] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
      void queryClient.invalidateQueries({ queryKey: ['teams', id] });
    },
  });
};
