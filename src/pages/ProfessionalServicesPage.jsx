import { useTranslation } from 'react-i18next';
import PageContainer from '../styles/PageContainer';
const ProfessionalServicesPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <h1>{t('services.pro.title')}</h1>
      <p>{t('services.pro.desc')}</p>
    </PageContainer>
  );
};

export default ProfessionalServicesPage;
