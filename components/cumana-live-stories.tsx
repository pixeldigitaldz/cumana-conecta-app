'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Utensils, 
  ShoppingBag, 
  Music, 
  X, 
  MapPin, 
  Clock
} from 'lucide-react';
import { LiveSectionConfig, LiveDispatchItem, LiveBadgeType } from '@/types/business';

interface CumanaLiveStoriesProps {
  config: LiveSectionConfig;
  className?: string;
}

export function CumanaLiveStories({ config, className = '' }: CumanaLiveStoriesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedStory, setSelectedStory] = useState<LiveDispatchItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Filtrar solo los despachos activos
  const activeItems = config.items.filter(item => item.isActive !== false);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -290 : 290;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Carrusel que va solo automáticamente (Auto-play continuo con pausa al interactuar)
  useEffect(() => {
    if (isPaused || activeItems.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // Si llegó cerca del final, regresa suavemente al inicio
        if (scrollLeft >= maxScroll - 15) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 290, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, activeItems.length]);

  if (!config.isEnabled || activeItems.length === 0) {
    return null;
  }

  // Renderizar icono de insignia según badgeType
  const renderBadgeIcon = (type: LiveBadgeType) => {
    switch (type) {
      case 'play':
        return <Play className="w-2.5 h-2.5 fill-white text-white translate-x-0.2" />;
      case 'food':
        return <Utensils className="w-2.5 h-2.5 text-white" />;
      case 'store':
        return <ShoppingBag className="w-2.5 h-2.5 text-white" />;
      case 'music':
        return <Music className="w-2.5 h-2.5 text-white" />;
      case 'live':
      default:
        return <span className="w-2 h-2 rounded-full bg-white animate-pulse" />;
    }
  };

  // Estilo de insignia según badgeType
  const getBadgeStyle = (type: LiveBadgeType) => {
    switch (type) {
      case 'play':
        return 'bg-emerald-500 ring-2 ring-emerald-500/30';
      case 'food':
        return 'bg-amber-500 ring-2 ring-amber-500/30';
      case 'store':
        return 'bg-sky-500 ring-2 ring-sky-500/30';
      case 'music':
        return 'bg-rose-500 ring-2 ring-rose-500/30';
      case 'live':
      default:
        return 'bg-rose-500 ring-2 ring-rose-500/30';
    }
  };

  // Obtener etiqueta editorial según badgeType o nombre
  const getCategoryLabel = (item: LiveDispatchItem) => {
    switch (item.badgeType) {
      case 'food':
        return 'GASTRO';
      case 'play':
        return 'PLAYA';
      case 'store':
        return 'COMERCIO';
      case 'music':
        return 'NOCTURNO';
      case 'live':
      default:
        return item.location?.toLowerCase().includes('playa') ? 'PLAYA' : 'EN VIVO';
    }
  };

  return (
    <>
      <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10 ${className}`}>
        {/* Dock Horizontal Editorial adaptado a la maqueta y nueva paleta */}
        <div 
          className="relative rounded-[28px] sm:rounded-[32px] bg-white/95 dark:bg-[#0c131f]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#1a2538] p-3.5 sm:p-5 shadow-sm dark:shadow-2xl overflow-hidden transition-all"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Acentos de fondo sutiles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-5">
            {/* Columna Izquierda: Estatus en Vivo */}
            <div className="flex items-center justify-between lg:flex-col lg:items-start lg:justify-center shrink-0 lg:w-52">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                  <span>EN DIRECTO</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {config.title || 'Cumaná en Vivo'}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight hidden sm:block mt-0.5">
                  {config.subtitle || 'Despachos visuales de las últimas 6 horas'}
                </p>
              </div>

              {/* Controles de Navegación < > */}
              <div className="flex items-center gap-1.5 lg:mt-3">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  aria-label="Desplazar a la izquierda"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#121b28] dark:hover:bg-[#1a2638] text-slate-700 dark:text-slate-300 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-[#1e2d42] transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  aria-label="Desplazar a la derecha"
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#121b28] dark:hover:bg-[#1a2638] text-slate-700 dark:text-slate-300 dark:hover:text-white flex items-center justify-center border border-slate-200 dark:border-[#1e2d42] transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Separador vertical sutil (Visible en desktop según la maqueta) */}
            <div className="hidden lg:block w-px self-stretch bg-slate-200/80 dark:bg-[#1a2538]" />

            {/* Fila Derecha de Tarjetas Horizontales (Carrusel Automático que va solo) */}
            <div
              ref={scrollRef}
              className="flex items-center gap-3 overflow-x-auto py-1 scroll-smooth select-none focus:outline-none scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 min-w-0"
            >
              {activeItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedStory(item)}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-50/90 dark:bg-[#111926]/90 hover:bg-white dark:hover:bg-[#162234] border border-slate-200/90 dark:border-[#1b273b] hover:border-amber-400/50 dark:hover:border-amber-400/50 transition-all cursor-pointer group shrink-0 w-64 sm:w-72 text-left shadow-2xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none"
                >
                  {/* Miniatura Cuadrada Redondeada */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    
                    {/* Insignia circular en la esquina inferior derecha de la foto */}
                    <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-xs ${getBadgeStyle(item.badgeType)}`}>
                      {renderBadgeIcon(item.badgeType)}
                    </div>
                  </div>

                  {/* Información Editorial */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
                        {getCategoryLabel(item)}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                        • {item.location ? item.location.split(',')[0] : 'Cumaná'}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors truncate">
                      {item.name}
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{item.subtitle}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* MODAL VISOR DE DESPACHO EN VIVO / HISTORIA */}
      {/* ============================================================== */}
      {selectedStory && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0e1624] rounded-3xl border border-[#1e2d42] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Imagen Principal del Despacho */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedStory.imageUrl}
                alt={selectedStory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1624] via-transparent to-black/40" />

              {/* Tag Live en la foto */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>Despacho en Vivo • Cumaná</span>
              </div>
            </div>

            {/* Contenido del Despacho */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{selectedStory.name}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedStory.subtitle}</span>
                  </span>
                  {selectedStory.location && (
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{selectedStory.location}</span>
                    </span>
                  )}
                </div>
              </div>

              {selectedStory.description && (
                <p className="text-sm text-slate-300 leading-relaxed font-normal bg-[#131d2c] p-3.5 rounded-2xl border border-[#1d2c42]">
                  {selectedStory.description}
                </p>
              )}

              {/* Botón de acción */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs active:scale-95 transition-all text-center cursor-pointer shadow-sm"
                >
                  Continuar Explorando Cumaná
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
