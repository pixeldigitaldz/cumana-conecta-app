'use client';

import React from 'react';
import { Search, MapPin, Tag } from 'lucide-react';

interface HeroSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedZone: string;
  onZoneChange: (zone: string) => void;
  zones: string[];
  filterOnlyOpen: boolean;
  onToggleOnlyOpen: () => void;
  filterCashea: boolean;
  onToggleCashea: () => void;
  filterPromotions: boolean;
  onTogglePromotions: () => void;
  totalResults: number;
  totalBusinesses: number;
}

export function HeroSearch({
  searchTerm,
  onSearchChange,
  selectedZone,
  onZoneChange,
  zones,
  filterOnlyOpen,
  onToggleOnlyOpen,
  filterCashea,
  onToggleCashea,
  filterPromotions,
  onTogglePromotions,
  totalResults,
  totalBusinesses,
}: HeroSearchProps) {
  return (
    <section className="relative overflow-hidden pt-1.5 sm:pt-2 pb-6 sm:pb-8 text-center">
      {/* Resplandor sutil arquitectónico */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[240px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
        {/* Kicker Badge Institucional pegado al header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-wide border border-amber-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
          <span>Guía Comercial y de Servicios de Cumaná</span>
        </div>

        {/* Título de Alto Impacto */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Encuentra comercios, salud y servicios
          <br className="hidden sm:inline" /> verificados en{' '}
          <span className="text-[#004655] dark:text-[#fbbf24]">Cumaná</span>
        </h1>

        {/* Subtítulo Limpio */}
        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Explora farmacias de turno 24 horas, clínicas, restaurantes, talleres y tiendas afiliadas a{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-bold">Cashea</strong> y{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-bold">Pago Móvil</strong> con contacto directo.
        </p>

        {/* Consola de Búsqueda */}
        <div className="pt-3 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-slate-200 dark:border-[#222630] bg-white dark:bg-[#11141a] p-4 sm:p-5 shadow-xl transition-all space-y-4 text-left">
            {/* Fila 1: Grid 12 Columnas (Buscador 7 cols + Zonas 5 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Input de Búsqueda (7 cols) */}
              <div className="md:col-span-7 relative">
                <Search
                  className="w-4 h-4 text-[#004655] dark:text-[#fbbf24] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Buscar comercio, especialidad, farmacia 24h, Cashea..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0b0d11] border border-slate-200 dark:border-[#222630] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#004655] dark:focus:border-[#fbbf24] transition-all font-medium"
                />
              </div>

              {/* Selector de Zonas (5 cols) */}
              <div className="md:col-span-5 relative">
                <MapPin
                  className="w-4 h-4 text-[#004655] dark:text-[#fbbf24] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  strokeWidth={2}
                />
                <select
                  value={selectedZone}
                  onChange={(e) => onZoneChange(e.target.value)}
                  className="w-full pl-10 pr-9 py-3 bg-slate-50 dark:bg-[#0b0d11] border border-slate-200 dark:border-[#222630] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:border-[#004655] dark:focus:border-[#fbbf24] appearance-none cursor-pointer truncate"
                >
                  <option value="Todas" className="bg-white dark:bg-[#0b0d11] text-slate-900 dark:text-white">
                    Todas las zonas de Cumaná
                  </option>
                  {zones
                    .filter((z) => z !== 'Todas')
                    .map((zone) => (
                      <option
                        key={zone}
                        value={zone}
                        className="bg-white dark:bg-[#0b0d11] text-slate-900 dark:text-white"
                      >
                        {zone}
                      </option>
                    ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Fila 2: Píldoras de Filtro Rápido + Contador Monoespaciado */}
            <div className="pt-3 border-t border-slate-100 dark:border-[#1e222b] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* 3 Botones Píldora */}
              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Abierto Ahora */}
                <button
                  type="button"
                  onClick={onToggleOnlyOpen}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    filterOnlyOpen
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-500 dark:text-emerald-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#161920] border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span>Abierto Ahora</span>
                </button>

                {/* 2. Acepta Cashea */}
                <button
                  type="button"
                  onClick={onToggleCashea}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    filterCashea
                      ? 'bg-[#FFE600]/20 border-[#e6ce00] text-slate-950 dark:bg-amber-950/60 dark:border-[#FFE600] dark:text-[#FFE600] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#161920] border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="px-1 py-0.2 rounded bg-[#FFE600] text-slate-950 text-[10px] font-mono-tabular font-black">
                    c=
                  </span>
                  <span className="text-amber-700 dark:text-[#FFE600] font-bold">Acepta Cashea</span>
                </button>

                {/* 3. Con Promociones */}
                <button
                  type="button"
                  onClick={onTogglePromotions}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    filterPromotions
                      ? 'bg-[#004655]/10 border-[#004655] text-[#004655] dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-400 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#161920] border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-[#004655] dark:text-[#fbbf24]" strokeWidth={2} />
                  <span>Con Promociones</span>
                </button>
              </div>

              {/* Contador Monoespaciado a la derecha */}
              <div className="text-[11px] font-mono-tabular text-slate-500 dark:text-slate-500 tracking-wider font-semibold self-end sm:self-auto">
                MOSTRANDO{' '}
                <span className="text-[#004655] dark:text-[#fbbf24] font-bold">
                  {totalResults}
                </span>{' '}
                DE {totalBusinesses}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
