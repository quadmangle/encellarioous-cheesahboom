import React, { useState } from 'react';
import Icon from './Icon';
import ChatbotModal from './modals/ChatbotModal';

const ChatWidget: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-5 right-5 w-16 h-16 rounded-full bg-primary text-white shadow-xl flex items-center justify-center transition-transform transform hover:scale-110 focus:outline-none z-50"
                aria-label="Open Chat"
            >
                <Icon name="chat" className="w-6 h-6" />
            </button>
            <ChatbotModal 
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                showBackdrop={false}
            />
        </>
    );
};

export default ChatWidget;
