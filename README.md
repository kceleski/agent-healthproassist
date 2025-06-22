
# HealthProAssist AI Healthcare Assistant

## Overview

HealthProAssist is a modern web-based healthcare assistant platform that combines conversational AI, secure authentication, and interactive avatar technology. It is designed to provide personalized healthcare support through an intuitive and responsive user interface.

---

## Table of Contents

- [Project Architecture](#project-architecture)
- [Technologies Used](#technologies-used)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Project Architecture

HealthProAssist utilizes a modular, scalable architecture based on modern fullstack best practices:

- **Frontend:** Built with React, Vite, Typescript, and Tailwind CSS. The UI leverages shadcn/ui component library for accessible, beautiful components and Lucide icons for consistent iconography.
- **Routing & State:** Uses React Router DOM for SPA navigation and @tanstack/react-query for data fetching and server-side state management.
- **Authentication:** Handles user authentication and session management through Supabase.
- **Backend:** Supabase (hosted PostgreSQL database, managed API, Auth) acts as the backend-as-a-service (BaaS) platform.
- **AI Integration:** Features conversational AI using OpenAI's Assistant API, with responses rendered visually using D-ID's talking avatar technology.
- **Deployment:** Ready for zero-config deployment on platforms like Vercel, Netlify, or any static hosting service.

## Technologies Used

- **React** (with Typescript): Main UI framework
- **Vite:** Blazing-fast developer server and build tool
- **Tailwind CSS:** Utility-first CSS framework for rapid UI styling
- **shadcn/ui:** Headless, accessible components for React
- **Lucide-react:** SVG icon library
- **@tanstack/react-query:** Data fetching and caching
- **Supabase:** Managed backend services (PostgreSQL, Auth, Storage, Edge Functions)
- **OpenAI Assistant API:** Conversational AI engine
- **D-ID API:** Talking avatar integration for dynamic AI responses
- **Sonner:** For toast notifications and feedback

**Other utilities:**
- `react-hook-form`, `zod`: For form management and schema validation
- `date-fns`: Modern date utility library

---

## Key Features

- 🤖 **AI-Powered Conversation:** Personalized health support powered by OpenAI Assistant API
- 👥 **Interactive Avatar:** Visual AI responses using D-ID's avatar/video technology
- 🔒 **Secure Authentication:** User login, registration, and session management via Supabase
- 📊 **Modern UI:** Responsive & accessible design with shadcn/ui and Tailwind CSS
- 🌎 **Location Search:** Facility, contact, calendar, and medical record management (modular pages)
- 🔔 **Real-Time Notifications:** Toast & in-app notifications for key user actions
- 🏥 **Cloud-Hosted Backend:** Supabase for managed database, edge functions, and user profiles

---

## Prerequisites

Before getting started, ensure you have:

1. **Node.js** (v18+ recommended)
2. **API Keys** for:
    - **OpenAI** (Assistant API): [OpenAI Platform](https://platform.openai.com/)
    - **Supabase** (Project URL & ANON Key): [Supabase Dashboard](https://supabase.com/)

---

## Installation

```bash
git clone https://github.com/your-org/healthproassist.git
cd healthproassist
npm install
```

---

## Environment Variables

Create a `.env` file in the root project directory with:

```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_DID_API_KEY=your_did_api_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **Do not commit your `.env` file or secrets.** For deployment, configure environment variables through your hosting provider.

---

## Running the Application

```bash
npm run dev
```

The app runs locally at [http://localhost:5173](http://localhost:5173) by default.

---

## Deployment

HealthProAssist is ready for deployment on Vercel, Netlify, Cloudflare Pages, or any modern static platform. Be sure to configure the required environment variables in your hosting dashboard.

---

## Security Notes

- API keys are never exposed in client code; use environment variables and follow best practices.
- Sensitive user data is protected with Supabase Auth and RLS (Row Level Security) policies.
- Recommend disabling "Confirm Email" for testing, then enabling for production.

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Submit a Pull Request

---

## License

Distributed under the MIT License.

---

## Support

- For issues, open a GitHub issue
- For direct contact: contact@healthproassist.com

