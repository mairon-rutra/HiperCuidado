import React, { useState } from 'react';
import AccessibilityBar from './components/AccessibilityBar';
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import ClinicalDashboard from './pages/ClinicalDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSelectTheme = (enableDark) => {
    setIsDarkMode(enableDark);
    if (enableDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Menu/Barra de Acessibilidade com Dropdown de Tema */}
      <AccessibilityBar 
        isDarkMode={isDarkMode} 
        onSelectTheme={handleSelectTheme} 
      />

      <main className="flex-1" style={{ padding: 'clamp(12px, 3vw, 32px) clamp(8px, 2vw, 24px)', width: '100%', boxSizing: 'border-box' }}>
        {!user && (
          <Login 
            onLoginSuccess={(paciente) => setUser(paciente)} 
            onGoToClinical={() => setUser('clinical')} 
          />
        )}

        {user && user !== 'clinical' && (
          <PatientDashboard 
            paciente={user} 
            onLogout={() => setUser(null)} 
          />
        )}

        {user === 'clinical' && (
          <ClinicalDashboard 
            onBackToLogin={() => setUser(null)} 
          />
        )}
      </main>
    </div>
  );
}