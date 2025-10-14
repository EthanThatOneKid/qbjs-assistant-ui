This is the [assistant-ui](https://github.com/Yonom/assistant-ui) starter
project.

## Getting Started

First, create a `.env.local` file with your API keys:

```bash
# Google AI API Key (currently used in the app)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here

# Optional: OpenAI API Key (if you want to switch to OpenAI)
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Clerk Authentication (get from https://dashboard.clerk.com/last-active?path=api-keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

# Assistant UI Cloud for chat history and persistence
# Sign up for free on https://cloud.assistant-ui.com
NEXT_PUBLIC_ASSISTANT_BASE_URL=https://your-assistant-cloud-url.assistant-ui.com
ASSISTANT_API_KEY=YOUR_ASSISTANT_API_KEY
```

### Authentication Setup

This app uses [Clerk](https://clerk.com/) for user authentication, which enables
personalized chat history and persistence.

**Setup Steps:**

1. Sign up for a free account at [https://clerk.com](https://clerk.com)
2. Create a new application in your Clerk Dashboard
3. Get your API keys from the
   [API Keys page](https://dashboard.clerk.com/last-active?path=api-keys)
4. Add the Clerk keys to your `.env.local` file
5. Restart your development server

### Chat History and Persistence

This app supports chat history and persistence through
[Assistant UI Cloud](https://cloud.assistant-ui.com) with user authentication.

**With Authentication + Assistant UI Cloud:**

1. Sign up for a free account at
   [https://cloud.assistant-ui.com](https://cloud.assistant-ui.com)
2. Get your Assistant UI Cloud URL and API key
3. Add `NEXT_PUBLIC_ASSISTANT_BASE_URL` and `ASSISTANT_API_KEY` to your
   `.env.local` file
4. Each authenticated user gets their own workspace with persistent chat history
5. Conversations persist across browser refreshes and devices

**Without Assistant UI Cloud:**

- The app will work with local-only chat sessions
- Conversations will NOT persist between browser refreshes
- Each page refresh will start a new conversation

**Note:** For production applications, we strongly recommend using both Clerk
authentication and Assistant UI Cloud for reliable, user-specific chat history
persistence.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.
