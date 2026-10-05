/**
 * @fileoverview Módulo de SEO Avanzado & Open Graph para CumanáConecta
 * Optimizado para posicionamiento local (Cumaná, Sucre), nacional (Venezuela) e internacional,
 * con sincronización reactiva de Open Graph, Twitter Cards y Schema.org JSON-LD.
 */

const DEFAULT_SEO = {
  title: 'CumanáConecta — Directorio Comercial y de Servicios de Cumaná, Sucre, Venezuela',
  description: 'Directorio comercial, médico y turístico oficial de Cumaná, Estado Sucre, Venezuela. Encuentra farmacias 24h, restaurantes, clínicas, talleres, hoteles y comercios con Cashea y delivery en Cumaná.',
  keywords: 'Cumaná, Cumaná Sucre, Directorio Comercial Cumaná, Negocios en Cumaná, Comercios Cumaná, Tiendas Cumaná, Farmacias 24 horas Cumaná, Restaurantes Cumaná, Marisquerías Cumaná, Cashea Cumaná, Pagar con Cashea en Cumaná, Clínicas Cumaná, Médicos Cumaná, Talleres Cumaná, Delivery Cumaná, Estado Sucre Venezuela, Oriente Venezolano, Mochima Turismo Cumaná, Hoteles Cumaná, Emprendedores Cumaná, Ofertas Cumaná, Directorio CumanáConecta, Guía Comercial Sucre',
  image: 'https://cumanaconecta.com/images/og-cumanaconecta.jpg',
  url: 'https://cumanaconecta.com/',
};

/**
 * Actualiza dinámicamente las etiquetas meta en el `<head>` del documento
 * para previsualizaciones ricas en WhatsApp, Facebook, X (Twitter), LinkedIn e Instagram.
 * @param {Object|null} custom - Parámetros de SEO específicos del comercio o vista
 */
export function updatePageSEO(custom = null) {
  if (typeof document === 'undefined') return;

  const data = custom
    ? {
        title: custom.title || `${custom.name} en Cumaná, Sucre — CumanáConecta`,
        description: custom.description || DEFAULT_SEO.description,
        image: custom.image || custom.bannerUrl || DEFAULT_SEO.image,
        url: custom.url || (custom.slug || custom.id ? `https://cumanaconecta.com/?negocio=${encodeURIComponent(custom.slug || custom.id)}` : 'https://cumanaconecta.com/'),
        keywords: custom.keywords || DEFAULT_SEO.keywords,
      }
    : DEFAULT_SEO;

  // 1. Title
  document.title = data.title;

  // Helper para asignar o crear meta tags
  const setMeta = (attrName, attrVal, content) => {
    if (!content) return;
    let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attrName, attrVal);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 2. Primary Meta Tags
  setMeta('name', 'description', data.description);
  setMeta('name', 'keywords', data.keywords);

  // 3. Open Graph (WhatsApp, Facebook, LinkedIn)
  setMeta('property', 'og:title', data.title);
  setMeta('property', 'og:description', data.description);
  setMeta('property', 'og:image', data.image);
  setMeta('property', 'og:image:secure_url', data.image);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:image:alt', data.title);
  setMeta('property', 'og:url', data.url);
  setMeta('property', 'og:type', custom ? 'business.business' : 'website');
  setMeta('property', 'og:site_name', 'CumanáConecta');
  setMeta('property', 'og:locale', 'es_VE');

  // 4. Twitter / X Cards
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', data.title);
  setMeta('name', 'twitter:description', data.description);
  setMeta('name', 'twitter:image', data.image);
  setMeta('name', 'twitter:image:alt', data.title);
  setMeta('name', 'twitter:site', '@cumanaconecta');

  // 5. Inyección dinámica de Schema.org JSON-LD para Google Search
  const existingScript = document.getElementById('dynamic-seo-schema');
  if (existingScript) {
    existingScript.remove();
  }

  if (custom) {
    const schemaData = generateLocalBusinessSchema(custom);
    if (schemaData) {
      const script = document.createElement('script');
      script.id = 'dynamic-seo-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }
}

/**
 * Genera el JSON-LD para un comercio individual (LocalBusiness)
 * Cumple con todas las especificaciones de Google Search y Rich Snippets.
 * @param {Object} business - Objeto de datos del comercio
 * @returns {Object} JSON-LD Schema
 */
export function generateLocalBusinessSchema(business) {
  if (!business) return null;

  const sameAsList = [];
  if (business.instagram) sameAsList.push(`https://instagram.com/${business.instagram.replace(/^@/, '')}`);
  if (business.tiktok) sameAsList.push(`https://www.tiktok.com/@${business.tiktok.replace(/^@/, '')}`);
  if (business.youtube) sameAsList.push(business.youtube.startsWith('http') ? business.youtube : `https://youtube.com/@${business.youtube.replace(/^@/, '')}`);
  if (business.website) sameAsList.push(business.website);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://cumanaconecta.com/?negocio=${encodeURIComponent(business.slug || business.id || business.name)}`,
    name: business.name,
    description: business.description,
    image: business.photos && business.photos.length > 0 ? business.photos : [business.bannerUrl || DEFAULT_SEO.image],
    url: `https://cumanaconecta.com/?negocio=${encodeURIComponent(business.slug || business.id || business.name)}`,
    telephone: business.phone || (business.whatsapp ? `+${business.whatsapp}` : undefined),
    priceRange: business.priceRange || '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: 'Cumaná',
      addressRegion: 'Estado Sucre',
      addressCountry: 'VE',
      postalCode: '6101',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: (() => {
        if (business.coordinates?.lat) return String(business.coordinates.lat);
        const m = (business.googleMapsUrl || '').match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        return m ? m[1] : '10.4536';
      })(),
      longitude: (() => {
        if (business.coordinates?.lng) return String(business.coordinates.lng);
        const m = (business.googleMapsUrl || '').match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        return m ? m[2] : '-64.1775';
      })(),
    },
    openingHoursSpecification: business.isOpen24h
      ? [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59',
          },
        ]
      : undefined,
    paymentAccepted: Array.isArray(business.paymentMethods)
      ? business.paymentMethods.join(', ')
      : 'Cashea, Pago Móvil, USD Cash, Zelle, Punto de Venta',
    currenciesAccepted: 'VES, USD, USDT',
    sameAs: sameAsList.length > 0 ? sameAsList : undefined,
    areaServed: {
      '@type': 'City',
      name: 'Cumaná',
      containedInPlace: {
        '@type': 'State',
        name: 'Estado Sucre, Venezuela',
      },
    },
  };
}

