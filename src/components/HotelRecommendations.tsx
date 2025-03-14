import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from '@/components/ui/image';
import LoadingIndicator from '@/components/LoadingIndicator';
import { googlePlacesService } from '../services/googlePlacesService';

interface Hotel {
  name: string;
  address: string;
  price: number;
}

interface HotelRecommendationsProps {
  hotels: Hotel[];
}

export const HotelRecommendations: React.FC<HotelRecommendationsProps> = ({ hotels }) => {
  const [hotelPhotos, setHotelPhotos] = useState<Record<string, string>>({});
  const [loadingPhotos, setLoadingPhotos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchHotelPhotos = async () => {
      const photos: Record<string, string> = {};
      const loadingStates: Record<string, boolean> = {};
      
      for (const hotel of hotels) {
        loadingStates[hotel.name] = true;
      }
      setLoadingPhotos(loadingStates);

      for (const hotel of hotels) {
        try {
          console.log('Fetching photo for hotel:', hotel.name);
          const hotelPhotos = await googlePlacesService.getHotelPhoto(hotel.name);
          
          if (hotelPhotos?.url) {
            console.log('Setting hotel image to:', hotelPhotos.url);
            photos[hotel.name] = hotelPhotos.url;
          } else {
            console.log('No valid photo URL found for hotel, using placeholder');
            photos[hotel.name] = '/placeholder.jpg';
          }
        } catch (error) {
          console.error('Error fetching photo for hotel:', hotel.name, error);
          photos[hotel.name] = '/placeholder.jpg';
        } finally {
          setLoadingPhotos(prev => ({ ...prev, [hotel.name]: false }));
        }
      }
      setHotelPhotos(photos);
    };

    if (hotels && hotels.length > 0) {
      fetchHotelPhotos();
    }
  }, [hotels]);

  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Hotel Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48">
              {loadingPhotos[hotel.name] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <LoadingIndicator />
                </div>
              ) : (
                <Image
                  src={hotelPhotos[hotel.name] || '/placeholder.jpg'}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    console.log('Hotel image loaded successfully:', hotel.name);
                  }}
                  onError={() => {
                    console.error('Hotel image failed to load:', hotel.name);
                    setHotelPhotos(prev => ({ ...prev, [hotel.name]: '/placeholder.jpg' }));
                  }}
                />
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{hotel.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{hotel.address}</p>
              <p className="font-medium">${hotel.price} / night</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}; 