import type { Metadata } from 'next';
import { INITIAL_BUSINESSES } from '@/lib/mock-data';
import BusinessDetailClient from '@/components/business-detail-client';

export function generateStaticParams() {
  return INITIAL_BUSINESSES.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = INITIAL_BUSINESSES.find((b) => b.slug === slug);

  if (!business) {
    return {
      title: 'Comercio No Encontrado | CumanáConecta',
      description: 'El comercio solicitado no se encuentra en el directorio de Cumaná, Estado Sucre.',
    };
  }

  const title = `${business.name} — ${business.category} en Cumaná`;
  const description = `${business.name}: ${business.tagline || business.description}. Ubicado en ${business.zone} (${business.address}), Cumaná. Horarios, referencias de cómo llegar, métodos de pago${business.acceptsCashea ? ' con Cashea' : ''} y WhatsApp directo.`;
  const canonicalUrl = `https://cumanaconecta.com/local/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'es_VE',
      url: canonicalUrl,
      siteName: 'CumanáConecta',
      title,
      description,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${business.name} — CumanáConecta`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  };
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = INITIAL_BUSINESSES.find((b) => b.slug === slug);

  return <BusinessDetailClient business={business as any} slug={slug} />;
}
