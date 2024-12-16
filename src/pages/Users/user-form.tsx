/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarClock, Loader2, UserPen } from 'lucide-react';
import { z } from 'zod';

import ConfirmDialog from '@/components/confirm-dialog';
import { FloatingActionBar } from '@/components/floating-action-bar';
import FormInput from '@/components/form/form-input';
import FormSwitchInput from '@/components/form/form-switch-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { User, userSchema } from '@/schemas/user.types';
import { cn } from '@/utils';

const createUserSchema = userSchema
  .extend({
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

interface UserFormProps {
  user?: User;
  isLoading?: boolean;
  onSubmit: (data: User) => Promise<void>;
  onDelete?: (userId: string) => Promise<void>;
}

export default function UserForm({
  user,
  isLoading,
  onSubmit,
  onDelete,
}: UserFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userFormSchema = user?.id ? userSchema : createUserSchema;
  type UserFormData = z.infer<typeof userFormSchema>;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    mode: 'onBlur',
    values: user as UserFormData,
  });

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit(data);
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

        <Card className="space-y-4 p-6">
          {/* TODO: Avatar fields */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              form={form}
              name="email"
              label={t('Register.user_email')}
              type="email"
            />

            {/* TODO: Add debouce to check if Login exists, if no -> Check, if yes -> X */}
            <FormInput form={form} name="login" label={t('Register.login')} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              form={form}
              name="phone"
              label={t('Register.user_phone')}
            />

            {/* TODO: Add Secondary Phone */}
          </div>

          {/* TODO: Fields -> Default Team... Role... */}
          {/* TODO: Is User Active? -> isUserActive, if false, user cannot login (we can do that with prisma) */}

          {/* TODO: Button -> Update Password, then we update the password separately */}
          {!user?.id && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                form={form}
                name="password"
                label={t('Register.password')}
                type="password"
              />
              <FormInput
                form={form}
                name="passwordConfirmation"
                label={t('Register.confirm_password')}
                type="password"
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="col-span-2 place-content-center text-sm text-muted-foreground">
              <CalendarClock className="mb-0.5 mr-2 inline-block h-4 w-4" />
              <b>Last logged in:</b>{' '}
              {new Date(user?.lastLoginAt).toUTCString() ??
                'User not created or User never logged in'}
            </div>

            <FormSwitchInput
              form={form}
              name="isDriver"
              label="Is Driver?"
              classNames="col-span-1 col-start-3"
            />

            <FormSwitchInput
              form={form}
              name="isUserActive"
              label="Is User Active?"
              classNames="col-span-1 col-start-4"
              disabled
            />
          </div>
        </Card>

        {/* 
          TODO:
            user.id -> Table: Last Jobs + Last Activities
            !user.id -> Table (in blur): Here will be your Last Jobs + Last Activities
          */}

        <FloatingActionBar>
          <div
            className={cn('flex flex-1 justify-between', {
              'justify-end': !user?.id,
            })}
          >
            {user?.id && (
              <ConfirmDialog
                onConfirm={() => onDelete && onDelete(user.id as string)}
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
