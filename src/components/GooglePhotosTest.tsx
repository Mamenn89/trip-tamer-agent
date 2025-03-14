import React from 'react';
import { googlePhotosService } from '../services/googlePhotosService';
import { Button } from './ui/button';

export const GooglePhotosTest = () => {
  const handleAuthClick = () => {
    // Get the auth URL and redirect to Google's consent screen
    const authUrl = googlePhotosService.getAuthUrl();
    console.log('Redirecting to:', authUrl);
    window.location.href = authUrl;
  };

  const testPhotoSearch = async () => {
    try {
      // Test search with a sample destination
      const photos = await googlePhotosService.getPhotosByDestination('Paris');
      console.log('Found photos:', photos);
    } catch (error) {
      console.error('Error testing photo search:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Button onClick={handleAuthClick} variant="outline">
        Test Google Photos Auth
      </Button>
      <Button onClick={testPhotoSearch} variant="outline">
        Test Photo Search
      </Button>
    </div>
  );
}; 