'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useAppData } from '@/lib/app-data-context';
import { 
  Business, 
  BusinessTier, 
  PaymentMethod, 
  Amenity, 
  VideoRoute, 
  PlanConfig, 
  TestimonialItem, 
  FaqItem, 
  MetricStat, 
  PlansSpotlightConfig, 
  PlansPageConfig, 
  AdBanner,
  LiveDispatchItem,
  LiveSectionConfig,
  VerticalCategoryItem,
  VerticalsSectionConfig,
  LiveBadgeType,
  VerticalIconType,
  VerticalBadgeColor,
  BranchInfo
} from '@/types/business';
import { 
  Store, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Video, 
  Zap, 
  Wifi, 
  X,
  Sparkles,
  ArrowUpRight,
  Plus,
  Trash2,
  Building2,
  Navigation,
  Edit,
  DollarSign,
  Layers,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Check,
  Tag,
  MapPin,
  Lock,
  ShieldCheck,
  KeyRound,
  LogOut,
  Settings,
  Share2,
  Phone,
  Image as ImageIcon,
  Percent,
  Flame,
  Globe,
  Smartphone,
  CreditCard,
  Banknote,
  Landmark,
  Coins,
  Snowflake,
  Car,
  Bike,
  Waves,
  PawPrint,
  Timer,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Mail,
  Compass,
  CheckCheck,
  BadgeCheck,
  ChevronDown,
  Inbox,
  Users,
  HelpCircle,
  BarChart3,
  Quote,
  Star,
  Play,
  MessageSquare,
  Megaphone,
  Tablet,
  Bot,
  Radio,
  Wine,
  Anchor,
  Coffee,
  Bed,
  Utensils,
  ShoppingBag,
  Music
} from 'lucide-react';
import { WhatsAppIcon, InstagramIcon, TikTokIcon, FacebookIcon, YouTubeIcon } from '@/components/social-icons';
import { VerifiedBadge } from '@/components/verified-badge';
import { isBusinessOpen, getBusinessStatusInfo } from '@/lib/business-hours';
import { SingleImageUploader, GalleryImageUploader } from '@/components/image-uploader';
import { BranchManager } from '@/components/branch-manager';
import { BusinessMiniMap } from '@/components/business-mini-map';
import { BusinessHoursPicker } from '@/components/business-hours-picker';

type AdminTab = 'businesses' | 'new-business' | 'videoroutes' | 'plans' | 'structure' | 'cumana-conecta' | 'verification-requests' | 'ads' | 'home-sections' | 'kpis' | 'emergencias';

