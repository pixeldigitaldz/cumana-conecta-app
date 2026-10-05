import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Camera,
  Bike,
  Tag,
  MapPin,
  ExternalLink,
  MessageCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { buildWhatsAppUrl, isBusinessOpen } from '../data/mockBusinessData';
import { WhatsAppIcon } from './SocialIcons';

/**
 * FeaturedSpotlightCarousel — Vitrina de Anuncios Destacados de Cumaná
 * Ubicación: Entre los filtros y el catálogo de Comercios Destacados.
 * Diseñado con réplica fiel del estilo editorial humano y soporte total oscuro/claro.
 */
export default function FeaturedSpotlightCarousel({
  businesses = [],
  onSelect,
}) {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoModalBusiness, setVideoModalBusiness] = useState(null);

  // Filtrar solo los comercios aptos para el spotlight
  const items = businesses && businesses.length > 0 ? businesses : [];

  const handleNext = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Rotación automática cada 6.5s (pausible en hover)
  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const interval = setInterval(handleNext, 6500);
    return () => clearInterval(interval);
  }, [isPaused, items.length, handleNext]);

  // Si el índice supera la cantidad al cambiar la lista
  useEffect(() => {
    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex] || items[0];
  const isOpen = isBusinessOpen(currentItem);
  const waUrl = buildWhatsAppUrl(
    currentItem.whatsapp,
    currentItem.name,
    currentItem.spotlightPromoTitle || currentItem.activePromotion
  );

  // Helper para embed de YouTube si tiene video
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1` : url;
  };

  return (
    <section
      className="mb-10 w-full"
      aria-label="Comercios Destacados de Cumaná"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ─── Encabezado del Carrusel ─── */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
              isDark
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'bg-amber-100 text-amber-600 border border-amber-200'
            }`}
          >
            <Sparkles size={18} className="fill-current" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                className={`font-['Outfit'] font-black text-lg sm:text-xl tracking-tight leading-none ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                Comercios Destacados de Cumaná
              </h2>
              <span className="bg-[#ea580c] text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs uppercase tracking-wide">
                Recomendados
              </span>
            </div>
            <p className={`text-[11px] sm:text-xs font-['Inter'] mt-0.5 font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Establecimientos verificados con beneficios y promociones activas
            </p>
          </div>
        </div>

        {/* Controles de Navegación & Contador */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-slate-400 font-['Inter'] tracking-wider hidden sm:inline-block">
            {currentIndex + 1} / {items.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={items.length <= 1}
              aria-label="Comercio anterior"
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                isDark
                  ? 'border-slate-700/80 bg-[#1e2026] text-slate-200 hover:bg-[#282b33] disabled:opacity-40 disabled:cursor-not-allowed'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={items.length <= 1}
              aria-label="Comercio siguiente"
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                isDark
                  ? 'border-slate-700/80 bg-[#1e2026] text-slate-200 hover:bg-[#282b33] disabled:opacity-40 disabled:cursor-not-allowed'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tarjeta Principal de Anuncio Destacado ─── */}
      <div
        className={`relative rounded-[26px] border-2 transition-all duration-300 p-4 sm:p-6 shadow-sm overflow-hidden ${
          isDark
            ? 'bg-[#18191d] border-teal-500/30 hover:border-teal-500/45'
            : 'bg-white border-[#5eead4]/80 hover:border-[#2dd4bf] shadow-md/5'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-center"
          >
            {/* ── Columna Izquierda: Fotografía & Badges Superpuestos ── */}
            <div className="lg:col-span-5 relative w-full rounded-2xl overflow-hidden shadow-xs h-[250px] sm:h-[300px] lg:h-[360px] bg-slate-900 group">
              <img
                src={
                  currentItem.bannerUrl ||
                  currentItem.photos?.[0] ||
                  'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80'
                }
                alt={currentItem.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />

              {/* Degradado para garantizar legibilidad de los badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35 pointer-events-none" />

              {/* Badges Superiores */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap pointer-events-none">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#f59e0b] text-white shadow-md uppercase tracking-wider">
                    <span>★</span>
                    <span>Patrocinado Destacado</span>
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-black/65 backdrop-blur-xs text-white">
                    {currentItem.categoryLabel || 'Gastronomía & Mariscos'}
                  </span>
                </div>
              </div>

              {/* Badges Inferiores: Botón Video y Contador de Fotos */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
                {currentItem.videoTourUrl ? (
                  <button
                    type="button"
                    onClick={() => setVideoModalBusiness(currentItem)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-slate-900 shadow-md hover:bg-white hover:scale-105 active:scale-95 transition cursor-pointer font-['Inter']"
                  >
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] shadow-2xs">
                      <Play size={8} className="fill-current ml-0.5" />
                    </span>
                    <span>Ver Video: Cómo llegar</span>
                  </button>
                ) : (
                  <div />
                )}

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/65 backdrop-blur-xs text-white shadow-xs">
                  <Camera size={12} />
                  <span>{currentItem.photos?.length || 4} fotos</span>
                </span>
              </div>
            </div>

            {/* ── Columna Derecha: Información Editorial, Oferta y Acciones ── */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-3.5">
              {/* Fila de Estados Superiores */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {isOpen ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isDark
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-2xs'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-emerald-400' : 'bg-emerald-600'
                        } animate-pulse`}
                      />
                      <span>Abierto Ahora</span>
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isDark
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                          : 'bg-rose-100 text-rose-900 border-rose-300 shadow-2xs'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isDark ? 'bg-rose-400' : 'bg-rose-600'
                        }`}
                      />
                      <span>Cerrado</span>
                      <span
                        className={`text-[11px] font-semibold ml-1 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        Abre hoy a las 11:00 AM
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      isDark
                        ? 'bg-teal-950/80 text-teal-300 border-teal-500/50'
                        : 'bg-teal-100 text-teal-950 border-teal-300 shadow-2xs'
                    }`}
                  >
                    <Bike size={14} className={isDark ? 'text-teal-400' : 'text-teal-700'} />
                    <span>Delivery Activo</span>
                  </span>
                </div>
              </div>

              {/* Título & Slogan */}
              <div>
                <h3
                  className={`font-['Outfit'] font-black text-2xl sm:text-3xl tracking-tight leading-tight ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {currentItem.name}
                </h3>
                {currentItem.spotlightTagline && (
                  <p
                    className={`font-['Inter'] font-bold text-xs sm:text-sm italic mt-1 ${
                      isDark ? 'text-cyan-300' : 'text-[#005f73]'
                    }`}
                  >
                    "{currentItem.spotlightTagline}"
                  </p>
                )}
              </div>

              {/* Reseña / Descripción */}
              <p
                className={`text-xs sm:text-sm font-['Inter'] leading-relaxed line-clamp-3 sm:line-clamp-4 font-normal ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {currentItem.description}
              </p>

              {/* Caja de Promoción Destacada (Combo / Oferta) */}
              <div
                className={`rounded-2xl p-3.5 sm:p-4 border flex items-start gap-3 shadow-sm ${
                  isDark
                    ? 'bg-[#231e13] border-amber-700/60 text-amber-100'
                    : 'bg-[#fffbeb] border-amber-300 text-slate-900'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#ea580c] text-white flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                  <Tag size={16} className="fill-current" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-['Outfit'] font-extrabold text-xs sm:text-sm ${
                        isDark ? 'text-amber-200' : 'text-slate-950'
                      }`}
                    >
                      {currentItem.spotlightPromoTitle || currentItem.activePromotion || 'Combo Especial Recomendado'}
                    </span>
                    <span className="bg-[#ea580c] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
                      {currentItem.spotlightPromoBadge || 'RECOMENDADO'}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-['Inter'] mt-1 leading-relaxed font-medium ${
                      isDark ? 'text-amber-100/90' : 'text-slate-800'
                    }`}
                  >
                    {currentItem.spotlightPromoDesc ||
                      'Aprovecha promociones exclusivas para Cumaná con diversos métodos de pago.'}
                  </p>
                </div>
              </div>

              {/* Ubicación y Dirección */}
              <div className="flex items-start gap-2 text-xs font-['Inter']">
                <MapPin
                  size={16}
                  className={`${isDark ? 'text-cyan-400' : 'text-[#005f73]'} flex-shrink-0 mt-0.5`}
                />
                <p className="leading-snug">
                  <strong className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {currentItem.zone}:
                  </strong>{' '}
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    {currentItem.address}
                  </span>
                </p>
              </div>

              {/* Botones de Acción (Ficha Completa & WhatsApp) */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelect && onSelect(currentItem)}
                  className="flex-1 h-11 px-5 rounded-xl font-['Inter'] font-bold text-xs sm:text-sm text-white bg-[#0f4c81] hover:bg-[#0c3c66] flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <span>Ver Ficha Completa</span>
                  <ExternalLink size={15} />
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:w-auto h-11 px-6 rounded-xl font-['Inter'] font-bold text-xs sm:text-sm border border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <WhatsAppIcon size={17} className="text-emerald-500 flex-shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── Puntos Indicadores Inferiores ─── */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-4 sm:pt-5">
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir al comercio ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-[#0f4c81] dark:bg-cyan-400'
                    : 'w-2 h-2 bg-slate-300/80 dark:bg-slate-700 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── Modal de Video de Ruta "Cómo Llegar" ─── */}
      {videoModalBusiness && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#18191d] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h4 className="font-['Outfit'] font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Video Guía: Cómo llegar a {videoModalBusiness.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalBusiness(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              {getEmbedUrl(videoModalBusiness.videoTourUrl) ? (
                <iframe
                  src={getEmbedUrl(videoModalBusiness.videoTourUrl)}
                  title={`Video tour de ${videoModalBusiness.name}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Video no disponible
                </div>
              )}
            </div>

            <div className="p-4 flex items-center justify-between gap-3 bg-slate-50 dark:bg-[#121316]">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-['Inter'] truncate">
                📍 {videoModalBusiness.zone} — {videoModalBusiness.address}
              </p>
              <button
                type="button"
                onClick={() => {
                  setVideoModalBusiness(null);
                  onSelect && onSelect(videoModalBusiness);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0f4c81] hover:bg-[#0c3c66] transition cursor-pointer whitespace-nowrap"
              >
                Ver Ficha Completa
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
