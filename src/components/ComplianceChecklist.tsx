import React, { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import { COMPLIANCE_CHECKLIST } from '../data/compliance';

const copy = {
  en: {
    heading: 'OPS CySec Core compliance matrix',
    description:
      'End-to-end governance that unifies OPS CySec Core with internationalization, accessibility, performance, and domain controls for the e-commerce and chat applications.',
  },
  es: {
    heading: 'Matriz de cumplimiento OPS CySec Core',
    description:
      'Gobernanza de extremo a extremo que une OPS CySec Core con controles de internacionalización, accesibilidad, rendimiento y dominio para las aplicaciones de comercio y chat.',
  },
};

const ComplianceChecklist: React.FC = () => {
  const { language } = useContext(GlobalContext);
  const sections = COMPLIANCE_CHECKLIST[language];
  const { heading, description } = copy[language];

  return (
    <section
      id="compliance-section"
      className="w-[min(75rem,_100%)] mx-auto mt-20 mb-24 px-4"
      aria-labelledby="compliance-heading"
    >
      <div className="text-center mb-12">
        <h2 id="compliance-heading" className="text-3xl font-bold text-[#12253f] dark:text-gray-100 mb-4">
          {heading}
        </h2>
        <p className="text-base text-[#3d4754] dark:text-gray-400 max-w-4xl mx-auto">
          {description}
        </p>
      </div>
      <div className="space-y-8">
        {sections.map((block) => (
          <article
            key={block.id}
            id={`compliance-${block.id}`}
            className="bg-white/80 dark:bg-dark-card border border-white/40 dark:border-white/10 rounded-3xl p-8 shadow-card-light dark:shadow-card-dark backdrop-blur-xl"
          >
            <header className="mb-6">
              <h3 className="text-2xl font-semibold text-primary dark:text-accent mb-2">
                {block.title}
              </h3>
              {block.summary && (
                <p className="text-sm text-[#3d4754] dark:text-gray-400">{block.summary}</p>
              )}
            </header>
            <div className="space-y-6">
              {block.clusters.map((cluster, clusterIndex) => (
                <section key={cluster.title ?? clusterIndex} className="space-y-3">
                  {cluster.title && (
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-[#12253f] dark:text-gray-200">
                      {cluster.title}
                    </h4>
                  )}
                  <ul className="space-y-3">
                    {cluster.items.map((item) => (
                      <li key={item.label} className="bg-white/60 dark:bg-white/5 rounded-2xl border border-white/40 dark:border-white/5 p-4">
                        <p className="text-sm font-semibold text-[#1f2b3a] dark:text-gray-100 mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm text-[#3d4754] dark:text-gray-300">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ComplianceChecklist;
