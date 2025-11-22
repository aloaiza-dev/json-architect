import React from 'react';
import { ShieldCheck, Zap, BrainCircuit } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

export const Features: React.FC = () => {
  const { t } = useAppContext();

  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />,
      title: t('features.secureTitle'),
      description: t('features.secureDesc')
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      title: t('features.instantTitle'),
      description: t('features.instantDesc')
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: t('features.aiTitle'),
      description: t('features.aiDesc')
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-xl hover:shadow-lg hover:border-brand-200 dark:hover:bg-slate-900 transition-all duration-300">
              <div className="bg-brand-50 dark:bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};