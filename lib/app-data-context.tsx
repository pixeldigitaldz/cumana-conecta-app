'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Business, 
  PlanConfig, 
  SiteStructureConfig, 
  VerificationRequest,
  PlansPageConfig,
  TestimonialItem,
  FaqItem,
  MetricStat,
  AdBanner,
  LiveDispatchItem,
  LiveSectionConfig,
  VerticalCategoryItem,
  VerticalsSectionConfig
} from '@/types/business';
import { INITIAL_BUSINESSES, INITIAL_AD_BANNERS, INITIAL_LIVE_SECTION, INITIAL_VERTICALS_SECTION } from '@/lib/mock-data';
import { isBusinessOpen } from '@/lib/business-hours';
import { 
  getIndexedDBItem, 
  setIndexedDBItem, 
  getSyncChannel, 
  broadcastDataUpdate, 
  SyncMessage 
} from '@/lib/storage';

const STORAGE_KEYS = {
  BUSINESSES: 'cumana_conecta_businesses_v4',
  PLANS: 'cumana_conecta_plans_v2',
  STRUCTURE: 'cumana_conecta_structure_v2',
  REQUESTS: 'cumana_conecta_requests_v1',
  PLANS_CONTENT: 'cumana_conecta_plans_content_v2',
  ADS: 'cumana_conecta_ads_v1',
  LIVE_SECTION: 'cumana_conecta_live_section_v1',
  VERTICALS_SECTION: 'cumana_conecta_verticals_section_v1',
};

export const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: 'plan-free',
    tier: 'free',
    name: 'Plan Comunidad',
    priceMonthly: 0,
    priceYearly: 0,
    period: 'Gratis para siempre',
    tagline: 'Para todo comerciante sucrense que desea digitalizar su presencia sin costo alguno.',
    badge: 'Inclusión Local',
    featuresHeader: 'BENEFICIOS INCLUIDOS:',
    isPopular: false,
    buttonText: 'Registrar Local Gratis',
    buttonVariant: 'outline',
    features: [
      'Ficha comercial completa permanente e indexada en Google y Cumaná Conecta',
      'Foto real de portada y fachada del negocio',
      'Botón directo "Cómo Llegar" con Google Maps',
      'Carga de 1 video-ruta en formato vertical (Short/Reel)',
      'Enlaces directos a WhatsApp, Instagram y llamada telefónica',
      'Botón para compartir ficha en grupos de WhatsApp de Sucre',
      'Desglose de métodos de pago aceptados y horarios semanales'
    ],
    notIncluded: []
  },
  {
    id: 'plan-pro',
    tier: 'pro',
    name: 'Plan Destacado Pro',
    priceMonthly: 19,
    priceYearly: 180,
    period: 'mes (facturado mensual)',
    tagline: 'Para comercios consolidados que buscan triplicar pedidos y atraer clientes de toda la ciudad.',
    badge: 'MÁS POPULAR ENTRE COMERCIOS',
    featuresHeader: 'TODO LO DEL PLAN COMUNIDAD, MÁS:',
    isPopular: true,
    buttonText: 'Activar Destacado Pro',
    buttonVariant: 'primary',
    features: [
      'Posicionamiento prioritario en carrusel principal "Comercios Destacados"',
      'Top 3 garantizado en resultados por categoría y sector geográfico',
      'Insignia oficial Verificado Cumaná Conecta',
      'Botón flotante de WhatsApp directo en la pantalla del portal durante navegación',
      'Mención visual de cobros rápidos (Pago Móvil, Zelle, Binance Pay)',
      'Reporte mensual de métricas, clics y llamadas recibido vía WhatsApp'
    ],
    notIncluded: []
  },
  {
    id: 'plan-vip',
    tier: 'vip',
    name: 'Plan Destacado',
    priceMonthly: 39,
    priceYearly: 370,
    period: 'mes (facturado mensual)',
    tagline: 'La solución llave en mano para marcas líderes, franquicias, hotelería y gastronomía de alto flujo.',
    badge: 'Máxima Visibilidad',
    featuresHeader: 'TODO LO DEL PLAN PRO, MÁS:',
    isPopular: false,
    buttonText: 'Contactar Asesor',
    buttonVariant: 'vip',
    features: [
      'Banner principal rotativo en la cabecera superior del portal (Top of Fold)',
      'Producción audiovisual in situ: Sesión de fotos de fachada y grabación de Video-Ruta oficial de llegada en Cumaná',
      'Reel patrocinado mensual en @CumanaConecta (+45K seguidores en Sucre)',
      'Panel privado de analíticas avanzadas (visitas en vivo, rutas y conversiones)',
      'Asesor de marketing local asignado personalmente con soporte directo 24/7'
    ],
    notIncluded: []
  }
];

