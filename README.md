This is a [assistant-ui](https://github.com/Yonom/assistant-ui) based BASIC programming assistant that generates QB64/QBJS code using few-shot learning examples inspired by [QB64.com samples](https://qb64.com/samples/qbjs.html).

## Getting Started

### API Key Setup

You have two options to provide your Google Generative AI API key:

#### Option 1: User-Provided API Key (Recommended for Public Deployments)

1. Click the "API Key" button in the sidebar
2. Enter your Google AI API key when prompted
3. Get your free API key from [Google AI Studio](https://aistudio.google.com/app/api-keys)
4. The key will be stored in localStorage and used for all requests

#### Option 2: Environment Variable (For Development)

Create a `.env.local` file with your API key:

```bash
# Google AI API Key (optional fallback)
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key-here
```

**Note:** If both are provided, the environment variable takes precedence. If neither is available, users will be prompted to provide an API key via the sidebar.

### Features

This app includes:

- **Open-ended BASIC Code Generation**: Generate any type of BASIC program through natural conversation
- **Few-shot Learning**: Uses diverse examples from QB64.com and QBJS samples to teach the AI (games, graphics, math, algorithms, interactive programs)
- **Graphics & Games**: Create fractals, games, graphics programs, and more
- **Educational**: Well-commented code that teaches programming concepts
- **Clean UI**: Modern, responsive interface built with assistant-ui
- **No Authentication Required**: Simple setup without external dependencies

### What You Can Create

The assistant can generate various types of BASIC programs:

- **Graphics**: Circles, lines, fractals, screensavers, turtle graphics, particle effects
- **Games**: Dice games, guessing games, simple arcade games, interactive drawing
- **Math**: Calculators, Fibonacci sequences, binary counters, geometric calculations
- **Interactive**: Programs that respond to user input, mouse interaction, real-time drawing
- **Animation**: Particle systems, animated graphics, visual effects
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
