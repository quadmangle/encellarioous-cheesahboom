import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';

const HomePage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <h1>{t('home.header.heading')}</h1>
      <p>{t('home.header.subheading')}</p>
      <div style={{ display: 'flex' }}>
        <Card title={t('services.ops.title')} description={t('services.ops.desc')} />
        <Card title={t('services.cc.title')} description={t('services.cc.desc')} />
        <Card title={t('services.it.title')} description={t('services.it.desc')} />
        <Card title={t('services.pro.title')} description={t('services.pro.desc')} />
      </div>
      <Button onClick={() => setIsModalOpen(true)}>{t('home.cta.contact')}</Button>
      {isModalOpen && (
        <Modal title={t('home.cta.contact')} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
            <Button type="submit">Submit</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
