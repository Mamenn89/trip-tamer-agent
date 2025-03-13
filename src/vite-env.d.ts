
/// <reference types="vite/client" />

// Define Google Maps types on the window object
interface Window {
  google?: {
    maps: any;
  };
  // Add the Google Maps authentication failure callback
  gm_authFailure?: () => void;
}
