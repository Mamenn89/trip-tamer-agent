import React from 'react';
import { TravelPlan } from '../types';

interface TravelPlanMarkdownProps {
  plan: TravelPlan;
  onStartOver: () => void;
}

const TravelPlanMarkdown: React.FC<TravelPlanMarkdownProps> = ({ plan, onStartOver }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Travel Plan Summary</h2>
          <button
            onClick={onStartOver}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Plan Another Trip
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Trip Overview</h3>
            <p className="text-gray-700">{plan.summary}</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                <span className="font-medium">From:</span> {plan.source}
              </div>
              <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                <span className="font-medium">To:</span> {plan.destination}
              </div>
              {plan.startDate && (
                <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                  <span className="font-medium">Departure:</span> {new Date(plan.startDate).toLocaleDateString()}
                </div>
              )}
              {plan.endDate && (
                <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                  <span className="font-medium">Return:</span> {new Date(plan.endDate).toLocaleDateString()}
                </div>
              )}
              <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
                <span className="font-medium">Budget:</span> ${plan.totalBudget}
              </div>
            </div>
          </div>

          {plan.flights && plan.flights.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Flight Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.flights.map((flight, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{flight.airlineName}</span>
                      <span className="text-sm text-gray-500">{flight.flightNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{flight.departureAirport}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">{flight.flightDuration}</div>
                        <div className="border-t border-gray-300 w-16 mx-auto my-1"></div>
                        <div className="text-xs text-gray-500">{flight.airplaneType}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{flight.arrivalAirport}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {plan.hotels && plan.hotels.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Accommodation Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plan.hotels.map((hotel, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">{hotel.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{hotel.address}</p>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm">{hotel.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{hotel.description}</p>
                    <div className="font-medium text-blue-600">${hotel.price}/night</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {plan.tips && plan.tips.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Travel Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                {plan.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelPlanMarkdown;