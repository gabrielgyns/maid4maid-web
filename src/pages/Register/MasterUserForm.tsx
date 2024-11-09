import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormInput from '@/components/form/FormInput';

type MasterUserFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
};

export const MasterUserForm = ({ form }: MasterUserFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          form={form}
          name="userMaster.firstName"
          label={t('Register.first_name')}
        />
        <FormInput
          form={form}
          name="userMaster.lastName"
          label={t('Register.last_name')}
        />
      </div>

      <FormInput
        form={form}
        name="userMaster.email"
        label={t('Register.user_email')}
        type="email"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          form={form}
          name="userMaster.phone"
          label={t('Register.user_phone')}
        />
        <FormInput
          form={form}
          name="userMaster.login"
          label={t('Register.login')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          form={form}
          name="userMaster.password"
          label={t('Register.password')}
          type="password"
        />
        <FormInput
          form={form}
          name="userMaster.passwordConfirmation"
          label={t('Register.confirm_password')}
          type="password"
        />
      </div>
    </>
  );
};
