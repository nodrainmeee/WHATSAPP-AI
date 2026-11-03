import { useState, useEffect } from 'react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getApiKeyStatus().then((status: boolean) => setIsKeySaved(status));
    }
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setStatusMsg('Sauvegarde...');
    const res = await window.electronAPI.saveApiKey(apiKey.trim());
    if (res.success) {
      setIsKeySaved(true);
      setApiKey('');
      setStatusMsg('Clé API enregistrée et sécurisée avec le chiffrement natif de Windows (DPAPI).');
    } else {
      setStatusMsg('Erreur : ' + res.error);
    }
  };

  const handleVerify = async () => {
    setStatusMsg('Test de connexion avec Google Gemini...');
    const res = await window.electronAPI.verifyGeminiConnection();
    if (res.success) {
      setStatusMsg('Connexion réussie ! Léa est opérationnelle.');
    } else {
      setStatusMsg('Échec de la connexion : ' + res.error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5f5f7', margin: 0 }}>Paramètres</h1>
      </div>

      <section style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#d2d2d7', margin: '0 0 16px 0' }}>Moteur IA : Google Gemini</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#86868b', marginBottom: '8px' }}>Clé API Gemini</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={isKeySaved ? "•••••••••••••••• (Clé déjà configurée)" : "AIzaSy..."}
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px', color: '#f5f5f7' }}
              />
              <button 
                onClick={handleSave}
                style={{ padding: '10px 20px', backgroundColor: 'rgba(100,150,255,0.2)', color: '#6496ff', border: '1px solid rgba(100,150,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
              >
                Enregistrer
              </button>
            </div>
          </div>

          <button 
            onClick={handleVerify}
            style={{ alignSelf: 'flex-start', padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
          >
            Tester la connexion API
          </button>

          {statusMsg && (
            <div style={{ padding: '12px', backgroundColor: 'rgba(100,150,255,0.1)', border: '1px solid rgba(100,150,255,0.2)', color: '#6496ff', borderRadius: '8px', fontSize: '14px' }}>
              {statusMsg}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
