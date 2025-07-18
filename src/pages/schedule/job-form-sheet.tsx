/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarPlus } from 'lucide-react';
import { z } from 'zod';

import {
  Combobox,
  ComboboxOption,
  createComboboxOptions,
} from '@/components/combobox';
import { DatePickerInput } from '@/components/form/date-picker-input';
import FormInput from '@/components/form/form-input';
import FormSelectInput from '@/components/form/form-select-input';
import FormTextareaInput from '@/components/form/form-textarea-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useClients } from '@/hooks/queries/use-clients';
import {
  useCreateJob,
  useJobTypes,
  useUpdateJob,
} from '@/hooks/queries/use-jobs';
import { useTeams } from '@/hooks/queries/use-teams';
import { useToast } from '@/hooks/use-toast';
import { Address } from '@/schemas/address.types';
import { Client } from '@/schemas/client.types';
import { chargeByEnum, preferredFrequencyEnum } from '@/schemas/commons';
import { Job, jobFormSchema, JobStatus } from '@/schemas/job.types';

interface Props {
  contentTrigger: React.ReactNode;
  job?: Job;
}

// JobFormData && EditJobFormData ????
// JobFormData -> Partial || Optional -> Job ????
type JobFormData = z.infer<typeof jobFormSchema>;

export default function JobFormSheet({ contentTrigger, job }: Props) {
  const { t } = useTranslation();

  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isTimeRange, setIsTimeRange] = useState(
    job ? Boolean(job.scheduledStartTime && job.scheduledEndTime) : true,
  );
  const [selectedClient, setSelectedClient] =
    useState<ComboboxOption<Client> | null>(null);
  const [selectedAddress, setSelectedAddress] =
    useState<ComboboxOption<Address> | null>(null);

  // QUERIES
  const { data: clients, isLoading: isClientsLoading } = useClients(); // Needs to fill the combobox with all clients.
  const { data: jobTypes, isLoading: isJobTypesLoading } = useJobTypes();
  const { data: teams, isLoading: isTeamsLoading } = useTeams();

  // MUTATIONS
  const { mutateAsync: createJob, isPending: isCreatingJob } = useCreateJob();
  const { mutateAsync: updateJob, isPending: isUpdatingJob } = useUpdateJob(
    job?.id as string,
  );

  // Convert Job to JobFormData format
  const getFormDefaultValues = useCallback(
    (jobData?: Job): Partial<JobFormData> => {
      if (!jobData) {
        return {
          isPaid: false,
          status: JobStatus.SCHEDULED,
        };
      }

      // Convert ISO datetime strings back to time format for form inputs
      const getTimeFromISO = (isoString?: string): string | undefined => {
        if (!isoString) return undefined;
        const date = new Date(isoString);
        return date.toTimeString().slice(0, 5); // HH:MM format (remove seconds)
      };

      return {
        id: jobData.id,
        status: jobData.status,
        date: new Date(jobData.date),
        order: jobData.order || undefined,
        scheduledStartTime: getTimeFromISO(jobData.scheduledStartTime),
        scheduledEndTime: getTimeFromISO(jobData.scheduledEndTime),
        trackedStartTime: getTimeFromISO(jobData.trackedStartTime),
        trackedEndTime: getTimeFromISO(jobData.trackedEndTime),
        // Convert null to undefined for optional fields
        chargeAmount: jobData.chargeAmount || undefined,
        chargeBy: jobData.chargeBy || undefined,
        otherInformation: jobData.otherInformation || undefined,
        isPaid: jobData.isPaid,
        cancelReason: jobData.cancelReason || undefined,
        // Convert nested objects to IDs
        jobTypeId: jobData.jobType?.id || undefined,
        clientId: jobData.client.id,
        addressId: jobData.address.id,
        teamId: jobData.team.id,
        createdById: jobData.createdBy?.id || undefined,
      };
    },
    [],
  );

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    mode: 'onBlur',
    defaultValues: getFormDefaultValues(job),
  });

  const clientOptions = useMemo(() => {
    if (!clients) return [];
    return createComboboxOptions(
      clients,
      (client) => client.id!,
      (client) => `${client.firstName} ${client.lastName}`,
    );
  }, [clients]);

  const addressOptions = useMemo(() => {
    if (!selectedClient?.data?.addresses) return [];

    const clientAddresses = selectedClient.data.addresses.filter(
      (address) => address.isActive,
    );

    return createComboboxOptions(
      clientAddresses,
      (address) => address.id!,
      (address) => `${address.street}, ${address.city}`,
    );
  }, [selectedClient]);

  // Reset form when job changes (for edit mode)
  useEffect(() => {
    if (job) {
      const formValues = getFormDefaultValues(job);
      form.reset(formValues);

      // Update time range switch based on job data
      setIsTimeRange(Boolean(job.scheduledStartTime && job.scheduledEndTime));
    } else {
      // Reset to default values for create mode
      form.reset(getFormDefaultValues());
      setIsTimeRange(true);
    }
  }, [job, getFormDefaultValues, form]);

  // Set selected client and address when job or clients change
  useEffect(() => {
    if (job && clients) {
      const jobClient = clients.find((client) => client.id === job.client.id);

      if (jobClient) {
        setSelectedClient({
          value: jobClient.id!,
          label: `${jobClient.firstName} ${jobClient.lastName}`,
          data: jobClient,
        });

        // Find the address within the client's addresses
        const jobAddress = jobClient.addresses.find(
          (address) => address.id === job.address.id,
        );

        if (jobAddress) {
          setSelectedAddress({
            value: jobAddress.id!,
            label: `${jobAddress.street}, ${jobAddress.city}`,
            data: jobAddress,
          });
        }
      }
    } else {
      // Reset selections when no job (create mode)
      setSelectedClient(null);
      setSelectedAddress(null);
    }
  }, [job, clients]);

  const handleClientChange = (option: ComboboxOption<Client> | null) => {
    setSelectedClient(option);
    setSelectedAddress(null); // Reset address when client changes

    if (option) {
      form.setValue('clientId', option.value);
      form.setValue('addressId', ''); // Reset address in form
    } else {
      form.setValue('clientId', '');
      form.setValue('addressId', '');
    }
  };

  const handleAddressChange = (option: ComboboxOption<Address> | null) => {
    setSelectedAddress(option);

    if (option) {
      form.setValue('addressId', option.value);
    } else {
      form.setValue('addressId', '');
    }
  };

  const onSubmit = async (data: JobFormData): Promise<void> => {
    const payload = {
      ...data,
      chargeAmount: data.chargeAmount
        ? parseFloat(data.chargeAmount.toString()).toFixed(2)
        : undefined,
    };

    try {
      if (job?.id) {
        await updateJob(payload);
      } else {
        await createJob(payload);
      }

      toast({
        title: '✅ Job saved',
        description: job?.id
          ? 'Job updated successfully'
          : 'Job created successfully',
      });

      // Reset form and close sheet after successful mutation
      form.reset();
      setSelectedClient(null);
      setSelectedAddress(null);
      setOpen(false);
    } catch (error) {
      console.error('❌ Failed to save job:', error);
      // Error handling is already done in the mutation hooks
      // Don't close the form on error so user can retry
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setOpen(true);
        } else {
          form.reset();
          setSelectedClient(null);
          setSelectedAddress(null);
          setOpen(false);
        }
      }}
    >
      <SheetTrigger asChild>{contentTrigger}</SheetTrigger>

      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        className="min-w-[35%] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-2xl">
            <CalendarPlus className="h-6 w-6" />
            {job?.id ? 'Edit Job' : 'New Job'}
          </SheetTitle>
        </SheetHeader>

        <hr className="my-4" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* CLIENT AND ADDRESS */}
            <div className="grid grid-cols-2 items-start gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="client">Select Client</Label>
                <Combobox
                  id="client"
                  options={clientOptions}
                  placeholder="Select a client..."
                  searchPlaceholder="Search a client..."
                  notFoundMessage="No client found."
                  value={selectedClient?.value}
                  onValueChange={handleClientChange}
                  disabled={isClientsLoading}
                  allowClear
                  searchBy="label"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Select Address</Label>
                <Combobox
                  options={addressOptions}
                  placeholder={
                    selectedClient
                      ? 'Select an address...'
                      : 'Select a client first'
                  }
                  searchPlaceholder="Search an address..."
                  notFoundMessage="No address found for this client."
                  value={selectedAddress?.value}
                  onValueChange={handleAddressChange}
                  disabled={!selectedClient}
                  allowClear
                  searchBy="label"
                />
              </div>
            </div>

            <hr className="mt-2" />

            <div className="grid grid-cols-2 items-start gap-4">
              <DatePickerInput form={form} label="Date" name="date" />

              <div className="flex h-full cursor-pointer items-center justify-between gap-2 self-end rounded-lg border p-2.5">
                <Label htmlFor="timeRange" className="cursor-pointer">
                  Do you want to select a time range?
                </Label>
                <Switch
                  id="timeRange"
                  checked={isTimeRange}
                  onCheckedChange={setIsTimeRange}
                />
              </div>

              {isTimeRange && (
                <div className="*:[div]:w-full col-span-2 flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="scheduledStartTime">
                      {t('Components.CalendarDateTimePicker.start_time')}
                    </Label>
                    <Input
                      {...form.register('scheduledStartTime')}
                      id="scheduledStartTime"
                      type="time"
                      step="1"
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="scheduledEndTime">
                      {t('Components.CalendarDateTimePicker.end_time')}
                    </Label>
                    <Input
                      {...form.register('scheduledEndTime')}
                      id="scheduledEndTime"
                      type="time"
                      step="1"
                      className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                </div>
              )}

              <FormSelectInput
                form={form}
                label="Preferred Frequency"
                name="preferredFrequency"
                options={Object.values(preferredFrequencyEnum.Values).map(
                  (value) => ({
                    id: value,
                    name: value,
                  }),
                )}
                classNames="col-span-2"
                // TODO: Apply this later, when BE process jobs based on the frequency
                disabled
              />
            </div>

            <hr className="mt-2" />

            <div className="grid grid-cols-2 items-end gap-4">
              <FormSelectInput
                form={form}
                label="Team"
                name="teamId"
                options={
                  teams?.map((team) => ({
                    id: team.id,
                    name: team.name,
                  })) as { id: string; name: string }[]
                }
                disabled={isTeamsLoading}
              />

              <FormSelectInput
                form={form}
                label="Job Type"
                name="jobTypeId"
                options={
                  jobTypes?.map((jobType) => ({
                    id: jobType.id,
                    name: jobType.name,
                  })) as { id: string; name: string }[]
                }
                disabled={isJobTypesLoading}
              />

              <FormSelectInput
                form={form}
                label="Charge By (optional)"
                name="chargeBy"
                options={Object.values(chargeByEnum.Values).map((value) => ({
                  id: value,
                  name: value,
                }))}
              />

              <FormInput
                form={form}
                label="Charge Amount (optional)"
                name="chargeAmount"
              />
            </div>

            <FormTextareaInput
              form={form}
              label="Other Information (optional)"
              name="otherInformation"
            />

            {/* FOR EDITING FORM */}

            {/* CANCEL AND SAVE BUTTONS */}
            <hr />
            <div className="flex justify-between gap-2">
              {/* TODO: Add a confirmation dialog to cancel the job w/ cancelReason option */}
              {job?.id ? (
                <Button type="button" variant="destructive">
                  Cancel this Job
                </Button>
              ) : (
                <div />
              )}

              <div className="flex justify-end gap-2">
                {/* TODO: Let the user know they gonna lost the filled inputs */}
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      form.reset();
                      setSelectedClient(null);
                      setSelectedAddress(null);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                </SheetClose>

                <Button
                  type="submit"
                  disabled={isClientsLoading || isCreatingJob || isUpdatingJob}
                >
                  {!job?.id ? 'Schedule Job' : 'Save changes'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
