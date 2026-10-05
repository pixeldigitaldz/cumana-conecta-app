import { useRef, useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  Heart,
  LayoutGrid,
  List,
  ChevronDown,
  LayoutDashboard,
  Stethoscope,
  Pill,
  UtensilsCrossed,
  Coffee,
  Wrench,
  BookOpen,
  Lightbulb,
  Store,
} from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES, businesses as rawBusinesses } from '../data/mockBusinessData';
import { adminStore } from '../store/adminStore';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_ICON_MAP = {
  all: LayoutDashboard,
  salud: Stethoscope,
  farmacias_24h: Pill,
  restaurantes: UtensilsCrossed,
  reposteria: Coffee,
  talleres: Wrench,
  librerias: BookOpen,
  emprendedores: Lightbulb,
  tiendas: Store,
};

const CATEGORY_LABEL_OVERRIDE = {
  all: 'Todas',
  salud: 'Clínicas y Salud',
  farmacias_24h: 'Farmacias 24h',
  restaurantes: 'Restaurantes',
  reposteria: 'Reposterías & Café',
  talleres: 'Talleres & Autos',
  librerias: 'Librerías & Útiles',
  emprendedores: 'Emprendedores',
  tiendas: 'Tiendas & Bodegones',
};

/**
 * SearchAndFilters — CumanáConecta
 * Incluye:
 * 1. Fila de CATEGORÍAS PRINCIPALES con navegación horizontal (< >) y badges de conteo.
 * 2. Barra de herramientas inferior encapsulada en tarjeta blanca/oscura con bordes redondeados (Filtros de pago, Favoritos, VIP, Ordenamiento y Grid/List).
 */
