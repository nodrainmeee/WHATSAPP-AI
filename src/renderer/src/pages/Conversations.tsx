import { useState } from 'react';

export default function Conversations() {
  const [selectedContact, setSelectedContact] = useState('contact_1');
  const [incomingMessage, setIncomingMessage] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!incomingMessage.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedResponse('');

    try {
      const result = await window.electronAPI.generateResponse(
        selectedContact,
        "Derniers messages échangés.",
        incomingMessage
      );

      if (result.success && result.text) {
        setGeneratedResponse(result.text);
      } else {
        setError(result.error || "Erreur inconnue");
      }
    } catch {
      setError("Erreur de communication avec le processus principal.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResponse);
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      <div style={{ width: '30%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#d2d2d7' }}>Contacts</h2>
        <button 
          onClick={() => setSelectedContact('contact_1')}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '12px',
            borderRadius: '8px',
            border: selectedContact === 'contact_1' ? '1px solid rgba(100,150,255,0.3)' : '1px solid transparent',
            backgroundColor: selectedContact === 'contact_1' ? 'rgba(100,150,255,0.15)' : 'transparent',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          <div style={{ fontWeight: 500 }}>Alice</div>
          <div style={{ fontSize: '12px', color: '#86868b' }}>Contact principal</div>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#86868b', marginBottom: '8px' }}>Message reçu sur WhatsApp</label>
          <textarea 
            value={incomingMessage}
            onChange={(e) => setIncomingMessage(e.target.value)}
            placeholder="Collez le message reçu ici..."
            style={{ width: '100%', height: '100px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#f5f5f7', boxSizing: 'border-box', resize: 'none' }}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !incomingMessage.trim()}
          style={{ alignSelf: 'flex-end', padding: '10px 24px', backgroundColor: 'rgba(100,150,255,0.2)', color: '#6496ff', border: '1px solid rgba(100,150,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          {isGenerating ? 'Léa réfléchit...' : 'Générer la réponse de Léa'}
        </button>

        {error && (
          <div style={{ padding: '12px', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#86868b', marginBottom: '8px' }}>Réponse proposée par Léa</label>
          <textarea 
            value={generatedResponse}
            onChange={(e) => setGeneratedResponse(e.target.value)}
            placeholder="La réponse apparaîtra ici..."
            style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#f5f5f7', boxSizing: 'border-box', resize: 'none' }}
          />
          <button 
            onClick={copyToClipboard}
            disabled={!generatedResponse}
            style={{ marginTop: '16px', width: '100%', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
          >
            Copier la réponse
          </button>
        </div>
      </div>
    </div>
  );
}
