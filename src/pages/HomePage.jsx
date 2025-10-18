import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../config';

const HomePageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: var(--space-xl);
`;

const HeroSection = styled.section`
  display: grid;
  gap: var(--space-sm);
  text-align: left;

  h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    margin: 0;
  }

  p {
    margin: 0;
    color: var(--color-text-secondary);
    max-width: 60ch;
  }
`;

const ServicesSection = styled.section`
  display: grid;
  gap: var(--space-md);
`;

const ServicesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-lg);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
`;

const Form = styled.form`
  display: grid;
  gap: var(--space-md);

  label {
    display: grid;
    gap: var(--space-xs);
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  input,
  textarea {
    padding: 0.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    background: var(--color-surface-muted);
    color: var(--color-text-primary);

    &:focus-visible {
      border-color: var(--color-accent);
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-md);
`;

const StatusMessage = styled.p`
  margin: 0;
  color: ${({ variant }) => {
    if (variant === 'error') return 'var(--color-danger)';
    if (variant === 'success') return 'var(--color-accent)';
    return 'var(--color-text-secondary)';
  }};
`;

const HomePage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const services = useMemo(
    () => [
      {
        title: t('services.ops.title'),
        description: t('services.ops.desc'),
      },
      {
        title: t('services.cc.title'),
        description: t('services.cc.desc'),
      },
      {
        title: t('services.it.title'),
        description: t('services.it.desc'),
      },
      {
        title: t('services.pro.title'),
        description: t('services.pro.desc'),
      },
    ],
    [t],
  );

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormValues({ name: '', email: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('submitting');
    setFeedback('');

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = payload?.errors?.[0]?.msg || t('home.cta.error');
        setStatus('error');
        setFeedback(message);
        return;
      }

      setStatus('success');
      setFeedback(t('home.cta.success'));
      resetForm();
    } catch (error) {
      setStatus('error');
      setFeedback(t('home.cta.error'));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStatus('idle');
    setFeedback('');
  };

  return (
    <HomePageContainer>
      <HeroSection>
        <h1>{t('home.header.heading')}</h1>
        <p>{t('home.header.subheading')}</p>
        <div>
          <Button type="button" onClick={() => setIsModalOpen(true)}>
            {t('home.cta.contact')}
          </Button>
        </div>
      </HeroSection>

      <ServicesSection aria-labelledby="services-heading">
        <h2 id="services-heading">{t('home.cta.explore')}</h2>
        <ServicesList>
          {services.map((service) => (
            <li key={service.title}>
              <Card title={service.title} description={service.description} />
            </li>
          ))}
        </ServicesList>
      </ServicesSection>

      {isModalOpen && (
        <Modal
          title={t('home.cta.contact')}
          onClose={closeModal}
          ariaDescribedBy="contact-form-description"
        >
          <p id="contact-form-description">{t('home.cta.description')}</p>
          <Form onSubmit={handleSubmit} noValidate>
            <Fieldset disabled={status === 'submitting'}>
              <label htmlFor="contact-name">
                {t('home.form.name')}
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formValues.name}
                  onChange={handleFieldChange}
                />
              </label>
              <label htmlFor="contact-email">
                {t('home.form.email')}
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formValues.email}
                  onChange={handleFieldChange}
                />
              </label>
              <label htmlFor="contact-message">
                {t('home.form.message')}
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  value={formValues.message}
                  onChange={handleFieldChange}
                />
              </label>
            </Fieldset>
            <Button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? t('home.form.submitting') : t('home.form.submit')}
            </Button>
            {feedback && (
              <StatusMessage
                role="status"
                aria-live="polite"
                variant={status}
              >
                {feedback}
              </StatusMessage>
            )}
          </Form>
        </Modal>
      )}
    </HomePageContainer>
  );
};

export default HomePage;
