import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const HowItWorks: React.FC = () => {
  const { t } = useAppContext();

  const steps = [
    {
      num: "01",
      title: t('howItWorks.step1Title'),
      desc: t('howItWorks.step1Desc')
    },
    {
      num: "02",
      title: t('howItWorks.step2Title'),
      desc: t('howItWorks.step2Desc')
    },
    {
      num: "03",
      title: t('howItWorks.step3Title'),
      desc: t('howItWorks.step3Desc')
    }
  ];

  return (
    <section className="py-20 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t('howItWorks.title')}</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">{t('howItWorks.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
              )}
              <div className="w-16 h-16 bg-white dark:bg-brand-900/20 border-2 border-brand-200 dark:border-brand-500/30 rounded-full flex items-center justify-center text-xl font-bold text-brand-600 dark:text-brand-400 mb-6 backdrop-blur-sm shadow-sm dark:shadow-none z-10 transition-colors duration-300">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};