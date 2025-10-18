import { useTranslation } from 'react-i18next';
import PageContainer from '../styles/PageContainer';
const ContactCenterPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <h1>{t('services.cc.title')}</h1>
      <p>{t('services.cc.desc')}</p>
    </PageContainer>
  );
};

export default ContactCenterPage;
