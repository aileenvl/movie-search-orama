import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Movie } from '../types';
import { OramaClient } from '@oramacloud/client';

interface ChatInterfaceProps {
  movies: Movie[];
  client: OramaClient | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ movies, client }) => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  const handleSend = async () => {
    if (!input.trim() || !client || isLoading) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const answerSession = client.createAnswerSession({
        userContext: "The user is asking about movies from our database.",
        inferenceType: "documentation",
        events: {
          onMessageChange: (messages: Message[]) => {
            const assistantMessage = messages.find(msg => msg.role === 'assistant');
            if (assistantMessage && assistantMessage.content && assistantMessage.content.trim()) {
              setCurrentResponse(assistantMessage.content);
              setIsLoading(false);
            }
          },
          onMessageLoading: (loading: boolean) => {
            if (!loading && currentResponse.trim()) {
              setMessages(prev => {
                const filteredMessages = prev.filter(msg => msg.isUser);
                return [...filteredMessages, { text: currentResponse, isUser: false }];
              });
              setCurrentResponse('');
            }
          }
        },
      });

      await answerSession.ask({
        term: input.trim(),
      });

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I couldn't process your request at the moment.", 
        isUser: false 
      }]);
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
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                message.isUser
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white shadow-sm text-gray-800 rounded-bl-none'
              }`}
            >
              {message.isUser ? (
                <p className="text-sm">{message.text}</p>
              ) : (
                <ReactMarkdown 
                  className="prose prose-sm prose-slate max-w-none"
                  components={{
                    p: ({node, ...props}) => (
                      <p {...props} className="text-sm leading-relaxed" />
                    ),
                    strong: ({node, ...props}) => (
                      <strong {...props} className="font-semibold" />
                    ),
                    ul: ({node, ...props}) => (
                      <ul {...props} className="my-2 space-y-1" />
                    ),
                    li: ({node, ...props}) => (
                      <li {...props} className="text-sm" />
                    )
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {currentResponse && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 max-w-[80%] bg-white shadow-sm text-gray-800 rounded-bl-none">
              <ReactMarkdown 
                className="prose prose-sm prose-slate max-w-none"
                components={{
                  p: ({node, ...props}) => (
                    <p {...props} className="text-sm leading-relaxed" />
                  ),
                  strong: ({node, ...props}) => (
                    <strong {...props} className="font-semibold" />
                  ),
                  ul: ({node, ...props}) => (
                    <ul {...props} className="my-2 space-y-1" />
                  ),
                  li: ({node, ...props}) => (
                    <li {...props} className="text-sm" />
                  )
                }}
              >
                {currentResponse}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about movies..."
            disabled={isLoading}
            className="flex-1 p-3 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};