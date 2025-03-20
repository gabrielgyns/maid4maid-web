import React from 'react';
import { Filter, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { TeamFilter } from './team-filter';
import { Team } from './types/calendar.types';

interface FilterToggleProps {
  teams: Team[];
  selectedTeamId: string | null;
  onTeamSelect: (teamId: string | null) => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
  teams,
  selectedTeamId,
  onTeamSelect,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 flex h-9 items-center gap-1 pl-3 pr-2"
        >
          <Filter className="h-4 w-4" />
          <span className="mr-1">Filters</span>
          {selectedTeamId && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium">
              1
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium">Filters</h3>
          {selectedTeamId && (
            <Button
              variant="ghost"
              size="sm"
              className="flex h-8 items-center gap-1 px-2 text-xs"
              onClick={() => onTeamSelect(null)}
            >
              <X className="h-3 w-3" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Team</h4>
            <TeamFilter
              teams={teams}
              selectedTeamId={selectedTeamId}
              onSelect={onTeamSelect}
              compact
            />
          </div>

          <Separator />

          {/* Additional filters can be added here */}
          <div className="space-y-2 opacity-50">
            <h4 className="text-sm font-medium">Status (Coming soon)</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="text-xs">
                Scheduled
              </Button>
              <Button variant="outline" size="sm" disabled className="text-xs">
                In Progress
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
