
import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Autocomplete from 'react-google-autocomplete';

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
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
      };
      document.head.appendChild(script);
    } else if (window.google) {
      console.log('Google Maps API already loaded');
      setApiLoaded(true);
    }
  }, []);
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
        
        {apiKey ? (
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
            className="w-full h-10 pl-10 bg-white focus:ring-blue-500 flex rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            placeholder={placeholder}
          />
        ) : (
          <Input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10"
            required={required}
          />
        )}
      </div>
    </div>
  );
};

export default LocationInput;
