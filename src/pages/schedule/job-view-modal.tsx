import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Clock,
  DollarSign,
  Info,
  MapPin,
  User,
  UserCog,
} from 'lucide-react';

import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useJob } from '@/hooks/queries/use-jobs';
import { Job, JobStatus } from '@/schemas/job.types';
import { formatCurrency } from '@/utils';

import JobFormSheet from './job-form-sheet';

interface JobViewModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

export function JobViewModal({ job, isOpen, onClose }: JobViewModalProps) {
  const { t } = useTranslation();

  // Fetch fresh job data to ensure modal shows latest updates
  const { data: freshJob, isLoading } = useJob(job.id!);

  // Use fresh data if available, fallback to prop data
  const displayJob = freshJob || job;

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case JobStatus.SCHEDULED:
        return 'text-blue-500';
      case JobStatus.IN_PROGRESS:
        return 'text-yellow-500';
      case JobStatus.COMPLETED:
        return 'text-green-500';
      case JobStatus.CANCELLED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl pt-12">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {displayJob.jobType?.name || t('Schedule.job_details')}
            </div>
            <span className={`text-sm ${getStatusColor(displayJob.status)}`}>
              {t(`Schedule.status.${displayJob.status.toLowerCase()}`)}
            </span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="flex items-center justify-center gap-2">
            <Spinner /> Loading...
          </p>
        ) : (
          <>
            <div className="space-y-4 py-4">
              {/* Client Information */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <User className="h-4 w-4" />
                  {t('Schedule.client_information')}
                </h3>
                <div className="mt-2 space-y-1 pl-6">
                  <p>
                    {displayJob.client.firstName} {displayJob.client.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {displayJob.client.phone1}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <MapPin className="h-4 w-4" />
                  Service Address
                </h3>
                <div className="mt-2 space-y-1 pl-6">
                  <p>{displayJob.address.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {displayJob.address.city}, {displayJob.address.state}{' '}
                    {displayJob.address.zipCode}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Team */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <UserCog className="h-4 w-4" />
                  Assigned Team
                </h3>
                <div className="mt-2 pl-6">
                  <div
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1"
                    style={{ backgroundColor: `${displayJob.team.color}20` }}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: displayJob.team.color }}
                    />
                    <span>{displayJob.team.name}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Schedule */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <Clock className="h-4 w-4" />
                  Schedule
                </h3>
                <div className="mt-2 space-y-1 pl-6">
                  <p>
                    Date:{' '}
                    {new Date(displayJob.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {displayJob.scheduledStartTime &&
                    displayJob.scheduledEndTime && (
                      <p>
                        Time: {displayJob.scheduledStartTime} -{' '}
                        {displayJob.scheduledEndTime}
                      </p>
                    )}
                </div>
              </div>

              <Separator />

              {/* Payment Information */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  <DollarSign className="h-4 w-4" />
                  Payment Information
                </h3>
                <div className="mt-2 space-y-1 pl-6">
                  {displayJob.chargeAmount && (
                    <p>
                      Amount:{' '}
                      {formatCurrency(parseFloat(displayJob.chargeAmount))}
                    </p>
                  )}
                  {displayJob.chargeBy && (
                    <p>Charge By: {displayJob.chargeBy}</p>
                  )}
                  <p>
                    Payment Status: {displayJob.isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              {displayJob.otherInformation && (
                <>
                  <Separator />
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Info className="h-4 w-4" />
                      Additional Information
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap pl-6">
                      {displayJob.otherInformation}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <JobFormSheet
                job={displayJob}
                contentTrigger={<Button variant="default">Edit Job</Button>}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
