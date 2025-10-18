import { useTranslation } from 'react-i18next';

const ITSupportPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('services.it.title')}</h1>
      <p>{t('services.it.desc')}</p>
    </div>
  );
};

export default ITSupportPage;
