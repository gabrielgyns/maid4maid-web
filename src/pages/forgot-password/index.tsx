/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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

const formSchema = z.object({
  email: z
    .string()
    .email('Invalid email address.')
    .min(1, 'Email is required.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { forgotPassword, isLoading } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async ({ email }: FormData) => {
    await forgotPassword(email);
  };

  return (
    <Card className="w-full sm:w-[34.375rem]">
      <CardHeader className="text-center">
        <CardTitle className="mb-4 text-2xl">
          Did you forget your password?
        </CardTitle>
        <CardDescription>
          Insert your email below and submit it, you are going to receive a link
          to reset your password.
        </CardDescription>
      </CardHeader>

      <CardContent className="py-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Insert a valid email"
              disabled={isLoading}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Send email to reset'
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