export const DEFAULT_PLANS_PAGE_CONFIG: PlansPageConfig = {
  badgeText: 'MONETIZACIÓN & DIRECTORIO COMERCIAL DE SUCRE',
  headlinePart1: 'Haz que todo Cumaná encuentre',
  headlineHighlight: 'tu negocio en su pantalla.',
  subtitle: 'Potencia tus ventas locales, elimina las llamadas de "¿cómo llego?" con videorutas en 60s y conecta pedidos directamente a tu WhatsApp comercial sin comisiones intermedias.',
  metrics: [
    {
      id: 'metric-1',
      value: '+35,000',
      label: 'Visitas Mensuales en Sucre',
      tag: '📈 Mes activo',
      tagColor: 'green',
      icon: 'eye'
    },
    {
      id: 'metric-2',
      value: '+18,400',
      label: 'Clics Directos a WhatsApp',
      tag: '+28% este mes',
      tagColor: 'green',
      subtext: '● Conversión de compra directa',
      icon: 'chat'
    },
    {
      id: 'metric-3',
      value: '+9,200',
      label: 'Rutas Trazadas en Maps',
      tag: '📍 GPS Activo',
      tagColor: 'orange',
      subtext: 'San Luis, Centro, El Peñón',
      icon: 'navigation'
    },
    {
      id: 'metric-4',
      value: '4.9x',
      label: 'Retorno Estimado (ROI)',
      tag: 'Comprobado',
      tagColor: 'coral',
      subtext: 'vs Publicidad tradicional',
      icon: 'dollar'
    }
  ],
  billingDiscountText: 'Ahorra 20% en Plan Semestral',
  spotlight: {
    tag: 'EXCLUSIVO PLANES PRO & DESTACADO',
    title: '¿Por qué la Video–Ruta en 60s duplica tus visitas?',
    description: 'En Cumaná, las indicaciones informales como "después de la redoma, cruzas en la mata de mango" hacen que el 30% de los clientes se frustre y se vaya a otro local. Creamos un clip vertical cinematográfico que muestra el punto de partida icónico (El Monumento, Puente Guzmán Blanco o Av. Perimetral) hasta el estacionamiento de tu negocio.',
    droneTitle: 'Puntos de Referencia Claros',
    droneDesc: 'Mostramos la avenida principal, cruces clave y fachada exacta para que nadie se pierda.',
    carTitle: 'Trayecto en Auto y a Pie',
    carDesc: 'Conectamos la avenida principal con la puerta y área de caja de tu local.',
    demoBadge: 'RUTA OFICIAL VERIFICADA',
    demoRoute: 'El Peñón → La Terraza del Golfo',
    demoDuration: 'Duración: 52 segundos • 14,800 reproducciones locales',
    demoViews: '14,800',
    demoVideoUrl: '/sample-videoruta.mp4',
    demoImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    demoCredit: 'Grabado por el equipo audiovisual local'
  },
  testimonialsTitle: 'Historias de éxito en nuestras avenidas',
  testimonialsSubtitle: 'Desde El Peñón hasta San Luis, los emprendedores de Cumaná ya multiplican sus contactos directos.',
  testimonials: [
    {
      id: 'test-1',
      name: 'Carlos Marval',
      businessName: 'Dueño de La Terraza del Golfo',
      zone: 'El Peñón',
      stars: 5,
      quote: 'Desde que los clientes ven el video de la ruta desde El Monumento, ya nadie se pierde ni nos llama 5 veces para preguntar la dirección. Los pedidos por WhatsApp aumentaron 40%.',
      initials: 'CM',
      avatarColor: 'coral',
      isActive: true
    },
    {
      id: 'test-2',
      name: 'Elena Rodríguez',
      businessName: 'Posada Bahía Azul',
      zone: 'Playa San Luis',
      stars: 5,
      quote: 'El sello de Comercio Destacado y el desglose de pago verificado por Zelle y Pago Móvil le dio total confianza a los turistas que vienen de Caracas y Puerto La Cruz a hospedarse en San Luis.',
      initials: 'ER',
      avatarColor: 'green',
      isActive: true
    },
    {
      id: 'test-3',
      name: 'Misael Toledo',
      businessName: 'Taller Golfo Motor',
      zone: 'Av. Carúpano',
      stars: 5,
      quote: 'Empezamos con el plan gratis y a los dos meses pasamos a Pro. Es la mejor inversión en publicidad local de Cumaná: llamadas reales y directo por repuestos automotrices.',
      initials: 'MT',
      avatarColor: 'slate',
      isActive: true
    }
  ],
  faqTitle: 'Preguntas Claras sobre la Membresía',
  faqSubtitle: 'Respuestas claras adaptadas al comercio del Estado Sucre.',
  faqs: [
    {
      id: 'faq-1',
      icon: 'payment',
      question: '¿Cómo se pagan las suscripciones en Venezuela?',
      answer: 'Aceptamos Pago Móvil y Transferencias Bancarias calculadas a la tasa oficial del Banco Central de Venezuela (BCV) del día. También recibimos pagos vía Zelle, Binance Pay USDT y Efectivo con factura digital.',
      isActive: true
    },
    {
      id: 'faq-2',
      icon: 'video',
      question: '¿Ustedes graban el video de "Cómo Llegar"?',
      answer: 'Sí. Nuestro equipo de producción audiovisual radicado en Cumaná coordina una visita a tu local en la fecha convenida para grabar el recorrido exacto desde el punto de referencia más conocido de la zona.',
      isActive: true
    },
    {
      id: 'faq-3',
      icon: 'refresh',
      question: '¿Puedo pausar o cancelar en cualquier momento?',
      answer: 'Totalmente. Las suscripciones mensuales no tienen contratos de permanencia ni cláusulas forzosas. Puedes cancelar o congelar tu membresía en un clic antes del siguiente ciclo de facturación.',
      isActive: true
    },
    {
      id: 'faq-4',
      icon: 'lock',
      question: '¿Qué requisitos piden para la insignia verificada?',
      answer: 'Verificamos la operatividad real en el Estado Sucre: número RIF comercial o acreditación de artesano/prestador de servicio, punto de contacto activo y coordenadas exactas validadas físicamente.',
      isActive: true
    }
  ],
  ctaTitle: '¿Tienes dudas o prefieres hablar con una persona?',
  ctaSubtitle: 'Nuestro equipo operativo está ubicado en Cumaná listo para asesorar a tu comercio hoy.',
  ctaWhatsappText: 'Hablar por WhatsApp'
};

