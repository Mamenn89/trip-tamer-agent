import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoad?: () => void;
  onError?: () => void;
}

// Default placeholder path
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, src, alt, onLoad, onError, ...props }, ref) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState<string>(src || '');

    // Check if the image is from Google sources
    const isGoogleImage = (url: string) => {
      if (!url) return false;
      return (
        url.includes('google') || 
        url.includes('gstatic') || 
        url.includes('googleapis') || 
        url.startsWith('/') || // Local images
        url.startsWith('blob:') || // Blob URLs (likely from Google Places API)
        url.startsWith('data:') // Data URLs
      );
    };

    // Convert Google image URLs to use a proxy if needed
    const getProxiedImageUrl = (url: string) => {
      if (!url) return '';
      
      // Only proxy Google Place photos in production
      if (url.includes('googleusercontent.com/place-photos')) {
        console.log('Proxying Google Place photo:', url);
        return `/api/image-proxy?url=${encodeURIComponent(url)}`;
      }
      
      return url;
    };

    useEffect(() => {
      if (!src) {
        setImageSrc(PLACEHOLDER_IMAGE);
        return;
      }
      
      // For Google images, determine if we need to proxy
      if (isGoogleImage(src)) {
        // Google userContent images need proxying to avoid CORS issues
        if (src.includes('googleusercontent.com/place-photos')) {
          const proxiedUrl = getProxiedImageUrl(src);
          console.log('Using proxied URL:', proxiedUrl);
          setImageSrc(proxiedUrl);
        } else {
          setImageSrc(src);
        }
      } else {
        console.log('Using original image URL:', src);
        setImageSrc(src);
      }
    }, [src]);

    const handleLoad = () => {
      console.log('Image loaded successfully:', imageSrc);
      setLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      console.error('Image failed to load:', imageSrc);
      setError(true);
      setLoading(false);
      onError?.();
      
      // If the image that failed wasn't already the placeholder, switch to placeholder
      if (imageSrc !== PLACEHOLDER_IMAGE) {
        console.log('Switching to placeholder after error');
        setImageSrc(PLACEHOLDER_IMAGE);
      }
    };

    // Handle Places API URLs with fetch if needed
    useEffect(() => {
      // Cleanup function for blob URLs
      return () => {
        if (imageSrc?.startsWith('blob:')) {
          URL.revokeObjectURL(imageSrc);
        }
      };
    }, [imageSrc]);

    return (
      <img
        className={cn(
          'transition-opacity duration-300',
          loading ? 'opacity-0' : 'opacity-100',
          error && imageSrc !== PLACEHOLDER_IMAGE ? 'hidden' : 'block',
          className
        )}
        src={imageSrc}
        alt={alt || 'Image'}
        onLoad={handleLoad}
        onError={handleError}
        ref={ref}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';

export default Image;