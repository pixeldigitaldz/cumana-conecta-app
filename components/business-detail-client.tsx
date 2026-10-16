'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Business } from '@/types/business';
import { 
  MapPin, 
  MessageCircle, 
  Clock, 
  Zap, 
  Wifi, 
  CircleParking, 
  Wind, 
  Waves, 
  Play, 
  Check, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  CreditCard,
  AlertCircle,
  Flame,
  Globe,
  Smartphone,
  Banknote,
  Coins,
  Landmark,
  Nfc,
  Building2,
  Phone,
  Timer,
  PawPrint,
  Bike,
  Music,
  Navigation,
  Car,
  Snowflake
} from 'lucide-react';
import { WhatsAppIcon, InstagramIcon, TikTokIcon, FacebookIcon } from '@/components/social-icons';
import { VerifiedBadge } from '@/components/verified-badge';
import { useAppData } from '@/lib/app-data-context';
import { is24HoursSchedule, formatSchedule12h, isBusinessOpen } from '@/lib/business-hours';
import { CumanaMapCard } from '@/components/cumana-map-card';
import { BusinessShareCard } from '@/components/business-share-card';
import { BusinessArrivalCards } from '@/components/business-arrival-cards';
import { MultiBranchView } from '@/components/multi-branch-view';

export default function BusinessDetailClient({ business: initialBusiness, slug }: { business?: Business; slug?: string }) {
  const { businesses } = useAppData();
  const business = businesses.find(b => b.slug === (slug || initialBusiness?.slug)) || initialBusiness;
  const [activeMilestone, setActiveMilestone] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [currentGalleryImg, setCurrentGalleryImg] = useState<string | null>(null);
  const [selectedBranchIdx, setSelectedBranchIdx] = useState<number>(0);
  const [calcUsd, setCalcUsd] = useState<number>(10);
  const bcvRate = 876.80;

  if (!business) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#FF6B4A] flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
          Comercio no encontrado
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#A0AEC0] max-w-md mb-6 font-medium">
          El comercio que buscas no está disponible o su enlace ha cambiado.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-bold transition-all shadow-md"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  // Si es un comercio Multi-Sede / Red de sucursales, renderizar la vista especializada de alta fidelidad (Imágenes 3 y 4)
  if (business.isMultiBranch || (business.hasBranches && business.branches && business.branches.length > 1)) {
    return <MultiBranchView business={business} />;
  }

  const isVip = business.tier === 'vip';
  const isFeaturedTier = business.tier === 'vip' || business.tier === 'pro';

  const STITCH_AMENITIES: Record<string, {
    icon: any;
    boxClass: string;
    title: string;
    description: string;
  }> = {
    fibra_optica: {
      icon: Wifi,
      boxClass: 'bg-[#00C292]/15 border-[#00C292]/25 text-[#00C292]',
      title: 'Fibra Óptica Alta Velocidad',
      description: 'Conexión estable de alta velocidad disponible en todas las áreas para comensales y clientes.'
    },
    planta_electrica: {
      icon: Zap,
      boxClass: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
      title: 'Planta Eléctrica 100% Continua',
      description: 'Generador de respaldo automático que garantiza iluminación, punto de venta y climatización.'
    },
    estacionamiento: {
      icon: CircleParking,
      boxClass: 'bg-[#FFA384]/15 border-[#FFA384]/25 text-[#FFA384]',
      title: 'Estacionamiento Privado Cerrado',
      description: 'Capacidad cómoda para vehículos con vigilancia continua y acceso seguro al local.'
    },
    frente_al_mar: {
      icon: Waves,
      boxClass: 'bg-[#00C292]/15 border-[#00C292]/25 text-[#00C292]',
      title: 'Terraza & Vista al Golfo',
      description: 'Espacio descubierto frente al mar con brisa marina natural y vista panorámica.'
    },
    aire_acondicionado: {
      icon: Wind,
      boxClass: 'bg-sky-500/15 border-sky-500/25 text-sky-400',
      title: 'Ambiente Climatizado Confort',
      description: 'Salones internos climatizados a temperatura ideal durante toda la jornada.'
    },
    pet_friendly: {
      icon: PawPrint,
      boxClass: 'bg-[#FFA384]/15 border-[#FFA384]/25 text-[#FFA384]',
      title: 'Pet Friendly en Deck Exterior',
      description: 'Mascotas bienvenidas en terraza al aire libre con atención amigable y espacio cómodo.'
    },
    delivery: {
      icon: Bike,
      boxClass: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
      title: 'Servicio Delivery Directo',
      description: 'Despacho rápido a domicilio en Cumaná coordinado directamente por WhatsApp.'
    }
  };

  const STITCH_PAYMENTS: Record<string, {
    icon: any;
    iconColor: string;
    title: string;
    subtitle: string;
  }> = {
    zelle: {
      icon: CreditCard,
      iconColor: 'text-[#00C292]',
      title: 'Zelle',
      subtitle: 'Confirmación Instantánea'
    },
    pago_movil: {
      icon: Smartphone,
      iconColor: 'text-amber-400',
      title: 'Pago Móvil',
      subtitle: 'Tasa Oficial BCV'
    },
    efectivo_usd: {
      icon: Banknote,
      iconColor: 'text-[#FFA384]',
      title: 'Efectivo USD / EUR',
      subtitle: 'Cambio exacto disponible'
    },
    tarjeta_debito: {
      icon: Nfc,
      iconColor: 'text-slate-500 dark:text-slate-300',
      title: 'Tarjetas Int. / POS',
      subtitle: 'Visa, Mastercard & Débito'
    },
    punto_de_venta: {
      icon: Nfc,
      iconColor: 'text-slate-500 dark:text-slate-300',
      title: 'Punto de Venta',
      subtitle: 'Visa, Mastercard & Débito'
    },
    binance: {
      icon: Coins,
      iconColor: 'text-amber-400',
      title: 'Binance Pay',
      subtitle: 'Confirmación Instantánea'
    },
    efectivo_bs: {
      icon: Landmark,
      iconColor: 'text-[#00C292]',
      title: 'Bolívares (Bs)',
      subtitle: 'Tasa Oficial BCV'
    }
  };

  return (
    <div className="w-full pb-20">
      {/* Hero Banner Inmersivo con Contraste Protegido al 100% en Modo Claro y Modo Oscuro */}
      <div className="relative w-full bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-[#1E2D45]">
        <div className="relative min-h-[360px] sm:min-h-[440px] md:min-h-[480px] w-full flex flex-col justify-end">
          {/* Imagen de fondo del local */}
          <img
            src={currentGalleryImg || business.heroImage}
            alt={business.name}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Filtro degradado cinematográfico oscuro de alta protección (garantiza legibilidad siempre) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/35 pointer-events-none" />

          {/* Badges superiores ubicados bien arriba en la foto */}
          <div className="absolute top-5 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
              {(business.categories && business.categories.length > 0 ? business.categories : [business.category]).map(cat => (
                <span key={cat} className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-bold text-[#00C292] border border-[#00C292]/40 shadow-sm">
                  {cat}
                </span>
              ))}
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs text-white border border-white/20 flex items-center gap-1 font-semibold shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" /> {business.zone}
              </span>
              {isFeaturedTier && (
                <span className="px-3 py-1 rounded-full bg-[#FF6B4A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5" /> Comercio Destacado
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                business.isOpenNow ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}>
                {is24HoursSchedule(business.openingHours) ? '● 24/7 Abierto' : (business.isOpenNow ? '● Abierto Ahora' : '○ Cerrado')}
              </span>
            </div>

            {/* RIF Badge oficial en la foto si el comercio lo posee */}
            {business.rif && (
              <div className="pointer-events-auto">
                <span className="px-3 py-1 rounded-lg bg-black/90 text-white text-[11px] font-black tracking-wider border border-white/20 shadow-md flex items-center gap-1.5">
                  <span className="text-[#FFA384] font-extrabold">RIF:</span>
                  <span>{business.rif}</span>
                </span>
              </div>
            )}
          </div>

          {/* Contenido frontal sobre la foto (Título y Botones de acción) */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col justify-end space-y-4">
            {/* Título y Acciones */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pt-2">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] flex items-center flex-wrap gap-2.5">
                  <span>{business.name}</span>
                  {business.isVerified && <VerifiedBadge size="md" showText />}
                </h1>

                <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {business.tagline}
                </p>
              </div>

              {/* Botones de acción directos más delgados y estilizados */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <a
                  href={business.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#00C292] hover:bg-[#00C292]/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>Contactar por WhatsApp</span>
                </a>

                <a
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-950 font-bold text-xs border border-white/40 backdrop-blur-md flex items-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0" />
                  <span>Cómo Llegar (Maps)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Banner de Recomendación & Compartir Ficha idéntico a referencia */}
        <div className="mb-8">
          <BusinessShareCard business={business} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Promoción Especial si está activa */}
            {business.promotion?.isActive && (
              <div className="bg-gradient-to-r from-[#FF6B4A]/15 via-[#FF6B4A]/10 to-transparent border-2 border-[#FF6B4A] rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="p-1 rounded-lg bg-[#FF6B4A] text-white">
                      <Flame className="w-4 h-4 fill-current" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-[#FF6B4A]">
                      Promoción Especial Activa
                    </span>
                    {business.promotion.discountBadge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B4A] text-white text-xs font-black shadow-sm">
                        {business.promotion.discountBadge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white">
                    {business.promotion.title}
                  </h3>
                  {business.promotion.description && (
                    <p className="text-xs text-slate-700 dark:text-[#A0AEC0] font-medium leading-relaxed">
                      {business.promotion.description}
                    </p>
                  )}
                  {business.promotion.validUntil && (
                    <span className="text-[11px] text-[#008966] dark:text-[#00C292] font-medium flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{business.promotion.validUntil}</span>
                    </span>
                  )}
                </div>

                <a
                  href={business.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Aprovechar Oferta</span>
                </a>
              </div>
            )}

            {/* ============================================================== */}
            {/* 2. THE CENTERPIECE: HUB MULTI-SEDE INTERACTIVO (UNIVERSAL)      */}
            {/* ============================================================== */}
            {business.hasBranches && business.branches && business.branches.length > 0 && (() => {
              const branches = business.branches;
              const activeBranch = branches[selectedBranchIdx] || branches[0];
              const isComingSoon = activeBranch.status === 'coming_soon';
              const branchSchedule = activeBranch.openingHours || business.openingHours;
              const branchPhone = activeBranch.phone || business.socials.whatsapp;
              const phoneClean = branchPhone.replace(/[^0-9]/g, '');
              const whatsappBranchUrl = `https://wa.me/${phoneClean || '584127894411'}?text=${encodeURIComponent(
                `Hola ${business.name}, por favor me envían la dirección y cómo llegar a la ${activeBranch.name}`
              )}`;
              const mapsBranchUrl = activeBranch.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${activeBranch.name} ${activeBranch.address} Cumaná Sucre`)}`;

              return (
                <section className="bg-surface-container-low rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden border border-outline-variant/30">
                  {/* Container Ambient Aura */}
                  <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-container/10 blur-[100px] pointer-events-none" />

                  {/* Hub Header & Status Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-label-telemetry text-xs px-3 py-0.5 rounded-full bg-secondary-container/20 text-secondary uppercase font-bold tracking-wider">
                          SEDES Y DIRECCIONES
                        </span>
                        <span className="font-label-telemetry text-xs px-3 py-0.5 rounded-full bg-surface-container-highest text-primary font-semibold tracking-wider">
                          {business.name.toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline-lg text-on-surface tracking-tight font-semibold">
                        {business.name} tiene {branches.length} Sedes en Cumaná · Toca una sede para ver su foto y dirección:
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 font-label-telemetry text-xs">
                      <div className="px-4 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface flex items-center gap-2 font-semibold border border-outline-variant/30">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
                        <span>{branches.length} SEDES EN LA CIUDAD</span>
                      </div>
                    </div>
                  </div>

                  {/* TOP METRO-STYLE BRANCH SWITCHER */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                    {branches.map((b, idx) => {
                      const isSelected = selectedBranchIdx === idx;
                      const isBranchComingSoon = b.status === 'coming_soon';

                      return (
                        <button
                          key={b.id || idx}
                          type="button"
                          onClick={() => setSelectedBranchIdx(idx)}
                          className={`text-left p-4 rounded-xl transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-surface-container-highest border-secondary/50 shadow-[0_0_20px_rgba(1,194,146,0.3)]'
                              : isBranchComingSoon
                              ? 'bg-surface-container/70 border-outline-variant/30 opacity-90 hover:opacity-100 hover:bg-surface-container'
                              : 'bg-surface-container border-outline-variant/20 hover:bg-surface-container-high'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-label-telemetry text-[11px] font-bold tracking-wider uppercase ${
                              isSelected
                                ? 'text-secondary'
                                : isBranchComingSoon
                                ? 'text-tertiary'
                                : 'text-on-surface-variant'
                            }`}>
                              {isSelected ? 'VIENDO AHORA' : isBranchComingSoon ? 'EN CONSTRUCCIÓN' : 'TOCAR PARA VER'}
                            </span>
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              isSelected
                                ? 'bg-secondary'
                                : isBranchComingSoon
                                ? 'bg-tertiary animate-pulse'
                                : 'bg-secondary/70'
                            }`} />
                          </div>
                          <span className="block font-headline-sm text-base sm:text-lg text-on-surface leading-snug font-semibold">
                            {b.name}
                          </span>
                          <span className={`block text-xs font-semibold mt-1 ${
                            isBranchComingSoon ? 'text-tertiary font-bold' : 'text-secondary'
                          }`}>
                            {isBranchComingSoon ? `(${b.roleBadge || 'Próxima Apertura'})` : '(Abierto Hoy)'}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* DYNAMIC SPLIT STAGE */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
                    {/* Left Stage: Visual Facade & Street Entry (cols 1-6) */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-surface-container-lowest border border-outline-variant/30 group">
                        <img
                          src={activeBranch.image || business.heroImage}
                          alt={activeBranch.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Top Left Floating Pill */}
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-surface-container-lowest/85 backdrop-blur-md font-label-telemetry text-xs text-on-surface uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-outline-variant/30">
                          <Check className="w-3.5 h-3.5 text-secondary" />
                          <span>Vista Real de Fachada · {activeBranch.name}</span>
                        </div>

                        {/* Mini Video-Route Floating Box */}
                        <div
                          onClick={() => {
                            const videoEl = document.getElementById('videoruta-section');
                            if (videoEl) {
                              videoEl.scrollIntoView({ behavior: 'smooth' });
                              setIsPlayingVideo(true);
                            }
                          }}
                          className="absolute bottom-3 right-3 max-w-[210px] p-2.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md shadow-2xl flex flex-col gap-1 transition-transform hover:scale-[1.02] cursor-pointer border border-primary-container/40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-label-telemetry text-[10px] text-primary-container font-semibold tracking-wider uppercase">
                              VIDEORUTA {activeBranch.videoDuration || '45S'}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-surface-container font-label-telemetry text-[9px] text-on-surface">
                              HD
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0 shadow-md">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                            <p className="font-body-sm text-xs text-on-surface leading-tight font-medium">
                              Ver entrada a {activeBranch.name.split(':')[0] || 'Sede'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail Perspective Strip */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-secondary shrink-0" />
                          <span className="font-label-md text-xs text-on-surface truncate">Fachada & Rampa</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2">
                          <Car className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-label-md text-xs text-on-surface truncate">Parking Clientes</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2">
                          <Snowflake className="w-4 h-4 text-secondary shrink-0" />
                          <span className="font-label-md text-xs text-on-surface truncate">Climatizado A/C</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Stage: Pasaporte de Llegada (cols 7-12) */}
                    <div className="lg:col-span-6 flex flex-col justify-between bg-surface-container-lowest p-6 rounded-xl shadow-xl space-y-4 border border-outline-variant/30">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-headline-md text-lg sm:text-xl text-on-surface font-bold">
                              {business.name} · {activeBranch.name}
                            </span>
                            {business.isVerified && <VerifiedBadge size="sm" />}
                          </div>
                          <span className={`px-2.5 py-1 rounded text-xs font-label-telemetry font-bold ${
                            isComingSoon
                              ? 'bg-tertiary-container/20 text-tertiary'
                              : 'bg-secondary-container/20 text-secondary'
                          }`}>
                            {isComingSoon ? 'PRÓXIMA APERTURA' : 'ABIERTO HOY'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 font-label-md text-xs text-on-surface-variant font-medium">
                          {business.rif && <span>RIF: {business.rif}</span>}
                          <span>·</span>
                          <span>Licencia Municipal Sucre</span>
                        </div>

                        <div className="flex items-center gap-2 text-on-surface text-xs sm:text-sm pt-1 font-semibold">
                          <Clock className="w-4 h-4 text-secondary shrink-0" />
                          <span>Horario: {activeBranch.openingHours || business.openingHours}</span>
                        </div>
                      </div>

                      {/* Bloque Destacado: ¿Cómo llegar y cómo es la entrada? */}
                      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/25 shadow-md space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-primary-container" />
                          <span className="font-label-lg text-xs sm:text-sm text-primary-container uppercase font-bold tracking-wide">
                            ¿CÓMO LLEGAR Y CÓMO ES LA ENTRADA?
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
                          <Phone className="w-4 h-4 text-secondary shrink-0" />
                          <span className="text-xs sm:text-sm font-bold text-on-surface">
                            Llamadas y WhatsApp:{' '}
                            <a href={`tel:${phoneClean}`} className="text-secondary hover:underline">
                              {activeBranch.phone || business.socials.whatsapp}
                            </a>
                          </span>
                        </div>

                        <p className="text-sm sm:text-base text-on-surface leading-relaxed font-normal">
                          {activeBranch.entranceGuide || activeBranch.address}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-primary font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Referencia: Entrada directa para vehículos particulares y área para carga / delivery.</span>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="space-y-2 pt-1">
                        <a
                          href={whatsappBranchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary-container text-on-secondary-container font-label-lg text-sm font-bold hover:shadow-[0_0_20px_rgba(1,194,146,0.4)] transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Enviar Dirección por WhatsApp</span>
                        </a>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href={mapsBranchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-xs sm:text-sm font-semibold transition-all border border-outline-variant/30 cursor-pointer"
                          >
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>Ver en Google Maps</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              const videoEl = document.getElementById('videoruta-section');
                              if (videoEl) {
                                videoEl.scrollIntoView({ behavior: 'smooth' });
                                setIsPlayingVideo(true);
                              }
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-xs sm:text-sm font-semibold transition-all border border-outline-variant/30 cursor-pointer"
                          >
                            <Play className="w-4 h-4 text-primary-container fill-current" />
                            <span>Ver Video de Cómo Llegar ({activeBranch.videoDuration || '45 seg'})</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between px-1 pt-1 font-label-md text-xs text-on-surface font-semibold">
                          <span className="truncate">{activeBranch.address}</span>
                          <span className="text-secondary font-bold shrink-0 ml-2">
                            DISTANCIA: {activeBranch.distanceText || '0.8 KM'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* ============================================================== */}
            {/* 3. BENTO 50/50: SERVICIOS EN SEDE + CALCULADORA BCV EN CAJA    */}
            {/* ============================================================== */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Bento: Infrastructure Squircles 2x2 Grid (cols 1-6) */}
              <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-5 border border-outline-variant/30">
                <div>
                  <span className="font-label-telemetry text-xs text-secondary uppercase tracking-wider block font-bold">
                    Garantía Operativa
                  </span>
                  <h3 className="text-xl sm:text-2xl font-headline-md text-on-surface tracking-tight font-semibold">
                    Infraestructura y Servicios en Sede
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Squircle 1: Planta Eléctrica */}
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary shadow-[inset_0_0_12px_rgba(65,223,172,0.25)]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-base font-headline-sm text-on-surface font-semibold leading-snug">
                      Planta Eléctrica 100%
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Generador continuo. Cero interrupciones en cadena de frío y sistemas de cobro.
                    </p>
                  </div>

                  {/* Squircle 2: Parking */}
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container shadow-[inset_0_0_12px_rgba(255,107,74,0.25)]">
                      <CircleParking className="w-5 h-5" />
                    </div>
                    <span className="text-base font-headline-sm text-on-surface font-semibold leading-snug">
                      Zona de Carga y Parking
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Puestos asfaltados para particulares y andén exclusivo para choferes de carga.
                    </p>
                  </div>

                  {/* Squircle 3: Climatización */}
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-tertiary shadow-[inset_0_0_12px_rgba(255,181,156,0.25)]">
                      <Snowflake className="w-5 h-5" />
                    </div>
                    <span className="text-base font-headline-sm text-on-surface font-semibold leading-snug">
                      Climatización Total
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Ambientes refrigerados y salas de expendio confortables a temperatura constante.
                    </p>
                  </div>

                  {/* Squircle 4: Despacho Express */}
                  <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-secondary-fixed shadow-[inset_0_0_12px_rgba(101,252,199,0.25)]">
                      <Bike className="w-5 h-5" />
                    </div>
                    <span className="text-base font-headline-sm text-on-surface font-semibold leading-snug">
                      Despacho Express
                    </span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Caja rápida dedicada a transportistas de encomiendas urbanas y pedidos pick-up.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Bento: Payment Methods + Live BCV Currency Converter (cols 7-12) */}
              <div className="lg:col-span-6 bg-surface-container-low p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-5 border border-outline-variant/30">
                <div>
                  <span className="font-label-telemetry text-xs text-primary-container uppercase tracking-wider block font-bold">
                    Transacciones Transparentes
                  </span>
                  <h3 className="text-xl sm:text-2xl font-headline-md text-on-surface tracking-tight font-semibold">
                    Métodos de Pago & Tasa Oficial BCV
                  </h3>
                </div>

                {/* 4 Payment Option Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2.5">
                    <Smartphone className="w-5 h-5 text-secondary shrink-0" />
                    <div>
                      <span className="block font-semibold text-on-surface">Pago Móvil Interbancario</span>
                      <span className="text-on-surface-variant text-[11px]">Banesco, Mercantil, BDV · QR</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2.5">
                    <CreditCard className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <span className="block font-semibold text-on-surface">Zelle / USDT Binance</span>
                      <span className="text-on-surface-variant text-[11px]">Aprobación en caja en 30s</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2.5">
                    <Banknote className="w-5 h-5 text-secondary shrink-0" />
                    <div>
                      <span className="block font-semibold text-on-surface">Efectivo USD / EUR</span>
                      <span className="text-on-surface-variant text-[11px]">Billetes limpios sin restricción</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-2.5">
                    <Nfc className="w-5 h-5 text-tertiary shrink-0" />
                    <div>
                      <span className="block font-semibold text-on-surface">Biopago & Tarjetas</span>
                      <span className="text-on-surface-variant text-[11px]">Puntos de venta de alta velocidad</span>
                    </div>
                  </div>
                </div>

                {/* Sleek Interactive BCV Converter Bar */}
                <div className="p-4 rounded-xl bg-surface-container-lowest shadow-inner space-y-3 border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-primary-container" />
                      <span className="font-label-telemetry text-xs text-on-surface font-semibold uppercase tracking-wider">
                        CALCULADORA EN CAJA (TASA BCV: {bcvRate.toFixed(2).replace('.', ',')} Bs)
                      </span>
                    </div>
                    <span className="font-label-telemetry text-xs text-secondary font-bold">
                      OFICIAL · TIEMPO REAL
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 flex flex-col">
                      <label className="font-label-telemetry text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold" htmlFor="usd-calc-input">
                        Monto en Divisa (USD)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary font-bold text-base">$</span>
                        <input
                          id="usd-calc-input"
                          type="number"
                          step="1"
                          min="0"
                          value={calcUsd}
                          onChange={(e) => setCalcUsd(Number(e.target.value) || 0)}
                          className="w-full bg-transparent font-headline-sm text-lg text-on-surface focus:outline-none font-bold"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 flex flex-col justify-between">
                      <span className="font-label-telemetry text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        Total a Facturar en Bolívares
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="font-headline-sm text-xl text-secondary font-bold">
                          {(calcUsd * bcvRate).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="font-label-md text-xs text-on-surface-variant font-semibold">Bs.S</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-label-telemetry text-on-surface-variant">
                    <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>Sin recargos ocultos · Facturación fiscal SENIAT con máquina autorizada.</span>
                  </div>
                </div>
              </div>
            </section>

            {business.videoRoute && (
              <div id="videoruta-section" className="bg-gradient-to-b from-white to-slate-50 dark:from-[#131F33] dark:to-[#080E18] rounded-2xl border-2 border-[#FF6B4A]/50 p-6 sm:p-8 shadow-md dark:shadow-[0_0_35px_rgba(255,107,74,0.15)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#FF6B4A] text-white">
                        <Play className="w-4 h-4 fill-current" />
                      </span>
                      <h2 className="text-2xl font-black text-slate-950 dark:text-white">
                        Video-Ruta Vertical Interactiva
                      </h2>
                    </div>
                    <p className="text-xs text-[#FF6B4A] mt-1 font-bold">
                      Comercio Destacado · Recorrido paso a paso desde {business.videoRoute.originName}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E2D45] text-slate-900 dark:text-[#FFA384] text-xs font-bold border border-slate-200 dark:border-[#FFA384]/30 self-start sm:self-auto flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5 text-[#FF6B4A]" />
                    <span>Duración: {business.videoRoute.duration}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-slate-300 dark:border-[#1E2D45] shadow-xl mx-auto w-full max-w-[280px]">
                    {!isPlayingVideo ? (
                      <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                        <img
                          src={business.videoRoute.thumbnailUrl}
                          alt="Thumbnail video ruta"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-16 h-16 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,107,74,0.8)] group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 fill-current ml-1" />
                          </div>
                          <span className="text-xs font-bold text-white mt-4 drop-shadow">
                            Toca para reproducir Video-Ruta
                          </span>
                        </div>
                      </div>
                    ) : (
                      <video
                        src={business.videoRoute.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="md:col-span-7 space-y-4">
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
                      Hitos y Referencias Clave del Trayecto:
                    </h3>

                    <div className="space-y-3">
                      {business.videoRoute.milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveMilestone(idx)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer ${
                            activeMilestone === idx
                              ? 'bg-slate-100 dark:bg-[#1E2D45] border-[#FF6B4A] shadow-sm'
                              : 'bg-slate-50 dark:bg-[#080E18] border-slate-200 dark:border-[#1E2D45] hover:border-[#FF6B4A]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-950 dark:text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] flex items-center justify-center text-[10px] font-extrabold">
                                {idx + 1}
                              </span>
                              {milestone.title}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white dark:bg-[#080E18] text-[#008966] dark:text-[#00C292] font-mono font-bold text-[11px] border border-slate-200 dark:border-transparent">
                              {milestone.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-[#A0AEC0] pl-7">
                            {milestone.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#00C292]/10 border border-[#00C292]/30 flex items-center gap-3 text-xs text-[#008966] dark:text-[#00C292] font-semibold">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Ruta grabada en alta definición y auditada para fácil acceso vehicular y peatonal.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {business.gallery.length > 0 && (
              <div className="bg-white dark:bg-[#131F33] rounded-2xl border border-slate-200 dark:border-[#1E2D45] p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-950 dark:text-white">Galería de Instalaciones</h3>
                <div className="grid grid-cols-3 gap-3">
                  {business.gallery.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setCurrentGalleryImg(img)}
                      className="relative h-28 rounded-xl overflow-hidden cursor-pointer border border-slate-200 dark:border-[#1E2D45] hover:border-[#FF6B4A] transition-all"
                    >
                      <img src={img} alt="Foto local" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* ============================================================== */}
            {/* 3 TARJETAS EXCLUSIVAS DE RUTA, HORARIOS Y COMUNIDAD & REDES */}
            {/* ============================================================== */}
            <BusinessArrivalCards 
              business={business} 
              onOpenVideoRoute={() => {
                const videoEl = document.getElementById('videoruta-section');
                if (videoEl) {
                  videoEl.scrollIntoView({ behavior: 'smooth' });
                  setIsPlayingVideo(true);
                }
              }} 
            />

            {/* Mapa interactivo oficial de Cumaná con buscador y botón Abrir en Google Maps */}
            <CumanaMapCard business={business} />
          </div>
        </div>
      </div>
    </div>
  );
}
