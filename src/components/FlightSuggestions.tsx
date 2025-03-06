
import React, { useEffect, useState } from 'react';
import { Plane, Clock, DollarSign, MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlightResult, searchFlights } from '../lib/flightSearch';

interface FlightSuggestionsProps {
  source: string;
  destination: string;
  date: string;
}

const FlightSuggestions: React.FC<FlightSuggestionsProps> = ({ source, destination, date }) => {
  const [flights, setFlights] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Format date from "March 14, 2025" to "2025-03-14"
        let formattedDate = date;
        try {
          const dateObj = new Date(date);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().split('T')[0];
          }
        } catch (err) {
          console.log('Could not parse date, using original format:', date);
        }
        
        const flightResults = await searchFlights(source, destination, formattedDate);
        setFlights(flightResults);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Failed to fetch flight suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [source, destination, date]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Searching for the best flights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">Suggested Flights</h3>
      
      {flights.length === 0 ? (
        <p className="text-gray-600">No flights found for this route. Try different dates or airports.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flights.map((flight, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="bg-blue-50 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Plane className="h-5 w-5 mr-2 text-blue-600" />
                    {flight.airline}
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-blue-700">
                    {flight.price}
                  </CardDescription>
                </div>
                {flight.flightNumber && (
                  <CardDescription className="text-sm text-gray-500">
                    Flight {flight.flightNumber}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-lg">{flight.departureTime}</p>
                    <p className="text-sm text-gray-500">{source}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="h-4 w-4 text-gray-400 mb-1" />
                    <p className="text-sm text-gray-600">{flight.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{flight.arrivalTime}</p>
                    <p className="text-sm text-gray-500">{destination}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                  <span className="text-sm text-gray-600">
                    {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </span>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
                    View Details
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <p>* Prices and availability may vary. Consider checking directly with airlines for the most up-to-date information.</p>
      </div>
    </div>
  );
};

export default FlightSuggestions;
