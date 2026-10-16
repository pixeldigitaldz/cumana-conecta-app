'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CasheaBannerProps {
  onFilterCashea?: () => void;
}

export function CasheaBanner({ onFilterCashea }: CasheaBannerProps) {
  return (
    <section className="w-full my-10">
      <div className="relative overflow-hidden rounded-3xl bg-[#FFE600] text-slate-950 p-6 sm:p-8 md:p-10 shadow-xl transition-all">
        {/* Gráfico decorativo de fondo */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-black/5 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-[#FFE600] text-[10px] font-mono-tabular font-extrabold uppercase tracking-wider shadow-sm">
              <span className="w-4 h-4 rounded-full bg-[#FFE600] text-slate-950 flex items-center justify-center text-[10px] font-black">
                c=
              </span>
              <span>FINANCIAMIENTO SIN INTERÉS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 leading-tight">
              ¿Buscas comercios afiliados a Cashea en Cumaná?
            </h2>

            <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed max-w-xl">
              Compra hoy y paga en cuotas sin interés a tasa oficial del BCV en supermercados, farmacias, clínicas, tiendas de repuestos y tecnología en toda la ciudad.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {onFilterCashea ? (
              <button
                type="button"
                onClick={onFilterCashea}
                className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Filtrar Comercios con Cashea</span>
                <ArrowRight className="w-4 h-4 text-[#FFE600]" strokeWidth={2} />
              </button>
            ) : (
              <Link
                href="/?cashea=true"
                className="px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Filtrar Comercios con Cashea</span>
                <ArrowRight className="w-4 h-4 text-[#FFE600]" strokeWidth={2} />
              </Link>
            )}

            <Link
              href="/planes"
              className="px-5 py-3.5 rounded-xl border-2 border-slate-950/80 hover:bg-slate-950/10 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Afiliar mi Negocio</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
