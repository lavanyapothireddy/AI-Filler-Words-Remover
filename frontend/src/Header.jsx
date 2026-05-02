import React from 'react';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={styles.logoIcon}>✂</span>
        <span style={styles.logoText}>FillerCut</span>
        <span style={styles.badge}>AI</span>
      </div>
      <p style={styles.tagline}>Strip the noise. Keep the signal.</p>
    </header>
  );
}

const styles = {
  header: {
    padding: '2.5rem 2rem 2rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  logoIcon: {
    fontSize: '1.6rem',
    color: 'var(--accent)',
    lineHeight: 1,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.6rem',
    letterSpacing: '-0.03em',
    color: 'var(--text)',
  },
  badge: {
    background: 'var(--accent)',
    color: 'var(--bg)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    fontWeight: 500,
    padding: '2px 7px',
    borderRadius: '3px',
    letterSpacing: '0.05em',
    alignSelf: 'flex-start',
    marginTop: '2px',
  },
  tagline: {
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    letterSpacing: '0.02em',
  },
};