export const DEFAULT_STRUCTURE: SiteStructureConfig = {
  siteTitle: 'Todo el comercio de Cumaná en un solo lugar.',
  heroSubtitle: 'Descubre comercios locales, videorutas de llegada verificadas y contacto directo por WhatsApp desde el Casco Histórico hasta las costas de Los Bordones.',
  liveWeatherText: '☀️ 28°C · Cumaná, Edo. Sucre, Venezuela · Brisa Marina NNE 11 kts · Golfo de Cariaco',
  categories: [
    'Gastronomía & Asadores',
    'Playas & Posadas',
    'Comercio & Tiendas',
    'Salud & Farmacias',
    'Servicios Técnicos',
    'Náutica & Varaderos'
  ],
  zones: [
    'Los Bordones',
    'Casco Histórico',
    'Av. Perimetral',
    'San Luis',
    'Cantarrana',
    'Puerto Sucre',
    'El Salado',
    'Sector Centro',
    'Av. Bermúdez',
    'Av. Universidad',
    'Los Chaimas',
    'CC Hipergalerías',
    'Av. Andrés Eloy Blanco',
    'Av. Santa Rosa',
    'Av. Carúpano'
  ],
  platformSettings: {
    contactWhatsapp: 'https://wa.me/584147778899',
    contactEmail: 'contacto@cumanaconecta.com',
    socialInstagram: 'https://instagram.com/cumanaconecta',
    socialTiktok: 'https://tiktok.com/@cumanaconecta',
    socialFacebook: 'https://facebook.com/cumanaconecta',
    socialYoutube: 'https://youtube.com/@cumanaconecta',
    officialAnnouncement: 'Directorio digital oficial y georutas del Estado Sucre, Venezuela.'
  }
};

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'req-1',
    businessName: 'Heladería & Café Golfo Real',
    category: 'Gastronomía & Asadores',
    zone: 'Casco Histórico',
    ownerName: 'Carlos Luis Benítez',
    whatsapp: 'https://wa.me/584147891234',
    instagram: 'https://instagram.com/heladeriagolforeal',
    address: 'Calle Sucre frente a Plaza Bolívar, Casco Histórico',
    notes: 'Tenemos 15 años operando en Cumaná. Solicitamos el check oficial de verificación para dar autenticidad a turistas.',
    source: 'whatsapp',
    status: 'pending',
    createdAt: '2026-10-12T18:30:00Z'
  },
  {
    id: 'req-2',
    businessName: 'Náutica & Taller El Morro',
    category: 'Náutica & Varaderos',
    zone: 'Puerto Sucre',
    ownerName: 'Ing. Mariana Salazar',
    whatsapp: 'https://wa.me/584248882233',
    instagram: 'https://instagram.com/nauticaelmorro',
    address: 'Sector El Dique, cerca del Varadero Central',
    notes: 'Solicitamos verificación de servicios mecánicos marítimos y repuestos para peñeros y lanchas.',
    source: 'web_form',
    status: 'pending',
    createdAt: '2026-10-12T19:15:00Z'
  },
  {
    id: 'req-3',
    businessName: 'Farmacia San Antonio 24H',
    category: 'Salud & Farmacias',
    zone: 'Cantarrana',
    ownerName: 'Dra. Elena Rivas',
    whatsapp: 'https://wa.me/584129994455',
    instagram: 'https://instagram.com/farmaciasanantonio24h',
    address: 'Av. Rotaria, local 4',
    notes: 'Farmacia de turno permanente con planta eléctrica activa.',
    source: 'whatsapp',
    status: 'verified',
    createdAt: '2026-10-11T14:00:00Z'
  }
];

