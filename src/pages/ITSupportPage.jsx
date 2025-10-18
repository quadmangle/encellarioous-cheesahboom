import { useTranslation } from 'react-i18next';
import PageContainer from '../styles/PageContainer';

const ITSupportPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <h1>{t('services.it.title')}</h1>
      <p>{t('services.it.desc')}</p>
    </PageContainer>
  );
};

export default ITSupportPage;
