import React, { useState } from 'react';
import { Star } from 'lucide-react';
import type { Movie } from '../types';
import { transformImageUrl } from '../utils/imageUtils';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    const sizes = [200, 400, 600];
    return sizes
      .map(size => 
        `${transformImageUrl(movie.poster, { width: size })} ${size}w`
      )
      .join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-[400px] bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-gray-200" />
          </div>
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        <img 
          src={transformImageUrl(movie.poster, { width: 400 })}
          srcSet={generateSrcSet()}
          sizes="(max-width: 768px) 200px, (max-width: 1200px) 400px, 600px"
          alt={movie.title} 
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
      </div>
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