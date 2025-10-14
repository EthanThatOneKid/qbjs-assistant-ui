This is the [assistant-ui](https://github.com/Yonom/assistant-ui) starter
project with QBJS-specific tools for BASIC code generation and weather information.

## Getting Started

First, create a `.env.local` file with your API key:

```bash
# Google AI API Key (required for the app to work)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here
```

### API Key Setup

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Add the key to your `.env.local` file
3. Restart your development server

### Features

This app includes:

- **BASIC Code Generation Tool**: Generate various types of BASIC programs with beautiful syntax highlighting
- **Weather Tool**: Get current weather information for different cities
- **Clean UI**: Modern, responsive interface built with assistant-ui
- **No Authentication Required**: Simple setup without external dependencies

### Chat Behavior

- Chat sessions are **session-only** (conversations are lost on page refresh)
- Each page refresh starts a new conversation
- This keeps the app simple and focused on the core functionality

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
