import React, { useState, useMemo, useContext, useEffect, useRef } from 'react';
import type { ModalProps, ServiceKey } from '../../types';
import { GlobalContext } from '../../contexts/GlobalContext';
import ModalWrapper from './ModalWrapper';
import { BM25 } from '../../services/efficiency/bm25';
import { SERVICES_DATA } from '../../constants';
import Icon from '../Icon';

// Fix: Add type definitions for the Web Speech API to prevent TypeScript errors.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const createCorpus = (language: 'en' | 'es') => {
    return (Object.keys(SERVICES_DATA) as ServiceKey[]).map(key => {
        const service = SERVICES_DATA[key];
        const content = service[language];
        const features = content.modal.features.join(' ');
        // Repeat title to give it more weight in search relevance
        const title = `${content.title}. `.repeat(3);
        const text = `${title}${content.desc}. ${content.modal.content} Features include: ${features}`;
        return { key, text };
    });
};

const SearchModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const { language } = useContext(GlobalContext);
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const corpus = useMemo(() => createCorpus(language), [language]);
    // Fix: Provide the generic type to BM25 to preserve key type safety. This resolves the downstream error.
    const searchIndex = useMemo(() => new BM25<ServiceKey>(corpus), [corpus]);

    const allServices = useMemo(() => {
      return (Object.keys(SERVICES_DATA) as ServiceKey[]).map(key => ({
        key,
        title: SERVICES_DATA[key][language].title,
        desc: SERVICES_DATA[key][language].desc,
        icon: SERVICES_DATA[key][language].icon,
      }));
    }, [language]);

    // Setup Speech Recognition
    useEffect(() => {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'es' ? 'es-ES' : 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;
    }, [language]);
    
    const handleMicClick = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setQuery(''); // Clear previous query before listening
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const searchResults = useMemo(() => {
        if (!query.trim()) {
            return allServices;
        }
        const results = searchIndex.search(query);
        const serviceMap = new Map(allServices.map(s => [s.key, s]));
        return results.map(result => serviceMap.get(result.doc.key)).filter((s): s is typeof allServices[0] => !!s);
    }, [query, searchIndex, allServices]);

    const handleResultClick = (serviceKey: ServiceKey) => {
        onClose();
        const element = document.getElementById(`card-${serviceKey}`);
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.transition = 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out';
                element.style.boxShadow = '0 0 25px 8px #00c4ff';
                element.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    element.style.boxShadow = '';
                    element.style.transform = '';
                }, 2500);
            }, 200);
        }
    };

    useEffect(() => {
      if (isOpen) {
        setTimeout(() => document.getElementById('global-search-input')?.focus(), 100);
      }
    }, [isOpen]);

    return (
        <ModalWrapper
          isOpen={isOpen}
          onClose={onClose}
          modalClassName="w-[96vw] max-w-2xl min-w-[310px] top-[8vh] md:top-[6vh]"
        >
            <div className="bg-white dark:bg-dark-modal text-light-text dark:text-dark-text rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                    <input
                        id="global-search-input"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={language === 'en' ? 'Search services...' : 'Buscar servicios...'}
                        className="w-full bg-transparent text-lg focus:outline-none"
                    />
                    <button
                        onClick={handleMicClick}
                        title={isListening ? "Stop listening" : "Search with voice"}
                        className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-colors duration-200 ${
                            isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        <Icon name="microphone" className="w-4 h-4" />
                    </button>
                    <button onClick={onClose} className="text-sm bg-gray-200 dark:bg-gray-700 rounded px-2 py-0.5 font-mono">ESC</button>
                </div>
                <div className="max-h-[50vh] overflow-y-auto">
                    {searchResults.length > 0 ? (
                        <ul>
                            {searchResults.map((result) => (
                                <li key={result.key}>
                                    <button 
                                        onClick={() => handleResultClick(result.key)}
                                        className="w-full text-left p-4 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors flex items-center gap-4"
                                    >
                                        <Icon name={result.icon} className="w-6 h-6 text-accent" />
                                        <div>
                                            <div className="font-semibold">{result.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{result.desc}</div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-8 text-center text-gray-500">
                            {language === 'en' ? 'No services found.' : 'No se encontraron servicios.'}
                        </p>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default SearchModal;