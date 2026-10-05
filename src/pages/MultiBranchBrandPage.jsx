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
  Navigation,
  Scale,
  Award,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  WhatsAppIcon,
  CasheaIcon,
  InstagramIcon,
  TikTokIcon,
  TwitterIcon,
  FacebookIcon,
  YouTubeIcon,
} from '../components/SocialIcons';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

const buildSocialUrl = (platform, handle) => {
  if (!handle) return '#';
  const clean = handle.replace(/^@/, '').trim();
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${clean}`;
    case 'tiktok':
      return `https://tiktok.com/@${clean}`;
    case 'twitter':
      return `https://x.com/${clean}`;
    case 'facebook':
      return clean.startsWith('http') ? clean : `https://facebook.com/${clean}`;
    case 'youtube':
      return clean.startsWith('http') ? clean : `https://youtube.com/@${clean}`;
    default:
      return clean.startsWith('http') ? clean : `https://${clean}`;
  }
};

export default function MultiBranchBrandPage({
  business = {},
  onBack,
  onOpenPricing,
}) {
  const { isDark } = useTheme();
  const { toast } = useToast();

  const a = business || {};
  const instagram = a.instagram || (a.id === 'biz-econoquesos' ? '@econoplaza' : null);
  const tiktok = a.tiktok || (a.id === 'biz-econoquesos' ? '@econoquesos' : null);
  const twitter = a.twitter || (a.id === 'biz-econoquesos' ? '@econoquesos' : null);
  const facebook = a.facebook || (a.id === 'biz-econoquesos' ? 'econoquesoscumana' : null);
  const youtube = a.youtube || (a.id === 'biz-econoquesos' ? '@econoquesos' : null);

  const [copiedId, setCopiedId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState('branch-central');
  const [displayMode, setDisplayMode] = useState('tab'); // 'tab' | 'stack'
  const [modalFlyerUrl, setModalFlyerUrl] = useState(null);

  const branches = useMemo(() => {
    const defaultBranches = [
      {
        id: 'branch-central',
        number: '1',
        name: 'Sede Central — Blanco Fombona',
        shortName: 'Blanco Fombona',
        categoryTag: 'SEDE MATRIZ & ALMACÉN MAYORISTA',
        accentColor: 'amber',
        themeClasses: {
          badge: 'bg-amber-500 text-slate-950',
          badgeLight: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
          borderAccent: 'hover:border-amber-400/50',
          glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
        },
        headline: 'El ritmo vibrante del centro y el mayor surtido mayorista de Cumaná',
        humanStory:
          'Es el pulso tradicional del comercio cumanés. Aquí huele a queso fresco recién llegado de los llanos venezolanos y charcutería de primera categoría. Es la sede por excelencia donde los dueños de pizzerías, panaderías, restaurantes y familias de toda la ciudad compran sus quesos llaneros por pieza completa y bultos cerrados al mejor precio de distribución, con la atención cálida y rápida de charcuteros con años de experiencia.',
        quote:
          '«La sede donde Cumaná compra por pieza completa: pesaje exacto frente a tus ojos y despacho prioritario a comerciantes.»',
        photo: '/images/econoqueso-store.jpg',
        chips: ['🧀 Venta por Pieza & Bulto', '🏢 Aliado de Restaurantes', '💛 Cashea (1 a 12 Cuotas)'],
        address: 'Av. Blanco Fombona, cruce con Calle México (Sector Centro / Cascajal), Cumaná',
        reference: 'A 100 metros de la Av. Arismendi, en pleno centro comercial',
        scheduleWeek: 'Lunes a Sábado: 8:00 AM – 8:30 PM',
        scheduleSun: 'Domingo: 8:00 AM – 2:00 PM',
        openStatus: 'Abierto hoy hasta las 8:30 PM',
        phone: '+58 424-8881066',
        whatsapp: '584248881066',
        whatsappMessage:
          '¡Hola Econoquesos! Me comunico con la Sede Central (Blanco Fombona) desde CumanáConecta para consultar disponibilidad y precios al mayor.',
        googleMapsUrl: 'https://maps.google.com/?q=Av+Blanco+Fombona+Cumana+Sucre',
        highlights: [
          {
            icon: '🧀',
            title: 'Piezas Enteras & Bultos',
            desc: 'Queso llanero, guayanés y amarillo con precios de distribución continua.',
          },
          {
            icon: '👨‍🍳',
            title: 'Atención a Pizzerías',
            desc: 'Suministro constante para restaurantes y puestos de comida de la ciudad.',
          },
          {
            icon: '⚡',
            title: 'Múltiples Cajas de Cobro',
            desc: 'Balanzas calibradas y cajas rápidas para que nunca pierdas tiempo.',
          },
          {
            icon: '💛',
            title: 'Cashea Cotidiana',
            desc: 'Paga con Línea Cotidiana (2 cuotas para comida y supermercados).',
          },
        ],
      },
      {
        id: 'branch-cancamure',
        number: '2',
        name: 'Econoquesos Plaza — Av. Cancamure',
        shortName: 'Cancamure Plaza',
        categoryTag: 'HIPERMERCADO & FÁCIL ESTACIONAMIENTO',
        accentColor: 'emerald',
        themeClasses: {
          badge: 'bg-emerald-500 text-slate-950',
          badgeLight: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          borderAccent: 'hover:border-emerald-400/50',
          glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
        },
        headline: 'Tranquilidad, estacionamiento privado al frente y abastecimiento familiar',
        humanStory:
          'Diseñada para que comprar charcutería, quesos y víveres sea una experiencia cómoda y sin estrés. Olvídate de dar vueltas buscando dónde estacionar en el centro: aquí llegas en tu vehículo, aparcas seguro al frente de la tienda y caminas por pasillos amplios climatizados. La charcutería te la rebanamos en vivo según el grosor que te gusta, con neveras panorámicas y farmacia EQ Farma integrada en el mismo complejo.',
        quote:
          '«El punto preferido por las familias de Cancamure, El Brasil y Bebedero para comprar con calma y sin tráfico.»',
        photo: '/images/econoqueso-banner.jpg',
        chips: ['🚗 Estacionamiento al Frente', '🛒 Supermercado & EQ Farma', '🌙 Horario hasta 9:00 PM'],
        address: 'Av. Cancamure, frente al complejo comercial Cancamure, Cumaná',
        reference: 'Frente a la pasarela peatonal, al lado de Farmacia EQ Farma',
        scheduleWeek: 'Lunes a Sábado: 8:00 AM – 9:00 PM',
        scheduleSun: 'Domingo: 8:00 AM – 2:00 PM',
        openStatus: 'Abierto hoy hasta las 9:00 PM',
        phone: '+58 424-8881066',
        whatsapp: '584248881066',
        whatsappMessage:
          '¡Hola Econoquesos! Me comunico con Econoquesos Plaza (Av. Cancamure) desde CumanáConecta para consultar disponibilidad.',
        googleMapsUrl: 'https://maps.google.com/?q=Av+Cancamure+Cumana+Sucre',
        highlights: [
          {
            icon: '🚗',
            title: 'Estacionamiento Propio',
            desc: 'Parquea seguro y con sombra justo frente a las puertas del local.',
          },
          {
            icon: '🔪',
            title: 'Rebanado Fresco al Gusto',
            desc: 'Charcuteros que rebanan jamón y quesos al grosor exacto de tu gusto.',
          },
          {
            icon: '🛒',
            title: 'Víveres & Farmacia',
            desc: 'Despensa familiar completa y medicamentos con EQ Farma contigua.',
          },
          {
            icon: '🌙',
            title: 'Horario Extendido 9 PM',
            desc: 'Ideal para hacer compras nocturnas después de tu jornada de trabajo.',
          },
        ],
      },
      {
        id: 'branch-santarosa',
        number: '3',
        name: 'Sede Express — Av. Santa Rosa',
        shortName: 'Santa Rosa Express',
        categoryTag: 'FORMATO EXPRESS & COMPRAS AL PASO',
        accentColor: 'blue',
        themeClasses: {
          badge: 'bg-blue-500 text-white',
          badgeLight: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
          borderAccent: 'hover:border-blue-400/50',
          glow: 'from-blue-500/20 via-cyan-500/10 to-transparent',
        },
        headline: 'Rapidez sobre la avenida comercial para resolver el desayuno y la cena en minutos',
        humanStory:
          'Tu parada estratégica en pleno corredor comercial de Santa Rosa. Pensada para quienes van de regreso a casa o al trabajo y necesitan llevar los víveres frescos sin hacer largas filas. Un formato ágil donde pides tu queso llanero, jamón ahumado, salchichas y mantequilla, te pesan al instante y sales pagando con Cashea, Pago Móvil o Biopago en menos de lo que imaginas.',
        quote:
          '«Entras, pides y sales en minutos: la solución más rápida de Santa Rosa para llevar frescura a tu mesa.»',
        photo: '/images/econoqueso-flyer.jpg',
        chips: ['⚡ Despacho < 3 min', '🥪 Bandejas & Combos Diarios', '📍 Sobre la Avenida'],
        address: 'Av. Santa Rosa, esquina Calle Urdaneta, Cumaná',
        reference: 'Frente al eje comercial de Santa Rosa, zona de altísimo tránsito',
        scheduleWeek: 'Lunes a Sábado: 8:00 AM – 8:00 PM',
        scheduleSun: 'Domingo: 8:00 AM – 1:30 PM',
        openStatus: 'Abierto hoy hasta las 8:00 PM',
        phone: '+58 424-8881066',
        whatsapp: '584248881066',
        whatsappMessage:
          '¡Hola Econoquesos! Me comunico con la Sede Express (Santa Rosa) desde CumanáConecta para hacer una consulta rápida.',
        googleMapsUrl: 'https://maps.google.com/?q=Av+Santa+Rosa+Cumana+Sucre',
        highlights: [
          {
            icon: '⚡',
            title: 'Atención Ultra Rápida',
            desc: 'Formato express diseñado para compras de paso en menos de 3 minutos.',
          },
          {
            icon: '🥪',
            title: 'Combos para el Hogar',
            desc: 'Bandejas preparadas a diario listas para resolver desayuno y cena.',
          },
          {
            icon: '📍',
            title: 'Parada Cómoda de Paso',
            desc: 'Fácil acceso vehicular y peatonal sobre la avenida comercial.',
          },
          {
            icon: '💳',
            title: 'Cobro Inmediato',
            desc: 'Cashea activo, Punto de Venta, Biopago y Pago Móvil sin contratiempos.',
          },
        ],
      },
    ];

    if (Array.isArray(a.branches) && a.branches.length > 0) {
      return a.branches.map((t, idx) => {
        const r = defaultBranches[idx] || defaultBranches[0];
        return {
          ...r,
          ...t,
          id: t.id || r.id || `branch-${idx + 1}`,
          number: t.number || r.number || String(idx + 1),
          name: t.name || r.name,
          shortName: t.shortName || t.name || r.shortName,
          categoryTag: t.categoryTag || r.categoryTag,
          accentColor: t.accentColor || r.accentColor,
          themeClasses: t.themeClasses || r.themeClasses,
          headline: t.headline || r.headline,
          humanStory: t.humanStory || t.description || r.humanStory,
          quote: t.quote || r.quote,
          photo: t.photo || r.photo,
          chips: Array.isArray(t.chips) && t.chips.length > 0 ? t.chips : r.chips,
          address: t.address || r.address,
          reference: t.reference || r.reference,
          scheduleWeek: t.scheduleWeek || t.hours || r.scheduleWeek,
          scheduleSun: t.scheduleSun || r.scheduleSun,
          openStatus: t.openStatus || r.openStatus,
          phone: t.phone || r.phone,
          whatsapp: t.whatsapp || r.whatsapp,
          whatsappMessage: t.whatsappMessage || r.whatsappMessage,
          googleMapsUrl: t.googleMapsUrl || r.googleMapsUrl,
          highlights: Array.isArray(t.highlights) && t.highlights.length > 0 ? t.highlights : r.highlights,
        };
      });
    }
    return defaultBranches;
  }, [a.branches]);

  const selectedBranch = useMemo(
    () => branches.find((e) => e.id === selectedBranchId) || branches[0],
    [branches, selectedBranchId]
  );

  const otherBranches = useMemo(
    () => branches.filter((e) => e.id !== selectedBranch.id),
    [branches, selectedBranch.id]
  );

  const selectBranchAndScroll = (id) => {
    setSelectedBranchId(id);
    if (displayMode === 'stack') {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById('sede-viewer-container');
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight * 0.45) {
          const top = rect.top + window.pageYOffset - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  };

  const handleShare = () => {
    const slug = a.slug || 'econoquesos-cumana';
    const name = a.name || 'Econoquesos Cumaná';
    const url = typeof window !== 'undefined' ? `${window.location.origin}/marca/${slug}` : `https://cumanaconecta.com/marca/${slug}`;
    const text = `🧀 ¡Conoce las 3 sedes de ${name} en Cumaná! Mira lo que ofrece cada sucursal (Blanco Fombona, Cancamure y Santa Rosa), horarios y ubicaciones GPS en CumanáConecta:`;
    if (navigator.share) {
      navigator.share({ title: `${name} — 3 Sedes en CumanáConecta`, text, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${url}`);
      toast && toast.copy ? toast.copy('¡Enlace de la marca copiado al portapapeles!') : null;
    }
  };

  const buildWhatsApp = (phone, msg) => {
    const p = (phone || a.whatsapp || '584248881066').replace(/\D/g, '');
    const m = msg || `Hola ${a.name || 'Econoquesos'}, los contacto desde CumanáConecta.`;
    return `https://wa.me/${p}?text=${encodeURIComponent(m)}`;
  };

  const copyAddress = (id, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast && toast.copy ? toast.copy('¡Dirección copiada para GPS o taxi!') : null;
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const renderBranchCard = (e) => (
    <article
      key={e.id}
      id={e.id}
      className={`rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 relative ${
        isDark
          ? 'bg-[#12141b] border-[#252834] hover:border-amber-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'bg-white border-slate-200/90 hover:border-amber-400/60 shadow-[0_20px_50px_rgba(0,70,85,0.08)]'
      }`}
    >
      <div className="relative h-64 sm:h-72 md:h-84 w-full overflow-hidden bg-slate-950 group">
        <img
          src={e.photo}
          alt={`Instalaciones de ${e.name}`}
          className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141b] via-[#12141b]/60 to-black/30" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg">
              {e.number}
            </span>
            <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md bg-black/60 text-white border border-white/20 shadow-md">
              {e.categoryTag}
            </span>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{e.openStatus}</span>
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 z-10 text-white flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 drop-shadow">
              {e.categoryTag}
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-['Outfit'] drop-shadow-lg text-white">
              {e.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl font-medium drop-shadow-md">
              {e.headline}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
            {e.chips.map((chip, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md bg-white/15 text-white border border-white/20 shadow-sm"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1.5">
                <Sparkles size={15} />
                <span>La Experiencia en esta Sede</span>
              </h4>
              <p className={`text-sm sm:text-base leading-relaxed font-normal ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {e.humanStory}
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border italic text-xs sm:text-sm flex items-start gap-3 ${
                isDark ? 'bg-[#181a23] border-[#292d3b] text-slate-300' : 'bg-amber-50/60 border-amber-200/80 text-slate-800'
              }`}
            >
              <Star size={18} className="text-amber-500 flex-shrink-0 mt-0.5 fill-amber-500" />
              <p className="font-medium">{e.quote}</p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                <Star size={15} className="fill-amber-500" />
                <span>Lo que hace única a esta sucursal</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {e.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isDark
                        ? 'bg-[#181a23] border-[#272b38] hover:border-amber-400/40'
                        : 'bg-slate-50 border-slate-200/80 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-xl mb-1.5">{item.icon}</div>
                    <h5 className="font-extrabold text-xs sm:text-sm font-['Outfit']">{item.title}</h5>
                    <p className={`text-[11px] sm:text-xs mt-1 leading-snug ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className={`p-6 rounded-3xl border shadow-lg space-y-5 ${
                isDark
                  ? 'bg-[#181a24] border-[#2a2e3e]'
                  : 'bg-gradient-to-br from-slate-50 to-amber-50/30 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <Navigation size={15} />
                  <span>Cómo Llegar y Contacto</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {e.shortName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 block">
                  Dirección exacta en Cumaná:
                </span>
                <p className="text-xs sm:text-sm font-extrabold leading-snug">{e.address}</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <strong>Referencia:</strong> {e.reference}
                </p>
                <button
                  type="button"
                  onClick={() => copyAddress(e.id, `${e.address} (${e.reference})`)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 hover:underline pt-1 cursor-pointer"
                >
                  {copiedId === e.id ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      <span className="text-emerald-500">¡Dirección copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copiar dirección para taxi o mapa</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                  <Clock size={13} className="text-amber-500" />
                  <span>Horario de atención presencial:</span>
                </span>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold">{e.scheduleWeek}</p>
                  <p className="font-medium opacity-80">{e.scheduleSun}</p>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                  <Phone size={13} className="text-amber-500" />
                  <span>Línea de atención:</span>
                </span>
                <a
                  href={`tel:${e.phone.replace(/\s+/g, '')}`}
                  className="text-xs sm:text-sm font-bold text-amber-500 hover:underline block"
                >
                  {e.phone}
                </a>
              </div>

              <div className="pt-3 space-y-2.5">
                <a
                  href={buildWhatsApp(e.whatsapp, e.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-md transition hover:opacity-90 active:scale-98"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <WhatsAppIcon size={17} />
                  <span>Escribir al WhatsApp de {e.shortName}</span>
                </a>
                <a
                  href={e.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full h-11 px-4 rounded-xl font-bold text-xs sm:text-sm border flex items-center justify-center gap-2 transition active:scale-98 ${
                    isDark
                      ? 'bg-[#1e212c] border-[#34384a] hover:bg-[#282c3c] text-slate-200'
                      : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <MapPin size={15} className="text-amber-500" />
                  <span>Cómo Llegar (Google Maps GPS)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-['Inter'] ${
        isDark ? 'bg-[#0c0d10] text-slate-100' : 'bg-[#f4f6f9] text-[#191c1e]'
      }`}
    >
      {/* Header Sticky */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
          isDark ? 'bg-[#12141a]/95 border-[#222530]' : 'bg-white/95 border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-[#181a22] border-[#2c303d] text-slate-200 hover:bg-[#222532]'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            <ArrowLeft size={16} />
            <span>Volver al Directorio</span>
          </button>
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <Store size={13} />
              <span>Cadena Oficial • 3 Sedes en Cumaná</span>
            </span>
            <ThemeToggle />
            <button
              type="button"
              onClick={handleShare}
              className={`p-2.5 rounded-xl border transition cursor-pointer active:scale-95 ${
                isDark
                  ? 'bg-[#181a22] border-[#2c303d] text-slate-300 hover:bg-[#222532]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Compartir página de la marca"
              aria-label="Compartir"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Brand Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-950">
          <img
            src={a.bannerUrl || '/images/econoqueso-banner.jpg'}
            alt={`Portada de ${a.name || 'Econoquesos Cumaná'}`}
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-[#0c0d10]/70 to-black/30" />
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-24 sm:-mt-32 relative z-10">
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl ${
              isDark
                ? 'bg-[#14161e]/98 border-[#262a37] text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
                : 'bg-white/98 border-slate-200 text-slate-900 shadow-[0_25px_60px_rgba(0,70,85,0.08)]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-3xl sm:text-4xl shadow-xl flex-shrink-0 border-2 border-white/20">
                  {a.logoUrl || '🧀'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                      {a.heroCategoryBadge || 'CADENA COMERCIAL VIP'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      <CheckCircle2 size={13} />
                      {a.heroVerifiedText || 'Verificado en Cumaná'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star size={13} className="fill-amber-500 text-amber-500" />
                      {a.heroRatingText || '4.9 (640+ opiniones)'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-['Outfit']">
                    {a.name || 'Econoquesos Cumaná'}
                  </h1>
                  <p
                    className={`text-sm sm:text-base font-medium mt-1 max-w-2xl leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {a.heroNarrative ||
                      a.description ||
                      'La gran referencia de charcutería, quesos al mayor y detal y víveres para toda Cumaná. 3 sucursales modernas conectadas para ofrecerte frescura diaria, los mejores precios de la ciudad y pago en cuotas con Cashea.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
                <a
                  href={buildWhatsApp(
                    a.whatsapp,
                    'Hola Econoquesos, los contacto desde la guía CumanáConecta para hacer una consulta general sobre sus sedes.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition hover:opacity-90 active:scale-98"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <WhatsAppIcon size={18} />
                  <span>WhatsApp de Atención General</span>
                </a>
                <div className="flex items-center justify-center gap-3 text-xs font-semibold opacity-75">
                  <span className="flex items-center gap-1">
                    <Truck size={14} className="text-emerald-500" />
                    Delivery en Cumaná
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Store size={14} className="text-amber-500" />
                    3 Sedes Físicas
                  </span>
                </div>
              </div>
            </div>

            {/* Payment methods row */}
            <div
              className={`mt-6 pt-5 border-t flex flex-wrap items-center gap-2 ${
                isDark ? 'border-[#232735]' : 'border-slate-100'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 mr-1">
                Aceptado en las 3 sedes:
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-black rounded-lg bg-[#FFE600] text-slate-950 border border-amber-300 shadow-2xs">
                <CasheaIcon size={14} />
                <span>{a.casheaHeroBadge || 'Cashea Activo (Línea Cotidiana)'}</span>
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  isDark ? 'bg-[#1a1d26] border-[#2e3343] text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                Pago Móvil
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  isDark ? 'bg-[#1a1d26] border-[#2e3343] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                Punto de Venta / Biopago
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  isDark ? 'bg-[#1a1d26] border-[#2e3343] text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                Divisas USD / Efectivo
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                  isDark ? 'bg-[#1a1d26] border-[#2e3343] text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                Binance Pay
              </span>
            </div>

            {/* Social channels row */}
            {(instagram || tiktok || twitter || facebook || youtube) && (
              <div
                className={`mt-4 pt-4 border-t ${
                  isDark ? 'border-[#232735]' : 'border-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Star size={13} className="text-amber-500 fill-amber-500" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Redes Sociales y Canales Oficiales:
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden md:inline">
                    Conéctate y consulta promociones directamente con el comercio
                  </span>
                </div>

                <div className="flex sm:grid sm:grid-cols-5 gap-2.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x w-full">
                  {instagram && (
                    <a
                      href={buildSocialUrl('instagram', instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Instagram oficial de ${a.name || 'la marca'}: ${instagram}`}
                      className={`group flex-shrink-0 min-w-[155px] sm:min-w-0 sm:w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-2xs ${
                        isDark
                          ? 'bg-gradient-to-br from-pink-950/40 via-purple-950/25 to-amber-950/20 border-pink-500/35 text-pink-200 hover:border-pink-400 hover:shadow-[0_4px_18px_rgba(220,39,67,0.3)]'
                          : 'bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50/60 border-pink-200 hover:border-pink-400 text-pink-900 hover:shadow-[0_4px_18px_rgba(220,39,67,0.2)]'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xs group-hover:rotate-6 transition-transform">
                        <InstagramIcon size={14} className="text-white fill-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-pink-700 dark:text-pink-300">Instagram</span>
                          <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{instagram}</p>
                      </div>
                    </a>
                  )}

                  {tiktok && (
                    <a
                      href={buildSocialUrl('tiktok', tiktok)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`TikTok oficial de ${a.name || 'la marca'}: ${tiktok}`}
                      className={`group flex-shrink-0 min-w-[155px] sm:min-w-0 sm:w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-2xs ${
                        isDark
                          ? 'bg-[#06181d] border-cyan-400/50 hover:border-cyan-400 text-cyan-200 hover:shadow-[0_4px_18px_rgba(0,242,254,0.3)]'
                          : 'bg-[#e6fcff] border-cyan-400/60 hover:border-cyan-500 text-teal-950 hover:shadow-[0_4px_18px_rgba(0,242,254,0.35)]'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-[#00f2fe] via-teal-900 to-[#fe2c55] text-white shadow-xs group-hover:rotate-6 transition-transform p-[1.5px]">
                        <span className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                          <TikTokIcon size={13} className="text-white fill-white" />
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-teal-700 dark:text-cyan-300">TikTok</span>
                          <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{tiktok}</p>
                      </div>
                    </a>
                  )}

                  {twitter && (
                    <a
                      href={buildSocialUrl('twitter', twitter)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`X (Twitter) oficial de ${a.name || 'la marca'}: ${twitter}`}
                      className={`group flex-shrink-0 min-w-[155px] sm:min-w-0 sm:w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-2xs ${
                        isDark
                          ? 'bg-[#0a0a0f] border-slate-700/80 hover:border-slate-400 text-white hover:shadow-[0_4px_18px_rgba(255,255,255,0.12)]'
                          : 'bg-slate-900 hover:bg-black border-slate-800 text-white hover:shadow-[0_4px_18px_rgba(0,0,0,0.3)]'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-black border border-slate-600 text-white shadow-xs group-hover:rotate-6 transition-transform">
                        <TwitterIcon size={12} className="text-white fill-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-white">X (Twitter)</span>
                          <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity text-slate-300" />
                        </div>
                        <p className="text-[11px] font-semibold text-slate-300 truncate">{twitter}</p>
                      </div>
                    </a>
                  )}

                  {facebook && (
                    <a
                      href={buildSocialUrl('facebook', facebook)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Facebook oficial de ${a.name || 'la marca'}`}
                      className={`group flex-shrink-0 min-w-[155px] sm:min-w-0 sm:w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-2xs ${
                        isDark
                          ? 'bg-blue-950/30 border-blue-500/35 hover:border-blue-400 text-blue-200 hover:shadow-[0_4px_18px_rgba(24,119,242,0.3)]'
                          : 'bg-blue-50/90 border-blue-200 hover:border-blue-400 text-blue-900 hover:shadow-[0_4px_18px_rgba(24,119,242,0.25)]'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#1877f2] text-white shadow-xs group-hover:rotate-6 transition-transform">
                        <FacebookIcon size={13} className="text-white fill-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-blue-600 dark:text-blue-400">Facebook</span>
                          <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{facebook}</p>
                      </div>
                    </a>
                  )}

                  {youtube && (
                    <a
                      href={buildSocialUrl('youtube', youtube)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`YouTube oficial de ${a.name || 'la marca'}`}
                      className={`group flex-shrink-0 min-w-[155px] sm:min-w-0 sm:w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-2xs ${
                        isDark
                          ? 'bg-red-950/30 border-red-500/35 hover:border-red-400 text-red-200 hover:shadow-[0_4px_18px_rgba(255,0,0,0.3)]'
                          : 'bg-red-50/90 border-red-200 hover:border-red-400 text-red-900 hover:shadow-[0_4px_18px_rgba(255,0,0,0.25)]'
                      }`}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#ff0000] text-white shadow-xs group-hover:rotate-6 transition-transform">
                        <YouTubeIcon size={13} className="text-white fill-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-black text-red-600 dark:text-red-400">YouTube</span>
                          <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{youtube}</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sede Switcher & Viewer */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-500 mb-1">
              <Store size={14} />
              <span>Presencia Física en Cumaná</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              Las {branches.length} Sedes de {a.name || 'Econoquesos Cumaná'}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Cada sucursal cuenta con su propia dinámica, ubicación estratégica y atención personalizada.
            </p>
          </div>

          {/* Toggle buttons: Sede en Pantalla vs Ver las 3 Juntas */}
          <div
            className={`flex items-center p-1 rounded-2xl border flex-shrink-0 ${
              isDark ? 'bg-[#14161f] border-[#252834]' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setDisplayMode('tab')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'tab'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store size={14} />
              <span>Sede en Pantalla</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('stack')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'stack'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>Ver las {branches.length} Juntas</span>
            </button>
          </div>
        </div>

        {/* Tab pills */}
        {displayMode === 'tab' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {branches.map((b) => {
              const active = b.id === selectedBranch.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => selectBranchAndScroll(b.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden active:scale-98 ${
                    active
                      ? isDark
                        ? 'bg-[#181a24] border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                        : 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : isDark
                      ? 'bg-[#12141c] border-[#252834] hover:border-slate-600 opacity-70 hover:opacity-100'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        active ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {b.number}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                      {active ? 'ACTIVA' : 'SELECCIONAR'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm font-['Outfit'] truncate">{b.shortName}</h4>
                  <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {b.address}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <div id="sede-viewer-container">
          {displayMode === 'tab' ? (
            <div className="space-y-12">
              {renderBranchCard(selectedBranch)}

              {/* Other Branches quick strip */}
              {otherBranches.length > 0 && (
                <div
                  className={`p-6 sm:p-8 rounded-3xl border ${
                    isDark ? 'bg-[#13151c] border-[#222530]' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <h4 className="text-base sm:text-lg font-extrabold font-['Outfit']">
                        Otras sedes de {a.name || 'Econoquesos'} en Cumaná:
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Haz clic en cualquiera para explorarla en pantalla
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherBranches.map((other) => (
                      <div
                        key={other.id}
                        onClick={() => selectBranchAndScroll(other.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group active:scale-98 ${
                          isDark
                            ? 'bg-[#181a24] border-[#2a2e3e] hover:border-amber-400/50'
                            : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-amber-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={other.photo}
                            alt={other.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                              {other.categoryTag}
                            </span>
                            <h5 className="font-extrabold text-sm truncate font-['Outfit']">{other.name}</h5>
                            <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {other.address}
                            </p>
                          </div>
                        </div>
                        <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition flex-shrink-0">
                          <ChevronRight size={16} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {branches.map((b) => renderBranchCard(b))}
            </div>
          )}
        </div>
      </section>

      {/* 4 Pillars / Value Propositions */}
      <section className="max-w-6xl mx-auto px-4 py-8 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all hover:border-amber-400/40 ${
              isDark ? 'bg-[#15171e] border-[#252834]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-3 text-lg">
                {a.benefit1Icon || '🧀'}
              </div>
              <h3 className="font-extrabold text-sm sm:text-base font-['Outfit'] mb-1 text-slate-900 dark:text-white">
                {a.benefit1Title || 'Frescura Diaria Garantizada'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {a.benefit1Desc ||
                  'Quesos llaneros, semiduros, guayanés y amarillos seleccionados en fincas para asegurar máxima frescura y sabor.'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-amber-500">
              {a.benefit1Badge || '✓ Rotación diaria de inventario'}
            </div>
          </div>

          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all hover:border-amber-400/40 ${
              isDark ? 'bg-[#15171e] border-[#252834]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-yellow-400/20 text-slate-900 flex items-center justify-center mb-3">
                <CasheaIcon size={20} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base font-['Outfit'] mb-1 text-slate-900 dark:text-white">
                {a.casheaCardTitle || 'Cashea en las 3 Sedes'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {a.casheaCardDesc ||
                  'Disponible en nuestras 3 sucursales de Cumaná bajo la modalidad Línea Cotidiana: inicial en caja y 2 cuotas quincenales sin interés.'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-amber-500">
              {a.casheaCardBadge || '✓ Aceptado en las 3 sedes'}
            </div>
          </div>

          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all hover:border-amber-400/40 ${
              isDark ? 'bg-[#15171e] border-[#252834]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mb-3 text-lg">
                <Scale size={20} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base font-['Outfit'] mb-1 text-slate-900 dark:text-white">
                {a.benefit3Title || 'Pesaje Exacto Certificado'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {a.benefit3Desc ||
                  'Básculas digitales calibradas a la vista del cliente. Pides la cantidad exacta que necesitas para tu presupuesto.'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-amber-500">
              {a.benefit3Badge || '✓ Transparencia en mostrador'}
            </div>
          </div>

          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all hover:border-amber-400/40 ${
              isDark ? 'bg-[#15171e] border-[#252834]' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center mb-3">
                <Truck size={20} />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base font-['Outfit'] mb-1 text-slate-900 dark:text-white">
                {a.benefit4Title || 'Delivery en Toda Cumaná'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {a.benefit4Desc ||
                  'Servicio a domicilio rápido para hogares, pizzerías y negocios en los principales sectores de la ciudad.'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-amber-500">
              {a.benefit4Badge || '✓ Despacho prioritario'}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Promo Flyer section */}
      <section className="max-w-6xl mx-auto px-4 py-8 mb-8">
        <div className="p-1 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-2xl">
          <div
            className={`rounded-[22px] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 ${
              isDark ? 'bg-[#14161d]' : 'bg-white'
            }`}
          >
            <div
              onClick={() => setModalFlyerUrl(a.weeklyFlyerUrl || '/images/econoqueso-flyer.jpg')}
              className="relative w-full lg:w-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer flex-shrink-0"
            >
              <img
                src={a.weeklyFlyerUrl || '/images/econoqueso-flyer.jpg'}
                alt={a.weeklyFlyerTitle || 'Flyer promocional semanal de Econoquesos Cumaná'}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-2xs">
                <span>🔍 Clic para ampliar afiche oficial</span>
              </div>
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 shadow-md">
                {a.weeklyFlyerTag || 'AFICHE SEMANAL'}
              </span>
            </div>

            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <Star size={14} className="fill-amber-500" />
                <span>{a.weeklyFlyerBadge || 'CAMPAÑA ACTIVA EN LAS 3 SUCURSALES'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
                {a.weeklyFlyerTitle || 'Promociones Semanales & Combos Charcuteros'}
              </h2>
              <p
                className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {a.weeklyFlyerDesc ||
                  'Aprovecha las ofertas vigentes en quesos, jamones, tocineta, mantequilla y embutidos en nuestras sedes de Blanco Fombona, Cancamure y Santa Rosa. Consulta disponibilidad o realiza tu pedido express por WhatsApp.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
                  <CheckCircle2 size={14} />
                  <span>{a.weeklyFlyerPill1 || 'Precios al Mayor y Detal'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  <CasheaIcon size={14} />
                  <span>{a.weeklyFlyerPill2 || 'Págalo con Cashea'}</span>
                </span>
              </div>

              <div className="pt-2">
                <a
                  href={buildWhatsApp(
                    a.whatsapp,
                    a.weeklyFlyerWhatsappMsg ||
                      '¡Hola Econoquesos! Quiero consultar la disponibilidad del afiche promocional de la semana que vi en CumanáConecta.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition hover:opacity-90 active:scale-98"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  <WhatsAppIcon size={18} />
                  <span>Consultar Promoción por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for other chains & franchises */}
      <section className="max-w-6xl mx-auto px-4 py-8 mb-12">
        <div
          className={`p-8 sm:p-10 rounded-3xl border text-center relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-r from-[#171a22] to-[#1e222d] border-[#313645]'
              : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border-amber-200'
          }`}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950">
              <Store size={13} />
              CUMANÁCONECTA PARA CADENAS Y FRANQUICIAS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              ¿Tienes una empresa o franquicia multisede en Cumaná?
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Presenta todas tus sucursales con mapas independientes, enlaces directos a WhatsApp, afiches promocionales y conexión con Cashea.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenPricing}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition active:scale-98 shadow-md cursor-pointer"
              >
                Publicar Mi Franquicia
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenPricing={onOpenPricing} />

      {/* Modal Zoom for Weekly Flyer */}
      {modalFlyerUrl && (
        <div
          onClick={() => setModalFlyerUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl cursor-default"
          >
            <button
              type="button"
              onClick={() => setModalFlyerUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center z-10 hover:bg-black cursor-pointer"
            >
              ✕
            </button>
            <img
              src={modalFlyerUrl}
              alt="Flyer publicitario ampliado"
              className="w-full h-auto object-contain max-h-[85vh]"
            />
            <div className="p-4 bg-slate-900 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-white">
                {a.name || 'Econoquesos Cumaná'} — Campaña en Tiendas
              </span>
              <a
                href={buildWhatsApp(
                  a.whatsapp,
                  'Hola Econoquesos, vi este afiche en CumanáConecta y deseo consultar en qué sede está disponible.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
