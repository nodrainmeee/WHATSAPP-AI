import { useState, useEffect } from 'react';

export default function Memory() {
  const [selectedContact, setSelectedContact] = useState('contact_1');
  const [memories, setMemories] = useState<string[]>([]);
  const [newFact, setNewFact] = useState('');

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getContactMemory(selectedContact).then((res) => {
        if (res.success && res.data) setMemories(res.data);
      });
    }
  }, [selectedContact]);

  const handleAddFact = async () => {
    if (!newFact.trim()) return;
    const updated = [newFact.trim(), ...memories];
    setMemories(updated);
    setNewFact('');
    await window.electronAPI.updateContactMemory(selectedContact, updated);
  };

  const handleDeleteFact = async (index: number) => {
    const updated = memories.filter((_, i) => i !== index);
    setMemories(updated);
    await window.electronAPI.updateContactMemory(selectedContact, updated);
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '24px' }}>
      <div style={{ width: '30%', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#d2d2d7' }}>Contacts</h2>
        <button 
          onClick={() => setSelectedContact('contact_1')}
          style={{ width: '100%', textAlign: 'left', padding: '12px', borderRadius: '8px', border: '1px solid rgba(100,150,255,0.3)', backgroundColor: 'rgba(100,150,255,0.15)', color: '#fff', cursor: 'pointer' }}
        >
          <div style={{ fontWeight: 500 }}>Alice</div>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#d2d2d7', margin: '0 0 16px 0' }}>Mémoire contextuelle de Léa</h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input 
            type="text"
            value={newFact}
            onChange={(e) => setNewFact(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFact()}
            placeholder="Ajouter un souvenir/fait sur ce contact..."
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px', color: '#f5f5f7' }}
          />
          <button 
            onClick={handleAddFact}
            style={{ padding: '10px 24px', backgroundColor: 'rgba(100,150,255,0.2)', color: '#6496ff', border: '1px solid rgba(100,150,255,0.4)', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
          >
            Ajouter
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {memories.length === 0 ? (
            <p style={{ color: '#86868b', textAlign: 'center', marginTop: '40px' }}>Aucun souvenir enregistré.</p>
          ) : (
            memories.map((fact, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <span style={{ color: '#f5f5f7', fontSize: '14px' }}>{fact}</span>
                <button 
                  onClick={() => handleDeleteFact(index)}
                  style={{ color: '#f87171', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
