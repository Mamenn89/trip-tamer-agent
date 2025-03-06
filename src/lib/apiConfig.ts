
let GEMINI_API_KEY = "AIzaSyBZrt40nmkkMUcYM-cbYKXWCeqDNF3evr0";

export const setApiKey = (key: string) => {
  GEMINI_API_KEY = key;
};

export const getApiKey = () => GEMINI_API_KEY;

// Use a CORS proxy to work around browser restrictions
export const API_ENDPOINT = 'https://cors-anywhere.herokuapp.com/https://generativelanguage.googleapis.com/v2/models/gemini-pro:generateContent';
