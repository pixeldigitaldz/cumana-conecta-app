export type BusinessTier = 'free' | 'pro' | 'vip';

export type PaymentMethod = 
  | 'pago_movil'
  | 'zelle'
  | 'efectivo_usd'
  | 'efectivo_bs'
  | 'binance'
  | 'tarjeta_debito'
  | 'punto_de_venta'
  | 'cashea';

export type Amenity = 
  | 'planta_electrica'      // Planta eléctrica activa / Respaldo energético
  | 'fibra_optica'          // Internet de alta velocidad / Wi-Fi
  | 'estacionamiento'       // Puestos vigilados
  | 'aire_acondicionado'    // Espacio climatizado
  | 'pet_friendly'          // Admite mascotas
  | 'delivery'              // Envíos a domicilio
  | 'frente_al_mar';        // Vista o acceso al mar / Golfo de Cariaco

export interface SocialLinks {
  whatsapp: string;        // Número o enlace wa.me internacional
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  youtube?: string;
  website?: string;
  email?: string;
}

export interface SpecialPromotion {
  isActive: boolean;
  title: string;           // ej. '2x1 en Cócteles del Golfo los Jueves'
  description?: string;    // Detalle de la promo
  discountBadge?: string;  // ej. '-20%', 'PROMO'
  validUntil?: string;     // ej. 'Válido hasta fin de mes'
}

export interface BusinessReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Milestone {
  time: string;            // '0:05', '0:18', etc.
  title: string;
  description: string;
}

export interface VideoRoute {
  videoUrl: string;        // Video vertical 9:16 (ej. MP4 o streaming)
  thumbnailUrl: string;
  originName: string;      // ej. 'Redoma del Indio / Av. Perimetral'
  duration: string;        // ej. '42 seg'
  milestones: Milestone[]; // Hitos del trayecto
  showInFeed?: boolean;    // Control para mostrar/ocultar en la videoruta pública
}

export interface BranchInfo {
  id?: string;
  name: string;             // Ej: 'Sede Central'
  fullName?: string;        // Ej: 'Sede Central — Blanco Fombona'
  roleBadge?: string;       // Ej: 'SEDE 01', 'Principal', etc.
  detailBadge?: string;     // Ej: 'SEDE PRINCIPAL', 'HIPERMERCADO & EQ FARMA'
  zone?: string;            // Ej: 'Casco Histórico / Centro'
  address: string;          // Dirección exacta de la sede
  entranceGuide?: string;   // ¿Cómo llegar y cómo es la entrada? Referencia visual
  image?: string;           // Foto real de la fachada/entrada de esa sede
  phone?: string;           // Teléfono o WhatsApp directo de esa sede
  openingHours?: string;    // Ej: 'Lunes a Sábado: 8:00 AM - 8:30 PM | Domingo: 8:00 AM - 2:00 PM'
  distanceText?: string;    // Ej: '0.8 km'
  videoDuration?: string;   // Ej: '45 seg'
  status?: 'open' | 'closed' | 'coming_soon'; // 'open' = Abierta, 'closed' = Cerrada, 'coming_soon' = Próxima Apertura
  mapsUrl?: string;         // Enlace directo de Google Maps de esa sede
  tags?: string[];          // Tags/chips de servicios de la sede
}

export interface CatalogItem {
  id: string;
  name: string;
  price: string;
  badge?: string;
  image: string;
  unit?: string;
  whatsappText?: string;
  description?: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  categories?: string[];   // Lista de múltiples rubros o actividades comerciales
  zone: string;
  address: string;
  mapsUrl: string;
  rif?: string;            // ej. 'J-505563599' o 'V-12345678-9'
  phone?: string;          // Teléfono directo para llamadas o fichas
  email?: string;          // Correo electrónico de contacto
  coordinates?: string;    // Coordenadas GPS ej: '10.4536° N, 64.1775° W'
  hasGps?: boolean;        // ¿Dispone de geolocalización por Google Maps interactiva?
  hasBranches?: boolean;   // ¿Tiene sucursales activas en Cumaná / Edo. Sucre?
  isMultiBranch?: boolean; // Marca explícita para la vista de cadena multi-sede
  isFeatured?: boolean;    // Comercio destacado oficial
  branches?: BranchInfo[]; // Lista de sucursales del comercio
  acceptsCashea?: boolean; // ¿Afiliado a Cashea en cuotas a tasa BCV?
  casheaLevel?: string;    // ej: 'NIVELES 1-6' o 'Línea Cotidiana'
  monogram?: string;       // Monograma de 2 letras (ej. 'CC', 'EQ')
  catalog?: CatalogItem[]; // Catálogo referencial de productos
  socials: SocialLinks;
  videoRoute?: VideoRoute; // Obligatorio o destacado para VIP
  paymentMethods: PaymentMethod[];
  amenities: Amenity[];
  tier: BusinessTier;
  rating: number;
  reviewsCount: number;
  heroImage: string;
  gallery: string[];       // Galería fotográfica múltiple
  promotion?: SpecialPromotion; // Promociones especiales del comercio
  isOpenNow: boolean;
  openingHours: string;
  isVerified: boolean;
  status: 'active' | 'pending_approval' | 'suspended';
  createdAt: string;
}

