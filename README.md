
# HealthProAssist AI Assistant Integration

This application integrates OpenAI's Assistant API with D-ID's talking avatar technology to create an interactive healthcare assistant.

## Setup Instructions

### Requirements

To use this application, you'll need:
1. An OpenAI API key with access to the Assistants API
2. A D-ID API key for the talking avatar functionality
3. An Assistant ID from OpenAI (you need to create this in the OpenAI platform)

### Creating an OpenAI Assistant

1. Go to the [OpenAI platform](https://platform.openai.com/assistants)
2. Create a new assistant focused on healthcare advice
3. Copy the Assistant ID and replace `"YOUR_ASSISTANT_ID"` in the code

### Getting Started

1. Enter your OpenAI API key and D-ID API key in the application
2. Start asking health-related questions to interact with the AI assistant
3. The AI's responses will be animated using the D-ID talking avatar

## Important Notes

- API keys are stored in your browser's local storage only
- The application maintains a conversation thread with the OpenAI assistant
- For production use, API calls should be routed through a backend to protect API keys
