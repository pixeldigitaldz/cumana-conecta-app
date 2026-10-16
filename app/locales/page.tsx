'use client';

import { useState, useMemo, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Wifi, 
  Search, 
  MapPin, 
  MessageCircle, 
  Compass, 
  Video, 
  Sparkles, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  Utensils, 
  Palmtree, 
  ShoppingBag, 
  HeartPulse, 
  Wrench, 
  Anchor, 
  LayoutGrid, 
  CheckCircle2, 
  Award, 
  SlidersHorizontal, 
  RotateCcw, 
  X, 
  Clock, 
  Megaphone, 
  Check,
  Waves,
  Car,
  Snowflake,
  Bike,
  PawPrint,
  Smartphone,
  Banknote,
  Rocket,
  Building2,
  Coffee,
  ArrowUpDown,
  Network,
  Send,
  Coins,
  CreditCard,
  Landmark,
  Store,
  Radio,
  Plus
} from 'lucide-react'; 

import { Business } from '@/types/business';
import { BusinessDetailModal } from '@/components/business-detail-modal';
import { useAppData } from '@/lib/app-data-context';
import { VerifiedBadge } from '@/components/verified-badge';
import { VerificationRequestModal } from '@/components/verification-request-modal';
import { CumanaCartographicRadar } from '@/components/cumana-cartographic-radar';
import { is24HoursSchedule, formatSchedule12h } from '@/lib/business-hours';

