import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/locales', '/planes', '/local/'],
        disallow: [
          '/administracion',
          '/administracion/',
          '/admin',
          '/admin/',
          '/panel-admin',
          '/panel-admin/',
          '/censo',
          '/tablet',
        ],
      },
    ],
    sitemap: 'https://cumanaconecta.com/sitemap.xml',
  };
}
