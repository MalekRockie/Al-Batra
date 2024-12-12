import {useTranslations} from 'next-intl';
import PageLayout from './PageLayout';
import React from 'react';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <PageLayout title={t('title')}>
      <p className="max-w-[460px]">{t('description')}</p>
    </PageLayout>
  );
}