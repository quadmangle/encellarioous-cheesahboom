import { useTranslation } from 'react-i18next';

const ProfessionalServicesPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('services.pro.title')}</h1>
      <p>{t('services.pro.desc')}</p>
    </div>
  );
};

export default ProfessionalServicesPage;
