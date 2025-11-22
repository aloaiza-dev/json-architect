import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { JsonEditor } from './components/JsonEditor';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { AppProvider, useAppContext } from './contexts/AppContext';

const AppContent = () => {
  const { t } = useAppContext();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-200 selection:bg-brand-200 dark:selection:bg-brand-900 selection:text-brand-900 dark:selection:text-brand-100 transition-colors duration-300">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        {/* Hero Section containing the Tool */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t('hero.titleStart')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-500">{t('hero.titleEnd')}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
          
          <JsonEditor />
        </div>

        <Features />
        <HowItWorks />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;