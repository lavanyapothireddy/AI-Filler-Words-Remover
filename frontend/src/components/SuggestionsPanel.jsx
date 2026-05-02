import React from 'react';

const TYPE_COLORS = {
  clarity: { bg: 'rgba(200,241,53,0.08)', color: 'var(--accent)' },
  structure: { bg: 'rgba(77,255,154,0.08)', color: 'var(--success)' },
  tone: { bg: 'rgba(255,184,77,0.08)', color: 'var(--warning)' },
  conciseness: { bg: 'var(--danger-dim)', color: 'var(--danger)' },
  default: { bg: 'var(--surface2)', color: 'var(--text-muted)' },
};

function ScoreMeter({ score }) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? 'var(--success)' : score >= 4 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={styles.meter}>
      <div style={{ ...styles.meterFill, width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function SuggestionsPanel({ suggestions }) {
  if (!suggestions) return null;
  const { suggestions: items = [], overall_score, summary } = suggestions;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div style={styles.scoreBlock}>
          <span style={styles.score}>{overall_score}<span style={styles.scoreMax}>/10</span></span>
          <div>
            <div style={styles.scoreLabel}>Clarity Score</div>
            <ScoreMeter score={overall_score} />
          </div>
        </div>
        <p style={styles.summary}>{summary}</p>
      </div>
      <div style={styles.list}>
        {items.map((item, i) => {
          const c = TYPE_COLORS[item.type?.toLowerCase()] || TYPE_COLORS.default;
          return (
            <div key={i} style={styles.card}>
              <div style={{ ...styles.tag, background: c.bg, color: c.color }}>
                {item.type || 'tip'}
              </div>
              <div style={styles.content}>
                <p style={styles.issue}>{item.issue}</p>
                <p style={styles.fix}>→ {item.fix}</p>
              </div>
            </div>
          );
        })}
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
    padding: '1.25rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface2)',
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scoreBlock: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  score: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 800,
    color: 'var(--accent)',
    lineHeight: 1,
    letterSpacing: '-0.04em',
  },
  scoreMax: {
    fontSize: '1.2rem',
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  scoreLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px',
  },
  meter: {
    width: '120px',
    height: '4px',
    background: 'var(--border2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  summary: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    flex: 1,
    lineHeight: 1.6,
  },
  list: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  card: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.9rem',
    background: 'var(--surface2)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    alignItems: 'flex-start',
  },
  tag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 500,
    padding: '3px 8px',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
    marginTop: '2px',
  },
  content: { flex: 1 },
  issue: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    color: 'var(--text)',
    fontWeight: 600,
    marginBottom: '0.3rem',
  },
  fix: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
};
