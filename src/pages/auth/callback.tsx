import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googlePhotosService } from '../../services/googlePhotosService';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (code) {
        try {
          await googlePhotosService.setCredentials(code);
          // Try to get the return URL from localStorage
          const returnUrl = localStorage.getItem('auth_return_url') || '/';
          localStorage.removeItem('auth_return_url'); // Clean up
          navigate(returnUrl);
        } catch (error) {
          console.error('Error setting credentials:', error);
          setError('Failed to authenticate with Google Photos. Please try again.');
        }
      } else {
        setError('No authentication code received from Google. Please try again.');
      }
    };

    handleCallback();
  }, [code, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-gray-600">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
} 