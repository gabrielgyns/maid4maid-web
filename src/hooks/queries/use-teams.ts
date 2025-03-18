import { useMutation, useQuery } from '@tanstack/react-query';

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
  return useMutation({
    mutationFn: (team: Partial<Team>) => teamService.createTeam(team),
  });
};

export const useUpdateTeam = () => {
  return useMutation({
    mutationFn: ({ id, team }: { id: string; team: Partial<Team> }) =>
      teamService.updateTeam(id, team),
  });
};

export const useDeleteTeam = () => {
  return useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
  });
};
