
# HealthProAssist AI Assistant Integration

This application integrates OpenAI's Assistant API with D-ID's talking avatar technology to create an interactive healthcare assistant. It also includes a facility finder feature with SerpAPI integration for live data.

## Setup Instructions

### Requirements

To use this application, you'll need:
1. An OpenAI API key with access to the Assistants API
2. A D-ID API key for the talking avatar functionality
3. An Assistant ID from OpenAI (you need to create this in the OpenAI platform)
4. A SerpAPI key for the facility finder feature (optional)

### Creating an OpenAI Assistant

1. Go to the [OpenAI platform](https://platform.openai.com/assistants)
2. Create a new assistant focused on healthcare advice
3. Copy the Assistant ID and replace `"YOUR_ASSISTANT_ID"` in the code

### Setting up SerpAPI for Facility Finder

1. Sign up for a SerpAPI account at [serpapi.com](https://serpapi.com)
2. Get your API key from the dashboard
3. Create a `.env` file in the root directory (copy from `.env.example`)
4. Add your SerpAPI key to the `.env` file: `VITE_SERPAPI_KEY=your_key_here`

### Getting Started

1. Enter your OpenAI API key and D-ID API key in the application
2. Start asking health-related questions to interact with the AI assistant
3. The AI's responses will be animated using the D-ID talking avatar
4. Use the Facility Finder to search for healthcare facilities near you

## Important Notes

- API keys are stored in your browser's local storage only
- The application maintains a conversation thread with the OpenAI assistant
- For production use, API calls should be routed through a backend to protect API keys
- The Facility Finder uses SerpAPI for all users to provide live data
- If SerpAPI fails, the application will fall back to mock data

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your API keys (see `.env.example`)
4. Start the development server: `npm run dev`
