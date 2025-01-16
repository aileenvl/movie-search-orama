import { useEffect, useState } from 'react';
import { OramaClient } from '@oramacloud/client';
import { Search, Film, MessageSquare } from 'lucide-react';
import { MovieCard } from './components/MovieCard';
import type { Movie } from './types';
import { OramaChatBox } from '@orama/react-components';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'chat'>('search');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [client, setClient] = useState<OramaClient | null>(null);

  useEffect(() => {
    const initializeOrama = async () => {
      const newClient = new OramaClient({
        endpoint: import.meta.env.VITE_ORAMA_ENDPOINT,
        api_key: import.meta.env.VITE_ORAMA_API_KEY
      });
      setClient(newClient);
    };

    initializeOrama();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!client) return;

      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      let results = [];

      const searchResults = await client.search({
        term: searchTerm,
        mode: 'fulltext'
      });

      results = searchResults.hits.map(hit => hit.document as Movie);

      setSearchResults(results);
    };

    performSearch();
  }, [searchTerm,client]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'search'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <Film className="w-5 h-5" />
            Movie Search
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === 'chat'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Movie Chat
          </button>
        </div>

        {activeTab === 'search' ? (
          <>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search movies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        ) : (
          <OramaChatBox
            index={{
              endpoint: import.meta.env.VITE_ORAMA_ENDPOINT,
              api_key: import.meta.env.VITE_ORAMA_API_KEY
            }}
            sourcesMap={{
              title: 'name',
              description: 'content',
              path: 'url'
            }}
            className="h-[600px] rounded-lg overflow-hidden"
          />
        )}
      </div>
    </div>
  );
}

export default App;