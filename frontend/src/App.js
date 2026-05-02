import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import TextEditor from './components/TextEditor';
import ModeSelector from './components/ModeSelector';
import StatsBar from './components/StatsBar';
import ResultPanel from './components/ResultPanel';
import SuggestionsPanel from './components/SuggestionsPanel';
import { useFillerRemover } from './hooks/useFillerRemover';

const TABS = [
  { id: 'editor', label: 'Editor' },
  { id: 'result', label: 'Result' },
  { id: 'suggestions', label: 'Suggestions' },
];

const SAMPLE_TEXT = `So, um, basically what I'm trying to say is that, you know, at the end of the day, the project was actually kind of successful, right? I mean, honestly, we literally achieved most of our goals and, like, the team was really, very committed to making it work. But yeah, there were sort of some challenges along the way that we need to, um, address going forward.`;

export default function App() {
  const {
    inputText, setInputText,
    result, analysis, suggestions,
    mode, setMode,
    loading, activeTab, setActiveTab,
    handleAnalyze, handleRemove, handleSuggest,
    handleCopy, handleReset,
  } = useFillerRemover();

  return (
    <div style={styles.app}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f0f0f0',
            border: '1px solid #2e2e2e',
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.82rem',
          },
        }}
      />

      <div style={styles.container}>
        <Header />

        {/* Tab Navigation */}
        <div style={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              {t.id === 'result' && result && <span style={styles.dot} />}
              {t.id === 'suggestions' && suggestions && <span style={styles.dot} />}
            </button>
          ))}
        </div>

        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div style={styles.section}>
            <div style={styles.toolbar}>
              <ModeSelector mode={mode} setMode={setMode} />
              <div style={styles.toolbarRight}>
                {!inputText && (
                  <button style={styles.ghostBtn} onClick={() => setInputText(SAMPLE_TEXT)}>
                    Try sample text
                  </button>
                )}
                {inputText && (
                  <button style={styles.ghostBtn} onClick={handleReset}>
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <TextEditor
              text={inputText}
              onChange={setInputText}
              analysis={analysis}
              placeholder="Paste or type your text here to remove filler words..."
            />

            {analysis && <StatsBar analysis={analysis} />}

            <div style={styles.actions}>
              <button
                style={{ ...styles.btn, ...styles.btnSecondary }}
                onClick={handleAnalyze}
                disabled={loading.analyze || !inputText.trim()}
              >
                {loading.analyze ? 'Analyzing...' : '🔍 Analyze'}
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={handleRemove}
                disabled={loading.remove || !inputText.trim()}
              >
                {loading.remove ? 'Removing...' : '✂ Remove Fillers'}
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnGhost }}
                onClick={handleSuggest}
                disabled={loading.suggest || !inputText.trim()}
              >
                {loading.suggest ? 'Analyzing...' : '💡 Suggestions'}
              </button>
            </div>
          </div>
        )}

        {/* Result Tab */}
        {activeTab === 'result' && (
          <div style={styles.section}>
            {result ? (
              <>
                <StatsBar result={result} />
                <ResultPanel
                  result={result}
                  onCopy={handleCopy}
                  onUseAsInput={(text) => { setInputText(text); setActiveTab('editor'); }}
                />
                <button
                  style={{ ...styles.btn, ...styles.btnGhost, alignSelf: 'flex-start' }}
                  onClick={handleSuggest}
                  disabled={loading.suggest}
                >
                  {loading.suggest ? 'Analyzing...' : '💡 Get Suggestions for Cleaned Text'}
                </button>
              </>
            ) : (
              <div style={styles.empty}>
                <span style={styles.emptyIcon}>✂</span>
                <p style={styles.emptyText}>Remove fillers first to see the result here.</p>
                <button
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  onClick={() => setActiveTab('editor')}
                >
                  Go to Editor
                </button>
              </div>
            )}
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div style={styles.section}>
            {suggestions ? (
              <SuggestionsPanel suggestions={suggestions} />
            ) : (
              <div style={styles.empty}>
                <span style={styles.emptyIcon}>💡</span>
                <p style={styles.emptyText}>Get AI-powered writing suggestions by clicking "Suggestions" in the editor.</p>
                <button
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                  onClick={() => setActiveTab('editor')}
                >
                  Go to Editor
                </button>
              </div>
            )}
          </div>
        )}

        <footer style={styles.footer}>
          <span>Built with Claude AI</span>
          <span style={{ color: 'var(--text-dim)' }}>·</span>
          <span>Max 5,000 characters per request</span>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    justifyContent: 'center',
    padding: '0 1rem 3rem',
  },
  container: {
    width: '100%',
    maxWidth: '820px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    borderBottom: '1px solid var(--border)',
    padding: '0 0',
    marginTop: '0.5rem',
  },
  tab: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.82rem',
    padding: '0.75rem 1.25rem',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    transition: 'color 0.15s',
  },
  tabActive: {
    color: 'var(--accent)',
    borderBottomColor: 'var(--accent)',
  },
  dot: {
    width: 6, height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem 0',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  toolbarRight: { display: 'flex', gap: '0.5rem' },
  ghostBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    padding: '5px 12px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  actions: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
  },
  btn: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.85rem',
    padding: '0.7rem 1.4rem',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    letterSpacing: '-0.01em',
  },
  btnPrimary: {
    background: 'var(--accent)',
    color: 'var(--bg)',
    flex: 2,
  },
  btnSecondary: {
    background: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border2)',
    flex: 1,
  },
  btnGhost: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    flex: 1,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: '3rem', opacity: 0.3 },
  emptyText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    maxWidth: '300px',
    lineHeight: 1.7,
  },
  footer: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-dim)',
    paddingTop: '1.5rem',
    borderTop: '1px solid var(--border)',
    marginTop: '1rem',
  },
};
