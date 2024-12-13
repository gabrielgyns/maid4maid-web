import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import FormInput from '@/components/form/form-input';

type OrganizationFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
};

export const OrganizationForm = ({ form }: OrganizationFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <FormInput
        form={form}
        name="organization.name"
        label={t('Register.organization_name')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          form={form}
          name="organization.email"
          label={t('Register.organization_email')}
          type="email"
        />

        <FormInput
          form={form}
          name="organization.phone"
          label={t('Register.organization_phone')}
        />
      </div>

      <FormInput
        form={form}
        name="organization.address"
        label={t('Register.address')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          form={form}
          name="organization.city"
          label={t('Register.city')}
        />

        <FormInput
          form={form}
          name="organization.state"
          label={t('Register.state')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          form={form}
          name="organization.zipCode"
          label={t('Register.zip_code')}
        />

        <FormInput
          form={form}
          name="organization.country"
          label={t('Register.country')}
        />
      </div>
    </>
  );
};
