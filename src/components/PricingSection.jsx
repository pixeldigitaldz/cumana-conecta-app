import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Check,
  X,
  TrendingUp,
  Store,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CasheaIcon } from './CasheaLogo';
import adminStore from '../store/adminStore.js';

const ADMIN_WHATSAPP = '584120000000';

const FORM_CATEGORIES = [
  'Clínicas y Salud',
  'Farmacias 24H / Guardia',
  'Restaurantes y Comida',
  'Reposterías y Café',
  'Talleres y Repuestos',
  'Librerías y Papelería',
  'Emprendedores & Moda',
  'Tiendas y Supermercados',
  'Turismo & Paseos en Lancha',
  'Otros Comercios y Servicios',
];

const FORM_ZONES = [
  'Sector Centro',
  'Av. Bermúdez',
  'Cantarrana',
  'Los Chaimas',
  'Av. Universidad',
  'CC Hipergalerías',
  'Av. Perimetral',
  'Centro Histórico',
  'Av. Andrés Eloy Blanco',
  'Bebedero / Brasil',
  'El Salado',
  'Otra Zona de Cumaná',
];

/**
 * PricingSection — CumanáConecta
 * Modal de planes y captación comercial con diseño de alta fidelidad:
 * Soporte homogéneo para Modo Claro y Modo Oscuro.
 */
