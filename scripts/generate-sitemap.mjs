import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const routes = ['/', '/contact-center', '/it-support', '/professional-services'];
const siteUrl = process.env.VITE_SITE_URL || 'https://ops.support';

const buildUrl = (path) => new URL(path, siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`).toString();

const urlEntries = routes
  .map(
    (path) => `  <url>\n    <loc>${buildUrl(path)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

const outputDir = resolve(process.cwd(), 'public');
await mkdir(outputDir, { recursive: true });
await writeFile(resolve(outputDir, 'sitemap.xml'), sitemap);

console.log(`Sitemap generated for ${routes.length} routes at ${siteUrl}`);
