import React from 'react';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/utils';

import { Team } from './types/calendar.types';

interface TeamFilterProps {
  teams: Team[];
  selectedTeamId: string | null;
  onSelect: (teamId: string | null) => void;
  compact?: boolean;
}

export const TeamFilter: React.FC<TeamFilterProps> = ({
  teams,
  selectedTeamId,
  onSelect,
  compact = false,
}) => {
  if (!teams.length) {
    return (
      <div className="text-sm text-muted-foreground">No teams available</div>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', compact ? 'gap-1' : 'gap-2')}>
      {teams.map((team) => (
        <button
          key={team.id}
          className={cn(
            'flex items-center rounded-md px-3 py-1.5 text-sm transition-colors',
            compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            selectedTeamId === team.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted/60 hover:bg-muted/80',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          )}
          style={{
            backgroundColor:
              selectedTeamId === team.id ? team.color : undefined,
            color: selectedTeamId === team.id ? '#fff' : undefined,
          }}
          onClick={() => onSelect(selectedTeamId === team.id ? null : team.id)}
        >
          {selectedTeamId === team.id && <CheckIcon className="mr-1 h-3 w-3" />}
          {team.name}
        </button>
      ))}
    </div>
  );
};
