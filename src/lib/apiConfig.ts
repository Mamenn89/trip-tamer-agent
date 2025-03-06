

let DEEPSEEK_API_KEY = "sk-71d512488e264690b97f90618c857b41";
const SERPAPI_KEY = "b7b2be5b8f6f58d876f0e661b5b27ad59696c802a98a8c17dea4819b5e63f86a";

export const setApiKey = (key: string) => {
  DEEPSEEK_API_KEY = key;
};

export const getApiKey = () => DEEPSEEK_API_KEY;
export const getSerpApiKey = () => SERPAPI_KEY;

// DeepSeek API endpoint
export const API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

