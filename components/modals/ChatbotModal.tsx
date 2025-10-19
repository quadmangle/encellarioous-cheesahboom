import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import type { ModalProps, ChatMessage, AIProgress } from '../../types';
import { GlobalContext } from '../../contexts/GlobalContext';
import ModalWrapper from './ModalWrapper';
import { useMovable } from '../../hooks/useMovable';
import { streamChatResponse, resetChat, ACTIVE_STACK } from '../../services/aiService';
import { useChatSession } from '../../hooks/useChatSession';

const ChatbotModal: React.FC<ModalProps> = ({ isOpen, onClose, showBackdrop }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  
  useMovable(modalRef, headerRef, resizeHandleRef);

  const { language } = useContext(GlobalContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<AIProgress | null>(null);

  const initialMessage = useMemo(
    () =>
      language === 'en'
        ? "Hello! I'm Chattia, your AI assistant for OPS. How can I help you learn about our services like Business Operations, IT Support, or our Contact Center solutions?"
        : '¡Hola! Soy Chattia, tu asistente de IA para OPS. ¿Cómo puedo ayudarte a conocer nuestros servicios como Operaciones de Negocio, Soporte de TI o soluciones de Centro de Contacto?',
    [language]
  );

  const conversationHistory = useMemo<ChatMessage[]>(
    () =>
      messages
        .filter((message) => !message.isLoading)
        .map((message) => ({ role: message.role, text: message.text })),
    [messages]
  );

  const { session, restartSession } = useChatSession(language, conversationHistory);
  const sessionDescriptor = useMemo(() => {
    if (!session) {
      return null;
    }
    const started = new Date(session.createdAt);
    const formatted = started.toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return {
      idSuffix: session.id.slice(-6),
      started: formatted,
    };
  }, [session, language]);

  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: 'bot', text: initialMessage }]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      resetChat();
      setMessages([]);
      setProgress(null);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleProgress = (progressUpdate: AIProgress) => {
    setProgress(progressUpdate);
  };

  const handleSessionRestart = async () => {
    await restartSession();
    setMessages([{ role: 'bot', text: initialMessage }]);
    setProgress(null);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    const newMessages: ChatMessage[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setProgress(null);

    setMessages(prev => [...prev, { role: 'bot', text: '', isLoading: true }]);

    const metadataMessage: ChatMessage = {
      role: 'system',
      text: JSON.stringify({
        language,
        sessionId: session?.id ?? null,
        policy: 'ops-site-only',
      }),
    };

    const historyPayload: ChatMessage[] = [
      metadataMessage,
      ...newMessages.filter((m) => !m.isLoading).map((m) => ({ role: m.role, text: m.text })),
    ];

    await streamChatResponse(
        historyPayload,
        input,
        (chunk) => {
            setMessages(prev => {
                const lastMsgIndex = prev.length - 1;
                if (prev[lastMsgIndex]?.role === 'bot') {
                    const updatedMessages = [...prev];
                    updatedMessages[lastMsgIndex] = { ...updatedMessages[lastMsgIndex], text: chunk, isLoading: true };
                    return updatedMessages;
                }
                return prev;
            });
        },
        handleProgress
    );

    setIsLoading(false);
    setMessages(prev => {
        const lastMsgIndex = prev.length - 1;
        if (prev[lastMsgIndex]?.role === 'bot') {
            const updatedMessages = [...prev];
            updatedMessages[lastMsgIndex].isLoading = false;
            return updatedMessages;
        }
        return prev;
    });
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    const isUser = msg.role === 'user';
    // A simple markdown-to-html renderer
    const formattedText = msg.text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*?)(?=\n|\* |$)/g, '<li>$1</li>')
      .replace(/(\r\n|\n|\r)/gm, '<br>')
      .replace(/<br><li>/g, '<li>');

    return (
      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up-fast`}>
        <div className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-primary text-white rounded-br-md' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-md'}`}>
          <div className="text-sm prose" dangerouslySetInnerHTML={{ __html: formattedText + (msg.isLoading ? '<span class="blinking-cursor"></span>' : '') }} />
        </div>
      </div>
    );
  };

  const getStackDisplayName = () => {
    switch(ACTIVE_STACK) {
        case 'google': return 'Google Gemini';
        case 'tinyml': return 'On-Device AI';
        case 'cloudflare': return 'Cloudflare AI';
        default: return 'AI';
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} showBackdrop={showBackdrop} modalClassName="w-auto max-w-lg min-w-[320px] fixed bottom-4 right-4">
      <div ref={modalRef} style={{ width: '400px', height: '600px' }} className="bg-white dark:bg-dark-modal text-light-text dark:text-dark-text rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div ref={headerRef} className="p-4 bg-gray-100 dark:bg-gray-800 cursor-move flex justify-between items-center gap-3 shrink-0">
          <div className="space-y-1">
            <h2 className="text-lg font-bold">Chattia Assistant</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by {getStackDisplayName()}</p>
            {sessionDescriptor && (
              <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {language === 'es' ? 'Sesión' : 'Session'} #{sessionDescriptor.idSuffix} · {language === 'es' ? 'Inicio' : 'Started'} {sessionDescriptor.started}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSessionRestart}
              className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              type="button"
            >
              {language === 'es' ? 'Nueva sesión' : 'New Session'}
            </button>
            <button onClick={onClose} className="text-xl font-bold text-accent" type="button">
              &times;
            </button>
          </div>
        </div>
        <div ref={chatBodyRef} className="p-4 space-y-4 overflow-y-auto flex-grow">
          {messages.map(renderMessage)}
        </div>
        {progress && progress.status !== 'ready' && (
          <div className="px-4 pb-2 text-center text-xs text-gray-500">
            <p>{progress.message}</p>
            {progress.progress !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-1">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress.progress * 100}%` }}></div>
              </div>
            )}
          </div>
        )}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'en' ? 'Ask about our services...' : 'Pregunta sobre nuestros servicios...'}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <button type="submit" className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-accent disabled:bg-gray-400" disabled={isLoading || !input.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
        <div ref={resizeHandleRef} className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize text-gray-400 dark:text-gray-600 hover:text-accent transition-colors">
            <i className="fas fa-expand-alt rotate-90"></i>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ChatbotModal;
