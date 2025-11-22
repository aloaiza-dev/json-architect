import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export const FAQ: React.FC = () => {
  const { t } = useAppContext();

  const faqs = [
    {
      q: t('faq.q1'),
      a: t('faq.a1')
    },
    {
      q: t('faq.q2'),
      a: t('faq.a2')
    },
    {
      q: t('faq.q3'),
      a: t('faq.a3')
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 text-center">{t('faq.title')}</h2>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900/30 overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
              <div className="p-4 md:p-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between items-center">
                  {item.q}
                </h3>
                <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};