export default function PricingSection({ isOpen = true, onClose, isModal = false }) {
  const { isDark } = useTheme();
  const [isClosing, setIsClosing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('basic'); // 'basic' | 'vip'

  // Estados del Formulario
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [category, setCategory] = useState('Clínicas y Salud');
  const [zone, setZone] = useState('Sector Centro');
  const [acceptsCashea, setAcceptsCashea] = useState(false);
  const [promotion, setPromotion] = useState('');

  const formRef = useRef(null);

  const handleClose = useCallback(() => {
    if (isClosing || !onClose) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!isModal || !isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isModal, isOpen, handleClose]);

  const handleSelectPlanAndScroll = (planKey) => {
    setSelectedPlan(planKey);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSendWhatsApp = (e) => {
    if (e) e.preventDefault();
    if (!businessName.trim() || !businessPhone.trim()) {
      alert('Por favor completa el Nombre de tu Negocio y el Teléfono/WhatsApp de atención.');
      return;
    }

    const planLabel = selectedPlan === 'vip' ? 'Plan Destacado VIP ($10 / mes)' : 'Plan Estándar Gratuito ($0)';
    const casheaText = acceptsCashea ? 'Sí (Acepta Cashea 🟰)' : 'No';
    const promoText = promotion.trim() ? promotion.trim() : 'Ninguna por el momento';

    const message =
      `¡Hola CumanáConecta! 🇻🇪\n` +
      `Quiero registrar mi negocio en el directorio oficial:\n\n` +
      `📌 *Negocio:* ${businessName.trim()}\n` +
      `📞 *Teléfono/WhatsApp:* ${businessPhone.trim()}\n` +
      `📂 *Categoría:* ${category}\n` +
      `📍 *Zona:* ${zone}\n` +
      `💳 *Acepta Cashea:* ${casheaText}\n` +
      `🎁 *Promoción Inicial:* ${promoText}\n` +
      `⭐ *Plan Seleccionado:* ${planLabel}\n\n` +
      `Quedo atento a la revisión y activación de mi ficha. ¡Muchas gracias!`;

    const targetWa = adminStore.getSettings()?.adminWhatsapp || ADMIN_WHATSAPP;
    const waUrl = `https://wa.me/${targetWa.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  if (isModal && !isOpen) return null;

  const content = (
    <div className="w-full max-w-[1060px] mx-auto px-4 sm:px-8 py-6 sm:py-10 text-center">
      
      {/* ─── 1. Header Section ─── */}
      <header className="mb-8 max-w-3xl mx-auto">
        {/* Badge Superior */}
        <div
          className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold mb-3.5 border shadow-2xs ${
            isDark
              ? 'bg-[#1e2026] text-amber-400 border-[#2d3039]'
              : 'bg-[#e6f4f1] text-[#005f73] border-[#b2dfdb]'
          }`}
        >
          <TrendingUp size={14} className={isDark ? 'text-amber-400' : 'text-[#006e70]'} />
          <span>Crece con la Guía Comercial Líder en Sucre</span>
        </div>

        {/* Título Principal */}
        <h1
          className={`font-['Outfit'] font-bold text-2xl sm:text-3xl md:text-[38px] mb-2.5 leading-tight tracking-tight ${
            isDark ? 'text-white' : 'text-[#004655]'
          }`}
        >
          Publica y Haz Crecer tu Negocio en{' '}
          <span className={isDark ? 'text-amber-400' : 'text-[#008b8b]'}>Cumaná</span>
        </h1>

        {/* Subtítulo */}
        <p
          className={`font-['Inter'] text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Recibe clientes directos a tu WhatsApp, resalta tus métodos de pago (Cashea, Pago Móvil, Binance) y aparece en las primeras búsquedas de la ciudad.
        </p>
      </header>

      {/* ─── 2. Tarjetas de Planes (Estándar & Destacado VIP) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto items-stretch text-left">
        
        {/* ── Tarjeta: Plan Estándar ── */}
        <div
          className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full transition-all duration-200 ${
            isDark ? 'bg-[#121316]' : 'bg-white'
          } ${
            selectedPlan === 'basic'
              ? (isDark ? 'border-2 border-teal-500 shadow-lg' : 'border-2 border-[#005f73] shadow-md')
              : (isDark ? 'border border-[#282a32] shadow-xs hover:border-[#383c48]' : 'border border-slate-200 shadow-xs hover:border-slate-300')
          }`}
        >
          <div>
            {/* Header: Nombre + Badge Gratis Siempre */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className={`font-['Outfit'] font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Plan Estándar
              </h2>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                isDark ? 'bg-[#1e2026] text-slate-300 border border-[#2d3039]' : 'bg-slate-100 text-slate-700'
              }`}>
                Gratis Siempre
              </span>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className={`font-['Outfit'] font-bold text-3xl sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $0
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / Sin costo mensual
              </span>
            </div>

            {/* Descripción */}
            <p className="font-['Inter'] text-xs text-slate-400 mb-5 leading-relaxed">
              Para pequeños negocios y oficios que desean tener presencia en el directorio digital de Cumaná.
            </p>

            {/* Lista de Características */}
            <ul className="space-y-2.5 mb-6 text-xs font-['Inter']">
              {/* Activas */}
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Presencia en el listado general del directorio</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Datos de contacto básicos (Dirección, Teléfono y Zona)</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Botón de enlace a WhatsApp directo</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Ubicación en Google Maps</span>
              </li>

              {/* Inactivas / Tachadas */}
              <li className={`flex items-start gap-2 line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <span>Posicionamiento en primeros resultados</span>
              </li>
              <li className={`flex items-start gap-2 line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <span>Insignia oficial de &quot;Verificado ✔️&quot;</span>
              </li>
              <li className={`flex items-start gap-2 line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <span>Badge destacado de Cashea y Métodos de Pago</span>
              </li>
              <li className={`flex items-start gap-2 line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <span>Publicación de promociones y ofertas activas</span>
              </li>
              <li className={`flex items-start gap-2 line-through ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <span>Galería de fotos extendida y menú de servicios</span>
              </li>
            </ul>
          </div>

          {/* Botón de Selección */}
          <button
            type="button"
            onClick={() => handleSelectPlanAndScroll('basic')}
            className={`w-full h-11 rounded-xl font-['Inter'] text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedPlan === 'basic'
                ? (isDark ? 'bg-teal-600 text-white font-bold shadow-xs' : 'bg-[#005f73] text-white font-bold shadow-xs')
                : (isDark ? 'bg-[#18191d] hover:bg-[#22242c] text-slate-300 font-semibold border border-[#2b2d35]' : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800 font-semibold')
            }`}
          >
            {selectedPlan === 'basic' ? (
              <>
                <Check size={16} />
                <span>Plan Seleccionado</span>
              </>
            ) : (
              <span>Seleccionar este Plan</span>
            )}
          </button>
        </div>

        {/* ── Tarjeta: Plan Destacado VIP ── */}
        <div
          className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full relative transition-all duration-200 ${
            isDark ? 'bg-[#121316]' : 'bg-white'
          } ${
            selectedPlan === 'vip'
              ? 'border-2 border-[#f59e0b] shadow-lg ring-1 ring-[#f59e0b]/40'
              : (isDark ? 'border border-[#282a32] shadow-xs hover:border-amber-400/40' : 'border border-slate-200 shadow-xs hover:border-amber-300')
          }`}
        >
          {/* Badge Flotante Superior: OPCIÓN MÁS VENDIDA */}
          <div className="absolute -top-3 left-6 z-10">
            <span className="px-3 py-0.5 font-['Inter'] font-extrabold text-[10px] uppercase tracking-wide text-slate-950 bg-[#f59e0b] rounded-md shadow-xs flex items-center gap-1">
              <span>★</span>
              <span>OPCIÓN MÁS VENDIDA</span>
            </span>
          </div>

          <div>
            {/* Header: Nombre + Badge Recomendado */}
            <div className="flex items-center justify-between gap-2 mb-2 mt-1">
              <h2 className={`font-['Outfit'] font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Plan Destacado VIP
              </h2>
              <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                isDark
                  ? 'bg-[#221d14] text-amber-400 border-[#78350f]'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}>
                Recomendado para Crecer
              </span>
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className={`font-['Outfit'] font-bold text-3xl sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                $10
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / pago mensual o $90 / año
              </span>
            </div>

            {/* Descripción */}
            <p className="font-['Inter'] text-xs text-slate-400 mb-5 leading-relaxed">
              Máxima visibilidad, clientes directos a tu WhatsApp, ventas con Cashea y prioridad total en búsquedas locales.
            </p>

            {/* Lista de Características VIP */}
            <ul className="space-y-2.5 mb-6 text-xs font-['Inter']">
              {/* Características Clave VIP (Color Dorado/Ámbar) */}
              <li className={`flex items-start gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Check size={15} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span>Posicionamiento fijo en Primera Portada y primeros resultados</span>
              </li>
              <li className={`flex items-start gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Check size={15} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span>Grabación y publicación de Video Guía "Cómo Llegar" (15-30s)</span>
              </li>
              <li className={`flex items-start gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Check size={15} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span>Conexión multicanal directa (Instagram, TikTok y YouTube)</span>
              </li>
              <li className={`flex items-start gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Check size={15} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span>Borde dorado y badge de Video Guía en el catálogo</span>
              </li>
              <li className={`flex items-start gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Check size={15} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span>Insignia oficial de &quot;Verificado ✔️&quot; con auditoría física</span>
              </li>
              <li className={`flex items-start gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Check size={15} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span>Resaltado exclusivo de botón Cashea (Niveles 1–3)</span>
              </li>
              <li className={`flex items-start gap-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Check size={15} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                <span>Módulo de promociones activas en la tira superior en vivo</span>
              </li>

              {/* Características Estándar Incluidas */}
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Galería completa de fotos, productos y lista de precios</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Botón de WhatsApp directo con mensaje pre-redactado</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Optimización SEO local para búsquedas en Cumaná</span>
              </li>
              <li className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                <Check size={15} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-teal-400' : 'text-[#008b8b]'}`} />
                <span>Soporte y actualización de horarios y ofertas 24/7</span>
              </li>
            </ul>
          </div>

          {/* Botón de Selección */}
          <button
            type="button"
            onClick={() => handleSelectPlanAndScroll('vip')}
            className={`w-full h-11 rounded-xl font-['Inter'] text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedPlan === 'vip'
                ? 'bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-black shadow-xs'
                : (isDark ? 'bg-[#18191d] hover:bg-[#22242c] text-slate-300 font-semibold border border-[#2b2d35]' : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800 font-semibold')
            }`}
          >
            {selectedPlan === 'vip' ? (
              <>
                <Check size={16} />
                <span>Plan Seleccionado</span>
              </>
            ) : (
              <span>Seleccionar este Plan</span>
            )}
          </button>
        </div>

      </div>

      {/* ─── 3. Formulario Integrado: Completa los datos de tu comercio en Cumaná ─── */}
      <div
        ref={formRef}
        className={`rounded-2xl border p-5 sm:p-7 max-w-4xl mx-auto mt-8 text-left space-y-4 shadow-sm ${
          isDark
            ? 'bg-[#121316] border-[#282a32]'
            : 'bg-white border-slate-200/90'
        }`}
      >
        
        {/* Encabezado del Formulario */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isDark ? 'bg-[#1e2026] text-amber-400' : 'bg-teal-50 text-[#006e70]'
            }`}>
              <Store size={16} />
            </div>
            <h3 className={`font-['Outfit'] font-bold text-base sm:text-lg ${
              isDark ? 'text-white' : 'text-[#004655]'
            }`}>
              Completa los datos de tu comercio en Cumaná
            </h3>
          </div>
          <p className={`font-['Inter'] text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Te conectaremos de inmediato con el equipo editorial de CumanáConecta para revisar y activar tu ficha en minutos.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSendWhatsApp} className="space-y-3.5">
          
          {/* Fila 1: Nombre del Negocio & Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className={`block text-xs font-bold font-['Inter'] mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Nombre del Negocio o Emprendimiento <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej: Panadería La Primogénita"
                required
                className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm font-['Inter'] outline-none transition-colors ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-slate-100 placeholder:text-slate-600 focus:border-amber-400'
                    : 'bg-slate-50/60 border-slate-200 text-slate-900 focus:bg-white focus:border-[#006e70]'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold font-['Inter'] mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Teléfono / WhatsApp de Atención <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                placeholder="Ej: 0414-1234567"
                required
                className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm font-['Inter'] outline-none transition-colors ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-slate-100 placeholder:text-slate-600 focus:border-amber-400'
                    : 'bg-slate-50/60 border-slate-200 text-slate-900 focus:bg-white focus:border-[#006e70]'
                }`}
              />
            </div>
          </div>

          {/* Fila 2: Categoría Principal & Zona */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="relative">
              <label className={`block text-xs font-bold font-['Inter'] mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Categoría Principal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full h-11 pl-3.5 pr-9 rounded-xl border text-xs sm:text-sm font-['Inter'] outline-none transition-colors appearance-none cursor-pointer ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-slate-100 focus:border-amber-400'
                    : 'bg-slate-50/60 border-slate-200 text-slate-900 focus:bg-white focus:border-[#006e70]'
                }`}
              >
                {FORM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className={isDark ? 'bg-[#18191d] text-slate-100' : ''}>{cat}</option>
                ))}
              </select>
              <div className="absolute top-[35px] right-3 pointer-events-none text-slate-400">
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="relative">
              <label className={`block text-xs font-bold font-['Inter'] mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Zona en Cumaná
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className={`w-full h-11 pl-3.5 pr-9 rounded-xl border text-xs sm:text-sm font-['Inter'] outline-none transition-colors appearance-none cursor-pointer ${
                  isDark
                    ? 'bg-[#18191d] border-[#2b2d35] text-slate-100 focus:border-amber-400'
                    : 'bg-slate-50/60 border-slate-200 text-slate-900 focus:bg-white focus:border-[#006e70]'
                }`}
              >
                {FORM_ZONES.map((z) => (
                  <option key={z} value={z} className={isDark ? 'bg-[#18191d] text-slate-100' : ''}>{z}</option>
                ))}
              </select>
              <div className="absolute top-[35px] right-3 pointer-events-none text-slate-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Fila 3: Checkbox de Cashea */}
          <div className="pt-0.5">
            <label className={`flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={acceptsCashea}
                onChange={(e) => setAcceptsCashea(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#006e70] focus:ring-[#006e70] cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                ¿Tu comercio acepta pagos con{' '}
                <span className="bg-[#FFE600] text-slate-950 px-1.5 py-0.5 rounded font-black text-xs inline-flex items-center gap-1 border border-amber-300 shadow-2xs">
                  <CasheaIcon className="w-3.5 h-3.5 object-contain" />
                  <span>Cashea</span>
                </span>
                ?
              </span>
            </label>
          </div>

          {/* Fila 4: Promoción u Oferta */}
          <div>
            <label className={`block text-xs font-bold font-['Inter'] mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              Promoción u Oferta de Lanzamiento (Opcional)
            </label>
            <input
              type="text"
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
              placeholder="Ej: 10% de descuento en desayunos o Delivery Gratis"
              className={`w-full h-11 px-3.5 rounded-xl border text-xs sm:text-sm font-['Inter'] outline-none transition-colors ${
                isDark
                  ? 'bg-[#18191d] border-[#2b2d35] text-slate-100 placeholder:text-slate-600 focus:border-amber-400'
                  : 'bg-slate-50/60 border-slate-200 text-slate-900 focus:bg-white focus:border-[#006e70]'
              }`}
            />
          </div>

          {/* Fila 5: Footer con Plan y Botón WhatsApp */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pt-3 border-t ${
            isDark ? 'border-[#252830]' : 'border-slate-100'
          }`}>
            <div className={`text-xs font-['Inter'] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Plan seleccionado:{' '}
              <strong className={`font-bold ${isDark ? 'text-amber-400' : 'text-slate-900'}`}>
                {selectedPlan === 'vip' ? 'Plan Destacado VIP ($10 / mes)' : 'Plan Estándar Gratuito ($0)'}
              </strong>
            </div>

            <button
              type="submit"
              className="h-11 px-5 rounded-xl font-['Inter'] font-black text-xs sm:text-sm text-white flex items-center gap-2 shadow-xs hover:opacity-95 transition-all cursor-pointer bg-[#22c55e] hover:bg-[#16a34a]"
            >
              <MessageCircle size={16} />
              <span>Enviar Solicitud por WhatsApp</span>
            </button>
          </div>

        </form>
      </div>

      {/* ─── 4. Banner Promocional: Haz crecer tu negocio en Cumaná ─── */}
      <div className="mt-6 sm:mt-8 max-w-4xl mx-auto w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-md border border-slate-200/90 dark:border-slate-800/80 transition-all">
        <img
          src="/images/cumana_banner_negocio.png"
          alt="Haz crecer tu negocio en Cumaná"
          className="w-full h-auto object-cover block"
          loading="lazy"
        />
      </div>

    </div>
  );

  // Renderizado en Modal
  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-modal-title"
      >
        {/* Fondo Oscuro con Desenfoque */}
        <div
          className={`fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity ${
            isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
          }`}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Contenedor Principal del Modal con bordes redondeados */}
        <div
          className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border shadow-2xl z-10 transition-colors duration-300 ${
            isDark
              ? 'bg-[#18191d] border-[#2b2d35] text-slate-100'
              : 'bg-[#f7f9fb] border-[#bfc8cc] text-slate-900'
          } ${isClosing ? 'animate-modal-out' : 'animate-modal-in'}`}
        >
          {/* Barra Superior con Botón de Cierre */}
          <div className={`flex items-center justify-end px-4 pt-3.5 pb-1 z-20 flex-shrink-0 ${
            isDark ? 'bg-[#18191d]' : 'bg-[#f7f9fb]'
          }`}>
            <button
              type="button"
              onClick={handleClose}
              className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer rounded-full shadow-2xs ${
                isDark
                  ? 'bg-[#22242c] hover:bg-[#2e313c] text-slate-200'
                  : 'bg-slate-200/80 hover:bg-slate-300 text-slate-700'
              }`}
              aria-label="Cerrar modal de planes"
            >
              <X size={18} />
            </button>
          </div>

          {/* Área con Scroll Suave Interno Contenido */}
          <div className="overflow-y-auto flex-1 custom-scrollbar px-1 sm:px-2 pb-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  // Renderizado Estándar
  return (
    <section
      id="planes"
      className={isDark ? 'bg-[#121316] border-t border-[#282a32]' : 'bg-[#f7f9fb] border-t border-[#bfc8cc]'}
    >
      {content}
    </section>
  );
}