export interface PlanConfig {
  id: string;
  tier: BusinessTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  period: string;
  tagline: string;
  badge?: string;
  featuresHeader?: string;
  isPopular: boolean;
  buttonText: string;
  buttonVariant: 'outline' | 'primary' | 'vip';
  features: string[];
  notIncluded: string[];
}

export interface MetricStat {
  id: string;
  value: string;
  label: string;
  tag: string;
  tagColor: 'green' | 'orange' | 'coral' | 'blue';
  subtext?: string;
  icon: 'eye' | 'chat' | 'navigation' | 'dollar';
}

export interface TestimonialItem {
  id: string;
  name: string;
  businessName: string;
  zone: string;
  stars: number;
  quote: string;
  initials: string;
  avatarColor?: string;
  isActive: boolean;
}

export interface FaqItem {
  id: string;
  icon: 'payment' | 'video' | 'refresh' | 'lock';
  question: string;
  answer: string;
  isActive: boolean;
}

export interface PlansSpotlightConfig {
  tag: string;
  title: string;
  description: string;
  droneTitle: string;
  droneDesc: string;
  carTitle: string;
  carDesc: string;
  demoBadge: string;
  demoRoute: string;
  demoDuration: string;
  demoViews: string;
  demoVideoUrl: string;
  demoImage: string;
  demoCredit: string;
}

export interface PlansPageConfig {
  badgeText: string;
  headlinePart1: string;
  headlineHighlight: string;
  subtitle: string;
  metrics: MetricStat[];
  billingDiscountText: string;
  spotlight: PlansSpotlightConfig;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: TestimonialItem[];
  faqTitle: string;
  faqSubtitle: string;
  faqs: FaqItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaWhatsappText: string;
}

export interface PlatformSettings {
  contactWhatsapp: string;
  contactEmail: string;
  socialInstagram: string;
  socialTiktok: string;
  socialFacebook: string;
  socialYoutube?: string;
  officialAnnouncement: string;
}

export interface SiteStructureConfig {
  siteTitle: string;
  heroSubtitle: string;
  liveWeatherText: string;
  categories: string[];
  zones: string[];
  platformSettings?: PlatformSettings;
}

export interface VerificationRequest {
  id: string;
  businessName: string;
  category: string;
  zone: string;
  ownerName: string;
  whatsapp: string;
  instagram?: string;
  address?: string;
  notes?: string;
  source: 'web_form' | 'whatsapp';
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  businessId?: string;
}

export interface AdBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  badgeText: string;
  buttonText: string;
  isActive: boolean;
  positionInterval?: number;
}

// ==============================================================
// CUMANÁ EN VIVO (DESPACHOS VISUALES / HISTORIAS EN TIEMPO REAL)
// ==============================================================
export type LiveBadgeType = 'play' | 'food' | 'store' | 'music' | 'live';

export interface LiveDispatchItem {
  id: string;
  name: string;           // ej. 'El Peñón'
  subtitle: string;       // ej. 'Amanecer 06:15 AM'
  imageUrl: string;
  badgeType: LiveBadgeType;
  badgeColor?: string;    // ej. '#00C292', '#F59E0B', '#FF6B4A'
  videoUrl?: string;      // Video corto o reel opcional
  location?: string;      // ej. 'El Peñón, Golfo de Cariaco'
  description?: string;   // Detalle del despacho
  isActive: boolean;
}

export interface LiveSectionConfig {
  isEnabled: boolean;     // Switch on/off desde administración
  title: string;          // ej. 'Cumaná en Vivo'
  subtitle: string;       // ej. 'Despachos visuales de las últimas 6 horas'
  items: LiveDispatchItem[];
}

// ==============================================================
// EXPLORA POR VERTICALES (ECOSISTEMA URBANO & MARÍTIMO)
// ==============================================================
export type VerticalIconType = 'utensils' | 'bed' | 'cocktail' | 'boat' | 'coffee';
export type VerticalBadgeColor = 'teal' | 'amber' | 'slate' | 'indigo' | 'green' | 'coral';

export interface VerticalCategoryItem {
  id: string;
  title: string;          // ej. 'Gastronomía'
  subtitle: string;       // ej. '84 locales verificados'
  badgeText: string;      // ej. 'Activo', 'Costero', 'Nocturno', '45 Proveedores', 'Fibra 500M'
  badgeColor: VerticalBadgeColor;
  icon: VerticalIconType;
  imageUrl: string;
  actionText: string;     // ej. 'VER ASADORES & CALETAS →'
  actionColor?: string;   // ej. '#FF6B4A', '#F59E0B', '#00C292'
  targetCategory?: string;// vinculación para filtrar la categoría en el home ej. 'Gastronomía'
  isActive: boolean;
}

export interface VerticalsSectionConfig {
  isEnabled: boolean;     // Switch on/off desde administración
  tagline: string;        // ej. 'ECOSISTEMA URBANO & MARÍTIMO'
  title: string;          // ej. 'Explora por Verticales'
  counterText: string;    // ej. '208 comercios y experiencias curadas'
  items: VerticalCategoryItem[];
}


