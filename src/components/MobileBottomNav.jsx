import {
  Search,
  Compass,
  Sparkles,
  PhoneCall,
  PlusCircle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CasheaIcon } from './CasheaLogo';

/**
 * MobileBottomNav — Barra de Navegación Fija Inferior para Smartphones
 * Soporta modo claro y modo oscuro.
 */
export default function MobileBottomNav({
  isCasheaActive = false,
  onSearchClick,
  onRubrosClick,
  onCasheaClick,
  onEmergencyClick,
  onPricingClick,
}) {
  const { isDark } = useTheme();

  return (
    <nav
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-md border-t pb-safe transition-colors duration-300 ${
        isDark
          ? 'bg-[#16171b]/95 border-[#282a32] shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-white/95 border-slate-200/90 shadow-[0_-4px_20px_rgba(0,70,85,0.08)]'
      }`}
      aria-label="Navegación rápida inferior móvil"
    >
      <div className="max-w-md mx-auto px-2 py-1.5 grid grid-cols-5 gap-1 items-center">
        
        {/* 1. Buscar */}
        <button
          type="button"
          onClick={onSearchClick}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer active:scale-95 group ${
            isDark ? 'text-slate-300 hover:text-amber-400' : 'text-slate-600 hover:text-[#005f73]'
          }`}
          aria-label="Ir al buscador de comercios"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'group-hover:bg-amber-400/10' : 'group-hover:bg-teal-50'
          }`}>
            <Search size={19} className={isDark ? 'text-amber-400' : 'text-[#005f73]'} />
          </div>
          <span className={`text-[10px] font-['Inter'] font-semibold mt-0.5 ${
            isDark ? 'text-amber-400' : 'text-[#005f73]'
          }`}>
            Buscar
          </span>
        </button>

        {/* 2. Rubros */}
        <button
          type="button"
          onClick={onRubrosClick}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer active:scale-95 group ${
            isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-[#005f73]'
          }`}
          aria-label="Ver categorías y rubros"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'group-hover:bg-slate-800' : 'group-hover:bg-teal-50'
          }`}>
            <Compass size={19} className={isDark ? 'text-slate-300' : 'text-[#006e70]'} />
          </div>
          <span className="text-[10px] font-['Inter'] font-medium mt-0.5">
            Rubros
          </span>
        </button>

        {/* 3. Cashea */}
        <button
          type="button"
          onClick={onCasheaClick}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer active:scale-95 group ${
            isCasheaActive
              ? isDark ? 'text-[#FFE600] font-black' : 'text-slate-950 font-black'
              : isDark ? 'text-slate-400 hover:text-[#FFE600]' : 'text-slate-600 hover:text-slate-950'
          }`}
          aria-label="Filtrar comercios que aceptan Cashea"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors font-black ${
            isCasheaActive
              ? 'bg-[#FFE600] text-slate-950 shadow-xs'
              : isDark ? 'group-hover:bg-[#FFE600]/20 text-[#FFE600]' : 'group-hover:bg-[#FFE600]/30 text-slate-950'
          }`}>
            <CasheaIcon className="w-4 h-4 object-contain" />
          </div>
          <span className={`text-[10px] font-['Inter'] mt-0.5 ${isCasheaActive ? 'font-black text-[#FFE600]' : 'font-medium'}`}>
            Cashea
          </span>
        </button>

        {/* 4. SOS (Emergencias) */}
        <button
          type="button"
          onClick={onEmergencyClick}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-rose-500 hover:text-rose-400 transition-colors cursor-pointer active:scale-95 group"
          aria-label="Abrir directorio de emergencias 171"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'bg-[#2a1417] group-hover:bg-[#381a1e]' : 'bg-rose-50 group-hover:bg-rose-100'
          }`}>
            <PhoneCall size={18} className="text-rose-500 animate-pulse" />
          </div>
          <span className="text-[10px] font-['Outfit'] font-extrabold mt-0.5 tracking-wide">
            SOS
          </span>
        </button>

        {/* 5. Anunciar (Sumar Negocio) */}
        <button
          type="button"
          onClick={onPricingClick}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors cursor-pointer active:scale-95 group ${
            isDark ? 'text-amber-400 hover:text-amber-300' : 'text-slate-600 hover:text-[#005f73]'
          }`}
          aria-label="Sumar mi negocio o ver planes"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isDark ? 'group-hover:bg-amber-400/10' : 'group-hover:bg-teal-50'
          }`}>
            <PlusCircle size={19} className={isDark ? 'text-amber-400' : 'text-[#005f73]'} />
          </div>
          <span className="text-[10px] font-['Inter'] font-semibold mt-0.5">
            Anunciar
          </span>
        </button>

      </div>
    </nav>
  );
}

