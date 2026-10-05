import { useState } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle — Botoncito curioso, compacto y refinado para alternar entre tema Claro y Oscuro.
 * Ocupa un espacio mínimo en la barra de navegación, con micro-animaciones suaves y feedback táctil.
 */
export default function ThemeToggle({ className = '', variant = 'compact' }) {
  const { isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-flex items-center group">
      <button
        type="button"
        onClick={toggleTheme}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center justify-center transition-all duration-300 cursor-pointer select-none active:scale-90 ${
          variant === 'pill'
            ? 'h-9 px-2.5 rounded-full border gap-1.5'
            : 'w-10 h-10 lg:w-11 lg:h-11 rounded-xl border'
        } ${
          isDark
            ? 'bg-[#1e2026] hover:bg-[#252830] border-[#323640] text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.18)] hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]'
            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs hover:border-slate-300'
        } ${className}`}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={isDark ? 'Activar modo día (Claro)' : 'Activar modo noche (Oscuro)'}
      >
        {/* Contenedor del Icono con rotación suave */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* Sol (Modo Claro) */}
          <Sun
            size={18}
            className={`absolute transition-all duration-400 transform ${
              isDark
                ? 'opacity-0 rotate-90 scale-50 pointer-events-none text-slate-400'
                : 'opacity-100 rotate-0 scale-100 text-amber-500 hover:rotate-45'
            }`}
          />

          {/* Luna (Modo Oscuro) */}
          <Moon
            size={18}
            className={`absolute transition-all duration-400 transform ${
              isDark
                ? 'opacity-100 rotate-0 scale-100 text-amber-400 fill-amber-400/20'
                : 'opacity-0 -rotate-90 scale-50 pointer-events-none text-slate-400'
            }`}
          />

          {/* Micro destello decorativo curioso */}
          {isDark && (
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-60" />
          )}
        </div>

        {/* Etiqueta opcional si es versión pill */}
        {variant === 'pill' && (
          <span className="text-[11px] font-bold font-['Inter'] pr-0.5">
            {isDark ? 'Noche' : 'Día'}
          </span>
        )}
      </button>

      {/* Tooltip flotante refinado */}
      <span
        className={`pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 shadow-lg ${
          isDark
            ? 'bg-[#282a32] text-amber-300 border border-[#3f4350]'
            : 'bg-slate-900 text-white'
        }`}
      >
        {isDark ? '☀️ Cambiar a Modo Día' : '🌙 Cambiar a Modo Noche'}
      </span>
    </div>
  );
}
