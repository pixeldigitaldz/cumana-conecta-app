'use client';

import React from 'react';
import { 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  Heart, 
  Sparkles, 
  Pill, 
  Stethoscope, 
  Utensils, 
  Coffee, 
  Wrench, 
  BookOpen, 
  Lightbulb, 
  ShoppingBag,
  Store
} from 'lucide-react';
import { Business } from '@/types/business';

interface CategoryCardItem {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  matchKeys: string[];
}

const CATEGORY_ITEMS: CategoryCardItem[] = [
  {
    id: 'todos',
    name: 'Todos los Rubros',
    subtitle: 'Catálogo completo',
    icon: LayoutGrid,
    matchKeys: ['todos', 'todas']
  },
  {
    id: 'farmacias',
    name: 'Farmacias 24h',
    subtitle: 'Guardia y medicinas',
    icon: Pill,
    matchKeys: ['farmacia', 'farmacias']
  },
  {
    id: 'salud',
    name: 'Clínicas y Salud',
    subtitle: 'Médicos y laboratorios',
    icon: Stethoscope,
    matchKeys: ['salud', 'clínica', 'médico']
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes',
    subtitle: 'Mariscos y comida',
    icon: Utensils,
    matchKeys: ['gastronomía', 'restaurante', 'asador', 'marisquería']
  },
  {
    id: 'reposterias',
    name: 'Reposterías & Café',
    subtitle: 'Tortas y postres',
    icon: Coffee,
    matchKeys: ['repostería', 'dulcería', 'café', 'postres']
  },
  {
    id: 'talleres',
    name: 'Talleres & Autos',
    subtitle: 'Mecánica y repuestos',
    icon: Wrench,
    matchKeys: ['taller', 'auto', 'mecánica', 'repuesto', 'servicios técnicos']
  },
  {
    id: 'librerias',
    name: 'Librerías & Útiles',
    subtitle: 'Papelería y copias',
    icon: BookOpen,
    matchKeys: ['librería', 'papelería', 'útiles']
  },
  {
    id: 'emprendedores',
    name: 'Emprendedores',
    subtitle: 'Tecnología y servicios',
    icon: Lightbulb,
    matchKeys: ['emprendedor', 'tecnología', 'apple', 'técnico']
  },
  {
    id: 'supermercados',
    name: 'Supermercados',
    subtitle: 'Víveres y charcutería',
    icon: ShoppingBag,
    matchKeys: ['supermercado', 'charcutería', 'comercio & tiendas', 'tiendas']
  }
];

