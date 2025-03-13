
import React, { useEffect, useState } from 'react';
import { LucideIcon, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Autocomplete from 'react-google-autocomplete';
import { toast } from 'sonner';

interface LocationInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  icon: LucideIcon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect?: (place: any) => void;
  required?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  name,
  value,
  placeholder,
  icon: Icon,
  onChange,
  onPlaceSelect,
  required = false,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  useEffect(() => {
    // In Vite, environment variables must be prefixed with VITE_
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    console.log('Google Maps API Key available:', !!googleMapsApiKey);
    setApiKey(googleMapsApiKey);
    
    // Check if Google Maps API is loaded
    if (googleMapsApiKey && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.onload = () => {
        console.log('Google Maps API loaded successfully');
        setApiLoaded(true);
        setApiError(null);
      };
      script.onerror = (error) => {
        console.error('Failed to load Google Maps API:', error);
        setApiError('Failed to load Google Maps API');
        toast.error('Google Maps API could not be loaded. Please check your API key configuration.');
      };
      document.head.appendChild(script);
    } else if (window.google) {
      console.log('Google Maps API already loaded');
      setApiLoaded(true);
    }

    // Set up error handler for Google Maps API
    window.gm_authFailure = () => {
      console.error('Google Maps authentication error');
      setApiError('Google Maps API authentication failed. Please check your API key.');
      toast.error('Google Maps authentication failed. Please check your API key settings.');
    };

    return () => {
      // Clean up the global error handler
      window.gm_authFailure = undefined;
    };
  }, []);
  
  const handleApiError = (error: any) => {
    console.error('Google Places API error:', error);
    setApiError('Error using Google Places API');
    // Fall back to regular input
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
        
        {apiKey && !apiError ? (
          <Autocomplete
            apiKey={apiKey}
            onPlaceSelected={(place) => {
              if (onPlaceSelect) {
                onPlaceSelect(place);
              }
              // Create a synthetic event to maintain compatibility with existing onChange
              const syntheticEvent = {
                target: {
                  name,
                  value: place.formatted_address || '',
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(syntheticEvent);
            }}
            options={{
              types: ['(cities)'],
              componentRestrictions: { country: '' }, // No country restriction
            }}
            defaultValue={value}
            className="w-full h-10 pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder}
            onError={handleApiError}
          />
        ) : (
          <>
            <Input
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              placeholder={apiError ? "Type city name manually" : placeholder}
              className="w-full pl-10"
              required={required}
            />
            
            {apiError && (
              <div className="mt-2 flex items-center text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Google Maps API error. Using manual input instead.</span>
              </div>
            )}
          </>
        )}
      </div>
      
      {apiError && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 font-medium">Google Maps API configuration issue</p>
          <p className="text-xs text-amber-700 mt-1">
            To fix this issue, you need to:
            <ol className="list-decimal ml-4 mt-1 space-y-1">
              <li>Make sure you have a valid Google Maps API key</li>
              <li>Enable the Places API in your Google Cloud Console</li>
              <li>Ensure billing is properly set up for your Google Cloud project</li>
            </ol>
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
