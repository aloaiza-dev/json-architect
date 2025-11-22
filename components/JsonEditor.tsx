import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Copy, Check, Trash2, AlertCircle, Sparkles, FileUp, ArrowRightLeft, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './Button';
import { repairJsonWithAi } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';
import { CodeEditor } from './CodeEditor';

export const JsonEditor: React.FC = () => {
  const { t } = useAppContext();
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestInputRef = useRef(input);

  // Keep a ref to the latest input for async operations like paste handling
  useEffect(() => {
    latestInputRef.current = input;
  }, [input]);

  // Helper to calculate line number from index
  const getLineFromIndex = (text: string, index: number) => {
    if (!text) return 0;
    return text.substring(0, index).split('\n').length - 1;
  };

  const validateAndFormat = useCallback((jsonString: string, minify = false) => {
    if (!jsonString.trim()) {
      setOutput('');
      setError(null);
      setErrorLine(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, minify ? 0 : 2);
      setOutput(formatted);
      setError(null);
      setErrorLine(null);
    } catch (err: any) {
      const msg = err.message || t('editor.errorInvalid');
      setError(msg);
      setOutput(''); 
      
      // Try to find error position
      // Chrome/V8: "Unexpected token } in JSON at position 45"
      const posMatch = msg.match(/position (\d+)/);
      
      // Firefox: "JSON.parse: unexpected character at line 1 column 46"
      const lineMatch = msg.match(/line (\d+)/);
      
      if (posMatch) {
        const index = parseInt(posMatch[1], 10);
        setErrorLine(getLineFromIndex(jsonString, index));
      } else if (lineMatch) {
        // Firefox gives 1-based line number directly
        setErrorLine(parseInt(lineMatch[1], 10) - 1);
      } else {
        // Fallback if position isn't clear
        setErrorLine(null);
      }
    }
  }, [t]);

  const handleInputChange = (newValue: string) => {
    setInput(newValue);
    // We'll clear error state but not output to keep UI clean
    if (error) {
      setError(null);
      setErrorLine(null);
    }
  };

  const handlePaste = () => {
    // Wait for the paste event to propagate to state (via onChange)
    // Then trigger validation/formatting on the new content
    setTimeout(() => {
      validateAndFormat(latestInputRef.current, false);
    }, 50);
  };

  const handleFormat = () => validateAndFormat(input, false);
  const handleMinify = () => validateAndFormat(input, true);

  const handleRepair = async () => {
    setIsRepairing(true);
    try {
      const fixed = await repairJsonWithAi(input);
      setInput(fixed);
      validateAndFormat(fixed, false);
    } catch (e) {
      setError(t('editor.errorRepairFailed'));
    } finally {
      setIsRepairing(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
    setErrorLine(null);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      // Auto-format on upload
      setTimeout(() => validateAndFormat(text, false), 100);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden flex flex-col h-[80vh] min-h-[600px] transition-colors duration-300">
      {/* Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Button onClick={handleFormat} icon={<Maximize2 className="w-4 h-4"/>}>{t('editor.beautify')}</Button>
          <Button onClick={handleMinify} variant="secondary" icon={<Minimize2 className="w-4 h-4"/>}>{t('editor.minify')}</Button>
          <Button 
            onClick={handleRepair} 
            variant="ai" 
            disabled={!input || !error}
            isLoading={isRepairing}
            icon={<Sparkles className="w-4 h-4"/>}
            title={t('editor.repairTooltip')}
          >
            {t('editor.repair')}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept=".json,.txt"
            onChange={handleFileUpload}
          />
          <Button 
            variant="ghost" 
            onClick={() => fileInputRef.current?.click()}
            icon={<FileUp className="w-4 h-4"/>}
          >
            {t('editor.upload')}
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleClear}
            icon={<Trash2 className="w-4 h-4"/>}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            {t('editor.clear')}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Input Pane */}
        <div className="flex-1 flex flex-col min-h-0 relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 group transition-colors duration-300">
          <div className="absolute top-2 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-900/80 px-2 py-1 rounded border border-slate-200 dark:border-slate-800">
            {t('editor.inputLabel')}
          </div>
          
          <CodeEditor 
            value={input}
            onChange={handleInputChange}
            onPaste={handlePaste}
            placeholder={t('editor.inputPlaceholder')}
            errorLine={errorLine}
          />

          {error && (
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-red-50/95 dark:bg-red-950/90 border-t border-red-200 dark:border-red-900/50 p-2 text-red-700 dark:text-red-200 text-xs font-mono flex items-center gap-2 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Middle Action (Mobile only usually, but here visually separated) */}
        <div className="hidden md:flex flex-col justify-center items-center w-0 z-10">
          <div className="absolute bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 shadow-sm transition-colors duration-300">
             <ArrowRightLeft className="w-4 h-4" />
          </div>
        </div>

        {/* Output Pane */}
        <div className="flex-1 flex flex-col min-h-0 relative group bg-slate-50/50 dark:bg-slate-950/50 transition-colors duration-300">
           <div className="absolute top-2 right-3 z-10 flex items-center gap-2">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-900/80 px-2 py-1 rounded pointer-events-none border border-slate-200 dark:border-slate-800">
                {t('editor.outputLabel')}
              </span>
              <button 
                onClick={handleCopy}
                className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                title={t('editor.copyTitle')}
              >
                {copied ? <Check className="w-4 h-4 text-green-500 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
           </div>
           
           <CodeEditor 
             value={output}
             readOnly={true}
             placeholder={t('editor.outputPlaceholder')}
           />
        </div>
      </div>
    </div>
  );
};