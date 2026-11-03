import { useState } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Conversations from './pages/Conversations';
import Memory from './pages/Memory';
import Settings from './pages/Settings';
import './theme/liquid-glass.css';

export default function App() {
  const [isAutomationActive, setIsAutomationActive] = useState(false);

  return (
    <HashRouter>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0c', color: '#f5f5f7', overflow: 'hidden' }}>
        <nav className="glass-panel" style={{ width: '240px', margin: '16px', padding: '16px', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(100,150,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(100,150,255,0.4)', color: '#6496ff', fontWeight: 'bold', fontSize: '20px' }}>
              L
            </div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>WhatsApp AI</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
            <NavItem to="/" label="Tableau de bord" />
            <NavItem to="/conversations" label="Conversations" />
            <NavItem to="/memory" label="Mémoire" />
            <NavItem to="/settings" label="Paramètres" />
          </div>

          <div style={{ marginTop: 'auto', padding: '16px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '12px', color: '#86868b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>Mode Automatisé</p>
            <button 
              onClick={() => setIsAutomationActive(!isAutomationActive)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                fontWeight: 500,
                cursor: 'pointer',
                border: isAutomationActive ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(34, 197, 94, 0.5)',
                backgroundColor: isAutomationActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                color: isAutomationActive ? '#f87171' : '#4ade80',
              }}
            >
              {isAutomationActive ? "DÉSACTIVER (Arrêt d'urgence)" : 'ACTIVER'}
            </button>
          </div>
        </nav>

        <main style={{ flex: 1, padding: '16px 16px 16px 0', overflowY: 'auto' }}>
          <div className="glass-panel" style={{ height: '100%', padding: '24px', boxSizing: 'border-box' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/conversations" element={<Conversations />} />
              <Route path="/memory" element={<Memory />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink 
      to={to} 
      style={({ isActive }) => ({
        padding: '12px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: isActive ? '#ffffff' : '#86868b',
        transition: 'all 0.2s'
      })}
    >
      {label}
    </NavLink>
  );
}
