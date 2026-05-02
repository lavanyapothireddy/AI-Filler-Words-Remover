import React from 'react';

const MODES = [
  { id: 'light', label: 'Light', desc: 'Only obvious fillers (um, uh, like)' },
  { id: 'balanced', label: 'Balanced', desc: 'Common fillers + hedging words' },
  { id: 'strict', label: 'Strict', desc: 'Aggressive cleanup, max clarity' },
];

export default function ModeSelector({ mode, setMode }) {
  return (
    <div style={styles.container}>
      <span style={styles.label}>Mode</span>
      <div style={styles.buttons}>
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            title={m.desc}
            style={{
              ...styles.btn,
              ...(mode === m.id ? styles.btnActive : {}),
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  buttons: {
    display: 'flex',
    gap: '0.3rem',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '3px',
  },
  btn: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.78rem',
    padding: '5px 14px',
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    letterSpacing: '-0.01em',
  },
  btnActive: {
    background: 'var(--accent)',
    color: 'var(--bg)',
  },
};