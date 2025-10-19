
import React, { useRef, useContext, useState, useEffect } from 'react';
import type { ModalProps } from '../../types';
import ModalWrapper from './ModalWrapper';
import { useMovable } from '../../hooks/useMovable';
import { GlobalContext } from '../../contexts/GlobalContext';
import { SERVICES_DATA } from '../../constants';

type SectionWithAccept = 'skills' | 'education' | 'certification' | 'hobbies';
type SectionSimple = 'continuedEducation' | 'experience';

type DynamicSectionData = {
  items: string[];
  isCompleted: boolean;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  about: string;
  skills: DynamicSectionData;
  education: DynamicSectionData;
  certification: DynamicSectionData;
  hobbies: DynamicSectionData;
  continuedEducation: string[];
  experience: string[];
};

const initialFormState: FormState = {
  name: '',
  email: '',
  phone: '',
  interest: '',
  about: '',
  skills: { items: [], isCompleted: false },
  education: { items: [], isCompleted: false },
  certification: { items: [], isCompleted: false },
  hobbies: { items: [], isCompleted: false },
  continuedEducation: [],
  experience: [],
};


const JoinModal: React.FC<ModalProps> = ({ isOpen, onClose, showBackdrop }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  useMovable(modalRef, headerRef, resizeHandleRef);

  const { language } = useContext(GlobalContext);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setFormData(initialFormState), 200);
    }
  }, [isOpen]);

  const content = {
    en: {
      title: "Join Us",
      nameLabel: "Name", namePlaceholder: "Enter your name",
      emailLabel: "Email", emailPlaceholder: "Enter your email",
      phoneLabel: "Phone", phonePlaceholder: "Enter your phone",
      skillsTitle: "Skills",
      educationTitle: "Education",
      certificationTitle: "Certification",
      hobbiesTitle: "Hobbies",
      interestTitle: "What are you interested about?",
      interestPlaceholder: "Select an option",
      continuedEducationTitle: "Continued Education",
      experienceTitle: "Experience",
      aboutTitle: "Tell us about yourself",
      aboutPlaceholder: "Tell us about yourself...",
      addFieldTitle: "Add field",
      removeFieldTitle: "Remove last field",
      accept: "Accept",
      edit: "Edit",
      submit: "Submit",
      validationErrorEmpty: "Please fill out all fields before accepting.",
      validationErrorAddOne: "Add at least one entry.",
      validationErrorAcceptSections: (sectionName: string) => `Please accept your entries in "${sectionName}" or remove them.`,
      submitSuccess: "Join form submitted successfully!",
    },
    es: {
      title: "Únete a Nosotros",
      nameLabel: "Nombre", namePlaceholder: "Ingrese su nombre",
      emailLabel: "Correo Electrónico", emailPlaceholder: "Ingrese su correo electrónico",
      phoneLabel: "Teléfono", phonePlaceholder: "Ingrese su teléfono",
      skillsTitle: "Habilidades",
      educationTitle: "Educación",
      certificationTitle: "Certificación",
      hobbiesTitle: "Pasatiempos",
      interestTitle: "¿En qué está interesado?",
      interestPlaceholder: "Seleccione una opción",
      continuedEducationTitle: "Educación Continua",
      experienceTitle: "Experiencia",
      aboutTitle: "Cuéntanos sobre ti",
      aboutPlaceholder: "Cuéntanos sobre ti...",
      addFieldTitle: "Añadir campo",
      removeFieldTitle: "Eliminar último campo",
      accept: "Aceptar",
      edit: "Editar",
      submit: "Enviar",
      validationErrorEmpty: "Por favor, complete todos los campos antes de aceptar.",
      validationErrorAddOne: "Añada al menos una entrada.",
      validationErrorAcceptSections: (sectionName: string) => `Por favor, acepte sus entradas en "${sectionName}" o elimínelas.`,
      submitSuccess: "¡Formulario de inscripción enviado con éxito!",
    },
  };
  const currentContent = content[language];

  const handleStateChange = (field: keyof FormState, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDynamicItemChange = (section: SectionWithAccept | SectionSimple, index: number, value: string) => {
    if (section in formData && 'items' in formData[section as SectionWithAccept]) {
        const sectionData = formData[section as SectionWithAccept];
        const newItems = [...sectionData.items];
        newItems[index] = value;
        setFormData(prev => ({ ...prev, [section]: { ...sectionData, items: newItems } }));
    } else {
        const newItems = [...(formData[section as SectionSimple])];
        newItems[index] = value;
        setFormData(prev => ({ ...prev, [section]: newItems }));
    }
  };
  
  const addDynamicItem = (section: SectionWithAccept | SectionSimple) => {
    if (section in formData && 'items' in formData[section as SectionWithAccept]) {
        const sectionData = formData[section as SectionWithAccept];
        setFormData(prev => ({ ...prev, [section]: { ...sectionData, items: [...sectionData.items, ''] } }));
    } else {
        const items = formData[section as SectionSimple];
        setFormData(prev => ({ ...prev, [section]: [...items, ''] }));
    }
  };

  const removeDynamicItem = (section: SectionWithAccept) => {
      const sectionData = formData[section];
      if (sectionData.items.length > 0) {
          const newItems = sectionData.items.slice(0, -1);
          setFormData(prev => ({ ...prev, [section]: { ...sectionData, items: newItems } }));
      }
  };
  
  const handleToggleAccept = (section: SectionWithAccept, accept: boolean) => {
    const sectionData = formData[section];
    if (accept) {
        if (sectionData.items.length === 0) {
            alert(currentContent.validationErrorAddOne);
            return;
        }
        if (sectionData.items.some(item => !item.trim())) {
            alert(currentContent.validationErrorEmpty);
            return;
        }
    }
    setFormData(prev => ({ ...prev, [section]: { ...sectionData, isCompleted: accept } }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sectionsToValidate: {key: SectionWithAccept, name: string}[] = [
        {key: 'skills', name: currentContent.skillsTitle},
        {key: 'education', name: currentContent.educationTitle},
        {key: 'certification', name: currentContent.certificationTitle},
        {key: 'hobbies', name: currentContent.hobbiesTitle},
    ];

    for (const sec of sectionsToValidate) {
        const sectionData = formData[sec.key];
        if (sectionData.items.length > 0 && !sectionData.isCompleted) {
            alert(currentContent.validationErrorAcceptSections(sec.name));
            return;
        }
    }
    
    alert(currentContent.submitSuccess);
    onClose();
  };

  const DynamicSection = ({ sectionKey, title, hasAcceptEdit = false }: {sectionKey: SectionWithAccept | SectionSimple, title: string, hasAcceptEdit?: boolean}) => {
    const data = formData[sectionKey as SectionWithAccept];
    const items = hasAcceptEdit ? data.items : formData[sectionKey as SectionSimple];
    const isCompleted = hasAcceptEdit ? data.isCompleted : false;

    return (
      <div className={`border border-dashed dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800/50 p-4 mt-6 transition-colors ${isCompleted ? 'border-green-500' : 'border-gray-300'}`}>
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-light-text dark:text-dark-text flex items-center">
            {title}
            {isCompleted && <i className="fas fa-check-circle text-green-500 ml-2"></i>}
          </h2>
          {hasAcceptEdit && (
            <div className="flex items-center">
              <button type="button" onClick={() => addDynamicItem(sectionKey as SectionWithAccept)} disabled={isCompleted} title={currentContent.addFieldTitle} className="w-7 h-7 rounded-full border-none bg-primary text-white font-bold text-lg cursor-pointer flex items-center justify-center disabled:bg-gray-400 dark:disabled:bg-gray-600">+</button>
              <button type="button" onClick={() => removeDynamicItem(sectionKey as SectionWithAccept)} disabled={isCompleted} title={currentContent.removeFieldTitle} className="w-7 h-7 rounded-full border-none bg-red-500 text-white font-bold text-xl cursor-pointer flex items-center justify-center ml-2 disabled:bg-gray-400 dark:disabled:bg-gray-600">-</button>
            </div>
          )}
        </div>
        <div className="inputs mt-2 space-y-2">
            {items.map((item, index) => (
                <input 
                  key={index} 
                  type="text" 
                  placeholder={`${language === 'en' ? 'Enter' : 'Ingrese'} ${title.toLowerCase()}`}
                  value={item}
                  onChange={(e) => handleDynamicItemChange(sectionKey, index, e.target.value)}
                  disabled={isCompleted}
                  className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-800"
                />
            ))}
        </div>
        {!hasAcceptEdit && <button type="button" onClick={() => addDynamicItem(sectionKey)} title={currentContent.addFieldTitle} className="mt-2 w-7 h-7 rounded-full border-none bg-primary text-white font-bold text-lg cursor-pointer flex items-center justify-center">+</button>}
        {hasAcceptEdit && !isCompleted && <button type="button" onClick={() => handleToggleAccept(sectionKey as SectionWithAccept, true)} className="mt-4 py-1 px-4 border-none rounded bg-green-500 text-white cursor-pointer hover:bg-green-600 transition-colors">{currentContent.accept}</button>}
        {hasAcceptEdit && isCompleted && <button type="button" onClick={() => handleToggleAccept(sectionKey as SectionWithAccept, false)} className="mt-4 py-1 px-4 border-none rounded bg-yellow-400 text-black cursor-pointer hover:bg-yellow-500 transition-colors">{currentContent.edit}</button>}
      </div>
    );
  };
  
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} showBackdrop={showBackdrop} modalClassName="w-auto max-w-2xl min-w-[320px] fixed bottom-24 right-4 lg:bottom-10">
      <div ref={modalRef} style={{ width: '600px', maxHeight: '85vh' }} className="bg-white dark:bg-dark-modal text-light-text dark:text-dark-text rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div ref={headerRef} className="p-4 bg-gray-100 dark:bg-gray-800 cursor-move flex justify-between items-center shrink-0 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold">{currentContent.title}</h2>
          <button onClick={onClose} className="text-xl font-bold text-gray-500 hover:text-accent">&times;</button>
        </div>
        <form id="joinForm" onSubmit={handleSubmit} noValidate className="p-6 overflow-y-auto flex-grow no-scrollbar bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">{currentContent.nameLabel}</label>
                <input id="name" name="name" required placeholder={currentContent.namePlaceholder} value={formData.name} onChange={(e) => handleStateChange('name', e.target.value)} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">{currentContent.emailLabel}</label>
                <input id="email" type="email" name="email" required placeholder={currentContent.emailPlaceholder} value={formData.email} onChange={(e) => handleStateChange('email', e.target.value)} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">{currentContent.phoneLabel}</label>
                <input id="phone" type="tel" name="phone" required placeholder={currentContent.phonePlaceholder} value={formData.phone} onChange={(e) => handleStateChange('phone', e.target.value)} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"/>
              </div>
            </div>

            <DynamicSection sectionKey="skills" title={currentContent.skillsTitle} hasAcceptEdit />
            <DynamicSection sectionKey="education" title={currentContent.educationTitle} hasAcceptEdit />
            <DynamicSection sectionKey="certification" title={currentContent.certificationTitle} hasAcceptEdit />
            <DynamicSection sectionKey="hobbies" title={currentContent.hobbiesTitle} hasAcceptEdit />

            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800/50 p-4 mt-6">
                <h2 className="font-semibold">{currentContent.interestTitle}</h2>
                <select id="jn-interest" required className="w-full p-2 mt-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600" value={formData.interest} onChange={(e) => handleStateChange('interest', e.target.value)}>
                    <option value="" disabled>{currentContent.interestPlaceholder}</option>
                    {Object.keys(SERVICES_DATA).map(key => (
                      <option key={key} value={key}>{(SERVICES_DATA as any)[key][language].title}</option>
                    ))}
                </select>
            </div>
            
            <DynamicSection sectionKey="continuedEducation" title={currentContent.continuedEducationTitle} />
            <DynamicSection sectionKey="experience" title={currentContent.experienceTitle} />

            <div className="mt-6">
                <label htmlFor="about" className="block text-sm font-medium mb-1">{currentContent.aboutTitle}</label>
                <textarea id="about" rows={4} placeholder={currentContent.aboutPlaceholder} value={formData.about} onChange={(e) => handleStateChange('about', e.target.value)} className="w-full p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></textarea>
            </div>

            <div className="mt-8 text-center">
                <button type="submit" className="w-32 h-12 bg-primary border-none rounded-xl text-white font-semibold text-base cursor-pointer shadow-lg hover:bg-accent-dark transition-colors duration-300">{currentContent.submit}</button>
            </div>
        </form>
        <div ref={resizeHandleRef} className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize text-gray-400 dark:text-gray-600 hover:text-accent transition-colors">
            <i className="fas fa-expand-alt rotate-90"></i>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default JoinModal;
