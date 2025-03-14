import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Autocomplete from 'react-google-autocomplete';
import { toast } from 'sonner';

// Define proper types for Google Places API responses
interface PlaceStructuredFormat {
  mainText?: {
    text: string;
  };
  secondaryText?: {
    text: string;
  };
}

interface PlacePrediction {
  place: string;
  text: {
    text: string;
  };
  structuredFormat?: PlaceStructuredFormat;
}

interface PlaceSuggestion {
  placePrediction: PlacePrediction;
}

interface PlaceDetails {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
}

interface LocationInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  icon: LucideIcon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceSelect?: (place: PlaceDetails) => void;
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
  const [apiError, setApiError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Debounce function with proper type
  const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Handle input change and fetch suggestions
  const searchPlaces = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'suggestions.placePrediction.place,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat'
        },
        body: JSON.stringify({
          input: query,
          includedPrimaryTypes: ['(cities)'],
          languageCode: 'en'
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.suggestions) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      }
    } catch (error: unknown) {
      console.error('Places API Error:', error);
      setApiError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchPlaces, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onChange(e);
    debouncedSearch(value);
  };

  const handleSuggestionClick = async (suggestion: PlaceSuggestion) => {
    const place = suggestion.placePrediction;
    const mainText = place.structuredFormat?.mainText?.text || place.text.text;
    
    // Create synthetic event for input change
    const syntheticEvent = {
      target: {
        name,
        value: mainText,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    
    if (onPlaceSelect) {
      // Get place details
      try {
        const placeId = place.place.split('/').pop();
        const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
          headers: {
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'displayName,formattedAddress,location'
          }
        });

        const placeDetails = await response.json();
        onPlaceSelect({
          formatted_address: placeDetails.formattedAddress,
          geometry: {
            location: {
              lat: placeDetails.location.latitude,
              lng: placeDetails.location.longitude
            }
          }
        });
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    }
    
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 z-10" />
        
        {apiError && (
          <div className="text-red-500 text-sm mt-1 mb-2">
            {apiError}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className="pl-10 h-10 w-full bg-white focus:ring-blue-500 flex rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          </div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion, index) => {
              const place = suggestion.placePrediction;
              const mainText = place.structuredFormat?.mainText?.text || place.text.text;
              const secondaryText = place.structuredFormat?.secondaryText?.text || '';

              return (
                <div
                  key={place.place}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium">{mainText}</div>
                  {secondaryText && (
                    <div className="text-sm text-gray-500">{secondaryText}</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInput;
