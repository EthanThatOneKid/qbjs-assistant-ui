This is a [assistant-ui](https://github.com/Yonom/assistant-ui) based BASIC programming assistant that generates QB64/QBJS code using few-shot learning examples inspired by [QB64.com samples](https://qb64.com/samples/qbjs.html).

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

- **Open-ended BASIC Code Generation**: Generate any type of BASIC program through natural conversation
- **Few-shot Learning**: Uses examples from QB64.com samples to teach the AI
- **Graphics & Games**: Create fractals, games, graphics programs, and more
- **Educational**: Well-commented code that teaches programming concepts
- **Clean UI**: Modern, responsive interface built with assistant-ui
- **No Authentication Required**: Simple setup without external dependencies

### What You Can Create

The assistant can generate various types of BASIC programs:

- **Graphics**: Circles, lines, fractals, screensavers, turtle graphics
- **Games**: Dice games, guessing games, simple arcade games
- **Math**: Calculators, Fibonacci sequences, binary counters, geometric calculations
- **Interactive**: Programs that respond to user input
- **Educational**: Programs that demonstrate programming concepts

### Chat Behavior

- Chat sessions are **session-only** (conversations are lost on page refresh)
- Each page refresh starts a new conversation
- The assistant learns from few-shot examples to generate appropriate BASIC code
- Code is formatted with syntax highlighting and includes educational comments

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
