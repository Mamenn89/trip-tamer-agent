import requests
import json

# Your Gemini API key
API_KEY = "AIzaSyBUNaL6k9fp1bwOOOzJQr3DYhgDwA8SM3Q"

# Test prompt
prompt = """Create a travel plan for:
Destination: Tokyo
Origin: Jakarta
Dates: flexible
Number of Travelers: 2
Budget: $3000
Interests: food, culture

Please provide the response in JSON format with flight and hotel recommendations."""

# API endpoint
url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={API_KEY}"

# Request payload
payload = {
    "contents": [{
        "parts": [{
            "text": prompt
        }]
    }],
    "generationConfig": {
        "temperature": 0.9,
        "topP": 1,
        "topK": 40,
        "maxOutputTokens": 8192,
    }
}

# Make the request
try:
    print("Sending request to Gemini API...")
    response = requests.post(url, json=payload)
    print(f"Response Status Code: {response.status_code}")
    print(f"Response Headers: {response.headers}")
    
    if response.ok:
        data = response.json()
        print("\nRaw Response:")
        print(json.dumps(data, indent=2))
        
        if "candidates" in data and len(data["candidates"]) > 0:
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            print("\nGenerated Text:")
            print(text)
        else:
            print("\nNo content in response")
    else:
        print("\nError Response:")
        print(response.text)
        
except Exception as e:
    print(f"Error: {str(e)}") 