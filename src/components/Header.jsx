import { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  PhoneCall,
  Share2,
  PlusCircle,
  Check,
  Building2,
  Compass,
  Layers,
  ChevronDown,
  Heart,
} from 'lucide-react';
import HeroSearch from './HeroSearch';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const TRENDING_TAGS = [
  { label: 'Farmacias 24H', emoji: '💊', query: 'farmacia' },
  { label: 'Comercios con Cashea', emoji: '💳', filterCashea: true },
  { label: 'Arepas & Cazón', emoji: '🍔', query: 'Arepa' },
  { label: 'Taller Mecánico', emoji: '🔧', query: 'taller' },
  { label: 'Clínicas & Salud', emoji: '🏥', category: 'salud' },
];

/**
 * Header CumanáConecta
 * Soporta Modo Claro y Modo Oscuro fiel a la referencia de diseño.
 */
export default function Header({
  onNavigate,
  onOpenPricing,
  onOpenEmergency,
  totalBusinesses = 12,
  featuredCount = 6,
  filteredCount = 12,
  query = '',
  setQuery,
  activeZone = 'Todas las zonas',
  setActiveZone,
  filterOpenNow = false,
  setFilterOpenNow,
  filterCashea = false,
  setFilterCashea,
  filterDiscount = false,
  setFilterDiscount,
  activeCategory,
  onSelectCategory,
  onSearchSubmit,
  onNavigateDirectorio,
  onNavigateAdmin,
}) {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Reloj en tiempo real para la hora local de Cumaná (Venezuela)
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('es-VE', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Caracas',
        }).format(now);
        setCurrentTime(formatted);
      } catch {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Función para compartir el enlace del directorio
  const handleShare = async () => {
    const cleanUrl = window.location.href.replace(/#+$/, '');
    const shareData = {
      title: 'CumanáConecta — Directorio Comercial y de Servicios',
      text: 'Encuentra los mejores comercios, servicios y profesionales de Cumaná.',
      url: cleanUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Cancelado por el usuario
      }
    } else {
      try {
        await navigator.clipboard.writeText(cleanUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        toast.copy('Enlace de CumanáConecta copiado al portapapeles.');
      } catch {
        // Fallback
      }
    }
  };

  const handleTrendingClick = (tag) => {
    if (tag.filterCashea && setFilterCashea) {
      setFilterCashea(true);
    }
    if (tag.category && onSelectCategory) {
      onSelectCategory(tag.category);
    }
    if (tag.query && setQuery) {
      setQuery(tag.query);
    }
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`w-full border-b relative z-30 transition-colors duration-300 ${
      isDark
        ? 'bg-[#121316] border-[#22242b] text-slate-100'
        : 'bg-white border-[#bfc8cc] text-[#191c1e]'
    }`}>
      
      {/* ─── Topbar Informativa Superior (Estilo Cinta) ─── */}
      <div className={`w-full text-xs py-1.5 px-3 sm:px-6 md:px-12 border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#0f1013] text-slate-300 border-[#1c1e24]'
          : 'bg-[#004655] text-white border-[#003844]'
      }`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 text-[11px]">
          
          {/* Lado Izquierdo: Ubicación Cumaná 🇻🇪 */}
          <div className="flex items-center gap-2 min-w-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-medium border shadow-2xs ${
              isDark
                ? 'bg-[#1a1c22] text-slate-200 border-[#2d3039]'
                : 'bg-[#005f73] text-white border-[#0a9396]/30'
            }`}>
              <MapPin size={12} className="text-amber-400 flex-shrink-0" />
              <span className="font-semibold">{isDark ? 'Cumaná, Sucre' : 'Cumaná 🇻🇪'}</span>
            </span>
            <span className={`hidden lg:inline text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-300'}`}>
              • La Primogénita del Continente
            </span>
          </div>

          {/* Lado Derecho: Botón Emergencias Cumaná + Hora Local y Comercios */}
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] flex-shrink-0">
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

            <div className={`hidden md:inline-flex items-center gap-1.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-100'}`}>
              <Clock size={12} className="text-amber-400 flex-shrink-0" />
              <span><strong className="font-semibold text-white">{currentTime || '02:10 p. m.'}</strong></span>
            </div>
            <span className={`hidden sm:inline-block px-2.5 py-0.5 rounded-full font-semibold border ${
              isDark
                ? 'bg-[#1a1c22] text-amber-300 border-[#2d3039]'
                : 'bg-[#005f73] text-white border-[#0a9396]/30'
            }`}>
              {totalBusinesses} comercios
            </span>
          </div>

        </div>
      </div>

      {/* ─── Barra de Navegación Principal (Navbar) ─── */}
      <div className={`border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#16171b] border-[#252830]'
          : 'bg-white border-[#bfc8cc]'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between gap-2">
          
          {/* Logo & Identidad de Marca */}
          <div
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group min-w-0"
          >
            {/* Isotipo con Letra C */}
            <div
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-all ${
                isDark
                  ? 'bg-[#eab308] text-slate-950 font-black text-xl font-[\'Outfit\']'
                  : 'bg-[#005f73] text-white'
              }`}
            >
              {isDark ? 'C' : <Building2 size={22} className="text-white" />}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`font-['Outfit'] font-extrabold text-xl sm:text-2xl tracking-tight leading-none truncate ${
                    isDark ? 'text-white' : 'text-[#004655]'
                  }`}
                >
                  Cumaná<span className={isDark ? 'text-[#facc15]' : 'text-[#006e70]'}>Conecta</span>
                </span>

                {isDark && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#24262c] text-slate-300 border border-[#353945]">
                    SUCRE
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 hidden xs:block truncate">
                Directorio Comercial y de Servicios
              </span>
            </div>

            {/* Selector rápido de Zona / Ciudad */}
            {isDark && (
              <div className="hidden lg:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full bg-[#1e2026] border border-[#2d3039] text-xs font-semibold text-slate-300 hover:border-slate-500 transition cursor-pointer">
                <MapPin size={12} className="text-amber-400" />
                <span>Cumaná, Sucre</span>
                <ChevronDown size={12} className="text-slate-400" />
              </div>
            )}
          </div>

          {/* Botones de Acción de Escritorio & Tablet Grande (Minimizados) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            
            {/* 1. Botón Directorio */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('directorio');
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 border shadow-2xs ${
                  isDark
                    ? 'bg-[#1e2026] hover:bg-[#282a32] text-slate-200 border-[#2d3039]'
                    : 'bg-[#f8fafc] hover:bg-[#e0f7f6] text-[#005f73] border-slate-200 hover:border-[#99f6e4]'
                }`}
                aria-label="Ir al Directorio Comercial"
              >
                <Layers size={18} className={isDark ? 'text-amber-400' : 'text-[#006e70]'} />
              </button>
              <span className={`pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                isDark ? 'bg-[#282a32] text-slate-200 border border-[#3f4350]' : 'bg-slate-900 text-white'
              }`}>
                Directorio
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
              <span className={`pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                isDark ? 'bg-[#282a32] text-rose-300 border border-[#3f4350]' : 'bg-slate-900 text-white'
              }`}>
                Emergencias (171)
              </span>
            </div>

            {/* 3. ThemeToggle (Cambio de Modo Claro/Oscuro) */}
            <ThemeToggle />

            {/* 4. Botón Compartir */}
            <div className="relative group">
              <button
                type="button"
                onClick={handleShare}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 border shadow-2xs ${
                  isDark
                    ? 'bg-[#1e2026] hover:bg-[#282a32] border-[#2d3039] text-slate-300'
                    : 'bg-[#f8fafc] hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
                aria-label="Compartir plataforma"
              >
                {copied ? (
                  <Check size={17} className="text-emerald-500 stroke-[2.5]" />
                ) : (
                  <Share2 size={17} />
                )}
              </button>
              <span className={`pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                isDark ? 'bg-[#282a32] text-slate-200 border border-[#3f4350]' : 'bg-slate-900 text-white'
              }`}>
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
                aria-label="Publicar o Sumar mi Negocio"
              >
                <PlusCircle size={19} />
              </button>
              <span className={`pointer-events-none absolute top-full right-0 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
                isDark ? 'bg-[#282a32] text-amber-300 border border-[#3f4350]' : 'bg-slate-900 text-white'
              }`}>
                Sumar mi Negocio
              </span>
            </div>

          </div>

          {/* Acciones Móviles (ThemeToggle + Emergencias + Compartir) */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            {/* Botón Pequeño Curioso de Tema Móvil */}
            <ThemeToggle />

            {/* Botón Emergencias Móvil */}
            <button
              type="button"
              onClick={onOpenEmergency}
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center cursor-pointer active:scale-95 transition shadow-2xs ${
                isDark
                  ? 'bg-[#2a1417] text-[#fb7185] border-[#4c1d24]'
                  : 'bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]'
              }`}
              aria-label="Abrir emergencias"
            >
              <PhoneCall size={16} />
            </button>

            {/* Botón Compartir Móvil */}
            <button
              type="button"
              onClick={handleShare}
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center cursor-pointer active:scale-95 transition shadow-2xs ${
                isDark
                  ? 'bg-[#1e2026] text-slate-300 border-[#2d3039]'
                  : 'bg-slate-50/80 text-slate-700 border-slate-200'
              }`}
              aria-label="Compartir directorio"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* ─── Hero Section ─── */}
      <section className={`pt-6 pb-6 sm:pt-8 sm:pb-8 md:pt-12 md:pb-10 text-center px-3 sm:px-6 md:px-12 transition-colors duration-300 ${
        isDark
          ? 'bg-[#121316]'
          : 'bg-hero-light'
      }`}>
        <div className="max-w-4xl mx-auto">
          
          {/* Badge Superior: La Primogénita del Continente */}
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold mb-3 sm:mb-4 border shadow-2xs transition-colors duration-300 ${
              isDark
                ? 'bg-[#221f15] text-[#f59e0b] border-[#45371c]'
                : 'bg-[#e6f4f1] text-[#005f73] border-[#b2dfdb]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>• La Primogénita del Continente • Cumaná, Estado Sucre</span>
          </div>

          {/* Título Principal con subrayado estilizado en Cumaná */}
          <h1
            className={`font-['Outfit'] font-bold text-2xl sm:text-4xl md:text-5xl mb-2.5 sm:mb-3 tracking-tight leading-tight transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-[#004655]'
            }`}
          >
            ¿Qué estás buscando en{' '}
            <span className="relative inline-block text-[#f59e0b]">
              Cumaná
              {/* Línea decorativa ondulada */}
              <svg
                className="absolute -bottom-1.5 left-0 w-full h-2 text-[#f59e0b]"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,4 Q25,8 50,4 T100,4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            hoy?
          </h1>

          {/* Subtítulo */}
          <p
            className={`font-['Inter'] text-xs sm:text-sm md:text-base mb-5 sm:mb-7 max-w-2xl mx-auto leading-relaxed px-1 transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Encuentra comercios locales, farmacias 24h, restaurantes, marisquerías, talleres y promociones activas con{' '}
            <strong className={isDark ? 'text-slate-200 font-bold' : 'text-slate-800 font-bold'}>Cashea</strong> y{' '}
            <strong className={isDark ? 'text-slate-200 font-bold' : 'text-slate-800 font-bold'}>Pago Móvil</strong>.
          </p>

          {/* ─── Buscador Hero & Comandos de Voz (HeroSearch) ─── */}
          <HeroSearch
            query={query}
            setQuery={setQuery}
            activeZone={activeZone}
            setActiveZone={setActiveZone}
            filterOpenNow={filterOpenNow}
            setFilterOpenNow={setFilterOpenNow}
            filterCashea={filterCashea}
            setFilterCashea={setFilterCashea}
            filterDiscount={filterDiscount}
            setFilterDiscount={setFilterDiscount}
            filteredCount={filteredCount}
            totalBusinesses={totalBusinesses}
            onSearchSubmit={() => {
              document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* ─── Tendencias en Cumaná ─── */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-['Inter'] max-w-3xl mx-auto">
            <span className={`font-medium mr-1 text-[11px] sm:text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Tendencias:
            </span>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => handleTrendingClick(tag)}
                className={`px-3 py-1.5 rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 text-[11px] sm:text-xs ${
                  isDark
                    ? 'bg-[#18191d] border border-[#2b2d35] text-slate-300 hover:border-amber-400/60 hover:text-amber-300'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:border-[#008b8b] hover:text-[#005f73]'
                }`}
              >
                <span>{tag.emoji}</span>
                <span className="font-medium">{tag.label}</span>
              </button>
            ))}
          </div>

        </div>
      </section>

    </header>
  );
}

