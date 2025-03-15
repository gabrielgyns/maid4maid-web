/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';

import FormInput from '@/components/form/form-input';
import LanguageSwitcher from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

type FormData = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isTokenValid, setIsTokenValid] = useState(false);

  const { resetPassword, validateResetToken, isLoading } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      const isValid = await validateResetToken(token);
      setIsTokenValid(isValid);
    };

    void validateToken();
  }, [token, validateResetToken, navigate]);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      return;
    }

    await resetPassword({
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
      token,
    });
  };

  if (!isTokenValid && !isLoading) {
    return null;
  }

  return (
    <Card className="w-full sm:w-[34.375rem]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Insert your new password below and submit it.
        </CardDescription>
      </CardHeader>

      <CardContent className="py-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              form={form}
              name="password"
              label="New Password"
              type="password"
              placeholder="Insert your new password"
              disabled={isLoading}
            />

            <FormInput
              form={form}
              name="passwordConfirmation"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="mt-4 flex w-full justify-between text-sm">
          <Button variant="link" className="" asChild size="sm">
            <Link to="/login">Back to login</Link>
          </Button>
          <Button variant="link" className="" asChild size="sm">
            <Link to="/register">{t('Login.subscribe_link')}</Link>
          </Button>
        </div>

        <Separator />

        <div className="text-center text-sm text-muted-foreground">
          {t('Login.org_already_registered')}
        </div>

        <Separator />

        <div className="flex items-center justify-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </CardFooter>
    </Card>
  );
}
