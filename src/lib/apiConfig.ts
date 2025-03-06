
let GEMINI_API_KEY = "AIzaSyBZrt40nmkkMUcYM-cbYKXWCeqDNF3evr0";

export const setApiKey = (key: string) => {
  GEMINI_API_KEY = key;
};

export const getApiKey = () => GEMINI_API_KEY;

export const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v2/models/gemini-pro:generateContent';
