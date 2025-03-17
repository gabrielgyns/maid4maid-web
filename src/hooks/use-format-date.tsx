import { useTranslation } from 'react-i18next';
import { formatDate } from 'date-fns';
import { enUS, es, ptBR } from 'date-fns/locale';

export function useFormatDate() {
  const { i18n } = useTranslation();

  const localeOptions = {
    en: {
      locale: enUS,
      format: 'MMMM dd, yyyy, HH:mm',
    },
    es: {
      locale: es,
      format: 'MMMM dd, yyyy, HH:mm',
    },
    pt: {
      locale: ptBR,
      format: "dd 'de' MMMM 'de' yyyy, 'às' HH:mm",
    },
  };

  const locale = localeOptions[i18n.language as keyof typeof localeOptions];

  const formatDateWithLocale = (date: Date | string) => {
    return formatDate(date, locale.format, {
      locale: locale.locale,
    });
  };

  return {
    formatDateWithLocale,
  };
}
