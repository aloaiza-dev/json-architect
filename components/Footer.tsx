import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const Footer: React.FC = () => {
  const { t } = useAppContext();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 dark:text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} {t('footer.rights')} {t('footer.builtWith')}
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{t('footer.privacy')}</a>
          <a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{t('footer.terms')}</a>
          <a href="https://github.com" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">{t('footer.github')}</a>
        </div>
      </div>
    </footer>
  );
};