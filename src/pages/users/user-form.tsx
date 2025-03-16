/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from 'date-fns';
import {
  CalendarClock,
  Info,
  Loader2,
  Shield,
  User,
  UserPen,
} from 'lucide-react';
import { z } from 'zod';

import ConfirmDialog from '@/components/confirm-dialog';
import { FloatingActionBar } from '@/components/floating-action-bar';
import FormAvatarInput from '@/components/form/form-avatar-input';
import FormInput from '@/components/form/form-input';
import FormSelectInput from '@/components/form/form-select-input';
import FormSwitchInput from '@/components/form/form-switch-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useResetUserPassword } from '@/hooks/queries/use-users';
import { useToast } from '@/hooks/use-toast';
import { User as UserType, userSchema } from '@/schemas/user.types';
import { cn } from '@/utils';

interface UserFormProps {
  user?: Partial<UserType>;
  isLoading?: boolean;
  onSubmit: (data: Partial<UserType>) => Promise<void>;
  onDelete?: (userId: string) => Promise<void>;
}

type UserFormData = z.infer<typeof userSchema>;

export default function UserForm({
  user,
  isLoading,
  onSubmit,
  onDelete,
}: UserFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const resetPasswordMutation = useResetUserPassword();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onBlur',
    values: user ? (user as UserFormData) : undefined,
    defaultValues: {
      isDriver: false,
      isActive: true,
    },
  });

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
  };

  const handleDelete = async () => {
    if (onDelete && user?.id) {
      await onDelete(user.id);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.id) return;

    try {
      setIsResettingPassword(true);

      await resetPasswordMutation.mutateAsync(user.id);

      toast({
        title: 'User',
        description: 'Password reset link sent successfully.',
      });
    } catch (error) {
      console.error('Failed to send password reset link:', error);

      toast({
        title: 'User',
        description: 'Failed to send password reset link.',
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="mb-16 flex flex-col gap-4 px-10"
      >
        <h3 className="flex items-center gap-2 text-3xl font-semibold">
          <UserPen className="h-7 w-7" />
          User Information
        </h3>

        {/* Basic Information */}
        <Card className="space-y-4 p-6">
          <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
            <User className="h-5 w-5" />
            Personal Information
          </h3>

          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <FormAvatarInput
                form={form}
                name="file"
                label="Profile Photo"
                firstName={form.watch('firstName')}
                lastName={form.watch('lastName')}
                formDescription="Upload a profile picture (optional)"
              />
            </div>

            <div className="col-span-3 gap-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="firstName"
                  label={t('Register.first_name')}
                />
                <FormInput
                  form={form}
                  name="lastName"
                  label={t('Register.last_name')}
                />
              </div>

              <FormInput
                form={form}
                name="email"
                label={t('Register.user_email')}
                type="email"
              />

              <FormInput
                form={form}
                name="phone"
                label={t('Register.user_phone')}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Authentication */}
          <Card className="space-y-4 p-6">
            <h3 className="flex items-center gap-2 pb-2 text-lg font-semibold">
              <Shield className="h-5 w-5" />
              Authentication & Permissions
            </h3>

            <div className="space-y-4">
              <FormInput form={form} name="login" label={t('Register.login')} />
              <FormSelectInput
                form={form}
                name="roleId"
                label="Role"
                options={[]}
                placeholder="Select a role"
                formDescription="Assign a role to determine permissions"
              />
            </div>

            {!user?.id ? (
              <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>Password Creation</AlertTitle>
                <AlertDescription>
                  When this user is created, they will receive an email with a
                  link to create their password.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="default">
                  <CalendarClock className="h-4 w-4" />
                  <AlertTitle>Logs Information</AlertTitle>
                  <AlertDescription className="mt-3 space-y-1">
                    <p>
                      <b>Last logged in:</b>{' '}
                      {user?.lastLoginAt
                        ? formatDate(user.lastLoginAt, 'MM/dd/yyyy HH:mm')
                        : 'User never logged in.'}
                      <br />
                    </p>
                    <p>
                      <b>Last password reset:</b>{' '}
                      {user?.lastLoginAt
                        ? formatDate(user.lastLoginAt, 'MM/dd/yyyy HH:mm')
                        : 'User never logged in.'}
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="float-end mt-4">
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Password Reset Link'
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* General Information */}
          <Card className="space-y-4 p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5" />
              General Information
            </h3>

            <FormSelectInput
              form={form}
              name="defaultTeamId"
              label="Default Team"
              options={[]}
              placeholder="Select a team"
              formDescription="The default team this user belongs to"
              classNames="col-span-2"
            />

            <FormSwitchInput
              form={form}
              name="isDriver"
              label="Is Driver?"
              formDescription="Enables driver features"
            />

            <FormSwitchInput
              form={form}
              name="isActive"
              label="Is User Active?"
              formDescription="Inactive users cannot log in"
            />
          </Card>
        </div>

        <FloatingActionBar>
          <div
            className={cn('flex flex-1 justify-between', {
              'justify-end': !user?.id,
            })}
          >
            {user?.id && (
              <ConfirmDialog
                onConfirm={handleDelete}
                title={'Delete User'}
                description="Are you sure you want to delete this user? This action cannot be undone."
              >
                <Button size="sm" variant="destructive">
                  Delete User
                </Button>
              </ConfirmDialog>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  form.reset();
                  navigate('/users');
                }}
              >
                Cancel
              </Button>

              <Button size="sm" type="submit" disabled={isLoading}>
                Save Changes
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </div>
        </FloatingActionBar>
      </form>
    </Form>
  );
}
