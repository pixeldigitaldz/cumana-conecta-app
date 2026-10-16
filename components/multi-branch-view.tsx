'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Share2, 
  MapPin, 
  Clock, 
  Network,
  Mail,
  Phone,
  Sparkles,
  Flame,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { WhatsAppIcon, InstagramIcon, TikTokIcon, FacebookIcon } from '@/components/social-icons';
import { Business, BranchInfo } from '@/types/business';
import { shareBusinessExecutive } from '@/lib/share-utils';
import { ScheduleAndChannelsCard } from '@/components/schedule-channels-card';

interface MultiBranchViewProps {
  business: Business;
  onBack?: () => void;
  onShare?: () => void;
}

const DEFAULT_ECONOQUESOS_BRANCHES: BranchInfo[] = [
  {
    name: 'Sede Central',
    fullName: 'Sede Central — Blanco Fombona',
    roleBadge: 'SEDE 01',
    detailBadge: 'SEDE PRINCIPAL',
    zone: 'Centro / Cascajal',
    address: 'Av. Blanco Fombona, cruce con Calle México (Sector Centro), Cumaná',
    openingHours: 'Lunes a Sábado: 8:00 AM - 8:30 PM | Domingo: 8:00 AM - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80',
    phone: '(0412) 789-4411',
    status: 'open',
    tags: [
      'Charcutería al Mayor y Detal',
      'Ventas por Pieza y Bulto',
      'Cajas de Pago Rápido',
      'Cashea Activo en 3 Cuotas'
    ],
    mapsUrl: 'https://maps.google.com/?q=Av+Blanco+Fombona+Cumana'
  },
  {
    name: 'Econoquesos Plaza',
    fullName: 'Econoquesos Plaza — Av. Cancamure',
    roleBadge: 'SEDE 02',
    detailBadge: 'HIPERMERCADO & EQ FARMA',
    zone: 'Cancamure / El Brasil',
    address: 'Av. Cancamure, frente al complejo comercial Cancamure, Cumaná',
    openingHours: 'Lunes a Sábado: 8:00 AM - 9:00 PM | Domingo: 8:00 AM - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=1200&q=80',
    phone: '(0414) 892-1102',
    status: 'open',
    tags: [
      'Supermercado y Víveres Completos',
      'Farmacia EQ Farma Integrada',
      'Amplio Estacionamiento Privado',
      'Cashea y Todos los Métodos de Pago'
    ],
    mapsUrl: 'https://maps.google.com/?q=Av+Cancamure+Cumana'
  },
  {
    name: 'Sede Express',
    fullName: 'Sede Express — Santa Rosa',
    roleBadge: 'SEDE 03',
    detailBadge: 'SEDE 03',
    zone: 'Santa Rosa / Urdaneta',
    address: 'Av. Santa Rosa, cruce con Calle Urdaneta, Cumaná',
    openingHours: 'Lunes a Sábado: 8:00 AM - 8:00 PM | Domingo: 8:00 AM - 2:00 PM',
    image: 'https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f?w=1200&q=80',
    phone: '(0412) 334-9988',
    status: 'open',
    tags: [
      'Charcutería al Mayor y Detal',
      'Atención Rápida en Mostrador',
      'Punto de Venta y Pago Móvil',
      'Cashea Línea Cotidiana'
    ],
    mapsUrl: 'https://maps.google.com/?q=Av+Santa+Rosa+Cumana'
  }
];

