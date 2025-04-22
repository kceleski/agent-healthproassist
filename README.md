
# HealthProAssist AI Healthcare Assistant

## Overview

HealthProAssist is an innovative AI-powered healthcare assistant that combines advanced conversational AI with interactive avatar technology to provide personalized healthcare support.

## Key Features

- 🤖 AI-Powered Conversation: Powered by OpenAI's Assistant API
- 👥 Interactive Talking Avatar: Utilizes D-ID's advanced avatar technology
- 🔒 Secure Authentication: Built with Supabase authentication
- 🌐 Web-Based Platform: Accessible through a modern, responsive web interface

## Prerequisites

Before getting started, ensure you have the following:

### API Keys
1. OpenAI API Key
   - Access to the Assistants API
   - Create an account at [OpenAI Platform](https://platform.openai.com/)

2. D-ID API Key
   - For talking avatar functionality
   - Sign up at [D-ID Developer Portal](https://www.d-id.com/)

3. Supabase Project
   - Set up authentication and database
   - Create a project at [Supabase](https://supabase.com/)

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/healthproassist.git
   cd healthproassist
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure Environment Variables
   Create a `.env` file with the following:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_DID_API_KEY=your_did_api_key
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Running the Application

```bash
npm run dev
```

## Deployment

The application is ready to be deployed on platforms like Vercel, Netlify, or your preferred hosting service.

## Security Notes

- API keys are stored securely in environment variables
- Sensitive information is never exposed client-side
- Authentication is handled through Supabase

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License.

## Support

For issues or questions, please open a GitHub issue or contact support@healthproassist.com.