interface AppDataContextType {
  businesses: Business[];
  plans: PlanConfig[];
  structure: SiteStructureConfig;
  verificationRequests: VerificationRequest[];
  plansPageConfig: PlansPageConfig;
  // Acciones de Negocios
  addBusiness: (business: Omit<Business, 'id' | 'createdAt'>) => Business;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  deleteBusiness: (id: string) => void;
  toggleVideoRouteFeed: (id: string, showInFeed?: boolean) => void;
  changeBusinessTier: (id: string, tier: Business['tier']) => void;
  changeBusinessStatus: (id: string, status: Business['status']) => void;
  toggleBusinessVerification: (businessId: string) => void;
  resetBusinessesToDefault: () => void;
  // Acciones de Verificación & Solicitudes
  addVerificationRequest: (req: Omit<VerificationRequest, 'id' | 'createdAt' | 'status'>) => void;
  approveVerificationRequest: (requestId: string) => void;
  rejectVerificationRequest: (requestId: string) => void;
  deleteVerificationRequest: (requestId: string) => void;
  // Acciones de Planes
  updatePlan: (id: string, updates: Partial<PlanConfig>) => void;
  resetPlansToDefault: () => void;
  addPlanBenefit: (planId: string, benefit: string) => void;
  removePlanBenefit: (planId: string, index: number) => void;
  // Acciones de Contenido de Planes & Suscripciones (Métricas, Spotlight, Testimonios, FAQs)
  updatePlansPageConfig: (updates: Partial<PlansPageConfig>) => void;
  updateMetricStat: (id: string, updates: Partial<MetricStat>) => void;
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => void;
  updateTestimonial: (id: string, updates: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;
  toggleTestimonialActive: (id: string) => void;
  addFaq: (item: Omit<FaqItem, 'id'>) => void;
  updateFaq: (id: string, updates: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  toggleFaqActive: (id: string) => void;
  resetPlansPageConfigToDefault: () => void;
  // Acciones de Estructura
  updateStructure: (updates: Partial<SiteStructureConfig>) => void;
  updatePlatformSettings: (settings: Partial<NonNullable<SiteStructureConfig['platformSettings']>>) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  addZone: (zone: string) => void;
  removeZone: (zone: string) => void;
  resetStructureToDefault: () => void;
  // Acciones de Publicidad & Banners
  adBanners: AdBanner[];
  addAdBanner: (banner: Omit<AdBanner, 'id'>) => AdBanner;
  updateAdBanner: (id: string, updates: Partial<AdBanner>) => void;
  deleteAdBanner: (id: string) => void;
  toggleAdBannerActive: (id: string) => void;
  resetAdBannersToDefault: () => void;
  // Cumaná en Vivo & Explora por Verticales
  liveSectionConfig: LiveSectionConfig;
  updateLiveSectionConfig: (updates: Partial<LiveSectionConfig>) => void;
  toggleLiveSectionEnabled: () => void;
  addLiveDispatchItem: (item: Omit<LiveDispatchItem, 'id'>) => LiveDispatchItem;
  updateLiveDispatchItem: (id: string, updates: Partial<LiveDispatchItem>) => void;
  deleteLiveDispatchItem: (id: string) => void;
  toggleLiveDispatchActive: (id: string) => void;
  resetLiveSectionToDefault: () => void;
  verticalsSectionConfig: VerticalsSectionConfig;
  updateVerticalsSectionConfig: (updates: Partial<VerticalsSectionConfig>) => void;
  toggleVerticalsSectionEnabled: () => void;
  addVerticalCategoryItem: (item: Omit<VerticalCategoryItem, 'id'>) => VerticalCategoryItem;
  updateVerticalCategoryItem: (id: string, updates: Partial<VerticalCategoryItem>) => void;
  deleteVerticalCategoryItem: (id: string) => void;
  toggleVerticalCategoryActive: (id: string) => void;
  resetVerticalsSectionToDefault: () => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [plans, setPlans] = useState<PlanConfig[]>(DEFAULT_PLANS);
  const [structure, setStructure] = useState<SiteStructureConfig>(DEFAULT_STRUCTURE);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(INITIAL_VERIFICATION_REQUESTS);
  const [plansPageConfig, setPlansPageConfig] = useState<PlansPageConfig>(DEFAULT_PLANS_PAGE_CONFIG);
  const [adBanners, setAdBanners] = useState<AdBanner[]>(INITIAL_AD_BANNERS);
  const [liveSectionConfig, setLiveSectionConfig] = useState<LiveSectionConfig>(INITIAL_LIVE_SECTION);
  const [verticalsSectionConfig, setVerticalsSectionConfig] = useState<VerticalsSectionConfig>(INITIAL_VERTICALS_SECTION);
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeTick, setTimeTick] = useState(0);

  // Intervalo de actualización en tiempo real para el estado Abierto/Cerrado (cada 30 segundos)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick(t => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Cargar de almacenamiento (localStorage para inicio instantáneo + IndexedDB para datos completos e imágenes HD)
  useEffect(() => {
    let localLoadedBiz: Business[] | null = null;
    let localLoadedPlans: PlanConfig[] | null = null;
    let localLoadedStructure: SiteStructureConfig | null = null;
    let localLoadedRequests: VerificationRequest[] | null = null;
    let localLoadedPlansContent: PlansPageConfig | null = null;
    let localLoadedAds: AdBanner[] | null = null;
    let localLoadedLive: LiveSectionConfig | null = null;
    let localLoadedVert: VerticalsSectionConfig | null = null;

    // 1. Carga inicial rápida desde localStorage (primer render síncrono para evitar parpadeos)
    try {
      const storedBiz = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
      if (storedBiz) {
        const parsed = JSON.parse(storedBiz);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localLoadedBiz = parsed;
          const existingIds = new Set(parsed.map((b: Business) => b.id));
          const missingDefaults = INITIAL_BUSINESSES.filter(b => !existingIds.has(b.id));
          if (missingDefaults.length > 0) {
            setBusinesses([...parsed, ...missingDefaults]);
          } else {
            setBusinesses(parsed);
          }
        }
      }

      const storedPlans = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (storedPlans) {
        let parsed = JSON.parse(storedPlans);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localLoadedPlans = parsed;
          setPlans(parsed);
        }
      }

      const storedStructure = localStorage.getItem(STORAGE_KEYS.STRUCTURE);
      if (storedStructure) {
        const parsed = JSON.parse(storedStructure);
        if (parsed && Array.isArray(parsed.categories)) {
          localLoadedStructure = parsed;
          setStructure(parsed);
        }
      }

      const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (storedRequests) {
        const parsed = JSON.parse(storedRequests);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localLoadedRequests = parsed;
          setVerificationRequests(parsed);
        }
      }

      const storedPlansContent = localStorage.getItem(STORAGE_KEYS.PLANS_CONTENT);
      if (storedPlansContent) {
        const parsed = JSON.parse(storedPlansContent);
        if (parsed && Array.isArray(parsed.metrics)) {
          localLoadedPlansContent = parsed;
          setPlansPageConfig(parsed);
        }
      }

      const storedAds = localStorage.getItem(STORAGE_KEYS.ADS);
      if (storedAds) {
        const parsed = JSON.parse(storedAds);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localLoadedAds = parsed;
          setAdBanners(parsed);
        }
      }

      const storedLive = localStorage.getItem(STORAGE_KEYS.LIVE_SECTION);
      if (storedLive) {
        try {
          const parsed = JSON.parse(storedLive);
          if (parsed && typeof parsed.isEnabled === 'boolean' && Array.isArray(parsed.items)) {
            localLoadedLive = parsed;
            setLiveSectionConfig(parsed);
          }
        } catch (e) {}
      }

