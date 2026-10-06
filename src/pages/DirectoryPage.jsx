import { useState, useMemo, useRef, useEffect } from 'react';
import {
  MapPin,
  MessageCircle,
  Phone,
  Map,
  SlidersHorizontal,
  CheckCircle2,
  Scissors,
  BookOpen,
  Cake,
  Bike,
  Sparkles,
  Search,
  X,
  ArrowLeft,
  Building2,
  PhoneCall,
  Share2,
  PlusCircle,
  Check,
  Menu,
  Home,
  ChevronDown,
  CreditCard,
  Layers,
  RotateCcw,
  Crown,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import CasheaBanner from '../components/CasheaBanner';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { WhatsAppIcon, CasheaIcon } from '../components/SocialIcons';
import { useToast } from '../context/ToastContext';
import adminStore from '../store/adminStore.js';
import { isBusinessOpen } from '../data/mockBusinessData.js';

// Lista de comercios representativos de la vista de Directorio
const DIRECTORY_ITEMS = [
  // 0. Econoquesos Cumaná (Cadena 3 Sedes / Patrocinado VIP)
  {
    id: 'biz-econoquesos',
    name: 'Econoquesos Cumaná',
    fullName: 'Econoquesos Cumaná — Cadena 3 Sedes',
    type: 'featured',
    isMultiBranch: true,
    branchCount: 3,
    branches: [
      { id: 'branch-central', name: 'Sede Central — Blanco Fombona', zone: 'Sector Centro', phone: '+58 424-8881066', whatsapp: '584248881066', address: 'Av. Blanco Fombona, cruce con Calle México' },
      { id: 'branch-cancamure', name: 'Econoquesos Plaza — Av. Cancamure', zone: 'Cantarrana', phone: '+58 424-8881066', whatsapp: '584248881066', address: 'Av. Cancamure, frente al complejo Cancamure' },
      { id: 'branch-santarosa', name: 'Sede Express — Santa Rosa', zone: 'Sector Centro', phone: '+58 424-8881066', whatsapp: '584248881066', address: 'Av. Santa Rosa, esquina Calle Urdaneta' },
    ],
    zone: 'Sector Centro',
    address: 'Sedes en Av. Blanco Fombona, Av. Cancamure y Av. Santa Rosa, Cumaná',
    bannerUrl: '/images/econoqueso-banner.jpg',
    isVerified: true,
    isOpen: true,
    isEmergency: false,
    hasDelivery: true,
    hasDiscount: true,
    discountText: 'Cashea Cotidiana + Combo Charcutero',
    category: 'tiendas',
    categoryLabel: 'Supermercados & Charcuterías',
    tags: ['Acepta Cashea', 'Cadena 3 Sedes', 'Charcutería', 'Quesos', 'Mayor y Detal', 'Víveres'],
    paymentMethods: ['cashea', 'pago_movil', 'punto_de_venta', 'usd_cash', 'binance'],
    whatsapp: '584248881066',
    googleMapsUrl: 'https://maps.google.com/?q=Av+Blanco+Fombona+Cumana+Sucre',
    description: 'Gran cadena de charcutería, quesos al mayor y detal, víveres y supermercado en Cumaná. 3 sedes estratégicas: Central (Blanco Fombona), Plaza (Cancamure) y Express (Santa Rosa). Acepta Cashea.',
  },
  // 1. Farmacia 24h (Patrocinado)
  {
    id: 'dir-001',
    name: 'Farmacia 24h...',
    fullName: 'Farmacia del Mar 24 Horas',
    type: 'featured',
    zone: 'Av. Bermúdez',
    address: 'Av. Bermúdez, cruce con Calle Blanco Fombona, Cumaná',
    bannerUrl: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    isVerified: true,
    isOpen: true,
    isEmergency: true,
    hasDelivery: true,
    hasDiscount: true,
    discountText: '10% OFF',
    category: 'farmacias_24h',
    categoryLabel: 'Farmacias 24h',
    tags: ['Acepta Cashea', 'Medicinas'],
    paymentMethods: ['cashea', 'pago_movil', 'punto_de_venta', 'usd_cash', 'zelle'],
    whatsapp: '584147890123',
    googleMapsUrl: 'https://maps.google.com/?q=Av.+Bermudez+Cumana',
    description: 'Farmacia de turno permanente con medicamentos, fórmulas e insumos médicos con delivery 24h en Cumaná.',
  },

  // 2. Barbería El Centro (Estándar)
  {
    id: 'dir-002',
    name: 'Barbería El Centro',
    fullName: 'Barbería El Centro',
    type: 'standard',
    zone: 'Calle Sucre, Centro',
    address: 'Calle Sucre, Centro Histórico de Cumaná',
    icon: 'scissors',
    isVerified: false,
    isOpen: true,
    isEmergency: false,
    hasDelivery: false,
    hasDiscount: false,
    category: 'emprendedores',
    categoryLabel: 'Cuidado Personal',
    tags: ['Cuidado Personal'],
    paymentMethods: ['pago_movil', 'usd_cash', 'punto_de_venta'],
    phone: '+58 414-8765432',
    whatsapp: '584148765432',
    description: 'Cortes clásicos, degradados y perfilado de barba en ambiente climatizado.',
  },

  // 3. Clínica San Juan (Patrocinado)
  {
    id: 'dir-003',
    name: 'Clínica San Juan',
    fullName: 'Clínica & Centro Médico San Juan',
    type: 'featured',
    zone: 'Av. Arismendi',
    address: 'Av. Arismendi, Sector Miramar, Cumaná',
    bannerUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    isVerified: true,
    isOpen: true,
    isEmergency: true,
    hasDelivery: false,
    hasDiscount: false,
    category: 'salud',
    categoryLabel: 'Clínicas & Salud',
    tags: ['Emergencia 24h', 'Salud'],
    paymentMethods: ['cashea', 'pago_movil', 'punto_de_venta', 'usd_cash', 'zelle'],
    phone: '+58 293-4318899',
    whatsapp: '584123456789',
    googleMapsUrl: 'https://maps.google.com/?q=Av.+Arismendi+Cumana',
    description: 'Centro de especialidades médicas, laboratorio clínico y emergencias 24 horas.',
  },

  // 4. Librería Central (Estándar)
  {
    id: 'dir-004',
    name: 'Librería Central',
    fullName: 'Librería & Papelería Central',
    type: 'standard',
    zone: 'C.C. Cumaná Plaza',
    address: 'C.C. Cumaná Plaza, Nivel 1, Cumaná',
    icon: 'book',
    isVerified: false,
    isOpen: true,
    isEmergency: false,
    hasDelivery: true,
    hasDiscount: false,
    category: 'tiendas',
    categoryLabel: 'Papelería & Librería',
    tags: ['Papeleria'],
    paymentMethods: ['pago_movil', 'punto_de_venta', 'usd_cash'],
    phone: '+58 293-4321100',
    whatsapp: '584142345678',
    description: 'Artículos escolares, papelería de oficina, impresiones y encuadernados.',
  },

  // 5. Repostería Delicias (Patrocinado)
  {
    id: 'dir-005',
    name: 'Repostería Delicias',
    fullName: 'Repostería & Dulces Delicias',
    type: 'featured',
    zone: 'Av. Universidad',
    address: 'Av. Universidad, Sector Bebedero, Cumaná',
    bannerUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80',
    isVerified: true,
    isOpen: true,
    isEmergency: false,
    hasDelivery: true,
    hasDiscount: true,
    discountText: '10% OFF',
    category: 'reposteria',
    categoryLabel: 'Repostería & Dulces',
    tags: ['Acepta Cashea', 'Dulces'],
    paymentMethods: ['cashea', 'pago_movil', 'punto_de_venta', 'usd_cash'],
    whatsapp: '584169876543',
    googleMapsUrl: 'https://maps.google.com/?q=Av.+Universidad+Cumana',
    description: 'Tortas decoradas, dulces tradicionales cumaneses, tres leches y café recién colado.',
  },

  // 6. Repostería Casera Ana (Estándar)
  {
    id: 'dir-006',
    name: 'Repostería Casera Ana',
    fullName: 'Repostería Casera Ana & Postres',
    type: 'standard',
    zone: 'Los Chaimas',
    address: 'Los Chaimas, Calle 4, Cumaná',
    icon: 'cake',
    isVerified: false,
    isOpen: true,
    isEmergency: false,
    hasDelivery: true,
    hasDiscount: false,
    category: 'reposteria',
    categoryLabel: 'Por Encargo',
    tags: ['Por Encargo'],
    paymentMethods: ['pago_movil', 'usd_cash'],
    phone: '+58 293-4332211',
    whatsapp: '584141122334',
    description: 'Tortas caseras por encargo, ponquecitos, galletas y postres artesanales.',
  },

  // 7. Taller Automotriz... (Patrocinado)
  {
    id: 'dir-007',
    name: 'Taller Automotriz...',
    fullName: 'Taller Automotriz & AutoServicio Sucre',
    type: 'featured',
    zone: 'Zona Industrial',
    address: 'Zona Industrial San Luis, Galpón 4, Cumaná',
    bannerUrl: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=800&q=80',
    isVerified: true,
    isOpen: true,
    isEmergency: false,
    hasDelivery: false,
    hasDiscount: false,
    category: 'talleres',
    categoryLabel: 'Talleres & Mecánica',
    tags: ['Acepta Cashea', 'Mecánica'],
    paymentMethods: ['cashea', 'pago_movil', 'punto_de_venta', 'usd_cash', 'zelle'],
    whatsapp: '584249871122',
    googleMapsUrl: 'https://maps.google.com/?q=Zona+Industrial+San+Luis+Cumana',
    description: 'Escaneo computarizado, mecánica ligera, frenos y cambio de fluidos con Cashea.',
  },

  // 8. Repuestos Moto Express (Estándar)
  {
    id: 'dir-008',
    name: 'Repuestos Moto Express',
    fullName: 'Repuestos & Accesorios Moto Express',
    type: 'standard',
    zone: 'Av. Cancamure',
    address: 'Av. Cancamure, frente a la redoma, Cumaná',
    icon: 'bike',
    isVerified: false,
    isOpen: true,
    isEmergency: false,
    hasDelivery: true,
    hasDiscount: false,
    category: 'tiendas',
    categoryLabel: 'Autopartes',
    tags: ['Autopartes'],
    paymentMethods: ['pago_movil', 'punto_de_venta', 'usd_cash'],
    phone: '+58 412-7788990',
    whatsapp: '584127788990',
    description: 'Repuestos originales y genéricos para motos, cauchos, cadenas y aceites.',
  },
];

// Opciones de configuración de filtros modulares
const CATEGORY_OPTIONS = [
  { id: 'all', label: 'Todas las categorías', icon: '🗂️' },
  { id: 'farmacias_24h', label: 'Farmacias 24h', icon: '💊' },
  { id: 'salud', label: 'Clínicas & Salud', icon: '🏥' },
  { id: 'reposteria', label: 'Repostería & Dulces', icon: '🍰' },
  { id: 'emprendedores', label: 'Barberías & Cuidado', icon: '✂️' },
  { id: 'talleres', label: 'Talleres & Mecánica', icon: '🔧' },
  { id: 'tiendas', label: 'Tiendas & Papelería', icon: '🛍️' },
];

const ZONE_OPTIONS = [
  { id: 'all', label: 'Todas las zonas', icon: '📍' },
  { id: 'Bermúdez', label: 'Av. Bermúdez' },
  { id: 'Arismendi', label: 'Av. Arismendi' },
  { id: 'Universidad', label: 'Av. Universidad' },
  { id: 'Sucre', label: 'Calle Sucre / Centro' },
  { id: 'Chaimas', label: 'Los Chaimas' },
  { id: 'Industrial', label: 'Zona Industrial' },
  { id: 'Cancamure', label: 'Av. Cancamure' },
  { id: 'Plaza', label: 'C.C. Cumaná Plaza' },
];

const SERVICE_OPTIONS = [
  { id: 'all', label: 'Todos los servicios', icon: '🧰' },
  { id: 'open_now', label: 'Abierto Ahora', icon: '🟢' },
  { id: 'emergency_24h', label: 'Emergencia 24h', icon: '🚨' },
  { id: 'featured', label: 'Patrocinado / VIP', icon: '⭐' },
  { id: 'discount', label: 'Con Descuento / Promo', icon: '🏷️' },
  { id: 'delivery', label: 'Delivery Disponible', icon: '🛵' },
];

const PAYMENT_OPTIONS = [
  { id: 'all', label: 'Todos los pagos', icon: '💳' },
  { id: 'cashea', label: 'Acepta Cashea', icon: '🟰', isCashea: true },
  { id: 'pago_movil', label: 'Pago Móvil', icon: '📱' },
  { id: 'punto_de_venta', label: 'Punto de Venta', icon: '💳' },
  { id: 'usd_cash', label: 'Dólares Efectivo ($)', icon: '💵' },
  { id: 'zelle', label: 'Zelle / Divisas', icon: '⚡' },
];

/**
 * DirectoryPage — Página Web Independiente del Directorio de Comercios.
 * Con sistema de filtrado exacto, modular y altamente accesible (Categoría, Zona, Servicios, Pagos, Todos).
 */
export default function DirectoryPage({
  onNavigateHome,
  onOpenPricing,
  onOpenEmergency,
  onSelectBusiness,
}) {
  const { isDark } = useTheme();
  const { toast } = useToast();

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [openDropdown, setOpenDropdown] = useState(null); // 'categoria' | 'zona' | 'servicios' | 'pagos' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const dropdownContainerRef = useRef(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Carga reactiva de comercios desde el adminStore
  const allBusinesses = useMemo(() => {
    try {
      const stored = adminStore.getBusinesses();
      if (Array.isArray(stored) && stored.length > 0) {
        return stored
          .filter((b) => !b.status || b.status === 'active' || b.status === 'aprobado')
          .map((biz, idx) => ({
            id: biz.id || `dir-${idx}`,
            name: biz.name,
            fullName: biz.name,
            type: (biz.plan === 'vip' || biz.isFeatured) ? 'featured' : 'standard',
            zone: biz.zone || 'Cumaná',
            address: biz.address || biz.zone || 'Cumaná, Sucre',
            bannerUrl: biz.bannerUrl || biz.photos?.[0] || '/images/og-cumanaconecta.png',
            isVerified: biz.isVerified || false,
            isOpen: isBusinessOpen(biz),
            isEmergency: biz.isOpen24h || biz.category === 'farmacias_24h' || biz.category === 'salud',
            hasDelivery: biz.tags?.some((t) => t.toLowerCase().includes('delivery')) || false,
            hasDiscount: Boolean(biz.activePromotion),
            discountText: biz.activePromotion || '',
            category: biz.category || 'tiendas',
            categoryLabel: biz.categoryLabel || 'Comercio Local',
            tags: biz.tags || [],
            paymentMethods: biz.paymentMethods || ['pago_movil', 'punto_de_venta'],
            phone: biz.phone || '+58 293-0000000',
            whatsapp: biz.whatsapp || '584120000000',
            googleMapsUrl: biz.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(biz.name)}+Cumana`,
            description: biz.description || '',
            icon: biz.category === 'emprendedores' ? 'scissors' : biz.category === 'salud' ? 'plus' : 'store',
            isMultiBranch: Boolean(biz.isMultiBranch),
            branchCount: biz.branchCount || (biz.branches ? biz.branches.length : 1),
            branches: biz.branches || [],
            slug: biz.slug,
            promotionalFlyers: biz.promotionalFlyers || [],
            products: biz.products || [],
            _rawBusiness: biz,
          }));
      }
    } catch {}
    return DIRECTORY_ITEMS;
  }, []);

  // Filtro reactivo multivariable
  const filteredItems = useMemo(() => {
    return allBusinesses.filter((item) => {
      // 1. Búsqueda por texto libre
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesName =
          item.name.toLowerCase().includes(term) ||
          item.fullName.toLowerCase().includes(term);
        const matchesZone = item.zone.toLowerCase().includes(term);
        const matchesDesc = item.description?.toLowerCase().includes(term);
        const matchesTag = item.tags?.some((t) =>
          t.toLowerCase().includes(term)
        );
        const matchesCat = item.categoryLabel
          ?.toLowerCase()
          .includes(term);
        if (!matchesName && !matchesZone && !matchesDesc && !matchesTag && !matchesCat) {
          return false;
        }
      }

      // 2. Filtro de Categoría
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Filtro de Zona
      if (selectedZone !== 'all') {
        const itemZone = item.zone.toLowerCase();
        const targetZone = selectedZone.toLowerCase();
        if (!itemZone.includes(targetZone)) {
          return false;
        }
      }

      // 4. Filtro de Servicios / Estado
      if (selectedService !== 'all') {
        if (selectedService === 'open_now' && !item.isOpen) return false;
        if (selectedService === 'emergency_24h' && !item.isEmergency) return false;
        if (selectedService === 'featured' && item.type !== 'featured') return false;
        if (selectedService === 'discount' && !item.hasDiscount) return false;
        if (selectedService === 'delivery' && !item.hasDelivery) return false;
      }

      // 5. Filtro de Métodos de Pago
      if (selectedPayment !== 'all') {
        if (selectedPayment === 'cashea') {
          const acceptsCashea =
            item.tags?.includes('Acepta Cashea') ||
            item.paymentMethods?.includes('cashea');
          if (!acceptsCashea) return false;
        } else {
          if (!item.paymentMethods?.includes(selectedPayment)) return false;
        }
      }

      return true;
    });
  }, [allBusinesses, searchTerm, selectedCategory, selectedZone, selectedService, selectedPayment]);

  const isAllActive =
    selectedCategory === 'all' &&
    selectedZone === 'all' &&
    selectedService === 'all' &&
    selectedPayment === 'all' &&
    searchTerm.trim() === '';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedZone('all');
    setSelectedService('all');
    setSelectedPayment('all');
    setOpenDropdown(null);
  };

  const renderIcon = (iconName) => {
    const iconClass = isDark
      ? 'text-amber-400/80 stroke-[1.5]'
      : 'text-slate-400 stroke-[1.5]';
    switch (iconName) {
      case 'scissors':
        return <Scissors size={48} className={iconClass} />;
      case 'book':
        return <BookOpen size={48} className={iconClass} />;
      case 'cake':
        return <Cake size={48} className={iconClass} />;
      case 'bike':
        return <Bike size={48} className={iconClass} />;
      default:
        return <Sparkles size={48} className={iconClass} />;
    }
  };

  const handleCardClick = (item) => {
    if (onSelectBusiness) {
      if (item._rawBusiness) {
        onSelectBusiness(item._rawBusiness);
        return;
      }
      onSelectBusiness({
        id: item.id,
        name: item.fullName || item.name,
        categoryLabel: item.categoryLabel || item.tags?.[0] || 'Comercio Local',
        category: item.category,
        isFeatured: item.type === 'featured',
        isVerified: !!item.isVerified,
        isOpen24h: item.isEmergency || false,
        zone: item.zone,
        address: item.address,
        googleMapsUrl:
          item.googleMapsUrl ||
          `https://maps.google.com/?q=${encodeURIComponent(item.address)}`,
        whatsapp: item.whatsapp,
        phone: item.phone,
        paymentMethods: item.paymentMethods || (item.tags?.includes('Acepta Cashea')
          ? ['cashea', 'pago_movil', 'usd_cash', 'punto_de_venta']
          : ['pago_movil', 'usd_cash']),
        activePromotion: item.discountText || null,
        bannerUrl:
          item.bannerUrl ||
          '/images/og-cumanaconecta.png',
        photos: item.bannerUrl ? [item.bannerUrl] : ['/images/og-cumanaconecta.png'],
        description: item.description,
        rating: 4.8,
        reviewCount: 94,
        schedule: { 'Lunes a Sábado': '8:00 AM - 6:00 PM' },
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Directorio de Comercios — CumanáConecta',
      text: 'Explora todos los comercios y servicios disponibles en Cumaná.',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // cancelado
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        toast.copy('Enlace del directorio comercial copiado al portapapeles.');
      } catch {}
    }
  };

  // Helpers para etiquetas visibles en los botones
  const activeCategoryObj = CATEGORY_OPTIONS.find((c) => c.id === selectedCategory);
  const activeZoneObj = ZONE_OPTIONS.find((z) => z.id === selectedZone);
  const activeServiceObj = SERVICE_OPTIONS.find((s) => s.id === selectedService);
  const activePaymentObj = PAYMENT_OPTIONS.find((p) => p.id === selectedPayment);

  return (
    <div
      className={`min-h-screen flex flex-col antialiased font-['Inter'] transition-colors duration-300 ${
        isDark ? 'bg-[#121316] text-slate-100' : 'bg-[#f4f7f6] text-slate-800'
      }`}
    >
      {/* ─── Topbar Informativa ─── */}
      <div
        className={`w-full text-xs py-1.5 px-4 md:px-12 border-b ${
          isDark
            ? 'bg-[#0f1013] text-slate-300 border-[#252830]'
            : 'bg-[#004655] text-white border-[#003844]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                isDark
                  ? 'bg-[#1e2026] text-amber-400 border-[#2f323a]'
                  : 'bg-[#005f73] text-white border-[#0a9396]/30'
              }`}
            >
              <MapPin
                size={12}
                className={isDark ? 'text-amber-400' : 'text-[#8bd1e8]'}
              />
              <span>Cumaná, Edo. Sucre 🇻🇪</span>
            </span>
            <span className="hidden sm:inline text-slate-300 text-[11px]">
              • Directorio Oficial de Negocios
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-300 ml-auto flex-shrink-0">
            {/* Botón coqueto y elegante de Emergencias Cumaná */}
            <button
              type="button"
              onClick={onOpenEmergency}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer shadow-2xs active:scale-95 border ${
                isDark
                  ? 'bg-rose-950/70 text-rose-300 border-rose-800/60 hover:bg-rose-900/80 hover:text-white'
                  : 'bg-rose-500/20 text-rose-100 border-rose-400/40 hover:bg-rose-500/30 hover:text-white'
              }`}
              aria-label="Abrir números telefónicos de emergencia de Cumaná"
              title="Ver números de emergencia de Cumaná (171)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping flex-shrink-0" />
              <PhoneCall size={11} className="text-rose-300 flex-shrink-0" />
              <span className="truncate">Emergencias Cumaná</span>
            </button>

            <span
              className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full font-semibold border ${
                isDark
                  ? 'bg-[#1e2026] text-amber-400 border-[#2f323a]'
                  : 'bg-[#005f73] text-white border-[#0a9396]/30'
              }`}
            >
              {DIRECTORY_ITEMS.length} comercios en catálogo
            </span>
          </div>
        </div>
      </div>

      {/* ─── Barra de Navegación Principal ─── */}
      <header
        className={`border-b sticky top-0 z-40 transition-colors ${
          isDark ? 'bg-[#16171b] border-[#252830]' : 'bg-white border-slate-200'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Marca */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group text-left min-w-0"
              aria-label="Volver a la página principal de CumanáConecta"
            >
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-sm text-white flex-shrink-0 group-hover:scale-105 transition-transform ${
                  isDark
                    ? "bg-[#eab308] text-slate-950 font-black text-xl font-['Outfit']"
                    : 'bg-[#005f73] text-white'
                }`}
              >
                {isDark ? (
                  'C'
                ) : (
                  <Building2
                    size={20}
                    className="text-white sm:w-[22px] sm:h-[22px]"
                  />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={`font-['Outfit'] font-bold text-lg sm:text-2xl tracking-tight leading-none truncate ${
                      isDark ? 'text-white' : 'text-[#004655]'
                    }`}
                  >
                    Cumaná
                    <span
                      className={isDark ? 'text-[#facc15]' : 'text-[#D97706]'}
                    >
                      Conecta
                    </span>
                  </span>
                  <span
                    className={`hidden xs:inline-flex items-center px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded border ${
                      isDark
                        ? 'bg-[#221f15] text-amber-400 border-[#45371c]'
                        : 'bg-sky-50 text-[#005f73] border-sky-200'
                    }`}
                  >
                    DIRECTORIO
                  </span>
                </div>
                <span className="font-['Inter'] text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5 truncate hidden sm:block">
                  Directorio Comercial y de Servicios
                </span>
              </div>
            </button>
          </div>

          {/* Botones de Navegación de Escritorio & Tablet (Minimizados) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {/* 1. Botón Volver al Inicio (Home) */}
            <div className="relative group">
              <button
                type="button"
                onClick={onNavigateHome}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 border shadow-2xs ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-slate-200 hover:bg-[#252830]'
                    : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#005f73]'
                }`}
                aria-label="Volver al inicio"
              >
                <Home
                  size={18}
                  className={isDark ? 'text-amber-400' : 'text-[#005f73]'}
                />
              </button>
              <span
                className={`pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                  isDark
                    ? 'bg-[#282a32] text-slate-200 border border-[#3f4350]'
                    : 'bg-slate-900 text-white'
                }`}
              >
                Inicio
              </span>
            </div>

            {/* 2. Botón Emergencias */}
            <div className="relative group">
              <button
                type="button"
                onClick={onOpenEmergency}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 border shadow-2xs relative ${
                  isDark
                    ? 'bg-[#2a1417] text-[#fb7185] border-[#4c1d24] hover:bg-[#381a1e]'
                    : 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6] hover:bg-[#ffe4e6]'
                }`}
                aria-label="Abrir números de emergencias 171"
              >
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e11d48] animate-ping" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e11d48]" />
                <PhoneCall size={17} />
              </button>
              <span
                className={`pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                  isDark
                    ? 'bg-[#282a32] text-rose-300 border border-[#3f4350]'
                    : 'bg-slate-900 text-white'
                }`}
              >
                Emergencias (171)
              </span>
            </div>

            {/* 3. Toggle Tema */}
            <ThemeToggle />

            {/* 4. Botón Compartir */}
            <div className="relative group">
              <button
                type="button"
                onClick={handleShare}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 border shadow-2xs ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-slate-300 hover:bg-[#252830]'
                    : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                aria-label="Compartir directorio"
              >
                {copied ? (
                  <Check size={17} className="text-emerald-500 stroke-[2.5]" />
                ) : (
                  <Share2 size={17} />
                )}
              </button>
              <span
                className={`pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                  isDark
                    ? 'bg-[#282a32] text-slate-200 border border-[#3f4350]'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {copied ? '¡Copiado!' : 'Compartir'}
              </span>
            </div>

            {/* 5. Botón Sumar mi Negocio */}
            <div className="relative group">
              <button
                type="button"
                onClick={onOpenPricing}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-md ${
                  isDark
                    ? 'bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 shadow-[0_0_14px_rgba(234,179,8,0.3)]'
                    : 'bg-[#005f73] hover:bg-[#004655] text-white shadow-sm'
                }`}
                aria-label="Sumar mi negocio"
              >
                <PlusCircle size={19} />
              </button>
              <span
                className={`pointer-events-none absolute top-full right-0 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                  isDark
                    ? 'bg-[#282a32] text-amber-300 border border-[#3f4350]'
                    : 'bg-slate-900 text-white'
                }`}
              >
                Sumar mi Negocio
              </span>
            </div>
          </div>

          {/* Acciones Móviles (< 768px) */}
          <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
            <ThemeToggle />
            <button
              type="button"
              onClick={onNavigateHome}
              className={`h-9 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 border cursor-pointer active:scale-95 transition ${
                isDark
                  ? 'bg-[#18191d] border-[#2b2d35] text-slate-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Home size={14} />
              <span className="text-[11px]">Inicio</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`h-9 w-9 rounded-lg flex items-center justify-center border cursor-pointer active:scale-95 transition ${
                isDark
                  ? 'bg-[#18191d] border-[#2b2d35] text-slate-200'
                  : 'border-slate-200 text-slate-700 bg-slate-50'
              }`}
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden px-3 sm:px-4 py-4 space-y-2.5 border-t animate-fade-in-up ${
              isDark
                ? 'bg-[#141518] border-[#252830]'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateHome();
              }}
              className={`w-full h-11 px-4 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                isDark
                  ? 'bg-[#18191d] border-[#2b2d35] text-slate-100'
                  : 'bg-white text-slate-800 border-slate-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Home
                  size={16}
                  className={isDark ? 'text-amber-400' : 'text-slate-600'}
                />
                <span>Volver a la Página Principal</span>
              </span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEmergency();
              }}
              className={`w-full h-11 px-4 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer ${
                isDark
                  ? 'bg-[#2a1417] text-[#fb7185] border-[#4c1d24]'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <PhoneCall size={16} className="text-rose-500" />
                <span>Directorio de Emergencias 171</span>
              </span>
              <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
                24h
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPricing();
              }}
              className={`w-full h-11 px-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-[#eab308] text-slate-950 font-black'
                  : 'bg-[#005f73] text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <PlusCircle size={16} />
                <span>Sumar mi Negocio / Planes VIP</span>
              </span>
              <span>+</span>
            </button>
          </div>
        )}
      </header>

      {/* ─── Breadcrumb de Ubicación ─── */}
      <div
        className={`border-b py-2 px-4 md:px-12 ${
          isDark
            ? 'bg-[#141518]/90 border-[#252830]'
            : 'bg-white/70 border-slate-200'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className={`font-medium transition cursor-pointer ${
                isDark ? 'hover:text-amber-400' : 'hover:text-[#005f73]'
              }`}
            >
              Inicio
            </button>
            <span>/</span>
            <span
              className={`font-bold ${
                isDark ? 'text-amber-400' : 'text-[#005f73]'
              }`}
            >
              Directorio de Comercios
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            className={`inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer ${
              isDark ? 'text-amber-400' : 'text-[#005f73]'
            }`}
          >
            <ArrowLeft size={14} />
            <span>Regresar al Inicio</span>
          </button>
        </div>
      </div>

      {/* ─── Contenido Principal de la Página de Directorio ─── */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-12 flex-1 w-full py-6 sm:py-8">
        {/* ─── Encabezado y Sistema de Filtros Exacto (según diseño de referencia) ─── */}
        <section className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Lado Izquierdo: Título y Descripción */}
            <div>
              <p
                className={`font-['Inter'] text-sm sm:text-base font-normal ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Encuentra los mejores negocios y servicios en Cumaná.
              </p>
            </div>

            {/* Lado Derecho: Píldoras Dropdown de Filtro Modular */}
            <div
              ref={dropdownContainerRef}
              className="flex items-center gap-1.5 sm:gap-2 flex-wrap relative"
            >
              {/* 1. Categoría Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === 'categoria' ? null : 'categoria'
                    )
                  }
                  className={`h-9 sm:h-10 px-3 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shadow-2xs ${
                    selectedCategory !== 'all'
                      ? isDark
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-400 font-bold'
                        : 'bg-[#005f73]/10 border-[#005f73]/50 text-[#005f73] font-bold'
                      : isDark
                      ? 'bg-[#18191d] border-[#2b2d35] text-slate-300 hover:border-slate-500 hover:bg-[#202228]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  aria-expanded={openDropdown === 'categoria'}
                  aria-label="Filtrar por Categoría"
                >
                  <Layers
                    size={14}
                    className={
                      selectedCategory !== 'all'
                        ? isDark
                          ? 'text-amber-400'
                          : 'text-[#005f73]'
                        : 'text-slate-400'
                    }
                  />
                  <span>
                    {selectedCategory === 'all'
                      ? 'Categoría'
                      : activeCategoryObj?.label || 'Categoría'}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      openDropdown === 'categoria' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'categoria' && (
                  <div
                    className={`absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-56 rounded-2xl p-1.5 border shadow-2xl z-50 backdrop-blur-md animate-fade-in ${
                      isDark
                        ? 'bg-[#181a20]/95 border-[#2c2f3a] text-slate-200'
                        : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/30">
                      Selecciona una Categoría
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto space-y-0.5">
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        const count =
                          cat.id === 'all'
                            ? DIRECTORY_ITEMS.length
                            : DIRECTORY_ITEMS.filter(
                                (item) => item.category === cat.id
                              ).length;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                                  : 'bg-sky-50 text-[#005f73] font-bold'
                                : isDark
                                ? 'hover:bg-slate-800/70 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </span>
                            <span className="text-[10px] opacity-60">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Zona Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === 'zona' ? null : 'zona')
                  }
                  className={`h-9 sm:h-10 px-3 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shadow-2xs ${
                    selectedZone !== 'all'
                      ? isDark
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-400 font-bold'
                        : 'bg-[#005f73]/10 border-[#005f73]/50 text-[#005f73] font-bold'
                      : isDark
                      ? 'bg-[#18191d] border-[#2b2d35] text-slate-300 hover:border-slate-500 hover:bg-[#202228]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  aria-expanded={openDropdown === 'zona'}
                  aria-label="Filtrar por Zona"
                >
                  <MapPin
                    size={14}
                    className={
                      selectedZone !== 'all'
                        ? isDark
                          ? 'text-amber-400'
                          : 'text-[#005f73]'
                        : 'text-slate-400'
                    }
                  />
                  <span>
                    {selectedZone === 'all'
                      ? 'Zona'
                      : activeZoneObj?.label || 'Zona'}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      openDropdown === 'zona' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'zona' && (
                  <div
                    className={`absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-56 rounded-2xl p-1.5 border shadow-2xl z-50 backdrop-blur-md animate-fade-in ${
                      isDark
                        ? 'bg-[#181a20]/95 border-[#2c2f3a] text-slate-200'
                        : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/30">
                      Sectores & Avenidas
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto space-y-0.5">
                      {ZONE_OPTIONS.map((z) => {
                        const isSelected = selectedZone === z.id;
                        const count =
                          z.id === 'all'
                            ? DIRECTORY_ITEMS.length
                            : DIRECTORY_ITEMS.filter((item) =>
                                item.zone
                                  .toLowerCase()
                                  .includes(z.id.toLowerCase())
                              ).length;
                        return (
                          <button
                            key={z.id}
                            type="button"
                            onClick={() => {
                              setSelectedZone(z.id);
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                                  : 'bg-sky-50 text-[#005f73] font-bold'
                                : isDark
                                ? 'hover:bg-slate-800/70 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{z.label}</span>
                            </span>
                            <span className="text-[10px] opacity-60">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Servicios Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === 'servicios' ? null : 'servicios'
                    )
                  }
                  className={`h-9 sm:h-10 px-3 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shadow-2xs ${
                    selectedService !== 'all'
                      ? isDark
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-400 font-bold'
                        : 'bg-[#005f73]/10 border-[#005f73]/50 text-[#005f73] font-bold'
                      : isDark
                      ? 'bg-[#18191d] border-[#2b2d35] text-slate-300 hover:border-slate-500 hover:bg-[#202228]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  aria-expanded={openDropdown === 'servicios'}
                  aria-label="Filtrar por Servicios"
                >
                  <SlidersHorizontal
                    size={14}
                    className={
                      selectedService !== 'all'
                        ? isDark
                          ? 'text-amber-400'
                          : 'text-[#005f73]'
                        : 'text-slate-400'
                    }
                  />
                  <span>
                    {selectedService === 'all'
                      ? 'Servicios'
                      : activeServiceObj?.label || 'Servicios'}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      openDropdown === 'servicios' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'servicios' && (
                  <div
                    className={`absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-56 rounded-2xl p-1.5 border shadow-2xl z-50 backdrop-blur-md animate-fade-in ${
                      isDark
                        ? 'bg-[#181a20]/95 border-[#2c2f3a] text-slate-200'
                        : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/30">
                      Disponibilidad y Extras
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto space-y-0.5">
                      {SERVICE_OPTIONS.map((srv) => {
                        const isSelected = selectedService === srv.id;
                        const count =
                          srv.id === 'all'
                            ? DIRECTORY_ITEMS.length
                            : DIRECTORY_ITEMS.filter((item) => {
                                if (srv.id === 'open_now') return item.isOpen;
                                if (srv.id === 'emergency_24h')
                                  return item.isEmergency;
                                if (srv.id === 'featured')
                                  return item.type === 'featured';
                                if (srv.id === 'discount')
                                  return item.hasDiscount;
                                if (srv.id === 'delivery')
                                  return item.hasDelivery;
                                return true;
                              }).length;
                        return (
                          <button
                            key={srv.id}
                            type="button"
                            onClick={() => {
                              setSelectedService(srv.id);
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? isDark
                                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                                  : 'bg-sky-50 text-[#005f73] font-bold'
                                : isDark
                                ? 'hover:bg-slate-800/70 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{srv.icon}</span>
                              <span>{srv.label}</span>
                            </span>
                            <span className="text-[10px] opacity-60">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Pagos Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === 'pagos' ? null : 'pagos')
                  }
                  className={`h-9 sm:h-10 px-3 rounded-xl border text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shadow-2xs ${
                    selectedPayment === 'cashea'
                      ? 'bg-[#FFE600] text-slate-950 border-amber-300 font-black shadow-xs'
                      : selectedPayment !== 'all'
                      ? isDark
                        ? 'bg-amber-500/15 border-amber-500/60 text-amber-400 font-bold'
                        : 'bg-[#005f73]/10 border-[#005f73]/50 text-[#005f73] font-bold'
                      : isDark
                      ? 'bg-[#18191d] border-[#2b2d35] text-slate-300 hover:border-slate-500 hover:bg-[#202228]'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  aria-expanded={openDropdown === 'pagos'}
                  aria-label="Filtrar por Métodos de Pago"
                >
                  {selectedPayment === 'cashea' ? (
                    <CasheaIcon className="w-4 h-4 object-contain inline-block" />
                  ) : (
                    <CreditCard
                      size={14}
                      className={
                        selectedPayment !== 'all'
                          ? isDark
                            ? 'text-amber-400'
                            : 'text-[#005f73]'
                          : 'text-slate-400'
                      }
                    />
                  )}
                  <span>
                    {selectedPayment === 'all'
                      ? 'Pagos'
                      : activePaymentObj?.label || 'Pagos'}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      openDropdown === 'pagos' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'pagos' && (
                  <div
                    className={`absolute left-0 lg:left-auto lg:right-0 top-full mt-2 w-56 rounded-2xl p-1.5 border shadow-2xl z-50 backdrop-blur-md animate-fade-in ${
                      isDark
                        ? 'bg-[#181a20]/95 border-[#2c2f3a] text-slate-200'
                        : 'bg-white/95 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/30">
                      Métodos Aceptados
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto space-y-0.5">
                      {PAYMENT_OPTIONS.map((pay) => {
                        const isSelected = selectedPayment === pay.id;
                        const count =
                          pay.id === 'all'
                            ? DIRECTORY_ITEMS.length
                            : DIRECTORY_ITEMS.filter((item) => {
                                if (pay.id === 'cashea') {
                                  return (
                                    item.tags?.includes('Acepta Cashea') ||
                                    item.paymentMethods?.includes('cashea')
                                  );
                                }
                                return item.paymentMethods?.includes(pay.id);
                              }).length;
                        return (
                          <button
                            key={pay.id}
                            type="button"
                            onClick={() => {
                              setSelectedPayment(pay.id);
                              setOpenDropdown(null);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              pay.isCashea
                                ? isSelected
                                  ? 'bg-[#FFE600] text-slate-950 font-black shadow-xs'
                                  : isDark
                                  ? 'bg-[#FFE600]/10 text-amber-300 font-bold hover:bg-[#FFE600]/20'
                                  : 'bg-amber-50 text-amber-950 font-bold hover:bg-amber-100'
                                : isSelected
                                ? isDark
                                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                                  : 'bg-sky-50 text-[#005f73] font-bold'
                                : isDark
                                ? 'hover:bg-slate-800/70 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{pay.icon}</span>
                              <span>{pay.label}</span>
                            </span>
                            <span className="text-[10px] opacity-60">
                              ({count})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Separador vertical */}
              <div
                className={`h-6 w-[1px] mx-0.5 sm:mx-1 hidden sm:block ${
                  isDark ? 'bg-slate-800' : 'bg-slate-200'
                }`}
              />

              {/* 5. Botón 'Todos' (Restablece todos los filtros) */}
              <button
                type="button"
                onClick={handleResetFilters}
                className={`h-9 sm:h-10 px-3.5 rounded-xl border text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95 shadow-2xs ${
                  isAllActive
                    ? isDark
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs'
                      : 'bg-[#005f73] text-white border-[#005f73] font-bold shadow-xs'
                    : isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-slate-300 hover:border-slate-500 hover:bg-[#202228]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
                aria-label="Mostrar todos los comercios sin filtros"
                title="Mostrar todos los comercios sin filtros"
              >
                <SlidersHorizontal
                  size={14}
                  className={
                    isAllActive
                      ? isDark
                        ? 'text-slate-950'
                        : 'text-white'
                      : isDark
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }
                />
                <span>Todos</span>
              </button>
            </div>
          </div>

          {/* Barra de Búsqueda Rápida + Chips de Filtros Activos */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Input de Búsqueda Integrado */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar comercio por nombre o palabra clave..."
                className={`w-full h-10 pl-9.5 pr-8 rounded-xl font-['Inter'] text-xs sm:text-sm outline-none transition border ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-white placeholder-slate-500 focus:border-amber-400'
                    : 'bg-white border-slate-200 focus:border-[#005f73] text-slate-800 placeholder-slate-400 shadow-2xs'
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Contador de resultados */}
            <div className="text-xs text-slate-400 flex items-center gap-1.5 self-center sm:self-auto">
              <span>
                Mostrando{' '}
                <strong
                  className={isDark ? 'text-amber-400' : 'text-[#005f73]'}
                >
                  {filteredItems.length}
                </strong>{' '}
                de {DIRECTORY_ITEMS.length} comercios
              </span>
            </div>
          </div>

          {/* Chips de Filtros Activos (Fácil de entender y remover) */}
          {!isAllActive && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 animate-fade-in">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">
                Filtros activos:
              </span>

              {selectedCategory !== 'all' && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    isDark
                      ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                      : 'bg-sky-50 text-[#005f73] border-sky-200'
                  }`}
                >
                  <span>{activeCategoryObj?.icon}</span>
                  <span>{activeCategoryObj?.label}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Quitar filtro de categoría"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedZone !== 'all' && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    isDark
                      ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                      : 'bg-sky-50 text-[#005f73] border-sky-200'
                  }`}
                >
                  <span>📍</span>
                  <span>{activeZoneObj?.label}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedZone('all')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Quitar filtro de zona"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedService !== 'all' && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    isDark
                      ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                      : 'bg-sky-50 text-[#005f73] border-sky-200'
                  }`}
                >
                  <span>{activeServiceObj?.icon}</span>
                  <span>{activeServiceObj?.label}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedService('all')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Quitar filtro de servicio"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedPayment !== 'all' && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    selectedPayment === 'cashea'
                      ? 'bg-[#FFE600] text-slate-950 border-amber-300 font-bold shadow-2xs'
                      : isDark
                      ? 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                      : 'bg-sky-50 text-[#005f73] border-sky-200'
                  }`}
                >
                  <span>{activePaymentObj?.icon}</span>
                  <span>{activePaymentObj?.label}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedPayment('all')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Quitar filtro de pago"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    isDark
                      ? 'bg-slate-800 text-slate-200 border-slate-700'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>"{searchTerm}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:opacity-75 cursor-pointer ml-0.5"
                    aria-label="Quitar búsqueda"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold ml-1 cursor-pointer flex items-center gap-1 underline"
              >
                <RotateCcw size={11} />
                <span>Limpiar todo</span>
              </button>
            </div>
          )}
        </section>

        {/* ─── Cuadrícula de Tarjetas (Fiel a la referencia de diseño) ─── */}
        {filteredItems.length === 0 ? (
          <div
            className={`rounded-2xl border p-8 sm:p-12 text-center my-6 shadow-sm ${
              isDark
                ? 'bg-[#18191d] border-[#282a32]'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
              <SlidersHorizontal size={26} />
            </div>
            <h3
              className={`font-['Outfit'] font-bold text-lg sm:text-xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              No se encontraron comercios con estos filtros
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
              Intenta seleccionando otra zona, método de pago o pulsa "Todos"
              para explorar el catálogo completo.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 px-5 py-2.5 bg-[#eab308] text-slate-950 font-['Inter'] font-extrabold text-xs rounded-xl shadow-xs cursor-pointer hover:opacity-90 active:scale-95 inline-flex items-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Ver todos los comercios</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {filteredItems.map((item) => {
              // ── Tarjeta PATROCINADA VIP ──
              if (item.type === 'featured') {
                return (
                  <motion.article
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    whileHover={{
                      scale: 1.03,
                      y: -4,
                      transition: { type: 'spring', stiffness: 350, damping: 25 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative flex flex-col overflow-hidden cursor-pointer rounded-2xl transition-all duration-300 border ${
                      isDark
                        ? 'bg-gradient-to-b from-[#1b1c21] to-[#141518] border-amber-500/35 hover:border-amber-400/70 shadow-sm hover:shadow-lg'
                        : 'bg-white border-amber-400/40 hover:border-amber-500/70 shadow-xs hover:shadow-md'
                    }`}
                    aria-label={`Ficha de ${item.fullName}`}
                  >
                    {/* Banner con Foto */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                      <img
                        src={item.bannerUrl || '/images/og-cumanaconecta.png'}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/images/og-cumanaconecta.png';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                      {/* Badge Superior Derecho: VIP discreto y elegante */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/30 shadow-xs">
                          <Crown size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
                          <span>VIP</span>
                        </span>
                      </div>

                      {/* Badge Superior Izquierdo: Abierto / Cerrado en tiempo real */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        {item.isOpen ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md shadow-xs ${
                              isDark
                                ? 'bg-[#0f3c30]/90 text-[#34d399] border border-[#059669]/40'
                                : 'bg-white/95 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Abierto Ahora</span>
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                              isDark
                                ? 'bg-black/80 text-slate-300 border border-slate-700/60'
                                : 'bg-white/95 text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span>Cerrado</span>
                          </span>
                        )}
                      </div>

                      {/* Badge Inferior Derecho: Delivery */}
                      {item.hasDelivery && (
                        <div className="absolute bottom-2.5 right-2.5 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-medium bg-black/65 backdrop-blur-md text-slate-200">
                            <Truck size={10} className="text-amber-400" />
                            <span>Delivery</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cuerpo de la Tarjeta */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        {/* Categoría superior */}
                        <div className="flex items-center justify-between gap-2 text-[10.5px]">
                          <span className={`font-bold uppercase tracking-wider ${isDark ? 'text-amber-400/90' : 'text-[#005f73]'}`}>
                            {item.categoryLabel || 'Comercio Local'}
                          </span>
                          {item.isMultiBranch && (
                            <span className="text-[10px] font-bold text-amber-500">
                              {item.branchCount || 3} Sedes
                            </span>
                          )}
                        </div>

                        {/* Título con Sello de Verificación */}
                        <div className="flex items-center justify-between gap-1.5 flex-wrap min-w-0">
                          <h2
                            className={`font-['Outfit'] font-bold text-base leading-snug truncate transition-colors ${
                              isDark
                                ? 'text-white group-hover:text-amber-400'
                                : 'text-slate-900 group-hover:text-[#005f73]'
                            }`}
                          >
                            {item.name}
                          </h2>
                          {item.isVerified && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-extrabold shadow-2xs flex-shrink-0 ${
                              isDark
                                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              <ShieldCheck size={11} className="stroke-[2.5]" />
                              <span>Verificado</span>
                            </span>
                          )}
                        </div>

                        {/* Ubicación y Dirección breve */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin
                            size={12}
                            className={
                              isDark
                                ? 'text-amber-400 flex-shrink-0'
                                : 'text-slate-400 flex-shrink-0'
                            }
                          />
                          <span className="truncate">{item.address || item.zone}</span>
                        </div>

                        {/* Pequeña descripción */}
                        {item.description && (
                          <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {item.description}
                          </p>
                        )}

                        {/* Promoción / Combo destacado dentro de la tarjeta */}
                        {item.hasDiscount && item.discountText && (
                          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                            isDark
                              ? 'bg-rose-950/25 border-rose-500/25 text-rose-300'
                              : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}>
                            <Tag size={12} className="text-rose-500 flex-shrink-0" />
                            <span className="truncate">{item.discountText}</span>
                          </div>
                        )}

                        {/* Cashea activo si aplica */}
                        {(item.tags?.includes('Acepta Cashea') || item.paymentMethods?.includes('cashea')) && (
                          <div className="pt-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-md bg-[#FFE600] text-slate-950 border border-amber-300 shadow-2xs">
                              <CasheaIcon className="w-3.5 h-3.5 object-contain" />
                              <span>Acepta Cashea</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Botones de Acción */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {item.isEmergency ? (
                          <a
                            href={`tel:${item.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className={`h-9 px-2 rounded-xl font-['Inter'] font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                              isDark
                                ? 'bg-[#221f15] hover:bg-[#2d281a] border border-[#45371c] text-[#f59e0b]'
                                : 'bg-[#eef2f5] hover:bg-[#e2e8f0] text-slate-800'
                            }`}
                          >
                            <Phone size={13} />
                            <span>Llamar</span>
                          </a>
                        ) : (
                          <a
                            href={`https://wa.me/${item.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="h-9 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-['Inter'] font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-[0_3px_12px_rgba(16,185,129,0.35)]"
                          >
                            <WhatsAppIcon size={13} className="flex-shrink-0" />
                            <span>WhatsApp</span>
                          </a>
                        )}

                        <a
                          href={item.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`h-9 px-2 rounded-xl font-['Inter'] font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                            isDark
                              ? 'bg-[#22242c] hover:bg-[#2c303a] text-slate-200'
                              : 'bg-[#eef2f5] hover:bg-[#e2e8f0] text-slate-800'
                          }`}
                        >
                          <Map
                            size={13}
                            className={
                              isDark ? 'text-amber-400' : 'text-slate-600'
                            }
                          />
                          <span>Mapa</span>
                        </a>
                      </div>
                    </div>
                  </motion.article>
                );
              }

              // ── Tarjeta ESTÁNDAR (Gratis / Regular) ──
              return (
                <motion.article
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  whileHover={{
                    scale: 1.03,
                    y: -4,
                    transition: { type: 'spring', stiffness: 350, damping: 25 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative flex flex-col overflow-hidden cursor-pointer rounded-2xl border transition-all duration-300 ${
                    isDark
                      ? 'bg-[#18191d] border-[#282a32] hover:border-slate-600 hover:shadow-lg'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-lg'
                  }`}
                  aria-label={`Ficha de ${item.fullName}`}
                >
                  {/* Banner con Foto Oficial de la Web o Imagen del Comercio */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.bannerUrl || '/images/og-cumanaconecta.png'}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/images/og-cumanaconecta.png';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Badge de Horario */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      {item.isOpen ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md shadow-xs ${
                            isDark
                              ? 'bg-[#0f3c30]/90 text-[#34d399] border border-[#059669]/40'
                              : 'bg-white/95 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Abierto Ahora</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-md shadow-xs ${
                            isDark
                              ? 'bg-black/80 text-slate-300 border border-slate-700/60'
                              : 'bg-white/95 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>Cerrado</span>
                        </span>
                      )}
                    </div>

                    {item.hasDelivery && (
                      <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-medium bg-black/65 backdrop-blur-md text-slate-200">
                          <Truck size={10} className="text-amber-400" />
                          <span>Delivery</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      {/* Categoría superior */}
                      <div className="text-[10.5px]">
                        <span className={`font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#005f73]'}`}>
                          {item.categoryLabel || 'Comercio Local'}
                        </span>
                      </div>

                      {/* Título */}
                      <h2
                        className={`font-['Outfit'] font-bold text-base leading-snug truncate transition-colors ${
                          isDark
                            ? 'text-white group-hover:text-amber-400'
                            : 'text-slate-900 group-hover:text-[#005f73]'
                        }`}
                      >
                        {item.name}
                      </h2>

                      {/* Dirección / Ubicación */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin
                          size={12}
                          className={
                            isDark
                              ? 'text-amber-400 flex-shrink-0'
                              : 'text-slate-400 flex-shrink-0'
                          }
                        />
                        <span className="truncate">{item.address || item.zone}</span>
                      </div>

                      {/* Pequeña descripción */}
                      {item.description && (
                        <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {item.description}
                        </p>
                      )}

                      {/* Cashea activo si aplica */}
                      {(item.tags?.includes('Acepta Cashea') || item.paymentMethods?.includes('cashea')) && (
                        <div className="pt-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-md bg-[#FFE600] text-slate-950 border border-amber-300 shadow-2xs">
                            <CasheaIcon className="w-3.5 h-3.5 object-contain" />
                            <span>Acepta Cashea</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {item.whatsapp ? (
                        <a
                          href={`https://wa.me/${item.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="h-9 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-['Inter'] font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-[0_3px_12px_rgba(16,185,129,0.35)]"
                        >
                          <WhatsAppIcon size={13} className="flex-shrink-0" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(item);
                          }}
                          className={`h-9 px-2 rounded-xl font-['Inter'] font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                            isDark
                              ? 'bg-[#221f15] hover:bg-[#2d281a] border border-[#45371c] text-[#f59e0b]'
                              : 'bg-[#eef2f5] hover:bg-[#e2e8f0] text-slate-800'
                          }`}
                        >
                          <Phone size={13} />
                          <span>Contactar</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(item);
                        }}
                        className={`h-9 px-2 rounded-xl font-['Inter'] font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                          isDark
                            ? 'bg-[#22242c] hover:bg-[#2c303a] text-slate-200'
                            : 'bg-[#eef2f5] hover:bg-[#e2e8f0] text-slate-800'
                        }`}
                      >
                        <span>Ver Ficha</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>

      {/* ─── Banner Oficial de Cashea ─── */}
      <CasheaBanner onOpenPricing={onOpenPricing} />

      {/* ─── Footer Institucional ─── */}
      <Footer
        onOpenEmergency={onOpenEmergency}
        onOpenPricing={onOpenPricing}
      />
    </div>
  );
}
