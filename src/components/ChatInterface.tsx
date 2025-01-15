import React, { useState } from 'react';
import { Send } from 'lucide-react';
import type { Movie } from '../types';

interface ChatInterfaceProps {
  movies: Movie[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ movies }) => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    // Simple response based on movie data
    const response = generateResponse(input, movies);
    setMessages(prev => [...prev, { text: response, isUser: false }]);
    setInput('');
  };

  const generateResponse = (query: string, movies: Movie[]) => {
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('recommend')) {
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      return `I recommend watching ${randomMovie.title} (${randomMovie.year}). It's a great ${randomMovie.category} movie!`;
    }
    
    if (lowercaseQuery.includes('best')) {
      const bestRated = [...movies].sort((a, b) => b.rating - a.rating)[0];
      return `The highest rated movie in our database is ${bestRated.title} with a rating of ${bestRated.rating}.`;
    }

    return "I can help you find movies, get recommendations, or tell you about the best rated films. What would you like to know?";
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.isUser ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.isUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about movies..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};