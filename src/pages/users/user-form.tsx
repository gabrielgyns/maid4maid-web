/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useRoles } from '@/hooks/queries/use-roles';
import { useResetUserPassword } from '@/hooks/queries/use-users';
import { useFormatDate } from '@/hooks/use-format-date';
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { formatDateWithLocale } = useFormatDate();
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const resetPasswordMutation = useResetUserPassword();
  const { data: roles = [], isLoading: isRolesLoading } = useRoles();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onBlur',
    values: user ? (user as UserFormData) : undefined,
    defaultValues: {
      roleId: user?.roleId || '',
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
        title: t('Users.title'),
        description: t('Users.password_reset.reset_link_sent_successfully'),
      });
    } catch (error) {
      console.error('Failed to send password reset link:', error);

      toast({
        title: t('Users.title'),
        description: t('Users.password_reset.failed_to_send_reset_link'),
        variant: 'destructive',
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const userIsMaster =
    user?.roleId === roles.find((role) => role.name === 'Master')?.id;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="mb-16 flex flex-col gap-4 px-10"
      >
        <h3 className="flex items-center gap-2 text-3xl font-semibold">
          <UserPen className="h-7 w-7" />
          {t('Users.form.title')}
        </h3>

        {/* Basic Information */}
        <Card className="space-y-4 p-6">
          <h3 className="flex items-center gap-2 pb-4 text-lg font-semibold">
            <User className="h-5 w-5" />
            {t('Users.form.personal_information')}
          </h3>

          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <FormAvatarInput
                form={form}
                name="file"
                label={t('Users.form.profile_photo')}
                firstName={form.watch('firstName')}
                lastName={form.watch('lastName')}
                formDescription={t('Users.form.upload_photo_description')}
              />
            </div>

            <div className="col-span-3 gap-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="firstName"
                  label={t('Users.form.first_name')}
                />
                <FormInput
                  form={form}
                  name="lastName"
                  label={t('Users.form.last_name')}
                />
              </div>

              <FormInput
                form={form}
                name="email"
                label={t('Users.form.email')}
                type="email"
              />

              <FormInput
                form={form}
                name="phone"
                label={t('Users.form.phone')}
              />
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Authentication */}
          <Card className="space-y-4 p-6">
            <h3 className="flex items-center gap-2 pb-2 text-lg font-semibold">
              <Shield className="h-5 w-5" />
              {t('Users.form.authentication_and_permissions')}
            </h3>

            <div className="space-y-4">
              <FormInput
                form={form}
                name="login"
                label={t('Users.form.username')}
              />
              <FormSelectInput
                form={form}
                name="roleId"
                label={t('Users.form.role')}
                options={roles
                  .filter((role) => userIsMaster || role.name !== 'Master')
                  .map((role) => ({
                    id: role.id || '',
                    name: role.name || '',
                  }))}
                disabled={isRolesLoading || userIsMaster}
                placeholder={t('Users.form.select_role')}
                formDescription={t('Users.form.select_role_description')}
              />
            </div>

            {!user?.id ? (
              <Alert variant="default">
                <Info className="h-4 w-4" />
                <AlertTitle>{t('Users.form.password_creation')}</AlertTitle>
                <AlertDescription>
                  {t('Users.form.password_creation_description')}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert variant="default">
                  <CalendarClock className="h-4 w-4" />
                  <AlertTitle>{t('Users.form.logs_information')}</AlertTitle>
                  <AlertDescription className="mt-3 grid grid-cols-[120px_1fr] gap-2">
                    <div className="font-bold">
                      {t('Users.form.created_at')}
                    </div>
                    <div>
                      {user?.createdAt && formatDateWithLocale(user.createdAt)}
                    </div>

                    <div className="font-bold">
                      {t('Users.form.updated_at')}
                    </div>
                    <div>
                      {user?.updatedAt && formatDateWithLocale(user.updatedAt)}
                    </div>

                    <div className="font-bold">
                      {t('Users.form.last_logged_in')}
                    </div>
                    <div>
                      {user?.lastLoginAt
                        ? formatDateWithLocale(user.lastLoginAt)
                        : t('Users.form.user_never_logged_in')}
                    </div>
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
                        {t('Users.form.sending')}
                      </>
                    ) : (
                      t('Users.form.send_password_reset_link')
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
              {t('Users.form.general_information')}
            </h3>

            <FormSelectInput
              form={form}
              name="defaultTeamId"
              label={t('Users.form.default_team')}
              options={[]}
              placeholder={t('Users.form.select_team')}
              formDescription={t('Users.form.select_team_description')}
              classNames="col-span-2"
            />

            <FormSwitchInput
              form={form}
              name="isDriver"
              label={t('Users.form.is_driver_question')}
              formDescription={t('Users.form.is_driver_description')}
            />

            <FormSwitchInput
              form={form}
              name="isActive"
              label={t('Users.form.is_user_active_question')}
              formDescription={t('Users.form.is_user_active_description')}
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
                title={t('Users.delete_user_dialog.title')}
                description={t('Users.delete_user_dialog.description')}
              >
                <Button size="sm" variant="destructive">
                  {t('Users.delete_user_dialog.title')}
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
                {t('Common.cancel')}
              </Button>

              <Button size="sm" type="submit" disabled={isLoading}>
                {t('Common.save')}
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </div>
        </FloatingActionBar>
      </form>
    </Form>
  );
}
