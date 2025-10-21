import type { Language } from '../types';

export interface ChecklistItem {
  label: string;
  description: string;
}

export interface ChecklistCluster {
  title?: string;
  items: ChecklistItem[];
}

export interface ChecklistBlock {
  id: string;
  title: string;
  summary?: string;
  clusters: ChecklistCluster[];
}

export const COMPLIANCE_CHECKLIST: Record<Language, ChecklistBlock[]> = {
  en: [
    {
      id: 'ops-cysec-core',
      title: 'OPS CySec Core guardrails',
      summary:
        'Detailed runbooks and historical changes live in OPS-cysec-core-runbook.md at the repository root. Access is controlled to protect sensitive operational data.',
      clusters: [
        {
          items: [
            {
              label: 'Runbook location',
              description:
                'Consult OPS-cysec-core-runbook.md for the Identify→Recover lifecycle, supporting pillars, and domain specifics.',
            },
            {
              label: 'Access procedure',
              description:
                'Request approval from the OPS security lead before sharing the runbook. Distribute on a need-to-know basis only.',
            },
            {
              label: 'Change management',
              description:
                'Document updates in Git commits referencing the runbook to maintain traceability.',
            },
          ],
        },
      ],
    },
    {
      id: 'public-overview',
      title: 'Public overview',
      summary:
        'High-level commitments that can remain visible without exposing sensitive implementation details.',
      clusters: [
        {
          items: [
            {
              label: 'NIST & PCI alignment',
              description:
                'OPS follows the Identify→Recover lifecycle with PCI DSS guardrails. Full mappings reside in the restricted runbook.',
            },
            {
              label: 'Internationalization & accessibility',
              description:
                'English/Spanish experiences honor WCAG 2.2 AA and PWA readiness. Implementation specifics are tracked privately.',
            },
            {
              label: 'Cloud-native operations',
              description:
                'Deployments rely on Cloudflare edge services with observability and incident response loops.',
            },
          ],
        },
      ],
    },
  ],
  es: [
    {
      id: 'ops-cysec-core',
      title: 'Controles OPS CySec Core',
      summary:
        'Los runbooks detallados y el historial viven en OPS-cysec-core-runbook.md en la raíz del repositorio. El acceso es restringido para proteger datos sensibles.',
      clusters: [
        {
          items: [
            {
              label: 'Ubicación del runbook',
              description:
                'Consulte OPS-cysec-core-runbook.md para el ciclo Identificar→Recuperar, pilares de soporte y dominios específicos.',
            },
            {
              label: 'Procedimiento de acceso',
              description:
                'Solicite aprobación al líder de seguridad de OPS antes de compartir el runbook. Distribuir solo con necesidad.',
            },
            {
              label: 'Gestión de cambios',
              description:
                'Documente las actualizaciones en commits de Git referenciando el runbook para mantener trazabilidad.',
            },
          ],
        },
      ],
    },
    {
      id: 'public-overview',
      title: 'Visión pública',
      summary:
        'Compromisos de alto nivel que pueden mostrarse sin revelar detalles de implementación sensibles.',
      clusters: [
        {
          items: [
            {
              label: 'Alineación NIST y PCI',
              description:
                'OPS sigue el ciclo Identificar→Recuperar con controles PCI DSS. Los mapeos completos están en el runbook restringido.',
            },
            {
              label: 'Internacionalización y accesibilidad',
              description:
                'Las experiencias EN/ES cumplen WCAG 2.2 AA y preparación PWA. Los detalles de implementación se mantienen en privado.',
            },
            {
              label: 'Operaciones cloud-native',
              description:
                'Las implementaciones usan servicios edge de Cloudflare con observabilidad y respuesta a incidentes.',
            },
          ],
        },
      ],
    },
  ],
};
