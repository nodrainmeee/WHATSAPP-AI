import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [apiKeyStatus, setApiKeyStatus] = useState<boolean>(false);
  const [whatsappStatus, setWhatsappStatus] = useState<string>('Vérification...');

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getApiKeyStatus().then((status: boolean) => setApiKeyStatus(status));
      window.electronAPI.checkWhatsappStatus().then((running: boolean) => setWhatsappStatus(running ? 'Détecté (Actif)' : 'Non trouvé'));
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '24px' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5f5f7', margin: 0 }}>Tableau de Bord</h1>
        <p style={{ fontSize: '14px', color: '#86868b', marginTop: '4px', margin: 0 }}>Supervision de l'assistante Léa et de l'environnement Windows.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#f5f5f7', margin: '0 0 8px 0' }}>Moteur Gemini (Léa)</h3>
          <p style={{ fontSize: '14px', margin: 0, color: apiKeyStatus ? '#4ade80' : '#f87171' }}>
            {apiKeyStatus ? 'Clé configurée & Prête' : 'Clé API manquante'}
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#f5f5f7', margin: '0 0 8px 0' }}>WhatsApp Desktop</h3>
          <p style={{ fontSize: '14px', margin: 0, color: whatsappStatus.includes('Détecté') ? '#4ade80' : '#fbbf24' }}>
            {whatsappStatus}
          </p>
        </div>

        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#f5f5f7', margin: '0 0 8px 0' }}>Mode d'exécution</h3>
          <p style={{ fontSize: '14px', margin: 0, color: '#6496ff' }}>Manuel (Copier/Coller)</p>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#d2d2d7', margin: '0 0 16px 0' }}>Dernières activités de Léa</h3>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <p style={{ color: '#86868b', fontSize: '14px' }}>Aucune activité récente. Importez un message dans l'onglet "Conversations" pour commencer.</p>
        </div>
      </div>
    </div>
  );
}
