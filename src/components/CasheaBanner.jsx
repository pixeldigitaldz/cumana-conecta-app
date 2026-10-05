import { useState, useEffect } from 'react';
import { PlusCircle, ChevronRight, Sparkles } from 'lucide-react';
import adminStore from '../store/adminStore.js';

/**
 * CasheaBanner — Banner promocional oficial de Cashea en Cumaná
 * Ubicado justo arriba del footer en el Home.
 * Recrea el diseño, texto y la paleta oficial amarilla y negra de Cashea (#FFE600 / #000000).
 * Totalmente configurable desde el panel de administración.
 */
export default function CasheaBanner({ onFilterCashea, onOpenPricing }) {
  const [config, setConfig] = useState({
    active: true,
    title: '¿Buscas comercios afiliados a Cashea en Cumaná?',
    subtitle: 'Filtra farmacias, talleres mecánicos, tiendas de celulares y bodegones que te permiten pagar en cómodas cuotas sin interés en la ciudad de Cumaná.',
    badgeText: 'Compre Ahora, Pague Después',
    ctaText: 'Ver Comercios con Cashea',
  });

  useEffect(() => {
    try {
      const settings = adminStore.getSettings();
      if (settings?.casheaBanner) {
        setConfig(prev => ({ ...prev, ...settings.casheaBanner }));
      }
    } catch {}
  }, []);

  if (config.active === false) return null;

  return (
    <section
      className="max-w-[1440px] mx-auto px-4 md:px-12 my-10 animate-fade-in-up"
      aria-label="Comercios con Cashea en Cumaná"
    >
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 border border-amber-300 shadow-md transition-all duration-300"
        style={{
          backgroundColor: '#FFE600',
          backgroundImage:
            'radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.4) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
        }}
      >
        {/* Marca de agua decorativa Cashea al fondo */}
        <div
          className="absolute -right-6 -bottom-10 select-none pointer-events-none opacity-10 font-['Outfit'] font-black text-[140px] sm:text-[180px] leading-none text-black"
          aria-hidden="true"
        >
          cashea.
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* ─── Lado Izquierdo: Badge, Título y Descripción ─── */}
          <div className="max-w-2xl text-left">
            
            {/* Badge Superior */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-slate-950 text-[#FFE600] mb-3.5 shadow-xs">
              <img src="/images/cashea-icon.png" alt="Cashea" className="w-4 h-4 object-contain rounded-xs" />
              <span>{config.badgeText || 'Compre Ahora, Pague Después'}</span>
            </div>

            {/* Título Principal */}
            <h2 className="font-['Outfit'] font-bold text-2xl sm:text-3xl md:text-4xl text-slate-950 tracking-tight leading-tight">
              {config.title || '¿Buscas comercios afiliados a Cashea en Cumaná?'}
            </h2>

            {/* Subtítulo Descriptivo */}
            <p className="font-['Inter'] text-slate-900/90 text-xs sm:text-sm md:text-base font-medium mt-3 leading-relaxed">
              {config.subtitle || 'Filtra farmacias, talleres mecánicos, tiendas de celulares y bodegones que te permiten pagar en cómodas cuotas sin interés en la ciudad de Cumaná.'}
            </p>

          </div>

          {/* ─── Lado Derecho: Botones de Acción ─── */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 flex-shrink-0">
            
            {/* Botón 1: Ver Comercios con Cashea */}
            <button
              type="button"
              onClick={onFilterCashea}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-slate-950 hover:bg-black text-[#FFE600] font-['Inter'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Sparkles size={16} />
              <span>{config.ctaText || 'Ver Comercios con Cashea'}</span>
              <ChevronRight size={16} />
            </button>

            {/* Botón 2: Sumar mi Negocio */}
            <button
              type="button"
              onClick={onOpenPricing}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-transparent border-2 border-slate-950 hover:bg-slate-950 hover:text-[#FFE600] text-slate-950 font-['Inter'] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle size={16} />
              <span>Sumar mi Negocio</span>
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}
