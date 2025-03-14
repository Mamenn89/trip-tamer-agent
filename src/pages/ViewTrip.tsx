import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LoadingIndicator from '../components/LoadingIndicator';
import { TravelPlan, Activity } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import Image from '@/components/ui/image';
import { ActivityCard } from '../components/ActivityCard';
import { googlePlacesService } from '../services/googlePlacesService';

interface Photo {
  url: string;
  width: number;
  height: number;
  html_attributions: string[];
}

// Types for activities and images
interface Activity {
  place_name: string;
  place_details: string;
  place_image_url: string;
  ticket_price: number;
  best_time_to_visit: string;
  rating?: number;
}

interface ActivityImage {
  activityName: string;
  timeOfDay: string;
  dayIndex: number;
  url: string;
}

interface TravelPlan {
  id: string;
  userId: string;
  destination: string;
  source: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalBudget: number;
  summary: string;
  hotels?: any[];
  flights?: any[];
  dayPlans?: any[];
  tips?: string[];
}

const ViewTrip = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [destinationPhotos, setDestinationPhotos] = useState<any[]>([]);
  const [heroImage, setHeroImage] = useState<string>('/placeholder.jpg');
  const [loadingHeroImage, setLoadingHeroImage] = useState(true);
  const [hotelPhotos, setHotelPhotos] = useState<Record<string, string>>({});
  const [loadingHotelPhotos, setLoadingHotelPhotos] = useState<Record<string, boolean>>({});
  const [activityImages, setActivityImages] = useState<ActivityImage[]>([]);
  const [loadingActivityImages, setLoadingActivityImages] = useState(true);

  // Cleanup function for blob URLs
  useEffect(() => {
    return () => {
      // Cleanup hero image if it's a blob URL
      if (heroImage.startsWith('blob:')) {
        googlePlacesService.cleanupPhotoUrl(heroImage);
      }
    };
  }, [heroImage]);

  // Separate function to fetch destination photos
  const fetchDestinationPhotos = async (destination: string) => {
    try {
      setLoadingHeroImage(true);
      console.log('Fetching photo for destination:', destination);
      
      const photos = await googlePlacesService.getPlacePhotos(destination);
      console.log('Found photos:', photos);
      
      if (!photos || photos.length === 0) {
        console.log('No photos found, using placeholder');
        setHeroImage('/placeholder.svg');
        return;
      }

      // Just use the first photo
      const firstPhoto = photos[0];
      console.log('First photo object:', firstPhoto);
      
      if (firstPhoto?.url) {
        console.log('Setting hero image to:', firstPhoto.url);
        setHeroImage(firstPhoto.url);
      } else {
        console.log('No valid photo URL found, using placeholder');
        setHeroImage('/placeholder.svg');
      }
      
    } catch (error) {
      console.error('Error in fetchDestinationPhotos:', error);
      setHeroImage('/placeholder.svg');
    } finally {
      setLoadingHeroImage(false);
    }
  };

  // Function to fetch hotel photos from Google Places API
  const fetchHotelPhotos = async (hotels: any[]) => {
    if (!hotels || hotels.length === 0) return;
    
    console.log('Fetching photos for hotels:', hotels.map(h => h.name));
    
    // Initialize loading state for all hotels
    const loadingState: Record<string, boolean> = {};
    hotels.forEach(hotel => {
      loadingState[hotel.name] = true;
    });
    setLoadingHotelPhotos(loadingState);
    
    // Process each hotel
    const photoPromises = hotels.map(async (hotel) => {
      try {
        console.log('Fetching photo for hotel:', hotel.name);
        const photoData = await googlePlacesService.getHotelPhoto(hotel.name);
        
        if (photoData?.url) {
          console.log('Setting hotel image to:', photoData.url);
          return { name: hotel.name, url: photoData.url };
        } else {
          console.log('No photo found for hotel:', hotel.name);
          return { name: hotel.name, url: '/placeholder.svg' };
        }
      } catch (error) {
        console.error(`Error fetching photo for hotel ${hotel.name}:`, error);
        return { name: hotel.name, url: '/placeholder.svg' };
      }
    });
    
    // Wait for all photo fetches to complete
    const results = await Promise.all(photoPromises);
    
    // Update the photos state
    const newPhotos: Record<string, string> = {};
    results.forEach(result => {
      newPhotos[result.name] = result.url;
    });
    
    console.log('All hotel photos fetched:', newPhotos);
    setHotelPhotos(newPhotos);
    
    // Set loading to false for all hotels
    const newLoadingState: Record<string, boolean> = {};
    hotels.forEach(hotel => {
      newLoadingState[hotel.name] = false;
    });
    setLoadingHotelPhotos(newLoadingState);
  };

  // Function to fetch activity images from Google Places API
  const fetchActivityImages = async (dayPlans: any[]) => {
    if (!dayPlans || dayPlans.length === 0) return;
    
    console.log('Fetching images for activities');
    setLoadingActivityImages(true);
    
    const imagePromises: Promise<ActivityImage | null>[] = [];
    
    // For each day
    dayPlans.forEach((day, dayIndex) => {
      if (!day.places) return;
      
      // For each place in the day
      day.places.forEach((place: any, placeIndex: number) => {
        const details = typeof place.details === 'object' ? place.details : null;
        if (!details) return;
        
        // Handle each time of day activity
        const timeSlots = [
          { key: 'early_morning', label: 'Early Morning' },
          { key: 'morning', label: 'Morning' },
          { key: 'afternoon', label: 'Afternoon' },
          { key: 'evening', label: 'Evening' },
          { key: 'night', label: 'Night' }
        ];
        
        timeSlots.forEach(slot => {
          const activity = details[slot.key];
          if (!activity) return;
          
          // Create a promise to fetch an image for this activity
          const promise = (async () => {
            try {
              console.log(`Fetching image for ${slot.label} activity: ${activity.place_name}`);
              const photoData = await googlePlacesService.getPlacePhotos(activity.place_name);
              
              if (photoData && photoData.length > 0 && photoData[0].url) {
                console.log(`Found image for ${activity.place_name}:`, photoData[0].url);
                return {
                  activityName: activity.place_name,
                  timeOfDay: slot.key,
                  dayIndex,
                  url: photoData[0].url
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching image for ${activity.place_name}:`, error);
              return null;
            }
          })();
          
          imagePromises.push(promise);
        });
      });
    });
    
    // Wait for all image fetches to complete
    const results = await Promise.all(imagePromises);
    
    // Filter out null results and update state
    const validImages = results.filter((img): img is ActivityImage => img !== null);
    console.log('Fetched activity images:', validImages);
    setActivityImages(validImages);
    setLoadingActivityImages(false);
  };

  // Helper function to get activity image URL
  const getActivityImageUrl = (activityName: string, timeOfDay: string, dayIndex: number) => {
    const imageEntry = activityImages.find(
      img => img.activityName === activityName && 
             img.timeOfDay === timeOfDay && 
             img.dayIndex === dayIndex
    );
    return imageEntry?.url || '/placeholder.svg';
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        if (!id) {
          throw new Error('Trip ID is required');
        }

        const { data, error } = await supabase
          .from('travel_plans')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Trip not found');
        }

        console.log('Received trip data:', data);

        // Convert database format to TravelPlan format
        const plan: TravelPlan = {
          id: data.id,
          userId: data.user_id,
          destination: data.destination,
          source: data.origin,
          startDate: data.start_date,
          endDate: data.end_date,
          duration: data.duration,
          totalBudget: data.total_budget,
          summary: data.summary,
          hotels: data.hotels || [],
          flights: Array.isArray(data.flights) ? data.flights : 
            (data.flight ? [data.flight] : []),
          dayPlans: Array.isArray(data.day_plans) ? data.day_plans.map((day: any) => ({
            date: day.date,
            places: Array.isArray(day.places) ? day.places.map((place: any) => ({
              name: place.name || '',
              details: typeof place.details === 'object' ? {
                early_morning: place.details.early_morning || null,
                morning: place.details.morning || null,
                afternoon: place.details.afternoon || null,
                evening: place.details.evening || null,
                night: place.details.night || null
              } : (place.details || ''),
              imageUrl: place.imageUrl || '',
              coordinates: {
                lat: place.coordinates?.lat || 0,
                lng: place.coordinates?.lng || 0
              },
              ticketPrice: place.ticketPrice || 0,
              rating: place.rating || 0,
              bestTimeToVisit: place.bestTimeToVisit || ''
            })) : []
          })) : [],
          tips: data.tips || [],
        };

        console.log('Transformed travel plan:', plan);
        setTravelPlan(plan);

        // Fetch photos for the destination
        if (plan.destination) {
          console.log('Starting photo fetch for:', plan.destination);
          await fetchDestinationPhotos(plan.destination);
        } else {
          console.log('No destination found in plan');
          setLoadingHeroImage(false);
        }

        // Fetch hotel photos
        if (plan.hotels && plan.hotels.length > 0) {
          await fetchHotelPhotos(plan.hotels);
        }

        // Fetch activity images
        if (plan.dayPlans && plan.dayPlans.length > 0) {
          await fetchActivityImages(plan.dayPlans);
        }
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trip details');
        setLoadingHeroImage(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!travelPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Not Found</h1>
          <p className="text-gray-600">The requested trip could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <NavBar />

      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="relative h-[400px] rounded-lg overflow-hidden mb-12">
          {loadingHeroImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <div className="w-full h-full">
                <Image
                  src={heroImage}
                  alt={travelPlan?.destination || 'Destination'}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    console.log('Hero image loaded successfully:', heroImage);
                  }}
                  onError={() => {
                    console.error('Hero image failed to load:', heroImage);
                    setHeroImage('/placeholder.svg');
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
              <div className="absolute bottom-0 left-0 p-12 text-white">
                <h1 className="text-6xl font-bold mb-6">{travelPlan?.destination}</h1>
                <div className="flex items-center gap-8 text-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {travelPlan?.startDate && new Date(travelPlan.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {travelPlan?.endDate && new Date(travelPlan.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {travelPlan?.duration} days
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    2 travelers
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Budget: ${travelPlan?.totalBudget}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Trip Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-4">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{travelPlan.source}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Start & End Date</p>
                <p className="font-medium">
                  {new Date(travelPlan.startDate).toLocaleDateString()} - {new Date(travelPlan.endDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium">${travelPlan.totalBudget}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{travelPlan.duration} days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Hotel Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelPlan.hotels?.map((hotel, index) => (
              <Card key={index} className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="relative h-48">
                  {loadingHotelPhotos[hotel.name] ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <LoadingIndicator />
                    </div>
                  ) : (
                    <Image
                      src={hotelPhotos[hotel.name] || '/placeholder.svg'}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        console.log('Hotel image loaded successfully:', hotel.name);
                        setLoadingHotelPhotos(prev => ({ ...prev, [hotel.name]: false }));
                      }}
                      onError={() => {
                        console.error('Hotel image failed to load:', hotel.name);
                        setHotelPhotos(prev => ({ ...prev, [hotel.name]: '/placeholder.svg' }));
                        setLoadingHotelPhotos(prev => ({ ...prev, [hotel.name]: false }));
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

        {/* Flight Recommendations */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Flight Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelPlan.flights?.map((flight, index) => (
              <Card key={index} className="transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={flight.airlineLogoUrl}
                          alt={flight.airlineName}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <p className="font-semibold">{flight.airlineName}</p>
                          <p className="text-sm text-gray-600">Flight {flight.flightNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{flight.flightTime}</p>
                        <p className="text-sm text-gray-600">{flight.flightDuration}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div>
                        <p>From: {flight.departureAirport}</p>
                        <p>To: {flight.arrivalAirport}</p>
                      </div>
                      <div className="text-right">
                        <p>Aircraft: {flight.airplaneType}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Activities */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Activities</h2>
          <div className="space-y-8">
            {travelPlan.dayPlans?.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h3 className="font-medium mb-4">Day {dayIndex + 1} - {day.date}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {day.places?.map((place, placeIndex) => {
                    // Type guard to check if details is an object
                    const details = typeof place.details === 'object' ? place.details : null;
                    
                    // Handle both nested and flat data structures
                    const earlyMorningActivity = details?.early_morning || null;
                    const morningActivity = details?.morning || null;
                    const afternoonActivity = details?.afternoon || null;
                    const eveningActivity = details?.evening || null;
                    const nightActivity = details?.night || null;
                    
                    // If we have nested activities, render them directly in the grid
                    if (earlyMorningActivity || morningActivity || afternoonActivity || eveningActivity || nightActivity) {
                      return (
                        <div key={placeIndex} className="contents">
                          {earlyMorningActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(earlyMorningActivity.place_name, 'early_morning', dayIndex) || earlyMorningActivity.place_image_url || '/placeholder.svg'}
                                    alt={earlyMorningActivity.place_name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>
                                <CardContent className="p-4 flex-1">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span className="text-sm text-blue-600 block mb-1">Early Morning</span>
                                        <h4 className="font-semibold">{earlyMorningActivity.place_name}</h4>
                                      </div>
                                      <div className="text-right">
                                        {earlyMorningActivity.ticket_price > 0 && (
                                          <p className="font-medium">${earlyMorningActivity.ticket_price}</p>
                                        )}
                                        {earlyMorningActivity.rating && (
                                          <p className="text-sm text-gray-600">Rating: {earlyMorningActivity.rating}/5</p>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{earlyMorningActivity.place_details}</p>
                                    <p className="text-sm">
                                      <span className="font-medium">Best time to visit:</span> {earlyMorningActivity.best_time_to_visit}
                                    </p>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          )}
                          {morningActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(morningActivity.place_name, 'morning', dayIndex) || morningActivity.place_image_url || '/placeholder.svg'}
                                    alt={morningActivity.place_name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>
                                <CardContent className="p-4 flex-1">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span className="text-sm text-blue-600 block mb-1">Morning</span>
                                        <h4 className="font-semibold">{morningActivity.place_name}</h4>
                                      </div>
                                      <div className="text-right">
                                        {morningActivity.ticket_price > 0 && (
                                          <p className="font-medium">${morningActivity.ticket_price}</p>
                                        )}
                                        {morningActivity.rating && (
                                          <p className="text-sm text-gray-600">Rating: {morningActivity.rating}/5</p>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{morningActivity.place_details}</p>
                                    <p className="text-sm">
                                      <span className="font-medium">Best time to visit:</span> {morningActivity.best_time_to_visit}
                                    </p>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          )}
                          {afternoonActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(afternoonActivity.place_name, 'afternoon', dayIndex) || afternoonActivity.place_image_url || '/placeholder.svg'}
                                    alt={afternoonActivity.place_name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>
                                <CardContent className="p-4 flex-1">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span className="text-sm text-blue-600 block mb-1">Afternoon</span>
                                        <h4 className="font-semibold">{afternoonActivity.place_name}</h4>
                                      </div>
                                      <div className="text-right">
                                        {afternoonActivity.ticket_price > 0 && (
                                          <p className="font-medium">${afternoonActivity.ticket_price}</p>
                                        )}
                                        {afternoonActivity.rating && (
                                          <p className="text-sm text-gray-600">Rating: {afternoonActivity.rating}/5</p>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{afternoonActivity.place_details}</p>
                                    <p className="text-sm">
                                      <span className="font-medium">Best time to visit:</span> {afternoonActivity.best_time_to_visit}
                                    </p>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          )}
                          {eveningActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(eveningActivity.place_name, 'evening', dayIndex) || eveningActivity.place_image_url || '/placeholder.svg'}
                                    alt={eveningActivity.place_name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>
                                <CardContent className="p-4 flex-1">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span className="text-sm text-blue-600 block mb-1">Evening</span>
                                        <h4 className="font-semibold">{eveningActivity.place_name}</h4>
                                      </div>
                                      <div className="text-right">
                                        {eveningActivity.ticket_price > 0 && (
                                          <p className="font-medium">${eveningActivity.ticket_price}</p>
                                        )}
                                        {eveningActivity.rating && (
                                          <p className="text-sm text-gray-600">Rating: {eveningActivity.rating}/5</p>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{eveningActivity.place_details}</p>
                                    <p className="text-sm">
                                      <span className="font-medium">Best time to visit:</span> {eveningActivity.best_time_to_visit}
                                    </p>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          )}
                          {nightActivity && (
                            <Card className="overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer">
                              <div className="flex min-h-[12rem]">
                                <div className="w-1/3 relative">
                                  <Image
                                    src={getActivityImageUrl(nightActivity.place_name, 'night', dayIndex) || nightActivity.place_image_url || '/placeholder.svg'}
                                    alt={nightActivity.place_name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </div>
                                <CardContent className="p-4 flex-1">
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <span className="text-sm text-purple-600 block mb-1">Night</span>
                                        <h4 className="font-semibold">{nightActivity.place_name}</h4>
                                      </div>
                                      <div className="text-right">
                                        {nightActivity.ticket_price > 0 && (
                                          <p className="font-medium">${nightActivity.ticket_price}</p>
                                        )}
                                        {nightActivity.rating && (
                                          <p className="text-sm text-gray-600">Rating: {nightActivity.rating}/5</p>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{nightActivity.place_details}</p>
                                    <p className="text-sm">
                                      <span className="font-medium">Best time to visit:</span> {nightActivity.best_time_to_visit}
                                    </p>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          )}
                        </div>
                      );
                    }
                    
                    // Otherwise, render the regular place card
                    return (
                      <Card key={placeIndex}>
                        <div className="flex">
                          <div className="w-1/3">
                            <Image
                              src={place.imageUrl || '/placeholder.svg'}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold">{place.name}</h4>
                                <div className="text-right">
                                  {place.ticketPrice > 0 && (
                                    <p className="font-medium">${place.ticketPrice}</p>
                                  )}
                                  {place.rating && (
                                    <p className="text-sm text-gray-600">Rating: {place.rating}/5</p>
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-600 mb-2">{String(place.details)}</p>
                              <p className="text-sm">
                                <span className="font-medium">Best time to visit:</span> {place.bestTimeToVisit}
                              </p>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Travel Tips */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Travel Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {travelPlan.tips?.map((tip, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ViewTrip; 