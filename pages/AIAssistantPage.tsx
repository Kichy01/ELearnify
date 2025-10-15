import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar.tsx';
import { ChatMessage } from '../types.ts';
import { getTutorResponse } from '../services/geminiService.ts';
import { SendIcon, MenuIcon } from '../components/icons/IconComponents.tsx';

const AIAssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: "Hello! I'm your AI Learning Assistant. Ask me anything, from clarifying concepts to helping you plan your studies!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;
        
        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        
        const history = messages.map(msg => ({
            role: msg.sender === 'ai' ? 'model' as const : 'user' as const,
            parts: [{ text: msg.text }]
        }));

        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await getTutorResponse(input, history);
            const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 transition-all duration-300 lg:ml-64 flex flex-col h-screen">
                <header className="p-6 border-b border-gray-800 flex-shrink-0 flex items-center">
                     <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white mr-4">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
                        <p className="text-gray-400">Your personal mentor for any question, anytime.</p>
                    </div>
                </header>
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-cyan-500/50 flex items-center justify-center flex-shrink-0 font-bold">A</div>}
                            <div className={`max-w-xl px-5 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4 justify-start">
                             <div className="w-8 h-8 rounded-full bg-cyan-500/50 flex items-center justify-center flex-shrink-0 font-bold">A</div>
                             <div className="px-5 py-3 rounded-2xl bg-gray-800 text-gray-200 rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-6 border-t border-gray-800 bg-gray-900">
                    <div className="flex items-center bg-gray-800 rounded-xl border border-gray-700 focus-within:border-cyan-500">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-transparent px-5 py-3 text-white placeholder-gray-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="p-3 m-1 rounded-lg hover:bg-cyan-500/20 transition-colors duration-200 disabled:opacity-50">
                            <SendIcon />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIAssistantPage;
