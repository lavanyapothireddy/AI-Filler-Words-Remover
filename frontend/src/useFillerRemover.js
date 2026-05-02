import { useState, useCallback } from 'react';
import { analyzeText, removeFillers, getSuggestions } from '../utils/api';
import toast from 'react-hot-toast';

export function useFillerRemover() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [mode, setMode] = useState('balanced');
  const [loading, setLoading] = useState({ remove: false, analyze: false, suggest: false });
  const [activeTab, setActiveTab] = useState('editor'); // editor | result | suggestions

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return toast.error('Please enter some text first.');
    setLoading(l => ({ ...l, analyze: true }));
    try {
      const data = await analyzeText(inputText);
      setAnalysis(data);
    } catch (e) {
      toast.error('Analysis failed. Try again.');
    } finally {
      setLoading(l => ({ ...l, analyze: false }));
    }
  }, [inputText]);

  const handleRemove = useCallback(async () => {
    if (!inputText.trim()) return toast.error('Please enter some text first.');
    if (inputText.length > 5000) return toast.error('Text too long (max 5000 chars).');
    setLoading(l => ({ ...l, remove: true }));
    try {
      const data = await removeFillers(inputText, mode);
      setResult(data);
      setActiveTab('result');
      toast.success('Filler words removed!');
    } catch (e) {
      toast.error('Something went wrong. Check your connection.');
    } finally {
      setLoading(l => ({ ...l, remove: false }));
    }
  }, [inputText, mode]);

  const handleSuggest = useCallback(async () => {
    const textToAnalyze = result?.cleaned || inputText;
    if (!textToAnalyze.trim()) return toast.error('No text to analyze.');
    setLoading(l => ({ ...l, suggest: true }));
    try {
      const data = await getSuggestions(textToAnalyze);
      setSuggestions(data);
      setActiveTab('suggestions');
    } catch (e) {
      toast.error('Could not fetch suggestions.');
    } finally {
      setLoading(l => ({ ...l, suggest: false }));
    }
  }, [inputText, result]);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  }, []);

  const handleReset = useCallback(() => {
    setInputText('');
    setResult(null);
    setAnalysis(null);
    setSuggestions(null);
    setActiveTab('editor');
  }, []);

  return {
    inputText, setInputText,
    result, analysis, suggestions,
    mode, setMode,
    loading, activeTab, setActiveTab,
    handleAnalyze, handleRemove, handleSuggest,
    handleCopy, handleReset,
  };
}