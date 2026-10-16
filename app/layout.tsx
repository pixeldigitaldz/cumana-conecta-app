import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { Navbar, Footer } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { AppDataProvider } from '@/lib/app-data-context';
import { CumanaBotIA } from '@/components/cumana-bot-ia';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cumanaconecta.com'),
  title: {
    default: 'CumanáConecta — Directorio Comercial, Farmacias 24h y Cashea en Cumaná',
    template: '%s | CumanáConecta — Cumaná, Sucre',
  },
  description:
    'Directorio comercial, médico, turístico y de servicios verificados en Cumaná, Estado Sucre. Consulta farmacias de turno 24 horas, clínicas, restaurantes, posadas, talleres y tiendas que aceptan Cashea y Pago Móvil.',
  keywords: [
    'comercios en Cumaná',
    'tiendas con Cashea en Cumaná',
    'farmacias de turno Cumaná hoy',
    'farmacias 24 horas Cumaná',
    'restaurantes en Cumaná',
    'Econoquesos Cumaná',
    'clínicas en Cumaná',
    'talleres mecánicos Cumaná',
    'tours a Mochima',
    'CumanáConecta',
    'directorio comercial Sucre',
    'Cumaná Sucre Venezuela',
  ],
  authors: [{ name: 'CumanáConecta Team', url: 'https://cumanaconecta.com' }],
  creator: 'CumanáConecta',
  publisher: 'CumanáConecta',
  icons: {
    icon: '/logo.png?v=3',
    apple: '/logo.png?v=3',
  },
  verification: {
    google: '-UsWpSNKg8-FbbpX6QXO4V0wk4DWTBXTRtFd3T27YpE',
  },
  openGraph: {
    type: 'website',
    locale: 'es_VE',
    url: 'https://cumanaconecta.com',
    siteName: 'CumanáConecta',
    title: 'CumanáConecta — Directorio Comercial, Farmacias 24h y Cashea en Cumaná',
    description:
      'Directorio comercial, médico, turístico y de servicios verificados en Cumaná, Estado Sucre. Consulta farmacias de turno 24 horas, clínicas, restaurantes, posadas, talleres y tiendas que aceptan Cashea y Pago Móvil.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'CumanáConecta — Directorio Oficial de Cumaná, Sucre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CumanáConecta — Directorio Comercial, Farmacias 24h y Cashea en Cumaná',
    description:
      'Directorio comercial, médico, turístico y de servicios verificados en Cumaná, Estado Sucre.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'VE-R',
    'geo.placename': 'Cumaná, Estado Sucre, Venezuela',
    'geo.position': '10.4536;-64.1775',
    'ICBM': '10.4536, -64.1775',
  },
};

const jsonLdData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://cumanaconecta.com/#website',
      url: 'https://cumanaconecta.com',
      name: 'CumanáConecta',
      description:
        'Directorio comercial, médico, turístico y de servicios verificados en Cumaná, Estado Sucre.',
      inLanguage: 'es-VE',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://cumanaconecta.com/locales?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://cumanaconecta.com/#organization',
      name: 'CumanáConecta',
      url: 'https://cumanaconecta.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cumanaconecta.com/logo.png',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cumaná',
        addressRegion: 'Sucre',
        addressCountry: 'VE',
      },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Cumaná, Estado Sucre, Venezuela',
      },
    },
    {
      '@type': 'SiteNavigationElement',
      '@id': 'https://cumanaconecta.com/#navigation',
      name: 'Navegación Principal CumanáConecta',
      hasPart: [
        {
          '@type': 'WebPage',
          name: 'Inicio',
          url: 'https://cumanaconecta.com/',
        },
        {
          '@type': 'WebPage',
          name: 'Directorio de Comercios y Locales',
          url: 'https://cumanaconecta.com/locales',
        },
        {
          '@type': 'WebPage',
          name: 'Sumar mi Negocio y Planes',
          url: 'https://cumanaconecta.com/planes',
        },
        {
          '@type': 'WebPage',
          name: 'Econoquesos Cumaná — Cadena MultiSede',
          url: 'https://cumanaconecta.com/local/econoquesos-cumana',
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b0d11" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CumanáConecta" />
        <link rel="apple-touch-icon" href="/logo-circle.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('cumana_theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased bg-[#f8fafc] dark:bg-[#0b0d11] text-[#0f172a] dark:text-[#e2e8f0] min-h-screen flex flex-col transition-colors duration-200`}>
        <ThemeProvider>
          <AppDataProvider>
            <Navbar />
            <main className="flex-1 pt-[88px] sm:pt-[96px] md:pt-[104px] pb-20 md:pb-0 bg-[#f8fafc] dark:bg-[#0b0d11] transition-colors duration-200">
              {children}
            </main>
            <Footer />
            <CumanaBotIA />
          </AppDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
