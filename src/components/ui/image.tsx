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

    // Convert Google image URLs to use a proxy
    const getProxiedImageUrl = (url: string) => {
      if (!url) return '';
      
      // If it's a Google Places photo (lh3.googleusercontent.com)
      if (url.includes('lh3.googleusercontent.com/place-photos')) {
        // Create a proxy URL through our own server
        return `/api/image-proxy?url=${encodeURIComponent(url)}`;
      }
      
      return url;
    };

    useEffect(() => {
      if (!src) {
        setImageSrc(PLACEHOLDER_IMAGE);
        return;
      }
      
      // If not a Google image, use placeholder instead
      if (!isGoogleImage(src) && src !== PLACEHOLDER_IMAGE) {
        console.log('Non-Google image replaced with placeholder:', src);
        setImageSrc(PLACEHOLDER_IMAGE);
        return;
      }
      
      // For Google images, check if we need to proxy
      if (src.includes('lh3.googleusercontent.com')) {
        const proxiedUrl = getProxiedImageUrl(src);
        console.log('Using proxied URL:', proxiedUrl);
        setImageSrc(proxiedUrl);
      } else {
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

    // Use effect to handle Places API URLs
    useEffect(() => {
      if (imageSrc && imageSrc.includes('places.googleapis.com/v1')) {
        fetchImage(imageSrc).then(newSrc => {
          setImageSrc(newSrc);
        });
      }
      
      // Cleanup function for blob URLs
      return () => {
        if (imageSrc?.startsWith('blob:')) {
          URL.revokeObjectURL(imageSrc);
        }
      };
    }, [imageSrc]);

    // If the URL is from the Places API v1, fetch it with proper headers
    const fetchImage = async (url: string) => {
      if (url.includes('places.googleapis.com/v1')) {
        try {
          const response = await fetch(url, {
            headers: {
              'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
              'X-Goog-FieldMask': '*'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        } catch (error) {
          console.error('Error fetching image:', error);
          return PLACEHOLDER_IMAGE;
        }
      }
      return url;
    };

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