      const storedVert = localStorage.getItem(STORAGE_KEYS.VERTICALS_SECTION);
      if (storedVert) {
        try {
          const parsed = JSON.parse(storedVert);
          if (parsed && typeof parsed.isEnabled === 'boolean' && Array.isArray(parsed.items)) {
            localLoadedVert = parsed;
            setVerticalsSectionConfig(parsed);
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error('Error loading initial data from localStorage', e);
    }

    // 2. Hidratación asíncrona desde IndexedDB (sin límite de 5MB, fotos HD preservadas)
    // NOTA CLAVE: isLoaded sólo se pasa a true AQUÍ para que ningún useEffect sobreescriba IndexedDB con datos por defecto antes de leerlos.
    const hydrateFromIndexedDB = async () => {
      try {
        const [dbBiz, dbLive, dbVert, dbAds, dbStructure, dbPlans, dbRequests, dbPlansContent] = await Promise.all([
          getIndexedDBItem<Business[]>(STORAGE_KEYS.BUSINESSES),
          getIndexedDBItem<LiveSectionConfig>(STORAGE_KEYS.LIVE_SECTION),
          getIndexedDBItem<VerticalsSectionConfig>(STORAGE_KEYS.VERTICALS_SECTION),
          getIndexedDBItem<AdBanner[]>(STORAGE_KEYS.ADS),
          getIndexedDBItem<SiteStructureConfig>(STORAGE_KEYS.STRUCTURE),
          getIndexedDBItem<PlanConfig[]>(STORAGE_KEYS.PLANS),
          getIndexedDBItem<VerificationRequest[]>(STORAGE_KEYS.REQUESTS),
          getIndexedDBItem<PlansPageConfig>(STORAGE_KEYS.PLANS_CONTENT)
        ]);

        if (dbBiz && Array.isArray(dbBiz) && dbBiz.length > 0) {
          const bizMap = new Map<string, Business>();
          // Defaults primero
          INITIAL_BUSINESSES.forEach(b => bizMap.set(b.id, b));
          // localStorage segundo
          if (localLoadedBiz) {
            localLoadedBiz.forEach(b => bizMap.set(b.id, b));
          }
          // IndexedDB como máxima autoridad (incluye fotos completas y registros nuevos)
          dbBiz.forEach(b => bizMap.set(b.id, b));
          setBusinesses(Array.from(bizMap.values()));
        } else if (localLoadedBiz && localLoadedBiz.length > 0) {
          setIndexedDBItem(STORAGE_KEYS.BUSINESSES, localLoadedBiz);
        } else {
          setIndexedDBItem(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
        }

        if (dbLive && typeof dbLive.isEnabled === 'boolean' && Array.isArray(dbLive.items)) {
          setLiveSectionConfig(dbLive);
        } else if (localLoadedLive) {
          setIndexedDBItem(STORAGE_KEYS.LIVE_SECTION, localLoadedLive);
        }

        if (dbVert && typeof dbVert.isEnabled === 'boolean' && Array.isArray(dbVert.items)) {
          setVerticalsSectionConfig(dbVert);
        } else if (localLoadedVert) {
          setIndexedDBItem(STORAGE_KEYS.VERTICALS_SECTION, localLoadedVert);
        }

        if (dbAds && Array.isArray(dbAds) && dbAds.length > 0) {
          setAdBanners(dbAds);
        } else if (localLoadedAds) {
          setIndexedDBItem(STORAGE_KEYS.ADS, localLoadedAds);
        }

        if (dbStructure && Array.isArray(dbStructure.categories)) {
          setStructure(dbStructure);
        } else if (localLoadedStructure) {
          setIndexedDBItem(STORAGE_KEYS.STRUCTURE, localLoadedStructure);
        }

        if (dbPlans && Array.isArray(dbPlans) && dbPlans.length > 0) {
          setPlans(dbPlans);
        } else if (localLoadedPlans) {
          setIndexedDBItem(STORAGE_KEYS.PLANS, localLoadedPlans);
        }

        if (dbRequests && Array.isArray(dbRequests) && dbRequests.length > 0) {
          setVerificationRequests(dbRequests);
        } else if (localLoadedRequests) {
          setIndexedDBItem(STORAGE_KEYS.REQUESTS, localLoadedRequests);
        }

        if (dbPlansContent && Array.isArray(dbPlansContent.metrics)) {
          setPlansPageConfig(dbPlansContent);
        } else if (localLoadedPlansContent) {
          setIndexedDBItem(STORAGE_KEYS.PLANS_CONTENT, localLoadedPlansContent);
        }
      } catch (err) {
        console.warn('Error hidratando desde IndexedDB:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    hydrateFromIndexedDB();
  }, []);

  // Sincronización en tiempo real entre múltiples pestañas y ventanas
  useEffect(() => {
    // A. BroadcastChannel: Notificación instantánea entre pestañas abiertas (<10ms)
    const channel = getSyncChannel();
    const handleSyncMessage = (event: MessageEvent<SyncMessage>) => {
      if (!event.data || event.data.type !== 'SYNC_UPDATE') return;
      const { key, payload } = event.data;

      if (key === STORAGE_KEYS.BUSINESSES && Array.isArray(payload)) {
        setBusinesses(payload);
      } else if (key === STORAGE_KEYS.PLANS && Array.isArray(payload)) {
        setPlans(payload);
      } else if (key === STORAGE_KEYS.STRUCTURE && payload) {
        setStructure(payload);
      } else if (key === STORAGE_KEYS.ADS && Array.isArray(payload)) {
        setAdBanners(payload);
      } else if (key === STORAGE_KEYS.LIVE_SECTION && payload) {
        setLiveSectionConfig(payload);
      } else if (key === STORAGE_KEYS.VERTICALS_SECTION && payload) {
        setVerticalsSectionConfig(payload);
      } else if (key === STORAGE_KEYS.PLANS_CONTENT && payload) {
        setPlansPageConfig(payload);
      } else if (key === STORAGE_KEYS.REQUESTS && Array.isArray(payload)) {
        setVerificationRequests(payload);
      }
    };

    if (channel) {
      channel.addEventListener('message', handleSyncMessage);
    }

    // B. StorageEvent: Fallback nativo del navegador
    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (e.key === STORAGE_KEYS.BUSINESSES && Array.isArray(parsed)) {
          setBusinesses(parsed);
        } else if (e.key === STORAGE_KEYS.PLANS && Array.isArray(parsed)) {
          setPlans(parsed);
        } else if (e.key === STORAGE_KEYS.STRUCTURE && parsed) {
          setStructure(parsed);
        } else if (e.key === STORAGE_KEYS.ADS && Array.isArray(parsed)) {
          setAdBanners(parsed);
        } else if (e.key === STORAGE_KEYS.LIVE_SECTION && parsed) {
          setLiveSectionConfig(parsed);
        } else if (e.key === STORAGE_KEYS.VERTICALS_SECTION && parsed) {
          setVerticalsSectionConfig(parsed);
        } else if (e.key === STORAGE_KEYS.PLANS_CONTENT && parsed) {
          setPlansPageConfig(parsed);
        } else if (e.key === STORAGE_KEYS.REQUESTS && Array.isArray(parsed)) {
          setVerificationRequests(parsed);
        }
      } catch (err) {}
    };
    window.addEventListener('storage', handleStorageEvent);

    // C. Re-comprobación al volver a enfocar la pestaña (visibilidad activa)
    const handleFocusSync = async () => {
      try {
        const dbBiz = await getIndexedDBItem<Business[]>(STORAGE_KEYS.BUSINESSES);
        if (dbBiz && Array.isArray(dbBiz) && dbBiz.length > 0) {
          setBusinesses(dbBiz);
        }
        const dbLive = await getIndexedDBItem<LiveSectionConfig>(STORAGE_KEYS.LIVE_SECTION);
        if (dbLive) setLiveSectionConfig(dbLive);
        const dbVert = await getIndexedDBItem<VerticalsSectionConfig>(STORAGE_KEYS.VERTICALS_SECTION);
        if (dbVert) setVerticalsSectionConfig(dbVert);
        const dbAds = await getIndexedDBItem<AdBanner[]>(STORAGE_KEYS.ADS);
        if (dbAds) setAdBanners(dbAds);
      } catch (err) {}
    };

    window.addEventListener('focus', handleFocusSync);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleFocusSync();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (channel) channel.removeEventListener('message', handleSyncMessage);
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('focus', handleFocusSync);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Guardar en IndexedDB y localStorage con sincronización en tiempo real
  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.BUSINESSES, businesses);
      try {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
      } catch (e) {
        // En caso de que las fotos excedan los 5MB de LocalStorage, los datos quedan preservados en IndexedDB
        console.warn('LocalStorage excedió límite de 5MB; fotos y datos guardados de forma segura en IndexedDB');
      }
      broadcastDataUpdate(STORAGE_KEYS.BUSINESSES, businesses);
    }
  }, [businesses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.PLANS, plans);
      try {
        localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
      } catch (e) {
        console.warn('LocalStorage limit reached for plans', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.PLANS, plans);
    }
  }, [plans, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.STRUCTURE, structure);
      try {
        localStorage.setItem(STORAGE_KEYS.STRUCTURE, JSON.stringify(structure));
      } catch (e) {
        console.warn('LocalStorage limit reached for structure', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.STRUCTURE, structure);
    }
  }, [structure, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.REQUESTS, verificationRequests);
      try {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(verificationRequests));
      } catch (e) {
        console.warn('LocalStorage limit reached for requests', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.REQUESTS, verificationRequests);
    }
  }, [verificationRequests, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.PLANS_CONTENT, plansPageConfig);
      try {
        localStorage.setItem(STORAGE_KEYS.PLANS_CONTENT, JSON.stringify(plansPageConfig));
      } catch (e) {
        console.warn('LocalStorage limit reached for plans content', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.PLANS_CONTENT, plansPageConfig);
    }
  }, [plansPageConfig, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.ADS, adBanners);
      try {
        localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(adBanners));
      } catch (e) {
        console.warn('LocalStorage limit reached for ads', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.ADS, adBanners);
    }
  }, [adBanners, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.LIVE_SECTION, liveSectionConfig);
      try {
        localStorage.setItem(STORAGE_KEYS.LIVE_SECTION, JSON.stringify(liveSectionConfig));
      } catch (e) {
        console.warn('LocalStorage limit reached for live section', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.LIVE_SECTION, liveSectionConfig);
    }
  }, [liveSectionConfig, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setIndexedDBItem(STORAGE_KEYS.VERTICALS_SECTION, verticalsSectionConfig);
      try {
        localStorage.setItem(STORAGE_KEYS.VERTICALS_SECTION, JSON.stringify(verticalsSectionConfig));
      } catch (e) {
        console.warn('LocalStorage limit reached for verticals section', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.VERTICALS_SECTION, verticalsSectionConfig);
    }
  }, [verticalsSectionConfig, isLoaded]);

  // Comercios con cálculo de estado en tiempo real (Abierto / Cerrado) según su horario
  const realtimeBusinesses = useMemo(() => {
    return businesses.map(b => ({
      ...b,
      isOpenNow: isBusinessOpen(b.openingHours)
    }));
  }, [businesses, timeTick]);

  // Funciones de Negocios con persistencia inmediata y segura
  const addBusiness = (businessData: Omit<Business, 'id' | 'createdAt'>): Business => {
    const newId = `biz-${Date.now()}`;
    const isOpen = isBusinessOpen(businessData.openingHours);
    const newBiz: Business = {
      ...businessData,
      isOpenNow: isOpen,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBusinesses(prev => {
      const next = [newBiz, ...prev.filter(b => b.id !== newId)];
      // Escritura inmediata en disco (IndexedDB sin límite + localStorage de respaldo)
      setIndexedDBItem(STORAGE_KEYS.BUSINESSES, next);
      try {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage limit reached on addBusiness, safely stored in IndexedDB', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.BUSINESSES, next);
      return next;
    });
    return newBiz;
  };

  const updateBusiness = (id: string, updates: Partial<Business>) => {
    setBusinesses(prev => {
      const next = prev.map(b => {
        if (b.id !== id) return b;
        const merged = { ...b, ...updates };
        if (updates.openingHours !== undefined) {
          merged.isOpenNow = isBusinessOpen(merged.openingHours);
        }
        return merged;
      });
      setIndexedDBItem(STORAGE_KEYS.BUSINESSES, next);
      try {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage limit reached on updateBusiness, safely stored in IndexedDB', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.BUSINESSES, next);
      return next;
    });
  };

  const deleteBusiness = (id: string) => {
    setBusinesses(prev => {
      const next = prev.filter(b => b.id !== id);
      setIndexedDBItem(STORAGE_KEYS.BUSINESSES, next);
      try {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage limit reached on deleteBusiness', e);
      }
      broadcastDataUpdate(STORAGE_KEYS.BUSINESSES, next);
      return next;
    });
  };

  const toggleVideoRouteFeed = (id: string, forceShow?: boolean) => {
    setBusinesses(prev => {
      const next = prev.map(b => {
        if (b.id !== id || !b.videoRoute) return b;
        const current = b.videoRoute.showInFeed !== false;
        const nextVal = forceShow !== undefined ? forceShow : !current;
        return {
          ...b,
          videoRoute: {
            ...b.videoRoute,
            showInFeed: nextVal
          }
        };
      });
      setIndexedDBItem(STORAGE_KEYS.BUSINESSES, next);
      try {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(next));
      } catch (e) {}
      broadcastDataUpdate(STORAGE_KEYS.BUSINESSES, next);
      return next;
    });
  };

  const changeBusinessTier = (id: string, tier: Business['tier']) => {
    updateBusiness(id, { tier });
  };

  const changeBusinessStatus = (id: string, status: Business['status']) => {
    updateBusiness(id, { status });
  };

  // Alternar verificación directa de cualquier comercio
  const toggleBusinessVerification = (businessId: string) => {
    setBusinesses(prev => {
      const next = prev.map(b => {
        if (b.id !== businessId) return b;
        return {
          ...b,
          isVerified: !b.isVerified
        };
      });
      setIndexedDBItem(STORAGE_KEYS.BUSINESSES, next);
      try {
        localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(next));
      } catch (e) {}
      broadcastDataUpdate(STORAGE_KEYS.BUSINESSES, next);
      return next;
    });
  };

  const resetBusinessesToDefault = () => {
    setBusinesses(INITIAL_BUSINESSES);
    setIndexedDBItem(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
    try {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    } catch (e) {}
    broadcastDataUpdate(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
  };

  // Funciones de Solicitudes y Verificación
  const addVerificationRequest = (reqData: Omit<VerificationRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: VerificationRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setVerificationRequests(prev => [newReq, ...prev]);
  };

  const approveVerificationRequest = (requestId: string) => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (!req) return;

    // Actualizar solicitud a verified
    setVerificationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'verified' } : r));

    // Buscar si ya existe el comercio por nombre o id
    const existing = businesses.find(b => 
      b.id === req.businessId || 
      b.name.toLowerCase().trim() === req.businessName.toLowerCase().trim()
    );

    if (existing) {
      updateBusiness(existing.id, {
        isVerified: true,
        status: 'active'
      });
    } else {
      // Crear automáticamente el comercio verificado
      const slug = req.businessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      addBusiness({
        name: req.businessName,
        slug,
        tagline: req.notes || 'Comercio con verificación oficial de Cumaná Conecta',
        description: req.notes || `Establecimiento oficial verificado. Propietario/Responsable: ${req.ownerName}.`,
        category: req.category || structure.categories[0] || 'Comercio & Tiendas',
        zone: req.zone || structure.zones[0] || 'Casco Histórico',
        address: req.address || 'Cumaná, Estado Sucre',
        mapsUrl: '',
        socials: {
          whatsapp: req.whatsapp.startsWith('http') ? req.whatsapp : `https://wa.me/${req.whatsapp.replace(/\D/g, '')}`,
          instagram: req.instagram || '',
          facebook: '',
          tiktok: '',
          website: ''
        },
        tier: 'pro',
        rating: 5.0,
        reviewsCount: 1,
        heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        gallery: [],
        isOpenNow: true,
        openingHours: '8:00 AM - 6:00 PM',
        isVerified: true,
        status: 'active',
        paymentMethods: ['pago_movil', 'efectivo_usd'],
        amenities: ['planta_electrica'],
        videoRoute: undefined
      });
    }
  };

  const rejectVerificationRequest = (requestId: string) => {
    setVerificationRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
  };

  const deleteVerificationRequest = (requestId: string) => {
    setVerificationRequests(prev => prev.filter(r => r.id !== requestId));
  };

  // Funciones de Planes
  const updatePlan = (id: string, updates: Partial<PlanConfig>) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const resetPlansToDefault = () => {
    setPlans(DEFAULT_PLANS);
  };

  const addPlanBenefit = (planId: string, benefit: string) => {
    const trimmed = benefit.trim();
    if (!trimmed) return;
    setPlans(prev => prev.map(p => {
      if (p.id === planId || p.tier === planId) {
        return { ...p, features: [...p.features, trimmed] };
      }
      return p;
    }));
  };

  const removePlanBenefit = (planId: string, index: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId || p.tier === planId) {
        return { ...p, features: p.features.filter((_, i) => i !== index) };
      }
      return p;
    }));
  };

  // Funciones de Contenido de Planes & Suscripciones (Métricas, Spotlight, Testimonios, FAQs)
  const updatePlansPageConfig = (updates: Partial<PlansPageConfig>) => {
    setPlansPageConfig(prev => ({ ...prev, ...updates }));
  };

  const updateMetricStat = (id: string, updates: Partial<MetricStat>) => {
    setPlansPageConfig(prev => ({
      ...prev,
      metrics: prev.metrics.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  };

  const addTestimonial = (item: Omit<TestimonialItem, 'id'>) => {
    const newItem: TestimonialItem = {
      ...item,
      id: `test-${Date.now()}`
    };
    setPlansPageConfig(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newItem]
    }));
  };

  const updateTestimonial = (id: string, updates: Partial<TestimonialItem>) => {
    setPlansPageConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTestimonial = (id: string) => {
    setPlansPageConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
  };

  const toggleTestimonialActive = (id: string) => {
    setPlansPageConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t)
    }));
  };

  const addFaq = (item: Omit<FaqItem, 'id'>) => {
    const newItem: FaqItem = {
      ...item,
      id: `faq-${Date.now()}`
    };
    setPlansPageConfig(prev => ({
      ...prev,
      faqs: [...prev.faqs, newItem]
    }));
  };

  const updateFaq = (id: string, updates: Partial<FaqItem>) => {
    setPlansPageConfig(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...f, ...updates } : f)
    }));
  };

  const deleteFaq = (id: string) => {
    setPlansPageConfig(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id)
    }));
  };

  const toggleFaqActive = (id: string) => {
    setPlansPageConfig(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f)
    }));
  };

  const resetPlansPageConfigToDefault = () => {
    setPlansPageConfig(DEFAULT_PLANS_PAGE_CONFIG);
  };

  // Funciones de Estructura
  const updateStructure = (updates: Partial<SiteStructureConfig>) => {
    setStructure(prev => ({ ...prev, ...updates }));
  };

  const updatePlatformSettings = (settings: Partial<NonNullable<SiteStructureConfig['platformSettings']>>) => {
    setStructure(prev => ({
      ...prev,
      platformSettings: {
        ...(prev.platformSettings || DEFAULT_STRUCTURE.platformSettings!),
        ...settings
      }
    }));
  };

  const addCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;
    setStructure(prev => {
      if (prev.categories.includes(trimmed)) return prev;
      return { ...prev, categories: [...prev.categories, trimmed] };
    });
  };

  const removeCategory = (category: string) => {
    setStructure(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const addZone = (zone: string) => {
    const trimmed = zone.trim();
    if (!trimmed) return;
    setStructure(prev => {
      if (prev.zones.includes(trimmed)) return prev;
      return { ...prev, zones: [...prev.zones, trimmed] };
    });
  };

  const removeZone = (zone: string) => {
    setStructure(prev => ({
      ...prev,
      zones: prev.zones.filter(z => z !== zone)
    }));
  };

  const resetStructureToDefault = () => {
    setStructure(DEFAULT_STRUCTURE);
  };

  // Funciones de Publicidad & Banners Patrocinados
  const addAdBanner = (bannerData: Omit<AdBanner, 'id'>): AdBanner => {
    const newBanner: AdBanner = {
      ...bannerData,
      id: `ad-${Date.now()}`
    };
    setAdBanners(prev => [newBanner, ...prev]);
    return newBanner;
  };

  const updateAdBanner = (id: string, updates: Partial<AdBanner>) => {
    setAdBanners(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAdBanner = (id: string) => {
    setAdBanners(prev => prev.filter(a => a.id !== id));
  };

  const toggleAdBannerActive = (id: string) => {
    setAdBanners(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const resetAdBannersToDefault = () => {
    setAdBanners(INITIAL_AD_BANNERS);
  };

  // Funciones de Cumaná en Vivo
  const updateLiveSectionConfig = (updates: Partial<LiveSectionConfig>) => {
    setLiveSectionConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleLiveSectionEnabled = () => {
    setLiveSectionConfig(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  const addLiveDispatchItem = (itemData: Omit<LiveDispatchItem, 'id'>): LiveDispatchItem => {
    const newItem: LiveDispatchItem = {
      ...itemData,
      id: `live-${Date.now()}`
    };
    setLiveSectionConfig(prev => ({
      ...prev,
      items: [newItem, ...prev.items]
    }));
    return newItem;
  };

  const updateLiveDispatchItem = (id: string, updates: Partial<LiveDispatchItem>) => {
    setLiveSectionConfig(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const deleteLiveDispatchItem = (id: string) => {
    setLiveSectionConfig(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const toggleLiveDispatchActive = (id: string) => {
    setLiveSectionConfig(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
    }));
  };

  const resetLiveSectionToDefault = () => {
    setLiveSectionConfig(INITIAL_LIVE_SECTION);
  };

  // Funciones de Explora por Verticales
  const updateVerticalsSectionConfig = (updates: Partial<VerticalsSectionConfig>) => {
    setVerticalsSectionConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleVerticalsSectionEnabled = () => {
    setVerticalsSectionConfig(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
  };

  const addVerticalCategoryItem = (itemData: Omit<VerticalCategoryItem, 'id'>): VerticalCategoryItem => {
    const newItem: VerticalCategoryItem = {
      ...itemData,
      id: `vert-${Date.now()}`
    };
    setVerticalsSectionConfig(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    return newItem;
  };

  const updateVerticalCategoryItem = (id: string, updates: Partial<VerticalCategoryItem>) => {
    setVerticalsSectionConfig(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const deleteVerticalCategoryItem = (id: string) => {
    setVerticalsSectionConfig(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const toggleVerticalCategoryActive = (id: string) => {
    setVerticalsSectionConfig(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
    }));
  };

  const resetVerticalsSectionToDefault = () => {
    setVerticalsSectionConfig(INITIAL_VERTICALS_SECTION);
  };

  return (
    <AppDataContext.Provider
      value={{
        businesses: realtimeBusinesses,
        plans,
        structure,
        verificationRequests,
        plansPageConfig,
        adBanners,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        toggleVideoRouteFeed,
        changeBusinessTier,
        changeBusinessStatus,
        toggleBusinessVerification,
        resetBusinessesToDefault,
        addVerificationRequest,
        approveVerificationRequest,
        rejectVerificationRequest,
        deleteVerificationRequest,
        updatePlan,
        resetPlansToDefault,
        addPlanBenefit,
        removePlanBenefit,
        updatePlansPageConfig,
        updateMetricStat,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        toggleTestimonialActive,
        addFaq,
        updateFaq,
        deleteFaq,
        toggleFaqActive,
        resetPlansPageConfigToDefault,
        updateStructure,
        updatePlatformSettings,
        addCategory,
        removeCategory,
        addZone,
        removeZone,
        resetStructureToDefault,
        addAdBanner,
        updateAdBanner,
        deleteAdBanner,
        toggleAdBannerActive,
        resetAdBannersToDefault,
        // Cumaná en Vivo & Explora por Verticales
        liveSectionConfig,
        updateLiveSectionConfig,
        toggleLiveSectionEnabled,
        addLiveDispatchItem,
        updateLiveDispatchItem,
        deleteLiveDispatchItem,
        toggleLiveDispatchActive,
        resetLiveSectionToDefault,
        verticalsSectionConfig,
        updateVerticalsSectionConfig,
        toggleVerticalsSectionEnabled,
        addVerticalCategoryItem,
        updateVerticalCategoryItem,
        deleteVerticalCategoryItem,
        toggleVerticalCategoryActive,
        resetVerticalsSectionToDefault,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData debe ser utilizado dentro de un AppDataProvider');
  }
  return context;
}
