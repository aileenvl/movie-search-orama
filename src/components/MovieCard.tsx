import React from 'react';
import { Star } from 'lucide-react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const transformImageUrl = (url: string | undefined): string => {
  if (!url) return '/placeholder-movie.jpg';
  return url.replace(/_V1_UX\d+_CR.*?\.jpg$/, '_V1_UX300.jpg');
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={transformImageUrl(movie.poster)} 
        alt={movie.title} 
        className="w-full h-[400px] object-contain"
      />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{movie.title}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{movie.rating}</span>
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{movie.year}</span>
          {movie.genres.map((genre: string) => (
            <span key={genre} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{genre}</span>
          ))}
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{movie.description}</p>
      </div>
    </div>
  );
};