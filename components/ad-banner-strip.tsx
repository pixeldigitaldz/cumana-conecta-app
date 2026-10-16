'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Megaphone } from 'lucide-react';
import { AdBanner } from '@/types/business';

interface AdBannerStripProps {
  adBanner?: AdBanner | null;
}

export function AdBannerStrip({ adBanner }: AdBannerStripProps) {
  // Datos del banner activo o fallback elegante y monetizable
  const banner = adBanner && adBanner.isActive ? adBanner : {
    id: 'ad-default',
    title: 'Excursiones & Lanchas Rápidas a Mochima 2026',
    subtitle: 'Zarpes diarios y privados desde Cumaná a Playa Blanca, Arapo y la Piscina Natural con capitanes certificados y chalecos salvavidas.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    linkUrl: 'https://wa.me/584128889900?text=Hola,%20deseo%20información%20sobre%20los%20tours%20a%20Mochima',
    badgeText: 'ESPACIO PATROCINADO • CUMANÁ',
    buttonText: 'Reservar Paseo en Lancha',
    isActive: true
  };

  const isExternal = banner.linkUrl.startsWith('http') || banner.linkUrl.startsWith('https://wa.me');

  return (
    <div className="w-full my-8 sm:my-12">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#11141a] border border-slate-200 dark:border-[#222630] hover:border-[#004655]/40 dark:hover:border-amber-500/40 transition-all duration-300 shadow-xl group">
        
        {/* Glow decorativo sutil en esquina */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-5 sm:p-7 md:p-8">
          
          {/* Columna Texto & CTA (7 cols en desktop) */}
          <div className="lg:col-span-7 space-y-3.5 z-10">
            {/* Kicker con indicador monoespaciado */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-[10px] font-mono-tabular font-bold text-[#004655] dark:text-amber-400 uppercase tracking-widest">
                <Megaphone className="w-3 h-3 text-[#004655] dark:text-amber-400" />
                <span>{banner.badgeText || 'ESPACIO PATROCINADO'}</span>
              </span>
              <span className="text-[10px] font-mono-tabular text-slate-500 uppercase tracking-wider">
                CUMANÁCONECTA PROMO
              </span>
            </div>

            {/* Título de impacto */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-[#004655] dark:group-hover:text-amber-300 transition-colors">
              {banner.title}
            </h3>

            {/* Subtítulo descriptivo */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
              {banner.subtitle}
            </p>

            {/* Botones de acción */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {isExternal ? (
                <a
                  href={banner.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0"
                >
                  <span>{banner.buttonText || 'Ver Más Información'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  href={banner.linkUrl}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#004655] hover:bg-[#003844] text-white dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0"
                >
                  <span>{banner.buttonText || 'Ver Más Información'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}

              <Link
                href="/planes"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161920] dark:hover:bg-[#1f232c] text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-[#252934] text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#004655] dark:text-amber-400" />
                <span>Anunciar mi comercio aquí</span>
              </Link>
            </div>
          </div>

          {/* Columna Imagen Panorámica (5 cols en desktop) */}
          <div className="lg:col-span-5 relative h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-[#252934] bg-slate-900">
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-tabular text-slate-300">
              <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10">
                Turismo & Servicios
              </span>
              <span className="text-amber-400 font-bold">
                Sucre Conectado
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
