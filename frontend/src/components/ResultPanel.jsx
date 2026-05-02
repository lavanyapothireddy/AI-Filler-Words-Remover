import React from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function ResultPanel({ result, onCopy, onUseAsInput }) {
  if (!result) return null;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.title}>Cleaned Text</span>
        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => onUseAsInput(result.cleaned)}>
            Use as Input
          </button>
          <button style={{ ...styles.btn, ...styles.btnAccent }} onClick={() => onCopy(result.cleaned)}>
            <FiCopy size={13} /> Copy
          </button>
        </div>
      </div>
      <div style={styles.textBox}>
        <p style={styles.text}>{result.cleaned}</p>
      </div>
      <div style={styles.diffSection}>
        <span style={styles.diffLabel}>What changed</span>
        <div style={styles.diffChips}>
          <span style={{ ...styles.chip, background: 'var(--danger-dim)', color: 'var(--danger)' }}>
            −{result.stats.words_removed} words
          </span>
          <span style={{ ...styles.chip, background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            {result.stats.reduction_percentage}% shorter
          </span>
          <span style={{ ...styles.chip, background: 'rgba(77,255,154,0.08)', color: 'var(--success)' }}>
            {result.stats.cleaned_words} words final
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.9rem 1.25rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface2)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    letterSpacing: '-0.01em',
    color: 'var(--accent)',
  },
  actions: { display: 'flex', gap: '0.5rem' },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: '5px 12px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border2)',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  btnAccent: {
    background: 'var(--accent)',
    color: 'var(--bg)',
    border: '1px solid var(--accent)',
  },
  textBox: {
    padding: '1.25rem',
    minHeight: '160px',
  },
  text: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    lineHeight: 1.8,
    color: 'var(--text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  diffSection: {
    padding: '0.75rem 1.25rem',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
    background: 'var(--surface2)',
  },
  diffLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  diffChips: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  chip: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    padding: '2px 10px',
    borderRadius: '20px',
    fontWeight: 500,
  },
};
