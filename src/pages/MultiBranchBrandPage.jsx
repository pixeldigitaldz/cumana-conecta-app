import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Share2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Store,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  Tag,
  Copy,
  Check,
  Flame,
  Truck,
  Layers,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { WhatsAppIcon, CasheaIcon } from '../components/SocialIcons';
import Footer from '../components/Footer';

export default function MultiBranchBrandPage({
  business = {},
  onBack,
  onOpenPricing,
}) {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);

  const b = business || {};
  const branches = useMemo(() => {
    if (Array.isArray(b.branches) && b.branches.length > 0) {
      return b.branches;
    }
    return [
      {
        id: 'branch-central',
        name: 'Sede Central — Blanco Fombona',
        shortName: 'Blanco Fombona',
        shortZone: 'Centro / Cascajal',
        tag: 'SEDE PRINCIPAL',
        address: 'Av. Blanco Fombona, cruce con Calle México (Sector Centro / Cascajal), Cumaná',
        reference: 'A 100 metros de la Av. Arismendi, pleno centro comercial',
        zone: 'Sector Centro',
        phone: '+58 424-8881066',
        whatsapp: '584248881066',
        whatsappMessage: '¡Hola Econoquesos! Me comunico con la Sede Central (Blanco Fombona) desde CumanáConecta para consultar disponibilidad y precios.',
        schedule: 'Lunes a Sábado: 8:00 AM - 8:30 PM | Domingo: 8:00 AM - 2:00 PM',
        openStatusText: 'Abierto hoy hasta las 8:30 PM',
        googleMapsUrl: 'https://maps.google.com/?q=Av+Blanco+Fombona+Cumana+Sucre',
        photo: '/images/econoqueso-store.jpg',
        features: [
          'Charcutería al Mayor y Detal',
          'Ventas por Pieza y Bulto',
          'Cajas de Pago Rápido',
          'Cashea Activo en 3 Cuotas',
          'Atención Especial a Restaurantes',
        ],
      },
      {
        id: 'branch-cancamure',
        name: 'Econoquesos Plaza — Av. Cancamure',
        shortName: 'Econoquesos Plaza',
        shortZone: 'Cancamure / El Brasil',
        tag: 'HIPERMERCADO & EQ FARMA',
        address: 'Av. Cancamure, frente al complejo comercial Cancamure, Cumaná',
        reference: 'Al lado de Farmacia EQ Farma, sector El Brasil / Cancamure',
        zone: 'Cantarrana',
        phone: '+58 424-8881066',
        whatsapp: '584248881066',
        whatsappMessage: '¡Hola Econoquesos! Me comunico con Econoquesos Plaza (Av. Cancamure) desde CumanáConecta para hacer una compra con delivery.',
        schedule: 'Lunes a Sábado: 8:00 AM - 9:00 PM | Domingo: 8:00 AM - 2:00 PM',
        openStatusText: 'Abierto hoy hasta las 9:00 PM',
        googleMapsUrl: 'https://maps.google.com/?q=Av+Cancamure+Cumana+Sucre',
        photo: '/images/econoqueso-banner.jpg',
        features: [
          'Supermercado y Víveres Completos',
          'Farmacia EQ Farma Integrada',
          'Amplio Estacionamiento Privado',
          'Neveras de Lácteos Gigantes',
          'Cashea y Todos los Métodos de Pago',
        ],
      },
      {
        id: 'branch-santarosa',
        name: 'Sede Express — Santa Rosa',
        shortName: 'Sede Express',
        shortZone: 'Santa Rosa / Urdaneta',
        tag: 'FORMATO EXPRESS',
        address: 'Av. Santa Rosa, esquina Calle Urdaneta, Cumaná',
        reference: 'Frente al eje comercial de Santa Rosa',
        zone: 'Sector Centro',
        phone: '+58 424-8881066',
        whatsapp: '584248881066',
        whatsappMessage: '¡Hola Econoquesos! Me comunico con la Sede Express (Santa Rosa) desde CumanáConecta para consultar pedidos rápidos.',
        schedule: 'Lunes a Sábado: 8:00 AM - 8:00 PM | Domingo: 8:00 AM - 1:30 PM',
        openStatusText: 'Abierto hoy hasta las 8:00 PM',
        googleMapsUrl: 'https://maps.google.com/?q=Av+Santa+Rosa+Cumana+Sucre',
        photo: '/images/econoqueso-flyer.jpg',
        features: [
          'Compras Rápidas de Paso',
          'Charcutería Fresca Diaria',
          'Punto de Venta & Pago Móvil',
          'Cashea Inmediato',
          'Despacho al Instante',
        ],
      },
    ];
  }, [b.branches]);

  const [activeBranchId, setActiveBranchId] = useState(branches[0]?.id || 'branch-central');
  const activeBranch = useMemo(
    () => branches.find((item) => item.id === activeBranchId) || branches[0],
    [branches, activeBranchId]
  );

  const flyers = b.promotionalFlyers || [];
  const products = b.products || [];

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    toast?.success ? toast.success('Enlace de la cadena copiado') : null;
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `🧀 ¡Conoce las 3 sedes de ${b.name || 'Econoquesos Cumaná'} en Cumaná!\nBlanco Fombona, Cancamure y Santa Rosa.\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Inter'] transition-colors duration-300 ${
        isDark ? 'bg-[#0f1115] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* ── Barra Superior de Navegación ── */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
          isDark
            ? 'bg-[#12141a]/90 border-slate-800'
            : 'bg-white/90 border-slate-200 shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Volver al Directorio</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copiar enlace"
              className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isDark
                  ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {copiedLink ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
              <span className="hidden sm:inline">{copiedLink ? '¡Copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-2 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Compartir</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Principal de la Marca Multi-Sede ── */}
      <section className="relative overflow-hidden border-b border-amber-500/20">
        <div className="absolute inset-0 z-0">
          <img
            src={b.bannerUrl || '/images/econoqueso-banner.jpg'}
            alt={b.name}
            className="w-full h-full object-cover filter brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              {/* Badges superiores */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md uppercase tracking-wider">
                  <Sparkles size={13} className="fill-slate-950" />
                  <span>CADENA MULTI-SEDE ({branches.length} SUCURSALES)</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span>Verificado Oficial</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFE600] text-slate-950 shadow-xs">
                  <CasheaIcon className="w-3.5 h-3.5 text-slate-950" />
                  <span>Cashea Cotidiana y Cuotas</span>
                </span>
              </div>

              {/* Título & Slogan */}
              <div>
                <h1 className="font-['Outfit'] font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                  {b.name || 'Econoquesos Cumaná'}
                </h1>
                <p className="font-['Outfit'] text-amber-300 text-sm sm:text-base font-semibold mt-1">
                  "{b.spotlightTagline || 'Calidad, frescura y los mejores precios en charcutería, quesos y víveres para toda Cumaná'}"
                </p>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-['Inter']">
                {b.description}
              </p>

              {/* Indicadores de valoración y sedes */}
              <div className="flex items-center gap-6 pt-2 flex-wrap text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white text-sm">{b.rating || '4.9'}</span>
                  <span className="text-slate-400">({b.reviewCount || 640} opiniones en Cumaná)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Store size={15} className="text-amber-400" />
                  <span className="font-semibold text-white">3 Sedes activas en Cumaná</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={15} className="text-teal-400" />
                  <span className="font-semibold text-teal-300">Delivery disponible</span>
                </div>
              </div>
            </div>

            {/* Tarjeta Cashea Destacada */}
            <div className="w-full md:w-80 p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-[#1e1c18] to-amber-950/40 border border-amber-400/40 shadow-xl space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                  Modalidad Cashea
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#FFE600] text-slate-950">
                  Línea Cotidiana
                </span>
              </div>
              <h4 className="font-['Outfit'] font-black text-white text-base leading-snug">
                Paga en cualquiera de las 3 sedes con Cashea
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compra charcutería, quesos llaneros y víveres con inicial mínima y cuotas quincenales sin interés a tasa BCV.
              </p>
              <div className="pt-1">
                <a
                  href={`https://wa.me/584248881066?text=${encodeURIComponent(
                    '¡Hola Econoquesos! Quiero consultar cómo pagar mis compras con Cashea en sus sedes.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                >
                  <WhatsAppIcon className="w-4 h-4 text-slate-950" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido Principal con Sedes y Catálogo ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12 flex-1">
        {/* ── SECCIÓN 1: Selector y Visor de Sucursales ── */}
        <section id="sedes" className="space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <Store size={20} className="text-amber-500" />
                <h2 className="font-['Outfit'] font-black text-2xl sm:text-3xl tracking-tight">
                  Sucursales Físicas en Cumaná
                </h2>
              </div>
              <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Selecciona una sede para ver su dirección exacta, horarios de guardia y contacto directo por WhatsApp.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              3 Ubicaciones Estratégicas
            </span>
          </div>

          {/* Botones de Selección de Sede */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {branches.map((branch, idx) => {
              const isSelected = branch.id === activeBranch.id;
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setActiveBranchId(branch.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs ${
                    isSelected
                      ? isDark
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                        : 'bg-amber-50 border-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                      : isDark
                      ? 'bg-[#181a20] border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : isDark
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      SEDE 0{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Abierta
                    </span>
                  </div>

                  <div>
                    <h3 className="font-['Outfit'] font-extrabold text-base leading-snug">
                      {branch.shortName || branch.name}
                    </h3>
                    <p className="text-xs opacity-75 mt-0.5 line-clamp-1">{branch.shortZone || branch.zone}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ficha Detallada de la Sede Seleccionada */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBranch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isDark ? 'bg-[#16181f] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md h-[260px] sm:h-[320px] bg-slate-900">
                <img
                  src={activeBranch.photo || '/images/econoqueso-store.jpg'}
                  alt={activeBranch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  {activeBranch.tag || 'SUCURSAL OFICIAL'}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                      {activeBranch.zone}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-emerald-500 font-semibold">{activeBranch.openStatusText}</span>
                  </div>
                  <h3 className="font-['Outfit'] font-black text-2xl sm:text-3xl leading-tight">
                    {activeBranch.name}
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{activeBranch.address}</p>
                      {activeBranch.reference && (
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Ref: {activeBranch.reference}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">{activeBranch.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="font-semibold">{activeBranch.phone}</p>
                  </div>
                </div>

                {/* Características destacadas de la sede */}
                {Array.isArray(activeBranch.features) && (
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Servicios en esta sede
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeBranch.features.map((feat, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                            isDark
                              ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                              : 'bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botones de acción directa */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://wa.me/${activeBranch.whatsapp}?text=${encodeURIComponent(
                      activeBranch.whatsappMessage || '¡Hola! Me comunico desde CumanáConecta.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>Contactar Sede por WhatsApp</span>
                  </a>

                  {activeBranch.googleMapsUrl && (
                    <a
                      href={activeBranch.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                        isDark
                          ? 'border-slate-700 hover:bg-slate-800 text-slate-200'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <MapPin size={15} className="text-amber-500" />
                      <span>Cómo Llegar (Google Maps)</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── SECCIÓN 2: Afiches Semanales & Venta Mayorista ── */}
        {flyers.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Flame size={22} className="text-rose-500" />
              <div>
                <h2 className="font-['Outfit'] font-black text-2xl sm:text-3xl tracking-tight">
                  Afiches & Promociones de la Semana
                </h2>
                <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Válidos en las 3 sedes de Cumaná: Blanco Fombona, Cancamure y Santa Rosa.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flyers.map((flyer) => (
                <div
                  key={flyer.id}
                  className={`rounded-3xl border overflow-hidden shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                    isDark ? 'bg-[#16181f] border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
                    <img
                      src={flyer.image || '/images/econoqueso-flyer.jpg'}
                      alt={flyer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full shadow-md uppercase">
                      {flyer.badge}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Outfit'] font-black text-lg sm:text-xl leading-snug">
                        {flyer.title}
                      </h3>
                      <p className="text-xs text-amber-500 font-bold mt-0.5">{flyer.subtitle}</p>
                      <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {flyer.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-700/40 flex items-center justify-between gap-3 flex-wrap">
                      <span className="font-['Outfit'] font-extrabold text-sm sm:text-base text-amber-400">
                        {flyer.price}
                      </span>
                      <a
                        href={`https://wa.me/584248881066?text=${encodeURIComponent(flyer.ctaMessage || flyer.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                        <span>{flyer.buttonText || 'Pedir por WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SECCIÓN 3: Catálogo de Productos y Precios en Mostrador ── */}
        {products.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-amber-500" />
                <div>
                  <h2 className="font-['Outfit'] font-black text-2xl sm:text-3xl tracking-tight">
                    Catálogo de Charcutería & Quesos
                  </h2>
                  <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Precios referenciales en mostrador disponibles en las 3 sedes (Acepta Cashea y Pago Móvil).
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-2xs hover:shadow-md ${
                    isDark ? 'bg-[#181a20] border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-900">
                    <img
                      src={prod.photo || '/images/econoqueso-banner.jpg'}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    {prod.tag && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded shadow-xs uppercase">
                        {prod.tag}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-['Outfit'] font-bold text-sm leading-snug line-clamp-2">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-700/20">
                    <div>
                      <span className="text-[11px] text-slate-400 uppercase">Precio</span>
                      <p className="font-['Outfit'] font-black text-base text-amber-500">
                        ${prod.price.toFixed(2)} <span className="text-xs font-normal text-slate-400">/ {prod.unit}</span>
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/584248881066?text=${encodeURIComponent(
                        `Hola Econoquesos, deseo consultar disponibilidad de: ${prod.name}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-600/15 hover:bg-emerald-600 text-emerald-500 hover:text-white transition cursor-pointer"
                      title="Consultar por WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-current" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer onOpenEmergency={() => {}} onOpenPricing={onOpenPricing} />
    </div>
  );
}
