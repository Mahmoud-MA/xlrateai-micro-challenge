require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVEN_VOICE = process.env.ELEVENLABS_VOICE_ID;

if (!DEEPSEEK_KEY) console.warn('Warning: DEEPSEEK_KEY not set');
if (!ELEVEN_KEY) console.warn('Warning: ELEVEN_KEY not set');

if (!DEEPSEEK_KEY && !ELEVEN_KEY) {
  console.log('Nothing is set, please set at least one key');
  return;
}

app.post('/api/reply', async (req, res) => {
  try {
    const { clientMessage } = req.body;
    if (!clientMessage) {
      return res.status(400).json({ error: 'clientMessage required' });
    }

    const prompt = `
You are a professional freelance assistant.
Your job is to create quick, client-ready responses that sound polite, confident, and clear.

Rules:
- Keep it under 40 words.
- Match the tone: professional, friendly, and helpful.
- Respond in the SAME LANGUAGE as the client's message.
- Do not add extra questions unless the client asked something unclear.
- Avoid emojis or slang.
- Keep formatting plain text.
- Do NOT explain why you chose these words or why the response will work.

Client message:
"${clientMessage}"
`;

    const dResp = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const data = dResp.data || {};
    const reply = data.choices?.[0]?.message?.content?.trim() || JSON.stringify(data);
    res.json({ reply });
  } catch (err) {
    console.error('DeepSeek error:', err.response?.data || err.message || err);
    res.status(500).json({
      error: 'An error occurred while generating a reply.',
    });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text required' });
    }

    const vId = voiceId || ELEVEN_VOICE;

    const tResp = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${vId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        output_format: 'mp3_44100_128',
      },
      {
        headers: {
          'xi-api-key': ELEVEN_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    );

    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(tResp.data));
  } catch (err) {
    console.error('TTS error', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to load the voice. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
