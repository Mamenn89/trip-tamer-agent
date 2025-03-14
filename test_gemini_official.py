import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variables
API_KEY = os.getenv('VITE_GEMINI_API_KEY')

print("API Key status:", "Found" if API_KEY else "Not found")
print("API Key length:", len(API_KEY) if API_KEY else 0)

# Initialize the client
genai.configure(api_key=API_KEY)

# Test prompt
prompt = """Create a travel plan for:
Destination: Tokyo
Origin: Jakarta
Dates: flexible
Number of Travelers: 2
Budget: $3000
Interests: food, culture

Please provide the response in JSON format with flight and hotel recommendations."""

try:
    print("Initializing Gemini client...")
    
    # Create model instance with the correct model name
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    print("Sending request to Gemini API...")
    response = model.generate_content(prompt)
    
    print("\nGenerated Response:")
    print(response.text)
    
except Exception as e:
    print(f"Error: {str(e)}")
    print("\nDebug Info:")
    print("API Key length:", len(API_KEY) if API_KEY else "No API key found") 