/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import * as z from 'zod';

import FormInput from '@/components/form/FormInput';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
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
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  username: z.string().min(1, 'Por favor insira um username válido.'),
  password: z.string().min(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      await login(data);

      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Oops. Check you credentials, please.');
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-96">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">CRMaidEasy</CardTitle>
          <CardDescription>
            Enter your credentials below to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="py-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                form={form}
                name="username"
                label="Username"
                placeholder="Insert your username"
                disabled={isLoading}
              />

              <FormInput
                form={form}
                name="password"
                label="Password"
                type="password"
                placeholder="Insert your password"
                disabled={isLoading}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  t('Login.loginButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="mt-4 text-center text-sm">
            <Button variant="link" className="w-full" asChild size="sm">
              <Link to="/register">{t('Login.subscribeLink')}</Link>
            </Button>
          </div>

          <Separator />

          <div className="text-center text-sm text-muted-foreground">
            {t('Login.orgAlreadyRegistered')}
          </div>

          <Separator />

          <div className="flex items-center justify-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
