import { useTranslation } from 'react-i18next';

const ContactCenterPage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('services.cc.title')}</h1>
      <p>{t('services.cc.desc')}</p>
    </div>
  );
};

export default ContactCenterPage;
