'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Bike, 
  Tag, 
  MapPin, 
  Camera, 
  ExternalLink,
  MessageCircle,
  Network
} from 'lucide-react';
import { Business } from '@/types/business';

interface FeaturedSpotlightCarouselProps {
  businesses: Business[];
  onOpenListing: (biz: Business) => void;
}

export function FeaturedSpotlightCarousel({
  businesses,
  onOpenListing
}: FeaturedSpotlightCarouselProps) {
  // Filtrar comercios destacados o VIP
  const featuredBusinesses = businesses.filter(b => b.tier === 'vip' || b.isVerified);
  const items = featuredBusinesses.length > 0 ? featuredBusinesses : businesses;

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = items[currentIndex % items.length];

  if (!current) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };

  const photosCount = (current.gallery?.length || 0) + 1;
  const isMultiBranch = Boolean(current.hasBranches && current.branches && current.branches.length > 1);

  return (
    <section className="w-full my-10 space-y-4">
      {/* Cabecera del Carrusel */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-[#004655] dark:text-[#fbbf24] font-bold block">
            VITRINA PATROCINADA • SELECCIÓN OFICIAL
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comercios Destacados de Cumaná
          </h2>
        </div>

        {/* Paginación Monoespaciada y Controles */}
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono-tabular font-bold text-slate-500 dark:text-slate-400 tracking-wider">
            {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Anterior comercio destacado"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente comercio destacado"
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Principal de la Tarjeta Destacada */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#222630] bg-white dark:bg-[#11141a] p-5 sm:p-6 shadow-xl transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          
          {/* Columna Izquierda: Fotografía (5 cols) */}
          <div className="lg:col-span-5 relative h-[260px] sm:h-[310px] rounded-xl overflow-hidden group bg-slate-900 shrink-0">
            <img
              src={current.heroImage}
              alt={current.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <Link
              href={`/local/${current.slug}`}
              className="absolute inset-0 z-0"
              aria-label={`Explorar ficha de ${current.name}`}
            />

            {/* Badges superiores en la imagen */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                DESTACADO OFICIAL
              </span>
              <span className="px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                {current.category}
              </span>
            </div>

            {/* Conteo de fotos abajo a la derecha */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-slate-200 text-[10px] font-mono-tabular font-bold border border-white/20 flex items-center gap-1.5 shadow-sm pointer-events-none">
              <Camera className="w-3.5 h-3.5 text-amber-400" strokeWidth={2} />
              <span>{photosCount} fotos</span>
            </div>
          </div>

          {/* Columna Derecha: Contenido y Acciones (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Fila Superior de Badges Operativos */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span suppressHydrationWarning className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  current.isOpenNow
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/60'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${current.isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span>{current.isOpenNow ? 'Abierto Ahora' : 'Cerrado'}</span>
                </span>

                {current.isVerified && (
                  <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600 dark:text-blue-400" strokeWidth={2} />
                    <span>Verificado</span>
                  </span>
                )}
              </div>

              {current.amenities.includes('delivery') && (
                <span className="text-[#004655] dark:text-[#fbbf24] text-xs font-bold flex items-center gap-1.5">
                  <Bike className="w-4 h-4" strokeWidth={2} />
                  <span>Servicio Delivery</span>
                </span>
              )}
            </div>

            {/* Título y Eslogan */}
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                <Link href={`/local/${current.slug}`} className="hover:underline">
                  {current.name}
                </Link>
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#004655] dark:text-[#fbbf24] leading-snug">
                {current.tagline}
              </p>
            </div>

            {/* Descripción */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
              {current.description}
            </p>

            {/* Caja de Promoción Activa */}
            {current.promotion && current.promotion.isActive && (
              <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#004655]/10 dark:bg-amber-500/15 border border-[#004655]/20 dark:border-amber-500/30 text-[#004655] dark:text-amber-400 shrink-0">
                  <Tag className="w-4 h-4" strokeWidth={2} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {current.promotion.title}
                    </h4>
                    {isMultiBranch ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40 text-[9px] font-mono-tabular font-extrabold uppercase tracking-wide">
                        CADENA 3 SEDES
                      </span>
                    ) : (
                      current.promotion.discountBadge && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/40 text-[9px] font-mono-tabular font-extrabold uppercase tracking-wide">
                          {current.promotion.discountBadge}
                        </span>
                      )
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                    {current.promotion.description}
                  </p>
                </div>
              </div>
            )}

            {/* Dirección */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <MapPin className="w-4 h-4 text-[#004655] dark:text-[#fbbf24] shrink-0" strokeWidth={2} />
              <span className="truncate">
                {current.zone}: {current.address}
              </span>
            </div>

            {/* Botones de Acción */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={`/local/${current.slug}`}
                className="flex-1 px-5 h-11 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-[#fbbf24] dark:hover:bg-amber-300 dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>
                  {isMultiBranch ? 'Ver 3 Sucursales y Catálogo' : 'Explorar Ficha Completa'}
                </span>
                <ExternalLink className="w-4 h-4" strokeWidth={2} />
              </Link>

              <a
                href={current.socials?.whatsapp || `https://wa.me/584120000000?text=Hola%20${encodeURIComponent(current.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 h-11 rounded-xl border border-emerald-600 hover:bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:hover:bg-emerald-500/10 dark:text-emerald-400 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2} />
                <span>WhatsApp Directo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
