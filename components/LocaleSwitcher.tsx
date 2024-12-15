import {useLocale, useTranslations} from 'next-intl';
import {routing} from '../src/i18n/routing';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';
import React from 'react';

export default function LocaleSwitcher() {
  const t = useTranslations('lang.en');
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t('label')}>
      {routing.locales.map((cur) => (
        <option key={cur} value={cur}>
          
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}