This is the [assistant-ui](https://github.com/Yonom/assistant-ui) starter
project.

## Getting Started

First, create a `.env.local` file with your API keys:

```bash
# Google AI API Key (currently used in the app)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here

# Optional: OpenAI API Key (if you want to switch to OpenAI)
# OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Assistant UI Cloud for chat history and persistence
# Sign up for free on https://cloud.assistant-ui.com
# NEXT_PUBLIC_ASSISTANT_BASE_URL=https://your-assistant-cloud-url.assistant-ui.com
```

### Chat History and Persistence

This app supports chat history and persistence through [Assistant UI Cloud](https://cloud.assistant-ui.com). 

**With Assistant UI Cloud (Recommended):**
1. Sign up for a free account at [https://cloud.assistant-ui.com](https://cloud.assistant-ui.com)
2. Get your Assistant UI Cloud URL
3. Add `NEXT_PUBLIC_ASSISTANT_BASE_URL` to your `.env.local` file
4. Restart your development server

**Without Assistant UI Cloud:**
- The app will work with local-only chat sessions
- Conversations will NOT persist between browser refreshes
- Each page refresh will start a new conversation

**Note:** For production applications, we strongly recommend using Assistant UI Cloud for reliable chat history persistence.

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