export default function AdminDashboardPage() {
  const {
    businesses,
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
    resetVerticalsSectionToDefault
  } = useAppData();

  // Sistema de autenticación de seguridad
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('cumana_admin_auth') === 'true';
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const ADMIN_PASS = 'cumana2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim().toLowerCase();
    if (cleanInput === ADMIN_PASS || cleanInput === 'cumana' || cleanInput === 'admin') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cumana_admin_auth', 'true');
      }
      setLoginError('');
      showNotice('✓ Sesión iniciada en el panel privado de administración.');
    } else {
      setLoginError('Contraseña incorrecta. Recuerda: cumana2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cumana_admin_auth');
    }
    setPasswordInput('');
  };

  // Navegación vertical izquierda
  const [activeTab, setActiveTab] = useState<AdminTab>('businesses');

  // Filtros de Comercios
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterQuickStatus, setFilterQuickStatus] = useState<'all' | 'published' | 'pending' | 'rejected'>('all');

  // Referencia y controlador para deslizar la bandeja de la tabla horizontalmente
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const scrollTable = (direction: 'left' | 'right') => {
    if (tableScrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      tableScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtros para Solicitudes de Verificación
  const [requestFilterStatus, setRequestFilterStatus] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Drawer / Modales
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Input auxiliar para agregar URLs a la galería fotográfica
  const [galleryInput, setGalleryInput] = useState('');

  // Sub-pestaña activa dentro de la vista de Planes & Precios
  const [plansSubTab, setPlansSubTab] = useState<'plans' | 'testimonials' | 'faqs' | 'metrics'>('plans');

  // Input temporal para agregar beneficio por plan
  const [newBenefitInputs, setNewBenefitInputs] = useState<Record<string, string>>({});

  // Modales y formularios para Testimonios (Personas)
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState<Omit<TestimonialItem, 'id'>>({
    name: '',
    businessName: '',
    zone: '',
    stars: 5,
    quote: '',
    initials: '',
    avatarColor: 'from-[#008966] to-[#00C292]',
    isActive: true
  });

  // Modales y formularios para Preguntas Frecuentes (FAQ)
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqFormData, setFaqFormData] = useState<Omit<FaqItem, 'id'>>({
    icon: 'payment',
    question: '',
    answer: '',
    isActive: true
  });

  // Notificación de acción rápida
  const [notification, setNotification] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const [isMobileAdminMenuOpen, setIsMobileAdminMenuOpen] = useState(false);

  // Formulario de Negocio (para crear o editar)
  const initialFormState: Omit<Business, 'id' | 'createdAt'> = {
    name: '',
    slug: '',
    tagline: '',
    description: '',
    category: structure.categories[0] || 'Gastronomía & Asadores',
    categories: [structure.categories[0] || 'Gastronomía & Asadores'],
    zone: structure.zones[0] || 'Casco Histórico',
    address: '',
    mapsUrl: '',
    rif: '',
    hasBranches: false,
    branches: [],
    socials: {
      whatsapp: 'https://wa.me/584140000000',
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
      website: ''
    },
    tier: 'free',
    rating: 5.0,
    reviewsCount: 0,
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    gallery: [],
    promotion: {
      isActive: false,
      title: '',
      description: '',
      discountBadge: '',
      validUntil: ''
    },
    isOpenNow: true,
    openingHours: '8:00 AM - 6:00 PM',
    isVerified: false,
    hasGps: true,
    status: 'active',
    paymentMethods: ['pago_movil', 'efectivo_usd'],
    amenities: ['planta_electrica'],
    videoRoute: undefined
  };

  const [formData, setFormData] = useState<Omit<Business, 'id' | 'createdAt'>>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados locales para nueva categoría / nueva zona
  const [newCatInput, setNewCatInput] = useState('');
  const [newZoneInput, setNewZoneInput] = useState('');
  const [quickZoneInput, setQuickZoneInput] = useState('');
  const [isAddingQuickZone, setIsAddingQuickZone] = useState(false);

  // Estado del formulario de Configuración Oficial de Cumaná Conecta
  const [platformForm, setPlatformForm] = useState({
    contactWhatsapp: structure.platformSettings?.contactWhatsapp || 'https://wa.me/584147778899',
    contactEmail: structure.platformSettings?.contactEmail || 'contacto@cumanaconecta.com',
    socialInstagram: structure.platformSettings?.socialInstagram || 'https://instagram.com/cumanaconecta',
    socialTiktok: structure.platformSettings?.socialTiktok || 'https://tiktok.com/@cumanaconecta',
    socialFacebook: structure.platformSettings?.socialFacebook || 'https://facebook.com/cumanaconecta',
    socialYoutube: structure.platformSettings?.socialYoutube || 'https://youtube.com/@cumanaconecta',
    officialAnnouncement: structure.platformSettings?.officialAnnouncement || 'Directorio digital oficial y georutas del Estado Sucre, Venezuela.'
  });

  // Métricas
  const totalBusinesses = businesses.length;
  const publishedCount = businesses.filter(b => b.status === 'active').length;
  const pendingApprovalCount = businesses.filter(b => b.status === 'pending_approval').length;
  const activeVIP = businesses.filter(b => b.tier === 'vip' || b.isFeatured).length;
  const withCasheaCount = businesses.filter(b => b.acceptsCashea).length;
  const withWifi = businesses.filter(b => b.amenities.includes('fibra_optica')).length;
  const withVideoRoute = businesses.filter(b => !!b.videoRoute).length;
  const activeVideoRouteFeed = businesses.filter(b => b.videoRoute && b.videoRoute.showInFeed !== false).length;

  // Métricas de Verificación Oficial
  const pendingRequestsCount = verificationRequests.filter(r => r.status === 'pending').length;
  const verifiedRequestsCount = verificationRequests.filter(r => r.status === 'verified').length;
  const verifiedBusinessesCount = businesses.filter(b => b.isVerified).length;

  // Filtrado de Comercios
  const filteredList = businesses.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        Boolean(b.categories?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchTier = filterTier === 'all' || b.tier === filterTier;
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchCat = filterCategory === 'all' || b.category === filterCategory || Boolean(b.categories?.includes(filterCategory));
    const matchQuick = filterQuickStatus === 'all' 
      ? true 
      : filterQuickStatus === 'published' 
      ? b.status === 'active' 
      : filterQuickStatus === 'pending' 
      ? b.status === 'pending_approval'
      : (b.status === 'suspended');
    return matchSearch && matchTier && matchStatus && matchCat && matchQuick;
  });

  // Filtrado de Solicitudes de Verificación
  const filteredRequests = verificationRequests.filter(r => {
    if (requestFilterStatus === 'all') return true;
    return r.status === requestFilterStatus;
  });

  // Abrir Modal de Edición
  const handleStartEdit = (b: Business) => {
    setEditingId(b.id);
    const existingCategories = (b.categories && b.categories.length > 0)
      ? [...b.categories]
      : (b.category ? [b.category] : [structure.categories[0] || 'Gastronomía & Asadores']);
    const primaryCat = existingCategories.includes(b.category) ? b.category : existingCategories[0];

    setFormData({
      ...b,
      name: b.name,
      slug: b.slug,
      tagline: b.tagline,
      description: b.description,
      category: primaryCat,
      categories: existingCategories,
      zone: b.zone,
      address: b.address,
      mapsUrl: b.mapsUrl || '',
      rif: b.rif || '',
      hasBranches: b.hasBranches || false,
      branches: b.branches ? [...b.branches] : [],
      socials: { 
        whatsapp: b.socials?.whatsapp || '',
        instagram: b.socials?.instagram || '',
        facebook: b.socials?.facebook || '',
        tiktok: b.socials?.tiktok || '',
        youtube: b.socials?.youtube || '',
        website: b.socials?.website || ''
      },
      tier: b.tier,
      rating: b.rating,
      reviewsCount: b.reviewsCount,
      heroImage: b.heroImage,
      gallery: b.gallery ? [...b.gallery] : [],
      promotion: b.promotion ? { ...b.promotion } : {
        isActive: false,
        title: '',
        description: '',
        discountBadge: '',
        validUntil: ''
      },
      isOpenNow: b.isOpenNow,
      openingHours: b.openingHours,
      isVerified: b.isVerified,
      hasGps: b.hasGps !== false,
      status: b.status,
      paymentMethods: [...b.paymentMethods],
      amenities: [...b.amenities],
      videoRoute: b.videoRoute ? { ...b.videoRoute } : undefined
    });
    setGalleryInput('');
    setIsEditModalOpen(true);
  };

  // Preparar Formulario para Nuevo Negocio (modal unificado)
  const handleStartCreate = () => {
    setEditingId(null);
    const defaultCat = structure.categories[0] || 'Gastronomía & Asadores';
    const defaultZone = structure.zones[0] || 'Casco Histórico';
    setFormData({
      ...initialFormState,
      category: defaultCat,
      categories: [defaultCat],
      zone: defaultZone,
      hasGps: true
    });
    setGalleryInput('');
    setIsEditModalOpen(true);
  };

  // Alternar o añadir rubro múltiple
  const toggleCategory = (catName: string) => {
    setFormData(prev => {
      const current = prev.categories && prev.categories.length > 0 
        ? [...prev.categories] 
        : (prev.category ? [prev.category] : []);
      const exists = current.includes(catName);
      let updated: string[];
      if (exists) {
        if (current.length <= 1) {
          alert('El comercio debe pertenecer al menos a un rubro comercial.');
          return prev;
        }
        updated = current.filter(c => c !== catName);
      } else {
        updated = [...current, catName];
      }
      const updatedPrimary = updated.includes(prev.category) ? prev.category : updated[0];
      return {
        ...prev,
        categories: updated,
        category: updatedPrimary
      };
    });
  };

  // Fijar rubro principal de portada
  const handleSetPrimaryCategory = (catName: string) => {
    setFormData(prev => {
      const current = prev.categories && prev.categories.length > 0 
        ? [...prev.categories] 
        : (prev.category ? [prev.category] : []);
      const rest = current.filter(c => c !== catName);
      return {
        ...prev,
        category: catName,
        categories: [catName, ...rest]
      };
    });
  };

  // Guardar Formulario (Creación o Edición)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre del negocio es obligatorio.');
      return;
    }

    const slug = formData.slug.trim() 
      ? formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const calculatedIsOpen = isBusinessOpen(formData.openingHours);

    const effectiveCategories = formData.categories && formData.categories.length > 0
      ? formData.categories
      : (formData.category ? [formData.category] : [structure.categories[0] || 'Gastronomía & Asadores']);
    const effectiveCategory = effectiveCategories.includes(formData.category)
      ? formData.category
      : effectiveCategories[0];

    const finalPayload = {
      ...formData,
      category: effectiveCategory,
      categories: effectiveCategories,
      isOpenNow: calculatedIsOpen,
      slug
    };

    if (editingId) {
      updateBusiness(editingId, finalPayload);
      showNotice(`✓ "${formData.name}" actualizado correctamente.`);
      setIsEditModalOpen(false);
      setEditingId(null);
    } else {
      addBusiness(finalPayload);
      showNotice(`✓ "${formData.name}" registrado con éxito con ${effectiveCategories.length} rubro(s).`);
      setIsEditModalOpen(false);
      setEditingId(null);
      // Limpiar filtros para que el nuevo comercio aparezca visible de inmediato en la tabla
      setSearchTerm('');
      setFilterQuickStatus('all');
      setFilterStatus('all');
      setFilterCategory('all');
      setFilterTier('all');
      setActiveTab('businesses');
    }
  };

  const togglePaymentMethod = (method: PaymentMethod) => {
    setFormData(prev => {
      const exists = prev.paymentMethods.includes(method);
      return {
        ...prev,
        paymentMethods: exists 
          ? prev.paymentMethods.filter(m => m !== method)
          : [...prev.paymentMethods, method]
      };
    });
  };

  const toggleAmenity = (amenity: Amenity) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleAddGalleryImage = () => {
    const trimmed = galleryInput.trim();
    if (!trimmed) return;
    if (formData.gallery.includes(trimmed)) {
      alert('Esta imagen ya está en la galería.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, trimmed]
    }));
    setGalleryInput('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSavePlatformSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings(platformForm);
    showNotice('✓ Datos Oficiales de Cumaná Conecta actualizados en tiempo real.');
  };

  // Gestión de Testimonios (Personas)
  const handleOpenAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialFormData({
      name: '',
      businessName: '',
      zone: structure.zones[0] || 'Casco Histórico',
      stars: 5,
      quote: '',
      initials: '',
      avatarColor: 'from-[#008966] to-[#00C292]',
      isActive: true
    });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (t: TestimonialItem) => {
    setEditingTestimonialId(t.id);
    setTestimonialFormData({
      name: t.name,
      businessName: t.businessName,
      zone: t.zone,
      stars: t.stars,
      quote: t.quote,
      initials: t.initials,
      avatarColor: t.avatarColor || 'from-[#008966] to-[#00C292]',
      isActive: t.isActive
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialFormData.name.trim() || !testimonialFormData.quote.trim()) {
      alert('Por favor ingresa el nombre de la persona y el testimonio.');
      return;
    }
    const computedInitials = testimonialFormData.initials.trim()
      ? testimonialFormData.initials.trim().toUpperCase().slice(0, 3)
      : testimonialFormData.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    if (editingTestimonialId) {
      updateTestimonial(editingTestimonialId, {
        ...testimonialFormData,
        initials: computedInitials
      });
      showNotice(`✓ Testimonio de "${testimonialFormData.name}" actualizado.`);
    } else {
      addTestimonial({
        ...testimonialFormData,
        initials: computedInitials
      });
      showNotice(`✓ Nuevo testimonio de "${testimonialFormData.name}" agregado.`);
    }
    setIsTestimonialModalOpen(false);
    setEditingTestimonialId(null);
  };

  // Gestión de Preguntas Frecuentes (FAQ)
  const handleOpenAddFaq = () => {
    setEditingFaqId(null);
    setFaqFormData({
      icon: 'payment',
      question: '',
      answer: '',
      isActive: true
    });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: FaqItem) => {
    setEditingFaqId(f.id);
    setFaqFormData({
      icon: f.icon,
      question: f.question,
      answer: f.answer,
      isActive: f.isActive
    });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) {
      alert('Por favor ingresa la pregunta y la respuesta.');
      return;
    }

    if (editingFaqId) {
      updateFaq(editingFaqId, faqFormData);
      showNotice('✓ Pregunta frecuente actualizada.');
    } else {
      addFaq(faqFormData);
      showNotice('✓ Nueva pregunta frecuente agregada.');
    }
    setIsFaqModalOpen(false);
    setEditingFaqId(null);
  };

  // Estados & Controladores de Publicidad & Banners
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adFormData, setAdFormData] = useState<Omit<AdBanner, 'id'>>({
    title: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    linkUrl: 'https://wa.me/584147778899',
    badgeText: 'Anuncio Patrocinado',
    buttonText: 'Consultar Oferta',
    isActive: true,
    positionInterval: 4
  });

  const handleOpenCreateAd = () => {
    setEditingAdId(null);
    setAdFormData({
      title: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      linkUrl: 'https://wa.me/584147778899?text=Hola,%20deseo%20información%20sobre%20su%20servicio',
      badgeText: 'Anuncio Patrocinado',
      buttonText: 'Contactar Anunciante',
      isActive: true,
      positionInterval: 4
    });
    setIsAdModalOpen(true);
  };

  const handleOpenEditAd = (ad: AdBanner) => {
    setEditingAdId(ad.id);
    setAdFormData({
      title: ad.title,
      subtitle: ad.subtitle,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      badgeText: ad.badgeText,
      buttonText: ad.buttonText,
      isActive: ad.isActive,
      positionInterval: ad.positionInterval || 4
    });
    setIsAdModalOpen(true);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adFormData.title.trim()) {
      alert('Por favor ingresa el título del anuncio publicitario.');
      return;
    }
    if (editingAdId) {
      updateAdBanner(editingAdId, adFormData);
      showNotice('✓ Anuncio publicitario actualizado exitosamente.');
    } else {
      addAdBanner(adFormData);
      showNotice('✓ Nuevo anuncio publicitario creado exitosamente.');
    }
    setIsAdModalOpen(false);
    setEditingAdId(null);
  };

  const handleDeleteAd = (id: string, title: string) => {
    if (confirm(`¿Eliminar el anuncio publicitario "${title}"?`)) {
      deleteAdBanner(id);
      showNotice('✓ Anuncio publicitario eliminado.');
    }
  };

  // ==============================================================
  // ESTADOS & CONTROLADORES DE CUMANÁ EN VIVO & VERTICALES
  // ==============================================================
  // Cumaná en Vivo Modal
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [editingLiveId, setEditingLiveId] = useState<string | null>(null);
  const [liveFormData, setLiveFormData] = useState<Omit<LiveDispatchItem, 'id'>>({
    name: '',
    subtitle: '',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    badgeType: 'play',
    location: '',
    description: '',
    isActive: true
  });

  const handleOpenCreateLive = () => {
    setEditingLiveId(null);
    setLiveFormData({
      name: '',
      subtitle: '',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      badgeType: 'play',
      location: 'Cumaná, Estado Sucre',
      description: '',
      isActive: true
    });
    setIsLiveModalOpen(true);
  };

  const handleOpenEditLive = (item: LiveDispatchItem) => {
    setEditingLiveId(item.id);
    setLiveFormData({
      name: item.name,
      subtitle: item.subtitle,
      imageUrl: item.imageUrl,
      badgeType: item.badgeType,
      location: item.location || '',
      description: item.description || '',
      isActive: item.isActive
    });
    setIsLiveModalOpen(true);
  };

  const handleSaveLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveFormData.name.trim() || !liveFormData.subtitle.trim()) {
      alert('Por favor ingresa el nombre y horario/subtítulo del despacho en vivo.');
      return;
    }
    if (editingLiveId) {
      updateLiveDispatchItem(editingLiveId, liveFormData);
      showNotice(`✓ Despacho "${liveFormData.name}" actualizado.`);
    } else {
      addLiveDispatchItem(liveFormData);
      showNotice(`✓ Despacho en vivo "${liveFormData.name}" agregado.`);
    }
    setIsLiveModalOpen(false);
    setEditingLiveId(null);
  };

  const handleDeleteLive = (id: string, name: string) => {
    if (confirm(`¿Eliminar el despacho en vivo "${name}"?`)) {
      deleteLiveDispatchItem(id);
      showNotice(`✓ Despacho "${name}" eliminado.`);
    }
  };

  // Explora por Verticales Modal
  const [isVerticalModalOpen, setIsVerticalModalOpen] = useState(false);
  const [editingVerticalId, setEditingVerticalId] = useState<string | null>(null);
  const [verticalFormData, setVerticalFormData] = useState<Omit<VerticalCategoryItem, 'id'>>({
    title: '',
    subtitle: '',
    badgeText: 'Activo',
    badgeColor: 'teal',
    icon: 'utensils',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    actionText: 'VER COMERCIOS →',
    actionColor: '#FF6B4A',
    targetCategory: structure.categories[0] || 'Gastronomía & Asadores',
    isActive: true
  });

  const handleOpenCreateVertical = () => {
    setEditingVerticalId(null);
    setVerticalFormData({
      title: '',
      subtitle: '',
      badgeText: 'Activo',
      badgeColor: 'teal',
      icon: 'utensils',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
      actionText: 'EXPLORAR EXPERIENCIA →',
      actionColor: '#FF6B4A',
      targetCategory: structure.categories[0] || 'Gastronomía & Asadores',
      isActive: true
    });
    setIsVerticalModalOpen(true);
  };

  const handleOpenEditVertical = (item: VerticalCategoryItem) => {
    setEditingVerticalId(item.id);
    setVerticalFormData({
      title: item.title,
      subtitle: item.subtitle,
      badgeText: item.badgeText,
      badgeColor: item.badgeColor,
      icon: item.icon,
      imageUrl: item.imageUrl,
      actionText: item.actionText,
      actionColor: item.actionColor || '#FF6B4A',
      targetCategory: item.targetCategory || structure.categories[0] || '',
      isActive: item.isActive
    });
    setIsVerticalModalOpen(true);
  };

  const handleSaveVertical = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verticalFormData.title.trim()) {
      alert('Por favor ingresa el título de la vertical.');
      return;
    }
    if (editingVerticalId) {
      updateVerticalCategoryItem(editingVerticalId, verticalFormData);
      showNotice(`✓ Vertical "${verticalFormData.title}" actualizada.`);
    } else {
      addVerticalCategoryItem(verticalFormData);
      showNotice(`✓ Nueva vertical "${verticalFormData.title}" agregada.`);
    }
    setIsVerticalModalOpen(false);
    setEditingVerticalId(null);
  };

  const handleDeleteVertical = (id: string, title: string) => {
    if (confirm(`¿Eliminar la vertical "${title}"?`)) {
      deleteVerticalCategoryItem(id);
      showNotice(`✓ Vertical "${title}" eliminada.`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el comercio "${name}"? Esta acción borrará su ficha de toda la plataforma.`)) {
      deleteBusiness(id);
      showNotice(`Comercio "${name}" eliminado.`);
      if (selectedBusiness && selectedBusiness.id === id) {
        setIsAuditDrawerOpen(false);
      }
    }
  };

  const allPaymentMethods: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: 'pago_movil', label: 'Pago Móvil', icon: Smartphone },
    { id: 'zelle', label: 'Zelle', icon: Landmark },
    { id: 'efectivo_usd', label: 'Efectivo USD ($)', icon: Banknote },
    { id: 'efectivo_bs', label: 'Efectivo Bs', icon: Banknote },
    { id: 'binance', label: 'Binance Pay', icon: Coins },
    { id: 'tarjeta_debito', label: 'Tarjeta de Débito', icon: CreditCard },
    { id: 'punto_de_venta', label: 'Punto de Venta', icon: CreditCard },
  ];

  const allAmenities: { id: Amenity; label: string; icon: any }[] = [
    { id: 'planta_electrica', label: 'Planta Eléctrica 100%', icon: Zap },
    { id: 'fibra_optica', label: 'Fibra Óptica', icon: Wifi },
    { id: 'estacionamiento', label: 'Estacionamiento', icon: Car },
    { id: 'aire_acondicionado', label: 'Aire Acondicionado', icon: Snowflake },
    { id: 'frente_al_mar', label: 'Frente al Mar', icon: Waves },
    { id: 'pet_friendly', label: 'Pet Friendly', icon: PawPrint },
    { id: 'delivery', label: 'Delivery', icon: Bike },
  ];

  // ==============================================================
  // PANTALLA DE ACCESO RESTRINGIDO (SI NO ESTÁ AUTENTICADO)
  // ==============================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4 py-12 text-slate-100">
        <div className="w-full max-w-md bg-[#11141a] rounded-3xl border border-[#1e222b] p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/15 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-amber-400">
              Ruta Privada Confidencial
            </span>
            <h1 className="text-2xl font-black text-white mt-1">
              Acceso a /administracion
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              Ingresa la contraseña de seguridad para acceder a la gestión y moderación de Cumaná Conecta.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-300">
                  Contraseña de Administrador:
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordInput('cumana2026')}
                  className="text-[10px] text-amber-400 font-black hover:underline cursor-pointer"
                >
                  (Autocompletar clave)
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Introduce tu contraseña..."
                  className="w-full pl-10 pr-10 py-3 bg-[#0a0d14] border border-[#252934] rounded-xl text-sm text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-xs font-bold text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30 text-center animate-in shake duration-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>Desbloquear Panel Administrador</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-200 dark:border-[#1E2D45]">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-black dark:text-[#A0AEC0] dark:hover:text-white font-medium"
            >
              ← Volver al portal público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================================
  // COMPONENTE INTERNO: CAMPOS REUTILIZABLES DEL FORMULARIO DE NEGOCIO
  // ==============================================================
  const renderBusinessFormFields = () => (
    <div className="space-y-8">
      {/* 1. Datos Principales y Categorías */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-black text-[#FF6B4A] tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4" />
            1. Datos Principales del Local & Categorización
          </h3>

          {/* Interruptor de Verificación Oficial Tipo Instagram */}
          <label className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white cursor-pointer p-2 rounded-xl bg-[#0095F6]/10 border border-[#0095F6]/30">
            <input
              type="checkbox"
              checked={formData.isVerified}
              onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
              className="rounded accent-[#0095F6] w-4 h-4"
            />
            <span className="flex items-center gap-1.5">
              <VerifiedBadge size="sm" />
              <span>Insignia Oficial de Verificado (Check Instagram)</span>
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              Nombre Comercial *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Marisquería Cumaná Sol"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-semibold focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              Slug URL (identificador único)
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="ej. marisqueria-cumana-sol"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>
        </div>

        {/* Rubros / Actividades Comerciales Múltiples */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-100/70 dark:bg-[#0c121d] border border-slate-200 dark:border-[#1E2D45]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="text-xs font-black text-slate-900 dark:text-white block flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>Rubros y Actividades Comerciales *</span>
                <span className="text-[10px] text-amber-500 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  Multirubro Habilitado
                </span>
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Selecciona todos los rubros en los que opera este comercio (ej. Bodegón + Restaurante, Ferretería + Repuestos).
              </p>
            </div>
            <span className="text-[11px] font-mono-tabular font-bold text-amber-500 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
              {(formData.categories?.length || (formData.category ? 1 : 0))} seleccionados
            </span>
          </div>

          {/* Chips interactivos de selección rápida */}
          <div className="flex flex-wrap gap-2 pt-1">
            {structure.categories.map((c) => {
              const currentCategories = formData.categories && formData.categories.length > 0
                ? formData.categories
                : (formData.category ? [formData.category] : []);
              const isChecked = currentCategories.includes(c);
              const isPrimary = (formData.category === c) || (currentCategories[0] === c && !formData.category);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleCategory(c)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-amber-400/20 border-amber-400 text-amber-700 dark:text-amber-400 shadow-sm'
                      : 'bg-white dark:bg-[#11141a] border-slate-200 dark:border-[#1E2D45] text-slate-600 dark:text-[#A0AEC0] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="font-extrabold">{isChecked ? '✓' : '+'}</span>
                  <span>{c}</span>
                  {isChecked && isPrimary && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black uppercase tracking-tight">
                      Principal
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selector de Rubro Principal de Portada si tiene más de 1 */}
          {(formData.categories?.length || (formData.category ? 1 : 0)) > 1 && (
            <div className="pt-2.5 border-t border-slate-200/80 dark:border-[#1E2D45]/80 flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Rubro Principal de Portada:</span>
              </span>
              <select
                value={formData.category}
                onChange={(e) => handleSetPrimaryCategory(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-[#11141a] border border-amber-400/60 rounded-xl text-xs font-black text-amber-600 dark:text-amber-400 focus:outline-none"
              >
                {(formData.categories && formData.categories.length > 0 ? formData.categories : [formData.category]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400">
                (Aparecerá en el encabezado principal de la tarjeta)
              </span>
            </div>
          )}
        </div>

        {/* Sector Geográfico o Bahía y Registro Rápido */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white block">
              Sector Geográfico o Bahía de Cumaná *
            </label>
            <button
              type="button"
              onClick={() => setIsAddingQuickZone(!isAddingQuickZone)}
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingQuickZone ? 'Cerrar registro rápido' : '+ Añadir nuevo sector / dirección'}</span>
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-bold focus:outline-none focus:border-[#FF6B4A]"
            >
              {structure.zones.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>

          {/* Formulario desplegable para agregar nuevo sector/dirección al instante */}
          {isAddingQuickZone && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 animate-in fade-in duration-150">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">
                Registrar nuevo sector o dirección en la base de datos oficial:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickZoneInput}
                  onChange={(e) => setQuickZoneInput(e.target.value)}
                  placeholder="Ej: Av. Cancamure, Calle Blanco Fombona, Caigüire..."
                  className="flex-1 px-3 py-2 bg-white dark:bg-[#080E18] border border-emerald-500/40 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const clean = quickZoneInput.trim();
                    if (!clean) return;
                    addZone(clean);
                    setFormData(prev => ({
                      ...prev,
                      zone: clean,
                      address: prev.address ? prev.address : clean
                    }));
                    setQuickZoneInput('');
                    setIsAddingQuickZone(false);
                    showNotice(`Sector "${clean}" agregado a la base de datos y seleccionado.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-sm"
                >
                  Guardar y Seleccionar
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
            Lema o Frase Corta de Presentación
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="Pescados frescos del Golfo, cocteles de autor y vista panorámica"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
            Descripción Detallada del Negocio
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Explica especialidades, productos, servicios y facilidades para los clientes..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
          />
        </div>

        {/* Dirección Física Completa con Datalist de Zonas y Atajos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-900 dark:text-white block">
              Dirección Física Completa *
            </label>
            {formData.zone && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, address: prev.zone }))}
                className="text-[10px] text-amber-500 hover:underline font-bold cursor-pointer"
              >
                Usar "{formData.zone}" como dirección base
              </button>
            )}
          </div>

          <input
            type="text"
            list="admin-registered-zones-list"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Escribe la dirección o selecciona de la lista..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-medium focus:outline-none focus:border-[#FF6B4A]"
          />

          <datalist id="admin-registered-zones-list">
            {structure.zones.map(z => (
              <option key={z} value={z} />
            ))}
          </datalist>

          {/* Sugerencias de direcciones y zonas registradas en el panel */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
              Sugerencias de zonas registradas:
            </span>
            {structure.zones.slice(0, 10).map(z => (
              <button
                key={z}
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  address: prev.address ? (prev.address.includes(z) ? prev.address : `${prev.address}, ${z}`) : z
                }))}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#161c26] dark:hover:bg-[#202736] text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#242c3d] transition-all cursor-pointer"
              >
                + {z}
              </button>
            ))}
          </div>
        </div>

        {/* Configurador Inteligente y Flexible de Horarios (Lunes a Domingo / Fin de Semana) */}
        <div className="pt-2">
          <BusinessHoursPicker
            value={formData.openingHours}
            onChange={(newHours) => setFormData(prev => ({ ...prev, openingHours: newHours }))}
          />
        </div>

        {/* Control de Geolocalización Satelital Google Maps (Interruptor Activar / Desactivar) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#131924] border border-slate-200 dark:border-[#1E2536] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Geolocalización por Google Maps
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Determina si este comercio mostrará mapa satelital interactivo y navegación por satélite
              </p>
            </div>

            {/* Botón interruptor tipo Switch */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, hasGps: prev.hasGps === false ? true : false }))}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black border flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                  formData.hasGps !== false
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/20'
                    : 'bg-slate-200 dark:bg-[#1c2230] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-[#2a3449]'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${formData.hasGps !== false ? 'bg-slate-950' : 'bg-slate-500'}`} />
                <span>{formData.hasGps !== false ? 'GPS ACTIVO' : 'GPS INACTIVO'}</span>
              </button>
            </div>
          </div>

          {/* Si el GPS está activo: mostrar enlace de Google Maps y preview de mini-mapa */}
          {formData.hasGps !== false ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-[#1E2536]">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Enlace de Google Maps (Ubicación exacta)
                </label>
                <input
                  type="text"
                  value={formData.mapsUrl}
                  onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />

                {/* Vista Previa del Mapa de Ubicación en Tiempo Real */}
                <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" />
                      <span>Vista Previa del Mapa en Cumaná</span>
                    </span>
                    <span className="text-[10px] font-mono-tabular text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {formData.zone || 'Cumaná'}
                    </span>
                  </div>
                  <BusinessMiniMap
                    business={{
                      name: formData.name || 'Local',
                      address: formData.address || 'Cumaná, Estado Sucre',
                      zone: formData.zone || 'Sector Centro',
                      mapsUrl: formData.mapsUrl,
                      coordinates: formData.coordinates
                    }}
                    heightClass="h-36 sm:h-44"
                    showDirectionsButton={false}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center justify-between">
                  <span>Número de RIF Comercial (Opcional)</span>
                  <span className="text-[10px] text-[#FFA384] font-semibold">Ej: J-505563599</span>
                </label>
                <input
                  type="text"
                  value={formData.rif || ''}
                  onChange={(e) => setFormData({ ...formData, rif: e.target.value.toUpperCase() })}
                  placeholder="J-505563599 o V-12345678-0"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-bold tracking-wider focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#0c1017] border border-dashed border-slate-300 dark:border-[#222a3b] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Modo sin mapa activo: Se priorizará la dirección física y pedidos por WhatsApp
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  El comercio se publicará sin recuadro de mapa satelital. Los clientes verán su dirección escrita y canales directos.
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <input
                  type="text"
                  value={formData.rif || ''}
                  onChange={(e) => setFormData({ ...formData, rif: e.target.value.toUpperCase() })}
                  placeholder="RIF Comercial (Opcional)"
                  className="w-full sm:w-56 px-3 py-2 bg-white dark:bg-[#131924] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-bold tracking-wider focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gestor de Sedes y Guías de Llegada para Choferes (Multi-Sede Universal) */}
        <BranchManager
          hasBranches={formData.hasBranches || false}
          onToggleHasBranches={(checked) => setFormData(prev => ({ ...prev, hasBranches: checked }))}
          branches={formData.branches || []}
          onChangeBranches={(newBranches) => setFormData(prev => ({ ...prev, branches: newBranches }))}
          zones={structure.zones}
          businessName={formData.name}
          defaultHeroImage={formData.heroImage}
          defaultAddress={formData.address}
          defaultZone={formData.zone}
          defaultPhone={formData.socials?.whatsapp}
          defaultHours={formData.openingHours}
          defaultMapsUrl={formData.mapsUrl}
        />
      </div>

      {/* 2. Redes Sociales Completas */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-[#1E2D45]">
        <h3 className="text-xs uppercase font-black text-[#008966] dark:text-[#00C292] tracking-wider flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          2. Redes Sociales & Canales Oficiales de Contacto
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
              <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
              WhatsApp Directo * (Enlace o Número)
            </label>
            <input
              type="text"
              required
              value={formData.socials.whatsapp}
              onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, whatsapp: e.target.value } })}
              placeholder="https://wa.me/584140000000"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-mono focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
              <InstagramIcon className="w-3.5 h-3.5 fill-[#E1306C]" />
              Instagram (URL o @usuario)
            </label>
            <input
              type="text"
              value={formData.socials.instagram || ''}
              onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
              placeholder="https://instagram.com/comercio"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
              <TikTokIcon className="w-3.5 h-3.5 fill-slate-800 dark:fill-white" />
              TikTok (URL o @usuario)
            </label>
            <input
              type="text"
              value={formData.socials.tiktok || ''}
              onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, tiktok: e.target.value } })}
              placeholder="https://tiktok.com/@comercio"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
              <FacebookIcon className="w-3.5 h-3.5 fill-[#1877F2]" />
              Facebook (URL de Página)
            </label>
            <input
              type="text"
              value={formData.socials.facebook || ''}
              onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
              placeholder="https://facebook.com/comercio"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
              <YouTubeIcon className="w-3.5 h-3.5 fill-[#FF0000]" />
              YouTube (Canal Oficial o Enlace)
            </label>
            <input
              type="text"
              value={formData.socials.youtube || ''}
              onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, youtube: e.target.value } })}
              placeholder="https://youtube.com/@comercio"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#008966] dark:text-[#00C292]" />
            Sitio Web o Carta / Menú Digital (Opcional)
          </label>
          <input
            type="text"
            value={formData.socials.website || ''}
            onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, website: e.target.value } })}
            placeholder="https://menu.comercio.com"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
          />
        </div>
      </div>

      {/* 3. Fotos y Galerías Múltiples */}
      <div className="space-y-5 pt-6 border-t border-slate-200 dark:border-[#1E2D45]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs uppercase font-black text-slate-950 dark:text-white tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#FF6B4A]" />
            3. Foto Principal & Galería Fotográfica Múltiple
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            ⚡ Calidad HD y Peso Ultra-Ligero (WebP)
          </span>
        </div>

        <SingleImageUploader
          label="Foto de Portada / Hero Image (Portada Principal)"
          value={formData.heroImage}
          onChange={(newUrl) => setFormData(prev => ({ ...prev, heroImage: newUrl }))}
          required
          helpText="Foto nítida de la fachada o ambiente principal del comercio. Se optimiza automáticamente para cargar al instante."
        />

        <GalleryImageUploader
          images={formData.gallery}
          onAddImages={(newUrls) => setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newUrls] }))}
          onRemoveImage={(idx) => setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }))}
        />
      </div>

      {/* 4. Promociones Especiales */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-[#1E2D45]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-black text-[#FF6B4A] tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF6B4A]" />
            4. Promociones Especiales & Descuentos
          </h3>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={formData.promotion?.isActive || false}
              onChange={(e) => {
                setFormData(prev => ({
                  ...prev,
                  promotion: {
                    ...(prev.promotion || { title: '', description: '', discountBadge: '', validUntil: '' }),
                    isActive: e.target.checked
                  }
                }));
              }}
              className="rounded accent-[#FF6B4A] w-4 h-4"
            />
            <span>¿Tiene Promoción Especial Activa?</span>
          </label>
        </div>

        {formData.promotion?.isActive && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-[#FF6B4A]/40 space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Título de la Promoción *
                </label>
                <input
                  type="text"
                  value={formData.promotion?.title || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    promotion: { ...prev.promotion!, title: e.target.value }
                  }))}
                  placeholder="Ej. 2x1 en Cócteles del Golfo los Jueves"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-bold focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Etiqueta / Badge
                </label>
                <input
                  type="text"
                  value={formData.promotion?.discountBadge || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    promotion: { ...prev.promotion!, discountBadge: e.target.value }
                  }))}
                  placeholder="Ej. 2x1, -25%, PROMO"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-black text-[#FF6B4A] focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Descripción o Condiciones de la Oferta
                </label>
                <textarea
                  rows={2}
                  value={formData.promotion?.description || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    promotion: { ...prev.promotion!, description: e.target.value }
                  }))}
                  placeholder="Aplica en cócteles de autor a partir de las 6:00 PM consumiendo en terraza..."
                  className="w-full px-4 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Vigencia o Duración
                </label>
                <input
                  type="text"
                  value={formData.promotion?.validUntil || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    promotion: { ...prev.promotion!, validUntil: e.target.value }
                  }))}
                  placeholder="Ej. Válido todo el mes / Hasta el 30 de Noviembre"
                  className="w-full px-4 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Pagos y Servicios */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-[#1E2D45]">
        <h3 className="text-xs uppercase font-black text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#008966] dark:text-[#00C292]" />
          5. Métodos de Pago y Servicios de Infraestructura
        </h3>

        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-2">
            Métodos de Pago Aceptados:
          </span>
          <div className="flex flex-wrap gap-2">
            {allPaymentMethods.map((pm) => {
              const isChecked = formData.paymentMethods.includes(pm.id);
              const IconComp = pm.icon;
              return (
                <button
                  type="button"
                  key={pm.id}
                  onClick={() => togglePaymentMethod(pm.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-[#FF6B4A]/20 border-[#FF6B4A] text-[#FF6B4A]'
                      : 'bg-slate-50 dark:bg-[#080E18] border-slate-200 dark:border-[#1E2D45] text-slate-600 dark:text-[#A0AEC0]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{isChecked ? '✓ ' : '+ '} {pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-2">
            Comodidades / Respaldo Eléctrico:
          </span>
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((am) => {
              const isChecked = formData.amenities.includes(am.id);
              const IconComp = am.icon;
              return (
                <button
                  type="button"
                  key={am.id}
                  onClick={() => toggleAmenity(am.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-[#00C292]/20 border-[#00C292] text-[#008966] dark:text-[#00C292]'
                      : 'bg-slate-50 dark:bg-[#080E18] border-slate-200 dark:border-[#1E2D45] text-slate-600 dark:text-[#A0AEC0]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{isChecked ? '✓ ' : '+ '} {am.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Video-Ruta Vertical 9:16 */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-[#1E2D45]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-black text-[#FF6B4A] tracking-wider flex items-center gap-2">
            <Video className="w-4 h-4" />
            6. Video-Ruta Vertical 9:16 (Opcional / Destacado)
          </h3>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
            <input
              type="checkbox"
              checked={!!formData.videoRoute}
              onChange={(e) => {
                if (e.target.checked) {
                  setFormData({
                    ...formData,
                    videoRoute: {
                      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-by-the-sea-41546-large.mp4',
                      thumbnailUrl: formData.heroImage,
                      originName: 'Redoma del Indio hacia el local',
                      duration: '45 seg',
                      milestones: [
                        { time: '0:05', title: 'Salida de la vía principal', description: 'Giro con vista al Golfo' },
                        { time: '0:35', title: 'Llegada y estacionamiento', description: 'Acceso directo señalizado' }
                      ],
                      showInFeed: true
                    }
                  });
                } else {
                  setFormData({ ...formData, videoRoute: undefined });
                }
              }}
              className="rounded accent-[#FF6B4A]"
            />
            <span>Habilitar Video-Ruta Vertical</span>
          </label>
        </div>

        {formData.videoRoute && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-[#FF6B4A]/30 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  URL Video Vertical (.mp4)
                </label>
                <input
                  type="text"
                  value={formData.videoRoute.videoUrl}
                  onChange={(e) => setFormData({
                    ...formData,
                    videoRoute: { ...formData.videoRoute!, videoUrl: e.target.value }
                  })}
                  placeholder="https://assets.../video.mp4"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Duración y Origen de Salida
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.videoRoute.duration}
                    onChange={(e) => setFormData({
                      ...formData,
                      videoRoute: { ...formData.videoRoute!, duration: e.target.value }
                    })}
                    placeholder="45 seg"
                    className="w-24 px-3 py-2.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                  <input
                    type="text"
                    value={formData.videoRoute.originName}
                    onChange={(e) => setFormData({
                      ...formData,
                      videoRoute: { ...formData.videoRoute!, originName: e.target.value }
                    })}
                    placeholder="Redoma del Indio hacia Costanera"
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.videoRoute.showInFeed !== false}
                onChange={(e) => setFormData({
                  ...formData,
                  videoRoute: { ...formData.videoRoute!, showInFeed: e.target.checked }
                })}
                className="rounded accent-[#FF6B4A]"
              />
              <span>Aceptar y mostrar en el carrusel de Video-Rutas del portal público</span>
            </label>
          </div>
        )}
      </div>

      {/* 7. Plan de Suscripción y Estatus */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-[#1E2D45]">
        <h3 className="text-xs uppercase font-black text-slate-900 dark:text-white tracking-wider">
          7. Nivel de Plan y Estatus en el Directorio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              Plan Asignado
            </label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value as BusinessTier })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-black focus:outline-none focus:border-[#FF6B4A]"
            >
              <option value="free">FREE · $0 (Ficha Flotante Básica)</option>
              <option value="pro">PRO · $19 (Comercio Aliado · Ficha Flotante)</option>
              <option value="vip">DESTACADO · $39 (Comercio Destacado · Ficha Completa)</option>
            </select>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              {formData.tier === 'vip' || formData.hasBranches 
                ? '★ Este comercio cuenta con Ficha Completa (/local/slug) por ser Destacado o Multi-Sede.' 
                : 'ℹ Este comercio cuenta con Ficha Flotante Modal interactiva en el portal.'}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              Estado de Publicación
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Business['status'] })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-black focus:outline-none focus:border-[#FF6B4A]"
            >
              <option value="active">● Activo y Visible en el Portal</option>
              <option value="pending_approval">⏳ Pendiente de Aprobación</option>
              <option value="suspended">✕ Suspendido / Oculto</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // ==============================================================
  // PANEL COMPLETO DESBLOQUEADO
  // ==============================================================
  return (
    <div className="w-full min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. BARRA LATERAL IZQUIERDA (SIDEBAR PRO) */}
      {/* ============================================================== */}
      <aside className="w-full md:w-64 lg:w-72 shrink-0 md:min-h-screen bg-[#0d1017] border-b md:border-b-0 md:border-r border-[#1e222b] p-4 sm:p-5 flex flex-col justify-between space-y-4 md:space-y-6">
        <div className="space-y-4 md:space-y-6">
          {/* Brand Header + Mobile Toggle */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                <Settings className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight">
                  CumanáConecta
                </h2>
                <span className="text-[9.5px] font-mono-tabular font-bold text-amber-400 tracking-wider block">
                  ADMIN PRO V2.5
                </span>
              </div>
            </div>

            {/* Botón para desplegar menú en móvil */}
            <button
              type="button"
              onClick={() => setIsMobileAdminMenuOpen(!isMobileAdminMenuOpen)}
              className="md:hidden px-3 py-1.5 rounded-xl bg-[#161920] border border-[#252934] text-xs font-bold text-amber-400 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>{isMobileAdminMenuOpen ? 'Cerrar' : 'Módulos'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileAdminMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Menú de Navegación (Visible siempre en desktop, colapsable en móvil) */}
          <div className={`${isMobileAdminMenuOpen ? 'block' : 'hidden md:block'} space-y-4 animate-in fade-in duration-150`}>
            {/* Menú de Navegación Principal */}
            <nav className="space-y-1.5">
              {/* Opción 1: Resumen & KPIs */}
              <button
                type="button"
                onClick={() => { setActiveTab('kpis'); setIsMobileAdminMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  activeTab === 'kpis'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-[#161920]'
                }`}
              >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>Resumen & KPIs</span>
              </div>
            </button>

            {/* Opción 2: Comercios & Clientes (Activo por defecto) */}
            <button
              type="button"
              onClick={() => { setActiveTab('businesses'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'businesses'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4 shrink-0" />
                <span>Comercios & Clientes</span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#f97316] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {pendingApprovalCount || 1}
              </span>
            </button>

            {/* Opción 3: Rubros & Categorías */}
            <button
              type="button"
              onClick={() => { setActiveTab('structure'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'structure'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Rubros & Categorías</span>
              </div>
            </button>

            {/* Opción 4: Zonas de Cumaná */}
            <button
              type="button"
              onClick={() => { setActiveTab('structure'); setIsMobileAdminMenuOpen(false); }}
              className="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-[#161920] transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Zonas de Cumaná</span>
              </div>
            </button>

            {/* Opción 5: Emergencias 171 */}
            <button
              type="button"
              onClick={() => { setActiveTab('emergencias'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'emergencias'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>Emergencias 171</span>
              </div>
            </button>

            {/* Opción 6: Cashea & Ajustes */}
            <button
              type="button"
              onClick={() => { setActiveTab('cumana-conecta'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'cumana-conecta'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>Cashea & Ajustes</span>
              </div>
            </button>
          </nav>

          {/* Submódulos Adicionales */}
          <div className="pt-3 border-t border-[#1e222b] space-y-1">
            <span className="text-[9px] font-mono-tabular font-bold uppercase tracking-wider text-slate-500 px-3 block">
              Módulos Complementarios
            </span>
            <button
              type="button"
              onClick={() => { setActiveTab('videoroutes'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'videoroutes'
                  ? 'bg-[#1e2430] text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>Video-Rutas 9:16</span>
              </div>
              <span className="text-[10px] font-mono-tabular text-slate-500">
                {activeVideoRouteFeed}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('plans'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'plans'
                  ? 'bg-[#1e2430] text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Planes & Precios</span>
              </div>
              <span className="text-[10px] font-mono-tabular text-slate-500">
                {plans.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('verification-requests'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'verification-requests'
                  ? 'bg-[#1e2430] text-teal-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Solicitudes Oficiales</span>
              </div>
              <span className="text-[10px] font-mono-tabular text-teal-400">
                {pendingRequestsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('ads'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'ads'
                  ? 'bg-[#1e2430] text-amber-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Publicidad Banners</span>
              </div>
              <span className="text-[10px] font-mono-tabular text-slate-500">
                {adBanners.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('home-sections'); setIsMobileAdminMenuOpen(false); }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'home-sections'
                  ? 'bg-[#1e2430] text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>En Vivo & Verticales</span>
              </div>
            </button>
          </div>
        </div>
        </div>

        {/* Botón Inferior: + Registrar Cliente */}
        <div className="pt-4 border-t border-[#1e222b]">
          <button
            type="button"
            onClick={handleStartCreate}
            className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Registrar Cliente</span>
          </button>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. CONTENIDO PRINCIPAL A LA DERECHA */}
      {/* ============================================================== */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 bg-[#0a0d14]">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1e222b]/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeTab === 'businesses' && 'Comercios & Clientes'}
              {activeTab === 'kpis' && 'Resumen & Métricas de Plataforma'}
              {activeTab === 'structure' && 'Rubros & Zonas de Cumaná'}
              {activeTab === 'emergencias' && 'Emergencias 171 & Soporte'}
              {activeTab === 'cumana-conecta' && 'Cashea & Ajustes Oficiales'}
              {activeTab === 'videoroutes' && 'Moderación de Video-Rutas 9:16'}
              {activeTab === 'plans' && 'Planes & Precios del Directorio'}
              {activeTab === 'verification-requests' && 'Solicitudes & Verificación'}
              {activeTab === 'ads' && 'Publicidad & Banners Patrocinados'}
              {activeTab === 'home-sections' && 'Cumaná en Vivo & Verticales'}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Control en tiempo real del directorio comercial de Cumaná
            </p>
          </div>

          {/* Acciones de Cabecera */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleStartCreate}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nuevo Comercio</span>
            </button>

            <Link
              href="/tablet"
              className="px-3.5 py-2.5 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              title="Modo Tablet - Registro Táctil de Locales"
            >
              <Tablet className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Modo Tablet</span>
            </Link>

            <Link
              href="/"
              className="px-3.5 py-2.5 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              title="Ver Portal Público"
            >
              <Eye className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Ver Portal</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-[#161920] hover:bg-rose-950/40 border border-[#252934] text-slate-400 hover:text-rose-400 transition-all cursor-pointer shadow-sm"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fila de 6 Tarjetas KPIs (Exacto como en la referencia) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. TOTAL */}
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-slate-400 block">
              TOTAL
            </span>
            <div className="text-2xl font-black text-white">
              {totalBusinesses}
            </div>
          </div>

          {/* 2. PUBLICADOS */}
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-emerald-400 block">
              PUBLICADOS
            </span>
            <div className="text-2xl font-black text-emerald-400">
              {publishedCount}
            </div>
          </div>

          {/* 3. POR APROBAR */}
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-rose-400 block">
              POR APROBAR
            </span>
            <div className="text-2xl font-black text-rose-400">
              {pendingApprovalCount}
            </div>
          </div>

          {/* 4. SOCIOS VIP / DESTACADOS */}
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-amber-400 block">
              SOCIOS VIP
            </span>
            <div className="text-2xl font-black text-amber-400">
              {activeVIP}
            </div>
          </div>

          {/* 5. VERIFICADOS */}
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-teal-400 block">
              VERIFICADOS
            </span>
            <div className="text-2xl font-black text-teal-400">
              {verifiedBusinessesCount}
            </div>
          </div>

          {/* 6. CON CASHEA */}
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-4 space-y-1 shadow-sm">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-amber-400 block">
              CON CASHEA
            </span>
            <div className="text-2xl font-black text-white">
              {withCasheaCount}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* VISTA 1: COMERCIOS & CLIENTES */}
        {/* ============================================================== */}
        {activeTab === 'businesses' && (
          <div className="space-y-4">
            {/* Fila de Filtros Rápidos y Buscador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Pills de Filtrado Rápido */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFilterQuickStatus('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterQuickStatus === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#161920]'
                  }`}
                >
                  Todos ({totalBusinesses})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterQuickStatus('published')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterQuickStatus === 'published'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#161920]'
                  }`}
                >
                  Publicados ({publishedCount})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterQuickStatus('pending')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterQuickStatus === 'pending'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#161920]'
                  }`}
                >
                  Pendientes ({pendingApprovalCount})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterQuickStatus('rejected')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterQuickStatus === 'rejected'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#161920]'
                  }`}
                >
                  Rechazados
                </button>
              </div>

              {/* Buscador de Comercios */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar cliente por nombre o zona..."
                  className="w-full pl-9 pr-4 py-2 bg-[#11141a] border border-[#222630] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* TABLA PRINCIPAL DE COMERCIOS & CLIENTES */}
            <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs divide-y divide-[#1e222b]">
                  <thead className="bg-[#0e1117] text-slate-400 uppercase tracking-wider text-[10px] font-mono-tabular">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">COMERCIO / ZONA</th>
                      <th className="py-3.5 px-3 font-bold text-center">ESTADO</th>
                      <th className="py-3.5 px-3 font-bold text-center">VERIFICADO</th>
                      <th className="py-3.5 px-3 font-bold text-center">PLAN VIP</th>
                      <th className="py-3.5 px-3 font-bold text-center">VITRINA</th>
                      <th className="py-3.5 px-3 font-bold text-center">CASHEA</th>
                      <th className="py-3.5 px-4 font-bold text-right">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e222b]">
                    {filteredList.map((biz) => {
                      const isVip = biz.tier === 'vip' || biz.isFeatured;
                      const inFeed = biz.videoRoute?.showInFeed !== false && !!biz.videoRoute;
                      const hasCashea = biz.acceptsCashea;
                      const isMultiBranch = Boolean(biz.hasBranches && ((biz.branches && biz.branches.length > 1) || biz.hasBranches));
                      const hasFullProfile = isVip || isMultiBranch;

                      return (
                        <tr key={biz.id} className="hover:bg-[#161920]/70 transition-colors">
                          {/* 1. COMERCIO / ZONA */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="font-bold text-white text-sm leading-snug">
                                {biz.name}
                              </div>
                              <div className="text-xs text-slate-400 font-medium">
                                {biz.zone} • {(biz.categories && biz.categories.length > 0 ? biz.categories : [biz.category]).join(', ')}
                              </div>
                              <div className="pt-0.5">
                                {hasFullProfile ? (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono-tabular font-extrabold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                    Ficha Completa {isMultiBranch ? '(Multi-Sede)' : '(Destacado)'}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-mono-tabular font-semibold uppercase bg-[#161920] text-slate-400 border border-[#252934]">
                                    Ficha Flotante
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. ESTADO */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                const next = biz.status === 'active' ? 'pending_approval' : 'active';
                                changeBusinessStatus(biz.id, next);
                                showNotice(`Estatus de "${biz.name}" cambiado a ${next}`);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
                                biz.status === 'active'
                                  ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-400'
                                  : 'bg-rose-950/70 border border-rose-500/40 text-rose-400'
                              }`}
                              title="Clic para alternar estado"
                            >
                              {biz.status === 'active' ? 'ACTIVO' : 'PENDIENTE'}
                            </button>
                          </td>

                          {/* 3. VERIFICADO */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                toggleBusinessVerification(biz.id);
                                showNotice(biz.isVerified ? `Verificado removido de "${biz.name}"` : `✓ Check otorgado a "${biz.name}"`);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
                                biz.isVerified
                                  ? 'bg-teal-950/70 border border-teal-500/40 text-teal-400'
                                  : 'bg-[#161920] border border-[#252934] text-slate-400'
                              }`}
                              title="Clic para otorgar/quitar verificación"
                            >
                              {biz.isVerified ? 'VERIFICADO' : 'NO VERIF.'}
                            </button>
                          </td>

                          {/* 4. PLAN VIP */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                const nextTier = biz.tier === 'vip' ? 'free' : 'vip';
                                changeBusinessTier(biz.id, nextTier);
                                showNotice(`Plan de "${biz.name}" cambiado a ${nextTier.toUpperCase()}`);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-mono-tabular font-black uppercase tracking-wider cursor-pointer transition-all ${
                                isVip
                                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                                  : 'bg-[#161920] border border-[#252934] text-slate-300'
                              }`}
                              title="Clic para alternar Plan Destacado"
                            >
                              {isVip ? 'VIP ACTIVO' : 'ESTÁNDAR'}
                            </button>
                          </td>

                          {/* 5. VITRINA */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                toggleVideoRouteFeed(biz.id);
                                showNotice(inFeed ? `Retirado del carrusel` : `✓ Añadido al carrusel`);
                              }}
                              className={`px-2 py-1 rounded-md text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider cursor-pointer transition-all ${
                                inFeed
                                  ? 'bg-purple-950/70 border border-purple-500/40 text-purple-300'
                                  : 'bg-[#161920] border border-[#252934] text-slate-400'
                              }`}
                              title="Clic para alternar en carrusel"
                            >
                              {inFeed ? 'EN CARRUSEL' : 'NORMAL'}
                            </button>
                          </td>

                          {/* 6. CASHEA */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                updateBusiness(biz.id, { acceptsCashea: !biz.acceptsCashea });
                                showNotice(`Cashea ${!biz.acceptsCashea ? 'activado' : 'desactivado'} en "${biz.name}"`);
                              }}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-mono-tabular font-black uppercase tracking-wider cursor-pointer transition-all ${
                                hasCashea
                                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                                  : 'bg-[#161920] border border-[#252934] text-slate-400'
                              }`}
                              title="Clic para activar/desactivar Cashea"
                            >
                              {hasCashea ? 'CASHEA SÍ' : 'INACTIVO'}
                            </button>
                          </td>

                          {/* 7. ACCIONES */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(biz)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f242e] transition-colors cursor-pointer"
                                title="Editar Ficha"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(biz.id, biz.name)}
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Eliminar Comercio"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 px-4 text-center">
                          <div className="flex flex-col items-center justify-center gap-2.5">
                            <Store className="w-8 h-8 text-slate-500" />
                            <p className="text-sm font-bold text-slate-200">
                              No se encontraron comercios con los filtros o búsqueda actuales
                            </p>
                            <p className="text-xs text-slate-400">
                              Verifica que no tengas activado un filtro rápido de estado ("Pendientes" o "Rechazados") o un término de búsqueda.
                            </p>
                            {(searchTerm || filterQuickStatus !== 'all' || filterStatus !== 'all' || filterCategory !== 'all' || filterTier !== 'all') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchTerm('');
                                  setFilterQuickStatus('all');
                                  setFilterStatus('all');
                                  setFilterCategory('all');
                                  setFilterTier('all');
                                }}
                                className="mt-2 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-all cursor-pointer shadow-sm"
                              >
                                Mostrar todos los comercios ({totalBusinesses})
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VISTA: RESUMEN & KPIS */}
        {/* ============================================================== */}
        {activeTab === 'kpis' && (
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-6 space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Métricas Generales de la Red Comercial
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-[#222630] bg-[#161920] space-y-1">
                <span className="text-xs text-slate-400 font-semibold">Total Comercios Registrados</span>
                <div className="text-3xl font-black text-white">{totalBusinesses}</div>
              </div>
              <div className="p-4 rounded-xl border border-[#222630] bg-[#161920] space-y-1">
                <span className="text-xs text-emerald-400 font-semibold">Publicados & Operativos</span>
                <div className="text-3xl font-black text-emerald-400">{publishedCount}</div>
              </div>
              <div className="p-4 rounded-xl border border-[#222630] bg-[#161920] space-y-1">
                <span className="text-xs text-amber-400 font-semibold">Afiliados a Cashea</span>
                <div className="text-3xl font-black text-amber-400">{withCasheaCount}</div>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('businesses')}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Volver a Comercios & Clientes
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VISTA: EMERGENCIAS 171 */}
        {/* ============================================================== */}
        {activeTab === 'emergencias' && (
          <div className="rounded-2xl border border-[#1e222b] bg-[#11141a] p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-500" />
                <span>Líneas de Emergencia & Atención Ciudadana Cumaná</span>
              </h2>
              <p className="text-xs text-slate-400">
                Líneas telefónicas de acceso directo a cuerpos de seguridad, bomberos y centros hospitalarios de Sucre.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Emergencias 171 / VEN 911', number: '171 / 911', desc: 'Atención policial, ambulancias y rescate Cumaná' },
                { name: 'Bomberos de Cumaná', number: '(0293) 431-2222', desc: 'Central de bomberos y combate de incendios' },
                { name: 'Hospital Universitario Antonio Patricio de Alcalá (HUAPA)', number: '(0293) 467-1111', desc: 'Emergencias médicas de adultos y pediátricas' }
              ].map((em) => (
                <div key={em.name} className="p-4 rounded-xl border border-[#222630] bg-[#161920] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{em.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular font-bold bg-rose-950/60 text-rose-400 border border-rose-500/30">ACTIVO</span>
                  </div>
                  <div className="text-lg font-mono-tabular font-black text-amber-400">{em.number}</div>
                  <p className="text-[11px] text-slate-400">{em.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* ============================================================== */}
          {/* VISTA NUEVA: SOLICITUDES & VERIFICACIÓN OFICIAL EN TIEMPO REAL */}
          {/* ============================================================== */}
          {activeTab === 'verification-requests' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Encabezado del Panel de Verificación */}
              <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0095F6]/15 text-[#0095F6] text-xs font-black border border-[#0095F6]/30 flex items-center gap-1.5">
                        <VerifiedBadge size="sm" />
                        <span>Autenticidad & Fidelidad Oficial</span>
                      </span>
                      <span className="text-xs text-slate-500">Tiempo Real</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-950 dark:text-white flex items-center gap-2">
                      <span>Bandeja de Solicitudes & Verificación de Comercios</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1 max-w-2xl font-medium leading-relaxed">
                      Cada comercio que envía solicitud o nos escribe al WhatsApp de Cumaná Conecta aparece aquí. Con el botón <strong className="text-[#0095F6]">"Otorgar Check de Verificado"</strong> certificarás su autenticidad tipo Instagram de forma inmediata.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{pendingRequestsCount} Pendientes de revisión</span>
                    </span>
                  </div>
                </div>

                {/* Filtros de Solicitudes */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-[#1E2D45] overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setRequestFilterStatus('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      requestFilterStatus === 'all'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-[#A0AEC0]'
                    }`}
                  >
                    Todas ({verificationRequests.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestFilterStatus('pending')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      requestFilterStatus === 'pending'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    <span>Pendientes ({pendingRequestsCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestFilterStatus('verified')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      requestFilterStatus === 'verified'
                        ? 'bg-[#0095F6] text-white shadow-sm'
                        : 'bg-[#0095F6]/10 hover:bg-[#0095F6]/20 text-[#0095F6]'
                    }`}
                  >
                    <VerifiedBadge size="sm" />
                    <span>Verificadas con Check ({verifiedRequestsCount})</span>
                  </button>
                </div>
              </div>

              {/* Listado de Tarjetas de Solicitud */}
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-12 text-center space-y-3">
                    <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
                    <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                      No hay solicitudes en este filtro
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Las nuevas solicitudes entrantes desde la web o vía WhatsApp aparecerán aquí automáticamente.
                    </p>
                  </div>
                ) : (
                  filteredRequests.map((req) => {
                    const isPending = req.status === 'pending';
                    const isVerified = req.status === 'verified';
                    const isFromWhatsapp = req.source === 'whatsapp';

                    return (
                      <div
                        key={req.id}
                        className={`bg-white dark:bg-[#131F33] rounded-3xl border p-6 sm:p-7 shadow-sm transition-all flex flex-col justify-between space-y-6 ${
                          isPending
                            ? 'border-amber-400/60 dark:border-amber-500/40 shadow-amber-500/5 ring-1 ring-amber-500/20'
                            : isVerified
                            ? 'border-[#0095F6]/40 dark:border-[#0095F6]/30'
                            : 'border-slate-200 dark:border-[#1E2D45] opacity-75'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Badge de Origen */}
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                                isFromWhatsapp
                                  ? 'bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/30'
                                  : 'bg-[#0095F6]/15 text-[#0095F6] border border-[#0095F6]/30'
                              }`}>
                                {isFromWhatsapp ? (
                                  <>
                                    <WhatsAppIcon className="w-3 h-3 fill-current" />
                                    <span>Solicitud vía WhatsApp</span>
                                  </>
                                ) : (
                                  <>
                                    <Globe className="w-3 h-3 text-[#0095F6]" />
                                    <span>Formulario Web</span>
                                  </>
                                )}
                              </span>

                              {/* Badge de Estado */}
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                                isPending
                                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                  : isVerified
                                  ? 'bg-[#0095F6]/20 text-[#0095F6]'
                                  : 'bg-red-500/20 text-red-600'
                              }`}>
                                {isPending ? '⏳ Esperando Aprobación' : isVerified ? '✓ Verificado Oficial' : '✕ Rechazada'}
                              </span>

                              <span className="text-[11px] text-slate-400">
                                {new Date(req.createdAt).toLocaleDateString('es-VE', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-black text-slate-950 dark:text-white">
                                {req.businessName}
                              </h3>
                              {isVerified && <VerifiedBadge size="md" />}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-[#A0AEC0]">
                              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                                👤 Propietario: {req.ownerName}
                              </span>
                              <span>•</span>
                              <span className="text-[#008966] dark:text-[#00C292] font-bold">
                                🏷️ {req.category}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" /> {req.zone}
                              </span>
                            </div>
                          </div>

                          {/* Contacto Directo */}
                          <div className="flex sm:flex-col items-end gap-2 shrink-0">
                            <a
                              href={req.whatsapp.startsWith('http') ? req.whatsapp : `https://wa.me/${req.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] border border-[#25D366]/40 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                              <span>{req.whatsapp}</span>
                            </a>

                            {req.instagram && (
                              <a
                                href={req.instagram.startsWith('http') ? req.instagram : `https://instagram.com/${req.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#E1306C] hover:underline flex items-center gap-1"
                              >
                                <InstagramIcon className="w-3 h-3 fill-current" />
                                <span>{req.instagram}</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Notas y Dirección enviada */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] space-y-1.5 text-xs">
                          {req.address && (
                            <div className="text-slate-700 dark:text-[#A0AEC0]">
                              <strong className="text-slate-950 dark:text-white">Dirección declarada:</strong> {req.address}
                            </div>
                          )}
                          {req.notes && (
                            <div className="text-slate-600 dark:text-[#A0AEC0] italic leading-relaxed">
                              "{req.notes}"
                            </div>
                          )}
                        </div>

                        {/* Botones de Acción de Verificación */}
                        <div className="pt-4 border-t border-slate-200 dark:border-[#1E2D45] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {/* Botón Principal: Otorgar Check Oficial Tipo Instagram */}
                            <button
                              type="button"
                              onClick={() => {
                                approveVerificationRequest(req.id);
                                showNotice(`✓ "${req.businessName}" ha recibido la Insignia Oficial de Verificado tipo Instagram.`);
                              }}
                              className={`py-2.5 px-5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                                isVerified
                                  ? 'bg-[#0095F6] text-white hover:bg-[#0095F6]/90'
                                  : 'bg-[#0095F6] hover:bg-[#0095F6]/90 text-white shadow-[#0095F6]/25'
                              }`}
                            >
                              <VerifiedBadge size="sm" />
                              <span>{isVerified ? 'Actualizar / Reconfirmar Check' : 'Otorgar Check de Verificado Oficial'}</span>
                            </button>

                            {/* Botón Contactar por WhatsApp */}
                            <a
                              href={`https://wa.me/${req.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `¡Hola ${req.ownerName}! Te escribimos desde la administración de Cumaná Conecta respecto a la verificación oficial de ${req.businessName}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                              <span>Escribir por WhatsApp</span>
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => {
                                  rejectVerificationRequest(req.id);
                                  showNotice(`Solicitud de "${req.businessName}" desestimada.`);
                                }}
                                className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold transition-all cursor-pointer"
                              >
                                Desestimar
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Eliminar la solicitud de "${req.businessName}" de la lista?`)) {
                                  deleteVerificationRequest(req.id);
                                  showNotice('Solicitud eliminada.');
                                }
                              }}
                              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
                              title="Eliminar registro de solicitud"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Módulo de Verificación Rápida de Todos los Comercios Registrados */}
              <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <VerifiedBadge size="md" />
                    <span>Control Maestro de Insignias Verificadas</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1 font-medium">
                    Activa o desactiva la insignia azul/verde tipo Instagram en cualquier local del directorio con un solo clic.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {businesses.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-950 dark:text-white truncate flex items-center gap-1.5">
                          <span>{b.name}</span>
                          {b.isVerified && <VerifiedBadge size="sm" />}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{b.zone} • {b.category}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          toggleBusinessVerification(b.id);
                          showNotice(
                            b.isVerified
                              ? `Sello removido de "${b.name}"`
                              : `✓ "${b.name}" verificado oficialmente`
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                          b.isVerified
                            ? 'bg-[#0095F6] text-white shadow-sm'
                            : 'bg-slate-200 hover:bg-slate-300 dark:bg-[#1E2D45] dark:hover:bg-[#1E2D45]/80 text-slate-700 dark:text-[#A0AEC0]'
                        }`}
                      >
                        {b.isVerified ? '✓ Verificado' : '+ Asignar'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VISTA 2: ALTA DE COMERCIO DIRECTO (+ REGISTRAR NEGOCIO) */}
          {/* ============================================================== */}
          {activeTab === 'new-business' && (
            <div className="bg-[#11141a] rounded-3xl border border-[#1e222b] p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-200 text-white">
              <div className="border-b border-[#1e222b] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                      Alta de Comercio Directo
                    </span>
                    <span className="text-xs text-slate-400">Módulo Administrativo</span>
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    REGISTRAR NUEVO COMERCIO {formData.name ? `· ${formData.name}` : ''}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Ingresa todos los datos, rubros múltiples, redes sociales, horarios, métodos de pago y fotos de portada. Se guardará de inmediato y de forma permanente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('businesses')}
                  className="px-4 py-2 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-slate-300 hover:text-white text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
                >
                  ← Volver a la Lista
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-8">
                {renderBusinessFormFields()}

                <div className="pt-6 border-t border-[#1e222b] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('businesses')}
                    className="px-5 py-3 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 stroke-[2.5]" />
                    <span>Guardar y Publicar Negocio en Cumaná</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* VISTA 3: ACEPTAR / QUITAR DE VIDEO-RUTA VERTICAL 9:16 */}
          {/* ============================================================== */}
          {activeTab === 'videoroutes' && (
            <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1E2D45]">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#FF6B4A]" />
                    <span>Moderación de Video-Rutas Verticales (Formato 9:16)</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1">
                    Controla qué videos aparecen en el carrusel interactivo de la portada para los visitantes de Cumaná.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0]">
                  Mostrando en Feed: <span className="text-[#FF6B4A] font-black">{activeVideoRouteFeed}</span> de {totalBusinesses} comercios
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((biz) => {
                  const hasVideo = !!biz.videoRoute;
                  const isShowing = hasVideo && biz.videoRoute?.showInFeed !== false;

                  return (
                    <div
                      key={biz.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isShowing
                          ? 'bg-slate-50 dark:bg-[#080E18] border-[#FF6B4A]/50 shadow-md'
                          : 'bg-white dark:bg-[#131F33] border-slate-200 dark:border-[#1E2D45]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isShowing
                              ? 'bg-[#FF6B4A] text-white'
                              : hasVideo
                              ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                          }`}>
                            {isShowing ? '● Visible en Feed' : hasVideo ? '○ Oculto del Feed' : 'Sin Video'}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">{biz.zone}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            src={biz.heroImage}
                            alt={biz.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-[#1E2D45]"
                          />
                          <div>
                            <h3 className="font-extrabold text-sm text-slate-950 dark:text-white flex items-center gap-1.5">
                              <span>{biz.name}</span>
                              {biz.isVerified && <VerifiedBadge size="sm" />}
                            </h3>
                            <p className="text-[11px] text-slate-500">{(biz.categories && biz.categories.length > 0 ? biz.categories : [biz.category]).join(', ')}</p>
                          </div>
                        </div>

                        {hasVideo ? (
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-[#FF6B4A]">
                              <span className="flex items-center gap-1">
                                <Timer className="w-3.5 h-3.5 text-[#FF6B4A]" />
                                {biz.videoRoute?.duration}
                              </span>
                              <span className="text-[10px] text-slate-500">9:16 Vertical</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-[#A0AEC0] line-clamp-1">{biz.videoRoute?.originName}</p>
                            <div className="text-[10px] text-slate-500 font-medium">
                              {biz.videoRoute?.milestones.length || 0} hitos interactivos señalizados
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-[#080E18]/60 text-xs text-slate-500 dark:text-[#A0AEC0] italic border border-slate-200/50 dark:border-[#1E2D45]/50">
                            Este comercio aún no tiene video cargado.
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-[#1E2D45] mt-4 flex items-center justify-between gap-2">
                        {hasVideo ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                toggleVideoRouteFeed(biz.id);
                                showNotice(
                                  isShowing 
                                    ? `Quitado de videoruta: "${biz.name}"` 
                                    : `Aceptado en videoruta: "${biz.name}"`
                                );
                              }}
                              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                isShowing
                                  ? 'bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 border border-red-500/30'
                                  : 'bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 shadow-sm'
                              }`}
                            >
                              {isShowing ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Quitar de Videoruta</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Aceptar para Aparecer</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(biz)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-white border border-slate-200 dark:border-[#1E2D45]"
                              title="Editar URL de video o hitos"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(biz)}
                            className="w-full py-2 px-3 rounded-xl bg-slate-200 hover:bg-[#FF6B4A] hover:text-white dark:bg-[#1E2D45] dark:hover:bg-[#FF6B4A] text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Asignar Video 9:16</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VISTA 4: CAMBIAR PRECIOS, PLANES, TESTIMONIOS (PERSONAS), FAQS & MÉTRICAS */}
          {/* ============================================================== */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              {/* Encabezado Principal y Píldoras de Navegación */}
              <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#008966] dark:text-[#00C292]" />
                      Gestión Integral de Planes & Suscripciones
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1 max-w-2xl">
                      Controla los planes de suscripción, los beneficios clicables, los testimonios reales de personas y comerciantes, preguntas frecuentes y las métricas que se muestran en{' '}
                      <Link href="/planes" target="_blank" className="text-[#FF6B4A] underline font-bold inline-flex items-center gap-1">
                        /planes <ExternalLink className="w-3 h-3" />
                      </Link>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href="/planes"
                      target="_blank"
                      className="px-3.5 py-2 rounded-xl bg-[#008966]/10 text-[#008966] dark:text-[#00C292] hover:bg-[#008966]/20 text-xs font-bold border border-[#008966]/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Página Pública</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('¿Restablecer todos los planes, testimonios, preguntas frecuentes y métricas a los valores originales predeterminados?')) {
                          resetPlansToDefault();
                          resetPlansPageConfigToDefault();
                          showNotice('✓ Todo el contenido de /planes ha sido restaurado a los valores predeterminados.');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white text-xs font-bold border border-slate-200 dark:border-[#1E2D45] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer Predeterminados</span>
                    </button>
                  </div>
                </div>

                {/* Píldoras de Navegación Secundaria */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-[#1E2D45]/60">
                  <button
                    type="button"
                    onClick={() => setPlansSubTab('plans')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      plansSubTab === 'plans'
                        ? 'bg-[#FF6B4A] text-white shadow-md shadow-[#FF6B4A]/25'
                        : 'bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white border border-slate-200 dark:border-[#1E2D45]'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Planes & Beneficios</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      plansSubTab === 'plans' ? 'bg-black/25 text-white' : 'bg-slate-200 dark:bg-[#1E2D45] text-slate-700 dark:text-slate-300'
                    }`}>
                      {plans.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlansSubTab('testimonials')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      plansSubTab === 'testimonials'
                        ? 'bg-[#FF6B4A] text-white shadow-md shadow-[#FF6B4A]/25'
                        : 'bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white border border-slate-200 dark:border-[#1E2D45]'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Personas & Comentarios (Testimonios)</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      plansSubTab === 'testimonials' ? 'bg-black/25 text-white' : 'bg-slate-200 dark:bg-[#1E2D45] text-slate-700 dark:text-slate-300'
                    }`}>
                      {plansPageConfig.testimonials.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlansSubTab('faqs')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      plansSubTab === 'faqs'
                        ? 'bg-[#FF6B4A] text-white shadow-md shadow-[#FF6B4A]/25'
                        : 'bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white border border-slate-200 dark:border-[#1E2D45]'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Preguntas Frecuentes (FAQ)</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      plansSubTab === 'faqs' ? 'bg-black/25 text-white' : 'bg-slate-200 dark:bg-[#1E2D45] text-slate-700 dark:text-slate-300'
                    }`}>
                      {plansPageConfig.faqs.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlansSubTab('metrics')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                      plansSubTab === 'metrics'
                        ? 'bg-[#FF6B4A] text-white shadow-md shadow-[#FF6B4A]/25'
                        : 'bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white border border-slate-200 dark:border-[#1E2D45]'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Métricas & Video-Ruta</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      plansSubTab === 'metrics' ? 'bg-black/25 text-white' : 'bg-slate-200 dark:bg-[#1E2D45] text-slate-700 dark:text-slate-300'
                    }`}>
                      {plansPageConfig.metrics.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* ============================================================== */}
              {/* SUB-PESTAÑA 1: PLANES & BENEFICIOS */}
              {/* ============================================================== */}
              {plansSubTab === 'plans' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-lg bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/30">
                            Tier: {p.tier}
                          </span>
                          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-[#A0AEC0] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={p.isPopular}
                              onChange={(e) => updatePlan(p.id, { isPopular: e.target.checked })}
                              className="rounded accent-[#FF6B4A]"
                            />
                            <span>Destacado Pro</span>
                          </label>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Nombre del Plan:</label>
                          <input
                            type="text"
                            value={p.name}
                            onChange={(e) => updatePlan(p.id, { name: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Etiqueta Superior (Badge):</label>
                          <input
                            type="text"
                            value={p.badge || ''}
                            placeholder="Ej: RECOMENDADO VIP, COMUNIDAD"
                            onChange={(e) => updatePlan(p.id, { badge: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Precio Mensual ($):</label>
                            <input
                              type="number"
                              value={p.priceMonthly}
                              onChange={(e) => updatePlan(p.id, { priceMonthly: Number(e.target.value) })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-black text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Precio Semestral ($):</label>
                            <input
                              type="number"
                              value={p.priceYearly}
                              onChange={(e) => updatePlan(p.id, { priceYearly: Number(e.target.value) })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-black text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Lema / Subtítulo del Plan:</label>
                          <textarea
                            rows={2}
                            value={p.tagline}
                            onChange={(e) => updatePlan(p.id, { tagline: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Texto del Botón:</label>
                          <input
                            type="text"
                            value={p.buttonText}
                            onChange={(e) => updatePlan(p.id, { buttonText: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Encabezado de Beneficios:</label>
                          <input
                            type="text"
                            value={p.featuresHeader || 'INCLUYE:'}
                            placeholder="Ej: INCLUYE: o TODO LO DE DESTACADO MÁS:"
                            onChange={(e) => updatePlan(p.id, { featuresHeader: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                          />
                        </div>

                        {/* Gestor interactivo de beneficios uno a uno */}
                        <div className="pt-2 border-t border-slate-100 dark:border-[#1E2D45]">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-2 flex items-center justify-between">
                            <span>Beneficios ({p.features.length}) - Clic en ✕ para quitar:</span>
                          </label>

                          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                            {p.features.map((feature, fIdx) => (
                              <div
                                key={fIdx}
                                className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] text-xs text-slate-800 dark:text-slate-200 group"
                              >
                                <div className="flex items-start gap-1.5 min-w-0">
                                  <Check className="w-3.5 h-3.5 text-[#00C292] shrink-0 mt-0.5" />
                                  <span className="text-[11px] leading-tight break-words">{feature}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    removePlanBenefit(p.id, fIdx);
                                    showNotice(`Beneficio #${fIdx + 1} eliminado de ${p.name}`);
                                  }}
                                  className="text-slate-400 hover:text-red-500 transition-colors shrink-0 p-1 cursor-pointer"
                                  title="Quitar este beneficio"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Añadir nuevo beneficio con un solo clic */}
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newBenefitInputs[p.id] || ''}
                              onChange={(e) => setNewBenefitInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const text = (newBenefitInputs[p.id] || '').trim();
                                  if (text) {
                                    addPlanBenefit(p.id, text);
                                    setNewBenefitInputs(prev => ({ ...prev, [p.id]: '' }));
                                    showNotice(`✓ Beneficio agregado a ${p.name}`);
                                  }
                                }
                              }}
                              placeholder="Escribe nuevo beneficio..."
                              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const text = (newBenefitInputs[p.id] || '').trim();
                                if (!text) return;
                                addPlanBenefit(p.id, text);
                                setNewBenefitInputs(prev => ({ ...prev, [p.id]: '' }));
                                showNotice(`✓ Beneficio agregado a ${p.name}`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Añadir</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45]">
                        <button
                          type="button"
                          onClick={() => showNotice(`✓ Plan "${p.name}" actualizado y guardado en tiempo real.`)}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Save className="w-4 h-4" />
                          <span>Guardar Cambios de {p.name}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ============================================================== */}
              {/* SUB-PESTAÑA 2: PERSONAS & COMENTARIOS (TESTIMONIOS) */}
              {/* ============================================================== */}
              {plansSubTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#FF6B4A]" />
                        <span>Testimonios de Personas & Comerciantes</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] font-bold">
                          {plansPageConfig.testimonials.filter(t => t.isActive).length} Activos en /planes
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1">
                        Puedes añadir nuevas personas, editar sus comentarios, o dar clic en el botón de estado para ocultarlos o mostrarlos inmediatamente.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddTestimonial}
                      className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-[#FF6B4A]/25 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Nueva Persona / Testimonio</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {plansPageConfig.testimonials.map((testimonio) => (
                      <div
                        key={testimonio.id}
                        className={`bg-white dark:bg-[#131F33] rounded-2xl border transition-all p-5 shadow-sm flex flex-col justify-between ${
                          testimonio.isActive 
                            ? 'border-slate-200 dark:border-[#1E2D45]' 
                            : 'border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Encabezado: Avatar + Nombre + Estado */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${testimonio.avatarColor || 'from-[#008966] to-[#00C292]'} flex items-center justify-center text-white font-black text-sm shadow-md shrink-0`}>
                                {testimonio.initials || 'CC'}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-slate-950 dark:text-white leading-tight">
                                  {testimonio.name}
                                </h4>
                                <p className="text-xs text-[#008966] dark:text-[#00C292] font-semibold mt-0.5">
                                  {testimonio.businessName}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                  📍 {testimonio.zone}
                                </p>
                              </div>
                            </div>

                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              testimonio.isActive 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {testimonio.isActive ? 'Activo' : 'Oculto'}
                            </span>
                          </div>

                          {/* Estrellas */}
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(testimonio.stars || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>

                          {/* Cita */}
                          <div className="relative pl-3 border-l-2 border-[#FF6B4A]/40 text-xs italic text-slate-700 dark:text-[#DDE2F1]">
                            "{testimonio.quote}"
                          </div>
                        </div>

                        {/* Botones de acción rápida: Activar/Desactivar, Editar, Eliminar */}
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#1E2D45] flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              toggleTestimonialActive(testimonio.id);
                              showNotice(testimonio.isActive ? `Testimonio de "${testimonio.name}" ocultado en la web.` : `Testimonio de "${testimonio.name}" activado en la web.`);
                            }}
                            className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              testimonio.isActive
                                ? 'bg-slate-100 dark:bg-[#080E18] text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                                : 'bg-[#00C292] text-slate-950 font-black'
                            }`}
                          >
                            {testimonio.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{testimonio.isActive ? 'Ocultar' : 'Mostrar'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditTestimonial(testimonio)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-white transition-all cursor-pointer"
                            title="Editar este testimonio"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar el testimonio de "${testimonio.name}"?`)) {
                                deleteTestimonial(testimonio.id);
                                showNotice(`Testimonio de "${testimonio.name}" eliminado.`);
                              }
                            }}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
                            title="Eliminar este testimonio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* SUB-PESTAÑA 3: PREGUNTAS FRECUENTES (FAQ) */}
              {/* ============================================================== */}
              {plansSubTab === 'faqs' && (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#FF6B4A]" />
                        <span>Preguntas Frecuentes de Comercios</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FF6B4A]/10 text-[#FF6B4A] font-bold">
                          {plansPageConfig.faqs.filter(f => f.isActive).length} Visibles en /planes
                        </span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1">
                        Añade, edita, oculta o elimina las respuestas a dudas habituales sobre pagos en Bs, producción de video-rutas o contratos.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddFaq}
                      className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md shadow-[#FF6B4A]/25 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Nueva Pregunta Frecuente</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {plansPageConfig.faqs.map((faq, index) => (
                      <div
                        key={faq.id}
                        className={`bg-white dark:bg-[#131F33] rounded-2xl border transition-all p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          faq.isActive 
                            ? 'border-slate-200 dark:border-[#1E2D45]' 
                            : 'border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-[#FF6B4A]/10 text-[#FF6B4A] flex items-center justify-center shrink-0 font-bold text-xs">
                            #{index + 1}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-extrabold text-sm text-slate-950 dark:text-white">
                                {faq.question}
                              </h4>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                faq.isActive 
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}>
                                {faq.isActive ? 'Visible' : 'Oculta'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-[#A0AEC0] leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              toggleFaqActive(faq.id);
                              showNotice(faq.isActive ? 'Pregunta ocultada en la web.' : 'Pregunta activada en la web.');
                            }}
                            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              faq.isActive
                                ? 'bg-slate-100 dark:bg-[#080E18] text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                                : 'bg-[#00C292] text-slate-950 font-black'
                            }`}
                          >
                            {faq.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{faq.isActive ? 'Ocultar' : 'Activar'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditFaq(faq)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-white transition-all cursor-pointer"
                            title="Editar pregunta"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar la pregunta "${faq.question}"?`)) {
                                deleteFaq(faq.id);
                                showNotice('Pregunta eliminada.');
                              }
                            }}
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer"
                            title="Eliminar pregunta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* SUB-PESTAÑA 4: MÉTRICAS & VIDEO-RUTA */}
              {/* ============================================================== */}
              {plansSubTab === 'metrics' && (
                <div className="space-y-6">
                  {/* Tarjetas de Métricas */}
                  <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#00C292]" />
                      <span>4 Tarjetas de Métricas Estadísticas de Cumaná Conecta</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A0AEC0]">
                      Estas 4 cifras aparecen en la cabecera de <span className="font-mono text-[#FF6B4A]">/planes</span> para generar confianza y credibilidad en los comerciantes locales.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                      {plansPageConfig.metrics.map((stat: MetricStat) => (
                        <div
                          key={stat.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] space-y-3"
                        >
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 block mb-1">
                              Cifra / Valor:
                            </label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => updateMetricStat(stat.id, { value: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-lg text-sm font-black text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                              Etiqueta Explicativa:
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => updateMetricStat(stat.id, { label: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-lg text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                              Píldora / Tag:
                            </label>
                            <input
                              type="text"
                              value={stat.tag}
                              onChange={(e) => updateMetricStat(stat.id, { tag: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-lg text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                              Subtexto de Auditoría:
                            </label>
                            <input
                              type="text"
                              value={stat.subtext || ''}
                              onChange={(e) => updateMetricStat(stat.id, { subtext: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-lg text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configuración de Video-Ruta Spotlight */}
                  <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-[#FF6B4A]" />
                      <span>Módulo Spotlight: Video-Rutas Inmersivas 9:16</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A0AEC0]">
                      Edita los textos promocionales del bloque destacado donde se explica la producción audiovisual con dron y recorrido a ras de suelo.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Título del Módulo:</label>
                        <input
                          type="text"
                          value={plansPageConfig.spotlight.title}
                          onChange={(e) => updatePlansPageConfig({
                            spotlight: { ...plansPageConfig.spotlight, title: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Badge Superior:</label>
                        <input
                          type="text"
                          value={plansPageConfig.spotlight.tag}
                          onChange={(e) => updatePlansPageConfig({
                            spotlight: { ...plansPageConfig.spotlight, tag: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Descripción General:</label>
                        <textarea
                          rows={2}
                          value={plansPageConfig.spotlight.description}
                          onChange={(e) => updatePlansPageConfig({
                            spotlight: { ...plansPageConfig.spotlight, description: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Ruta Demostrativa (Ejemplo):</label>
                        <input
                          type="text"
                          value={plansPageConfig.spotlight.demoRoute}
                          onChange={(e) => updatePlansPageConfig({
                            spotlight: { ...plansPageConfig.spotlight, demoRoute: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">
                          Archivo o URL del Video Demo Oficial:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={plansPageConfig.spotlight.demoVideoUrl || '/sample-videoruta.mp4'}
                            onChange={(e) => updatePlansPageConfig({
                              spotlight: { ...plansPageConfig.spotlight, demoVideoUrl: e.target.value }
                            })}
                            placeholder="/sample-videoruta.mp4"
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-mono font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                          />
                          <a
                            href={plansPageConfig.spotlight.demoVideoUrl || '/sample-videoruta.mp4'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-[#008966]/10 text-[#008966] dark:text-[#00C292] hover:bg-[#008966]/20 text-xs font-bold border border-[#008966]/30 flex items-center gap-1 shrink-0"
                            title="Probar video"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Probar</span>
                          </a>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">Texto Botón WhatsApp Final:</label>
                        <input
                          type="text"
                          value={plansPageConfig.ctaWhatsappText}
                          onChange={(e) => updatePlansPageConfig({ ctaWhatsappText: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45]">
                      <button
                        type="button"
                        onClick={() => showNotice('✓ Métricas y textos de Video-Ruta actualizados con éxito.')}
                        className="py-2.5 px-4 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Save className="w-4 h-4" />
                        <span>Guardar Cambios de Métricas & Spotlight</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* VISTA 5: CATEGORÍAS & SECTORES */}
          {/* ============================================================== */}
          {activeTab === 'structure' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#FF6B4A]" />
                    Estructura de la Plataforma Web
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1">
                    Administra las categorías comerciales de Cumaná, sectores geográficos y textos del encabezado principal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetStructureToDefault();
                    showNotice('Estructura restablecida a la predeterminada.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white text-xs font-bold border border-slate-200 dark:border-[#1E2D45] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer Estructura</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#008966] dark:text-[#00C292]" />
                    Categorías de Negocios ({structure.categories.length})
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCatInput}
                      onChange={(e) => setNewCatInput(e.target.value)}
                      placeholder="Nueva categoría (ej. Panaderías & Cafés)..."
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCatInput.trim()) {
                          addCategory(newCatInput.trim());
                          showNotice(`Categoría "${newCatInput.trim()}" agregada.`);
                          setNewCatInput('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#00C292] text-slate-950 text-xs font-black hover:bg-[#00C292]/90 cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {structure.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#080E18] text-xs font-bold text-slate-800 dark:text-[#DDE2F1] border border-slate-200 dark:border-[#1E2D45]"
                      >
                        <span>{cat}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Eliminar categoría "${cat}"?`)) {
                              removeCategory(cat);
                              showNotice(`Categoría "${cat}" eliminada.`);
                            }
                          }}
                          className="p-0.5 hover:text-red-500 rounded cursor-pointer"
                          title="Eliminar categoría"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF6B4A]" />
                    Sectores Geográficos & Bahías ({structure.zones.length})
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newZoneInput}
                      onChange={(e) => setNewZoneInput(e.target.value)}
                      placeholder="Nuevo sector (ej. Los Cocos, Caigüire)..."
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newZoneInput.trim()) {
                          addZone(newZoneInput.trim());
                          showNotice(`Sector "${newZoneInput.trim()}" agregado.`);
                          setNewZoneInput('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF6B4A] text-white text-xs font-black hover:bg-[#FF6B4A]/90 cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {structure.zones.map((zone) => (
                      <span
                        key={zone}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#080E18] text-xs font-bold text-slate-800 dark:text-[#DDE2F1] border border-slate-200 dark:border-[#1E2D45]"
                      >
                        <span>{zone}</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Eliminar sector "${zone}"?`)) {
                              removeZone(zone);
                              showNotice(`Sector "${zone}" eliminado.`);
                            }
                          }}
                          className="p-0.5 hover:text-red-500 rounded cursor-pointer"
                          title="Eliminar sector"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-[#FF6B4A]" />
                  Títulos y Textos Principales del Encabezado
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">
                      Título Principal (Hero H1):
                    </label>
                    <input
                      type="text"
                      value={structure.siteTitle}
                      onChange={(e) => updateStructure({ siteTitle: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">
                      Cintillo Superior en Vivo (Clima / Brisa):
                    </label>
                    <input
                      type="text"
                      value={structure.liveWeatherText}
                      onChange={(e) => updateStructure({ liveWeatherText: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-[#A0AEC0] block mb-1">
                    Subtítulo Principal del Directorio:
                  </label>
                  <textarea
                    rows={2}
                    value={structure.heroSubtitle}
                    onChange={(e) => updateStructure({ heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => showNotice('✓ Textos del sitio guardados.')}
                  className="py-2.5 px-4 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Textos</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VISTA 6: DATOS OFICIALES DE CUMANÁ CONECTA */}
          {/* ============================================================== */}
          {activeTab === 'cumana-conecta' && (
            <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-10 shadow-lg space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 dark:border-[#1E2D45] pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00C292]/20 text-[#008966] dark:text-[#00C292] text-xs font-black border border-[#00C292]/30">
                    Datos Institucionales
                  </span>
                  <span className="text-xs text-slate-500">Configuración Central de Cumaná Conecta</span>
                </div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                  Canales Oficiales & Redes de Cumaná Conecta
                </h2>
                <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1 font-medium">
                  Configura el número oficial de WhatsApp para atención y soporte, el correo de contacto, las cuentas oficiales en redes sociales (TikTok, Instagram, Facebook, YouTube) y los anuncios emitidos en el pie y cabecera del portal.
                </p>
              </div>

              <form onSubmit={handleSavePlatformSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-2">
                      <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                      WhatsApp Oficial de Cumaná Conecta *
                    </label>
                    <input
                      type="text"
                      required
                      value={platformForm.contactWhatsapp}
                      onChange={(e) => setPlatformForm({ ...platformForm, contactWhatsapp: e.target.value })}
                      placeholder="https://wa.me/584147778899"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-mono focus:outline-none focus:border-[#FF6B4A]"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Aparece en el botón de contacto oficial del pie de página y botones de ayuda.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#FF6B4A]" />
                      Correo Electrónico Institucional *
                    </label>
                    <input
                      type="email"
                      required
                      value={platformForm.contactEmail}
                      onChange={(e) => setPlatformForm({ ...platformForm, contactEmail: e.target.value })}
                      placeholder="contacto@cumanaconecta.com"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-mono focus:outline-none focus:border-[#FF6B4A]"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Canal para soporte corporativo y solicitudes de comercios.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-[#1E2D45]">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-2">
                      <InstagramIcon className="w-4 h-4 fill-[#E1306C]" />
                      Instagram Oficial de Cumaná Conecta
                    </label>
                    <input
                      type="text"
                      value={platformForm.socialInstagram}
                      onChange={(e) => setPlatformForm({ ...platformForm, socialInstagram: e.target.value })}
                      placeholder="https://instagram.com/cumanaconecta"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-2">
                      <TikTokIcon className="w-4 h-4 fill-slate-800 dark:fill-white" />
                      TikTok Oficial de Cumaná Conecta
                    </label>
                    <input
                      type="text"
                      value={platformForm.socialTiktok}
                      onChange={(e) => setPlatformForm({ ...platformForm, socialTiktok: e.target.value })}
                      placeholder="https://tiktok.com/@cumanaconecta"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-2">
                      <FacebookIcon className="w-4 h-4 fill-[#1877F2]" />
                      Facebook Oficial de Cumaná Conecta
                    </label>
                    <input
                      type="text"
                      value={platformForm.socialFacebook}
                      onChange={(e) => setPlatformForm({ ...platformForm, socialFacebook: e.target.value })}
                      placeholder="https://facebook.com/cumanaconecta"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-red-500" />
                      Canal de YouTube Oficial (Opcional)
                    </label>
                    <input
                      type="text"
                      value={platformForm.socialYoutube || ''}
                      onChange={(e) => setPlatformForm({ ...platformForm, socialYoutube: e.target.value })}
                      placeholder="https://youtube.com/@cumanaconecta"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#1E2D45]">
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    Anuncio o Lema Institucional en el Portal
                  </label>
                  <textarea
                    rows={2}
                    value={platformForm.officialAnnouncement}
                    onChange={(e) => setPlatformForm({ ...platformForm, officialAnnouncement: e.target.value })}
                    placeholder="Directorio digital oficial y georutas del Estado Sucre, Venezuela."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#1E2D45] flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Datos Oficiales de Cumaná Conecta</span>
                  </button>
                </div>
              </form>

              {/* TARJETA DE ESTADO Y CONTROL DE CUMANÁBOT IA GEMINI */}
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-[#1E2D45] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#072B2B] border border-[#00C292]/40 flex items-center justify-center text-[#00E5AA]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          CumanáBot IA
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                          GEMINI 3.7
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          ● Activo en todo el portal
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                        Asistente interactivo flotante en la esquina inferior derecha con priorización comercial garantizada.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      Prioridad 1
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      Clientes Aliados VIP Costa
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Aparecen primero en cada respuesta con tarjeta destacada y enlace directo.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#00C292]/10 border border-[#00C292]/30">
                    <span className="text-[10px] font-black text-[#00C292] uppercase tracking-wider block">
                      Prioridad 2
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      Clientes Destacado Pro
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Recomendados en segunda posición con check de verificación oficial.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45]">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                      Prioridad 3
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                      Plan Comunidad (Gratis)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Indexados en la base general si no hay clientes de pago coincidentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: PUBLICIDAD & BANNERS PATROCINADOS EN EL FEED */}
          {/* ============================================================== */}
          {activeTab === 'ads' && (
            <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-[#1E2D45] gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/30">
                      Monetización & Banners en Feed
                    </span>
                    <span className="text-xs text-slate-500 dark:text-[#A0AEC0] font-semibold">
                      {adBanners.filter(a => a.isActive).length} Activos
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-amber-500" />
                    <span>Publicidad & Banners Horizontales</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1 font-medium max-w-2xl">
                    Administra los cuadros y franjas horizontales publicitarias que aparecen intercaladas en los resultados del directorio. Modifica imágenes, textos, llamadas a la acción y enlaces cuando gustes.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenCreateAd}
                    className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Crear Anuncio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Restablecer anuncios publicitarios a los valores de muestra predeterminados?')) {
                        resetAdBannersToDefault();
                        showNotice('✓ Anuncios publicitarios restablecidos.');
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-600 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#1E2D45] transition-all cursor-pointer"
                    title="Restablecer Anuncios de Muestra"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lista de Anuncios */}
              <div className="space-y-4">
                {adBanners.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] space-y-3">
                    <Megaphone className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-[#A0AEC0]">No hay anuncios publicitarios configurados.</p>
                    <button
                      type="button"
                      onClick={handleOpenCreateAd}
                      className="px-4 py-2 rounded-xl bg-[#FF6B4A] text-white text-xs font-bold"
                    >
                      + Crear Primer Anuncio
                    </button>
                  </div>
                ) : (
                  adBanners.map(ad => (
                    <div
                      key={ad.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                        ad.isActive
                          ? 'bg-white dark:bg-[#080E18] border-amber-500/30 shadow-sm'
                          : 'bg-slate-50 dark:bg-[#080E18]/60 border-slate-200 dark:border-[#1E2D45] opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full sm:w-40 h-24 object-cover rounded-xl border border-slate-200 dark:border-white/10 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase border border-amber-500/40">
                              {ad.badgeText}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ad.isActive ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                              {ad.isActive ? '● Activo en Feed' : '○ Pausado'}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-[#A0AEC0]">
                              (Aparece cada {ad.positionInterval || 4} resultados)
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">
                            {ad.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-[#A0AEC0] line-clamp-2 leading-relaxed">
                            {ad.subtitle}
                          </p>
                          <div className="pt-1 flex items-center gap-3 text-[11px] text-[#FF6B4A] font-bold">
                            <span>Botón: "{ad.buttonText}"</span>
                            <span>•</span>
                            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                              <span>Enlace: {ad.linkUrl.startsWith('http') ? 'Destino Externo' : ad.linkUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            toggleAdBannerActive(ad.id);
                            showNotice(ad.isActive ? 'Anuncio pausado.' : 'Anuncio activado en feed.');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            ad.isActive
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-slate-100 dark:bg-[#1E2D45] text-slate-600 dark:text-[#A0AEC0] border-slate-200 dark:border-transparent'
                          }`}
                        >
                          {ad.isActive ? 'Activo' : 'Pausado'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditAd(ad)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E2D45] dark:hover:bg-[#FF6B4A] text-slate-700 dark:text-[#DDE2F1] dark:hover:text-white transition-all cursor-pointer"
                          title="Editar Anuncio"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAd(ad.id, ad.title)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 transition-all cursor-pointer"
                          title="Eliminar Anuncio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 8: CUMANÁ EN VIVO & EXPLORA POR VERTICALES */}
          {/* ============================================================== */}
          {activeTab === 'home-sections' && (
            <div className="space-y-8">
              {/* Encabezado General del Módulo */}
              <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-[#1E2D45] gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        Página de Inicio / Landing
                      </span>
                      <span className="text-xs text-slate-500 dark:text-[#A0AEC0] font-semibold">
                        Control de Visibilidad y Contenido
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                      <Radio className="w-6 h-6 text-[#00C292]" />
                      <span>Cumaná en Vivo & Explora por Verticales</span>
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-[#A0AEC0] mt-1 font-medium max-w-2xl">
                      Activa o desactiva con un click estas dos secciones para que aparezcan o desaparezcan del portal de inicio cuando gustes. Personaliza sus nombres, imágenes, horarios, enlaces y categorías.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('¿Restablecer "Cumaná en Vivo" y "Explora por Verticales" a los valores iniciales predeterminados?')) {
                          resetLiveSectionToDefault();
                          resetVerticalsSectionToDefault();
                          showNotice('✓ Secciones restablecidas a valores de muestra.');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-600 dark:text-[#A0AEC0] border border-slate-200 dark:border-[#1E2D45] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restablecer Ambas</span>
                    </button>
                  </div>
                </div>

                {/* INTERRUPTORES MAESTROS DE VISIBILIDAD (ON / OFF) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                  {/* Interruptor 1: Cumaná en Vivo */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    liveSectionConfig.isEnabled 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 shadow-xs' 
                      : 'bg-slate-50 dark:bg-[#080E18]/60 border-slate-200 dark:border-[#1E2D45] opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          liveSectionConfig.isEnabled ? 'bg-[#00C292] text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <Radio className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>Sección "Cumaná en Vivo"</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-[#A0AEC0] font-medium">
                            {liveSectionConfig.isEnabled ? '🟢 Visible en la página principal' : '🔴 Oculta del público'}
                          </p>
                        </div>
                      </div>

                      {/* Botón Switch Toggle On/Off */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleLiveSectionEnabled();
                          showNotice(liveSectionConfig.isEnabled ? 'Sección "Cumaná en Vivo" desactivada en el inicio.' : '✓ Sección "Cumaná en Vivo" activada en el inicio.');
                        }}
                        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          liveSectionConfig.isEnabled ? 'bg-[#00C292]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={liveSectionConfig.isEnabled ? 'Click para Desactivar' : 'Click para Activar'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            liveSectionConfig.isEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>{liveSectionConfig.items.filter(i => i.isActive).length} de {liveSectionConfig.items.length} despachos activos</span>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                        liveSectionConfig.isEnabled ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {liveSectionConfig.isEnabled ? 'En Pantalla' : 'Apagado'}
                      </span>
                    </div>
                  </div>

                  {/* Interruptor 2: Explora por Verticales */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    verticalsSectionConfig.isEnabled 
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500/30 shadow-xs' 
                      : 'bg-slate-50 dark:bg-[#080E18]/60 border-slate-200 dark:border-[#1E2D45] opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          verticalsSectionConfig.isEnabled ? 'bg-[#FF6B4A] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>Sección "Explora por Verticales"</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-[#A0AEC0] font-medium">
                            {verticalsSectionConfig.isEnabled ? '🟢 Visible en la página principal' : '🔴 Oculta del público'}
                          </p>
                        </div>
                      </div>

                      {/* Botón Switch Toggle On/Off */}
                      <button
                        type="button"
                        onClick={() => {
                          toggleVerticalsSectionEnabled();
                          showNotice(verticalsSectionConfig.isEnabled ? 'Sección "Explora por Verticales" desactivada en el inicio.' : '✓ Sección "Explora por Verticales" activada en el inicio.');
                        }}
                        className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          verticalsSectionConfig.isEnabled ? 'bg-[#FF6B4A]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        title={verticalsSectionConfig.isEnabled ? 'Click para Desactivar' : 'Click para Activar'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            verticalsSectionConfig.isEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>{verticalsSectionConfig.items.filter(i => i.isActive).length} de {verticalsSectionConfig.items.length} tarjetas activas</span>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${
                        verticalsSectionConfig.isEnabled ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {verticalsSectionConfig.isEnabled ? 'En Pantalla' : 'Apagado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 1: GESTIÓN DE CUMANÁ EN VIVO */}
              <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1E2D45] gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Radio className="w-5 h-5 text-[#00C292]" />
                      <span>1. Configuración de "Cumaná en Vivo"</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                      Historias y despachos en tiempo real con fotos circulares y distintivos.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCreateLive}
                    className="px-4 py-2.5 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Agregar Despacho</span>
                  </button>
                </div>

                {/* Textos de la Cabecera de la Sección */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45]">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                      Título de la Sección:
                    </label>
                    <input
                      type="text"
                      value={liveSectionConfig.title}
                      onChange={(e) => updateLiveSectionConfig({ title: e.target.value })}
                      placeholder="Cumaná en Vivo"
                      className="w-full px-3 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00C292]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                      Subtítulo Descriptivo:
                    </label>
                    <input
                      type="text"
                      value={liveSectionConfig.subtitle}
                      onChange={(e) => updateLiveSectionConfig({ subtitle: e.target.value })}
                      placeholder="Despachos visuales de las últimas 6 horas"
                      className="w-full px-3 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#00C292]"
                    />
                  </div>
                </div>

                {/* Lista de Despachos en Vivo */}
                <div className="space-y-3">
                  <span className="text-xs font-extrabold uppercase text-slate-400 dark:text-[#A0AEC0] tracking-wider block">
                    Despachos Configurados ({liveSectionConfig.items.length})
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {liveSectionConfig.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          item.isActive
                            ? 'bg-white dark:bg-[#080E18] border-slate-200 dark:border-slate-800 shadow-xs'
                            : 'bg-slate-50 dark:bg-[#080E18]/50 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Miniatura Circular */}
                          <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#FF6B4A] to-[#00C292] shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#080E18]" />
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                              {item.subtitle}
                            </p>
                            <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
                              Insignia: {item.badgeType}
                            </span>
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Toggle Individual */}
                          <button
                            type="button"
                            onClick={() => toggleLiveDispatchActive(item.id)}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${
                              item.isActive
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800'
                            }`}
                            title={item.isActive ? 'Desactivar esta historia' : 'Activar esta historia'}
                          >
                            {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          {/* Editar */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditLive(item)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131F33] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                            title="Editar Despacho"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleDeleteLive(item.id, item.name)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-500 transition-all cursor-pointer"
                            title="Eliminar Despacho"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PANEL 2: GESTIÓN DE EXPLORA POR VERTICALES */}
              <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1E2D45] gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#FF6B4A]" />
                      <span>2. Configuración de "Explora por Verticales"</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                      Tarjetas de alto impacto visual vinculadas a las categorías del directorio.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCreateVertical}
                    className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-black transition-all flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Agregar Vertical</span>
                  </button>
                </div>

                {/* Textos de la Cabecera de Verticales */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45]">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                      Etiqueta Superior (Tagline):
                    </label>
                    <input
                      type="text"
                      value={verticalsSectionConfig.tagline}
                      onChange={(e) => updateVerticalsSectionConfig({ tagline: e.target.value })}
                      placeholder="ECOSISTEMA URBANO & MARÍTIMO"
                      className="w-full px-3 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                      Título Principal:
                    </label>
                    <input
                      type="text"
                      value={verticalsSectionConfig.title}
                      onChange={(e) => updateVerticalsSectionConfig({ title: e.target.value })}
                      placeholder="Explora por Verticales"
                      className="w-full px-3 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                      Texto de Contador / Resumen:
                    </label>
                    <input
                      type="text"
                      value={verticalsSectionConfig.counterText}
                      onChange={(e) => updateVerticalsSectionConfig({ counterText: e.target.value })}
                      placeholder="208 comercios y experiencias curadas"
                      className="w-full px-3 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>
                </div>

                {/* Lista de Tarjetas de Verticales */}
                <div className="space-y-3">
                  <span className="text-xs font-extrabold uppercase text-slate-400 dark:text-[#A0AEC0] tracking-wider block">
                    Tarjetas Configuradas ({verticalsSectionConfig.items.length})
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {verticalsSectionConfig.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                          item.isActive
                            ? 'bg-white dark:bg-[#080E18] border-slate-200 dark:border-slate-800 shadow-xs'
                            : 'bg-slate-50 dark:bg-[#080E18]/50 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Miniatura de Foto de Fondo */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-xl shrink-0 border border-slate-200 dark:border-white/10"
                          />

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {item.badgeText}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase font-black">
                                {item.icon}
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[10px] font-black text-[#FF6B4A] truncate">
                            {item.actionText}
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Toggle Individual */}
                            <button
                              type="button"
                              onClick={() => toggleVerticalCategoryActive(item.id)}
                              className={`p-2 rounded-xl transition-all cursor-pointer ${
                                item.isActive
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800'
                              }`}
                              title={item.isActive ? 'Desactivar esta tarjeta' : 'Activar esta tarjeta'}
                            >
                              {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Editar */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditVertical(item)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131F33] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                              title="Editar Vertical"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Eliminar */}
                            <button
                              type="button"
                              onClick={() => handleDeleteVertical(item.id, item.title)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 text-red-500 transition-all cursor-pointer"
                              title="Eliminar Vertical"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

      {/* ============================================================== */}
      {/* MODAL: EDITAR NEGOCIO */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#11141a] text-white rounded-3xl border border-[#1e222b] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1e222b]">
              <div>
                <span className={`text-[10px] uppercase font-bold font-label-telemetry tracking-wider ${
                  editingId ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {editingId ? 'MODO EDICIÓN MULTI-BRANCH · CUMANÁ COMERCIAL' : 'ALTA DE COMERCIO DIRECTO · DIRECTORIO DIGITAL CUMANÁ'}
                </span>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>{editingId ? `EDITANDO COMERCIO: ${formData.name || 'SIN NOMBRE'}` : 'REGISTRAR NUEVO COMERCIO'}</span>
                  {formData.isVerified && <VerifiedBadge size="sm" />}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingId 
                    ? 'Modifica los datos, rubros múltiples, sucursales y fotos del comercio.'
                    : 'Completa la ficha técnica para publicar el negocio en el directorio digital de Cumaná.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingId(null);
                }}
                className="p-2 rounded-xl bg-[#161920] border border-[#222630] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-6">
              {renderBusinessFormFields()}

              <div className="pt-6 border-t border-[#1e222b] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#161920] border border-[#222630] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer ${
                    editingId 
                      ? 'bg-amber-400 hover:bg-amber-300' 
                      : 'bg-emerald-500 hover:bg-emerald-400'
                  }`}
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingId ? 'Guardar Cambios' : 'Guardar y Publicar Negocio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DRAWER: AUDITAR FICHA */}
      {/* ============================================================== */}
      {isAuditDrawerOpen && selectedBusiness && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white dark:bg-[#131F33] border-l border-slate-200 dark:border-[#1E2D45] h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1E2D45]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-[#A0AEC0] font-bold">
                    Auditoría de Registro Municipal
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-950 dark:text-white mt-0.5 flex items-center gap-2">
                    <span>{selectedBusiness.name}</span>
                    {selectedBusiness.isVerified && <VerifiedBadge size="sm" />}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuditDrawerOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#080E18] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-[#1E2D45]">
                <img
                  src={selectedBusiness.heroImage}
                  alt={selectedBusiness.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-[#FF6B4A] text-xs font-bold uppercase">
                    Plan {selectedBusiness.tier}
                  </span>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                    selectedBusiness.status === 'active'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {selectedBusiness.status}
                  </span>
                </div>
                {selectedBusiness.isVerified && (
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 rounded-xl bg-[#0095F6] text-white text-xs font-black flex items-center gap-1.5 shadow-md">
                      <VerifiedBadge size="sm" />
                      <span>Verificado Oficial</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold text-slate-950 dark:text-[#A0AEC0] tracking-wider">
                  Parámetros de Auditoría Técnica
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#A0AEC0] font-medium">Insignia Oficial Verificada:</span>
                    <button
                      type="button"
                      onClick={() => {
                        toggleBusinessVerification(selectedBusiness.id);
                        setSelectedBusiness({ ...selectedBusiness, isVerified: !selectedBusiness.isVerified });
                        showNotice(`Estado de verificación de "${selectedBusiness.name}" actualizado.`);
                      }}
                      className="cursor-pointer"
                    >
                      {selectedBusiness.isVerified ? (
                        <span className="text-[#0095F6] font-bold flex items-center gap-1.5">
                          <VerifiedBadge size="sm" />
                          <span>✓ Verificado Oficial</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold underline">Sin Verificar (Clic para verificar)</span>
                      )}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#A0AEC0] font-medium">Ubicación y Sector:</span>
                    <span className="text-slate-950 dark:text-white font-bold">{selectedBusiness.zone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#A0AEC0] font-medium">Categorías / Rubros:</span>
                    <span className="text-slate-950 dark:text-white font-bold text-right max-w-[60%]">
                      {(selectedBusiness.categories && selectedBusiness.categories.length > 0 ? selectedBusiness.categories : [selectedBusiness.category]).join(', ')}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#A0AEC0] font-medium">Fibra Óptica:</span>
                    <span className={selectedBusiness.amenities.includes('fibra_optica') ? 'text-[#008966] dark:text-[#00C292] font-bold' : 'text-slate-500 font-bold'}>
                      {selectedBusiness.amenities.includes('fibra_optica') ? '✓ Habilitada' : 'No reporta'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#A0AEC0] font-medium">Video-Ruta Vertical 9:16:</span>
                    <span className={selectedBusiness.videoRoute ? 'text-[#008966] dark:text-[#00C292] font-bold' : 'text-slate-500 dark:text-[#A0AEC0]'}>
                      {selectedBusiness.videoRoute ? `✓ Subida (${selectedBusiness.videoRoute.duration})` : 'Pendiente / No aplica'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                    <span className="text-slate-600 dark:text-[#A0AEC0] font-medium">WhatsApp Directo:</span>
                    <span className="text-[#008966] dark:text-[#00C292] font-mono font-bold">{selectedBusiness.socials.whatsapp}</span>
                  </div>
                </div>

                {selectedBusiness.videoRoute && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-[#FF6B4A]/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#FF6B4A]">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#FF6B4A]" />
                        <span>Video-Ruta: {selectedBusiness.videoRoute.originName}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        selectedBusiness.videoRoute.showInFeed !== false ? 'bg-[#FF6B4A] text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white'
                      }`}>
                        {selectedBusiness.videoRoute.showInFeed !== false ? 'Aceptado en Feed' : 'Oculto'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-[#A0AEC0]">
                      Hitos: {selectedBusiness.videoRoute.milestones.length} puntos señalizados.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-[#1E2D45] space-y-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    changeBusinessStatus(selectedBusiness.id, 'active');
                    setSelectedBusiness({ ...selectedBusiness, status: 'active', isVerified: true });
                    showNotice(`Ficha de "${selectedBusiness.name}" aprobada oficialmente con sello verificado.`);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Aprobar Ficha Oficial</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    changeBusinessStatus(selectedBusiness.id, 'suspended');
                    setSelectedBusiness({ ...selectedBusiness, status: 'suspended' });
                    showNotice(`Ficha de "${selectedBusiness.name}" suspendida.`);
                  }}
                  className="py-3 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Suspender</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuditDrawerOpen(false);
                    handleStartEdit(selectedBusiness);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-800 dark:text-[#DDE2F1] text-xs font-bold transition-all cursor-pointer"
                >
                  Editar Toda la Información
                </button>

                <button
                  type="button"
                  onClick={() => setIsAuditDrawerOpen(false)}
                  className="py-2 px-4 rounded-xl bg-transparent text-xs text-slate-600 hover:text-black dark:text-[#A0AEC0] dark:hover:text-white cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AGREGAR O EDITAR PERSONA & TESTIMONIO */}
      {/* ============================================================== */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1E2D45]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FF6B4A]/10 text-[#FF6B4A]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {editingTestimonialId ? 'Editar Testimonio de Persona' : 'Nueva Persona / Testimonio'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                    Se mostrará en la sección de testimonios en /planes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Nombre de la Persona *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carlos Marval"
                    value={testimonialFormData.name}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Comercio / Negocio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Asador Cumanés"
                    value={testimonialFormData.businessName}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Zona / Sector
                  </label>
                  <select
                    value={testimonialFormData.zone}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, zone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  >
                    {structure.zones.map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Iniciales Avatar
                  </label>
                  <input
                    type="text"
                    placeholder="CM"
                    maxLength={3}
                    value={testimonialFormData.initials}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, initials: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-black text-center text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Calificación en Estrellas
                  </label>
                  <select
                    value={testimonialFormData.stars}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, stars: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  >
                    <option value={5}>★★★★★ (5 Estrellas)</option>
                    <option value={4}>★★★★☆ (4 Estrellas)</option>
                    <option value={3}>★★★☆☆ (3 Estrellas)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Gradiente de Color Avatar
                  </label>
                  <select
                    value={testimonialFormData.avatarColor || 'from-[#008966] to-[#00C292]'}
                    onChange={(e) => setTestimonialFormData(prev => ({ ...prev, avatarColor: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  >
                    <option value="from-[#008966] to-[#00C292]">Verde Esmeralda</option>
                    <option value="from-[#FF6B4A] to-amber-500">Coral & Ámbar</option>
                    <option value="from-blue-600 to-cyan-500">Azul Caribe & Cyan</option>
                    <option value="from-purple-600 to-pink-500">Púrpura & Rosa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Comentario / Cita del Comerciante *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe la experiencia o testimonio del comerciante..."
                  value={testimonialFormData.quote}
                  onChange={(e) => setTestimonialFormData(prev => ({ ...prev, quote: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Visibilidad en la Web
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                    Marcar para que aparezca publicado en /planes
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={testimonialFormData.isActive}
                  onChange={(e) => setTestimonialFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#FF6B4A] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-[#A0AEC0] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Persona</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AGREGAR O EDITAR PREGUNTA FRECUENTE (FAQ) */}
      {/* ============================================================== */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1E2D45]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FF6B4A]/10 text-[#FF6B4A]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {editingFaqId ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                    Se mostrará en la sección de preguntas en /planes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Pregunta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¿Puedo pagar en Bolívares o sólo en Divisas?"
                  value={faqFormData.question}
                  onChange={(e) => setFaqFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Icono / Categoría
                </label>
                <select
                  value={faqFormData.icon}
                  onChange={(e) => setFaqFormData(prev => ({ ...prev, icon: e.target.value as FaqItem['icon'] }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                >
                  <option value="payment">💳 Métodos de Pago & Facturación</option>
                  <option value="video">🎥 Producción de Video-Rutas</option>
                  <option value="refresh">🔄 Flexibilidad & Cambio de Plan</option>
                  <option value="lock">🔒 Seguridad & Sin Permanencia</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Respuesta Detallada *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe la respuesta clara para el comerciante..."
                  value={faqFormData.answer}
                  onChange={(e) => setFaqFormData(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Visibilidad en la Web
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                    Marcar para que aparezca publicada en /planes
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={faqFormData.isActive}
                  onChange={(e) => setFaqFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#FF6B4A] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-[#A0AEC0] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Pregunta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CREAR / EDITAR ANUNCIO PUBLICITARIO EN FEED */}
      {/* ============================================================== */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1E2D45]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {editingAdId ? 'Editar Anuncio Publicitario' : 'Nuevo Anuncio Publicitario'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                    Aparecerá intercalado en las búsquedas del directorio de locales
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Título del Anuncio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Excursiones & Lanchas Rápidas a Mochima 2026"
                  value={adFormData.title}
                  onChange={(e) => setAdFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Descripción o Mensaje Promocional *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explica la oferta, servicio o llamado a la acción para los usuarios..."
                  value={adFormData.subtitle}
                  onChange={(e) => setAdFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Texto del Distintivo / Badge
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Anuncio Patrocinado, Espacio Exclusivo"
                    value={adFormData.badgeText}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Texto del Botón de Acción
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Consultar Salidas, Contactar Anunciante"
                    value={adFormData.buttonText}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Enlace de Destino (WhatsApp o URL Web) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://wa.me/58414XXXXXXX o https://instagram.com/..."
                  value={adFormData.linkUrl}
                  onChange={(e) => setAdFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-mono focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  URL de la Imagen del Banner
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/... o data:image/..."
                    value={adFormData.imageUrl}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-mono focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                {/* Previsualización rápida */}
                {adFormData.imageUrl && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-[#1E2D45] mb-2 bg-slate-900">
                    <img
                      src={adFormData.imageUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-3 flex flex-col justify-end">
                      <span className="text-[10px] font-extrabold uppercase text-amber-300">{adFormData.badgeText || 'Patrocinado'}</span>
                      <span className="text-xs font-bold text-white line-clamp-1">{adFormData.title || 'Título del anuncio'}</span>
                    </div>
                  </div>
                )}

                {/* Fotos sugeridas de Cumaná */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500 dark:text-[#A0AEC0] font-bold">Imágenes sugeridas:</span>
                  <button
                    type="button"
                    onClick={() => setAdFormData(prev => ({ ...prev, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80' }))}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E2D45] text-slate-700 dark:text-[#DDE2F1] hover:text-[#FF6B4A]"
                  >
                    🛥️ Lanchas / Marina
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdFormData(prev => ({ ...prev, imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }))}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E2D45] text-slate-700 dark:text-[#DDE2F1] hover:text-[#FF6B4A]"
                  >
                    🏖️ Playa / Golfo
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdFormData(prev => ({ ...prev, imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' }))}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E2D45] text-slate-700 dark:text-[#DDE2F1] hover:text-[#FF6B4A]"
                  >
                    🍽️ Gastronomía
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdFormData(prev => ({ ...prev, imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' }))}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E2D45] text-slate-700 dark:text-[#DDE2F1] hover:text-[#FF6B4A]"
                  >
                    🛍️ Comercio / Promoción
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Estado del Anuncio
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                    Actívalo para que se muestre entre las búsquedas de los locales
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={adFormData.isActive}
                  onChange={(e) => setAdFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#00C292] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-[#A0AEC0] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAdId ? 'Actualizar Anuncio' : 'Crear Anuncio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AGREGAR O EDITAR DESPACHO EN VIVO (CUMANÁ EN VIVO) */}
      {/* ============================================================== */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1E2D45]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#00C292]/15 text-[#00C292]">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {editingLiveId ? 'Editar Despacho en Vivo' : 'Nuevo Despacho en Vivo'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                    Se mostrará en las historias circulares de "Cumaná en Vivo"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLiveModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLive} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Nombre del Despacho / Zona *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: El Peñón, Playa San Luis..."
                    value={liveFormData.name}
                    onChange={(e) => setLiveFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#00C292]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Horario / Subtítulo Corto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Amanecer 06:15 AM, Pepitonas frescas..."
                    value={liveFormData.subtitle}
                    onChange={(e) => setLiveFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#00C292]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  URL de la Foto Circular *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... o data:image/..."
                  value={liveFormData.imageUrl}
                  onChange={(e) => setLiveFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-mono text-slate-950 dark:text-white focus:outline-none focus:border-[#00C292]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Tipo de Insignia Circular:
                  </label>
                  <select
                    value={liveFormData.badgeType}
                    onChange={(e: any) => setLiveFormData(prev => ({ ...prev, badgeType: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#00C292]"
                  >
                    <option value="play">▶ Play / Video-Ruta (Verde)</option>
                    <option value="food">🍴 Gastronomía / Alimentos (Ámbar)</option>
                    <option value="store">🛍️ Comercio / Tienda (Cian)</option>
                    <option value="music">🎵 Música / Vida Nocturna (Coral)</option>
                    <option value="live">🔴 En Vivo / Alerta (Rojo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Ubicación Específica:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Sector El Peñón, Golfo de Cariaco"
                    value={liveFormData.location || ''}
                    onChange={(e) => setLiveFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#00C292]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  Descripción o Detalle del Despacho:
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve reseña que se mostrará al tocar la historia..."
                  value={liveFormData.description || ''}
                  onChange={(e) => setLiveFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#00C292]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Estado del Despacho
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                    Actívalo para que sea visible en la barra de historias
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={liveFormData.isActive}
                  onChange={(e) => setLiveFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#00C292] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsLiveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-[#A0AEC0] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingLiveId ? 'Actualizar Despacho' : 'Guardar Despacho'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AGREGAR O EDITAR VERTICAL (EXPLORA POR VERTICALES) */}
      {/* ============================================================== */}
      {isVerticalModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1E2D45]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FF6B4A]/15 text-[#FF6B4A]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white">
                    {editingVerticalId ? 'Editar Tarjeta Vertical' : 'Nueva Tarjeta Vertical'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A0AEC0]">
                    Se mostrará en las tarjetas de "Explora por Verticales"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVerticalModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVertical} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Título de la Vertical *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Gastronomía, Playas & Posadas..."
                    value={verticalFormData.title}
                    onChange={(e) => setVerticalFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Subtítulo / Conteo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 84 locales verificados..."
                    value={verticalFormData.subtitle}
                    onChange={(e) => setVerticalFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                  URL de la Foto de Fondo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/... o data:image/..."
                  value={verticalFormData.imageUrl}
                  onChange={(e) => setVerticalFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-mono text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Icono:
                  </label>
                  <select
                    value={verticalFormData.icon}
                    onChange={(e: any) => setVerticalFormData(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  >
                    <option value="utensils">🍴 Cubiertos / Gastronomía</option>
                    <option value="bed">🛏️ Cama / Posadas</option>
                    <option value="cocktail">🍸 Copa / Vida Nocturna</option>
                    <option value="boat">⚓ Barco / Náutica</option>
                    <option value="coffee">☕ Café / Trabajo</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Texto Insignia (Badge):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Activo, Costero, Nocturno..."
                    value={verticalFormData.badgeText}
                    onChange={(e) => setVerticalFormData(prev => ({ ...prev, badgeText: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Color de Insignia:
                  </label>
                  <select
                    value={verticalFormData.badgeColor}
                    onChange={(e: any) => setVerticalFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  >
                    <option value="teal">Verde Azulado (Teal)</option>
                    <option value="amber">Ámbar / Dorado</option>
                    <option value="slate">Pizarra / Gris Oscuro</option>
                    <option value="green">Verde Esmeralda</option>
                    <option value="coral">Coral / Naranja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Texto Enlace de Acción:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: VER ASADORES & CALETAS →"
                    value={verticalFormData.actionText}
                    onChange={(e) => setVerticalFormData(prev => ({ ...prev, actionText: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-[#A0AEC0] block mb-1">
                    Categoría Asociada al Directorio:
                  </label>
                  <select
                    value={verticalFormData.targetCategory || ''}
                    onChange={(e) => setVerticalFormData(prev => ({ ...prev, targetCategory: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs font-bold text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                  >
                    {structure.categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Estado de la Tarjeta
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-[#A0AEC0]">
                    Actívala para que se muestre en la cuadrícula de inicio
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={verticalFormData.isActive}
                  onChange={(e) => setVerticalFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#FF6B4A] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsVerticalModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#080E18] dark:hover:bg-[#1E2D45] text-slate-700 dark:text-[#A0AEC0] text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingVerticalId ? 'Actualizar Vertical' : 'Guardar Vertical'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
