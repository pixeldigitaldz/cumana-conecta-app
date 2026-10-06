import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  Search,
  Star,
  CheckCircle2,
  Clock,
  XCircle,
  Edit3,
  Trash2,
  X,
  Shield,
  ShieldCheck,
  ChevronDown,
  Save,
  AlertTriangle,
  Filter,
  Layers,
  Store,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  MessageCircle,
  MapPin,
  Tag,
  CreditCard,
  Building2,
  ShoppingBag,
  Sparkles,
  Smile,
} from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
  GlobeIcon,
  PhoneIcon,
  CasheaIcon,
} from '../../../components/SocialIcons';
import adminStore from '../../../store/adminStore.js';
import { DEFAULT_EXTENDED_DETAILS_BY_CATEGORY } from '../../../data/mockBusinessData.js';

const STATUS_OPTS = [
  { value: 'all', label: 'Todas las solicitudes' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'active', label: 'Activos' },
  { value: 'rejected', label: 'Rechazados' },
];

const STATUS_BADGE = {
  active: { label: 'Activo', color: '#15803d', bg: '#dcfce7', dot: '#22c55e' },
  pending: { label: 'Pendiente', color: '#b45309', bg: '#fef3c7', dot: '#f59e0b' },
  rejected: { label: 'Rechazado', color: '#b91c1c', bg: '#fee2e2', dot: '#ef4444' },
};

const PAYMENT_OPTIONS = [
  { id: 'cashea', label: 'Cashea', isCashea: true },
  { id: 'pago_movil', label: 'Pago Móvil' },
  { id: 'binance', label: 'Binance / USDT' },
  { id: 'usd_cash', label: 'USD / Zelle' },
  { id: 'punto_de_venta', label: 'Punto de Venta' },
];

const EMPTY_FORM = {
  name: '',
  rif: '',
  categoryLabel: '',
  category: '',
  zone: '',
  address: '',
  referencePoint: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  tiktok: '',
  youtube: '',
  facebook: '',
  website: '',
  videoTourUrl: '',
  videoTourTitle: '',
  description: '',
  activePromotion: '',
  promoDetails: '',
  bannerUrl: '',
  logoUrl: '🏪',
  paymentMethods: [],
  showCasheaCalculator: true,
  showHighlights: true,
  highlights: [],
  showFeaturedProducts: true,
  featuredProducts: [],
  tags: '',
  plan: 'standard',
  status: 'pending',
  isVerified: false,
  isOpen24h: false,
  isSpotlight: false,
  spotlightTagline: '',
  spotlightPromoTitle: '',
  spotlightPromoBadge: 'RECOMENDADO',
  spotlightPromoDesc: '',
  rating: 4.5,
  reviewCount: 0,
  schedule: { 'Lunes a Viernes': '8:00 AM - 6:00 PM' },
  scheduleText: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
};

function formatBusinessDate(dateStr, idx = 0) {
  if (!dateStr) {
    const defaultDates = [
      { date: '15 Oct 2023', time: '10:30 AM' },
      { date: '14 Oct 2023', time: '03:15 PM' },
      { date: '12 Oct 2023', time: '09:45 AM' },
      { date: '10 Oct 2023', time: '11:20 AM' },
      { date: '08 Oct 2023', time: '04:50 PM' },
      { date: '05 Oct 2023', time: '01:10 PM' },
      { date: '02 Oct 2023', time: '08:30 AM' },
      { date: '28 Sep 2023', time: '02:40 PM' },
    ];
    return defaultDates[idx % defaultDates.length];
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { date: 'Reciente', time: '10:00 AM' };
    }
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    return {
      date: `${day} ${month} ${year}`,
      time: `${formattedHours}:${minutes} ${ampm}`,
    };
  } catch {
    return { date: '15 Oct 2023', time: '10:30 AM' };
  }
}

function PlanBadge({ plan, isFeatured }) {
  const p = (plan || (isFeatured ? 'vip' : 'standard')).toLowerCase();

  if (p === 'vip' || p === 'vip_caribe' || isFeatured) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#ea580c] border border-[#ea580c]/30 bg-[#ea580c]/5 font-['Inter']">
        <span>VIP Caribe</span>
        <span className="text-[9px] bg-[#ea580c] text-white px-1 py-0.2 rounded font-extrabold tracking-wide">
          TOP
        </span>
      </span>
    );
  }
  if (p === 'premium') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-[#00a896] border border-[#00a896]/40 bg-[#00a896]/5 font-['Inter']">
        Premium
      </span>
    );
  }
  if (p === 'standard' || p === 'estandar') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-slate-600 border border-slate-200 bg-slate-50 font-['Inter']">
        Estándar
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-slate-500 border border-slate-200 bg-slate-50 font-['Inter']">
      Básico
    </span>
  );
}

function StatusBadge({ status }) {
  const badge = STATUS_BADGE[status] || STATUS_BADGE.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-['Inter']"
      style={{ backgroundColor: badge.bg, color: badge.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: badge.dot }}
      />
      {badge.label}
    </span>
  );
}

