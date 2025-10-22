# OPS CySec Core Runbook (Internal)

This document archives the full compliance checklist that OPS Online Support previously rendered on the public site. Treat this information as sensitive and avoid publishing it directly in client-facing interfaces.

```ts
export const COMPLIANCE_CHECKLIST: Record<Language, ChecklistBlock[]> = {
  en: [
    {
      id: 'ops-cysec-core',
      title: 'OPS CySec Core',
      summary: 'Unified OPS Cybersecurity Core aligning NIST CSF, CISA Cyber Essentials, and PCI DSS 4.0.',
      clusters: [
        {
          items: [
            {
              label: 'Identify',
              description: 'Maintain asset inventory, risk tiers, and supply-chain attestations.',
            },
            {
              label: 'Protect',
              description: 'Enforce MFA, least privilege, and AES-256 encryption for data in transit and at rest.',
            },
            {
              label: 'Detect',
              description: 'Stream SIEM analytics, baseline anomalies, and schedule penetration drills.',
            },
            {
              label: 'Respond',
              description: 'Document incident response runbooks, forensics steps, and communication paths.',
            },
            {
              label: 'Recover',
              description: 'Track MTTR/MTTD, validate continuity plans, and improve controls after incidents.',
            },
          ],
        },
      ],
    },
    {
      id: 'foundation',
      title: 'Foundation (Both apps)',
      summary: 'Shared baseline for the e-commerce and chat surfaces.',
      clusters: [
        {
          items: [
            {
              label: 'Product brief',
              description: 'Capture goals, KPIs, supported devices/bandwidth, EN/ES locales, and WCAG 2.2 AA targets.',
            },
            {
              label: 'Design system & tokens',
              description: 'Centralize color, typography, and spacing tokens with light/dark, motion, and RTL support.',
            },
            {
              label: 'Routing & URLs',
              description: 'Define canonical URLs, trailing-slash policy, and locale routing via path or subdomain.',
            },
            {
              label: 'State model',
              description: 'Map client versus server state, including optimistic updates and rollback strategies.',
            },
            {
              label: 'Time & currency',
              description: 'Store timestamps in UTC, render with Intl APIs, and use integer cents for money.',
            },
          ],
        },
      ],
    },
    {
      id: 'internationalization',
      title: 'Internationalization (i18n/l10n)',
      summary: 'Resilient localization stack for English and Spanish.',
      clusters: [
        {
          items: [
            {
              label: 'Locale detection',
              description: 'Prioritize URL param, then user preference, then Accept-Language headers.',
            },
            {
              label: 'Translation catalog',
              description: 'Maintain ICU-friendly keys with plural/date/number formatting guidance.',
            },
            {
              label: 'Script/RTL support',
              description: 'Validate fonts, bidirectional layout, and text truncation or hyphenation rules.',
            },
            {
              label: 'Number/currency formats',
              description: 'Support Ecuadorian Spanish separators and multi-currency display conventions.',
            },
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      title: 'Accessibility (a11y)',
      summary: 'WCAG 2.2 AA compliance with keyboard-first ergonomics.',
      clusters: [
        {
          items: [
            {
              label: 'Semantics',
              description: 'Provide landmarks, heading order, labels, and persistent focus styling.',
            },
            {
              label: 'Keyboard flows',
              description: 'Ensure logical tab order, escape-to-close patterns, and skip links.',
            },
            {
              label: 'Contrast & motion',
              description: 'Meet contrast ratios and respect reduced-motion preferences.',
            },
            {
              label: 'Live regions',
              description: 'Announce cart updates, chat replies, and other dynamic changes.',
            },
          ],
        },
      ],
    },
    {
      id: 'performance',
      title: 'Performance (Core Web Vitals)',
      summary: 'Mobile-first budgets for dual app experience.',
      clusters: [
        {
          items: [
            {
              label: 'Budgets',
              description: 'Keep LCP under 2.5s, CLS under 0.1, and INP under 200ms on mobile.',
            },
            {
              label: 'Code splitting',
              description: 'Lazy-load by route and defer heavy modules until interaction.',
            },
            {
              label: 'Images',
              description: 'Deliver responsive srcset assets in AVIF/WebP with intrinsic sizing.',
            },
            {
              label: 'Resource hints',
              description: 'Use preload/modulepreload/prefetch/fetchpriority for critical paths.',
            },
            {
              label: 'Caching',
              description: 'Ship hashed static assets, CDN caching, and ETag-backed APIs.',
            },
          ],
        },
      ],
    },
    {
      id: 'pwa',
      title: 'PWA & Service Worker',
      summary: 'Offline-first readiness across surfaces.',
      clusters: [
        {
          items: [
            {
              label: 'Manifest',
              description: 'Define names, icons, theme colors, and display modes.',
            },
            {
              label: 'SW lifecycle',
              description: 'Version install/activate flow with safe updates.',
            },
            {
              label: 'Caching strategies',
              description: 'Precache the app shell and mix stale-while-revalidate, network-first, and cache-first policies.',
            },
            {
              label: 'Offline & queueing',
              description: 'Provide fallback pages and retry queues for orders or messages.',
            },
            {
              label: 'Push notifications',
              description: 'Offer opt-in UX with channel topics for orders and chat.',
            },
            {
              label: 'Update UX',
              description: 'Notify users when a new service worker is available.',
            },
          ],
        },
      ],
    },
    {
      id: 'security-privacy',
      title: 'Security & Privacy (OPS Core)',
      summary: 'Edge-to-cloud protections for data and sessions.',
      clusters: [
        {
          items: [
            {
              label: 'Transport',
              description: 'Enforce HTTPS with HSTS and modern TLS suites.',
            },
            {
              label: 'CSP',
              description: 'Apply strict CSP with nonces and SRI for third-party assets.',
            },
            {
              label: 'Isolation & policies',
              description: 'Set COOP, COEP, CORP, Referrer-Policy, and minimal Permissions-Policy.',
            },
            {
              label: 'Cookies & auth',
              description: 'Use Secure, HttpOnly, SameSite cookies plus passkeys and session rotation.',
            },
            {
              label: 'Injection/XSS',
              description: 'Validate inputs, sanitize server responses, and adopt Trusted Types when templating.',
            },
            {
              label: 'CORS & signed URLs',
              description: 'Limit CORS scopes, sign webhooks/URLs, and centralize secrets in Cloudflare.',
            },
            {
              label: 'Privacy',
              description: 'Collect minimal data, gate consent, and enforce retention windows.',
            },
          ],
        },
      ],
    },
    {
      id: 'edge-data',
      title: 'Edge & Data (Cloudflare)',
      summary: 'Cloudflare services orchestrated for data locality.',
      clusters: [
        {
          items: [
            {
              label: 'Workers',
              description: 'Route /api/* to versioned Workers with health probes.',
            },
            {
              label: 'D1 (SQLite)',
              description: 'Design schema, migrations, and indexes for predictable queries.',
            },
            {
              label: 'R2 (object storage)',
              description: 'Store media with lifecycle rules and versioning.',
            },
            {
              label: 'KV (key–value)',
              description: 'Keep feature flags and lightweight dictionaries.',
            },
            {
              label: 'Durable Objects',
              description: 'Coordinate chat rooms, presence, and rate limits.',
            },
            {
              label: 'Queues/CRON',
              description: 'Retry webhooks, settlements, and digest jobs.',
            },
            {
              label: 'WAF/Rate limits',
              description: 'Apply per-user throttles, bot defenses, and allow/deny lists.',
            },
          ],
        },
      ],
    },
    {
      id: 'observability-quality',
      title: 'Observability & Quality',
      summary: 'Continuous insight across performance and operations.',
      clusters: [
        {
          items: [
            {
              label: 'RUM',
              description: 'Track real-user LCP, INP, and CLS per route with dashboards.',
            },
            {
              label: 'Logs/metrics/traces',
              description: 'Emit structured logs with error IDs and latency alerts.',
            },
            {
              label: 'Testing',
              description: 'Cover unit, accessibility, e2e, and smoke flows on deploy.',
            },
            {
              label: 'Supply chain',
              description: 'Maintain lockfiles, dependency review, and automation like Renovate.',
            },
            {
              label: 'SLOs & runbooks',
              description: 'Define availability targets and incident/rollback guides.',
            },
          ],
        },
      ],
    },
    {
      id: 'ecommerce',
      title: 'E-commerce — Domain specifics',
      summary: 'Dedicated controls for catalog, payments, and post-purchase.',
      clusters: [
        {
          title: 'Catalog & content',
          items: [
            {
              label: 'Product data',
              description: 'Provide names, variants, and accessible imagery.',
            },
            {
              label: 'Structured data',
              description: 'Emit Product, Offer, AggregateRating, and BreadcrumbList schema.',
            },
            {
              label: 'Discovery',
              description: 'Deliver search, filters, sorting, and graceful empty/404 states.',
            },
          ],
        },
        {
          title: 'Cart & checkout',
          items: [
            {
              label: 'Cart persistence',
              description: 'Sync IndexedDB and server carts with login merge.',
            },
            {
              label: 'Pricing',
              description: 'Configure VAT/IVA, shipping tiers, and promotions.',
            },
            {
              label: 'Address & delivery',
              description: 'Use consented geolocation, address validation, and delivery notes.',
            },
            {
              label: 'Payments',
              description: 'Offer regional (DataFast, Kushki, PayPhone) and global (Stripe, Adyen, PayPal) rails plus Payment Request API.',
            },
            {
              label: 'SCA/3DS',
              description: 'Support step-up flows with clear decline messaging.',
            },
            {
              label: 'Receipts/invoices',
              description: 'Send email receipts, downloadable PDFs, and unique order IDs with timestamps.',
            },
          ],
        },
        {
          title: 'Fraud, risk & compliance',
          items: [
            {
              label: 'Velocity & device checks',
              description: 'Score cards, accounts, and device patterns.',
            },
            {
              label: 'Webhooks',
              description: 'Sign events with HMAC and enforce idempotency.',
            },
            {
              label: 'PCI scope',
              description: 'Tokenize payments and keep PAN data off-platform.',
            },
            {
              label: 'Back-office',
              description: 'Provide refunds, chargeback workflow, and audit trails.',
            },
          ],
        },
        {
          title: 'Post-purchase',
          items: [
            {
              label: 'Tracking',
              description: 'Expose order timelines, delivery windows, and proactive updates.',
            },
            {
              label: 'Returns/exchanges',
              description: 'Offer RMA flows tied to inventory sync.',
            },
            {
              label: 'Reviews & UGC',
              description: 'Moderate submissions with abuse controls.',
            },
          ],
        },
        {
          title: 'Catalog performance',
          items: [
            {
              label: 'Image pipeline',
              description: 'Resize via CDN, lazy load, and use skeleton placeholders.',
            },
            {
              label: 'Caching',
              description: 'Cache categories and support offline PDP/cart through service worker.',
            },
          ],
        },
      ],
    },
    {
      id: 'chat-app',
      title: 'Chat app — Domain specifics',
      summary: 'Real-time messaging and safety requirements.',
      clusters: [
        {
          title: 'Realtime',
          items: [
            {
              label: 'Transport',
              description: 'Select WebSocket, SSE, or WebTransport based on needs.',
            },
            {
              label: 'Rooms & presence',
              description: 'Leverage Durable Objects for membership coordination.',
            },
            {
              label: 'UX signals',
              description: 'Surface typing, read receipts, and delivery states.',
            },
            {
              label: 'Ordering',
              description: 'Guarantee message IDs, de-duplication, and idempotency.',
            },
          ],
        },
        {
          title: 'Storage & search',
          items: [
            {
              label: 'Schema',
              description: 'Model conversations, participants, messages, attachments, and pins.',
            },
            {
              label: 'Attachments',
              description: 'Store media in R2 with virus scanning and allowlists.',
            },
            {
              label: 'Pagination/Search',
              description: 'Provide cursor pagination and optional BM25 or embeddings.',
            },
          ],
        },
        {
          title: 'Security & safety',
          items: [
            {
              label: 'Auth',
              description: 'Use passkeys, session-device binding, and rate limits.',
            },
            {
              label: 'Encryption',
              description: 'Keep TLS everywhere with optional E2EE plans.',
            },
            {
              label: 'Abuse',
              description: 'Implement spam throttles, reporting, blocking, and content filters.',
            },
            {
              label: 'Retention',
              description: 'Set per-room retention and data minimization policies.',
            },
          ],
        },
        {
          title: 'PWA & notifications',
          items: [
            {
              label: 'Push',
              description: 'Notify mentions, DMs, and room topics with per-chat mute.',
            },
            {
              label: 'Offline',
              description: 'Queue outbound messages and reconcile conflicts on reconnect.',
            },
            {
              label: 'Presence',
              description: 'Adapt presence indicators for low bandwidth.',
            },
          ],
        },
        {
          title: 'Chat UX',
          items: [
            {
              label: 'A11y live regions',
              description: 'Announce new messages to assistive tech.',
            },
            {
              label: 'Navigation',
              description: 'Provide jump-to-latest controls and new-message markers.',
            },
            {
              label: 'Media',
              description: 'Render safe previews with sandboxed open flows.',
            },
            {
              label: 'Shortcuts',
              description: 'Support send, edit-last, search, and focus keyboard shortcuts.',
            },
          ],
        },
      ],
    },
    {
      id: 'seo',
      title: 'SEO & discoverability',
      summary: 'Organic visibility for commerce and chat.',
      clusters: [
        {
          items: [
            {
              label: 'Meta & canonicals',
              description: 'Publish unique titles, descriptions, canonicals, and hreflang for EN/ES.',
            },
            {
              label: 'Sitemaps/robots',
              description: 'Maintain XML/HTML sitemaps and clean 404/410 handling.',
            },
            {
              label: 'Social cards',
              description: 'Provide Open Graph and Twitter cards for PDPs and chat invites.',
            },
            {
              label: 'Search Console',
              description: 'Validate structured data and monitor index coverage.',
            },
          ],
        },
      ],
    },
    {
      id: 'growth',
      title: 'Growth & notifications',
      summary: 'Proactive channels with governance.',
      clusters: [
        {
          items: [
            {
              label: 'Email health',
              description: 'Enforce SPF, DKIM, DMARC, and bounce handling.',
            },
            {
              label: 'Push topics',
              description: 'Segment notifications for orders, promotions, and chat mentions.',
            },
            {
              label: 'Referrals',
              description: 'Issue signed invite links with abuse quotas.',
            },
          ],
        },
      ],
    },
    {
      id: 'legal',
      title: 'Legal & compliance',
      summary: 'Unified governance across security and data.',
      clusters: [
        {
          items: [
            {
              label: 'Policies',
              description: 'Align terms and privacy with chat transcripts and order data handling.',
            },
            {
              label: 'Consent',
              description: 'Request consent only when required with minimal cookies.',
            },
            {
              label: 'Data maps',
              description: 'Document D1/R2/KV locations, retention, and tested backups.',
            },
          ],
        },
      ],
    },
    {
      id: 'release-gates',
      title: 'Release gates (pre-launch checks)',
      summary: 'Production readiness checklist.',
      clusters: [
        {
          items: [
            {
              label: 'Security',
              description: 'Verify CSP nonces, SRI, secret isolation, and active WAF rules.',
            },
            {
              label: 'Payments',
              description: 'Exercise test cards, 3DS, refunds, and idempotent webhooks.',
            },
            {
              label: 'PWA',
              description: 'Confirm service worker install/update UX, offline cart/messages, and push delivery.',
            },
            {
              label: 'Performance',
              description: 'Meet real-device RUM budgets on critical journeys.',
            },
            {
              label: 'A11y',
              description: 'Pass screen-reader flows for add-to-cart, checkout, and messaging.',
            },
            {
              label: 'Ops',
              description: 'Finalize on-call, feature flags, incident templates, and rollback plans.',
            },
          ],
        },
      ],
    },
  ],
  es: [
    {
      id: 'ops-cysec-core',
      title: 'OPS CySec Core',
      summary: 'Núcleo de ciberseguridad OPS alineado con NIST CSF, CISA Cyber Essentials y PCI DSS 4.0.',
      clusters: [
        {
          items: [
            {
              label: 'Identificar',
              description: 'Mantener inventario de activos, niveles de riesgo y atestaciones de la cadena de suministro.',
            },
            {
              label: 'Proteger',
              description: 'Aplicar MFA, mínimo privilegio y cifrado AES-256 en tránsito y en reposo.',
            },
            {
              label: 'Detectar',
              description: 'Orquestar analítica SIEM, líneas base de anomalías y ejercicios de pentesting.',
            },
            {
              label: 'Responder',
              description: 'Documentar planes de respuesta, pasos forenses y rutas de comunicación.',
            },
            {
              label: 'Recuperar',
              description: 'Seguir MTTR/MTTD, validar planes de continuidad y mejorar controles tras incidentes.',
            },
          ],
        },
      ],
    },
    {
      id: 'foundation',
      title: 'Fundamentos (Ambas apps)',
      summary: 'Base compartida para los frentes de comercio y chat.',
      clusters: [
        {
          items: [
            {
              label: 'Brief de producto',
              description: 'Capturar objetivos, KPIs, dispositivos/banda soportados, locales EN/ES y meta WCAG 2.2 AA.',
            },
            {
              label: 'Sistema de diseño y tokens',
              description: 'Centralizar colores, tipografía y espaciados con soporte claro/oscuro, movimiento y RTL.',
            },
            {
              label: 'Ruteo y URLs',
              description: 'Definir URLs canónicas, política de slash final y ruteo de locales por ruta o subdominio.',
            },
            {
              label: 'Modelo de estado',
              description: 'Mapear estado cliente vs. servidor, incluyendo actualizaciones optimistas y reversión.',
            },
            {
              label: 'Tiempo y moneda',
              description: 'Guardar en UTC, renderizar con Intl y usar centavos enteros para dinero.',
            },
          ],
        },
      ],
    },
    {
      id: 'internationalization',
      title: 'Internacionalización (i18n/l10n)',
      summary: 'Localización resiliente para inglés y español.',
      clusters: [
        {
          items: [
            {
              label: 'Detección de locale',
              description: 'Priorizar parámetro de URL, luego preferencia guardada y después Accept-Language.',
            },
            {
              label: 'Catálogo de traducciones',
              description: 'Mantener llaves compatibles con ICU y formatos de plural/fecha/número.',
            },
            {
              label: 'Soporte de script/RTL',
              description: 'Validar tipografías, maquetado bidireccional y reglas de truncado o guionado.',
            },
            {
              label: 'Formato numérico/moneda',
              description: 'Respetar separadores de español ecuatoriano y monedas múltiples.',
            },
          ],
        },
      ],
    },
    {
      id: 'accessibility',
      title: 'Accesibilidad (a11y)',
      summary: 'Cumplimiento WCAG 2.2 AA con ergonomía de teclado.',
      clusters: [
        {
          items: [
            {
              label: 'Semántica',
              description: 'Proveer landmarks, jerarquía de encabezados, etiquetas y enfoque visible.',
            },
            {
              label: 'Flujos con teclado',
              description: 'Garantizar orden lógico de tab, escape para cerrar y enlaces de salto.',
            },
            {
              label: 'Contraste y movimiento',
              description: 'Cumplir contrastes y respetar preferencias de movimiento reducido.',
            },
            {
              label: 'Regiones vivas',
              description: 'Anunciar cambios como carrito, respuestas de chat y contenido dinámico.',
            },
          ],
        },
      ],
    },
    {
      id: 'performance',
      title: 'Rendimiento (Core Web Vitals)',
      summary: 'Presupuestos móviles para la experiencia dual.',
      clusters: [
        {
          items: [
            {
              label: 'Presupuestos',
              description: 'Mantener LCP < 2.5s, CLS < 0.1 e INP < 200 ms en móviles.',
            },
            {
              label: 'Code splitting',
              description: 'Cargar rutas de forma diferida y aplazar módulos pesados hasta interacción.',
            },
            {
              label: 'Imágenes',
              description: 'Entregar srcset responsivo en AVIF/WebP con tamaño intrínseco.',
            },
            {
              label: 'Pistas de recursos',
              description: 'Usar preload/modulepreload/prefetch/fetchpriority en rutas críticas.',
            },
            {
              label: 'Cacheo',
              description: 'Servir assets versionados, CDN caching y APIs con ETag.',
            },
          ],
        },
      ],
    },
    {
      id: 'pwa',
      title: 'PWA y Service Worker',
      summary: 'Preparación offline para ambos frentes.',
      clusters: [
        {
          items: [
            {
              label: 'Manifest',
              description: 'Definir nombres, íconos, colores de tema y modos de pantalla.',
            },
            {
              label: 'Ciclo de vida del SW',
              description: 'Versionar instalación/activación con actualizaciones seguras.',
            },
            {
              label: 'Estrategias de caché',
              description: 'Precargar el shell y combinar estrategias stale-while-revalidate, network-first y cache-first.',
            },
            {
              label: 'Offline y colas',
              description: 'Brindar páginas de respaldo y colas de reintento para pedidos o mensajes.',
            },
            {
              label: 'Notificaciones push',
              description: 'Ofrecer opt-in con temas para pedidos y chat.',
            },
            {
              label: 'Experiencia de actualización',
              description: 'Avisar cuando haya un service worker nuevo disponible.',
            },
          ],
        },
      ],
    },
    {
      id: 'security-privacy',
      title: 'Seguridad y Privacidad (OPS Core)',
      summary: 'Protecciones extremo a extremo para datos y sesiones.',
      clusters: [
        {
          items: [
            {
              label: 'Transporte',
              description: 'Forzar HTTPS con HSTS y suites TLS modernas.',
            },
            {
              label: 'CSP',
              description: 'Aplicar CSP estricta con nonces y SRI para terceros.',
            },
            {
              label: 'Aislamiento y políticas',
              description: 'Configurar COOP, COEP, CORP, Referrer-Policy y Permissions-Policy mínima.',
            },
            {
              label: 'Cookies y autenticación',
              description: 'Usar cookies Secure/HttpOnly/SameSite con passkeys y rotación de sesión.',
            },
            {
              label: 'Inyección/XSS',
              description: 'Validar entradas, sanear respuestas y usar Trusted Types al templar.',
            },
            {
              label: 'CORS y URLs firmadas',
              description: 'Restringir CORS, firmar webhooks/URLs y gestionar secretos en Cloudflare.',
            },
            {
              label: 'Privacidad',
              description: 'Recolectar datos mínimos, pedir consentimiento necesario y aplicar retención.',
            },
          ],
        },
      ],
    },
    {
      id: 'edge-data',
      title: 'Edge y Datos (Cloudflare)',
      summary: 'Servicios de Cloudflare coordinados para datos locales.',
      clusters: [
        {
          items: [
            {
              label: 'Workers',
              description: 'Dirigir /api/* a Workers versionados con health checks.',
            },
            {
              label: 'D1 (SQLite)',
              description: 'Diseñar esquemas, migraciones e índices previsibles.',
            },
            {
              label: 'R2 (almacenamiento)',
              description: 'Guardar medios con reglas de ciclo de vida y versionado.',
            },
            {
              label: 'KV',
              description: 'Conservar flags y diccionarios ligeros.',
            },
            {
              label: 'Durable Objects',
              description: 'Coordinar salas, presencia y límites de tasa.',
            },
            {
              label: 'Queues/CRON',
              description: 'Reintentar webhooks, liquidaciones y resúmenes.',
            },
            {
              label: 'WAF/Límites',
              description: 'Aplicar límites por usuario, defensas anti-bot y listas de permitidos/bloqueados.',
            },
          ],
        },
      ],
    },
    {
      id: 'observability-quality',
      title: 'Observabilidad y Calidad',
      summary: 'Visibilidad continua en rendimiento y operaciones.',
      clusters: [
        {
          items: [
            {
              label: 'RUM',
              description: 'Medir LCP, INP y CLS reales por ruta con tableros.',
            },
            {
              label: 'Logs/métricas/trazas',
              description: 'Emitir logs estructurados con IDs de error y alertas de latencia.',
            },
            {
              label: 'Pruebas',
              description: 'Cubrir unitarias, a11y, e2e y smoke en despliegues.',
            },
            {
              label: 'Cadena de suministro',
              description: 'Mantener lockfiles, revisión de dependencias y automatización tipo Renovate.',
            },
            {
              label: 'SLOs y runbooks',
              description: 'Definir objetivos de disponibilidad y guías de incidente/rollback.',
            },
          ],
        },
      ],
    },
    {
      id: 'ecommerce',
      title: 'E-commerce — Específicos de dominio',
      summary: 'Controles dedicados para catálogo, pagos y postventa.',
      clusters: [
        {
          title: 'Catálogo y contenido',
          items: [
            {
              label: 'Datos de producto',
              description: 'Nombrar variantes y ofrecer imágenes accesibles.',
            },
            {
              label: 'Datos estructurados',
              description: 'Publicar esquema Product, Offer, AggregateRating y BreadcrumbList.',
            },
            {
              label: 'Descubrimiento',
              description: 'Entregar búsqueda, filtros, orden y estados vacíos o 404 útiles.',
            },
          ],
        },
        {
          title: 'Carrito y checkout',
          items: [
            {
              label: 'Persistencia del carrito',
              description: 'Sincronizar IndexedDB y servidor con fusión al iniciar sesión.',
            },
            {
              label: 'Precios',
              description: 'Configurar IVA, niveles de envío y promociones.',
            },
            {
              label: 'Dirección y entrega',
              description: 'Usar geolocalización con consentimiento, validación y notas de entrega.',
            },
            {
              label: 'Pagos',
              description: 'Ofrecer DataFast, Kushki, PayPhone y Stripe/Adyen/PayPal con Payment Request API.',
            },
            {
              label: 'SCA/3DS',
              description: 'Soportar retos escalonados con mensajes claros de rechazo.',
            },
            {
              label: 'Recibos/facturas',
              description: 'Enviar correos, PDFs descargables e IDs únicos con marcas de tiempo.',
            },
          ],
        },
        {
          title: 'Fraude, riesgo y cumplimiento',
          items: [
            {
              label: 'Controles de velocidad y dispositivos',
              description: 'Evaluar tarjetas, cuentas y patrones de dispositivo.',
            },
            {
              label: 'Webhooks',
              description: 'Firmar eventos con HMAC y reforzar idempotencia.',
            },
            {
              label: 'Alcance PCI',
              description: 'Tokenizar pagos y mantener PAN fuera de la plataforma.',
            },
            {
              label: 'Back-office',
              description: 'Brindar reembolsos, gestión de contracargos y trazabilidad.',
            },
          ],
        },
        {
          title: 'Postventa',
          items: [
            {
              label: 'Seguimiento',
              description: 'Mostrar líneas de tiempo, ventanas de entrega y avisos proactivos.',
            },
            {
              label: 'Devoluciones/cambios',
              description: 'Ofrecer flujo RMA sincronizado con inventario.',
            },
            {
              label: 'Reseñas y UGC',
              description: 'Moderar envíos con controles anti-abuso.',
            },
          ],
        },
        {
          title: 'Performance de catálogo',
          items: [
            {
              label: 'Canal de imágenes',
              description: 'Redimensionar con CDN, lazy load y esqueletos.',
            },
            {
              label: 'Cacheo',
              description: 'Cachear categorías y habilitar PDP/carrito offline vía service worker.',
            },
          ],
        },
      ],
    },
    {
      id: 'chat-app',
      title: 'App de chat — Específicos de dominio',
      summary: 'Requisitos de mensajería en tiempo real y seguridad social.',
      clusters: [
        {
          title: 'Tiempo real',
          items: [
            {
              label: 'Transporte',
              description: 'Elegir WebSocket, SSE o WebTransport según necesidad.',
            },
            {
              label: 'Salas y presencia',
              description: 'Usar Durable Objects para membresía y coordinación.',
            },
            {
              label: 'Señales UX',
              description: 'Mostrar escritura, lectura y estados de entrega.',
            },
            {
              label: 'Orden',
              description: 'Garantizar IDs, desduplicación e idempotencia de mensajes.',
            },
          ],
        },
        {
          title: 'Almacenamiento y búsqueda',
          items: [
            {
              label: 'Esquema',
              description: 'Modelar conversaciones, participantes, mensajes, adjuntos y fijados.',
            },
            {
              label: 'Adjuntos',
              description: 'Guardar medios en R2 con antivirus y listas permitidas.',
            },
            {
              label: 'Paginación/Búsqueda',
              description: 'Ofrecer cursores y opcionalmente BM25 o embeddings.',
            },
          ],
        },
        {
          title: 'Seguridad y protección',
          items: [
            {
              label: 'Autenticación',
              description: 'Aplicar passkeys, unión sesión-dispositivo y límites de tasa.',
            },
            {
              label: 'Cifrado',
              description: 'Mantener TLS en todo lado con plan E2EE opcional.',
            },
            {
              label: 'Abuso',
              description: 'Implementar antifraude, reportes, bloqueos y filtros.',
            },
            {
              label: 'Retención',
              description: 'Definir políticas por sala y minimización de datos.',
            },
          ],
        },
        {
          title: 'PWA y notificaciones',
          items: [
            {
              label: 'Push',
              description: 'Avisar menciones, DMs y temas con silencio por chat.',
            },
            {
              label: 'Offline',
              description: 'Encolar mensajes salientes y conciliar al reconectar.',
            },
            {
              label: 'Presencia',
              description: 'Adaptar indicadores para bajos anchos de banda.',
            },
          ],
        },
        {
          title: 'Experiencia de chat',
          items: [
            {
              label: 'Regiones vivas a11y',
              description: 'Anunciar mensajes nuevos a tecnología asistiva.',
            },
            {
              label: 'Navegación',
              description: 'Ofrecer salto al último y marcadores de mensajes nuevos.',
            },
            {
              label: 'Medios',
              description: 'Renderizar vistas seguras con apertura aislada.',
            },
            {
              label: 'Atajos',
              description: 'Soportar enviar, editar último, buscar y foco por teclado.',
            },
          ],
        },
      ],
    },
    {
      id: 'seo',
      title: 'SEO y descubrimiento',
      summary: 'Visibilidad orgánica para comercio y chat.',
      clusters: [
        {
          items: [
            {
              label: 'Meta y canónicos',
              description: 'Publicar títulos, descripciones, canonicals y hreflang EN/ES.',
            },
            {
              label: 'Sitemaps/robots',
              description: 'Mantener sitemaps XML/HTML y manejar 404/410 limpios.',
            },
            {
              label: 'Tarjetas sociales',
              description: 'Configurar Open Graph y Twitter para PDP e invitaciones de chat.',
            },
            {
              label: 'Search Console',
              description: 'Validar datos estructurados y vigilar indexación.',
            },
          ],
        },
      ],
    },
    {
      id: 'growth',
      title: 'Crecimiento y notificaciones',
      summary: 'Canales proactivos con gobernanza.',
      clusters: [
        {
          items: [
            {
              label: 'Salud de email',
              description: 'Aplicar SPF, DKIM, DMARC y gestión de rebotes.',
            },
            {
              label: 'Temas push',
              description: 'Segmentar avisos para pedidos, promociones y menciones.',
            },
            {
              label: 'Referidos',
              description: 'Emitir enlaces firmados con cuotas anti-abuso.',
            },
          ],
        },
      ],
    },
    {
      id: 'legal',
      title: 'Legal y cumplimiento',
      summary: 'Gobernanza transversal entre seguridad y datos.',
      clusters: [
        {
          items: [
            {
              label: 'Políticas',
              description: 'Alinear términos y privacidad con chats y órdenes.',
            },
            {
              label: 'Consentimiento',
              description: 'Solicitar solo lo necesario con cookies mínimas.',
            },
            {
              label: 'Mapa de datos',
              description: 'Documentar ubicaciones D1/R2/KV, retención y respaldos probados.',
            },
          ],
        },
      ],
    },
    {
      id: 'release-gates',
      title: 'Controles de lanzamiento',
      summary: 'Checklist previo a producción.',
      clusters: [
        {
          items: [
            {
              label: 'Seguridad',
              description: 'Verificar nonces CSP, SRI, aislamiento de secretos y WAF activo.',
            },
            {
              label: 'Pagos',
              description: 'Probar tarjetas, 3DS, reembolsos y webhooks idempotentes.',
            },
            {
              label: 'PWA',
              description: 'Confirmar instalación/actualización SW, carrito/mensajes offline y push.',
            },
            {
              label: 'Rendimiento',
              description: 'Cumplir presupuestos RUM en recorridos críticos.',
            },
            {
              label: 'A11y',
              description: 'Aprobar flujos con lector de pantalla para carrito y mensajes.',
            },
            {
              label: 'Operaciones',
              description: 'Cerrar on-call, flags, plantillas de incidentes y planes de rollback.',
            },
          ],
        },
      ],
    },
  ],
};

```
