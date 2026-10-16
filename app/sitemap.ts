import { MetadataRoute } from 'next';
import { INITIAL_BUSINESSES } from '@/lib/mock-data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cumanaconecta.com';
  const currentDate = new Date();

  // Rutas estáticas principales del directorio
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/locales`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/planes`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Rutas dinámicas de cada comercio activo en Cumaná
  const businessRoutes: MetadataRoute.Sitemap = INITIAL_BUSINESSES.map((business) => ({
    url: `${baseUrl}/local/${business.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...businessRoutes];
}