export default function SearchAndFilters({
  activeCategory = 'all',
  setActiveCategory,
  filterPayment = 'all',
  setFilterPayment,
  filterOnlyVIP = false,
  setFilterOnlyVIP,
  filterFavorites = false,
  setFilterFavorites,
  sortBy = 'featured',
  setSortBy,
  viewMode = 'grid',
  setViewMode,
}) {
  const { isDark } = useTheme();
  const scrollContainerRef = useRef(null);

  // Categorías dinámicas sincronizadas con el panel de administración
  const [storedCategories, setStoredCategories] = useState(() => {
    try {
      const cats = adminStore.getCategories();
      return Array.isArray(cats) && cats.length > 0 ? cats : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [businessesList, setBusinessesList] = useState(() => {
    try {
      const b = adminStore.getBusinesses();
      return Array.isArray(b) && b.length > 0 ? b : rawBusinesses;
    } catch {
      return rawBusinesses;
    }
  });

  useEffect(() => {
    const syncData = () => {
      try {
        const cats = adminStore.getCategories();
        if (Array.isArray(cats) && cats.length > 0) {
          setStoredCategories(cats);
        }
        const b = adminStore.getBusinesses();
        if (Array.isArray(b) && b.length > 0) {
          setBusinessesList(b);
        }
      } catch {}
    };

    window.addEventListener('cumana_store_updated', syncData);
    window.addEventListener('storage', syncData);
    syncData();
    return () => {
      window.removeEventListener('cumana_store_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  // Combinar categorías activas con cualquier categoría presente en los comercios registrados
  const categories = useMemo(() => {
    const list = [...storedCategories].filter((c) => c.active !== false);
    const existingIds = new Set(list.map((c) => c.id));

    // Si algún comercio tiene una categoría no registrada, agregarla dinámicamente
    businessesList.forEach((b) => {
      if (b.category && !existingIds.has(b.category)) {
        list.push({
          id: b.category,
          label: b.categoryLabel || b.category,
          emoji: '🏷️',
          active: true,
        });
        existingIds.add(b.category);
      }
    });

    // Asegurar que 'all' esté de primero
    const allIndex = list.findIndex((c) => c.id === 'all');
    if (allIndex > 0) {
      const [allCat] = list.splice(allIndex, 1);
      list.unshift(allCat);
    } else if (allIndex === -1) {
      list.unshift({ id: 'all', label: 'Todas', emoji: '🗺️', icon: 'Layers', active: true });
    }

    return list;
  }, [storedCategories, businessesList]);

  // Calcula el conteo de comercios para cada categoría
  const getCategoryCount = (catId) => {
    const list = (businessesList || []).filter(
      (b) => !b.status || b.status === 'active' || b.status === 'aprobado'
    );
    if (catId === 'all') return list.length;

    const catObj = categories.find((c) => c.id === catId);
    const catLabel = catObj?.label?.toLowerCase();

    return list.filter((b) => {
      if (b.category === catId) return true;
      if (catLabel && b.categoryLabel && b.categoryLabel.toLowerCase() === catLabel) return true;
      if (b.category && catLabel && b.category.toLowerCase() === catLabel) return true;
      return false;
    }).length;
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-12 pt-4 sm:pt-6 pb-2 w-full"
      aria-label="Categorías y filtros principales"
    >
      
      {/* ─── Encabezado de Categorías & Controles de Desplazamiento ─── */}
      <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <h2
            className={`font-['Outfit'] font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-amber-400' : 'text-[#004655]'
            }`}
            style={{ letterSpacing: '0.05em' }}
          >
            <span>CATEGORÍAS PRINCIPALES</span>
            <span className={isDark ? 'text-amber-500' : 'text-[#008b8b]'}>•</span>
          </h2>
        </div>

        {/* Flechas de scroll < > */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={scrollLeft}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95 ${
              isDark
                ? 'bg-[#1a1c22] border-[#2b2d35] text-slate-300 hover:bg-[#252830] hover:text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
            aria-label="Desplazar categorías hacia la izquierda"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition cursor-pointer shadow-2xs active:scale-95 ${
              isDark
                ? 'bg-[#1a1c22] border-[#2b2d35] text-slate-300 hover:bg-[#252830] hover:text-white'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
            aria-label="Desplazar categorías hacia la derecha"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ─── Pestañas / Chips de Categorías Horizontales ─── */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2.5 hide-scrollbar scroll-smooth -mx-3 px-3 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="Pestañas de categorías"
      >
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = getCategoryCount(cat.id);
          const IconComp = CATEGORY_ICON_MAP[cat.id] || null;
          const displayLabel = CATEGORY_LABEL_OVERRIDE[cat.id] || cat.label;

          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveCategory(cat.id)}
              className={`h-10 sm:h-11 px-3 sm:px-4 rounded-xl font-['Inter'] font-semibold text-xs flex items-center gap-2 transition-all flex-shrink-0 cursor-pointer active:scale-98 ${
                isSelected
                  ? isDark
                    ? 'bg-[#eab308] text-slate-950 font-bold shadow-[0_0_14px_rgba(234,179,8,0.25)]'
                    : 'bg-[#004655] text-white shadow-sm'
                  : isDark
                  ? 'bg-[#18191d] text-slate-300 border border-[#282a32] hover:border-slate-600 hover:bg-[#22242c]'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              {IconComp ? (
                <IconComp
                  size={15}
                  className={
                    isSelected
                      ? isDark
                        ? 'text-slate-950'
                        : 'text-[#8bd1e8]'
                      : isDark
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }
                />
              ) : (
                <span className="text-sm leading-none">{cat.emoji || '🏷️'}</span>
              )}
              <span className="whitespace-nowrap">{displayLabel}</span>
              <span
                className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md font-bold ${
                  isSelected
                    ? isDark
                      ? 'bg-black/80 text-white'
                      : 'bg-[#005f73] text-white'
                    : isDark
                    ? 'bg-[#252830] text-slate-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Barra de Herramientas Inferior Encapsulada con Borde y Fondo Contenedor (Estilo Foto Referencia) ─── */}
      <div
        className={`mt-2 sm:mt-2.5 p-2 sm:p-2.5 sm:px-4 sm:py-3 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 ${
          isDark
            ? 'bg-[#18191d] border-[#2b2d35] shadow-[0_4px_16px_rgba(0,0,0,0.25)]'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}
      >
        
        {/* Lado Izquierdo: Filtrar por Pago, Favoritos & Toggle VIP */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          <div className={`flex items-center gap-1.5 text-xs font-['Inter'] font-semibold pl-1 pr-0.5 flex-shrink-0 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            <SlidersHorizontal size={14} className={isDark ? 'text-amber-400' : 'text-[#006e70]'} />
            <span>Filtrar:</span>
          </div>

          {/* Selector de Métodos de Pago */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment && setFilterPayment(e.target.value)}
              className={`w-full sm:w-auto h-9 pl-3 pr-8 rounded-xl border text-xs font-['Inter'] font-medium transition-colors outline-none appearance-none cursor-pointer ${
                isDark
                  ? 'bg-[#121316] border-[#2b2d35] text-slate-200 hover:border-slate-600 focus:border-amber-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-[#006e70]'
              }`}
              aria-label="Filtrar por método de pago"
            >
              <option value="all" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>Todos los pagos</option>
              <option value="cashea" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>🟰 Acepta Cashea</option>
              <option value="punto_de_venta" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>💳 Punto de Venta</option>
              <option value="pago_movil" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>📱 Pago Móvil</option>
              <option value="usd_cash" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>💵 Efectivo / Zelle</option>
              <option value="binance" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>🪙 Binance Pay</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Botón Favoritos */}
          <button
            type="button"
            onClick={() => setFilterFavorites && setFilterFavorites(!filterFavorites)}
            className={`h-9 px-3 rounded-xl border text-xs font-['Inter'] font-semibold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
              filterFavorites
                ? isDark
                  ? 'bg-rose-950/60 text-rose-300 border-rose-700/80 shadow-xs'
                  : 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                : isDark
                ? 'bg-[#121316] text-slate-300 border-[#2b2d35] hover:border-rose-500/50 hover:text-rose-400'
                : 'bg-white text-slate-700 border-slate-200 hover:border-rose-200 hover:bg-rose-50/40 hover:text-rose-600'
            }`}
            aria-label="Filtrar por favoritos"
          >
            <Heart
              size={13}
              className={`transition-colors ${
                filterFavorites
                  ? 'text-rose-500 fill-rose-500'
                  : 'text-rose-500'
              }`}
            />
            <span>Favoritos</span>
          </button>

          {/* Toggle Destacados VIP */}
          <button
            type="button"
            onClick={() => setFilterOnlyVIP && setFilterOnlyVIP(!filterOnlyVIP)}
            className={`h-9 px-3 rounded-xl border text-xs font-['Inter'] font-semibold flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
              filterOnlyVIP
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-xs'
                : isDark
                ? 'bg-[#121316] text-amber-400 border-[#2b2d35] hover:border-amber-500/50 hover:bg-amber-500/10'
                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 hover:text-amber-700'
            }`}
            aria-label="Filtrar por comercios VIP"
          >
            <Sparkles
              size={13}
              className={`transition-colors ${
                filterOnlyVIP
                  ? 'text-slate-950 fill-slate-950'
                  : 'text-amber-500 fill-amber-500/30'
              }`}
            />
            <span>VIP</span>
          </button>
        </div>

        {/* Lado Derecho: Ordenar & Selector de Vista (Grid / List) */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-[#252830]">
          
          {/* Ordenamiento */}
          <div className="flex items-center gap-1.5 flex-1 md:flex-none">
            <span className={`text-xs font-['Inter'] font-medium hidden sm:inline ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Ordenar:
            </span>
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy && setSortBy(e.target.value)}
                className={`w-full sm:w-auto h-9 pl-3 pr-8 rounded-xl border text-xs font-['Inter'] font-medium transition-colors outline-none appearance-none cursor-pointer ${
                  isDark
                    ? 'bg-[#121316] border-[#2b2d35] text-slate-200 hover:border-slate-600 focus:border-amber-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 focus:border-[#006e70]'
                }`}
                aria-label="Ordenar resultados"
              >
                <option value="featured" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>✨ Destacados</option>
                <option value="rating" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>⭐ Mejor Calificados</option>
                <option value="name_asc" className={isDark ? 'bg-[#18191d]' : 'bg-white'}>🔤 Nombre (A-Z)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Selector de Cuadrícula / Lista */}
          <div className={`flex items-center border rounded-xl p-0.5 flex-shrink-0 ${
            isDark ? 'bg-[#121316] border-[#2b2d35]' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setViewMode && setViewMode('grid')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 ${
                viewMode === 'grid'
                  ? isDark
                    ? 'bg-[#252830] text-amber-400 font-bold shadow-xs'
                    : 'bg-white text-[#004655] font-bold shadow-xs border border-slate-200/80'
                  : isDark
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label="Vista en cuadrícula"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode && setViewMode('list')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer active:scale-95 ${
                viewMode === 'list'
                  ? isDark
                    ? 'bg-[#252830] text-amber-400 font-bold shadow-xs'
                    : 'bg-white text-[#004655] font-bold shadow-xs border border-slate-200/80'
                  : isDark
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              aria-label="Vista en lista"
            >
              <List size={15} />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}

