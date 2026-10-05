import {
  Building2,
  MapPin,
  PhoneCall,
  Tag,
  Phone,
  Sparkles,
  ShieldCheck,
  Compass,
  ChevronRight,
  Shield,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import adminStore from '../store/adminStore.js';

const DEFAULT_FREQUENT_SEARCHES = [
  'Farmacias 24 horas',
  'Restaurantes',
  'Tiendas con Cashea',
  'Talleres Mecánicos',
  'Clínicas y Emergencias',
  'Cafeterías & Repostería',
  'Arepas de Cazón',
  'Tours a Mochima',
];

const POPULAR_CATEGORIES = [
  { id: 'farmacias_24h', label: 'Farmacias 24H', emoji: '💊' },
  { id: 'salud', label: 'Clínicas & Salud', emoji: '🏥' },
  { id: 'restaurantes', label: 'Restaurantes & Comida', emoji: '🍔' },
  { id: 'reposteria', label: 'Cafeterías & Pastelería', emoji: '🍰' },
  { id: 'talleres', label: 'Talleres & Repuestos', emoji: '🔧' },
  { id: 'emprendedores', label: 'Emprendimientos', emoji: '💡' },
];

const POPULAR_SECTORS = [
  'Av. Bermúdez & Centro',
  'San Luis & Zona Playera',
  'Casco Histórico Colonial',
  'Marina Plaza & Muelle',
  'Av. Universidad & Chaimas',
];

/**
 * Footer CumanáConecta
 * Soporta Modo Claro institucional y Modo Oscuro fiel a la Foto 3 de referencia.
 */
export default function Footer({
  onOpenPricing,
  onSelectCategory,
  onSelectQuery,
  onOpenEmergency,
  onNavigateAdmin,
}) {
  const { isDark } = useTheme();

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) onSelectCategory(catId);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchClick = (term) => {
    if (onSelectQuery) onSelectQuery(term);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={`w-full pt-10 sm:pt-14 pb-28 md:pb-14 border-t font-['Inter'] transition-colors duration-300 ${
      isDark
        ? 'bg-[#101114] text-slate-300 border-[#22242c]'
        : 'bg-[#131b2e] text-slate-300 border-slate-800/80'
    }`}>
      <div className="max-w-4xl lg:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* ─── Grid Principal ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 xl:gap-12 text-center lg:text-left items-start">
          
          {/* ═════════════════════════════════════════════════════════════════
              1. Identidad de Marca y Reseña Institucional (Columna 1 en Desktop)
             ═════════════════════════════════════════════════════════════════ */}
          <div className="order-1 lg:order-2 lg:col-span-5 space-y-4 max-w-xl mx-auto lg:mx-0 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 ${
                  isDark
                    ? 'bg-[#eab308] text-slate-950 font-black text-2xl font-[\'Outfit\']'
                    : 'bg-[#00a896] text-white'
                }`}
              >
                {isDark ? 'C' : <Building2 size={24} className="text-white" />}
              </div>
              <span className="font-['Outfit'] font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                Cumaná<span className={isDark ? 'text-[#facc15]' : 'text-[#00a896]'}>Conecta</span>
              </span>
            </div>

            {/* Misión y Lema */}
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg lg:max-w-none">
              Plataforma digital de conexión comercial, turística y de servicios para la ciudad de <strong className="text-slate-200">Cumaná, Estado Sucre, Venezuela</strong>. Apoyando el comercio local con pagos en <strong className="text-amber-400">Cashea</strong>, Pago Móvil y contacto directo.
            </p>

            {/* Badges de Identidad Local */}
            <div className="pt-1 flex flex-col items-center lg:items-start gap-2 w-full">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] sm:text-xs text-slate-300 shadow-2xs ${
                isDark ? 'bg-[#18191d] border-[#2b2d35]' : 'bg-[#1e293b] border-slate-700/60'
              }`}>
                <MapPin size={13} className="text-amber-400 flex-shrink-0" />
                <span>Primogénita del Continente Americano • Fundada en 1515</span>
              </span>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              2. Banner CTA: ¿Tienes un comercio o servicio en Cumaná?
             ═════════════════════════════════════════════════════════════════ */}
          <div className="order-2 lg:order-1 lg:col-span-12 max-w-2xl lg:max-w-none mx-auto w-full">
            <div className={`p-5 sm:p-6 lg:p-7 rounded-2xl border shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${
              isDark
                ? 'bg-gradient-to-r from-[#18191d] via-[#1e2026] to-[#252830] border-[#383c48]'
                : 'bg-gradient-to-r from-[#003844] via-[#004754] to-[#005566] border-[#006e70]/40'
            }`}>
              <div className="space-y-1">
                <h5 className="font-['Outfit'] font-bold text-sm sm:text-base lg:text-lg text-white flex items-center justify-center sm:justify-start gap-2">
                  <Sparkles size={18} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                  <span>¿Tienes un comercio o servicio en Cumaná?</span>
                </h5>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-[#8bd1e8]'}`}>
                  Aparece en los primeros resultados de la ciudad con tu plan VIP y capta más clientes.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-['Inter'] font-black text-xs sm:text-sm text-slate-950 transition-all hover:brightness-105 active:scale-95 flex-shrink-0 shadow-md cursor-pointer text-center bg-[#eab308] hover:bg-[#ca8a04]"
              >
                Sumar mi Negocio
              </button>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              3. Sectores Populares (Columna 2 en Desktop - estilo Foto 3)
             ═════════════════════════════════════════════════════════════════ */}
          <div className="order-4 lg:order-3 lg:col-span-3 space-y-3.5 max-w-2xl mx-auto lg:mx-0 w-full">
            <h4 className="font-['Outfit'] font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center justify-center lg:justify-start gap-1.5 pb-0.5">
              <Compass size={15} />
              <span>Sectores Populares</span>
            </h4>

            <div className="flex flex-col space-y-2">
              {POPULAR_SECTORS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleSearchClick(sec)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs text-slate-300 hover:text-white transition-all cursor-pointer text-left ${
                    isDark
                      ? 'bg-[#18191d]/80 hover:bg-[#22242c] border-[#282a32] hover:border-amber-400/40'
                      : 'bg-[#1a2338]/60 hover:bg-[#1e293b] border-slate-700/40 hover:border-[#00a896]/60'
                  }`}
                >
                  <span className="font-medium">{sec}</span>
                  <ChevronRight size={13} className="text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              4. Comercios & Soporte (Columna 3 en Desktop - estilo Foto 3)
             ═════════════════════════════════════════════════════════════════ */}
          <div className="order-5 lg:order-4 lg:col-span-4 space-y-3.5 max-w-2xl mx-auto lg:mx-0 w-full">
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 pb-0.5 font-['Outfit']">
              <Tag size={14} />
              <span>Comercios & Soporte</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <button
                type="button"
                onClick={onOpenPricing}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#221f15] hover:bg-[#2d281a] border border-[#45371c] text-[#f59e0b] font-bold flex items-center justify-between transition cursor-pointer text-left"
              >
                <span>+ Sumar mi Negocio</span>
                <ChevronRight size={14} />
              </button>

              <button
                type="button"
                onClick={onOpenEmergency}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#2a1417] hover:bg-[#381a1e] border border-[#4c1d24] text-[#fb7185] font-bold flex items-center justify-between transition cursor-pointer text-left"
              >
                <span>Directorio de Emergencias</span>
                <PhoneCall size={14} />
              </button>

              <div className="p-3 rounded-xl bg-[#18191d] border border-[#282a32] text-slate-400 text-[11px] leading-relaxed">
                📍 Cumaná, Estado Sucre • Venezuela<br />
                Plataforma de catálogo comercial independiente.
              </div>
            </div>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════════
            5. Copyright & Créditos Institucionales con Acceso Admin
           ═════════════════════════════════════════════════════════════════ */}
        <div className={`mt-8 sm:mt-10 pt-6 border-t text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
          isDark ? 'border-[#22242c] text-slate-500' : 'border-slate-800/80 text-slate-400'
        }`}>
          <p>
            © 2026 <strong className="text-slate-200">CumanáConecta</strong> • Hecho con orgullo para la Primogénita del Continente Americano.
          </p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>Estado Sucre • Venezuela</span>
            <span>•</span>
            <a
              href="/panel-admin"
              onClick={(e) => {
                e.preventDefault();
                if (onNavigateAdmin) {
                  onNavigateAdmin();
                } else {
                  window.history.pushState(null, '', '/panel-admin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold"
              title="Panel de Administración"
            >
              <Lock size={12} className="text-amber-400" />
              <span>Panel Admin</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

