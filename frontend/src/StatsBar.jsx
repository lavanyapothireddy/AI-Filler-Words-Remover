import React from 'react';

export default function StatsBar({ analysis, result }) {
  const stats = result?.stats || (analysis ? {
    original_words: analysis.word_count,
    fillers_detected: analysis.filler_count,
    filler_percentage: analysis.filler_percentage,
  } : null);

  if (!stats) return null;

  const items = result ? [
    { label: 'Original', value: stats.original_words, unit: 'words' },
    { label: 'Cleaned', value: stats.cleaned_words, unit: 'words', highlight: true },
    { label: 'Removed', value: stats.words_removed, unit: 'words', danger: stats.words_removed > 0 },
    { label: 'Reduced', value: `${stats.reduction_percentage}%`, accent: true },
  ] : [
    { label: 'Words', value: stats.original_words },
    { label: 'Fillers Found', value: stats.fillers_detected, danger: stats.fillers_detected > 0 },
    { label: 'Filler Rate', value: `${stats.filler_percentage}%`, danger: stats.filler_percentage > 10 },
  ];

  return (
    <div style={styles.bar}>
      {items.map((item, i) => (
        <div key={i} style={styles.stat}>
          <span style={{
            ...styles.value,
            ...(item.highlight ? styles.valueHighlight : {}),
            ...(item.danger && item.value > 0 ? styles.valueDanger : {}),
            ...(item.accent ? styles.valueAccent : {}),
          }}>
            {item.value}
          </span>
          <span style={styles.label}>
            {item.label}{item.unit ? ` ${item.unit}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  bar: {
    display: 'flex',
    gap: '0',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  stat: {
    flex: 1,
    padding: '0.9rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
    borderRight: '1px solid var(--border)',
  },
  value: {
    fontFamily: 'var(--font-mono)',
    fontSize: '1.3rem',
    fontWeight: 500,
    color: 'var(--text)',
    lineHeight: 1,
  },
  valueHighlight: { color: 'var(--success)' },
  valueDanger: { color: 'var(--danger)' },
  valueAccent: { color: 'var(--accent)' },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
};