import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Clock,
  Tag,
  ArrowRight,
  MessageCircle,
  Map,
  CreditCard,
  Smartphone,
  DollarSign,
  ShoppingBag,
  Store,
  Sparkles,
  ShieldCheck,
  Check,
  Navigation,
  ExternalLink,
  Share2,
  CheckCircle2,
  Copy,
  Crown,
  Download,
  Film,
  Video,
  Play,
  Phone,
  PhoneCall,
  Award,
  QrCode,
  Printer,
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  buildWhatsAppUrl,
  isBusinessOpen,
  getBusinessExtendedDetails,
  getYoutubeEmbedUrl,
  formatSocialUrl,
} from '../data/mockBusinessData';
import { updatePageSEO, generateBusinessShareText, getBusinessShareUrl } from '../utils/seoHelpers';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import CasheaCalculatorWidget from './CasheaCalculatorWidget';
import BusinessLocationMap from './BusinessLocationMap';
import BusinessShareSection from './BusinessShareSection';
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
  GlobeIcon,
  PhoneIcon,
  CasheaIcon,
} from './SocialIcons';
import adminStore from '../store/adminStore';

/** Hook para detectar viewport móvil de forma reactiva */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (e) => setIsMobile(e.matches);

    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    } else {
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    }
  }, [breakpoint]);

  return isMobile;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const modalVariants = {
  hidden: (isMobile) => ({
    opacity: isMobile ? 0 : 0,
    y: isMobile ? '100%' : 0,
    scale: isMobile ? 1 : 0.94,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 28,
      stiffness: 320,
      mass: 0.85,
    },
  },
  exit: (isMobile) => ({
    opacity: 0,
    y: isMobile ? '100%' : 0,
    scale: isMobile ? 1 : 0.94,
    transition: {
      duration: isMobile ? 0.28 : 0.18,
      ease: [0.32, 0.72, 0, 1],
    },
  }),
};

/**
 * Modal de Detalle de Comercio — Diseño Horizontal de Ancho Completo
 * Soporta animaciones fluidas con motion.div (slide móvil / scale desktop) y Modo Claro/Oscuro.
 */
