
import React, { useRef, useContext } from 'react';
import type { ModalProps } from '../../types';
import ModalWrapper from './ModalWrapper';
import { useMovable } from '../../hooks/useMovable';
import { GlobalContext } from '../../contexts/GlobalContext';
import { SERVICES_DATA } from '../../constants';
import Icon from '../Icon';

const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose, showBackdrop }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  useMovable(modalRef, headerRef, resizeHandleRef);
  const { language } = useContext(GlobalContext);

  const content = {
    en: {
      title: "Contact Us",
      nameLabel: "Name",
      namePlaceholder: "Enter your name",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      contactNumberLabel: "Contact Number",
      contactNumberPlaceholder: "Enter your contact number",
      preferredDateLabel: "Preferred Date",
      preferredTimeLabel: "Preferred Time",
      interestLabel: "What are you interested about?",
      interestPlaceholder: "Select an option",
      commentsLabel: "Comments",
      commentsPlaceholder: "What service are you interested in?",
      submit: "Send",
    },
    es: {
      title: "Contáctenos",
      nameLabel: "Nombre",
      namePlaceholder: "Ingrese su nombre",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "Ingrese su correo electrónico",
      contactNumberLabel: "Número de Contacto",
      contactNumberPlaceholder: "Ingrese su número de contacto",
      preferredDateLabel: "Fecha Preferida",
      preferredTimeLabel: "Hora Preferida",
      interestLabel: "¿En qué está interesado?",
      interestPlaceholder: "Seleccione una opción",
      commentsLabel: "Comentarios",
      commentsPlaceholder: "¿En qué servicio está interesado?",
      submit: "Enviar",
    }
  };

  const currentContent = content[language];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Contact form submitted!');
    const form = e.target as HTMLFormElement;
    form.reset();
    onClose();
  };


  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} showBackdrop={showBackdrop} modalClassName="w-auto max-w-xl min-w-[320px] fixed bottom-24 right-4 lg:bottom-40">
      <div ref={modalRef} style={{ width: '600px', height: 'auto' }} className="bg-white dark:bg-dark-modal text-light-text dark:text-dark-text rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div ref={headerRef} className="p-4 bg-gray-100 dark:bg-gray-800 cursor-move flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold">{currentContent.title}</h2>
          <button onClick={onClose} className="text-xl font-bold text-accent">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <form onSubmit={handleSubmit} className="flex flex-col h-full bg-gray-50 dark:bg-gray-800/70 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap -mx-3">
                <div className="w-full md:w-1/2 px-3 mb-4">
                    <label htmlFor="contact-name" className="block text-sm font-medium mb-1">{currentContent.nameLabel}</label>
                    <input type="text" id="contact-name" required placeholder={currentContent.namePlaceholder} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4">
                    <label htmlFor="contact-email" className="block text-sm font-medium mb-1">{currentContent.emailLabel}</label>
                    <input type="email" id="contact-email" required placeholder={currentContent.emailPlaceholder} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3">
                <div className="w-full md:w-1/2 px-3 mb-4">
                    <label htmlFor="contact-number" className="block text-sm font-medium mb-1">{currentContent.contactNumberLabel}</label>
                    <input type="tel" id="contact-number" required placeholder={currentContent.contactNumberPlaceholder} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4">
                    <label htmlFor="preferred-date" className="block text-sm font-medium mb-1">{currentContent.preferredDateLabel}</label>
                    <input type="date" id="preferred-date" required className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                </div>
            </div>
             <div className="flex flex-wrap -mx-3">
                <div className="w-full md:w-1/2 px-3 mb-4">
                    <label htmlFor="preferred-time" className="block text-sm font-medium mb-1">{currentContent.preferredTimeLabel}</label>
                    <input type="time" id="preferred-time" required className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600" />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4">
                    <label htmlFor="contact-interest" className="block text-sm font-medium mb-1">{currentContent.interestLabel}</label>
                    <select id="contact-interest" required defaultValue="" className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                        <option value="" disabled>{currentContent.interestPlaceholder}</option>
                         {Object.keys(SERVICES_DATA).map(key => (
                            <option key={key} value={(SERVICES_DATA as any)[key][language].title}>{(SERVICES_DATA as any)[key][language].title}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="mb-4 flex-grow flex flex-col">
              <label htmlFor="contact-comments" className="block text-sm font-medium mb-1">{currentContent.commentsLabel}</label>
              <textarea id="contact-comments" rows={3} placeholder={currentContent.commentsPlaceholder} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex-grow"></textarea>
            </div>
            <div className="mt-4 text-center">
                <button type="submit" className="w-32 h-12 bg-primary border-none rounded-xl text-white font-semibold text-base cursor-pointer shadow-lg hover:bg-accent-dark transition-colors duration-300">
                    {currentContent.submit}
                </button>
            </div>
          </form>
        </div>
        <div ref={resizeHandleRef} className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize text-gray-400 dark:text-gray-600 hover:text-accent transition-colors">
            <Icon name="expand" className="w-5 h-5 rotate-90" />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ContactModal;