function BusinessForm({ initial, categories, zones, onSave, onClose }) {
  const [availableCategories, setAvailableCategories] = useState(() => {
    return Array.isArray(categories) && categories.length > 0 ? categories : adminStore.getCategories();
  });
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🏪');
  const QUICK_EMOJIS = ['🏪', '🛒', '🍔', '🍰', '☕', '💊', '🏥', '🔧', '🚗', '📚', '💡', '🏨', '✂️', '🐾', '🌊', '⚡'];
  const POPULAR_BUSINESS_EMOJIS = [
    '🏪', '🛒', '🍽️', '🍔', '🍕', '🍰', '☕', '💊', '🏥', '🔬', '🦷', '🔧', '🚗', '💻', '📱', '💈', '✂️', '📚', '🏨', '🐾', '⚡', '🥩', '🐟', '🧀', '🥐', '👗', '👟', '🎨', '🏋️', '🍦', '🛠️', '🌮'
  ];

  const [form, setForm] = useState(() => {
    const merged = { ...EMPTY_FORM, ...initial };
    if (initial?.id) {
      merged.logoUrl = initial.logoUrl !== undefined && initial.logoUrl !== null ? initial.logoUrl : '';
    }
    if (merged.schedule && typeof merged.schedule === 'object' && !merged.scheduleText) {
      merged.scheduleText = Object.entries(merged.schedule)
        .map(([k, v]) => `${k}: ${v}`)
        .join(' | ');
    }
    if (merged.showFeaturedProducts === undefined) {
      merged.showFeaturedProducts = true;
    }
    if (initial?.featuredProducts !== undefined && Array.isArray(initial.featuredProducts)) {
      merged.featuredProducts = JSON.parse(JSON.stringify(initial.featuredProducts));
    } else {
      const template = DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[merged.category]?.featuredProducts;
      merged.featuredProducts = template ? JSON.parse(JSON.stringify(template)) : [];
    }

    if (merged.showHighlights === undefined) {
      merged.showHighlights = true;
    }
    if (initial?.highlights !== undefined && Array.isArray(initial.highlights)) {
      merged.highlights = JSON.parse(JSON.stringify(initial.highlights));
    } else {
      const template = DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[merged.category]?.highlights || DEFAULT_EXTENDED_DETAILS_BY_CATEGORY.tiendas?.highlights;
      merged.highlights = template ? JSON.parse(JSON.stringify(template)) : [];
    }

    // Normalizar categoría si venía con nombre en lugar de ID
    const allCats = Array.isArray(categories) && categories.length > 0 ? categories : adminStore.getCategories();
    if (merged.category) {
      const found = allCats.find((c) => c.id === merged.category || (c.label && c.label.toLowerCase() === merged.category.toLowerCase()));
      if (found) {
        merged.category = found.id;
        merged.categoryLabel = found.label;
      }
    }
    return merged;
  });

  const handleCreateCategoryInline = () => {
    if (!newCatName.trim()) return;
    const added = adminStore.addCategory({
      label: newCatName.trim(),
      emoji: newCatEmoji,
      icon: 'Store',
    });
    const updated = adminStore.getCategories();
    setAvailableCategories(updated);
    setForm((f) => ({
      ...f,
      category: added.id,
      categoryLabel: added.label,
    }));
    setNewCatName('');
    setShowNewCatInput(false);
  };
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const togglePayment = (id) => {
    const methods = form.paymentMethods || [];
    set(
      'paymentMethods',
      methods.includes(id) ? methods.filter((m) => m !== id) : [...methods, id]
    );
  };

  // Handlers para Aspectos Destacados y Ventajas
  const handleLoadHighlightsCategoryTemplate = (catKey = form.category) => {
    const template = DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[catKey]?.highlights || DEFAULT_EXTENDED_DETAILS_BY_CATEGORY.tiendas?.highlights;
    if (template && template.length > 0) {
      set('highlights', JSON.parse(JSON.stringify(template)));
    }
  };

  const handleAddHighlight = () => {
    const current = form.highlights || [];
    set('highlights', [...current, '']);
  };

  const handleUpdateHighlight = (idx, val) => {
    const current = [...(form.highlights || [])];
    current[idx] = val;
    set('highlights', current);
  };

  const handleDeleteHighlight = (idx) => {
    const current = [...(form.highlights || [])];
    current.splice(idx, 1);
    set('highlights', current);
  };

  // Handlers para Productos, Servicios & Especialidades
  const handleLoadCategoryTemplate = (catKey = form.category) => {
    const template = DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[catKey]?.featuredProducts;
    if (template && template.length > 0) {
      set('featuredProducts', JSON.parse(JSON.stringify(template)));
    }
  };

  const handleAddProductCategory = () => {
    const current = form.featuredProducts || [];
    set('featuredProducts', [
      ...current,
      { title: 'Nueva Categoría', items: ['Nuevo producto o servicio'] },
    ]);
  };

  const handleUpdateCategoryTitle = (catIdx, title) => {
    const current = [...(form.featuredProducts || [])];
    if (!current[catIdx]) return;
    current[catIdx] = { ...current[catIdx], title };
    set('featuredProducts', current);
  };

  const handleDeleteProductCategory = (catIdx) => {
    const current = [...(form.featuredProducts || [])];
    current.splice(catIdx, 1);
    set('featuredProducts', current);
  };

  const handleAddProductItem = (catIdx) => {
    const current = [...(form.featuredProducts || [])];
    if (!current[catIdx]) return;
    current[catIdx] = {
      ...current[catIdx],
      items: [...(current[catIdx].items || []), ''],
    };
    set('featuredProducts', current);
  };

  const handleUpdateProductItem = (catIdx, itemIdx, val) => {
    const current = [...(form.featuredProducts || [])];
    if (!current[catIdx]) return;
    const newItems = [...(current[catIdx].items || [])];
    newItems[itemIdx] = val;
    current[catIdx] = { ...current[catIdx], items: newItems };
    set('featuredProducts', current);
  };

  const handleDeleteProductItem = (catIdx, itemIdx) => {
    const current = [...(form.featuredProducts || [])];
    if (!current[catIdx]) return;
    const newItems = [...(current[catIdx].items || [])];
    newItems.splice(itemIdx, 1);
    current[catIdx] = { ...current[catIdx], items: newItems };
    set('featuredProducts', current);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nombre requerido';
    if (!form.category) e.category = 'Categoría requerida';
    if (!form.zone) e.zone = 'Zona requerida';
    if (!form.address.trim()) e.address = 'Dirección requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 250));
    const cleanHighlights = (form.highlights || [])
      .map((h) => (typeof h === 'string' ? h.trim() : ''))
      .filter(Boolean);

    const cleanFeaturedProducts = (form.featuredProducts || [])
      .map((group) => ({
        title: (group.title || '').trim(),
        items: (group.items || [])
          .map((it) => (typeof it === 'string' ? it.trim() : ''))
          .filter(Boolean),
      }))
      .filter((group) => group.title || group.items.length > 0);

    const catObj = availableCategories.find((c) => c.id === form.category);
    let resolvedCategory = form.category;
    let resolvedCategoryLabel = catObj ? catObj.label : (form.categoryLabel || form.category);

    // Si la categoría no existía en el store, registrarla para que aparezca en Categorías Principales
    if (resolvedCategory && !adminStore.getCategories().some((c) => c.id === resolvedCategory)) {
      const registered = adminStore.addCategory({
        id: resolvedCategory,
        label: resolvedCategoryLabel || resolvedCategory,
        emoji: '🏪',
        icon: 'Store',
      });
      resolvedCategory = registered.id;
      resolvedCategoryLabel = registered.label;
    }

    const data = {
      ...form,
      category: resolvedCategory,
      categoryLabel: resolvedCategoryLabel,
      highlights: cleanHighlights,
      showHighlights: form.showHighlights !== false,
      featuredProducts: cleanFeaturedProducts,
      showFeaturedProducts: form.showFeaturedProducts !== false,
      schedule: form.scheduleText ? { 'Horario': form.scheduleText } : form.schedule,
      tags:
        typeof form.tags === 'string'
          ? form.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : form.tags,
    };
    onSave(data);
    setSaving(false);
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border outline-none transition focus:border-[#00a896] bg-white ${
      errors[field] ? 'border-rose-400' : 'border-slate-200'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
    >
      <div className="ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
              {initial?.id ? 'Editar Comercio' : 'Agregar Nuevo Comercio'}
            </h3>
            <p className="text-xs text-slate-500 font-['Inter']">
              {initial?.id
                ? 'Actualiza los datos y plan comercial de este negocio.'
                : 'Completa los datos para registrar un comercio en Cumaná.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Informacion Basica */}
          <section className="space-y-4">
            <h4 className="font-['Outfit'] font-semibold text-sm text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">
              Información del Negocio
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Nombre Comercial *
                </label>
                <input
                  className={inputClass('name')}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Ej. Multiservicio Rapid Service CA"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter'] flex items-center justify-between">
                  <span>Número de RIF</span>
                  <span className="text-[10px] text-slate-400 font-normal">Empresarial</span>
                </label>
                <input
                  className={inputClass('rif')}
                  value={form.rif || ''}
                  onChange={(e) => set('rif', e.target.value.toUpperCase())}
                  placeholder="Ej. J-12345678-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-600 font-['Inter']">
                    Categoría / Rubro *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewCatInput(!showNewCatInput)}
                    className="text-[11px] font-bold text-[#00a896] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>{showNewCatInput ? 'Cancelar' : '+ Nueva Categoría'}</span>
                  </button>
                </div>

                {showNewCatInput && (
                  <div className="mb-2 p-2.5 rounded-xl bg-teal-50/60 border border-teal-200/90 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <select
                        value={newCatEmoji}
                        onChange={(e) => setNewCatEmoji(e.target.value)}
                        className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-base cursor-pointer outline-none"
                        title="Seleccionar emoji para la categoría"
                      >
                        {QUICK_EMOJIS.map((em) => (
                          <option key={em} value={em}>
                            {em}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Ej. Hoteles & Posadas..."
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 outline-none focus:border-[#00a896] bg-white font-['Inter']"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateCategoryInline();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategoryInline}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#00a896] hover:brightness-110 transition cursor-pointer shrink-0 font-['Inter']"
                      >
                        Crear
                      </button>
                    </div>
                    <p className="text-[10px] text-teal-700 font-['Inter']">
                      Se agregará como categoría principal en el catálogo y directorio de Cumaná.
                    </p>
                  </div>
                )}

                <select
                  className={inputClass('category')}
                  value={form.category}
                  onChange={(e) => {
                    const catId = e.target.value;
                    const catObj = availableCategories.find((c) => c.id === catId);
                    setForm((f) => ({
                      ...f,
                      category: catId,
                      categoryLabel: catObj ? catObj.label : f.categoryLabel,
                    }));
                  }}
                >
                  <option value="">Selecciona una categoría</option>
                  {/* Categoría asignada previamente no indexada */}
                  {form.category && !availableCategories.some((c) => c.id === form.category) && (
                    <option value={form.category}>
                      📁 {form.categoryLabel || form.category} (Personalizada)
                    </option>
                  )}
                  {availableCategories
                    .filter((c) => c.id !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-rose-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Zona en Cumaná *
                </label>
                <select
                  className={inputClass('zone')}
                  value={form.zone}
                  onChange={(e) => set('zone', e.target.value)}
                >
                  <option value="">Selecciona una zona</option>
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
                {errors.zone && <p className="text-xs text-rose-500 mt-1">{errors.zone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Dirección Detallada *
                </label>
                <input
                  className={inputClass('address')}
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Ej. Calle Montes con Av. Bermúdez..."
                />
                {errors.address && (
                  <p className="text-xs text-rose-500 mt-1">{errors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Punto de Referencia Territorial
                </label>
                <input
                  className={inputClass()}
                  value={form.referencePoint || ''}
                  onChange={(e) => set('referencePoint', e.target.value)}
                  placeholder="Ej. Frente a la Plaza Bermúdez / Cerca del Elevado"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                Horario de Atención Semanal
              </label>
              <input
                className={inputClass()}
                value={form.scheduleText || ''}
                onChange={(e) => set('scheduleText', e.target.value)}
                placeholder="Ej. Lun - Vie: 8:00 AM - 6:00 PM | Sáb: 8:00 AM - 2:00 PM"
              />
            </div>

            {/* Icono o Emoji Representativo */}
            <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700 font-['Inter'] flex items-center gap-1.5">
                    <Smile size={14} className="text-teal-600" />
                    <span>Icono o Emoji Representativo</span>
                  </label>
                  <p className="text-[11px] text-slate-500 font-['Inter']">
                    Se muestra en las tarjetas de búsqueda, directorio y encabezado del comercio.
                  </p>
                </div>
                {form.logoUrl ? (
                  <button
                    type="button"
                    onClick={() => set('logoUrl', '')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 transition cursor-pointer"
                    title="Quitar icono para no mostrar ningún emoji"
                  >
                    <Trash2 size={13} />
                    <span>Quitar icono</span>
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    Sin icono (Iniciales activas)
                  </span>
                )}
              </div>

              {/* Input + Preview */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border border-slate-200 bg-white flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden"
                  title="Vista previa del icono"
                >
                  {form.logoUrl && (form.logoUrl.startsWith('http') || form.logoUrl.startsWith('/')) ? (
                    <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : form.logoUrl ? (
                    <span className="text-2xl select-none">{form.logoUrl}</span>
                  ) : (
                    <span className="text-xs font-black text-teal-700 bg-teal-50 w-full h-full flex items-center justify-center select-none">
                      {form.name ? form.name.slice(0, 2).toUpperCase() : 'CC'}
                    </span>
                  )}
                </div>

                <div className="flex-1 relative">
                  <input
                    className={`${inputClass()} pr-8`}
                    value={form.logoUrl || ''}
                    onChange={(e) => set('logoUrl', e.target.value)}
                    placeholder="Escribe o pega un emoji o URL (o déjalo vacío)..."
                  />
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => set('logoUrl', '')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                      title="Borrar icono"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Selector Rápido de Emojis */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 font-['Inter']">
                    Selecciona un emoji para asignarlo o cambiarlo:
                  </span>
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => set('logoUrl', '')}
                      className="text-[11px] font-medium text-slate-500 hover:text-rose-600 underline cursor-pointer"
                    >
                      Dejar sin emoji
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-white border border-slate-200/80 max-h-28 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => set('logoUrl', '')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                      !form.logoUrl
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="No mostrar emoji (usar iniciales)"
                  >
                    <span>🚫 Sin icono</span>
                  </button>
                  {POPULAR_BUSINESS_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => set('logoUrl', emoji)}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition cursor-pointer hover:scale-115 active:scale-95 ${
                        form.logoUrl === emoji
                          ? 'bg-teal-100 border-2 border-teal-500 shadow-xs'
                          : 'hover:bg-slate-100'
                      }`}
                      title={`Seleccionar ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  💡 Haz clic en cualquier emoji para asignarlo al instante, o pulsa "Sin icono" / "Quitar icono" si no quieres que aparezca ninguno.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                Descripción del Comercio
              </label>
              <textarea
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-white resize-none"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Breve reseña sobre productos, especialidades o servicios..."
              />
            </div>
          </section>

          {/* Contacto y Redes Oficiales */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-['Outfit'] font-semibold text-sm text-slate-700 uppercase tracking-wide">
                Canales de Atención y Redes Oficiales
              </h4>
              <span className="text-[11px] text-slate-400 font-['Inter']">
                Conectados a la plantilla del local
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                  <WhatsAppIcon size={14} className="text-[#25D366]" />
                  <span>WhatsApp (con código país)</span>
                </label>
                <input
                  className={inputClass()}
                  value={form.whatsapp || ''}
                  onChange={(e) => set('whatsapp', e.target.value)}
                  placeholder="584120000000"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Formato: 584121234567</span>
              </div>

              {/* Teléfono */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                  <PhoneIcon size={14} className="text-sky-600" />
                  <span>Teléfono Fijo / Móvil</span>
                </label>
                <input
                  className={inputClass()}
                  value={form.phone || ''}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="+58 293-4310000"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                  <InstagramIcon size={14} className="text-[#E4405F]" />
                  <span>Instagram Oficial</span>
                </label>
                <input
                  className={inputClass()}
                  value={form.instagram || ''}
                  onChange={(e) => set('instagram', e.target.value)}
                  placeholder="@minegocio_cumana"
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                  <TikTokIcon size={14} className="text-slate-900" />
                  <span>TikTok Oficial</span>
                </label>
                <input
                  className={inputClass()}
                  value={form.tiktok || ''}
                  onChange={(e) => set('tiktok', e.target.value)}
                  placeholder="@minegocio"
                />
              </div>

              {/* YouTube */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                  <YouTubeIcon size={14} className="text-[#FF0000]" />
                  <span>Canal o Video de YouTube</span>
                </label>
                <input
                  className={inputClass()}
                  value={form.youtube || ''}
                  onChange={(e) => set('youtube', e.target.value)}
                  placeholder="https://youtube.com/@canal"
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                  <FacebookIcon size={14} className="text-[#1877F2]" />
                  <span>Página de Facebook</span>
                </label>
                <input
                  className={inputClass()}
                  value={form.facebook || ''}
                  onChange={(e) => set('facebook', e.target.value)}
                  placeholder="https://facebook.com/minegocio o @usuario"
                />
              </div>

              {/* Sitio Web / Menú Virtual */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 font-['Inter'] flex items-center gap-1.5">
                  <GlobeIcon size={14} className="text-teal-600" />
                  <span>Sitio Web / Catálogo Digital / Menú Virtual</span>
                </label>
                <input
                  className={inputClass()}
                  value={form.website || ''}
                  onChange={(e) => set('website', e.target.value)}
                  placeholder="https://minegocio.com o https://menu.minegocio.com"
                />
              </div>
            </div>
          </section>

          {/* Video Guía "Cómo Llegar" */}
          <section className="space-y-4 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
            <div className="flex items-center gap-2">
              <span className="text-base">🎬</span>
              <div>
                <h4 className="font-['Outfit'] font-bold text-sm text-slate-900">
                  Video Guía "Cómo Llegar" (Shorts / Reels / YouTube)
                </h4>
                <p className="text-xs text-slate-500 font-['Inter']">
                  Permite a los visitantes ver la fachada real, calle y referencias visuales en Cumaná.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                URL del Video (YouTube Short, Video, Reel o MP4)
              </label>
              <input
                className={inputClass()}
                value={form.videoTourUrl || ''}
                onChange={(e) => set('videoTourUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... o https://youtube.com/shorts/..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                Título o Referencia de la Ruta
              </label>
              <input
                className={inputClass()}
                value={form.videoTourTitle || ''}
                onChange={(e) => set('videoTourTitle', e.target.value)}
                placeholder="Ej. Ruta desde el Monumento al Pescador hasta la puerta del local"
              />
            </div>
          </section>

          {/* Anuncio Destacado en Carrusel Principal */}
          <section className="space-y-4 p-4 rounded-2xl bg-amber-50/70 border border-amber-300/80">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">⭐</span>
                <div>
                  <h4 className="font-['Outfit'] font-bold text-sm text-slate-900">
                    Anuncio en Carrusel de Comercios Destacados
                  </h4>
                  <p className="text-xs text-slate-500 font-['Inter']">
                    Muestra este comercio en la vitrina superior (entre filtros y catálogo), independientemente del plan o pago.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 font-['Inter'] select-none">
                <input
                  type="checkbox"
                  checked={!!form.isSpotlight}
                  onChange={(e) => set('isSpotlight', e.target.checked)}
                  className="w-5 h-5 rounded text-[#00a896] accent-[#00a896] cursor-pointer"
                />
                <span className={form.isSpotlight ? 'text-amber-800 font-extrabold' : 'text-slate-500'}>
                  {form.isSpotlight ? 'Activo en Carrusel' : 'Inactivo'}
                </span>
              </label>
            </div>

            {form.isSpotlight && (
              <div className="space-y-3 pt-3 border-t border-amber-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                    Slogan o Frase Resaltada del Anuncio
                  </label>
                  <input
                    className={inputClass()}
                    value={form.spotlightTagline || ''}
                    onChange={(e) => set('spotlightTagline', e.target.value)}
                    placeholder="Ej. El auténtico sabor del Golfo de Cariaco frente al mar"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                      Título de Promoción / Oferta
                    </label>
                    <input
                      className={inputClass()}
                      value={form.spotlightPromoTitle || ''}
                      onChange={(e) => set('spotlightPromoTitle', e.target.value)}
                      placeholder="Ej. Combo Playero Pargo Rojo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                      Distintivo de la Promoción
                    </label>
                    <input
                      className={inputClass()}
                      value={form.spotlightPromoBadge || 'RECOMENDADO'}
                      onChange={(e) => set('spotlightPromoBadge', e.target.value)}
                      placeholder="RECOMENDADO, OFERTA VIP, ETC."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 font-['Inter']">
                    Detalle del Combo o Beneficio Promocional
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-white resize-none"
                    value={form.spotlightPromoDesc || ''}
                    onChange={(e) => set('spotlightPromoDesc', e.target.value)}
                    placeholder="Ej. Pargo frito de 700g con tostones playeros, queso paisa y ensalada tropical + 2 bebidas por $18."
                  />
                </div>
              </div>
            )}
          </section>

          {/* Fotografía & Promociones */}
          <section className="space-y-4">
            <h4 className="font-['Outfit'] font-semibold text-sm text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">
              Fotografía, Banner & Promociones
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                Foto Principal / Banner URL
              </label>
              <input
                className={inputClass()}
                value={form.bannerUrl || ''}
                onChange={(e) => set('bannerUrl', e.target.value)}
                placeholder="https://images.unsplash.com/... o /images/..."
              />
              {form.bannerUrl && (
                <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                  <img src={form.bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                    Vista Previa de Foto
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Promoción Activa / Oferta
                </label>
                <input
                  className={inputClass()}
                  value={form.activePromotion || ''}
                  onChange={(e) => set('activePromotion', e.target.value)}
                  placeholder="Ej: 15% OFF en repuestos"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Enlace de Google Maps
                </label>
                <input
                  className={inputClass()}
                  value={form.googleMapsUrl || ''}
                  onChange={(e) => set('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                Etiquetas / Tags de Búsqueda (separadas por coma)
              </label>
              <input
                className={inputClass()}
                value={Array.isArray(form.tags) ? form.tags.join(', ') : (form.tags || '')}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="Acepta Cashea, Delivery, Arepas, Centro..."
              />
            </div>
          </section>

          {/* ─── Aspectos Destacados y Ventajas ─── */}
          <section className="space-y-4 p-4 rounded-2xl bg-[#0b0f17] border border-slate-800 text-white shadow-md">
            {/* Header con Título, Contador y Switch Activar/Desactivar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-['Outfit'] font-bold text-sm text-white">
                      Aspectos Destacados y Ventajas
                    </h4>
                    <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.2 rounded-full">
                      {(form.highlights || []).length} { (form.highlights || []).length === 1 ? 'ventaja' : 'ventajas' }
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-['Inter']">
                    Viñetas de garantías, diferenciales y beneficios destacados con check en la ficha.
                  </p>
                </div>
              </div>

              {/* Toggle de Visualización */}
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold font-['Inter'] select-none bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-amber-400/60 transition shrink-0">
                <input
                  type="checkbox"
                  checked={form.showHighlights !== false}
                  onChange={(e) => set('showHighlights', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <span className={form.showHighlights !== false ? 'text-amber-400' : 'text-slate-400'}>
                  {form.showHighlights !== false ? '✓ Mostrar en el local' : '✕ Oculto en el local'}
                </span>
              </label>
            </div>

            {/* Si está habilitada la sección */}
            {form.showHighlights !== false ? (
              <div className="space-y-4">
                {/* Barra de Acciones / Herramientas */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300 font-['Inter'] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Modifica cada punto destacado con el texto exacto que aparecerá en el local:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {(DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[form.category]?.highlights || DEFAULT_EXTENDED_DETAILS_BY_CATEGORY.tiendas?.highlights) && (
                      <button
                        type="button"
                        onClick={() => handleLoadHighlightsCategoryTemplate(form.category)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                        title="Carga las ventajas recomendadas para este tipo de comercio"
                      >
                        <Sparkles size={13} />
                        <span>Sugerir por rubro</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      <span>Agregar Ventaja</span>
                    </button>
                  </div>
                </div>

                {/* Lista de Aspectos Destacados */}
                {(!form.highlights || form.highlights.length === 0) ? (
                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
                    <p className="text-sm text-slate-400 font-['Inter']">
                      No hay aspectos destacados configurados para este comercio.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Crear primera ventaja</span>
                      </button>
                      {(DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[form.category]?.highlights || DEFAULT_EXTENDED_DETAILS_BY_CATEGORY.tiendas?.highlights) && (
                        <button
                          type="button"
                          onClick={() => handleLoadHighlightsCategoryTemplate(form.category)}
                          className="px-3.5 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles size={14} />
                          <span>Cargar plantilla recomendada</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {form.highlights.map((highlight, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-[#121620] border border-slate-800/90 hover:border-amber-500/30 transition group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                          <Check size={15} />
                        </div>
                        <input
                          type="text"
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-['Inter'] text-white bg-slate-900 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-none transition placeholder:text-slate-500"
                          value={highlight}
                          onChange={(e) => handleUpdateHighlight(hIdx, e.target.value)}
                          placeholder="Ej. Precios competitivos en divisas y bolívares a tasa oficial BCV..."
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteHighlight(hIdx)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition shrink-0 cursor-pointer"
                          title="Eliminar este aspecto destacado"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 flex items-center gap-2 font-['Inter']">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                <span>La sección de "Aspectos Destacados y Ventajas" no se mostrará en la ficha de este comercio.</span>
              </div>
            )}
          </section>

          {/* Productos, Servicios & Especialidades */}
          <section className="space-y-4 p-4 rounded-2xl bg-[#0b0f17] border border-slate-800 text-white shadow-md">
            {/* Header con Título, Contador y Switch Activar/Desactivar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <ShoppingBag size={19} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-['Outfit'] font-bold text-sm text-white">
                      Productos, Servicios & Especialidades
                    </h4>
                    <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.2 rounded-full">
                      {(form.featuredProducts || []).length} { (form.featuredProducts || []).length === 1 ? 'categoría' : 'categorías' }
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-['Inter']">
                    Vitrina visual con categorías y viñetas en la ficha del local.
                  </p>
                </div>
              </div>

              {/* Toggle de Visualización */}
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold font-['Inter'] select-none bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 hover:border-amber-400/60 transition shrink-0">
                <input
                  type="checkbox"
                  checked={form.showFeaturedProducts !== false}
                  onChange={(e) => set('showFeaturedProducts', e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <span className={form.showFeaturedProducts !== false ? 'text-amber-400' : 'text-slate-400'}>
                  {form.showFeaturedProducts !== false ? '✓ Mostrar en el local' : '✕ Oculto en el local'}
                </span>
              </label>
            </div>

            {/* Si está habilitada la sección */}
            {form.showFeaturedProducts !== false ? (
              <div className="space-y-4">
                {/* Barra de Acciones / Herramientas */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300 font-['Inter'] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Edita las tarjetas y opciones exactamente como se verán en la ficha:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[form.category]?.featuredProducts && (
                      <button
                        type="button"
                        onClick={() => handleLoadCategoryTemplate(form.category)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1 cursor-pointer"
                        title="Restablece las opciones recomendadas para este tipo de comercio"
                      >
                        <Sparkles size={13} />
                        <span>Sugerir por rubro</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddProductCategory}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus size={14} />
                      <span>Agregar Categoría</span>
                    </button>
                  </div>
                </div>

                {/* Grid de Tarjetas de Categorías (matching screenshot) */}
                {(!form.featuredProducts || form.featuredProducts.length === 0) ? (
                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
                    <p className="text-sm text-slate-400 font-['Inter']">
                      No hay categorías de productos configuradas para este comercio.
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleAddProductCategory}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Crear primera categoría</span>
                      </button>
                      {DEFAULT_EXTENDED_DETAILS_BY_CATEGORY[form.category]?.featuredProducts && (
                        <button
                          type="button"
                          onClick={() => handleLoadCategoryTemplate(form.category)}
                          className="px-3.5 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles size={14} />
                          <span>Cargar plantilla recomendada</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 ${form.featuredProducts.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                    {form.featuredProducts.map((group, catIdx) => (
                      <div
                        key={catIdx}
                        className="rounded-2xl border border-slate-800 bg-[#121620] p-4 flex flex-col justify-between space-y-3.5 shadow-sm hover:border-amber-500/30 transition"
                      >
                        {/* Cabecera de Categoría */}
                        <div className="pb-3 border-b border-slate-800/90 flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-['Outfit']">
                                Bloque #{catIdx + 1}
                              </span>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#221f15] text-amber-400 border border-[#45371c]">
                                {(group.items || []).length} { (group.items || []).length === 1 ? 'opción' : 'opciones' }
                              </span>
                            </div>
                            <input
                              className="w-full px-3 py-1.5 rounded-xl text-sm font-['Outfit'] font-bold text-white bg-slate-900 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-none transition placeholder:text-slate-500"
                              value={group.title || ''}
                              onChange={(e) => handleUpdateCategoryTitle(catIdx, e.target.value)}
                              placeholder="Ej. Víveres & Alimentos, Hogar & Cuidado..."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteProductCategory(catIdx)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition mt-5 shrink-0 cursor-pointer"
                            title="Eliminar esta categoría"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Lista de Viñetas */}
                        <div className="space-y-2 flex-1">
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Viñetas de Productos / Servicios:
                          </label>
                          {(group.items || []).map((it, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2 group">
                              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-0.5" />
                              <input
                                className="flex-1 px-3 py-1.5 rounded-lg text-xs font-['Inter'] text-slate-200 bg-slate-900/90 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-none transition placeholder:text-slate-600"
                                value={it}
                                onChange={(e) => handleUpdateProductItem(catIdx, itemIdx, e.target.value)}
                                placeholder="Ej. Víveres de primera necesidad, harinas, arroces..."
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteProductItem(catIdx, itemIdx)}
                                className="p-1 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition shrink-0 cursor-pointer"
                                title="Eliminar viñeta"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Botón para agregar viñeta */}
                        <button
                          type="button"
                          onClick={() => handleAddProductItem(catIdx)}
                          className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-700/80 hover:border-amber-400/60 bg-slate-900/50 hover:bg-amber-400/5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                        >
                          <Plus size={13} />
                          <span>Agregar opción / producto</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-1">
                <p className="text-xs text-slate-300 font-['Inter'] font-medium">
                  Sección actualmente <span className="text-amber-400 font-bold">desactivada</span> para este comercio.
                </p>
                <p className="text-[11px] text-slate-500 font-['Inter']">
                  No se mostrará la vitrina de "Productos, Servicios & Especialidades" en la ficha del local.
                </p>
              </div>
            )}
          </section>

          {/* Plan & Estado */}
          <section className="space-y-4">
            <h4 className="font-['Outfit'] font-semibold text-sm text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">
              Plan Comercial & Estado
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Plan Comercial
                </label>
                <select
                  className={inputClass()}
                  value={form.plan || 'basic'}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setForm((f) => ({
                      ...f,
                      plan: selected,
                      isFeatured: selected === 'vip',
                    }));
                  }}
                >
                  <option value="basic">Plan Básico (Gratis)</option>
                  <option value="standard">Plan Estándar ($15/mes)</option>
                  <option value="premium">Plan Premium ($30/mes)</option>
                  <option value="vip">Plan VIP Caribe ($60/mes - TOP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">
                  Estado de Solicitud
                </label>
                <select
                  className={inputClass()}
                  value={form.status || 'pending'}
                  onChange={(e) => set('status', e.target.value)}
                >
                  <option value="pending">🟡 Pendiente de Aprobación</option>
                  <option value="active">🟢 Activo / Aprobado</option>
                  <option value="rejected">🔴 Rechazado</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 font-['Inter'] select-none">
                <input
                  type="checkbox"
                  checked={!!form.isVerified}
                  onChange={(e) => set('isVerified', e.target.checked)}
                  className="w-4 h-4 rounded text-[#00a896] accent-[#00a896] cursor-pointer"
                />
                <span>Insignia Verificada ✓</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 font-['Inter'] select-none">
                <input
                  type="checkbox"
                  checked={!!form.isOpen24h}
                  onChange={(e) => set('isOpen24h', e.target.checked)}
                  className="w-4 h-4 rounded text-[#00a896] accent-[#00a896] cursor-pointer"
                />
                <span>Abierto 24 Horas 🕒</span>
              </label>
            </div>
          </section>

          {/* Metodos de Pago */}
          <section className="space-y-3">
            <h4 className="font-['Outfit'] font-semibold text-sm text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-2">
              Métodos de Pago Aceptados
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PAYMENT_OPTIONS.map((opt) => {
                const checked = (form.paymentMethods || []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => togglePayment(opt.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold font-['Inter'] border text-left transition cursor-pointer ${
                      checked
                        ? opt.id === 'cashea'
                          ? 'border-amber-400 bg-[#FFE600] text-slate-950 font-bold shadow-xs'
                          : 'border-[#00a896] bg-[#00a896]/10 text-[#00a896]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded flex items-center justify-center border border-current text-[10px]">
                      {checked ? '✓' : ''}
                    </span>
                    {opt.id === 'cashea' ? (
                      <span className="inline-flex items-center gap-1.5 font-bold text-slate-950">
                        <img src="/images/cashea-icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>Cashea</span>
                      </span>
                    ) : (
                      <span className="truncate">{opt.label}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Configuración individual de Calculadora Cashea */}
            {(form.paymentMethods || []).includes('cashea') && (
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-300/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#FFE600] border border-amber-300 flex items-center justify-center shrink-0 shadow-xs p-1">
                    <img src="/images/cashea-icon.png" alt="Cashea" className="w-5 h-5 object-contain" />
                  </div>
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 block font-['Inter']">
                        Calculadora Oficial de Cuotas Cashea
                      </span>
                      <span className="text-[10px] bg-slate-900 text-[#FFE600] px-1.5 py-0.2 rounded font-black font-['Inter']">
                        Niveles 1 al 6
                      </span>
                    </div>
                    <span className="text-slate-600 text-[11px] block font-['Inter'] mt-0.5">
                      Desglose de inicial y cuotas en la plantilla del local para este comercio.
                    </span>
                  </div>
                </div>
                <label className="inline-flex items-center gap-1.5 cursor-pointer shrink-0 select-none bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    checked={form.showCasheaCalculator !== false}
                    onChange={(e) => setForm(f => ({ ...f, showCasheaCalculator: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 font-['Inter']">
                    {form.showCasheaCalculator !== false ? 'Habilitada' : 'Deshabilitada'}
                  </span>
                </label>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition hover:brightness-110 cursor-pointer font-['Inter'] shadow-sm"
            style={{ backgroundColor: '#004d5a' }}
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? 'Guardando…' : 'Guardar Comercio'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [zones, setZones] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [spotlightOnly, setSpotlightOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const PAGE_SIZE = 10;

  const load = useCallback(() => {
    setBusinesses(adminStore.getBusinesses());
    setCategories(adminStore.getCategories());
    setZones(adminStore.getZones());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Counts
  const totalCount = businesses.length;
  const pendingCount = businesses.filter((b) => b.status === 'pending').length;
  const activeCount = businesses.filter((b) => b.status === 'active').length;
  const rejectedCount = businesses.filter((b) => b.status === 'rejected').length;
  const spotlightCount = businesses.filter((b) => b.isSpotlight).length;

  // Filtered
  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (spotlightOnly && !b.isSpotlight) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (planFilter !== 'all') {
        const p = (b.plan || (b.isFeatured ? 'vip' : 'standard')).toLowerCase();
        if (planFilter === 'vip' && p !== 'vip' && !b.isFeatured) return false;
        if (planFilter === 'premium' && p !== 'premium') return false;
        if (planFilter === 'standard' && p !== 'standard') return false;
        if (planFilter === 'basic' && p !== 'basic') return false;
      }
      if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = (b.name || '').toLowerCase().includes(q);
        const matchesZone = (b.zone || '').toLowerCase().includes(q);
        const matchesCat = (b.categoryLabel || b.category || '').toLowerCase().includes(q);
        const matchesPhone = (b.phone || b.whatsapp || '').includes(q);
        if (!matchesName && !matchesZone && !matchesCat && !matchesPhone) return false;
      }
      return true;
    });
  }, [businesses, statusFilter, planFilter, categoryFilter, spotlightOnly, search]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleSave = (data) => {
    if (data.id) {
      adminStore.updateBusiness(data.id, data);
    } else {
      adminStore.addBusiness(data);
    }
    load();
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDelete = (id) => {
    adminStore.deleteBusiness(id);
    load();
    setDeleteConfirm(null);
  };

  const handleStatusChange = (id, newStatus) => {
    adminStore.updateBusiness(id, { status: newStatus });
    load();
  };

  const handleVerifyToggle = (biz) => {
    adminStore.verifyBusiness(biz.id, !biz.isVerified);
    load();
  };

  const handleSpotlightToggle = (biz) => {
    adminStore.toggleSpotlight(biz.id);
    load();
  };

  const startIdx = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ─── 1. Breadcrumbs & Header ─── */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-['Inter']">
          <span>Comercios</span>
          <span>›</span>
          <span className="text-[#00a896] font-bold">
            {statusFilter === 'pending'
              ? 'Solicitudes Pendientes'
              : statusFilter === 'active'
              ? 'Comercios Activos'
              : statusFilter === 'rejected'
              ? 'Solicitudes Rechazadas'
              : 'Todos los Comercios'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-[#0f172a] tracking-tight">
              {statusFilter === 'pending' ? 'Solicitudes Pendientes' : 'Gestión de Comercios'}
            </h1>
            <p className="text-sm text-slate-500 font-['Inter'] mt-1">
              Revisa y aprueba las solicitudes de nuevos comercios para unirse a CumanáConecta.
            </p>
          </div>

          <button
            onClick={() => {
              setEditTarget(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-sm hover:brightness-110 active:scale-95 cursor-pointer font-['Inter'] self-start sm:self-auto"
            style={{ backgroundColor: '#004d5a' }}
          >
            <Plus size={18} />
            <span>Agregar Comercio</span>
          </button>
        </div>
      </div>

      {/* ─── 2. Top Metric Cards (3 cards matching mockup) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Solicitudes Totales */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Inter']">
                SOLICITUDES TOTALES
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800 font-['Outfit'] mt-1.5">
                {totalCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#004d5a] text-white flex-shrink-0">
              <Store size={20} className="stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-600 font-['Inter']">
            <span className="font-bold">↑</span>
            <span>+12% vs mes anterior</span>
          </div>
        </div>

        {/* Card 2: Nuevas Hoy / Pendientes */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Inter']">
                NUEVAS HOY
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800 font-['Outfit'] mt-1.5">
                {pendingCount > 0 ? pendingCount : 5}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#e0f7f6] text-[#00a896] flex-shrink-0">
              <CheckCircle2 size={22} className="stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400 font-['Inter']">
            <Clock size={13} />
            <span>Última hace 2 horas</span>
          </div>
        </div>

        {/* Card 3: Tiempo Promedio */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Inter']">
                TIEMPO PROMEDIO
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800 font-['Outfit'] mt-1.5">
                24<span className="text-lg font-bold text-slate-600">hrs</span>
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 flex-shrink-0">
              <Clock size={20} className="stroke-[2.2]" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: '70%', backgroundColor: '#005f73' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. Main Table Card (Lista de Solicitudes) ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header & Filter Bar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <h2 className="font-['Outfit'] font-bold text-lg text-slate-800">
              Lista de Solicitudes
            </h2>

            {/* Quick Status Tab Pills */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-['Inter'] transition cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todos ({totalCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('pending');
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-['Inter'] transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'pending'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-500 hover:text-amber-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Pendientes ({pendingCount})
              </button>
              <button
                onClick={() => {
                  setStatusFilter('active');
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-['Inter'] transition cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === 'active'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Activos ({activeCount})
              </button>
              <button
                onClick={() => {
                  setSpotlightOnly(!spotlightOnly);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold font-['Inter'] transition cursor-pointer flex items-center gap-1.5 ${
                  spotlightOnly
                    ? 'bg-amber-500 text-white shadow-xs font-bold'
                    : 'text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/70 border border-amber-200'
                }`}
              >
                <span>⭐ En Carrusel ({spotlightCount})</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Dropdown Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search input */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar comercios..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-[#00a896] font-['Inter'] bg-slate-50/50 w-36 sm:w-48 focus:w-56 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <select
              className="px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 outline-none focus:border-[#00a896] font-['Inter'] bg-white text-slate-700 cursor-pointer hidden lg:block"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Todas las categorías</option>
              {categories
                .filter((c) => c.id !== 'all')
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
            </select>

            {/* Plan Filter */}
            <select
              className="px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 outline-none focus:border-[#00a896] font-['Inter'] bg-white text-slate-700 cursor-pointer hidden md:block"
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Todos los planes</option>
              <option value="vip">Solo VIP ⭐</option>
              <option value="premium">Solo Premium</option>
              <option value="standard">Solo Estándar</option>
              <option value="basic">Solo Básico</option>
            </select>

            {/* Mobile Status Filter */}
            <select
              className="px-2.5 py-1.5 rounded-xl text-xs border border-slate-200 outline-none focus:border-[#00a896] font-['Inter'] bg-white text-slate-700 cursor-pointer sm:hidden"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {STATUS_OPTS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-['Inter'] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-5">COMERCIO</th>
                <th className="py-3.5 px-4">FECHA DE SOLICITUD</th>
                <th className="py-3.5 px-4 text-center">PLAN SOLICITADO</th>
                <th className="py-3.5 px-4 text-center">ESTADO</th>
                <th className="py-3.5 px-4 text-center">ANUNCIO CARRUSEL</th>
                <th className="py-3.5 px-5 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {paginated.map((biz, idx) => {
                const dateInfo = formatBusinessDate(biz.createdAt, idx);
                const isPending = biz.status === 'pending';

                return (
                  <tr
                    key={biz.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Comercio (Icono/Emoji + Nombre + Rubro) */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0 shadow-2xs overflow-hidden">
                          {biz.logoUrl && (biz.logoUrl.startsWith('http') || biz.logoUrl.startsWith('/')) ? (
                            <img src={biz.logoUrl} alt="" className="w-full h-full object-cover" />
                          ) : biz.logoUrl ? (
                            biz.logoUrl
                          ) : (
                            <span className="text-xs font-bold text-slate-500">
                              {biz.name ? biz.name.slice(0, 2).toUpperCase() : 'CC'}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm truncate">
                              {biz.name}
                            </span>
                            {biz.isVerified && (
                              <ShieldCheck
                                size={14}
                                className="text-teal-600 flex-shrink-0"
                                title="Comercio Verificado"
                              />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{biz.categoryLabel || biz.category || 'Comercio General'} · <span className="text-slate-400">{biz.zone}</span></span>
                            {biz.rif && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold border border-slate-200">
                                RIF: {biz.rif}
                              </span>
                            )}
                          </p>

                          {/* Badges de Cashea, Promo y Canales de Contacto */}
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {biz.paymentMethods?.includes('cashea') && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FFE600] text-slate-950 text-[10px] font-black border border-amber-300 shadow-2xs">
                                <img src="/images/cashea-icon.png" alt="Cashea" className="w-2.5 h-2.5 object-contain" />
                                <span>Cashea</span>
                              </span>
                            )}
                            {biz.activePromotion && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold truncate max-w-[150px]"
                                title={biz.activePromotion}
                              >
                                🏷️ {biz.activePromotion}
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-slate-400 pl-0.5">
                              {biz.whatsapp && (
                                <span title="WhatsApp configurado" className="text-[#25D366]">
                                  <WhatsAppIcon size={12} />
                                </span>
                              )}
                              {biz.phone && (
                                <span title={`Teléfono: ${biz.phone}`} className="text-sky-600">
                                  <PhoneIcon size={12} />
                                </span>
                              )}
                              {biz.instagram && (
                                <span title={`Instagram: ${biz.instagram}`} className="text-[#E4405F]">
                                  <InstagramIcon size={12} />
                                </span>
                              )}
                              {biz.tiktok && (
                                <span title={`TikTok: ${biz.tiktok}`} className="text-slate-800">
                                  <TikTokIcon size={12} />
                                </span>
                              )}
                              {biz.youtube && (
                                <span title="YouTube configurado" className="text-[#FF0000]">
                                  <YouTubeIcon size={12} />
                                </span>
                              )}
                              {biz.facebook && (
                                <span title="Facebook configurado" className="text-[#1877F2]">
                                  <FacebookIcon size={12} />
                                </span>
                              )}
                              {biz.website && (
                                <span title="Sitio Web configurado" className="text-teal-600">
                                  <GlobeIcon size={12} />
                                </span>
                              )}
                              {biz.videoTourUrl && (
                                <span
                                  title="Video Guía activo"
                                  className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold"
                                >
                                  🎬 Video
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Fecha de Solicitud */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-slate-700 text-xs">
                          {dateInfo.date}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {dateInfo.time}
                        </p>
                      </div>
                    </td>

                    {/* Plan Solicitado */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <PlanBadge plan={biz.plan} isFeatured={biz.isFeatured} />
                    </td>

                    {/* Estado */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <StatusBadge status={biz.status || 'pending'} />
                    </td>

                    {/* Anuncio Carrusel */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSpotlightToggle(biz)}
                        title={
                          biz.isSpotlight
                            ? 'Quitar del carrusel de anuncios destacados'
                            : 'Activar en carrusel de anuncios destacados'
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-['Inter'] transition cursor-pointer border shadow-2xs ${
                          biz.isSpotlight
                            ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50/50'
                        }`}
                      >
                        <span className={`text-xs ${biz.isSpotlight ? 'text-amber-600' : 'text-slate-400'}`}>⭐</span>
                        <span>{biz.isSpotlight ? 'En Carrusel' : 'Activar'}</span>
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Approve / Reject if pending */}
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleStatusChange(biz.id, 'active')}
                              title="Aprobar solicitud"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition cursor-pointer border border-emerald-200/60"
                            >
                              <Check size={14} className="stroke-[3]" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(biz.id, 'rejected')}
                              title="Rechazar solicitud"
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer border border-rose-200/60"
                            >
                              <X size={14} className="stroke-[3]" />
                            </button>
                          </>
                        )}

                        {/* Verify toggle */}
                        <button
                          onClick={() => handleVerifyToggle(biz)}
                          title={
                            biz.isVerified
                              ? 'Quitar insignia de verificado'
                              : 'Verificar comercio'
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition cursor-pointer"
                        >
                          {biz.isVerified ? (
                            <ShieldCheck size={16} className="text-teal-600" />
                          ) : (
                            <Shield size={16} />
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditTarget(biz);
                            setShowForm(true);
                          }}
                          title="Editar información"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeleteConfirm(biz)}
                          title="Eliminar comercio"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-['Inter']">
                    No se encontraron comercios con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-500 font-['Inter']">
            Mostrando {startIdx} a {endIdx} de {filtered.length} solicitudes
          </p>

          <div className="flex items-center gap-1.5">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
              title="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-semibold text-slate-700 px-2 font-['Inter']">
              Página {page} de {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
              title="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-rose-600" />
              </div>
              <div className="min-w-0">
                <h4 className="font-['Outfit'] font-bold text-slate-900 truncate">
                  ¿Eliminar comercio?
                </h4>
                <p className="text-xs text-slate-500 truncate font-['Inter']">
                  {deleteConfirm.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-['Inter'] leading-relaxed">
              Esta acción eliminará el negocio permanentemente del directorio de CumanáConecta.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition hover:brightness-110 cursor-pointer font-['Inter'] shadow-sm"
                style={{ backgroundColor: '#dc2626' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Business Form Drawer */}
      {showForm && (
        <BusinessForm
          initial={editTarget}
          categories={categories}
          zones={zones}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}
