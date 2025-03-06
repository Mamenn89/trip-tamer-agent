
let DEEPSEEK_API_KEY = "sk-71d512488e264690b97f90618c857b41";

export const setApiKey = (key: string) => {
  DEEPSEEK_API_KEY = key;
};

export const getApiKey = () => DEEPSEEK_API_KEY;

// DeepSeek API endpoint
export const API_ENDPOINT = 'https://api.deepseek.com/v1/chat/completions';

