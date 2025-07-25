import { useTranslation } from 'react-i18next';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type LanguageType = 'en' | 'es' | 'pt';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (language: LanguageType) => {
    await i18n.changeLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          {i18n.language === 'pt'
            ? t('Language.portuguese')
            : i18n.language === 'es'
              ? t('Language.spanish')
              : t('Language.english')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            void changeLanguage('en');
          }}
        >
          {t('Language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void changeLanguage('es');
          }}
        >
          {t('Language.spanish')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void changeLanguage('pt');
          }}
        >
          {t('Language.portuguese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