/**
 * Genera el JSON-LD para la lista completa de negocios del directorio (ItemList)
 * @param {Array} businessesList - Lista de comercios
 * @returns {Object} JSON-LD Schema
 */
export function generateDirectoryItemListSchema(businessesList = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Directorio Comercial y de Servicios de CumanáConecta — Cumaná, Sucre',
    description: 'Catálogo oficial de comercios, farmacias 24h, clínicas, talleres y emprendimientos en Cumaná, Sucre, Venezuela.',
    numberOfItems: businessesList.length,
    itemListElement: businessesList.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: `https://cumanaconecta.com/?negocio=${encodeURIComponent(item.slug || item.id || item.name)}`,
    })),
  };
}

/**
 * Genera un texto enriquecido para compartir un comercio por WhatsApp y redes sociales
 * con formato visual de alta conversión.
 * @param {Object} business
 * @returns {string} Texto formateado con emojis y enlaces
 */
export function generateBusinessShareText(business) {
  if (!business) return '';
  const { name, zone, address, activePromotion, paymentMethods = [], isFeatured } = business;

  const vipBadge = isFeatured ? '👑 *[COMERCIO DESTACADO VIP]*\n' : '';
  const promoLine = activePromotion ? `🔥 *Promoción Activa:* ${activePromotion}\n` : '';
  const casheaLine = paymentMethods.includes('cashea') ? '🟰 *Acepta Pagos con Cashea en Cuotas*\n' : '';
  const businessIdentifier = business.slug || business.id || name;
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?negocio=${encodeURIComponent(businessIdentifier)}`
    : `https://cumanaconecta.com/?negocio=${encodeURIComponent(businessIdentifier)}`;

  return (
    `🌊 *${name}* — CumanáConecta\n` +
    vipBadge +
    `📍 *Ubicación:* ${zone} (${address})\n` +
    promoLine +
    casheaLine +
    `✨ *Mira fotos, horarios, mapa interactivo y contacto directo aquí:*\n` +
    `${shareUrl}\n\n` +
    `_CumanáConecta — El Directorio Comercial de Cumaná, Sucre 🇻🇪_`
  );
}

