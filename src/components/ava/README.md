# Ava Conversational AI Components

This directory contains components for the Ava Conversational AI interface, which allows users to interact with the HealthProAssist platform using natural language.

## Components

### AvaConversationalInterface

The main component that provides a chat interface for interacting with Ava. It includes:

- Text and voice input
- Real-time message display
- D-ID video animation for responses
- Data visualization for search results

## Usage

```tsx
import { ConversationalAIProvider } from '@/context/ConversationalAIContext';
import AvaConversationalInterface from '@/components/ava/AvaConversationalInterface';

const MyComponent = () => {
  return (
    <ConversationalAIProvider>
      <AvaConversationalInterface />
    </ConversationalAIProvider>
  );
};
```

## Props

### AvaConversationalInterface

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes to apply to the component |
| `avatarUrl` | `string` | `'https://create-images-results.d-id.com/DefaultPresenters/Erica_f/image.jpeg'` | URL to the avatar image |
| `defaultPresenter` | `string` | `'Erica'` | Name of the default presenter |

## Features

- **Natural Language Processing**: Understands and responds to natural language queries
- **Voice Input**: Supports voice input using the Web Speech API
- **D-ID Integration**: Animates responses using D-ID's talking avatar technology
- **Data Visualization**: Displays search results in a structured format
- **Context Awareness**: Maintains conversation context across multiple messages

## Dependencies

- OpenAI API for natural language processing
- D-ID API for avatar animation
- Web Speech API for voice input
- React and React DOM

## Testing

Tests are located in `/src/test/components/ava/`. Run tests with:

```bash
npm test
```

## Example Queries

- "Find memory care facilities near Boston"
- "What are the top-rated assisted living facilities?"
- "Show me my contacts at Sunrise Senior Living"
- "What appointments do I have today?"
- "Check my payment status for Golden Oaks Care Center"