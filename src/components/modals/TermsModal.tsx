import React, { useContext, useRef } from 'react';
import ModalWrapper from './ModalWrapper';
import { useMovable } from '../../hooks/useMovable';
import type { ModalProps } from '../../types';
import { GlobalContext } from '../../contexts/GlobalContext';
import Icon from '../Icon';
import LanguageToggle from '../LanguageToggle';

const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose, showBackdrop = true }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  useMovable(modalRef, headerRef, resizeHandleRef);
  const { language } = useContext(GlobalContext);

  const copy = {
    en: {
      title: 'Terms & Conditions',
      updated: 'Last updated: January 10, 2025',
      intro:
        'Welcome to OPS Online Support. By engaging with our site, digital products, or AI assistants, you agree to the following terms that safeguard a secure, human-centered, and compliant service.',
      sections: [
        {
          heading: '1. Acceptance of terms',
          body:
            'Your continued use signifies acceptance of these Terms & Conditions and all policies referenced herein. If you do not agree, please discontinue use immediately.',
        },
        {
          heading: '2. Scope of services',
          body:
            'OPS delivers AI-augmented operations, UX, and DevSecOps capabilities. Engagements may cover discovery, design, implementation, analytics, and managed services delivered under separate statements of work.',
          bullets: [
            'Intelligent code lifecycle automation across cloud and DevOps platforms.',
            'Human-centered interface and experience design aligned with WCAG 2.1 AA and Core Web Vitals.',
            'Cybersecurity orchestration mapped to NIST CSF, CISA Cyber Essentials, and PCI DSS 4.0 controls.',
          ],
        },
        {
          heading: '3. Privacy & data protection',
          body:
            'We implement privacy-by-design, GDPR/CCPA readiness, and lawful basis governance. Client data is processed only for contracted purposes, secured via AES-256 encryption in transit and at rest.',
          bullets: [
            'Security headers (CSP, HSTS, CORS) and cookie controls are enforced across digital surfaces.',
            'Audit trails and logging support PCI DSS requirement 10 and regulatory reporting.',
          ],
        },
        {
          heading: '4. Security & acceptable use',
          body:
            'Users must protect access credentials, refrain from malicious activities, and notify OPS of incidents within 24 hours. OPS reserves the right to suspend access to preserve integrity.',
        },
        {
          heading: '5. Liability & disclaimers',
          body:
            'Services are provided “as-is” within the scope of engagement. OPS is not responsible for indirect, incidental, or consequential damages. Regulatory compliance remains a shared responsibility with the client.',
        },
        {
          heading: '6. Updates to these terms',
          body:
            'OPS may revise these terms to reflect evolving regulations, technology, and service improvements. Material changes will be communicated through the site or designated contacts.',
        },
      ],
      closing:
        'Questions? Contact OPS Online Support at compliance@ops.support or use the Contact Us form so we can assist promptly.',
      close: 'Close',
    },
    es: {
      title: 'Términos y Condiciones',
      updated: 'Última actualización: 10 de enero de 2025',
      intro:
        'Bienvenido a OPS Online Support. Al utilizar nuestro sitio, productos digitales o asistentes de IA, usted acepta los siguientes términos que protegen un servicio seguro, centrado en las personas y conforme.',
      sections: [
        {
          heading: '1. Aceptación de los términos',
          body:
            'El uso continuado implica la aceptación de estos Términos y Condiciones y de todas las políticas referenciadas. Si no está de acuerdo, suspenda el uso de inmediato.',
        },
        {
          heading: '2. Alcance de los servicios',
          body:
            'OPS ofrece capacidades de operaciones, UX y DevSecOps aumentadas con IA. Los compromisos pueden incluir descubrimiento, diseño, implementación, analítica y servicios gestionados bajo acuerdos específicos.',
          bullets: [
            'Automatización inteligente del ciclo de vida del código en plataformas cloud y DevOps.',
            'Diseño de interfaces centradas en el ser humano alineadas con WCAG 2.1 AA y Core Web Vitals.',
            'Orquestación de ciberseguridad basada en NIST CSF, CISA Cyber Essentials y los controles de PCI DSS 4.0.',
          ],
        },
        {
          heading: '3. Privacidad y protección de datos',
          body:
            'Aplicamos privacidad desde el diseño, cumplimiento con GDPR/CCPA y gobierno con base legal. Los datos del cliente se procesan solo para los fines contratados y se protegen con cifrado AES-256 en tránsito y en reposo.',
          bullets: [
            'Se aplican cabeceras de seguridad (CSP, HSTS, CORS) y controles de cookies en todas las superficies digitales.',
            'Los registros y auditorías respaldan el requisito 10 de PCI DSS y los reportes regulatorios.',
          ],
        },
        {
          heading: '4. Seguridad y uso aceptable',
          body:
            'Los usuarios deben proteger sus credenciales, abstenerse de actividades maliciosas y notificar a OPS sobre incidentes en un plazo de 24 horas. OPS puede suspender accesos para preservar la integridad.',
        },
        {
          heading: '5. Responsabilidad y exenciones',
          body:
            'Los servicios se proporcionan “tal cual” dentro del alcance acordado. OPS no es responsable de daños indirectos, incidentales o consecuentes. El cumplimiento normativo sigue siendo una responsabilidad compartida con el cliente.',
        },
        {
          heading: '6. Actualizaciones de estos términos',
          body:
            'OPS puede actualizar estos términos para reflejar cambios regulatorios, tecnológicos y de servicio. Los cambios materiales se comunicarán a través del sitio o de los contactos designados.',
        },
      ],
      closing:
        '¿Preguntas? Comuníquese con OPS Online Support en compliance@ops.support o utilice el formulario de Contáctenos para recibir asistencia.',
      close: 'Cerrar',
    },
  } as const;

  const content = copy[language];

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      showBackdrop={showBackdrop}
      modalClassName="w-full max-w-3xl px-4 md:px-0 top-[4vh] md:top-[3vh] left-1/2 -translate-x-1/2"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-dark-modal text-light-text dark:text-dark-text rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-white/10"
      >
        <div ref={headerRef} className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800 cursor-move">
          <div>
            <h2 className="text-xl font-semibold">{content.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-300">{content.updated}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle size="sm" />
            <button
              type="button"
              onClick={onClose}
              onMouseDown={(event) => event.stopPropagation()}
              className="text-2xl leading-none text-accent hover:text-primary transition-colors"
              aria-label={content.close}
            >
              &times;
            </button>
          </div>
        </div>
        <div className="px-6 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-gray-700 dark:text-gray-300">{content.intro}</p>
          <div className="space-y-5">
            {content.sections.map((section) => (
              <section key={section.heading} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-gray-50/80 dark:bg-gray-900/40">
                <h3 className="text-base font-semibold text-primary dark:text-accent mb-2">{section.heading}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{section.body}</p>
                {section.bullets && (
                  <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-2 items-start">
                        <span className="mt-1 text-primary dark:text-accent">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{content.closing}</p>
        </div>
        <div className="px-6 py-4 bg-gray-100 dark:bg-gray-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-accent transition-colors"
          >
            {content.close}
          </button>
        </div>
        <div ref={resizeHandleRef} className="absolute bottom-2 right-3 text-gray-400 dark:text-gray-600">
          <Icon name="expand" className="w-5 h-5 rotate-90" />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default TermsModal;