export function MultiBranchView({
  business,
  onBack,
  onShare
}: MultiBranchViewProps) {
  const isEconoquesos = business.slug === 'econoquesos-cumana' || business.name?.toLowerCase().includes('econoqueso');

  const rawBranches = business.branches && business.branches.length > 0 
    ? business.branches 
    : DEFAULT_ECONOQUESOS_BRANCHES;

  const branches: BranchInfo[] = isEconoquesos
    ? DEFAULT_ECONOQUESOS_BRANCHES
    : rawBranches;

  const [activeBranchIdx, setActiveBranchIdx] = useState(0);
  const activeBranch = branches[activeBranchIdx] || branches[0];

  const email = business.email || business.socials?.email || 'contacto@econoquesos.com';
  const whatsappUrl = business.socials?.whatsapp || 'https://wa.me/584127894411?text=Hola%20Econoquesos%20Cumaná,%20los%20contacto%20desde%20CumanáConecta';
  const instagramUrl = business.socials?.instagram || 'https://instagram.com/econoquesocumana';
  const facebookUrl = business.socials?.facebook || 'https://facebook.com/econoquesocumana';
  const tiktokUrl = business.socials?.tiktok || 'https://tiktok.com/@econoqueso';
  const phone = business.phone || '(0412) 789-4411';

  const handleShareClick = async () => {
    if (onShare) {
      onShare();
      return;
    }
    await shareBusinessExecutive(business);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 text-slate-100">
      {/* 1. Barra Superior */}
      <div className="flex items-center justify-between gap-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500 dark:text-[#fbbf24]" strokeWidth={2} />
            <span>Volver al Directorio</span>
          </button>
        ) : (
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-xs font-bold text-white flex items-center gap-2 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500 dark:text-[#fbbf24]" strokeWidth={2} />
            <span>Volver al Directorio</span>
          </Link>
        )}

        <button
          type="button"
          onClick={handleShareClick}
          className="px-4 py-2 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Share2 className="w-4 h-4 text-amber-500 dark:text-[#fbbf24]" strokeWidth={2} />
          <span>Compartir Cadena</span>
        </button>
      </div>

      {/* 2. Hero de la Cadena con MODALIDAD CASHEA centrada a la altura del título */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Izquierda (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-amber-400 dark:bg-[#fbbf24] text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>CADENA MULTI-SEDE ({branches.length} SUCURSALES)</span>
            </span>

            <span className="px-3 py-1 rounded-md bg-[#FFE600] text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span>c=</span>
              <span>Cashea Línea Cotidiana</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {business.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-3xl">
            {business.description || business.tagline}
          </p>
        </div>

        {/* Derecha (4 cols): Tarjeta MODALIDAD CASHEA alineada y centrada */}
        <div className="lg:col-span-4 rounded-2xl border border-amber-500/35 bg-[#11141a] p-5 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-amber-500 dark:text-[#fbbf24]">
              MODALIDAD CASHEA
            </span>
            <span className="px-2 py-0.5 rounded bg-[#FFE600] text-slate-950 text-[10px] font-mono-tabular font-extrabold">
              {branches.length} Sedes Activas
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Paga tus compras de charcutería y víveres con inicial y cuotas sin interés a tasa BCV en cualquiera de nuestras sucursales.
          </p>
        </div>
      </div>

      {/* 3. Horarios y Canales Oficiales Centrales */}
      <ScheduleAndChannelsCard 
        openingHours={business.openingHours}
        socials={business.socials}
        businessName={business.name}
        phone={phone}
        className="rounded-2xl border border-[#222630] bg-[#11141a] text-white p-5 shadow-xl"
      />

      {/* 4. Promociones Activas en Nuestras Sedes */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#17130c] via-[#11141a] to-[#11141a] p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 dark:bg-[#fbbf24] text-slate-950 text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                <span>PROMOCIONES ACTIVAS MULTI-SEDE</span>
              </span>
              <span className="text-xs text-amber-400 font-bold font-mono-tabular">
                Válido en las 3 Sedes
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Combo Charcutero Familiar Econoquesos — $14.99
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              1 Kg Queso Blanco Llanero Semiduro + 1 Kg Jamón de Pierna Ahumado + Mortadela Especial Tapara + Mantequilla Criolla Fresca. Disponible con inicial Cashea y cuotas sin interés en Sede Central, Sede Plaza y Sede Express.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/584127894411?text=Hola%20Econoquesos,%20deseo%20pedir%20el%20Combo%20Charcutero%20Familiar%20de%20$14.99%20activo%20en%20CumanáConecta`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-4 h-4 fill-slate-950" />
              <span>Pedir Combo por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 5. Selector Interactivo de Sucursales */}
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Sucursales Físicas en Cumaná
          </h2>
          <span className="text-xs sm:text-sm font-mono-tabular font-bold text-amber-500 dark:text-[#fbbf24] tracking-wider">
            {String(branches.length).padStart(2, '0')} UBICACIONES
          </span>
        </div>

        {/* Fila de Tarjetas Selectoras: GARANTIZADAS EN UNA SOLA LÍNEA Y RESPONSIVE EN MÓVILES */}
        <div 
          className="grid gap-2 sm:gap-3.5 w-full"
          style={{ gridTemplateColumns: `repeat(${branches.length}, minmax(0, 1fr))` }}
        >
          {branches.map((branch, idx) => {
            const isActive = idx === activeBranchIdx;
            const branchLabel = branch.roleBadge || `SEDE ${String(idx + 1).padStart(2, '0')}`;

            return (
              <button
                type="button"
                key={branch.name + idx}
                onClick={() => setActiveBranchIdx(idx)}
                className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 cursor-pointer space-y-1 sm:space-y-1.5 active:scale-95 ${
                  isActive
                    ? 'border-amber-400 dark:border-[#fbbf24] bg-[#11141a] shadow-lg ring-1 ring-amber-400/40'
                    : 'border-[#222630] bg-[#11141a] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[9px] sm:text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-amber-500 dark:text-[#fbbf24]">
                    {branchLabel}
                  </span>
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden xs:inline">Abierta</span>
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight truncate">
                  {branch.name}
                </h3>

                <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                  {branch.zone || 'Cumaná, Sucre'}
                </p>
              </button>
            );
          })}
        </div>

        {/* Visor Detallado de la Sede Activa */}
        <div className="rounded-2xl border border-[#222630] bg-[#11141a] p-5 sm:p-7 shadow-xl transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Izquierda: Fotografía de la sede (5 cols) */}
            <div className="lg:col-span-5 relative h-60 sm:h-72 lg:h-[280px] rounded-xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={activeBranch.image || business.heroImage}
                alt={activeBranch.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Derecha: Datos de la sede (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
              <span className="text-[10px] sm:text-[11px] font-mono-tabular font-bold uppercase tracking-wider text-amber-500 dark:text-[#fbbf24] block">
                {activeBranch.detailBadge || activeBranch.roleBadge || 'SEDE PRINCIPAL'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {activeBranch.fullName || activeBranch.name}
              </h3>

              <div className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-500 dark:text-[#fbbf24] shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{activeBranch.address}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500 dark:text-[#fbbf24] shrink-0" strokeWidth={2} />
                  <span>
                    {activeBranch.openingHours || 'Lunes a Sábado: 8:00 AM - 8:30 PM | Domingo: 8:00 AM - 2:00 PM'}
                  </span>
                </div>
              </div>

              {/* Chips de servicios de la sede */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(activeBranch.tags && activeBranch.tags.length > 0
                  ? activeBranch.tags
                  : [
                      'Charcutería al Mayor y Detal',
                      'Ventas por Pieza y Bulto',
                      'Cajas de Pago Rápido',
                      'Cashea Activo en 3 Cuotas'
                    ]
                ).map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1.5 rounded-lg bg-[#161920] border border-[#252934] text-slate-300 font-medium text-xs shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={`https://wa.me/584127894411?text=Hola%20${encodeURIComponent(activeBranch.fullName || activeBranch.name)},%20los%20contacto%20desde%20CumanáConecta`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Contactar Sede por WhatsApp</span>
                </a>

                <a
                  href={activeBranch.mapsUrl || business.mapsUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-amber-500 dark:text-[#fbbf24]" strokeWidth={2} />
                  <span>Ubicación en Mapa</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Dónde están ubicadas nuestras sedes (Mapa & Directorio de Ubicaciones en Cumaná) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>Dónde conseguir cada sede en Cumaná</span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Ubicaciones estratégicas distribuidas en el casco central, oeste y este de la ciudad.
            </p>
          </div>
        </div>

        {/* Grid de Ubicaciones Detalladas de las 3 Sedes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((b, idx) => {
            const isSelected = idx === activeBranchIdx;
            return (
              <div
                key={b.name + '-loc-' + idx}
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all ${
                  isSelected 
                    ? 'border-amber-400/60 bg-[#141820] shadow-md ring-1 ring-amber-400/30' 
                    : 'border-[#222630] bg-[#11141a] hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-amber-500 dark:text-[#fbbf24]">
                      {b.roleBadge || `SEDE ${String(idx + 1).padStart(2, '0')}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveBranchIdx(idx)}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
                    >
                      {isSelected ? '● Sede Seleccionada' : 'Ver Detalle'}
                    </button>
                  </div>

                  <h3 className="text-base font-extrabold text-white leading-snug">
                    {b.fullName || b.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono-tabular text-[11px] text-slate-400">
                        {b.openingHours || '8:00 AM - 8:30 PM'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1e222b] flex items-center gap-2">
                  <a
                    href={b.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address + ' Cumana Sucre')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#161920] hover:bg-[#1f242e] border border-[#252934] text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cómo Llegar (Maps)</span>
                  </a>

                  <a
                    href={`https://wa.me/584127894411?text=Hola,%20deseo%20consultar%20sobre%20la%20${encodeURIComponent(b.fullName || b.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${b.name}`}
                    className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-sm cursor-pointer shrink-0"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