export default function AllBusinessesPage() {
  const router = useRouter();
  const { businesses, structure, adBanners } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  // Filtros de Respaldo Operativo
  const [filterPower, setFilterPower] = useState(false);
  const [filterWifi, setFilterWifi] = useState(false);
  const [filterParking, setFilterParking] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterDelivery, setFilterDelivery] = useState(false);
  const [filterSea, setFilterSea] = useState(false);
  const [filterPetFriendly, setFilterPetFriendly] = useState(false);

  // Filtros de Métodos de Pago
  const [filterPagoMovil, setFilterPagoMovil] = useState(false);
  const [filterEfectivoUsd, setFilterEfectivoUsd] = useState(false);
  const [filterPuntoVenta, setFilterPuntoVenta] = useState(false);
  const [filterZelle, setFilterZelle] = useState(false);
  const [filterBinance, setFilterBinance] = useState(false);

  // Disponibilidad & Verificación & Multimedia
  const [filterOnlyOpen, setFilterOnlyOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [filterOnlyVerified, setFilterOnlyVerified] = useState(false);
  const [filterMultipleBranches, setFilterMultipleBranches] = useState(false);
  const [filterHasVideo, setFilterHasVideo] = useState(false);

  const [sortBy, setSortBy] = useState<'priority' | 'rating' | 'reviews' | 'name'>('priority');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Modales
  const [modalBusiness, setModalBusiness] = useState<Business | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Leer parámetros de URL al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const qParam = params.get('q') || params.get('buscar') || params.get('search');
        if (qParam) setSearchTerm(qParam);

        const catParam = params.get('categoria') || params.get('category');
        if (catParam) setSelectedCategory(catParam);

        const zoneParam = params.get('sector') || params.get('zona') || params.get('zone');
        if (zoneParam) setSelectedZone(zoneParam);

        if (params.get('abierto') === 'true' || params.get('open') === 'true') {
          setStatusFilter('open');
          setFilterOnlyOpen(true);
        }

        if (params.get('verificado') === 'true' || params.get('verified') === 'true') {
          setFilterOnlyVerified(true);
        }

        if (params.get('delivery') === 'true') {
          setFilterDelivery(true);
        }

        if (params.get('wifi') === 'true') {
          setFilterWifi(true);
        }
      } catch (err) {}
    }
  }, []);

  const handleOpenListing = (biz: Business) => {
    router.push(`/local/${biz.slug}`);
  };

  const zones = useMemo(() => {
    return ['Todas', ...structure.zones];
  }, [structure.zones]);

  const openCount = useMemo(() => {
    return businesses.filter(b => b.isOpenNow && b.status !== 'suspended').length;
  }, [businesses]);

  const categoryStylesMap: Record<string, { icon: any; color: string; bg: string }> = {
    'Gastronomía & Asadores': { icon: Utensils, color: 'text-[#FF6B4A]', bg: 'bg-[#FF6B4A]/15 text-[#FF6B4A]' },
    'Comercio & Tiendas': { icon: ShoppingBag, color: 'text-[#F59E0B]', bg: 'bg-amber-500/15 text-amber-500' },
    'Comercio & Mayoristas': { icon: ShoppingBag, color: 'text-[#F59E0B]', bg: 'bg-amber-500/15 text-amber-500' },
    'Salud & Farmacias': { icon: HeartPulse, color: 'text-[#00C292]', bg: 'bg-[#00C292]/15 text-[#00C292]' },
    'Salud, Clínicas & Farma': { icon: HeartPulse, color: 'text-[#00C292]', bg: 'bg-[#00C292]/15 text-[#00C292]' },
    'Playas & Posadas': { icon: Palmtree, color: 'text-[#06B6D4]', bg: 'bg-cyan-500/15 text-cyan-400' },
    'Playas, Posadas & Tours': { icon: Palmtree, color: 'text-[#06B6D4]', bg: 'bg-cyan-500/15 text-cyan-400' },
    'Automotriz & Talleres': { icon: Car, color: 'text-[#8B5CF6]', bg: 'bg-purple-500/15 text-purple-400' },
    'Náutica & Varaderos': { icon: Anchor, color: 'text-[#8B5CF6]', bg: 'bg-purple-500/15 text-purple-400' },
    'Servicios Técnicos': { icon: Wrench, color: 'text-[#3B82F6]', bg: 'bg-blue-500/15 text-blue-400' },
    'Servicios Técnicos & Hogar': { icon: Wrench, color: 'text-[#3B82F6]', bg: 'bg-blue-500/15 text-blue-400' },
  };

  const categoryItems = useMemo(() => {
    return structure.categories.map((catName) => {
      const count = businesses.filter(b => (b.category === catName || Boolean(b.categories?.includes(catName))) && b.status !== 'suspended').length;
      const meta = categoryStylesMap[catName] || { icon: LayoutGrid, color: 'text-[#FFA384]', bg: 'bg-[#FFA384]/15 text-[#FFA384]' };
      return {
        name: catName,
        icon: meta.icon,
        color: meta.color,
        bg: meta.bg,
        count
      };
    });
  }, [businesses, structure.categories]);

  // Conteo de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (selectedZone !== 'Todas') count++;
    if (selectedCategory !== 'Todos') count++;
    if (filterPower) count++;
    if (filterWifi) count++;
    if (filterParking) count++;
    if (filterAC) count++;
    if (filterDelivery) count++;
    if (filterSea) count++;
    if (filterPetFriendly) count++;
    if (filterPagoMovil) count++;
    if (filterEfectivoUsd) count++;
    if (filterPuntoVenta) count++;
    if (filterZelle) count++;
    if (filterBinance) count++;
    if (filterOnlyOpen || statusFilter !== 'all') count++;
    if (filterOnlyVerified) count++;
    if (filterMultipleBranches) count++;
    if (filterHasVideo) count++;
    return count;
  }, [
    searchTerm,
    selectedZone,
    selectedCategory,
    filterPower,
    filterWifi,
    filterParking,
    filterAC,
    filterDelivery,
    filterSea,
    filterPetFriendly,
    filterPagoMovil,
    filterEfectivoUsd,
    filterPuntoVenta,
    filterZelle,
    filterBinance,
    filterOnlyOpen,
    statusFilter,
    filterOnlyVerified,
    filterMultipleBranches,
    filterHasVideo,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedZone('Todas');
    setSelectedCategory('Todos');
    setFilterPower(false);
    setFilterWifi(false);
    setFilterParking(false);
    setFilterAC(false);
    setFilterDelivery(false);
    setFilterSea(false);
    setFilterPetFriendly(false);
    setFilterPagoMovil(false);
    setFilterEfectivoUsd(false);
    setFilterPuntoVenta(false);
    setFilterZelle(false);
    setFilterBinance(false);
    setFilterOnlyOpen(false);
    setStatusFilter('all');
    setFilterOnlyVerified(false);
    setFilterMultipleBranches(false);
    setFilterHasVideo(false);
  };

  // Anuncios activos para intercalar en el feed
  const activeAds = useMemo(() => {
    return (adBanners || []).filter(a => a.isActive);
  }, [adBanners]);

  const filteredBusinesses = useMemo(() => {
    const list = businesses.filter(b => {
      if (b.status === 'suspended') return false;
      const term = searchTerm.toLowerCase().trim();
      const matchSearch = !term || 
                          b.name.toLowerCase().includes(term) ||
                          b.tagline.toLowerCase().includes(term) ||
                          b.description.toLowerCase().includes(term) ||
                          b.category.toLowerCase().includes(term) ||
                          Boolean(b.categories?.some(c => c.toLowerCase().includes(term))) ||
                          b.zone.toLowerCase().includes(term);
      const matchZone = selectedZone === 'Todas' || b.zone === selectedZone;
      const matchCategory = selectedCategory === 'Todos' || b.category === selectedCategory || Boolean(b.categories?.includes(selectedCategory));
      const matchMultipleBranches = !filterMultipleBranches || (Boolean(b.hasBranches) && (b.branches?.length || 0) > 0);
      const matchHasVideo = !filterHasVideo || Boolean(b.videoRoute?.videoUrl);
      const matchPower = !filterPower || b.amenities.includes('planta_electrica');
      const matchWifi = !filterWifi || b.amenities.includes('fibra_optica');
      const matchSea = !filterSea || b.amenities.includes('frente_al_mar');
      const matchParking = !filterParking || b.amenities.includes('estacionamiento');
      const matchAC = !filterAC || b.amenities.includes('aire_acondicionado');
      const matchDelivery = !filterDelivery || b.amenities.includes('delivery');
      const matchPetFriendly = !filterPetFriendly || b.amenities.includes('pet_friendly');
      const matchPagoMovil = !filterPagoMovil || b.paymentMethods.includes('pago_movil');
      const matchEfectivoUsd = !filterEfectivoUsd || b.paymentMethods.includes('efectivo_usd');
      const matchPuntoVenta = !filterPuntoVenta || (b.paymentMethods.includes('punto_de_venta') || b.paymentMethods.includes('tarjeta_debito'));
      const matchZelle = !filterZelle || b.paymentMethods.includes('zelle');
      const matchBinance = !filterBinance || b.paymentMethods.includes('binance');
      const matchOpen = 
        statusFilter === 'all'
          ? (!filterOnlyOpen || b.isOpenNow)
          : statusFilter === 'open'
          ? b.isOpenNow
          : !b.isOpenNow;
      const matchVerified = !filterOnlyVerified || b.isVerified;

      return matchSearch && matchZone && matchCategory && 
             matchMultipleBranches && matchHasVideo &&
             matchPower && matchWifi && matchSea && 
             matchParking && matchAC && matchDelivery && matchPetFriendly && 
             matchPagoMovil && matchEfectivoUsd && matchPuntoVenta && matchZelle && matchBinance &&
             matchOpen && matchVerified;
    });

    const tierPriority: Record<string, number> = {
      vip: 3,
      pro: 2,
      free: 1
    };

    return list.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'reviews') {
        return b.reviewsCount - a.reviewsCount;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      // Orden jerárquico por defecto: VIP primero, luego PRO, luego Free
      const weightA = tierPriority[a.tier] || 0;
      const weightB = tierPriority[b.tier] || 0;
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      if (a.isVerified !== b.isVerified) {
        return a.isVerified ? -1 : 1;
      }
      return b.rating - a.rating;
    });
  }, [
    businesses,
    searchTerm,
    selectedZone,
    selectedCategory,
    filterMultipleBranches,
    filterHasVideo,
    filterPower,
    filterWifi,
    filterSea,
    filterParking,
    filterAC,
    filterDelivery,
    filterPetFriendly,
    filterPagoMovil,
    filterEfectivoUsd,
    filterPuntoVenta,
    filterZelle,
    filterBinance,
    filterOnlyOpen,
    statusFilter,
    filterOnlyVerified,
    sortBy
  ]);

  return (
    <div className="w-full pb-20 bg-[#f8fafc] dark:bg-[#0b0d11] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200 pt-4">
      {/* Buscador Inteligente & Header Dock según Maqueta */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 mb-6 sm:mb-8">
        <div className="relative rounded-[26px] sm:rounded-[32px] bg-gradient-to-r from-[#0c141e] via-[#0d1825] to-[#0c242a] border border-[#1d2f42] p-4 sm:p-6 shadow-2xl overflow-hidden transition-all text-white space-y-3.5 sm:space-y-4">
          {/* Ambient Glows dentro de la caja según el degradado */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#ff5722]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#00e5aa]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Fila Superior: Icono de Comercio + Títulos + Badges Satelital / Registrados */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#251316] border border-[#481c22] flex items-center justify-center text-[#ff6647] shrink-0 shadow-inner">
                <Store className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[10px] font-mono-tabular font-bold tracking-wider text-slate-400 uppercase block leading-none mb-1">
                  DIRECTORIO FÁCIL DE CUMANÁ • ESTADO SUCRE
                </span>
                <h1 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-none">
                  Buscador Inteligente en Tiempo Real
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/planes"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] sm:text-xs font-black shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                title="Sumar mi comercio a Cumaná Conecta"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Sumar mi Negocio</span>
              </Link>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#091f1b] text-[#00e5aa] border border-[#114b3d] text-[10px] sm:text-[11px] font-mono-tabular font-bold whitespace-nowrap shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5aa] animate-pulse" />
                <span>{businesses.length} LOCALES REGISTRADOS</span>
              </div>
              <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241118] text-[#ff6b8b] border border-[#4a1c2d] text-[10px] sm:text-[11px] font-mono-tabular font-bold whitespace-nowrap shadow-xs">
                <Radio className="w-3.5 h-3.5 text-[#ff6b8b]" />
                <span>SINCRONIZACIÓN 100% SATELITAL</span>
              </div>
            </div>
          </div>

          {/* Input de Búsqueda Estilizado (Más delgado y limpio) */}
          <div className="relative z-10 flex items-center bg-[#070c14] border border-[#192638] focus-within:border-[#00e5aa]/60 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 transition-all shadow-inner">
            <Search className="w-4 h-4 text-[#ff6647] shrink-0 mr-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busca todo lo que tú gustes: pescado frito, posada, café, ferretería, sushi, delivery..."
              className="w-full bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none font-normal leading-normal"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-all cursor-pointer p-0.5 ml-2"
                title="Borrar búsqueda"
              >
                <span className="hidden md:inline-flex px-1.5 py-0.5 rounded bg-[#131d2a] text-[9px] font-mono-tabular font-bold text-slate-400 uppercase border border-[#1f2f42]">
                  LIMPIAR
                </span>
                <X className="w-4 h-4" />
              </button>
            ) : (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded bg-[#131d2a] text-slate-400 text-[10px] font-mono-tabular font-bold uppercase tracking-wider shrink-0 select-none ml-2 border border-[#1f2f42]">
                ESC PARA LIMPIAR
              </span>
            )}
          </div>

          {/* Sugerencias Rápidas de Búsqueda (Píldoras más delgadas y menos gruesas) */}
          <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none [&::-webkit-scrollbar]:hidden text-xs">
            <span className="text-[10px] font-mono-tabular uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ff6647]" /> SUGERENCIAS:
            </span>
            {[
              { label: 'Pescado Frito', icon: Utensils, query: 'pescado' },
              { label: 'Mochima & Playas', icon: Palmtree, query: 'mochima' },
              { label: 'Café & Postres', icon: Coffee, query: 'café' },
              { label: 'Con Estacionamiento', icon: Car, query: '', filter: 'parking' },
              { label: 'Con Delivery', icon: Bike, query: '', filter: 'delivery' },
              { label: 'Fibra Óptica', icon: Wifi, query: '', filter: 'wifi' },
            ].map((sug) => {
              const IconComp = sug.icon;
              const isActive = sug.filter === 'parking' ? filterParking :
                               sug.filter === 'delivery' ? filterDelivery :
                               sug.filter === 'wifi' ? filterWifi :
                               (searchTerm && searchTerm.toLowerCase().includes(sug.query));

              return (
                <button
                  key={sug.label}
                  type="button"
                  onClick={() => {
                    if (sug.filter === 'parking') setFilterParking(!filterParking);
                    else if (sug.filter === 'delivery') setFilterDelivery(!filterDelivery);
                    else if (sug.filter === 'wifi') setFilterWifi(!filterWifi);
                    else {
                      setSearchTerm(searchTerm === sug.query ? '' : sug.query);
                    }
                  }}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] shrink-0 transition-all border flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-[#00e5aa] text-slate-950 font-bold border-[#00e5aa] shadow-xs'
                      : 'bg-[#0f1723] hover:bg-[#162232] text-slate-300 border-[#1a2838] font-normal'
                  }`}
                >
                  <IconComp className="w-3 h-3 opacity-80" />
                  <span>{sug.label}</span>
                </button>
              );
            })}
          </div>

          {/* Fila de Sectores (Directorio en Píldoras según maqueta) */}
          <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none [&::-webkit-scrollbar]:hidden text-xs pt-1.5 border-t border-[#152130]">
            <span className="text-[10px] font-mono-tabular uppercase font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#00e5aa]" /> SECTORES:
            </span>
            <button
              type="button"
              onClick={() => setSelectedZone('Todas')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] shrink-0 transition-all border cursor-pointer ${
                selectedZone === 'Todas'
                  ? 'bg-[#00e5aa] text-slate-950 font-black border-[#00e5aa] shadow-xs'
                  : 'bg-[#0f1723] hover:bg-[#162232] text-slate-300 border-[#1a2838] font-normal'
              }`}
            >
              TODOS ({businesses.length})
            </button>
            {structure.zones.map((zoneName) => {
              const zoneCount = businesses.filter(b => b.zone === zoneName).length;
              const isZoneActive = selectedZone === zoneName;
              return (
                <button
                  key={zoneName}
                  type="button"
                  onClick={() => setSelectedZone(isZoneActive ? 'Todas' : zoneName)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] shrink-0 transition-all border cursor-pointer uppercase ${
                    isZoneActive
                      ? 'bg-[#00e5aa] text-slate-950 font-black border-[#00e5aa] shadow-xs'
                      : 'bg-[#0f1723] hover:bg-[#162232] text-slate-300 border-[#1a2838] font-normal'
                  }`}
                >
                  {zoneName} ({zoneCount})
                </button>
              );
            })}
          </div>

          {/* Feedback en vivo */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-[#152130] font-medium font-mono-tabular">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5aa] animate-pulse" />
              <span>Resultados al instante: <strong className="text-white font-bold" suppressHydrationWarning>{filteredBusinesses.length} locales encontrados</strong></span>
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-[#ff6647] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Limpiar filtros ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </section>


      {/* SECCIÓN PRINCIPAL: 2 COLUMNAS (FILTROS IZQUIERDA + LOCALES DERECHA CON ANUNCIOS HORIZONTALES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex items-center justify-between bg-white dark:bg-[#11141a] p-4 rounded-2xl border border-slate-200 dark:border-[#222630] shadow-sm">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Filtros de Búsqueda</h3>
            <p suppressHydrationWarning className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono-tabular">{filteredBusinesses.length} locales encontrados</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="px-4 py-2 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isMobileFiltersOpen ? 'Ocultar Filtros' : `Filtros (${activeFiltersCount})`}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* COLUMNA IZQUIERDA: FILTROS VERTICALES */}
          <aside className={`w-full lg:w-80 shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-28 bg-white dark:bg-[#11141a] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#222630] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
              
              {/* Header: Filtros y Búsqueda */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1e222b]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#004655]/10 dark:bg-amber-400/10 border border-[#004655]/20 dark:border-amber-400/20 flex items-center justify-center text-[#004655] dark:text-amber-400">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight">
                    Filtros y Búsqueda
                  </h3>
                </div>
                {activeFiltersCount > 0 ? (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#004655] dark:text-amber-400 hover:underline font-bold uppercase tracking-wider transition-colors cursor-pointer font-mono-tabular"
                  >
                    <span>LIMPIAR ({activeFiltersCount})</span>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono-tabular">
                    TODOS ACTIVOS
                  </span>
                )}
              </div>

              {/* 1. DISPONIBILIDAD EN VIVO */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-[#004655] dark:text-amber-400 block">
                  DISPONIBILIDAD EN VIVO
                </span>
                
                {/* Segmented Control 3-Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-[#0b0d11] rounded-xl border border-slate-200 dark:border-[#222630] text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setStatusFilter('all'); setFilterOnlyOpen(false); }}
                    className={`py-2 px-1.5 rounded-lg text-center transition-all cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-white dark:bg-[#161920] text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200 dark:border-[#252934]'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStatusFilter('open'); setFilterOnlyOpen(true); }}
                    className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      statusFilter === 'open'
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                        : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span suppressHydrationWarning>Abiertos ({openCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStatusFilter('closed'); setFilterOnlyOpen(false); }}
                    className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      statusFilter === 'closed'
                        ? 'bg-red-600 text-white font-bold shadow-xs'
                        : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span>Cerrados</span>
                  </button>
                </div>

                {/* VERIFICACIÓN & MULTIMEDIA */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-[#004655] dark:text-amber-400 block">
                    VERIFICACIÓN & MULTIMEDIA
                  </span>

                  {/* Fila 1: Solo Verificados */}
                  <div
                    onClick={() => setFilterOnlyVerified(!filterOnlyVerified)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] hover:border-[#004655]/40 dark:hover:border-blue-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                        Solo Verificados
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      filterOnlyVerified
                        ? 'bg-[#004655] border-[#004655] text-white dark:bg-amber-400 dark:border-amber-400 dark:text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-[#0b0d11] border-slate-300 dark:border-slate-600'
                    }`}>
                      {filterOnlyVerified && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Fila 2: Negocios con Varias Sedes */}
                  <div
                    onClick={() => setFilterMultipleBranches(!filterMultipleBranches)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] hover:border-[#004655]/40 dark:hover:border-amber-400/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#004655]/10 dark:bg-amber-400/10 border border-[#004655]/20 dark:border-amber-400/20 flex items-center justify-center text-[#004655] dark:text-amber-400 shrink-0">
                        <Network className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#004655] dark:group-hover:text-amber-400 transition-colors">
                        Negocios con Varias Sedes
                      </span>
                    </div>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      filterMultipleBranches
                        ? 'bg-[#004655] border-[#004655] text-white dark:bg-amber-400 dark:border-amber-400 dark:text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-[#0b0d11] border-slate-300 dark:border-slate-600'
                    }`}>
                      {filterMultipleBranches && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Fila 3: Con Video de Cómo Llegar */}
                  <div
                    onClick={() => setFilterHasVideo(!filterHasVideo)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] hover:border-[#004655]/40 dark:hover:border-amber-400/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#004655]/10 dark:bg-amber-400/10 border border-[#004655]/20 dark:border-amber-400/20 flex items-center justify-center text-[#004655] dark:text-amber-400 shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#004655] dark:group-hover:text-amber-400 transition-colors">
                          Con Video de Cómo Llegar
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">
                          (45 seg)
                        </span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      filterHasVideo
                        ? 'bg-[#004655] border-[#004655] text-white dark:bg-amber-400 dark:border-amber-400 dark:text-slate-950 shadow-xs'
                        : 'bg-white dark:bg-[#0b0d11] border-slate-300 dark:border-slate-600'
                    }`}>
                      {filterHasVideo && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. RUBROS COMERCIALES */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-[#1e222b]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-[#004655] dark:text-amber-400">
                    RUBROS COMERCIALES
                  </span>
                  <span className="text-[10px] font-mono-tabular text-slate-500 dark:text-slate-400 font-bold">
                    {structure.categories.length} Áreas
                  </span>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {selectedCategory !== 'Todos' && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('Todos')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-[#004655]/10 dark:bg-amber-400/10 text-[#004655] dark:text-amber-400 border border-[#004655]/20 dark:border-amber-400/20 transition-all text-left mb-1.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Ver Todos los Rubros</span>
                      </span>
                      <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-white dark:bg-[#0b0d11] text-slate-800 dark:text-slate-300 font-bold">
                        {businesses.length}
                      </span>
                    </button>
                  )}
                  {categoryItems.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    const IconC = cat.icon;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setSelectedCategory(isSelected ? 'Todos' : cat.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left group cursor-pointer ${
                          isSelected
                            ? 'bg-[#004655] text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm'
                            : 'bg-transparent hover:bg-slate-100 dark:hover:bg-[#161920] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950' : 'bg-slate-100 dark:bg-[#161920] text-[#004655] dark:text-amber-400'
                          }`}>
                            <IconC className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className={`text-[11px] font-mono-tabular px-2 py-0.5 rounded-full shrink-0 font-bold ${
                          isSelected ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-950' : 'bg-slate-100 dark:bg-[#0b0d11] text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 border border-slate-200 dark:border-slate-800'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. RESPALDO OPERATIVO */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-[#1e222b]">
                <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-[#004655] dark:text-amber-400 block">
                  RESPALDO OPERATIVO
                </span>
                <div className="space-y-1 text-xs font-semibold">
                  {[
                    { label: 'Planta Eléctrica 100%', icon: Zap, iconColor: 'text-amber-500', checked: filterPower, toggle: () => setFilterPower(!filterPower) },
                    { label: 'Fibra Óptica Red Sucre', icon: Wifi, iconColor: 'text-teal-500', checked: filterWifi, toggle: () => setFilterWifi(!filterWifi) },
                    { label: 'Estacionamiento Vigilado', icon: Car, iconColor: 'text-slate-500', checked: filterParking, toggle: () => setFilterParking(!filterParking) },
                    { label: 'Aire Acondicionado', icon: Snowflake, iconColor: 'text-sky-500', checked: filterAC, toggle: () => setFilterAC(!filterAC) },
                    { label: 'Servicio Delivery Propio', icon: Bike, iconColor: 'text-orange-500', checked: filterDelivery, toggle: () => setFilterDelivery(!filterDelivery) },
                    { label: 'Frente al Mar / Golfo', icon: Waves, iconColor: 'text-cyan-500', checked: filterSea, toggle: () => setFilterSea(!filterSea) },
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={idx}
                        onClick={item.toggle}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#161920] cursor-pointer transition-all group"
                      >
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-2.5 text-xs font-bold transition-colors">
                          <IconComp className={`w-3.5 h-3.5 ${item.iconColor}`} />
                          <span>{item.label}</span>
                        </span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          item.checked
                            ? 'bg-[#004655] border-[#004655] text-white dark:bg-amber-400 dark:border-amber-400 dark:text-slate-950 shadow-xs'
                            : 'bg-white dark:bg-[#0b0d11] border-slate-300 dark:border-slate-600'
                        }`}>
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. MÉTODOS DE PAGO */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-[#1e222b]">
                <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-[#004655] dark:text-amber-400 block">
                  MÉTODOS DE PAGO
                </span>
                <div className="space-y-1 text-xs font-semibold">
                  {[
                    { label: 'Pago Móvil BCV Instantáneo', icon: Smartphone, iconColor: 'text-emerald-600 dark:text-[#00C292]', checked: filterPagoMovil, toggle: () => setFilterPagoMovil(!filterPagoMovil) },
                    { label: 'Efectivo USD (Cálculo Exacto)', icon: DollarSign, iconColor: 'text-emerald-600 dark:text-emerald-400', checked: filterEfectivoUsd, toggle: () => setFilterEfectivoUsd(!filterEfectivoUsd) },
                    { label: 'Punto de Venta / Biopago BDV', icon: CreditCard, iconColor: 'text-blue-500 dark:text-blue-400', checked: filterPuntoVenta, toggle: () => setFilterPuntoVenta(!filterPuntoVenta) },
                    { label: 'Zelle Verificado', icon: Send, iconColor: 'text-violet-500 dark:text-violet-400', checked: filterZelle, toggle: () => setFilterZelle(!filterZelle) },
                    { label: 'Binance USDT (P2P)', icon: Coins, iconColor: 'text-amber-500 dark:text-amber-400', checked: filterBinance, toggle: () => setFilterBinance(!filterBinance) },
                  ].map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={idx}
                        onClick={item.toggle}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#161920] cursor-pointer transition-all group"
                      >
                        <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-2.5 text-xs font-bold transition-colors">
                          <IconComp className={`w-3.5 h-3.5 ${item.iconColor}`} />
                          <span>{item.label}</span>
                        </span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          item.checked
                            ? 'bg-[#004655] border-[#004655] text-white dark:bg-amber-400 dark:border-amber-400 dark:text-slate-950 shadow-xs'
                            : 'bg-white dark:bg-[#0b0d11] border-slate-300 dark:border-slate-600'
                        }`}>
                          {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. SECTOR O BAHÍA */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-[#1e222b]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-widest text-[#004655] dark:text-amber-400 block">
                    SECTOR O BAHÍA
                  </span>
                  {selectedZone !== 'Todas' && (
                    <button
                      type="button"
                      onClick={() => setSelectedZone('Todas')}
                      className="text-[10px] text-[#004655] dark:text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0b0d11] border border-slate-200 dark:border-[#222630] rounded-xl text-xs text-slate-900 dark:text-white font-bold focus:outline-none focus:border-[#004655] dark:focus:border-[#fbbf24] appearance-none cursor-pointer"
                  >
                    {zones.map((z) => (
                      <option key={z} value={z} className="text-slate-900 dark:text-white bg-white dark:bg-[#0b0d11]">
                        {z === 'Todas' ? 'Todos los sectores de Cumaná' : z}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-3.5 h-3.5 text-[#004655] dark:text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Banner de Planes en Sidebar */}
              <div className="pt-2 border-t border-slate-100 dark:border-[#1e222b]">
                <div className="p-3.5 rounded-xl bg-[#004655]/5 dark:bg-[#161920] border border-slate-200 dark:border-[#222630] text-center space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">¿Quieres posicionar tu comercio?</h4>
                  <Link
                    href="/planes"
                    className="block w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#1f242e] hover:bg-slate-200 dark:hover:bg-[#282e3b] text-slate-800 dark:text-slate-200 text-xs font-bold transition-all text-center"
                  >
                    Ver Planes & Tarifas
                  </Link>
                </div>
              </div>

              {/* Botón Móvil: Aplicar y Cerrar Filtros */}
              {isMobileFiltersOpen && (
                <div className="pt-2 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>APLICAR Y VER {filteredBusinesses.length} LOCALES</span>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* COLUMNA DERECHA: LISTADO DE COMERCIOS Y PUBLICIDADES HORIZONTALES */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* Barra Superior de Control de Resultados */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#11141a] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#222630] shadow-sm">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Listado de Comercios</span>
                  <span suppressHydrationWarning className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#161920] text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-[#252934] font-mono-tabular">
                    {filteredBusinesses.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  {selectedCategory !== 'Todos' ? `Categoría: ${selectedCategory}` : 'Explora todos los rubros'}
                  {selectedZone !== 'Todas' && ` • Sector: ${selectedZone}`}
                </p>
              </div>

              {/* Selector de Orden */}
              <div className="flex items-center gap-2 text-xs self-end sm:self-auto">
                <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 shrink-0 font-mono-tabular">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#004655] dark:text-amber-400" /> Ordenar:
                </span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-[#0b0d11] border border-slate-200 dark:border-[#222630] rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#004655] dark:focus:border-[#fbbf24] cursor-pointer"
                >
                  <option value="priority">Prioridad Recomendada</option>
                  <option value="rating">Mejor Calificados</option>
                  <option value="reviews">Más Reseñas</option>
                  <option value="name">Nombre (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Chips de Filtros Activos Removibles */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-mono-tabular text-slate-500 font-bold">Filtros aplicados:</span>
                {searchTerm && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#161920] text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-[#252934] flex items-center gap-1">
                    Búsqueda: &ldquo;{searchTerm}&rdquo;
                    <button type="button" onClick={() => setSearchTerm('')} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {selectedCategory !== 'Todos' && (
                  <span className="px-2.5 py-1 rounded-full bg-[#004655]/10 dark:bg-amber-400/10 text-[#004655] dark:text-amber-400 font-bold border border-[#004655]/20 dark:border-amber-400/20 flex items-center gap-1">
                    {selectedCategory}
                    <button type="button" onClick={() => setSelectedCategory('Todos')} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {selectedZone !== 'Todas' && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#161920] text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-[#252934] flex items-center gap-1">
                    Sector: {selectedZone}
                    <button type="button" onClick={() => setSelectedZone('Todas')} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {statusFilter === 'open' && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1 font-mono-tabular">
                    Abiertos ahora ({openCount})
                    <button type="button" onClick={() => { setStatusFilter('all'); setFilterOnlyOpen(false); }} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {statusFilter === 'closed' && (
                  <span className="px-2.5 py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 font-bold border border-red-500/30 flex items-center gap-1 font-mono-tabular">
                    Cerrados
                    <button type="button" onClick={() => { setStatusFilter('all'); setFilterOnlyOpen(false); }} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterOnlyVerified && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/30 flex items-center gap-1 font-mono-tabular">
                    Verificados oficiales
                    <button type="button" onClick={() => setFilterOnlyVerified(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterMultipleBranches && (
                  <span className="px-2.5 py-1 rounded-full bg-[#004655]/10 dark:bg-amber-400/10 text-[#004655] dark:text-amber-400 font-bold border border-[#004655]/20 dark:border-amber-400/20 flex items-center gap-1 font-mono-tabular">
                    <Network className="w-3 h-3" /> Multi-Sede
                    <button type="button" onClick={() => setFilterMultipleBranches(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterHasVideo && (
                  <span className="px-2.5 py-1 rounded-full bg-[#004655]/10 dark:bg-amber-400/10 text-[#004655] dark:text-amber-400 font-bold border border-[#004655]/20 dark:border-amber-400/20 flex items-center gap-1 font-mono-tabular">
                    <Video className="w-3 h-3" /> Con Video (45s)
                    <button type="button" onClick={() => setFilterHasVideo(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterPower && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1 font-mono-tabular">
                    <Zap className="w-3 h-3" /> Planta 100%
                    <button type="button" onClick={() => setFilterPower(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterWifi && (
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-400 font-bold border border-teal-500/30 flex items-center gap-1 font-mono-tabular">
                    <Wifi className="w-3 h-3" /> Fibra Óptica
                    <button type="button" onClick={() => setFilterWifi(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterParking && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#161920] text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-[#252934] flex items-center gap-1 font-mono-tabular">
                    <Car className="w-3 h-3" /> Estacionamiento
                    <button type="button" onClick={() => setFilterParking(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterAC && (
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-400 font-bold border border-sky-500/30 flex items-center gap-1 font-mono-tabular">
                    <Snowflake className="w-3 h-3" /> Aire Acond.
                    <button type="button" onClick={() => setFilterAC(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterDelivery && (
                  <span className="px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-700 dark:text-orange-400 font-bold border border-orange-500/30 flex items-center gap-1 font-mono-tabular">
                    <Bike className="w-3 h-3" /> Delivery
                    <button type="button" onClick={() => setFilterDelivery(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterSea && (
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 font-bold border border-cyan-500/30 flex items-center gap-1 font-mono-tabular">
                    <Waves className="w-3 h-3" /> Frente al Mar
                    <button type="button" onClick={() => setFilterSea(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterPagoMovil && (
                  <span className="px-2.5 py-1 rounded-full bg-[#004655]/10 dark:bg-emerald-500/15 text-[#004655] dark:text-emerald-400 font-bold border border-[#004655]/20 dark:border-emerald-500/30 flex items-center gap-1 font-mono-tabular">
                    Pago Móvil BCV
                    <button type="button" onClick={() => setFilterPagoMovil(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterEfectivoUsd && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1 font-mono-tabular">
                    Efectivo USD
                    <button type="button" onClick={() => setFilterEfectivoUsd(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterPuntoVenta && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold border border-blue-500/30 flex items-center gap-1 font-mono-tabular">
                    Punto de Venta
                    <button type="button" onClick={() => setFilterPuntoVenta(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterZelle && (
                  <span className="px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-400 font-bold border border-violet-500/30 flex items-center gap-1 font-mono-tabular">
                    Zelle
                    <button type="button" onClick={() => setFilterZelle(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
                {filterBinance && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1 font-mono-tabular">
                    Binance USDT
                    <button type="button" onClick={() => setFilterBinance(false)} className="cursor-pointer"><X className="w-3 h-3 hover:text-red-500" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Empty State */}
            {filteredBusinesses.length === 0 ? (
              <div className="bg-white dark:bg-[#11141a] rounded-2xl border border-slate-200 dark:border-[#222630] p-10 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-[#004655]/10 dark:bg-amber-400/10 border border-[#004655]/20 dark:border-amber-400/20 flex items-center justify-center mx-auto text-2xl">
                  <Search className="w-7 h-7 text-[#004655] dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No se encontraron comercios con estos filtros
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
                  Prueba cambiando el término de búsqueda, seleccionando otra categoría o restableciendo los filtros avanzados.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restablecer todos los filtros</span>
                </button>
              </div>
            ) : (
              /* Feed Grid con Anuncios Horizontales Intercalados */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredBusinesses.map((biz, index) => {
                  // Cada 4 comercios intercalamos un banner de publicidad horizontal
                  const shouldShowAd = activeAds.length > 0 && (index > 0 && index % 4 === 0);
                  const adIndex = Math.floor(index / 4) - 1;
                  const ad = activeAds[adIndex % activeAds.length];
                  const isDestacado = biz.tier === 'vip' || Boolean(biz.isFeatured);
                  const isMultiBranch = Boolean(biz.hasBranches && ((biz.branches && biz.branches.length > 1) || biz.hasBranches));
                  const hasFullProfile = isDestacado || isMultiBranch;

                  return (
                    <Fragment key={biz.id}>
                      {shouldShowAd && ad && (
                        <div className="col-span-full my-2">
                          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-[#222630] hover:border-[#004655]/40 dark:hover:border-amber-500/40 bg-white dark:bg-[#11141a] p-5 sm:p-6 shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row items-center gap-5">
                              {ad.imageUrl && (
                                <div className="w-full md:w-56 h-36 shrink-0 rounded-xl overflow-hidden bg-slate-900 relative">
                                  <img
                                    src={ad.imageUrl}
                                    alt={ad.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 text-[9px] font-mono-tabular font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Megaphone className="w-2.5 h-2.5 text-amber-400" />
                                    <span>{ad.badgeText || 'Publicidad'}</span>
                                  </div>
                                </div>
                              )}
                              <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#004655]/10 dark:bg-amber-400/10 text-[#004655] dark:text-amber-400 border border-[#004655]/20 dark:border-amber-400/20 text-[10px] font-mono-tabular font-bold uppercase tracking-wide">
                                  <Sparkles className="w-3 h-3 text-[#004655] dark:text-amber-400" />
                                  <span>{ad.badgeText || 'Anuncio Oficial de la Ciudad'}</span>
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                  {ad.title}
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
                                  {ad.subtitle}
                                </p>
                                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                                  {ad.linkUrl.startsWith('http') ? (
                                    <a
                                      href={ad.linkUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="py-2 px-4 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span>{ad.buttonText || 'Ver Información'}</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </a>
                                  ) : (
                                    <Link
                                      href={ad.linkUrl}
                                      className="py-2 px-4 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span>{ad.buttonText || 'Ver Información'}</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                  )}
                                  <Link
                                    href="/planes"
                                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold transition-colors flex items-center gap-1"
                                  >
                                    <span>¿Deseas anunciarte aquí?</span>
                                    <span className="text-[#004655] dark:text-amber-400">→</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tarjeta de Comercio en el Feed */}
                      <div
                        onClick={() => {
                          if (hasFullProfile) {
                            router.push(`/local/${biz.slug}`);
                          } else {
                            setModalBusiness(biz);
                            setIsModalOpen(true);
                          }
                        }}
                        className={`group bg-white dark:bg-[#11141a] rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1 cursor-pointer ${
                          hasFullProfile
                            ? 'border-slate-200/90 dark:border-[#222630] hover:border-amber-400/50 dark:hover:border-amber-400/40 shadow-sm hover:shadow-xl'
                            : biz.tier === 'pro'
                            ? 'border-[#004655]/40 dark:border-[#004655]/40 hover:border-[#004655] shadow-sm hover:shadow-xl'
                            : 'border-slate-200 dark:border-[#222630] hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
                        }`}
                      >
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                          <img
                            src={biz.heroImage}
                            alt={biz.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                          {hasFullProfile ? (
                            <Link
                              href={`/local/${biz.slug}`}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute inset-0 z-0"
                              aria-label={`Ver ficha completa de ${biz.name}`}
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalBusiness(biz);
                                setIsModalOpen(true);
                              }}
                              className="absolute inset-0 z-0 cursor-pointer w-full h-full"
                              aria-label={`Ver información de ${biz.name}`}
                            />
                          )}

                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md border flex items-center gap-1 shadow-xs ${
                              biz.isOpenNow 
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50' 
                                : 'bg-red-950/80 text-red-300 border-red-600/50'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${biz.isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                              <span>{is24HoursSchedule(biz.openingHours) ? '24/7' : (biz.isOpenNow ? 'Abierto' : 'Cerrado')}</span>
                            </span>
                            {biz.videoRoute && (
                              <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white border border-white/20 text-[10px] font-mono-tabular font-bold flex items-center gap-1">
                                <Video className="w-3 h-3 text-[#004655] dark:text-amber-400" /> {biz.videoRoute.duration}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                            {isMultiBranch && (
                              <span className="px-2.5 py-0.5 rounded-md bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                                <Network className="w-2.5 h-2.5" />
                                MULTI-SEDE ({biz.branches?.length || 3})
                              </span>
                            )}
                            {isDestacado ? (
                              <span className="px-2.5 py-0.5 rounded-md bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                                <Sparkles className="w-2.5 h-2.5" />
                                Destacado
                              </span>
                            ) : biz.tier === 'pro' ? (
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/35 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                Verificado
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-semibold truncate font-mono-tabular">
                              <span 
                                className="text-[#004655] dark:text-amber-400 font-bold truncate uppercase"
                                title={(biz.categories && biz.categories.length > 0 ? biz.categories : [biz.category]).join(' • ')}
                              >
                                {(biz.categories && biz.categories.length > 0 ? biz.categories : [biz.category]).join(' • ')}
                              </span>
                              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 shrink-0">
                                <MapPin className="w-3 h-3 text-[#004655] dark:text-amber-400" /> {biz.zone}
                              </span>
                            </div>

                            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#004655] dark:group-hover:text-amber-400 transition-colors leading-snug flex items-center gap-1.5">
                              {hasFullProfile ? (
                                <Link 
                                  href={`/local/${biz.slug}`} 
                                  onClick={(e) => e.stopPropagation()}
                                  className="line-clamp-1 hover:underline"
                                >
                                  {biz.name}
                                </Link>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalBusiness(biz);
                                    setIsModalOpen(true);
                                  }}
                                  className="line-clamp-1 hover:underline text-left cursor-pointer"
                                >
                                  {biz.name}
                                </button>
                              )}
                              {biz.isVerified && <VerifiedBadge size="sm" />}
                            </h3>

                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                              {biz.tagline}
                            </p>

                            {/* Píldoras de Sedes para Negocios Multi-Sede */}
                            {biz.hasBranches && biz.branches && biz.branches.length > 1 && (
                              <div className="flex items-center gap-1 flex-wrap pt-2">
                                {biz.branches.map((b) => (
                                  <span 
                                    key={b.id} 
                                    className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161920] text-slate-700 dark:text-slate-300 font-mono-tabular text-[9px] font-semibold border border-slate-200 dark:border-[#252934]"
                                  >
                                    {b.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Horario y Estado Operativo */}
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-1 border-t border-slate-100 dark:border-[#1e222b] font-mono-tabular font-medium">
                              <Clock className="w-3.5 h-3.5 text-[#004655] dark:text-amber-400 shrink-0" />
                              <span className="truncate">{formatSchedule12h(biz.openingHours)}</span>
                              <span className={`font-bold ml-auto shrink-0 ${biz.isOpenNow ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                {is24HoursSchedule(biz.openingHours) ? '24/7' : (biz.isOpenNow ? 'Abierto' : 'Cerrado')}
                              </span>
                            </div>
                          </div>

                          {/* Amenidades destacadas */}
                          <div className="flex flex-wrap gap-1 text-[10px] pt-1 border-t border-slate-100 dark:border-[#1e222b]">
                            {biz.amenities.includes('fibra_optica') && (
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold border border-cyan-500/20 flex items-center gap-1">
                                <Wifi className="w-3 h-3" /> Fibra
                              </span>
                            )}
                            {biz.amenities.includes('frente_al_mar') && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold border border-blue-500/20 flex items-center gap-1">
                                <Waves className="w-3 h-3 text-cyan-500" /> Mar
                              </span>
                            )}
                            {biz.amenities.includes('estacionamiento') && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161920] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#252934] flex items-center gap-1">
                                <Car className="w-3 h-3 text-slate-500" /> Parking
                              </span>
                            )}
                            {biz.amenities.includes('delivery') && (
                              <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-700 dark:text-orange-400 font-semibold border border-orange-500/20 flex items-center gap-1">
                                <Bike className="w-3 h-3 text-amber-500" /> Delivery
                              </span>
                            )}
                            {biz.amenities.includes('aire_acondicionado') && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161920] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#252934] flex items-center gap-1">
                                <Snowflake className="w-3 h-3 text-blue-400" /> A/C
                              </span>
                            )}
                            {biz.amenities.includes('pet_friendly') && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161920] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#252934] flex items-center gap-1">
                                <PawPrint className="w-3 h-3 text-emerald-500" /> Pet Friendly
                              </span>
                            )}
                            {biz.amenities.includes('planta_electrica') && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161920] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#252934] flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-500" /> Planta
                              </span>
                            )}
                          </div>

                          {/* Acciones */}
                          <div className="pt-2 flex items-center gap-2">
                            {hasFullProfile ? (
                              <Link
                                href={`/local/${biz.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-[#161920] dark:hover:bg-[#1f242e] border border-[#004655] dark:border-[#252934] dark:text-white text-xs font-bold text-center transition-all cursor-pointer shadow-xs flex items-center justify-center active:scale-95"
                              >
                                {isMultiBranch && biz.branches && biz.branches.length > 1
                                  ? `Explorar ${biz.branches.length} Sedes`
                                  : 'Explorar Local'}
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalBusiness(biz);
                                  setIsModalOpen(true);
                                }}
                                className="flex-1 py-2 px-3 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-[#161920] dark:hover:bg-[#1f242e] border border-[#004655] dark:border-[#252934] dark:text-white text-xs font-bold text-center transition-all cursor-pointer shadow-xs flex items-center justify-center active:scale-95"
                              >
                                <span>Ver Ficha</span>
                              </button>
                            )}
                            <a
                              href={biz.socials.whatsapp}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-xs shrink-0 active:scale-95"
                              title="Contactar vía WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Telemetría Cartográfica en Tiempo Real y Radar Satelital de Locales */}
      <CumanaCartographicRadar
        businesses={businesses}
        onOpenDetail={(biz) => {
          setModalBusiness(biz);
          setIsModalOpen(true);
        }}
        onOpenVerification={() => setIsVerificationModalOpen(true)}
      />

      {/* Ventana Flotante Modal con todos los datos */}
      <BusinessDetailModal
        business={modalBusiness}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Modal de Solicitud de Registro y Verificación Oficial */}
      <VerificationRequestModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </div>
  );
}
