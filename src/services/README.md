# HealthProAssist Services

This directory contains service modules that handle API calls, data processing, and external integrations.

## Services

### OpenAI Service (`openai-service.ts`)

Handles communication with the OpenAI API for natural language processing.

**Key Functions:**
- `createThread()`: Creates a new conversation thread
- `processUserMessage(threadId, message)`: Processes a user message and returns the updated conversation
- `getThreadMessages(threadId)`: Retrieves all messages in a thread

### D-ID Service (`did-service.ts`)

Manages the D-ID API integration for avatar animation.

**Key Functions:**
- `animateResponse(text, sourceUrl)`: Creates an animated video from text
- `createDIDTalk(text, sourceUrl)`: Creates a new D-ID talk
- `checkDIDTalkStatus(talkId)`: Checks the status of a D-ID talk

### Maps Service (`maps-service.ts`)

Provides location-based services and facility search functionality.

**Key Functions:**
- `searchFacilities(query)`: Searches for facilities based on a query
- `loadGoogleMapsScript(callback)`: Loads the Google Maps script
- `getDistance(lat1, lng1, lat2, lng2)`: Calculates the distance between two coordinates

### Data Service (`data-service.ts`)

Handles data retrieval and processing for various data types.

**Key Functions:**
- `fetchData(request)`: Fetches data based on the request type
- `fetchFacilitiesData(request)`: Fetches facilities data
- `fetchContactsData(request)`: Fetches contacts data
- `fetchPaymentsData(request)`: Fetches payments data
- `fetchCalendarData(request)`: Fetches calendar data

## Usage

```typescript
import { createThread, processUserMessage } from '@/services/openai-service';
import { animateResponse } from '@/services/did-service';
import { searchFacilities } from '@/services/maps-service';
import { fetchData, DataType } from '@/services/data-service';

// Example: Process a user message
const threadId = await createThread();
const messages = await processUserMessage(threadId, 'Hello, how can you help me?');

// Example: Animate a response
const videoUrl = await animateResponse('I can help you find senior living facilities.');

// Example: Search for facilities
const facilities = await searchFacilities('memory care facilities in Boston');

// Example: Fetch data
const response = await fetchData({
  type: DataType.FACILITIES,
  query: 'assisted living',
  limit: 5
});
```

## Environment Variables

These services require the following environment variables:

```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_DID_API_KEY=your_did_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_api_key
VITE_SEARCH_API_KEY=your_search_api_key
```

## Testing

Tests for these services are located in `/src/test/services/`. Run tests with:

```bash
npm test
```