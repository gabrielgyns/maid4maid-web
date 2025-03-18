import { Team } from '@/schemas/team.types';

import api from './api.service';

export const teamService = {
  async getAllTeams(): Promise<Team[]> {
    const { data } = await api.get<Team[]>('/teams');
    return data;
  },

  async getTeamById(id: string): Promise<Team> {
    const { data } = await api.get<Team>(`/teams/${id}`);
    return data;
  },

  async createTeam(team: Partial<Team>): Promise<Team> {
    const { data } = await api.post<Team>('/teams', team);
    return data;
  },

  async updateTeam(id: string, team: Partial<Team>): Promise<Team> {
    const { data } = await api.patch<Team>(`/teams/${id}`, team);
    return data;
  },

  async deleteTeam(id: string): Promise<void> {
    await api.delete(`/teams/${id}`);
  },
};
