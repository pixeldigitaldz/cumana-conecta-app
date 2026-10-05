import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Clock,
  Bike,
  PieChart,
  ChevronRight,
} from 'lucide-react';
import { CasheaIcon } from '../../../components/CasheaLogo';

/* ─── Curated Editorial Palette (Anti-AI / Premium Humanized) ─── */
const PALETTE = [
  '#ec4899', // Hot Pink / Magenta (Moda & Calzado)
  '#0284c7', // Sky / Cobalt (Bodegones & Supermercados)
  '#f59e0b', // Warm Amber (Panaderías & Cafés)
  '#475569', // Slate / Steel (Ferretería & Construcción)
  '#8b5cf6', // Violet / Purple (Tecnología & Celulares)
  '#ef4444', // Red / Coral (Automotriz & Repuestos)
  '#06b6d4', // Cyan / Teal (Belleza & Barbería)
  '#10b981', // Emerald (Salud & Farmacias)
  '#d97706', // Ochre (Restaurantes)
  '#00a896', // Brand Teal
];

/* ─── SVG Donut Chart with HTML Center Overlay ─── */
function SvgDonut({ items, total, hoveredId, onHover, onSelect }) {
  const size = 230;
  const center = size / 2;
  const rOuter = 90;
  const rInner = 56;
  const gap = items.length > 1 ? 0.04 : 0; // subtle separation gap

  let currentAngle = -Math.PI / 2;

  const slices = items.map((item, idx) => {
    const angleSpan = (item.count / Math.max(total, 1)) * 2 * Math.PI;
    const startAngle = currentAngle + gap / 2;
    const endAngle = currentAngle + angleSpan - gap / 2;
    currentAngle += angleSpan;

    const isHovered = hoveredId === item.id;
    const rOut = isHovered ? rOuter + 5 : rOuter;
    const rIn = isHovered ? rInner - 2 : rInner;

    const x1 = center + rOut * Math.cos(startAngle);
    const y1 = center + rOut * Math.sin(startAngle);
    const x2 = center + rOut * Math.cos(endAngle);
    const y2 = center + rOut * Math.sin(endAngle);

    const x3 = center + rIn * Math.cos(endAngle);
    const y3 = center + rIn * Math.sin(endAngle);
    const x4 = center + rIn * Math.cos(startAngle);
    const y4 = center + rIn * Math.sin(startAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    return {
      ...item,
      pathData,
      color: item.color || PALETTE[idx % PALETTE.length],
      isHovered,
    };
  });

  const activeItem = items.find((i) => i.id === hoveredId);

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* Vector Donut SVG */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {slices.map((slice) => (
          <path
            key={slice.id}
            d={slice.pathData}
            fill={slice.color}
            className="cursor-pointer transition-all duration-200"
            style={{
              filter: slice.isHovered
                ? `drop-shadow(0 4px 12px ${slice.color}77)`
                : 'none',
              opacity: hoveredId && !slice.isHovered ? 0.35 : 1,
            }}
            onMouseEnter={() => onHover(slice.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect && onSelect(slice)}
          />
        ))}
      </svg>

      {/* Pure HTML Centered Cutout */}
      <div
        className="absolute inset-0 m-auto flex flex-col items-center justify-center text-center pointer-events-none transition-all duration-200"
        style={{ width: rInner * 2 - 6, height: rInner * 2 - 6 }}
      >
        <span className="font-['Outfit'] font-black text-3xl leading-none text-slate-900 transition-all duration-200">
          {activeItem ? activeItem.count : total}
        </span>
        <span className="font-['Outfit'] font-bold text-xs text-slate-700 mt-1 leading-tight truncate max-w-full px-1">
          {activeItem ? activeItem.label : 'Comercios'}
        </span>
        <span className="text-[10px] text-slate-400 font-['Inter'] leading-tight truncate max-w-full px-1 mt-0.5">
          {activeItem ? `${activeItem.pct}% del total` : 'Cumaná Conecta'}
        </span>
      </div>
    </div>
  );
}

export default function CommercialRadiography({
  businesses = [],
  categories = [],
  onNavigate,
}) {
  const [hoveredCatId, setHoveredCatId] = useState(null);

  // Filter active businesses
  const activeBusinesses = useMemo(() => {
    return businesses.filter(
      (b) => !b.status || b.status === 'active' || b.status === 'aprobado'
    );
  }, [businesses]);

  const total = activeBusinesses.length || 1;

  // Process categories and counts
  const categoryData = useMemo(() => {
    const validCats = categories.filter((c) => c.id !== 'all');

    // Count businesses per category
    const list = validCats
      .map((c, idx) => {
        const count = activeBusinesses.filter(
          (b) =>
            b.category === c.id ||
            b.categoryLabel?.toLowerCase().includes(c.label.toLowerCase())
        ).length;
        const pct = Math.round((count / total) * 100);
        return {
          id: c.id,
          label: c.label,
          emoji: c.emoji || '🏬',
          count,
          pct,
          color: PALETTE[idx % PALETTE.length],
        };
      })
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);

    // Fallback if categories are not linked via ID
    if (list.length === 0 && activeBusinesses.length > 0) {
      const grouped = {};
      activeBusinesses.forEach((b) => {
        const key = b.categoryLabel || b.category || 'General';
        grouped[key] = (grouped[key] || 0) + 1;
      });
      return Object.entries(grouped).map(([label, count], idx) => ({
        id: `gen-${idx}`,
        label,
        emoji: '🏬',
        count,
        pct: Math.round((count / total) * 100),
        color: PALETTE[idx % PALETTE.length],
      }));
    }

    return list;
  }, [categories, activeBusinesses, total]);

  // Top metric calculations
  const topCategory = categoryData[0] || {
    label: 'Sin datos',
    count: 0,
    pct: 0,
  };

  const deliveryCount = activeBusinesses.filter(
    (b) => b.deliveryAvailable === true
  ).length;
  const deliveryPct = Math.round((deliveryCount / total) * 100);

  const casheaCount = activeBusinesses.filter((b) =>
    Array.isArray(b.paymentMethods)
      ? b.paymentMethods.includes('cashea')
      : false
  ).length;
  const casheaPct = Math.round((casheaCount / total) * 100);

  const h24Count = activeBusinesses.filter(
    (b) => b.isOpen24h === true
  ).length;
  const h24Pct = Math.round((h24Count / total) * 100);

  const handleFilterClick = (cat) => {
    if (onNavigate) {
      onNavigate('businesses');
    }
  };

  return (
    <div
      className="rounded-3xl border bg-white p-6 transition-all duration-200"
      style={{
        borderColor: '#e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-2xl bg-[#0a2540] flex items-center justify-center flex-shrink-0 shadow-sm">
              <PieChart size={18} className="text-white" />
            </div>
            <h3 className="font-['Outfit'] font-black text-xl text-slate-900">
              Radiografía Comercial de Cumaná
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 font-['Inter']">
              Recharts Analytics
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 font-['Inter'] mt-1">
            Distribución porcentual de los {activeBusinesses.length} comercios
            registrados por rubro de actividad económica en la ciudad
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] md:text-xs italic text-slate-400 font-['Inter']">
            * Haz clic en cualquier rubro para filtrar el catálogo
          </span>
        </div>
      </div>

      {/* ── 4 Top KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Rubro Principal */}
        <div className="rounded-2xl border border-slate-100 bg-[#f8fafc]/50 p-4 transition-all duration-200 hover:bg-white hover:border-slate-200 hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-['Inter']">
              Rubro Principal
            </span>
            <TrendingUp size={16} className="text-amber-500" />
          </div>
          <p className="font-['Outfit'] font-bold text-lg text-slate-900 truncate">
            {topCategory.label}
          </p>
          <p className="text-xs font-bold text-amber-600 font-['Outfit'] mt-1">
            {topCategory.count} {topCategory.count === 1 ? 'comercio' : 'comercios'} ({topCategory.pct}%)
          </p>
        </div>

        {/* Card 2: Con Delivery */}
        <div className="rounded-2xl border border-slate-100 bg-[#f8fafc]/50 p-4 transition-all duration-200 hover:bg-white hover:border-slate-200 hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-['Inter']">
              Con Delivery
            </span>
            <Bike size={16} className="text-emerald-500" />
          </div>
          <p className="font-['Outfit'] font-bold text-lg text-emerald-600 font-['Outfit']">
            {deliveryPct}% de cobertura
          </p>
          <p className="text-xs font-medium text-slate-400 font-['Inter'] mt-1">
            {deliveryCount} comercios activos
          </p>
        </div>

        {/* Card 3: Aceptan Cashea */}
        <div className="rounded-2xl border border-slate-100 bg-[#f8fafc]/50 p-4 transition-all duration-200 hover:bg-white hover:border-slate-200 hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-['Inter']">
              Aceptan Cashea
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#FFE600] text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300">
              <CasheaIcon className="w-3.5 h-3.5 object-contain flex-shrink-0" />
              <span>cashea</span>
              <span className="bg-black text-white text-[7px] px-1 py-0.2 rounded font-bold">
                OFICIAL
              </span>
            </span>
          </div>
          <p className="font-['Outfit'] font-bold text-lg text-amber-600 font-['Outfit']">
            {casheaPct}% afiliados
          </p>
          <p className="text-xs font-medium text-slate-400 font-['Inter'] mt-1">
            {casheaCount} negocios con cuotas
          </p>
        </div>

        {/* Card 4: Atención 24 Horas */}
        <div className="rounded-2xl border border-slate-100 bg-[#f8fafc]/50 p-4 transition-all duration-200 hover:bg-white hover:border-slate-200 hover:shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 font-['Inter']">
              Atención 24 Horas
            </span>
            <Clock size={16} className="text-indigo-500" />
          </div>
          <p className="font-['Outfit'] font-bold text-lg text-indigo-600 font-['Outfit']">
            {h24Pct}% disponibles
          </p>
          <p className="text-xs font-medium text-slate-400 font-['Inter'] mt-1">
            {h24Count} abiertos continuo
          </p>
        </div>
      </div>

      {/* ── Main Chart & Categories Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Donut Chart (~40%) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
          <SvgDonut
            items={categoryData}
            total={activeBusinesses.length}
            hoveredId={hoveredCatId}
            onHover={setHoveredCatId}
            onSelect={handleFilterClick}
          />

          <p className="text-xs text-slate-400 font-['Inter'] text-center mt-5">
            Pasa el cursor sobre los arcos del gráfico para explorar los sectores
          </p>
        </div>

        {/* Right Column: Category Breakdown Grid (~60%) */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-700 font-['Inter'] uppercase tracking-wider">
              Rubro Comercial
            </span>
            <span className="text-xs font-bold text-slate-700 font-['Inter'] uppercase tracking-wider">
              Comercios / Participación
            </span>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto overflow-x-hidden p-1 pr-1.5"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f8fafc',
            }}
          >
            {categoryData.map((cat) => {
              const isHovered = hoveredCatId === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setHoveredCatId(cat.id)}
                  onMouseLeave={() => setHoveredCatId(null)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 bg-white overflow-hidden select-none cursor-pointer ${
                    isHovered
                      ? 'border-slate-300 bg-slate-50/60 shadow-xs'
                      : 'border-slate-100 hover:border-slate-200 shadow-2xs'
                  }`}
                  onClick={() => handleFilterClick(cat)}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-bold text-slate-800 truncate font-['Inter']">
                        {cat.label}
                      </span>
                    </div>

                    <span className="font-['Outfit'] font-black text-sm text-slate-800 flex-shrink-0">
                      {cat.count}
                    </span>
                  </div>

                  {/* Progress Bar Track & Fill */}
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden my-2">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min(cat.pct, 100)}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>

                  {/* Bottom details */}
                  <div className="flex items-center justify-between text-[11px] mt-2">
                    <span className="font-medium text-slate-400 font-['Inter']">
                      {cat.pct}% del total
                    </span>
                    <span className="font-bold text-[#0284c7] hover:text-[#005f73] transition-colors flex items-center gap-0.5 hover:underline">
                      Filtrar <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
