const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Define interfaces for type safety
interface PhotoResult {
  id: string;
  url: string;
  width: number;
  height: number;
}

class GooglePlacesService {
  // Search for a place by name and get basic information
  private async searchPlace(query: string) {
    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
    console.log('Making request to:', searchUrl);
    
    try {
      const searchResponse = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.photos,places.displayName'
        },
        body: JSON.stringify({
          textQuery: query,
          languageCode: "en"
        })
      });

      if (!searchResponse.ok) {
        throw new Error(`Place search failed: ${searchResponse.statusText}`);
      }

      return await searchResponse.json();
    } catch (error) {
      console.error('Error in searchPlace:', error);
      return { places: [] };
    }
  }

  // Fetch the actual photo using the photo reference
  private async fetchPhotoMedia(photoName: string): Promise<string | null> {
    try {
      // First try the Places API v1 endpoint
      const mediaUrl = `https://places.googleapis.com/v1/${photoName}/media?skipHttpRedirect=true&maxWidthPx=1200&key=${GOOGLE_MAPS_API_KEY}`;
      console.log('Trying Places API v1 endpoint:', mediaUrl);

      const response = await fetch(mediaUrl, {
        headers: {
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Photo media response:', data);
        
        if (data.photoUri) {
          return data.photoUri;
        }
      }

      // If v1 endpoint fails, try the legacy endpoint
      console.log('V1 endpoint failed, trying legacy endpoint...');
      const photoReference = photoName.split('/').pop();
      if (!photoReference) {
        throw new Error('Invalid photo reference');
      }

      // Use the legacy Places API photo endpoint
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
      console.log('Trying legacy endpoint:', legacyUrl);

      const legacyResponse = await fetch(legacyUrl);
      if (!legacyResponse.ok) {
        throw new Error(`Failed to fetch photo from legacy endpoint: ${legacyResponse.statusText}`);
      }

      // Get the final URL after redirects
      const finalUrl = legacyResponse.url;
      console.log('Got photo URL from legacy endpoint:', finalUrl);
      return finalUrl;

    } catch (error) {
      console.error('Error fetching photo media:', error);
      return null;
    }
  }

  async getPlacePhotos(destination: string): Promise<PhotoResult[]> {
    try {
      console.log('Fetching photos for destination:', destination);
      
      const searchData = await this.searchPlace(destination);
      console.log('Places API response:', searchData);

      if (!searchData?.places?.[0]) {
        console.log('No places found for destination:', destination);
        return [];
      }

      if (!searchData.places[0].photos?.length) {
        console.log('No photos found for place:', searchData.places[0].displayName);
        return [];
      }

      // Try multiple photos
      const photos = searchData.places[0].photos;
      
      // Try up to 3 photos
      for (let i = 0; i < Math.min(photos.length, 3); i++) {
        try {
          const photo = photos[i];
          console.log(`Trying photo ${i}:`, photo);
          
          const photoUrl = await this.fetchPhotoMedia(photo.name);
          if (photoUrl) {
            console.log('Successfully got photo URL:', photoUrl);
            return [{
              id: photo.name,
              url: photoUrl,
              width: photo.widthPx || 1200,
              height: photo.heightPx || 800
            }];
          }
        } catch (photoError) {
          console.error(`Error with photo ${i}:`, photoError);
          // Continue to next photo
        }
        
        console.log(`Failed to get URL for photo ${i}, trying next...`);
      }

      console.log('No valid photos found, returning empty array');
      return [];
    } catch (error) {
      console.error('Error fetching place photos:', error);
      return [];
    }
  }

  async getHotelPhoto(hotelName: string): Promise<PhotoResult | null> {
    try {
      console.log('Fetching photos for hotel:', hotelName);
      
      const searchData = await this.searchPlace(hotelName);
      console.log('Places API response:', searchData);
      
      if (!searchData?.places?.[0]) {
        console.log('No places found for hotel:', hotelName);
        return null;
      }

      if (!searchData.places[0].photos?.length) {
        console.log('No photos found for hotel:', searchData.places[0].displayName);
        return null;
      }

      // Try multiple photos
      const photos = searchData.places[0].photos;
      
      // Try up to 3 photos
      for (let i = 0; i < Math.min(photos.length, 3); i++) {
        try {
          const photo = photos[i];
          console.log(`Trying hotel photo ${i}:`, photo);
          
          const photoUrl = await this.fetchPhotoMedia(photo.name);
          if (photoUrl) {
            console.log('Successfully got hotel photo URL:', photoUrl);
            return {
              id: photo.name,
              url: photoUrl,
              width: photo.widthPx || 1200,
              height: photo.heightPx || 800
            };
          }
        } catch (photoError) {
          console.error(`Error with hotel photo ${i}:`, photoError);
          // Continue to next photo
        }
        
        console.log(`Failed to get URL for hotel photo ${i}, trying next...`);
      }

      console.log('No valid photos found for hotel, returning null');
      return null;
    } catch (error) {
      console.error('Error fetching hotel photos:', error);
      return null;
    }
  }

  // Clean up object URLs when they're no longer needed
  cleanupPhotoUrl(url: string): void {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}

export const googlePlacesService = new GooglePlacesService();