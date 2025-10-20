import type { Language } from '../../../types';
import type { KnowledgeHit, LocalIntelligenceResult, LocalIntent } from '../types';

const INTENT_KEYWORDS: Record<LocalIntent, RegExp[]> = {
  greeting: [/\bhello\b/i, /\bhi\b/i, /\bhey\b/i, /\bhol[a|i]\b/i],
  service_info: [/business operations/i, /contact center/i, /it support/i, /professional services/i],
  contact: [/contact/i, /reach/i, /support/i, /telefono/i, /llamar/i, /email/i],
  join: [/join/i, /apply/i, /careers/i, /trabajar/i],
  pricing: [/price/i, /cost/i, /tarifa/i, /pricing/i],
  policies: [/security/i, /compliance/i, /policy/i, /gdpr/i, /pci/i],
  unknown: [],
};

const classifyIntent = (text: string): LocalIntent => {
  const lower = text.toLowerCase();
  const orderedIntents: LocalIntent[] = ['greeting', 'service_info', 'contact', 'join', 'pricing', 'policies'];
  for (const intent of orderedIntents) {
    if (INTENT_KEYWORDS[intent].some((regex) => regex.test(lower))) {
      return intent;
    }
  }
  return 'unknown';
};

const buildAnswerFromKnowledge = (intent: LocalIntent, hit: KnowledgeHit, language: Language): string => {
  const { document, highlight } = hit;
  const ctaText = document.tags?.slice(0, 2).join(', ');
  if (language === 'es') {
    return [
      `**${document.title}**`,
      highlight,
      ctaText ? `Etiquetas clave: ${ctaText}.` : '',
      intent === 'contact'
        ? 'Para conectarte con OPS, utiliza el botón Contactar en la esquina inferior derecha o agenda una llamada.'
        : 'Explora más opciones en nuestro portal OPS o abre el menú de servicios para navegar por categorías.',
    ]
      .filter(Boolean)
      .join('\n\n');
  }
  return [
    `**${document.title}**`,
    highlight,
    ctaText ? `Key tags: ${ctaText}.` : '',
    intent === 'contact'
      ? 'To reach OPS experts, tap Contact in the floating actions or schedule a session from the Join modal.'
      : 'Browse additional OPS service details from the Services menu or the hero quick actions.',
  ]
    .filter(Boolean)
    .join('\n\n');
};

const buildFallbackAnswer = (intent: LocalIntent, language: Language): string | null => {
  switch (intent) {
    case 'greeting':
      return language === 'es'
        ? '¡Hola! Estoy aquí para ayudarte con los servicios de OPS. Pregunta sobre Operaciones, Contact Center, TI o Servicios Profesionales.'
        : 'Hello! I can help you explore OPS services—ask about Business Operations, the Contact Center, IT Support, or Professional Services.';
    case 'contact':
      return language === 'es'
        ? 'Puedes abrir el modal de Contacto o utilizar el botón de soporte para conectar con un especialista OPS.'
        : 'You can open the Contact modal or use the support button to connect with an OPS specialist.';
    case 'join':
      return language === 'es'
        ? 'Para unirte a OPS, abre el modal Únete y completa la solicitud. Nuestro equipo revisará tu perfil con supervisión humana.'
        : 'To join OPS, open the Join modal and submit your profile—our team will review it with human oversight.';
    case 'policies':
      return language === 'es'
        ? 'OPS aplica ciberseguridad integral: cifrado AES-256, monitoreo SIEM y cumplimiento PCI DSS/NIST. Consulta la sección Seguridad en la página principal para más detalles.'
        : 'OPS enforces full-stack security: AES-256 encryption, SIEM monitoring, and PCI DSS/NIST alignment. See the Security section on the main page for details.';
    case 'pricing':
      return language === 'es'
        ? 'Las tarifas se personalizan según el servicio y el SLA requerido. Agenda una sesión consultiva desde el modal Contacto para recibir una propuesta.'
        : 'Engagements are tailored to your SLA and service mix. Schedule a consult via the Contact modal to receive a custom proposal.';
    default:
      return null;
  }
};

export const runLocalIntelligence = (
  language: Language,
  sanitizedText: string,
  knowledge: KnowledgeHit | null,
): LocalIntelligenceResult => {
  const intent = classifyIntent(sanitizedText);
  if (knowledge) {
    return {
      handled: true,
      answer: buildAnswerFromKnowledge(intent, knowledge, language),
      intent,
    };
  }
  const fallback = buildFallbackAnswer(intent, language);
  if (fallback) {
    return {
      handled: true,
      answer: fallback,
      intent,
    };
  }
  return {
    handled: false,
    intent,
  };
};
