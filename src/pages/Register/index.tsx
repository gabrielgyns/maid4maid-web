/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

import LanguageSwitcher from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';

import {
  formSchema,
  registrationOrgSchema,
  registrationUserSchema,
} from '../../schemas/register.types';
import { MasterUserForm } from './master-user-form';
import { OrganizationForm } from './organization-form';
import { StepsIndicator } from './steps-indicator';

type FormData = z.infer<typeof formSchema>;

const RegisterPage = () => {
  const [step, setStep] = useState(1);

  const { isLoading, register } = useAuth();
  const { t } = useTranslation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const {
    watch,
    handleSubmit,
    formState: { isValid },
  } = form;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    const values = watch();

    switch (step) {
      case 1: {
        const result = registrationOrgSchema.safeParse(values.organization);
        return result.success;
      }
      case 2: {
        const result = registrationUserSchema.safeParse(values.userMaster);
        return result.success;
      }
      default:
        return false;
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await register(data);
  };

  return (
    <Card className="w-full sm:w-[34.375rem]">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          {t('Register.registration')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <StepsIndicator step={step} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && <OrganizationForm form={form} />}
            {step === 2 && <MasterUserForm form={form} />}
            {/* {step === 3 && <PlansForm form={form} />} */}
            {step === 3 && (
              <p className="py-14 text-center">
                In the future, here will be the plans princing for
                subscriptions. <br />
                For now, let's move 😉
              </p>
            )}
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div
          className={`flex w-full items-center ${step === 1 ? 'justify-end' : 'justify-between'}`}
        >
          {step > 1 && (
            <Button variant="outline" onClick={handlePrev}>
              {t('Common.previous')}
            </Button>
          )}

          {step === 3 ? (
            <Button onClick={handleSubmit(onSubmit)} disabled={!isValid}>
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                t('Register.register')
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!isStepValid()}>
              {t('Common.next')}
            </Button>
          )}
        </div>

        <Button variant="link" asChild size="sm">
          <Link to="/login">{t('Register.already_have_account')}</Link>
        </Button>

        <Separator />

        <div className="flex items-center justify-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
