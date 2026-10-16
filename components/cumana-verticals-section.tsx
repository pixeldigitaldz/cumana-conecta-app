'use client';

import React from 'react';
import { 
  Utensils, 
  Bed, 
  Wine, 
  Anchor, 
  Coffee, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { VerticalsSectionConfig, VerticalCategoryItem, VerticalIconType, VerticalBadgeColor } from '@/types/business';

interface CumanaVerticalsSectionProps {
  config: VerticalsSectionConfig;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export function CumanaVerticalsSection({ 
  config, 
  onSelectCategory,
  className = '' 
}: CumanaVerticalsSectionProps) {
  if (!config.isEnabled) {
    return null;
  }

  // Filtrar solo las verticales activas
  const activeItems = config.items.filter(item => item.isActive !== false);

  if (activeItems.length === 0) {
    return null;
  }

  // Iconos
  const renderIcon = (icon: VerticalIconType) => {
    switch (icon) {
      case 'utensils':
        return <Utensils className="w-4 h-4 text-[#FF6B4A]" />;
      case 'bed':
        return <Bed className="w-4 h-4 text-[#F59E0B]" />;
      case 'cocktail':
        return <Wine className="w-4 h-4 text-[#00C292]" />;
      case 'boat':
        return <Anchor className="w-4 h-4 text-[#38BDF8]" />;
      case 'coffee':
      default:
        return <Coffee className="w-4 h-4 text-[#F97316]" />;
    }
  };

  // Colores de insignias
  const getBadgeClasses = (color: VerticalBadgeColor) => {
    switch (color) {
      case 'teal':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      case 'amber':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'slate':
        return 'bg-slate-700/60 text-slate-200 border-slate-600/40';
      case 'indigo':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'green':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'coral':
      default:
        return 'bg-[#FF6B4A]/20 text-[#FF8566] border-[#FF6B4A]/30';
    }
  };

  const handleCardClick = (item: VerticalCategoryItem) => {
    if (onSelectCategory) {
      onSelectCategory(item.targetCategory || item.title);
    }
  };

  return (
    <section className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${className}`}>
      {/* Encabezado de Sección */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-black tracking-widest text-[#FF6B4A] uppercase block mb-1">
            {config.tagline || 'ECOSISTEMA URBANO & MARÍTIMO'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {config.title || 'Explora por Verticales'}
          </h2>
        </div>

        {config.counterText && (
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {config.counterText}
          </span>
        )}
      </div>

      {/* Grid de Tarjetas de Verticales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {activeItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-72 sm:h-80 flex flex-col justify-between p-4.5 select-none hover:-translate-y-1"
          >
            {/* Foto de Fondo con Overlay Oscuro */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.85] group-hover:brightness-[0.95]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/35" />
            </div>

            {/* Fila Superior: Icono (Izquierda) + Badge (Derecha) */}
            <div className="relative z-10 flex items-center justify-between w-full">
              {/* Caja de Icono */}
              <div className="w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-xs">
                {renderIcon(item.icon)}
              </div>

              {/* Insignia / Tag */}
              {item.badgeText && (
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${getBadgeClasses(
                    item.badgeColor
                  )}`}
                >
                  {item.badgeText}
                </span>
              )}
            </div>

            {/* Fila Inferior: Título, Subtítulo y Enlace CTA */}
            <div className="relative z-10 space-y-1">
              <h3 className="text-lg font-black text-white group-hover:text-teal-200 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 font-medium line-clamp-1">
                {item.subtitle}
              </p>

              {item.actionText && (
                <div 
                  className="pt-2 flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase"
                  style={{ color: item.actionColor || '#FF6B4A' }}
                >
                  <span>{item.actionText}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
