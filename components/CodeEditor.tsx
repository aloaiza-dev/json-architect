import React, { useRef, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  placeholder?: string;
  errorLine?: number | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  onPaste,
  readOnly = false, 
  placeholder,
  errorLine 
}) => {
  const { theme } = useAppContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Sync scrolling between textarea and pre
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Tokenize and highlight JSON
  const highlightedCode = useMemo(() => {
    // FIX: Added px-4 to align placeholder with input padding
    if (!value) return <div className="text-slate-400 italic px-4">{placeholder}</div>;

    const lines = value.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Regex to match JSON tokens
      const tokenRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[\[\]\{\},:])/g;
      
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = tokenRegex.exec(line)) !== null) {
        // Push text before match
        if (match.index > lastIndex) {
          parts.push(
            <span key={`${lineIndex}-${lastIndex}`} className="text-slate-800 dark:text-slate-300">
              {line.substring(lastIndex, match.index)}
            </span>
          );
        }

        const text = match[0];
        let className = "text-slate-500 dark:text-slate-500"; // Punctuation default

        // Refined Colors for better distinction
        if (text.startsWith('"')) {
          if (text.trim().endsWith(':')) {
            // JSON Key - Violet
            className = "text-violet-700 dark:text-violet-400 font-semibold"; 
          } else {
            // JSON String - Emerald
            className = "text-emerald-600 dark:text-emerald-400";
          }
        } else if (/^(true|false|null)$/.test(text)) {
          // Booleans/Null - Rose
          className = "text-rose-600 dark:text-rose-400 font-medium";
        } else if (/^-?\d/.test(text)) {
          // Numbers - Amber
          className = "text-amber-600 dark:text-amber-400";
        }

        parts.push(
          <span key={`${lineIndex}-${match.index}`} className={className}>
            {text}
          </span>
        );

        lastIndex = tokenRegex.lastIndex;
      }

      // Push remaining text
      if (lastIndex < line.length) {
        parts.push(
          <span key={`${lineIndex}-end`} className="text-slate-800 dark:text-slate-300">
            {line.substring(lastIndex)}
          </span>
        );
      }

      // If line is empty, render a break to maintain height
      const content = parts.length > 0 ? parts : <br />;

      return (
        <div 
          key={lineIndex} 
          className={`relative px-4 ${errorLine === lineIndex ? 'bg-red-500/20 dark:bg-red-500/30' : ''}`}
        >
          {errorLine === lineIndex && (
             <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
          )}
          {content}
        </div>
      );
    });
  }, [value, errorLine, placeholder]);

  return (
    <div className="relative w-full h-full bg-white dark:bg-slate-950 overflow-hidden font-mono text-sm">
      {/* Syntax Highlighting Layer (Background) */}
      <pre
        ref={preRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full m-0 py-4 pointer-events-none overflow-hidden whitespace-pre leading-6"
        style={{ tabSize: 2 }}
      >
        {highlightedCode}
      </pre>

      {/* Input Layer (Foreground) */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onPaste={onPaste}
        onScroll={handleScroll}
        readOnly={readOnly}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        // Added selection:text-transparent to avoid visual artifacts during selection
        className={`absolute inset-0 w-full h-full m-0 py-4 px-4 resize-none bg-transparent border-0 focus:ring-0 text-transparent caret-slate-900 dark:caret-slate-100 selection:text-transparent leading-6 whitespace-pre custom-scrollbar outline-none ${readOnly ? 'cursor-text' : ''}`}
        style={{ tabSize: 2 }}
      />
    </div>
  );
};