import React, { useMemo } from 'react';

function HighlightedText({ text, fillers }) {
  const segments = useMemo(() => {
    if (!fillers || fillers.length === 0) return [{ text, highlight: false }];
    const parts = [];
    let cursor = 0;
    for (const f of fillers) {
      if (f.start > cursor) parts.push({ text: text.slice(cursor, f.start), highlight: false });
      parts.push({ text: text.slice(f.start, f.end), highlight: true });
      cursor = f.end;
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor), highlight: false });
    return parts;
  }, [text, fillers]);

  return (
    <div style={styles.highlighted}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark key={i} style={styles.mark}>{seg.text}</mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </div>
  );
}

export default function TextEditor({ text, onChange, analysis, placeholder, readOnly = false }) {
  const charCount = text.length;
  const limit = 5000;
  const nearLimit = charCount > limit * 0.85;

  return (
    <div style={styles.wrapper}>
      {readOnly && analysis?.fillers ? (
        <HighlightedText text={text} fillers={analysis.fillers} />
      ) : (
        <textarea
          style={styles.textarea}
          value={text}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Paste or type your text here...'}
          readOnly={readOnly}
          maxLength={limit}
          spellCheck={false}
        />
      )}
      <div style={styles.footer}>
        <span style={styles.hint}>
          {analysis?.filler_count > 0
            ? `⚠ ${analysis.filler_count} filler words detected`
            : text ? '✓ No fillers detected' : ''}
        </span>
        <span style={{ ...styles.count, ...(nearLimit ? styles.countWarn : {}) }}>
          {charCount} / {limit}
        </span>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  textarea: {
    flex: 1,
    width: '100%',
    padding: '1.25rem',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    lineHeight: 1.75,
    color: 'var(--text)',
    minHeight: '280px',
  },
  highlighted: {
    flex: 1,
    padding: '1.25rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    lineHeight: 1.75,
    color: 'var(--text)',
    minHeight: '280px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  mark: {
    background: 'var(--danger-dim)',
    color: 'var(--danger)',
    borderRadius: '2px',
    padding: '0 2px',
    border: '1px solid rgba(255,77,77,0.25)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 1.25rem',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface2)',
  },
  hint: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--danger)',
  },
  count: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-dim)',
  },
  countWarn: { color: 'var(--warning)' },
};