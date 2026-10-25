import React, { useState, useEffect, useRef } from 'react';

export default function AccessibilityBar({ isDarkMode, onSelectTheme }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '16px clamp(12px, 4vw, 24px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
      
      <div style={{ fontSize: '13px', fontWeight: 'bold', opacity: 0.8 }}>
        Diario Digital de Saude
      </div>

      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ 
            padding: '10px 18px', 
            fontSize: '12px', 
            fontWeight: 'bold', 
            borderRadius: '14px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--bg-color)', 
            color: 'var(--text-main)', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)'
          }}
        >
          <span>Tema: {isDarkMode ? 'Escuro' : 'Claro'}</span>
          <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
        </button>

        {dropdownOpen && (
          <div style={{ 
            position: 'absolute', 
            right: 0, 
            marginTop: '8px', 
            width: '160px', 
            background: 'var(--card-bg)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '16px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)', 
            zIndex: 50,
            overflow: 'hidden',
            padding: '6px'
          }}>
            <button
              onClick={() => { onSelectTheme(false); setDropdownOpen(false); }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                background: !isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'block'
              }}
            >
              Modo Claro
            </button>
            <button
              onClick={() => { onSelectTheme(true); setDropdownOpen(false); }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                background: isDarkMode ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: 'var(--text-main)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'block',
                marginTop: '2px'
              }}
            >
              Modo Escuro
            </button>
          </div>
        )}
      </div>

    </div>
  );
}