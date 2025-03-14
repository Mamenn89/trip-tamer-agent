const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

class GooglePhotosService {
  private accessToken: string | null = null;

  constructor() {
    // Try to load token from localStorage
    this.accessToken = localStorage.getItem('google_photos_token');
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/photoslibrary.readonly'];
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scopes.join(' ')}&access_type=offline`;
    return authUrl;
  }

  async setCredentials(code: string) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        this.accessToken = data.access_token;
        // Store token in localStorage
        localStorage.setItem('google_photos_token', data.access_token);
      }
      return data;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async searchPhotos(query: string) {
    if (!this.accessToken) {
      // Redirect to auth if not authenticated
      window.location.href = this.getAuthUrl();
      throw new Error('Not authenticated. Redirecting to Google login...');
    }

    try {
      const response = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageSize: 25,
          filters: {
            mediaTypeFilter: {
              mediaTypes: ['PHOTO']
            },
            contentFilter: {
              includedContentCategories: ['LANDSCAPES', 'CITYSCAPES', 'LANDMARKS']
            }
          }
        }),
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('google_photos_token');
        this.accessToken = null;
        window.location.href = this.getAuthUrl();
        throw new Error('Authentication expired. Redirecting to Google login...');
      }

      const data = await response.json();
      return data.mediaItems || [];
    } catch (error) {
      console.error('Error searching photos:', error);
      return [];
    }
  }

  async getPhotosByDestination(destination: string) {
    try {
      if (!this.isAuthenticated()) {
        window.location.href = this.getAuthUrl();
        return [];
      }

      const photos = await this.searchPhotos(destination);
      return photos.map((photo: any) => ({
        id: photo.id,
        url: photo.baseUrl,
        width: photo.mediaMetadata.width,
        height: photo.mediaMetadata.height,
        description: photo.description || ''
      }));
    } catch (error) {
      console.error('Error getting photos for destination:', error);
      return [];
    }
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('google_photos_token');
  }
}

export const googlePhotosService = new GooglePhotosService(); 