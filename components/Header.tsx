import React from 'react';
import { FileJson, Github, Moon, Sun, Languages } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, t } = useAppContext();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-600 rounded-lg shadow-md">
              <FileJson className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              JSON<span className="text-brand-600 dark:text-brand-400">{t('header.titleSuffix')}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Language Toggle */}
             <button
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle Language"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-white transition-colors p-2"
              aria-label={t('header.githubLabel')}
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};