export default function BusinessDetailModal({ business, onClose }) {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile(640);
  const [activePhotoState, setActivePhotoState] = useState({ businessId: business?.id, index: 0 });
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Determinar índice de foto activa derivado de forma limpia
  const selectedPhotoIndex = activePhotoState.businessId === business?.id ? activePhotoState.index : 0;
  const setSelectedPhotoIndex = (idx) => setActivePhotoState({ businessId: business?.id, index: idx });

  // Cierre con tecla Escape y bloqueo de scroll
  useEffect(() => {
    if (!business) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [business, onClose]);

  // Construir URL precisa y corta del comercio para el QR
  const businessName = business?.name || '';
  const businessQrUrl = getBusinessShareUrl(business);

  // Generación reactiva del código QR en alta definición
  useEffect(() => {
    if (business && businessName) {
      QRCode.toDataURL(businessQrUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#004655',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR code:', err));
    }
  }, [business, businessName, businessQrUrl]);

  // Sincronización dinámica de SEO, Open Graph y Schema.org en el navegador
  useEffect(() => {
    if (business) {
      updatePageSEO(business);
    }
    return () => {
      updatePageSEO(null);
    };
  }, [business]);

  if (!business) return null;

  const {
    name,
    rif,
    categoryLabel,
    isFeatured,
    isVerified: _isVerified,
    isOpen24h,
    schedule = {},
    zone,
    address,
    googleMapsUrl,
    whatsapp,
    phone,
    instagram,
    tiktok,
    youtube,
    facebook,
    website,
    videoTourUrl,
    videoTourTitle,
    paymentMethods = [],
    activePromotion,
    bannerUrl,
    photos = [],
    logoUrl,
    description,
  } = business;

  const isOpen = isBusinessOpen(business);
  const waUrl = buildWhatsAppUrl(whatsapp, name, activePromotion);
  const extendedDetails = getBusinessExtendedDetails(business);

  // Configuración de Cashea y productos de muestra para la calculadora
  const adminSettings = adminStore.getSettings();
  const sampleProducts = extendedDetails?.featuredProducts?.flatMap(g => g.items || []) || [];
  const showCasheaWidget = (paymentMethods || []).includes('cashea') &&
                           adminSettings.casheaCalculatorEnabled !== false &&
                           business.showCasheaCalculator !== false;

  // URLs normalizadas de redes sociales y canales digitales
  const igUrl = formatSocialUrl('instagram', instagram);
  const tiktokUrl = formatSocialUrl('tiktok', tiktok);
  const youtubeUrl = formatSocialUrl('youtube', youtube);
  const fbUrl = formatSocialUrl('facebook', facebook);
  const webUrl = website ? (website.startsWith('http') ? website : `https://${website}`) : null;
  const youtubeEmbedUrl = getYoutubeEmbedUrl(videoTourUrl);

  // Galería completa de fotos (usar fotos del mock o banner principal)
  const galleryPhotos = photos && photos.length > 0 ? photos : [bannerUrl];
  const activeBanner = galleryPhotos[selectedPhotoIndex] || bannerUrl;

  // Horarios formateados
  const scheduleEntries = Object.entries(schedule).length > 0
    ? Object.entries(schedule)
    : [
        ['Lunes - Viernes', isOpen24h ? '24 Horas' : '7:00 AM - 8:00 PM'],
        ['Sábado', isOpen24h ? '24 Horas' : '8:00 AM - 9:00 PM'],
        ['Domingo', isOpen24h ? '24 Horas' : '8:00 AM - 2:00 PM'],
      ];

  const handleShare = async () => {
    const shareUrl = getBusinessShareUrl(business);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name} — CumanáConecta`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
    }
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.copy(`¡Enlace copiado! ${shareUrl}`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `cumana-conecta-${name.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Código QR de ${name} descargado.`);
  };

  const handlePrintStandee = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Cartel de Mostrador — ${name} (CumanáConecta)</title>
        <style>
          @page { size: portrait; margin: 15mm; }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 90vh;
            background: #f8fafc;
            color: #0f172a;
          }
          .standee-card {
            width: 100%;
            max-width: 480px;
            background: #ffffff;
            border: 3px solid #005f73;
            border-radius: 24px;
            padding: 32px 28px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .brand-header {
            display: inline-block;
            background: #005f73;
            color: #ffffff;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
            padding: 6px 18px;
            border-radius: 999px;
            margin-bottom: 20px;
          }
          .biz-name {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            margin: 0 0 6px 0;
            line-height: 1.2;
          }
          .biz-meta {
            font-size: 13px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 24px;
          }
          .qr-wrapper {
            background: #f1f5f9;
            border: 2px dashed #94a3b8;
            border-radius: 20px;
            padding: 20px;
            display: inline-block;
            margin-bottom: 20px;
          }
          .qr-img {
            width: 240px;
            height: 240px;
            display: block;
            margin: 0 auto;
          }
          .instructions {
            font-size: 14px;
            color: #334155;
            font-weight: 600;
            line-height: 1.5;
            margin: 0 0 20px 0;
          }
          .badges-row {
            display: flex;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
          }
          .badge {
            font-size: 11px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 8px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            color: #334155;
          }
          .badge-cashea {
            background: #FFE600;
            color: #000;
            border-color: #facc15;
            font-weight: 900;
          }
          .footer-note {
            margin-top: 20px;
            font-size: 11px;
            color: #94a3b8;
          }
        </style>
      </head>
      <body>
        <div class="standee-card">
          <div class="brand-header">CumanáConecta • Guía Oficial</div>
          <h1 class="biz-name">${name}</h1>
          <div class="biz-meta">📍 ${zone || 'Cumaná'} • ${categoryLabel || 'Comercio Local'}</div>
          
          <div class="qr-wrapper">
            <img src="${qrDataUrl}" alt="Código QR de ${name}" class="qr-img" />
          </div>

          <p class="instructions">
            📱 <strong>Escanea este código con tu celular</strong><br/>
            para ver nuestro catálogo completo, promociones, formas de pago y contactarnos directamente.
          </p>

          <div class="badges-row">
            <span class="badge">🛡️ Comercio Verificado</span>
            ${paymentMethods.includes('cashea') ? '<span class="badge badge-cashea">🟰 Acepta Cashea</span>' : ''}
            <span class="badge">🛵 Cumaná, Edo. Sucre</span>
          </div>

          <div class="footer-note">Directorio Comercial y de Servicios de Cumaná</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleRecommendWhatsApp = () => {
    const text = encodeURIComponent(generateBusinessShareText(business));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    const shareUrl = getBusinessShareUrl(business);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      toast.copy(`Enlace directo de ${name} copiado al portapapeles.`);
    } catch {
      toast.error('No se pudo copiar el enlace');
    }
  };

  // Promociones derivadas
  const promo1 = activePromotion
    ? {
        tag: 'PROMOCIÓN DESTACADA',
        tagColor: isDark ? '#f59e0b' : '#006e70',
        title: activePromotion,
        desc: `Aprovecha esta promoción exclusiva de ${name} para los usuarios de CumanáConecta.`,
      }
    : {
        tag: 'DESCUENTO ESPECIAL',
        tagColor: isDark ? '#f59e0b' : '#006e70',
        title: 'Menciona CumanáConecta y recibe atención prioritaria',
        desc: 'Presenta tu consulta a través de nuestro botón directo de WhatsApp para agilizar tu pedido.',
      };

  const promo2 = paymentMethods.includes('cashea')
    ? {
        isCashea: true,
        tag: 'PAGO EN CUOTAS CASHEA',
        tagColor: '#FFE600',
        title: 'Compra hoy y paga después con Cashea en Cumaná',
        desc: 'Llévate tus productos en cuotas sin interés en este comercio afiliado.',
      }
    : {
        isCashea: false,
        tag: 'PAGO INMEDIATO',
        tagColor: isDark ? '#38bdf8' : '#004655',
        title: 'Pago Móvil & Efectivo Zelle',
        desc: 'Múltiples métodos de pago rápido para tu comodidad.',
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-business-name"
    >
      {/* Backdrop oscuro con fade suave */}
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Contenedor Principal del Modal — Ancho Completo Horizontal */}
      <motion.div
        custom={isMobile}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`relative w-full max-w-5xl rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] sm:max-h-[94vh] flex flex-col overflow-y-auto custom-scrollbar border z-10 transition-colors duration-300 ${
          isDark
            ? 'bg-[#18191d] border-[#2b2d35] text-slate-100'
            : 'bg-[#f7f9fb] border-[#bfc8cc] text-slate-800'
        }`}
      >
        {/* Indicador táctil superior para móviles */}
        <div className="sm:hidden w-12 h-1.5 bg-white/40 rounded-full mx-auto my-2 absolute top-2 left-1/2 -translate-x-1/2 z-40 pointer-events-none" />

        {/* Controles Flotantes: Código QR + Compartir + Cerrar */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {/* Botón flotante Código QR */}
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="h-10 px-3.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20 text-xs font-semibold font-['Inter']"
            aria-label="Generar código QR del comercio"
            title="Código QR / Imprimir Standee"
          >
            <QrCode size={15} className="text-amber-400" />
            <span className="hidden sm:inline">Código QR</span>
          </button>

          {/* Botón flotante Compartir */}
          <button
            type="button"
            onClick={handleShare}
            className="h-10 px-3.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/20 text-xs font-semibold font-['Inter']"
            aria-label="Compartir este comercio"
            title="Compartir"
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold">¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 size={15} />
                <span className="hidden sm:inline">Compartir</span>
              </>
            )}
          </button>

          {/* Botón Flotante de Cerrar */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ─── 1. Hero Image Principal (Fotografía Superior de Ancho Total) ─── */}
        <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] flex-shrink-0 bg-slate-950 overflow-hidden group">
          <img
            key={activeBanner}
            src={activeBanner}
            alt={`${name} en Cumaná`}
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40 pointer-events-none" />

          {/* Badges Superiores sobre la Fotografía */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#191c1e]/90 backdrop-blur-md text-white border border-white/20 font-['Inter'] font-bold text-xs rounded-full flex items-center gap-1.5 shadow-md">
              <ShieldCheck size={14} className="text-[#86f0f3]" />
              <span>Comercio Verificado</span>
            </span>
            {isFeatured && (
              <span className="px-3.5 py-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-['Outfit'] font-black text-xs rounded-full flex items-center gap-1.5 shadow-lg">
                <Crown size={13} className="fill-slate-950" />
                <span>SOCIO VIP OFICIAL • PLATINUM</span>
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full font-['Inter'] font-bold text-xs flex items-center gap-1.5 shadow-md backdrop-blur-md border ${
                isOpen
                  ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-950/85 text-rose-300 border-rose-500/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span>{isOpen ? 'Abierto Ahora' : 'Cerrado'}</span>
            </span>
          </div>

          {/* Galería de Miniaturas de Fotos (Esquina Inferior Izquierda) */}
          {galleryPhotos.length > 1 && (
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 sm:gap-2.5 p-1.5 rounded-2xl bg-black/55 backdrop-blur-md border border-white/20 shadow-xl">
              {galleryPhotos.map((photo, idx) => {
                const isActive = idx === selectedPhotoIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'border-2 border-[#008b8b] ring-2 ring-[#006e70]/60 scale-105 shadow-md'
                        : 'border-2 border-white/60 hover:border-white opacity-75 hover:opacity-100 hover:scale-102'
                    }`}
                    aria-label={`Ver foto ${idx + 1} de ${name}`}
                  >
                    <img
                      src={photo}
                      alt={`Miniatura ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Badge de RIF Fiscal (Esquina Inferior Derecha Abajo) */}
          {rif && (
            <div className="absolute bottom-4 right-4 z-20 animate-fade-in">
              <div
                title={`Registro de Información Fiscal: ${rif}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black/95 text-white backdrop-blur-md border border-white/25 shadow-xl transition-all font-['Inter'] select-all"
              >
                <span className="text-amber-400 font-extrabold text-[11px] tracking-wider uppercase">
                  RIF:
                </span>
                <span className="text-slate-100 font-mono text-xs font-semibold">
                  {rif}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ─── 2. Contenedor de Información Horizontal (Abarca el 100% de Ancho) ─── */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 w-full max-w-full">
          
          {/* ─── A. Tarjeta de Cabecera Horizontal a lo Largo ─── */}
          <div
            className={`w-full p-6 sm:p-8 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in-up stagger-1 ${
              isDark
                ? 'bg-[#121316] border-[#282a32]'
                : 'bg-white border-[#bfc8cc]'
            }`}
          >
            <div className="space-y-2.5 flex-1 w-full">
              {/* Badges de Categoría y Zona */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 font-['Inter'] font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5 border ${
                  isDark
                    ? 'bg-[#0f3c30]/90 text-[#34d399] border-[#059669]/40'
                    : 'bg-[#006e70]/10 text-[#005f73] border-[#006e70]/30'
                }`}>
                  <ShieldCheck size={14} className={isDark ? 'text-emerald-400' : 'text-[#006e70]'} />
                  Comercio Verificado
                </span>

                {isFeatured && (
                  <span
                    className="px-3.5 py-1 text-slate-950 font-['Outfit'] font-black text-xs uppercase tracking-wider rounded-full shadow-md flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
                  >
                    <Crown size={13} className="fill-slate-950" />
                    <span>MEMBRESÍA VIP DESTACADA</span>
                  </span>
                )}

                <span
                  className={`font-['Inter'] text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                    isDark
                      ? 'bg-[#1e2026] text-slate-200 border-[#2d3039]'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <MapPin size={13} className={isDark ? 'text-amber-400' : 'text-[#006e70]'} />
                  {zone}
                </span>

                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  isDark ? 'bg-[#22242c] text-amber-400' : 'bg-slate-50 text-slate-500'
                }`}>
                  {categoryLabel}
                </span>

                {rif && (
                  <span
                    title={`Registro de Información Fiscal: ${rif}`}
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border shadow-2xs ${
                      isDark
                        ? 'bg-[#1e2026] text-slate-200 border-[#2d3039]'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-amber-500 font-black text-[10px]">RIF:</span>
                    <span>{rif}</span>
                  </span>
                )}
              </div>

              {/* Nombre del Comercio */}
              <h1
                id="modal-business-name"
                className={`font-['Outfit'] font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {name}
              </h1>

              {/* Descripción a lo Largo */}
              <p className={`font-['Inter'] text-sm sm:text-base leading-relaxed w-full pt-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {description}
              </p>
            </div>

            {/* Acciones Rápidas & Isotipo */}
            <div className={`flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 w-full md:w-auto flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 ${
              isDark ? 'border-[#282a32]' : 'border-slate-100'
            }`}>
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 border shadow-2xs transition-transform hover:scale-105 overflow-hidden ${
                  isDark ? 'bg-[#22242c] border-[#323640]' : 'bg-[#f2f4f6] border-[#bfc8cc]'
                }`}
              >
                {logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) ? (
                  <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
                ) : logoUrl ? (
                  logoUrl
                ) : (
                  <Store size={36} className={isDark ? 'text-amber-400' : 'text-[#004655]'} />
                )}
              </div>

              {/* Indicador de compartido */}
              {copied && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl animate-fade-in">
                  <CheckCircle2 size={14} />
                  <span>¡Enlace copiado!</span>
                </div>
              )}
            </div>
          </div>

          {/* ─── Banner de Cadena Multi-Sede Oficial ─── */}
          {business?.isMultiBranch && (
            <div className={`w-full p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm transition-all animate-fade-in-up stagger-1 ${
              isDark
                ? 'bg-gradient-to-r from-amber-950/40 via-[#1e1c18] to-amber-950/20 border-amber-400/40 text-amber-200'
                : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 border-amber-300 text-slate-900'
            }`}>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-md flex-shrink-0 overflow-hidden">
                  {business.logoUrl && (business.logoUrl.startsWith('http') || business.logoUrl.startsWith('/')) ? (
                    <img src={business.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    business.logoUrl || <Store size={22} className="text-slate-950" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-400 text-slate-950">CADENA MULTI-SEDE</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {business.branchCount || business.branches?.length || 3} Sedes Físicas en Cumaná
                    </span>
                  </div>
                  <h4 className="font-['Outfit'] font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Conoce las 3 sucursales, afiche semanal y precios en mostrador
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Sede Central (Blanco Fombona), Plaza (Cancamure) y Express (Santa Rosa). Acepta Cashea Línea Cotidiana.
                  </p>
                </div>
              </div>
              <a
                href={`/cadena/${business.slug || 'econoquesos-cumana'}`}
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  window.history.pushState(null, '', `/marca/${business.slug || 'econoquesos-cumana'}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition self-stretch sm:self-auto justify-center flex-shrink-0 cursor-pointer"
              >
                <span>Ver las 3 Sedes & Afiche</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* ─── Sello de Garantía y Auditoría Oficial para Comercios VIP ─── */}
          {isFeatured && (
            <div className={`w-full p-4 sm:p-5 rounded-2xl border flex items-center gap-4 animate-fade-in-up stagger-1 ${
              isDark
                ? 'bg-gradient-to-r from-[#201c12] via-[#16171a] to-[#141518] border-amber-500/40 shadow-[0_4px_20px_rgba(245,158,11,0.12)]'
                : 'bg-gradient-to-r from-amber-50/90 via-yellow-50/40 to-white border-amber-300 shadow-sm'
            }`}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
                <Award size={22} className="stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-['Outfit'] font-black text-sm leading-snug flex items-center gap-1.5 ${
                  isDark ? 'text-amber-300' : 'text-amber-950'
                }`}>
                  <span>Establecimiento Certificado & Auditado por CumanáConecta</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">OFICIAL</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed font-['Inter']">
                  Este comercio cuenta con suscripción activa verificada, ubicación física corroborada en Cumaná y canal directo de atención prioritaria al cliente.
                </p>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-wider border border-amber-400/40 flex-shrink-0">
                Garantía VIP
              </span>
            </div>
          )}

          {/* ─── Banner Interactivo: ¿Quieres recomendar este negocio? (Exacto a Maqueta) ─── */}
          <div
            className={`w-full p-3.5 sm:p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 sm:gap-4 transition-all shadow-xs animate-fade-in-up stagger-1 ${
              isDark
                ? 'bg-[#102227] border-teal-900/60 text-slate-100'
                : 'bg-[#e8f7f5] border-[#9fe0d6] text-slate-900'
            }`}
          >
            {/* Lado Izquierdo: Icono + Título y Subtítulo */}
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-[#005f73] text-white flex-shrink-0 shadow-sm">
                <Share2 size={20} className="stroke-[2.3]" />
              </div>
              <div className="min-w-0">
                <h3 className={`font-['Outfit'] font-bold text-sm sm:text-base leading-tight ${
                  isDark ? 'text-teal-200' : 'text-[#004655]'
                }`}>
                  ¿Quieres recomendar este negocio?
                </h3>
                <p className={`font-['Inter'] text-xs sm:text-[12.5px] mt-0.5 leading-snug ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Envía este perfil con dirección, teléfonos y promociones por WhatsApp o redes sociales.
                </p>
              </div>
            </div>

            {/* Lado Derecho: Botones de Acción (Código QR, Compartir, WhatsApp, Copiar Enlace) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-start md:justify-end flex-shrink-0">
              {/* 1. Generar Código QR / Imprimir */}
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className={`h-9 px-3.5 rounded-xl font-['Inter'] font-bold text-xs flex items-center gap-1.5 transition-all border shadow-2xs cursor-pointer active:scale-95 ${
                  isDark
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                    : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                }`}
                title="Generar código QR para imprimir en mostrador"
              >
                <QrCode size={14} className="text-amber-500 flex-shrink-0" />
                <span>Código QR / Imprimir</span>
              </button>

              {/* 2. Compartir */}
              <button
                type="button"
                onClick={handleShare}
                className="h-9 px-3.5 rounded-xl bg-[#005f73] hover:bg-[#004655] active:scale-95 text-white font-['Inter'] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Compartir este perfil"
              >
                <Share2 size={14} />
                <span>Compartir</span>
              </button>

              {/* 2. Recomendar por WhatsApp */}
              <button
                type="button"
                onClick={handleRecommendWhatsApp}
                className="h-9 px-3.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 text-white font-['Inter'] font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Recomendar por WhatsApp"
              >
                <WhatsAppIcon size={15} className="flex-shrink-0" />
                <span>WhatsApp</span>
              </button>

              {/* 3. Copiar Enlace */}
              <button
                type="button"
                onClick={handleCopyLink}
                className={`h-9 px-3.5 rounded-xl font-['Inter'] font-semibold text-xs flex items-center gap-1.5 transition-all border shadow-2xs cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isDark
                    ? 'bg-[#181a20] hover:bg-[#232732] border-[#2f333f] text-slate-200'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                }`}
                title="Copiar enlace directo"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-white" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-slate-500 dark:text-slate-400" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─── Conexión Multicanal: Redes Sociales & Contacto Directo ─── */}
          <section className={`w-full p-4 sm:p-5 rounded-2xl border flex flex-col gap-3.5 shadow-2xs animate-fade-in-up stagger-1 ${
            isDark ? 'bg-[#14161b] border-[#252830]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-xs font-extrabold uppercase tracking-wider font-['Outfit'] flex items-center gap-1.5 ${
                isDark ? 'text-amber-400' : 'text-[#005f73]'
              }`}>
                <span>Canales Digitales & Redes Oficiales</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Conexión directa en 1 toque
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {/* WhatsApp Directo */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/40 hover:bg-[#22c55e]/25 text-[#16a34a] dark:text-[#4ade80] transition active:scale-95 text-xs font-bold"
              >
                <WhatsAppIcon size={16} className="flex-shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>

              {/* Instagram */}
              {igUrl ? (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 transition active:scale-95 text-xs font-bold"
                >
                  <InstagramIcon size={16} className="flex-shrink-0" />
                  <span className="truncate">{instagram || 'Instagram'}</span>
                </a>
              ) : (
                <div className={`flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl border opacity-50 text-xs text-slate-400 ${
                  isDark ? 'bg-[#18191d] border-[#282a32]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <InstagramIcon size={16} className="flex-shrink-0" />
                  <span className="truncate">Instagram N/D</span>
                </div>
              )}

              {/* TikTok */}
              {tiktokUrl ? (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-slate-500/10 border border-slate-500/30 hover:bg-slate-500/20 text-slate-800 dark:text-slate-200 transition active:scale-95 text-xs font-bold"
                >
                  <TikTokIcon size={16} className="flex-shrink-0" />
                  <span className="truncate">{tiktok || 'TikTok'}</span>
                </a>
              ) : (
                <div className={`flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl border opacity-50 text-xs text-slate-400 ${
                  isDark ? 'bg-[#18191d] border-[#282a32]' : 'bg-slate-50 border-slate-200'
                }`}>
                  <TikTokIcon size={16} className="flex-shrink-0" />
                  <span className="truncate">TikTok N/D</span>
                </div>
              )}

              {/* YouTube */}
              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition active:scale-95 text-xs font-bold"
                >
                  <YouTubeIcon size={16} className="flex-shrink-0" />
                  <span className="truncate">YouTube</span>
                </a>
              )}

              {/* Facebook */}
              {fbUrl && (
                <a
                  href={fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-blue-600/10 border border-blue-600/30 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 transition active:scale-95 text-xs font-bold"
                >
                  <FacebookIcon size={16} className="flex-shrink-0" />
                  <span className="truncate">Facebook</span>
                </a>
              )}

              {/* Sitio Web / Catálogo */}
              {webUrl && (
                <a
                  href={webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 transition active:scale-95 text-xs font-bold"
                >
                  <GlobeIcon size={16} className="flex-shrink-0" />
                  <span className="truncate">Sitio Web</span>
                </a>
              )}

              {/* Teléfono Directo */}
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center sm:justify-start gap-2 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition active:scale-95 text-xs font-bold"
                >
                  <PhoneIcon size={15} className="flex-shrink-0" />
                  <span className="truncate">{phone}</span>
                </a>
              )}
            </div>
          </section>

          {/* ─── B. Barra Horizontal de Información Rápida (4 Columnas a lo Largo) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full animate-fade-in-up stagger-2">
            
            {/* 1. Estado y Horario Hoy */}
            <div className={`p-4 rounded-xl border shadow-2xs flex items-start gap-3 ${
              isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isDark ? 'bg-[#0f3c30] text-[#34d399]' : 'bg-teal-50 text-[#006e70]'
              }`}>
                <Clock size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-['Inter']">
                  Horario Hoy
                </span>
                <span className={`text-xs font-bold ${isOpen ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isOpen ? 'Abierto' : 'Cerrado'}
                </span>
                <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isOpen24h ? 'Servicio 24 Horas' : scheduleEntries[0]?.[1] || '7:00 AM - 8:00 PM'}
                </p>
              </div>
            </div>

            {/* 2. Ubicación y Zona */}
            <div className={`p-4 rounded-xl border shadow-2xs flex items-start gap-3 ${
              isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isDark ? 'bg-[#1e293b] text-sky-400' : 'bg-sky-50 text-sky-700'
              }`}>
                <MapPin size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-['Inter']">
                  Zona en Cumaná
                </span>
                <span className={`text-xs font-bold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {zone}
                </span>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {address}
                </p>
              </div>
            </div>

            {/* 3. Pagos Aceptados */}
            <div className={`p-4 rounded-xl border shadow-2xs flex items-start gap-3 ${
              isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isDark ? 'bg-[#221d14] text-amber-400' : 'bg-amber-50 text-amber-700'
              }`}>
                <CreditCard size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-['Inter']">
                  Métodos de Pago
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {paymentMethods.includes('cashea') && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FFE600] text-slate-950 border border-amber-300 inline-flex items-center gap-1.5 shadow-2xs">
                      <img src="/images/cashea-icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                      <span>Cashea</span>
                    </span>
                  )}
                  {paymentMethods.includes('pago_movil') && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-[#1e2026] text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Pago Móvil
                    </span>
                  )}
                  {paymentMethods.includes('usd_cash') && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-[#0f3c30] text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      USD / Zelle
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Contacto Directo */}
            <div className={`p-4 rounded-xl border shadow-2xs flex items-start gap-3 ${
              isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isDark ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
              }`}>
                <WhatsAppIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-['Inter']">
                  WhatsApp Directo
                </span>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-bold block truncate mt-0.5 hover:underline ${
                    isDark ? 'text-emerald-400' : 'text-[#006e70]'
                  }`}
                >
                  +{whatsapp || '58 414-0000000'}
                </a>
                <span className="text-[11px] text-slate-400">Respuesta rápida</span>
              </div>
            </div>

          </div>

          {/* ─── C. Sección: Aspectos Destacados (A lo Largo) ─── */}
          {extendedDetails?.highlights?.length > 0 && (
            <section className={`w-full border rounded-2xl p-5 sm:p-6 shadow-2xs animate-fade-in-up stagger-2 ${
              isDark
                ? 'bg-[#121316] border-[#282a32]'
                : 'bg-[#f0fdfa]/80 border-[#006e70]/25'
            }`}>
              <div className={`flex items-center gap-2 font-['Outfit'] font-bold text-xs sm:text-sm tracking-wider uppercase mb-3.5 ${
                isDark ? 'text-amber-400' : 'text-[#006e70]'
              }`}>
                <ShieldCheck size={18} />
                <span>Aspectos Destacados y Ventajas</span>
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 font-['Inter'] text-xs sm:text-sm ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                {extendedDetails.highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check size={16} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-[#006e70]'}`} />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── D. Sección: Productos, Servicios & Especialidades (A lo Largo) ─── */}
          {extendedDetails?.featuredProducts?.length > 0 && (
            <section className="w-full space-y-4 animate-fade-in-up stagger-2">
              <div className={`flex items-center justify-between pb-1 border-b ${
                isDark ? 'border-[#252830]' : 'border-slate-200'
              }`}>
                <h3 className={`font-['Outfit'] font-bold text-base sm:text-lg flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  <ShoppingBag size={19} className={isDark ? 'text-amber-400' : 'text-[#006e70]'} />
                  <span>Productos, Servicios & Especialidades</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {extendedDetails.featuredProducts.length} categorías disponibles
                </span>
              </div>

              {/* Grilla balanceada horizontal a lo largo del modal */}
              <div className={`grid grid-cols-1 ${extendedDetails.featuredProducts.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-5 w-full`}>
                {extendedDetails.featuredProducts.map((group, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-5 sm:p-6 shadow-2xs transition-colors w-full ${
                      isDark
                        ? 'bg-[#121316] border-[#282a32] hover:border-amber-400/40'
                        : 'bg-white border-slate-200/90 hover:border-[#006e70]/40'
                    }`}
                  >
                    <h4 className={`font-['Outfit'] font-bold text-base sm:text-lg mb-3.5 pb-2 border-b flex items-center justify-between ${
                      isDark ? 'text-white border-[#252830]' : 'text-slate-900 border-slate-100'
                    }`}>
                      <span>{group.title}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        isDark
                          ? 'bg-[#221f15] text-amber-400 border-[#45371c]'
                          : 'text-[#006e70] bg-[#f0fdfa] border-[#ccfbf1]'
                      }`}>
                        {group.items.length} opciones
                      </span>
                    </h4>
                    <ul className={`space-y-3 font-['Inter'] text-xs sm:text-sm ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {group.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                            isDark ? 'bg-amber-400' : 'bg-[#006e70]'
                          }`} />
                          <span className="leading-relaxed">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─── E. Sección: Ubicación en Cumaná con Mapa Interactivo ─── */}
          <div className="w-full animate-fade-in-up stagger-3">
            <BusinessLocationMap business={business} />
          </div>

          {/* ─── F. Sección: Compartir Ficha del Comercio (Telegram, X, Copiar) ─── */}
          <div className="w-full animate-fade-in-up stagger-3">
            <BusinessShareSection business={business} isOpen={isOpen} />
          </div>

          {/* ─── Sección: Video Guía "¿Cómo Llegar?" (Fachada, Ruta y Referencias) ─── */}
          <section className={`w-full rounded-2xl border p-5 sm:p-6 flex flex-col gap-4 shadow-2xs animate-fade-in-up stagger-3 ${
            isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/20 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                  <Film size={18} className="fill-slate-950" />
                </div>
                <div>
                  <h3 className={`font-['Outfit'] font-bold text-base sm:text-lg flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    <span>Video Guía: ¿Cómo Llegar a {name}?</span>
                    {videoTourUrl && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                        Shorts / Reel
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-['Inter']">
                    {videoTourTitle || `Recorrido visual, fachada real y referencias urbanas en ${zone}, Cumaná.`}
                  </p>
                </div>
              </div>

              {videoTourUrl && (
                <a
                  href={videoTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 underline underline-offset-4"
                >
                  <span>Abrir en pantalla completa</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            {videoTourUrl && youtubeEmbedUrl ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-video sm:aspect-21/9 rounded-2xl overflow-hidden bg-black border border-slate-700/40 shadow-lg">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={`Video Guía de ${name} en Cumaná`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-['Inter'] px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Video oficial verificado en locación (Cumaná, Sucre)</span>
                  </span>
                  <span>📍 {zone}</span>
                </div>
              </div>
            ) : videoTourUrl ? (
              <div className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 ${
                isDark ? 'bg-[#18191d] border-[#2b2d35]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-xs">
                  <Play size={26} className="fill-amber-400 ml-1" />
                </div>
                <div>
                  <h4 className="font-['Outfit'] font-bold text-sm text-slate-100">
                    Video disponible en TikTok / Instagram Reels
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mt-1 font-['Inter']">
                    Mira el recorrido paso a paso de cómo llegar a {name} directamente en la plataforma del comercio.
                  </p>
                </div>
                <a
                  href={videoTourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Play size={14} className="fill-slate-950" />
                  <span>Ver Video Guía en App Externa</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ) : (
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'bg-[#18191d] border-[#252830]' : 'bg-amber-50/50 border-amber-200/70'
              }`}>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0 text-xl font-bold">
                    📹
                  </div>
                  <div>
                    <h4 className={`font-['Outfit'] font-bold text-sm ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      ¿Eres el dueño de {name}?
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-['Inter']">
                      Contrata el <strong>Plan VIP Portada</strong> de CumanáConecta y produciremos el Video Guía para que todos los cumaneses ubiquen tu fachada y ruta fácilmente.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const waText = encodeURIComponent(
                      `¡Hola CumanáConecta! 🌊 Soy el dueño de *${name}* y deseo solicitar la grabación del *Video Guía Cómo Llegar* con el Plan VIP Portada.`
                    );
                    window.open(`https://wa.me/584120000000?text=${waText}`, '_blank');
                  }}
                  className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 flex-shrink-0 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>Solicitar Video Guía VIP</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </section>

          {/* ─── F. Sección: Promociones & Beneficios Activos (A lo Largo) ─── */}
          <section className="w-full space-y-4 animate-fade-in-up stagger-3">
            <div className={`flex items-center justify-between pb-1 border-b ${
              isDark ? 'border-[#252830]' : 'border-slate-200'
            }`}>
              <h2
                className={`font-['Outfit'] font-bold text-lg sm:text-xl flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <Tag size={20} className={isDark ? 'text-amber-400' : 'text-[#004655]'} />
                <span>Promociones & Beneficios Activos</span>
              </h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                isDark ? 'bg-[#2a1417] text-[#fb7185] border-[#4c1d24]' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                Ofertas CumanáConecta
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Promo 1 */}
              <div
                className={`border rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group w-full ${
                  isDark
                    ? 'bg-[#121316] border-[#282a32] hover:border-amber-400/60'
                    : 'bg-white border-[#bfc8cc] hover:border-[#004655]'
                }`}
                onClick={() => window.open(waUrl, '_blank')}
              >
                <div>
                  <div
                    className="text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: promo1.tagColor }}
                  >
                    {promo1.tag}
                  </div>
                  <h3
                    className={`font-['Outfit'] font-bold text-base sm:text-lg mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {promo1.title}
                  </h3>
                  <p
                    className={`font-['Inter'] text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {promo1.desc}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold font-['Inter'] ${
                  isDark ? 'border-[#252830] text-amber-400' : 'border-slate-100 text-[#004655]'
                }`}>
                  <span>Canjear por WhatsApp</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>

              {/* Promo 2 */}
              <div
                className={`border rounded-xl p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group w-full ${
                  isDark
                    ? 'bg-[#121316] border-[#282a32] hover:border-amber-400/60'
                    : 'bg-white border-[#bfc8cc] hover:border-[#004655]'
                }`}
                onClick={() => window.open(waUrl, '_blank')}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs"
                      style={{
                        backgroundColor: promo2.isCashea ? '#FFE600' : (isDark ? '#22242c' : '#f1f5f9'),
                        color: promo2.isCashea ? '#000000' : promo2.tagColor,
                        border: promo2.isCashea ? '1px solid #facc15' : 'none',
                      }}
                    >
                      {promo2.isCashea && <img src="/images/cashea-icon.png" alt="" className="w-3.5 h-3.5 object-contain inline-block mr-1" />}
                      <span>{promo2.tag}</span>
                    </span>
                  </div>
                  <h3
                    className={`font-['Outfit'] font-bold text-base sm:text-lg mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {promo2.title}
                  </h3>
                  <p
                    className={`font-['Inter'] text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {promo2.desc}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold font-['Inter'] ${
                  isDark ? 'border-[#252830] text-amber-400' : 'border-slate-100 text-[#004655]'
                }`}>
                  <span>Consultar disponibilidad</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          </section>

          {/* ─── G. Sección Horizontal: Horarios Detallados & Métodos de Pago ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full animate-fade-in-up stagger-3">
            
            {/* Horario de Atención Detallado */}
            <div
              className={`border rounded-2xl p-5 sm:p-6 shadow-2xs w-full ${
                isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-[#bfc8cc]'
              }`}
            >
              <h3
                className={`font-['Outfit'] font-bold text-base sm:text-lg mb-3.5 flex items-center gap-2 pb-2 border-b ${
                  isDark ? 'text-white border-[#252830]' : 'text-slate-900 border-[#e0e3e5]'
                }`}
              >
                <Clock size={18} className={isDark ? 'text-amber-400' : 'text-[#006e70]'} />
                <span>Horario de Atención Semanal</span>
              </h3>

              <ul className="font-['Inter'] text-xs sm:text-sm space-y-2.5">
                {scheduleEntries.map(([days, hours], idx) => (
                  <li
                    key={days}
                    className={`flex justify-between items-center py-1.5 ${
                      idx > 0 ? (isDark ? 'border-t border-[#252830]' : 'border-t border-slate-100') : ''
                    }`}
                  >
                    <span className="font-medium text-slate-400">{days}</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded border ${
                        isDark ? 'bg-[#18191d] border-[#2b2d35] text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-900'
                      }`}
                    >
                      {hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Métodos de Pago Detallados */}
            <div
              className={`border rounded-2xl p-5 sm:p-6 shadow-2xs w-full ${
                isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-[#bfc8cc]'
              }`}
            >
              <h3
                className={`font-['Outfit'] font-bold text-base sm:text-lg mb-3.5 flex items-center gap-2 pb-2 border-b ${
                  isDark ? 'text-white border-[#252830]' : 'text-slate-900 border-[#e0e3e5]'
                }`}
              >
                <CreditCard size={18} className={isDark ? 'text-amber-400' : 'text-[#006e70]'} />
                <span>Formas de Pago Aceptadas</span>
              </h3>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {paymentMethods.includes('punto_de_venta') && (
                  <div className={`p-2.5 border rounded-xl flex items-center gap-2 font-['Inter'] text-xs font-semibold ${
                    isDark ? 'bg-[#18191d] border-[#282a32] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <CreditCard size={15} className={isDark ? 'text-amber-400' : 'text-slate-600'} />
                    <span>Punto de Venta (POS)</span>
                  </div>
                )}
                {paymentMethods.includes('pago_movil') && (
                  <div className={`p-2.5 border rounded-xl flex items-center gap-2 font-['Inter'] text-xs font-bold ${
                    isDark ? 'bg-[#18191d] border-[#1e3a8a] text-blue-400' : 'bg-blue-50/60 border-blue-200 text-blue-900'
                  }`}>
                    <Smartphone size={15} className="text-blue-500 flex-shrink-0" />
                    <span>Pago Móvil</span>
                  </div>
                )}
                {paymentMethods.includes('usd_cash') && (
                  <div className={`p-2.5 border rounded-xl flex items-center gap-2 font-['Inter'] text-xs font-bold ${
                    isDark ? 'bg-[#18191d] border-[#065f46] text-emerald-400' : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  }`}>
                    <DollarSign size={15} className="text-emerald-500 flex-shrink-0" />
                    <span>Dólares Cash / Zelle</span>
                  </div>
                )}
                {paymentMethods.includes('binance') && (
                  <div className={`p-2.5 border rounded-xl flex items-center gap-2 font-['Inter'] text-xs font-bold ${
                    isDark ? 'bg-[#18191d] border-[#78350f] text-amber-400' : 'bg-amber-50/60 border-amber-200 text-amber-900'
                  }`}>
                    <span className="text-amber-400 font-black text-sm">₿</span>
                    <span>Binance USDT</span>
                  </div>
                )}
                {paymentMethods.includes('cashea') && (
                  <div className="p-3 border rounded-xl flex items-center gap-2.5 font-['Inter'] text-xs font-black col-span-2 bg-[#FFE600] text-slate-950 border-amber-300 shadow-xs">
                    <img src="/images/cashea-icon.png" alt="Cashea" className="w-5 h-5 rounded-md object-contain shrink-0 shadow-2xs" />
                    <span>Cashea: Compra ahora y paga después en cuotas sin interés</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ─── H. Módulo Oficial y Calculadora Interactiva de Cashea (Niveles 1 al 6) ─── */}
          {showCasheaWidget && (
            <section className="w-full animate-fade-in-up">
              <CasheaCalculatorWidget
                businessName={name}
                products={sampleProducts}
                settings={adminSettings}
                initialAmount={sampleProducts[0]?.price || 45}
              />
            </section>
          )}

          {/* ─── I. Sección: Sobre Nosotros & Identidad Local (A lo Largo) ─── */}
          <section className={`w-full rounded-2xl border p-5 sm:p-6 space-y-2.5 animate-fade-in-up stagger-3 ${
            isDark ? 'bg-[#121316] border-[#282a32]' : 'bg-white border-slate-200'
          }`}>
            <h2 className={`font-['Outfit'] font-bold text-lg sm:text-xl ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Sobre {name}
            </h2>
            <div className={`font-['Inter'] text-xs sm:text-sm leading-relaxed space-y-2 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <p>
                {description}
              </p>
              <p className="text-xs text-slate-400">
                Ubicados en la zona de <strong className={isDark ? 'text-amber-400' : 'text-slate-800'}>{zone}</strong> ({address}), formando parte de la red comercial oficial de CumanáConecta para impulsar el comercio sucrense.
              </p>
            </div>
          </section>

          {/* ─── I. Botones de Acción de Pie Horizontal ─── */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 h-13 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-['Inter'] font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98 cursor-pointer"
              aria-label="Contactar por WhatsApp"
            >
              <WhatsAppIcon size={20} />
              <span>Contactar por WhatsApp Directo</span>
            </a>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto h-13 px-6 rounded-xl border font-['Inter'] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                isDark
                  ? 'bg-[#18191d] border-[#282a32] text-slate-200 hover:bg-[#22242c]'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
              }`}
              aria-label="Ver ubicación en Google Maps"
            >
              <Map size={18} className={isDark ? 'text-amber-400' : 'text-[#004655]'} />
              <span>Ver Ubicación</span>
            </a>

            {/* Botón Código QR para mi Local */}
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className={`w-full sm:w-auto h-13 px-5 rounded-xl border border-dashed font-['Inter'] font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDark
                  ? 'border-amber-500/50 text-amber-300 hover:bg-amber-500/10'
                  : 'border-amber-400 text-amber-900 hover:bg-amber-50'
              }`}
              aria-label="Generar código QR para imprimir en mi local"
            >
              <QrCode size={18} className="text-amber-500" />
              <span>Código QR para mi Local</span>
            </button>

            {/* Botón Compartir en el pie */}
            <button
              type="button"
              onClick={handleShare}
              className={`w-full sm:w-auto h-13 px-5 rounded-xl border border-dashed font-['Inter'] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDark
                  ? 'border-[#282a32] text-slate-400 hover:text-slate-200 hover:border-slate-500'
                  : 'border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400'
              }`}
              aria-label="Compartir perfil de este comercio"
            >
              {copied ? (
                <>
                  <Check size={17} className="text-emerald-400" />
                  <span className="text-emerald-400">¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 size={17} />
                  <span>Compartir perfil</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* ─── Submodal de Código QR & Cartel de Mostrador para el Local ─── */}
        <AnimatePresence>
          {showQrModal && (
            <div
              className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="qr-modal-title"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
                onClick={() => setShowQrModal(false)}
              />

              {/* Card Contenedora */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 16 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border z-20 flex flex-col items-center text-center ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Botón Cerrar */}
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/20 hover:bg-slate-800/40 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                  aria-label="Cerrar modal de código QR"
                >
                  <X size={18} />
                </button>

                {/* Icono + Título */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mb-3 shadow-md">
                  <QrCode size={24} className="stroke-[2.5]" />
                </div>

                <h3 id="qr-modal-title" className="font-['Outfit'] font-extrabold text-xl sm:text-2xl tracking-tight">
                  Código QR de {name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm font-['Inter'] leading-relaxed">
                  Descarga o imprime este cartel para colocarlo en la mesa, vitrina o mostrador de tu local en Cumaná.
                </p>

                {/* ─── Mockup de Cartel / Standee Imprimible ─── */}
                <div
                  id="printable-standee"
                  className="w-full mt-5 p-5 sm:p-6 rounded-2xl border-2 border-dashed border-[#008b8b]/60 bg-gradient-to-b from-slate-50 to-white dark:from-[#131417] dark:to-[#18191d] shadow-inner flex flex-col items-center"
                >
                  {/* Header del Cartel */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#005f73] text-white text-[10.5px] font-black tracking-wider uppercase shadow-xs mb-3">
                    <span>CumanáConecta • Guía Oficial</span>
                  </div>

                  <h4 className="font-['Outfit'] font-bold text-lg text-slate-900 dark:text-white leading-tight">
                    {name}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    📍 {zone || 'Cumaná'} • {categoryLabel || 'Comercio Local'}
                  </span>

                  {/* Código QR Generado */}
                  <div className="mt-4 p-3 bg-white rounded-2xl shadow-md border border-slate-200 flex items-center justify-center">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`Código QR de ${name}`}
                        className="w-44 h-44 sm:w-52 sm:h-52 object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center text-slate-400 text-xs">
                        Generando QR...
                      </div>
                    )}
                  </div>

                  <p className="text-[11.5px] text-slate-600 dark:text-slate-300 font-semibold mt-3.5 leading-snug max-w-xs">
                    📱 Escanea con la cámara de tu celular para ver nuestro catálogo completo, promociones, formas de pago y contactarnos directamente.
                  </p>

                  {/* Badges de Confianza del Cartel */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 w-full">
                    <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      🛡️ Comercio Verificado
                    </span>
                    {paymentMethods.includes('cashea') && (
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-black bg-[#FFE600] text-slate-950 border border-amber-300 inline-flex items-center gap-1">
                        <CasheaIcon className="w-3 h-3 object-contain" />
                        <span>Acepta Cashea</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      🛵 Cumaná, Edo. Sucre
                    </span>
                  </div>
                </div>

                {/* ─── Botones de Acción: Descargar / Imprimir / Copiar ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-5">
                  {/* 1. Descargar PNG */}
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="h-11 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-['Inter'] font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Descargar Imagen QR</span>
                  </button>

                  {/* 2. Imprimir Cartel */}
                  <button
                    type="button"
                    onClick={handlePrintStandee}
                    className={`h-11 px-4 rounded-xl font-['Inter'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border shadow-xs cursor-pointer active:scale-95 ${
                      isDark
                        ? 'bg-[#22242c] hover:bg-[#2c303a] border-[#383c48] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    }`}
                  >
                    <Printer size={16} className={isDark ? 'text-amber-400' : 'text-[#005f73]'} />
                    <span>Imprimir Cartel</span>
                  </button>
                </div>

                {/* 3. Copiar Enlace Directo */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="mt-2.5 text-xs text-slate-400 hover:text-amber-400 transition flex items-center gap-1.5 cursor-pointer underline font-medium"
                >
                  <Copy size={13} />
                  <span>Copiar enlace web directo</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}

