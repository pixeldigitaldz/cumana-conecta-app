'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Bike, 
  Tag, 
  MapPin, 
  Heart, 
  Share2, 
  Check,
  Phone, 
  ChevronRight,
  Network
} from 'lucide-react';
import { Business } from '@/types/business';
import { is24HoursSchedule } from '@/lib/business-hours';
import { shareBusinessExecutive } from '@/lib/share-utils';

interface BusinessCardProps {
  business: Business;
  onOpenListing: (biz: Business) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
  onOpenShare?: (biz: Business, e?: React.MouseEvent) => void;
  onOpenCasheaModal?: (biz: Business, e?: React.MouseEvent) => void;
}

export function BusinessCard({
  business,
  onOpenListing,
  isFavorite,
  onToggleFavorite,
  onOpenShare,
  onOpenCasheaModal,
}: BusinessCardProps) {
  const isDestacado = business.tier === 'vip' || Boolean(business.isFeatured);
  const isMultiBranch = Boolean(business.hasBranches && ((business.branches && business.branches.length > 1) || business.hasBranches));
  const hasFullProfile = isDestacado || isMultiBranch;
  const is24h = is24HoursSchedule(business.openingHours);
  const acceptsCashea = business.acceptsCashea || business.paymentMethods?.includes('cashea') || business.name.toLowerCase().includes('econoqueso');
  const [isSharedFeedback, setIsSharedFeedback] = useState(false);

  const handleCardShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenShare) {
      onOpenShare(business, e);
    }
    await shareBusinessExecutive(business);
    setIsSharedFeedback(true);
    setTimeout(() => setIsSharedFeedback(false), 2000);
  };

  // Insignia superior izquierda
  const renderTopBadge = () => {
    if (isMultiBranch) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
          <Network className="w-3 h-3" strokeWidth={2.5} />
          <span>MULTI-SEDE ({business.branches?.length || 3})</span>
        </span>
      );
    }
    if (is24h) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
          <span>GUARDIA 24 HORAS</span>
        </span>
      );
    }
    if (isDestacado) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
          <span>COMERCIO DESTACADO</span>
        </span>
      );
    }
    if (business.isVerified) {
      return (
        <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-blue-300 border border-blue-500/40 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-blue-400" strokeWidth={2} />
          <span>VERIFICADO</span>
        </span>
      );
    }
    return null;
  };

  return (
    <article
      onClick={() => onOpenListing(business)}
      className={`group rounded-2xl bg-white dark:bg-[#11141a] border transition-all duration-180 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer ${
        hasFullProfile
          ? 'border-slate-200/90 dark:border-[#222630] hover:border-amber-400/50 dark:hover:border-amber-400/40'
          : 'border-slate-200 dark:border-[#222630] hover:border-slate-400 dark:hover:border-slate-600'
      }`}
    >
      {/* Cabecera de Imagen (h-44) */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={business.heroImage}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
        {hasFullProfile ? (
          <Link
            href={`/local/${business.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-0"
            aria-label={`Ver ficha completa de ${business.name}`}
          />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenListing(business);
            }}
            className="absolute inset-0 z-0 cursor-pointer w-full h-full"
            aria-label={`Ver información de ${business.name}`}
          />
        )}

        {/* Arriba a la izquierda: Badge principal */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {renderTopBadge()}
        </div>

        {/* Arriba a la derecha: Botones Share y Heart */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={handleCardShare}
            aria-label="Compartir comercio"
            title={isSharedFeedback ? "¡Enlace copiado!" : "Compartir ficha"}
            className={`w-7 h-7 rounded-md bg-black/60 backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
              isSharedFeedback 
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/50' 
                : 'border-white/20 text-white hover:text-amber-400 hover:border-amber-400'
            }`}
          >
            {isSharedFeedback ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
            ) : (
              <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => onToggleFavorite(business.id, e)}
            aria-label="Guardar en favoritos"
            className={`w-7 h-7 rounded-md bg-black/60 backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
              isFavorite
                ? 'text-rose-500 border-rose-500/60 bg-rose-950/40'
                : 'text-white border-white/20 hover:text-rose-400 hover:border-rose-400/50'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Abajo a la izquierda: Badges Abierto y Delivery */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 z-10">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md flex items-center gap-1 ${
              business.isOpenNow
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50'
                : 'bg-red-950/80 text-red-300 border-red-600/50'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                business.isOpenNow ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
              }`}
            />
            <span>{is24h ? '24/7' : business.isOpenNow ? 'Abierto' : 'Cerrado'}</span>
          </span>

          {business.amenities.includes('delivery') && (
            <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
              <Bike className="w-3 h-3 text-amber-400" strokeWidth={2} />
              <span>Delivery</span>
            </span>
          )}
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Fila superior: Rubro en mayúsculas ámbar/teal + MapPin y Zona */}
          <div className="flex items-center justify-between text-xs gap-2">
            <span 
              className="text-[10px] font-mono-tabular uppercase font-bold text-[#004655] dark:text-[#fbbf24] truncate tracking-wider"
              title={(business.categories && business.categories.length > 0 ? business.categories : [business.category]).join(' • ')}
            >
              {(business.categories && business.categories.length > 0 ? business.categories : [business.category]).join(' • ')}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 truncate shrink-0">
              <MapPin className="w-3 h-3 text-[#004655] dark:text-[#fbbf24]" strokeWidth={2} />
              <span>{business.zone}</span>
            </span>
          </div>

          {/* Nombre del comercio */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug flex items-center gap-1.5 group-hover:text-[#004655] dark:group-hover:text-[#fbbf24] transition-colors">
            {hasFullProfile ? (
              <Link 
                href={`/local/${business.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="line-clamp-1 hover:underline"
              >
                {business.name}
              </Link>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenListing(business);
                }}
                className="line-clamp-1 hover:underline text-left cursor-pointer"
              >
                {business.name}
              </button>
            )}
            {business.isVerified && (
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" strokeWidth={2} />
            )}
          </h3>

          {/* Descripción de 2 líneas */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {business.description || business.tagline}
          </p>

          {/* Caja de Promoción Activa (si tiene) */}
          {business.promotion && business.promotion.isActive && (
            <div className="rounded-xl bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] p-2 px-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#004655] dark:text-[#fbbf24] shrink-0" strokeWidth={2} />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {business.promotion.title}
              </span>
            </div>
          )}

          {/* Acceso Rápido a Cashea (si acepta) */}
          {acceptsCashea && (
            <div
              onClick={(e) => {
                if (onOpenCasheaModal) {
                  e.stopPropagation();
                  onOpenCasheaModal(business, e);
                }
              }}
              className="rounded-xl bg-amber-50/70 dark:bg-[#0b0d11] border border-amber-300 dark:border-amber-500/30 hover:border-amber-400 p-2 px-3 flex items-center justify-between text-xs transition-all group/cashea"
            >
              <div className="flex items-center gap-1.5">
                <span className="px-1 py-0.2 rounded bg-[#FFE600] text-slate-950 text-[10px] font-mono-tabular font-black">
                  c=
                </span>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Paga con Cashea{' '}
                  <span className="text-amber-600 dark:text-[#fbbf24]">
                    {business.casheaLevel || 'NIVELES 1-6'}
                  </span>
                </span>
              </div>
              <span className="text-[11px] font-mono-tabular font-bold text-amber-700 dark:text-[#FFE600] group-hover/cashea:translate-x-0.5 transition-transform flex items-center gap-0.5">
                Simular →
              </span>
            </div>
          )}

          {/* Chips de Métodos de Pago */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {acceptsCashea && (
              <span className="px-2 py-0.5 rounded-md bg-[#FFE600] text-slate-950 font-bold text-[10px] font-mono-tabular flex items-center gap-1 shadow-2xs">
                <span>c=</span>
                <span>Cashea</span>
              </span>
            )}
            {business.paymentMethods?.includes('pago_movil') && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                Pago Móvil
              </span>
            )}
            {(business.paymentMethods?.includes('efectivo_usd') || business.paymentMethods?.includes('zelle')) && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                USD / Zelle
              </span>
            )}
            {(business.paymentMethods?.includes('punto_de_venta') || business.paymentMethods?.includes('tarjeta_debito')) && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                Punto / Débito
              </span>
            )}
          </div>
        </div>

        {/* Pie de Tarjeta */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#1e222b] flex items-center justify-end gap-2">
          {/* Botones de acción */}
          <div className="flex items-center gap-2">
            {/* Botón Teléfono verde */}
            <a
              href={`tel:${business.phone || '02934310000'}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Llamar a ${business.name}`}
              className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
              title="Llamada directa"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
            </a>

            {/* Botón Ver Ficha: Destacados o Multi-sede van a /local/[slug], los demás abren ficha flotante */}
            {hasFullProfile ? (
              <Link
                href={`/local/${business.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="px-3.5 py-2 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-[#161920] dark:hover:bg-[#1f242e] border border-[#004655] dark:border-[#252934] dark:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>{isMultiBranch ? 'Ver Sedes' : 'Ver Ficha'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/80 dark:text-[#fbbf24]" strokeWidth={2} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenListing(business);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-[#161920] dark:hover:bg-[#1f242e] border border-[#004655] dark:border-[#252934] dark:text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>Ver Ficha</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/80 dark:text-[#fbbf24]" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
