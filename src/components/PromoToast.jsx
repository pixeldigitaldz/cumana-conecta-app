import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  MapPin,
  Tag,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { businesses } from '../data/mockBusinessData';

/**
 * Sintetizador Web Audio API: Genera un tono de campana suave y cristalino.
 */
function playSoftNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.06, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now + 0.06);
    gain2.gain.setValueAtTime(0, now + 0.06);
    gain2.gain.linearRampToValueAtTime(0.07, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.35);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.5);
  } catch (e) {
    console.debug('Audio notification error:', e);
  }
}

/**
 * PromoToast — Notificación flotante ultra-compacta y elegante
 */
export default function PromoToast({ onSelectBusiness }) {
  const { isDark } = useTheme();

  const promoBusinesses = businesses.filter(
    (b) => b.activePromotion && b.isFeatured
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('cumana_sound_alerts') !== 'false';
  });

  const toggleSound = (e) => {
    e.stopPropagation();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('cumana_sound_alerts', String(next));
    if (next) playSoftNotificationSound();
  };

  const triggerNotification = useCallback((index) => {
    setCurrentIndex(index);
    setIsVisible(true);
    if (soundEnabled) playSoftNotificationSound();
  }, [soundEnabled]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      if (!isDismissed) triggerNotification(0);
    }, 2800);
    return () => clearTimeout(initialTimer);
  }, [isDismissed, triggerNotification]);

  useEffect(() => {
    if (isDismissed || isPaused || promoBusinesses.length === 0) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % promoBusinesses.length;
          triggerNotification(nextIndex);
          return nextIndex;
        });
      }, 400);
    }, 24000);

    return () => clearInterval(interval);
  }, [isDismissed, isPaused, promoBusinesses.length, triggerNotification]);

  if (promoBusinesses.length === 0 || isDismissed || !isVisible) {
    return null;
  }

  const currentBusiness = promoBusinesses[currentIndex] || promoBusinesses[0];

  const handleOpenModal = () => {
    if (onSelectBusiness) {
      onSelectBusiness(currentBusiness);
    }
  };

  return (
    <aside
      aria-label="Nueva promoción en Cumaná"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`fixed bottom-16 md:bottom-4 right-3 sm:right-6 z-40 w-[290px] sm:w-[320px] rounded-xl overflow-hidden shadow-xl transition-all duration-300 animate-fade-in-up border ${
        isDark
          ? 'bg-[#15171c]/95 border-[#282b34] text-slate-100 backdrop-blur-md'
          : 'bg-white/95 border-slate-200/90 text-slate-800 backdrop-blur-md'
      }`}
      style={{
        boxShadow: isDark
          ? '0 10px 25px -4px rgba(0, 0, 0, 0.7), 0 0 10px rgba(245, 158, 11, 0.1)'
          : '0 10px 25px -4px rgba(0, 70, 85, 0.15)',
      }}
    >
      {/* Mini Header de Alerta */}
      <div
        className={`px-2.5 py-1.5 flex items-center justify-between gap-1.5 border-b text-[10px] font-bold ${
          isDark
            ? 'bg-[#111216] border-[#22242c] text-amber-400'
            : 'bg-amber-50/90 border-amber-100/80 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-1.5 font-['Outfit']">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
          <span className="uppercase text-[9.5px] font-black tracking-wider">
            NUEVA PROMO EN CUMANÁ
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={toggleSound}
            className={`w-5 h-5 rounded flex items-center justify-center transition cursor-pointer ${
              soundEnabled
                ? isDark ? 'text-amber-400 hover:bg-amber-400/10' : 'text-amber-800 hover:bg-amber-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title={soundEnabled ? 'Silenciar alerta' : 'Activar sonido'}
            aria-label="Silenciar o activar sonido"
          >
            {soundEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />}
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
            aria-label="Cerrar"
            title="Cerrar"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Cuerpo Compacto */}
      <div className="p-2.5 space-y-2">
        <div className="flex items-start gap-2.5">
          {/* Mini Thumbnail */}
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-700/40">
            <img
              src={currentBusiness.bannerUrl}
              alt={currentBusiness.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/cumana_panaderia_pasteleria.png';
              }}
            />
            {currentBusiness.isVerified && (
              <div className="absolute bottom-0.5 right-0.5 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-2xs">
                <CheckCircle2 size={8} className="stroke-[3]" />
              </div>
            )}
          </div>

          {/* Datos y Promo */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-['Outfit'] font-bold text-xs truncate leading-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {currentBusiness.name}
            </h4>

            <div className="flex items-center gap-1 text-[9.5px] text-slate-400 mt-0.5 truncate font-['Inter']">
              <MapPin size={9} className="text-amber-400 flex-shrink-0" />
              <span className="truncate">{currentBusiness.zone}</span>
            </div>

            <div className={`mt-1 px-1.5 py-1 rounded-md border text-[10px] font-['Inter'] flex items-start gap-1 ${
              isDark
                ? 'bg-[#201c14] border-[#3f3216] text-amber-200'
                : 'bg-amber-50 border-amber-200/80 text-amber-950'
            }`}>
              <Tag size={10} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-1 text-[10px] leading-tight font-medium">
                {currentBusiness.activePromotion}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Compacto */}
        <div className={`flex items-center justify-between gap-1.5 pt-1.5 border-t ${
          isDark ? 'border-slate-800/80' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-['Inter']">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Promo {currentIndex + 1} de {promoBusinesses.length}</span>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="h-6 px-2.5 rounded-md bg-[#eab308] hover:bg-[#ca8a04] text-slate-950 font-['Inter'] font-extrabold text-[10px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs active:scale-95 flex-shrink-0"
          >
            <span>Ver Ficha</span>
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </aside>
  );
}
