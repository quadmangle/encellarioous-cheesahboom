# OPS CySec Core Compliance Matrix

The OPS Online Support SPA now surfaces the complete compliance blueprint for the dual e-commerce and chat applications. The matrix is defined in structured data at `src/data/compliance.ts` and rendered through the `ComplianceChecklist` section that lives beneath the managed service breakdowns on the homepage.

## Highlights

- **Bilingual coverage** – Every control ships in English and Spanish, mirroring the locale toggle exposed by the global context provider.
- **OPS CySec Core alignment** – The Identify→Protect→Detect→Respond→Recover lifecycle sits at the top of the matrix, tying NIST CSF, CISA Cyber Essentials, and PCI DSS 4.0 controls into a single entry point.
- **Domain depth** – Dedicated clusters articulate requirements for the e-commerce surface (catalog, checkout, risk, post-purchase) and the chat product (real-time transport, storage, abuse mitigations, UX), ensuring each pillar is represented.
- **Cloudflare edge orchestration** – Workers, D1, R2, KV, Durable Objects, Queues, and WAF guardrails are all documented as first-class controls to keep parity with the deployment stack.
- **Release governance** – Performance, security, a11y, and operational gate checks are codified so they can be audited before go-live.

## Implementation Notes

1. The matrix consumes the shared language state from `GlobalContext`, guaranteeing that the compliance details follow the user’s language preference.
2. Each checklist section carries a semantic article wrapper and lists with descriptive text, keeping the presentation WCAG 2.2 AA friendly.
3. Navigation links were added to the desktop header and mobile bottom bar so visitors can jump directly to the compliance anchor (`#compliance-section`).
4. The dataset is intentionally structured (block → cluster → item) to allow future automation such as export to audits, automated tests, or knowledge bases without reworking the UI layer.

## Next Steps

- Wire the matrix into future documentation automation (e.g., Cloudflare Workers audit endpoints or policy diff reports).
- Attach analytics to measure which sections users consult most to inform prioritisation of follow-up guides.
