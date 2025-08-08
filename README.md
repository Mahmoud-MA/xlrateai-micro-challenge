# xlrateai-micro-challenge

A simple web tool that helps freelancers generate professional, polite, and concise client follow-up replies using AI. Powered by the DeepSeek model for text generation and ElevenLabs for realistic text-to-speech.

## Features

- Paste a client message and get a polished reply instantly.
- AI replies respect the tone and language of the original message.
- Listen to the generated reply with realistic voice synthesis.
- Clean, modern UI with smooth animations and glassmorphism styling.
- Uses DeepSeek via OpenRouter API for smart chat completions.
- Uses ElevenLabs API for natural text-to-speech voice generation.

## Demo

https://xlrateai-micro-challenge-111g.vercel.app/

## Getting Started

### Prerequisites

- Node.js v16+
- npm
- OpenRouter API key with access to DeepSeek model
- ElevenLabs API key

### Installation

```bash
git clone https://github.com/Mahmoud-MA/xlrateai-micro-challenge
cd xlrateai-micro-challenge
cd backend
npm install
cd ../frontend
npm install
```

### BackEnd Environment Variables

Create a .env file in the backend folder with:

```bash
DEEPSEEK_API_KEY=your_openrouter_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=rU18Fk3uSDhmg5Xh41o4 # default voice ID
PORT=3000
```

### FrontEnd Environment Variables

Create a .env file in the frontend folder with:

```bash
VITE_BACKEND_URL=your_backend_url # e.g., http://localhost:3000
```

### Run in Development Mode

#### Backend

Navigate to backend folder and start the backend server with:

```bash
npm run dev
```

#### Frontend

Navigate to frontend folder and start the frontend server with:

```bash
npm run dev
```