interface SearchAndFiltersProps {
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
  businesses: Business[];
  paymentFilter: string;
  onPaymentFilterChange: (payment: string) => void;
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  favoritesCount: number;
  onlyVip: boolean;
  onToggleOnlyVip: () => void;
  sortBy: 'priority' | 'rating' | 'reviews' | 'name';
  onSortByChange: (sort: 'priority' | 'rating' | 'reviews' | 'name') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function SearchAndFilters({
  selectedCategory,
  onSelectCategory,
  businesses,
  paymentFilter,
  onPaymentFilterChange,
  onlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount,
  onlyVip,
  onToggleOnlyVip,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange
}: SearchAndFiltersProps) {

  // Conteo dinámico por categoría
  const getCategoryCount = (item: CategoryCardItem) => {
    if (item.id === 'todos') {
      return businesses.length;
    }
    return businesses.filter(b => {
      const catLower = (b.category || '').toLowerCase();
      const nameLower = (b.name || '').toLowerCase();
      const multiMatch = Boolean(b.categories?.some(c => item.matchKeys.some(k => c.toLowerCase().includes(k))));
      return item.matchKeys.some(k => catLower.includes(k) || nameLower.includes(k)) || multiMatch;
    }).length;
  };

  const isSelected = (item: CategoryCardItem) => {
    if (selectedCategory === 'Todos' || selectedCategory === 'Todas') {
      return item.id === 'todos';
    }
    return selectedCategory === item.name || item.matchKeys.some(k => selectedCategory.toLowerCase().includes(k));
  };

  return (
    <section className="w-full my-8 space-y-6">
      {/* Encabezado */}
      <div className="space-y-1">
        <span className="text-[11px] font-mono-tabular uppercase tracking-[0.14em] text-[#004655] dark:text-[#fbbf24] font-bold block">
          EXPLORAR POR RUBRO
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Categorías Comerciales y de Servicios
        </h2>
      </div>

      {/* Grilla de Tarjetas de Categorías (2 Columnas en móvil, 3 en tablet, 5 en desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {CATEGORY_ITEMS.map((item) => {
          const active = isSelected(item);
          const IconComponent = item.icon;
          const count = getCategoryCount(item);

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectCategory(item.id === 'todos' ? 'Todos' : item.name)}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border flex items-center justify-between gap-2 sm:gap-3 text-left transition-all duration-150 cursor-pointer group active:scale-95 ${
                active
                  ? 'bg-[#004655] border-[#004655] text-white shadow-md ring-1 ring-[#004655]/30 dark:bg-[#fbbf24] dark:border-[#fbbf24] dark:text-slate-950 dark:ring-amber-400/50'
                  : 'bg-white dark:bg-[#11141a] border-slate-200 dark:border-[#222630] hover:border-[#004655]/40 dark:hover:border-slate-700 text-slate-800 dark:text-white shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Contenedor de icono */}
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    active
                      ? 'bg-white/15 text-white dark:bg-[#090a0f] dark:text-[#fbbf24]'
                      : 'bg-slate-100 dark:bg-[#161920] border border-slate-200/80 dark:border-[#252934] text-[#004655] dark:text-[#fbbf24]'
                  }`}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
                </div>

                <div className="truncate">
                  <h3 className={`text-xs sm:text-sm font-bold truncate leading-tight ${active ? 'text-white dark:text-slate-950' : 'text-slate-900 dark:text-white'}`}>
                    {item.name}
                  </h3>
                  <p className={`text-[10px] sm:text-[11px] truncate mt-0.5 ${active ? 'text-slate-200 dark:text-slate-800 font-semibold' : 'text-slate-500 dark:text-slate-400 font-normal'}`}>
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Badge monoespaciado a la derecha */}
              <span
                className={`text-[9px] sm:text-[11px] font-mono-tabular font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg shrink-0 border ${
                  active
                    ? 'bg-white/20 text-white border-white/20 dark:bg-black/15 dark:text-slate-950 dark:border-black/10'
                    : 'bg-slate-100 dark:bg-[#161920] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#252934]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Herramientas Inferior */}
      <div className="rounded-xl border border-slate-200 dark:border-[#222630] bg-white dark:bg-[#11141a] p-2.5 px-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Lado Izquierdo: Filtrar por + Select pagos + Guardados + Solo Destacados */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#004655] dark:text-[#fbbf24]" strokeWidth={2} />
            <span>Filtrar por:</span>
          </div>

          {/* Select Métodos de Pago */}
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#004655] dark:focus:border-[#fbbf24] cursor-pointer"
          >
            <option value="all">Todos los métodos de pago</option>
            <option value="cashea">Cashea (Cuotas)</option>
            <option value="pago_movil">Pago Móvil</option>
            <option value="efectivo_usd">Efectivo USD ($)</option>
            <option value="punto_de_venta">Punto de Venta / Débito</option>
            <option value="zelle">Zelle</option>
            <option value="binance">Binance Pay</option>
          </select>

          {/* Botón Guardados (Favoritos) */}
          <button
            type="button"
            onClick={onToggleOnlyFavorites}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyFavorites
                ? 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'bg-slate-50 dark:bg-[#161920] border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} strokeWidth={2} />
            <span>Guardados ({favoritesCount})</span>
          </button>

          {/* Botón Solo Destacados */}
          <button
            type="button"
            onClick={onToggleOnlyVip}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              onlyVip
                ? 'bg-[#004655]/10 border-[#004655] text-[#004655] dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-400 font-bold shadow-xs'
                : 'bg-slate-50 dark:bg-[#161920] border-slate-200 dark:border-[#252934] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#004655] dark:text-[#fbbf24]" strokeWidth={2} />
            <span>Solo Destacados</span>
          </button>
        </div>

        {/* Lado Derecho: Orden + Conmutador Cuadrícula/Lista */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          <select
            value={sortBy}
            onChange={(e: any) => onSortByChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:border-[#004655] dark:focus:border-[#fbbf24] cursor-pointer"
          >
            <option value="priority">Orden: Prioridad Oficial</option>
            <option value="rating">Orden: Mejor Calificados</option>
            <option value="reviews">Orden: Más Reseñas</option>
            <option value="name">Orden: Nombre (A-Z)</option>
          </select>

          {/* Botones Grid / List */}
          <div className="flex items-center p-0.5 bg-slate-50 dark:bg-[#161920] border border-slate-200 dark:border-[#252934] rounded-lg">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Ver en cuadrícula"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="Ver en lista"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#004655] text-white dark:bg-[#fbbf24] dark:text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
