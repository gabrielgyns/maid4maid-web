import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface TeamUsageAlertProps {
  teamCount: number;
  maxTeams: number;
}

export function TeamUsageAlert({ teamCount, maxTeams }: TeamUsageAlertProps) {
  // Calculate team usage
  const teamsRemaining = maxTeams - teamCount;
  const usagePercentage = (teamCount / maxTeams) * 100;
  const usagePercentageFormatted = Math.round(usagePercentage);
  const isAtLimit = teamCount >= maxTeams;
  const isNearLimit = usagePercentage >= 66 && !isAtLimit;

  // Determine alert variant based on usage
  let alertVariant: 'default' | 'destructive' = 'default';

  if (usagePercentage >= 100) {
    alertVariant = 'destructive';
  } else if (usagePercentage >= 66) {
    alertVariant = 'default';
  }

  return (
    <Alert variant={alertVariant}>
      <AlertTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAtLimit ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : isNearLimit ? (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          )}
          Team Usage
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${
              isAtLimit
                ? 'bg-destructive/10 text-destructive'
                : isNearLimit
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-emerald-500/10 text-emerald-600'
            }`}
          >
            {teamCount} of {maxTeams} Teams ({usagePercentageFormatted}%)
          </span>
        </div>

        <Button
          variant={
            isAtLimit ? 'destructive' : isNearLimit ? 'default' : 'outline'
          }
          size="sm"
          className={`gap-1 ${isAtLimit ? 'animate-pulse' : ''}`}
          onClick={() => window.open('/settings/subscription', '_blank')}
        >
          <CreditCard className="h-4 w-4" />
          Upgrade Plan
          <ArrowUpRight className="h-3 w-3" />
        </Button>
      </AlertTitle>

      <div className="mt-3">
        <div
          className={`relative h-2.5 w-full overflow-hidden rounded-full ${
            isAtLimit
              ? 'bg-destructive/20'
              : isNearLimit
                ? 'bg-amber-500/20'
                : 'bg-emerald-500/20'
          }`}
        >
          <div
            className={`h-full transition-all ${
              isAtLimit
                ? 'bg-destructive'
                : isNearLimit
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
            }`}
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
      </div>

      <AlertDescription className="mt-3">
        {isAtLimit ? (
          <span className="font-medium text-destructive">
            You've reached the maximum number of teams allowed in your current
            plan.
          </span>
        ) : isNearLimit ? (
          <span>
            You're approaching your team limit. You can add{' '}
            <span className="font-medium">
              {teamsRemaining} more {teamsRemaining === 1 ? 'team' : 'teams'}
            </span>{' '}
            with your current plan.
          </span>
        ) : (
          <span>
            You can add{' '}
            <span className="font-medium">
              {teamsRemaining} more {teamsRemaining === 1 ? 'team' : 'teams'}
            </span>{' '}
            with your current plan.
          </span>
        )}{' '}
        {(isAtLimit || isNearLimit) && (
          <span>Upgrade your plan for additional teams and features.</span>
        )}
      </AlertDescription>
    </Alert>
  );
}
