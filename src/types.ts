// types.ts
export type Language = 'en' | 'es';
export type Theme = 'light' | 'dark';

export interface GlobalContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export type IconName = 'square' | 'chat' | 'user-plus' | 'envelope' | 'close' | 'plus' | 'home' | 'layers' | 'search' | 'microphone' | 'check-circle' | 'expand' | 'paper-plane';

export type ServiceKey = 'ops' | 'cc' | 'it' | 'pro';

export type ModalType = 'SERVICE' | 'SEARCH' | 'CHAT' | 'JOIN' | 'CONTACT' | null;

export interface ModalData {
  title: string;
  img: string;
  imgAlt: string;
  content: string;
  video: string;
  features: string[];
  learn: string;
}

export interface ServiceData {
  title: string;
  icon: IconName;
  desc: string;
  modal: ModalData;
}

export type Services = Record<ServiceKey, Record<Language, ServiceData>>;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  showBackdrop?: boolean;
  serviceKey?: ServiceKey;
}

export interface ChatMessage {
  role: 'user' | 'bot' | 'system';
  text: string;
  isLoading?: boolean;
}

export type AIProgressStatus = 'uninitialized' | 'initializing' | 'loading' | 'ready' | 'fetching' | 'error';

export interface AIProgress {
    status: AIProgressStatus;
    message: string;
    progress?: number;
}