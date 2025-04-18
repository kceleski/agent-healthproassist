# Issues and Fixes

## Security Issues

### 1. Exposed API Keys
**Problem**: Several API keys were hardcoded directly in the source code, which is a security risk as these keys could be exposed in version control or client-side code.

**Fix**: 
- Created `.env` and `.env.example` files to store environment variables
- Updated code to use `import.meta.env.VITE_*` to access these variables
- Added `.env` to `.gitignore` to prevent committing sensitive information

Affected files:
- `/src/hooks/use-ava-assistant.ts`
- `/src/pages/Index.tsx`
- `/src/services/did-service.ts`
- `/src/components/maps/FacilityGoogleMap.tsx`
- `/src/pages/AvaMapPage.tsx`
- `/src/pages/MapPage.tsx`

### 2. Insecure Authentication
**Problem**: The authentication is mocked and uses localStorage for storing user data, which is not secure for a production application.

**Recommendation**: Implement proper authentication with JWT tokens and secure cookie storage for production use.

## Configuration Issues

### 1. Vite Server Configuration
**Problem**: The vite.config.ts file had server configuration that didn't match the runtime environment requirements.

**Fix**:
- Updated host from `"::"` to `"0.0.0.0"` to allow access from any host
- Changed port from `8080` to `12000` to match runtime requirements
- Added runtime hosts to `allowedHosts` array
- Added `cors: true` to enable CORS requests

## Code Quality Issues

### 1. State Management in Subscription Toggle
**Problem**: The subscription toggle component initialized state from props but didn't update when props changed, which could lead to inconsistencies.

**Fix**:
- Added `useEffect` hook to update state when user props change
- Improved initial state to check both `user?.demoTier` and `user?.subscription`

### 2. Duplicate API Call Logic
**Problem**: There's duplicate code for API calls to OpenAI and D-ID in multiple files.

**Recommendation**: Refactor API calls into dedicated service files to avoid duplication.

### 3. Performance Issues in Landing Page
**Problem**: The LandingPage component has a complex animation system with many elements that could impact performance.

**Recommendation**: Optimize animations by:
- Using CSS animations instead of JavaScript where possible
- Reducing the number of animated elements
- Implementing lazy loading for animations

## Potential Broken Links

**Problem**: External dependencies and image URLs might break if services are unavailable or URLs change.

**Recommendation**:
- Implement error handling for external script loading
- Consider hosting critical images locally
- Add fallbacks for external services

## Additional Recommendations

1. **Implement proper error handling** for API calls and external service dependencies
2. **Add loading states** for components that depend on asynchronous data
3. **Create unit tests** for critical components and functionality
4. **Optimize bundle size** by code splitting and lazy loading components
5. **Implement proper TypeScript types** for all components and functions