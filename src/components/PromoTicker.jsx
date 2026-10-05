import { useState, useEffect } from 'react';
import {
  MapPin,
  Volume2,
  VolumeX,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { businesses } from '../data/mockBusinessData';

/**
 * Sintetizador Web Audio API: Genera un tono sutil al actualizar la promoción.
 */
function playSoftChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch {}
}

export default function PromoTicker({ onSelectBusiness }) {
  const { isDark } = useTheme();

  const promoBusinesses = businesses.filter(
    (b) => b.activePromotion && b.isFeatured
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('cumana_sound_alerts') === 'true';
  });

  const toggleSound = (e) => {
    e.stopPropagation();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('cumana_sound_alerts', String(next));
    if (next) playSoftChime();
  };

  // Rotación automática como noticiero en vivo
  useEffect(() => {
    if (isDismissed || isPaused || promoBusinesses.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % promoBusinesses.length;
        if (soundEnabled) playSoftChime();
        return next;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isDismissed, isPaused, promoBusinesses.length, soundEnabled]);

  if (promoBusinesses.length === 0 || isDismissed) return null;

  const current = promoBusinesses[currentIndex] || promoBusinesses[0];

  return (
    <div
      aria-label="Tira de promociones en vivo de Cumaná"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`w-full border-y transition-colors duration-300 relative z-30 overflow-hidden font-['Inter'] shadow-sm ${
        isDark
          ? 'bg-[#0f141c] border-[#1e2736] text-white'
          : 'bg-[#003844] border-[#00262e] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        
        {/* ─── 1. Badge Estilo Noticiero "EN VIVO" ─── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-['Outfit'] font-extrabold text-[10.5px] uppercase tracking-wider shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
            </span>
            <span>PROMOS EN VIVO</span>
          </div>

          <span className="hidden md:inline-block text-[11px] font-bold text-teal-200/90">
            {currentIndex + 1}/{promoBusinesses.length}
          </span>
        </div>

        {/* ─── 2. Contenido del Ticker (Fila con Alto Contraste & Letras Negritas) ─── */}
        <div className="flex-1 min-w-0 flex items-center gap-2.5 overflow-hidden">
          <div
            key={current.id}
            className="flex items-center gap-2 truncate animate-fade-in cursor-pointer group"
            onClick={() => onSelectBusiness && onSelectBusiness(current)}
          >
            {/* Nombre del Comercio */}
            <span className="font-['Outfit'] font-extrabold text-xs sm:text-[13.5px] text-amber-300 group-hover:text-amber-200 group-hover:underline flex-shrink-0 drop-shadow-2xs">
              {current.name}
            </span>

            {/* Zona */}
            <span className="text-teal-200 text-[11px] font-semibold hidden sm:inline-flex items-center gap-1 flex-shrink-0 bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">
              <MapPin size={10} className="text-amber-300" />
              <span>{current.zone}</span>
            </span>

            <span className="text-teal-400/60 hidden sm:inline font-bold">•</span>

            {/* Promoción (Letras Claras y Nítidas) */}
            <span className="truncate text-xs sm:text-[12.5px] font-semibold text-white group-hover:text-amber-100 transition-colors">
              {current.activePromotion}
            </span>
          </div>
        </div>

        {/* ─── 3. Acciones Rápidas del Ticker ─── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => onSelectBusiness && onSelectBusiness(current)}
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-['Outfit'] font-extrabold text-[11px] flex items-center gap-1 transition shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Ver Ficha</span>
            <ChevronRight size={13} className="stroke-[3]" />
          </button>

          {/* Botón de Sonido */}
          <button
            type="button"
            onClick={toggleSound}
            className={`w-6 h-6 rounded-md flex items-center justify-center transition cursor-pointer ${
              soundEnabled
                ? 'text-amber-300 bg-white/10'
                : 'text-teal-200/60 hover:text-white hover:bg-white/10'
            }`}
            title={soundEnabled ? 'Silenciar avisos' : 'Activar sonido sutil'}
            aria-label="Silenciar avisos"
          >
            {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* Cerrar Ticker */}
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-teal-200/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Ocultar barra de promociones"
            aria-label="Ocultar barra de promociones"
          >
            <X size={13} />
          </button>
        </div>

      </div>
    </div>
  );
}
