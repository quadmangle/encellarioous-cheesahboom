import React, { useContext } from 'react';
import type { ModalProps } from '../../types';
import { GlobalContext } from '../../contexts/GlobalContext';
import { SERVICES_DATA } from '../../constants';
import ModalWrapper from './ModalWrapper';

const ServiceModal: React.FC<ModalProps> = ({ isOpen, onClose, serviceKey }) => {
  const { language } = useContext(GlobalContext);

  if (!isOpen || !serviceKey) {
    return null;
  }
  
  const service = SERVICES_DATA[serviceKey][language];
  const { modal: modalData } = service;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      modalClassName="w-[96vw] max-w-4xl min-w-[320px] top-[6vh] md:top-[5vh]"
    >
      <div className="bg-white dark:bg-dark-modal text-light-text dark:text-dark-text rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={modalData.img} alt={modalData.imgAlt} className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
            <h2 className="text-2xl font-bold">{modalData.title}</h2>
          </div>
          <button onClick={onClose} className="text-3xl font-light text-gray-500 hover:text-accent transition-colors">&times;</button>
        </div>
        <div className="p-8 grid md:grid-cols-2 gap-8 overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-accent">About the Service</h3>
            <p className="text-base leading-relaxed">{modalData.content}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-primary dark:text-accent">Key Features</h3>
            <ul className="list-disc list-inside space-y-2 text-base">
              {modalData.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center gap-4">
          <button onClick={onClose} className="py-2 px-5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Close</button>
          <a href={modalData.learn} className="py-2 px-5 rounded-lg bg-primary text-white hover:bg-accent transition-colors">Learn More</a>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ServiceModal;
