import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getGroqChatCompletion, ChatMessage } from '../services/groqService';
import { CombatlasLogoIcon, SendIcon, XIcon, UserIcon } from './icons';

interface ChatbotProps {
    onClose: () => void;
}

interface Message {
    sender: 'user' | 'model';
    text: string;
}

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    // Basic markdown parsing
    let html = text
        // Setext headers (Title followed by ===)
        .replace(/^(.*)\n={3,}/gm, '<h1 class="text-cyan-400 font-bold text-lg uppercase tracking-widest border-b border-cyan-500/50 pb-2 mb-3">$1</h1>')
        // Headers
        .replace(/^### (.*$)/gm, '<h3 class="text-cyan-400 font-bold mt-2 mb-1 text-sm uppercase tracking-wider">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-cyan-400 font-bold mt-3 mb-2 text-base uppercase tracking-widest">$1</h2>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-100">$1</strong>')
        // Italics
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Lists (unordered)
        .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>')
        .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>')
        // Code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-700 rounded-sm px-1 py-0.5 text-cyan-300 font-mono text-xs">$1</code>')
        // New lines to breaks (but avoid breaking inside lists or headers if possible, simplified here)
        .replace(/\n/g, '<br />');

    // Clean up double breaks or breaks after headers
    html = html.replace(/<\/h3><br \/>/g, '</h3>');
    html = html.replace(/<\/h2><br \/>/g, '</h2>');
    html = html.replace(/<\/li><br \/>/g, '</li>');
    
    // Wrap lists in ul (simplified: just replacing the first li with ul start and last with ul end is hard with regex alone, 
    // so we'll just let them be loose li's or wrap them if we were using a real parser. 
    // For this simple implementation, loose li's might render okay-ish or we can wrap the whole thing.)
    // A better approach for lists in simple regex:
    
    return <div className="markdown-content text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
};

export const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([
            { sender: 'model', text: 'Greetings. I am Atlas, your tactical AI assistant for Indian Defense. How may I assist you with our sovereign assets?' }
        ]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            // Prepare messages for Groq
            const chatHistory: ChatMessage[] = [
                {
                    role: 'system',
                    content: 'You are Atlas, an AI assistant for Combatlas, a specialized encyclopedia for the Indian Defense Sector. Your purpose is to answer questions about Indian military assets (DRDO, HAL, etc.), history, and strategic capabilities. You should be knowledgeable, patriotic, concise, and adopt a formal, futuristic military-AI persona. Use markdown for formatting when appropriate.'
                },
                ...messages.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                } as ChatMessage)),
                { role: 'user', content: currentInput }
            ];

            const responseText = await getGroqChatCompletion(chatHistory);
            
            setMessages(prev => [...prev, { sender: 'model', text: responseText }]);
        } catch (error) {
            console.error('Groq API error:', error);
             setMessages(prev => [...prev, { 
                 sender: 'model', 
                 text: 'Apologies, I am experiencing a communication malfunction. Please try again later.' 
             }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    return (
        <div className="fixed bottom-4 right-4 w-[calc(100%-2rem)] max-w-md h-[70vh] max-h-[600px] z-50 flex flex-col bg-gray-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-900/30 overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between p-3 border-b border-cyan-500/30 flex-shrink-0">
                <div className="flex items-center">
                    <CombatlasLogoIcon className="h-6 w-6 text-cyan-400 animate-pulse" />
                    <h3 className="ml-2 text-lg font-bold text-cyan-400 tracking-wider">ATLAS AI</h3>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'model' && <div className="w-8 h-8 flex-shrink-0 bg-gray-800 rounded-full flex items-center justify-center border border-cyan-500/50"><CombatlasLogoIcon className="w-5 h-5 text-cyan-400" /></div>}
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-cyan-600/50 text-white' : 'bg-gray-800 text-gray-300'}`}>
                           <SimpleMarkdown text={msg.text} />
                        </div>
                        {msg.sender === 'user' && <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5 text-cyan-300" /></div>}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 flex-shrink-0 bg-gray-800 rounded-full flex items-center justify-center border border-cyan-500/50"><CombatlasLogoIcon className="w-5 h-5 text-cyan-400" /></div>
                        <div className="max-w-[80%] p-3 rounded-lg bg-gray-800 text-gray-300">
                           <div className="flex items-center gap-2">
                               <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                               <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                               <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></span>
                           </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-cyan-500/30 flex-shrink-0">
                <div className="flex items-center bg-gray-800/50 border-2 border-cyan-500/30 rounded-lg focus-within:ring-2 focus-within:ring-cyan-500">
                    <input
                        type="text"
                        placeholder="Ask Atlas about Indian Defense..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="flex-1 bg-transparent py-2 px-4 text-white placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed"
                        aria-label="Chat input"
                    />
                    <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="p-2 text-cyan-400 disabled:text-gray-600 hover:text-white disabled:cursor-not-allowed transition-colors" aria-label="Send message">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(1rem); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};