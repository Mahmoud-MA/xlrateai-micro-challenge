import React, { useEffect, useState } from 'react';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const voices = [
  { name: 'sully', voiceId: 'wAGzRVkxKEs8La0lmdrE' },
  { name: 'viraj', voiceId: 'iWNf11sz1GrUE4ppxTOL' },
  { name: 'Ryan', voiceId: 'rU18Fk3uSDhmg5Xh41o4' },
];

export default function App() {
  const [clientMessage, setClientMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loadingTts, setLoadingTts] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const isLoading = loadingReply || loadingTts;

  useEffect(() => {
    if (selectedVoiceId && reply) {
      generateVoice(selectedVoiceId);
    }
  }, [selectedVoiceId]);

  function handleSelect(e) {
    setSelectedVoiceId(e.target.value);
  }

  const suggestReply = async () => {
    if (!clientMessage) {
      return alert('Please provide text to generate the speech reply.');
    }

    setLoadingReply(true);
    setReply('');
    setAudioUrl(null);
    try {
      const r = await fetch(`${backendUrl}/api/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientMessage }),
      });

      const data = await r.json();
      if (!r.ok) {
        throw new Error(data.error);
      }

      if (data.reply) {
        setReply(data.reply);
      } else {
        setReply('Error: No reply returned.');
      }
    } catch (e) {
      setReply('Error: ' + e.message);
    } finally {
      setLoadingReply(false);
    }
  };

  const generateVoice = async () => {
    if (!reply) {
      return alert('No reply text to convert to speech');
    }
    setLoadingTts(true);
    setAudioUrl(null);
    try {
      const r = await fetch(`${backendUrl}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply, voiceId: selectedVoiceId }),
      });

      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err?.error || `${r.status} ${r.statusText}`);
      }

      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingTts(false);
    }
  };

  return (
    <div className="container">
      <VoiceSelector onVoiceSelect={handleSelect} selectedVoiceId={selectedVoiceId} />
      <h1>Quick Reply → Voice</h1>

      <label>Client message</label>
      <textarea
        value={clientMessage}
        onChange={(e) => setClientMessage(e.target.value)}
        placeholder="Paste the client's message here"
      />

      <div className="row">
        <button onClick={suggestReply} disabled={!clientMessage.trim() || isLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ marginRight: 8 }}
          >
            <path d="M11.064 2.705l1.013 2.175c.624 1.341 1.702 2.418 3.043 3.043l2.175 1.013c.904.421.904 1.707 0 2.128l-2.175 1.013c-1.341.624-2.418 1.702-3.043 3.043l-1.013 2.175c-.421.904-1.707.904-2.128 0L7.923 15.12c-.624-1.341-1.702-2.418-3.043-3.043l-2.175-1.013c-.904-.421-.904-1.707 0-2.128L4.88 7.923C6.221 7.299 7.299 6.221 7.923 4.88l1.013-2.175C9.357 1.801 10.643 1.801 11.064 2.705zM18.625 14.406l.684 1.239c.243.44.606.803 1.047 1.047l1.239.684c.491.271.491.978 0 1.249l-1.239.684c-.44.243-.803.606-1.047 1.047l-.684 1.239c-.271.491-.978.491-1.249 0l-.684-1.239c-.243-.44-.606-.803-1.047-1.047l-1.239-.684c-.491-.271-.491-.978 0-1.249l1.239-.684c.44-.243.803-.606 1.047-1.047l.684-1.239C17.647 13.914 18.353 13.914 18.625 14.406z" />
          </svg>
          {loadingReply ? 'Suggesting…' : 'Suggest reply'}
        </button>
        <button onClick={generateVoice} disabled={!reply.trim() || isLoading}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ marginRight: 8 }}
          >
            <path d="M11.064 2.705l1.013 2.175c.624 1.341 1.702 2.418 3.043 3.043l2.175 1.013c.904.421.904 1.707 0 2.128l-2.175 1.013c-1.341.624-2.418 1.702-3.043 3.043l-1.013 2.175c-.421.904-1.707.904-2.128 0L7.923 15.12c-.624-1.341-1.702-2.418-3.043-3.043l-2.175-1.013c-.904-.421-.904-1.707 0-2.128L4.88 7.923C6.221 7.299 7.299 6.221 7.923 4.88l1.013-2.175C9.357 1.801 10.643 1.801 11.064 2.705zM18.625 14.406l.684 1.239c.243.44.606.803 1.047 1.047l1.239.684c.491.271.491.978 0 1.249l-1.239.684c-.44.243-.803.606-1.047 1.047l-.684 1.239c-.271.491-.978.491-1.249 0l-.684-1.239c-.243-.44-.606-.803-1.047-1.047l-1.239-.684c-.491-.271-.491-.978 0-1.249l1.239-.684c.44-.243.803-.606 1.047-1.047l.684-1.239C17.647 13.914 18.353 13.914 18.625 14.406z" />
          </svg>
          {loadingTts ? 'Generating audio…' : 'Generate voice'}
        </button>
      </div>

      <label>Suggested reply (editable)</label>
      <textarea value={reply} onChange={(e) => setReply(e.target.value)} />

      {audioUrl && (
        <div className="audioBox">
          <audio src={audioUrl} controls />
          <a href={audioUrl} download="reply.mp3">
            Download MP3
          </a>
        </div>
      )}
    </div>
  );
}
function VoiceSelector({ onVoiceSelect, selectedVoiceId }) {
  return (
    <select value={selectedVoiceId} onChange={onVoiceSelect} className="voiceSelector">
      <option value="" disabled>
        Select a voice
      </option>
      {voices.map(({ name, voiceId }) => (
        <option key={voiceId} value={voiceId}>
          {name}
        </option>
      ))}
    </select>
  );
}
