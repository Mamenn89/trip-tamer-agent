
import React, { useState } from 'react';
import { setApiKey } from '../lib/gemini';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

const ApiKeyInput = () => {
  const [apiKey, setApiKeyValue] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    setApiKey(apiKey.trim());
    setIsApiKeySet(true);
    toast.success('API key saved! You can now generate travel plans.');
  };

  const handleReset = () => {
    setApiKeyValue('');
    setIsApiKeySet(false);
    setApiKey(''); // Reset the API key in the gemini.ts module
    toast.info('API key has been reset');
  };

  if (isApiKeySet) {
    return (
      <Card className="bg-white/80 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">API Key Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600">✅ API key is set and ready to use</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs">
            Reset API Key
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Enter your Gemini API Key</CardTitle>
        <CardDescription>
          Required to generate AI travel plans. Get your key from Google AI Studio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <Input
            type="password"
            placeholder="Enter your API key here"
            value={apiKey}
            onChange={(e) => setApiKeyValue(e.target.value)}
            className="border rounded-md"
          />
          <p className="text-xs text-gray-500">
            Your API key is stored locally and never sent to our servers.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSetApiKey} className="w-full">
          Save API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
