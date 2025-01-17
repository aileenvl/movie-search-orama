interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export const transformImageUrl = (url: string, options: ImageOptimizationOptions = {}): string => {
  if (!url) return '/placeholder-image.png';

  const {
    width = 400,
    height = 600,
    quality = 80
  } = options;

  if (url.includes('m.media-amazon.com')) {
    const baseUrl = url.split('._V1_')[0];
    return `${baseUrl}._V1_UX${width}_CR0,0,${width},${height}_AL_.jpg`;
  }

  try {
    const imageUrl = new URL(url);
    imageUrl.searchParams.set('w', width.toString());
    imageUrl.searchParams.set('q', quality.toString());
    return imageUrl.toString();
  } catch {
    return url;
  }
}; 