import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit3, X, Check, Image, Calendar, Sparkles, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import adminStore from '../../../store/adminStore.js';

function EventForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { title: '', description: '', date: '', imageUrl: '', ctaUrl: '', ctaText: 'Ver más' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputClass = "w-full px-3 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">{initial?.id ? 'Editar Evento' : 'Nuevo Evento'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition cursor-pointer"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Título</label>
            <input className={inputClass} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Festival Gastronómico de Cumaná 2026" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Descripción</label>
            <textarea rows={2} className="w-full px-3 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] resize-none" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Fecha</label>
              <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Texto del Botón</label>
              <input className={inputClass} value={form.ctaText} onChange={e => set('ctaText', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">URL de Imagen</label>
            <input className={inputClass} value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Enlace del Evento</label>
            <input className={inputClass} value={form.ctaUrl} onChange={e => set('ctaUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']" style={{ backgroundColor: '#00a896' }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBanners() {
  const [bannerUrl, setBannerUrl] = useState('');
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [bannerSaved, setBannerSaved] = useState(false);

  // Spotlight Carousel State
  const [businesses, setBusinesses] = useState([]);
  const [spotlightEnabled, setSpotlightEnabled] = useState(true);
  const [selectedBizToAdd, setSelectedBizToAdd] = useState('');
  const [spotlightSaved, setSpotlightSaved] = useState(false);

  // Cashea Banner State
  const [casheaBanner, setCasheaBanner] = useState({
    active: true,
    title: '¿Buscas comercios afiliados a Cashea en Cumaná?',
    subtitle: 'Filtra farmacias, talleres mecánicos, tiendas de celulares y bodegones que te permiten pagar en cómodas cuotas sin interés en la ciudad de Cumaná.',
    badgeText: 'Compre Ahora, Pague Después',
    ctaText: 'Ver Comercios con Cashea',
  });
  const [casheaSaved, setCasheaSaved] = useState(false);

  const loadData = () => {
    const settings = adminStore.getSettings();
    setBannerUrl(settings.bannerImageUrl || '/images/cumana_banner_negocio.png');
    setSpotlightEnabled(settings.spotlightEnabled !== false);
    if (settings.casheaBanner) {
      setCasheaBanner(settings.casheaBanner);
    }
    setEvents(adminStore.getEvents());
    setBusinesses(adminStore.getBusinesses());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBanner = () => {
    adminStore.updateSettings({ bannerImageUrl: bannerUrl });
    setBannerSaved(true);
    setTimeout(() => setBannerSaved(false), 2000);
  };

  const handleSaveCasheaBanner = () => {
    adminStore.updateSettings({ casheaBanner });
    setCasheaSaved(true);
    setTimeout(() => setCasheaSaved(false), 2000);
  };

  const handleToggleSpotlightMaster = () => {
    const nextVal = !spotlightEnabled;
    setSpotlightEnabled(nextVal);
    adminStore.updateSettings({ spotlightEnabled: nextVal });
    setSpotlightSaved(true);
    setTimeout(() => setSpotlightSaved(false), 2000);
  };

  const handleRemoveFromSpotlight = (id) => {
    adminStore.toggleSpotlight(id, false);
    loadData();
  };

  const handleAddToSpotlight = () => {
    if (!selectedBizToAdd) return;
    adminStore.toggleSpotlight(selectedBizToAdd, true);
    setSelectedBizToAdd('');
    loadData();
  };

  const handleSaveEvent = (data) => {
    if (data.id) { adminStore.updateEvent(data.id, data); }
    else { adminStore.addEvent(data); }
    setEvents(adminStore.getEvents());
    setShowForm(false);
    setEditTarget(null);
  };

  const handleDeleteEvent = (id) => {
    adminStore.deleteEvent(id);
    setEvents(adminStore.getEvents());
  };

  const activeSpotlights = businesses.filter((b) => b.isSpotlight);
  const nonSpotlights = businesses.filter((b) => !b.isSpotlight && b.status === 'active');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">Banners, Promociones & Carrusel</h2>
        <p className="text-sm text-slate-500 font-['Inter']">
          Control total del carrusel de anuncios destacados, el banner de Cashea, el banner principal y los eventos de Cumaná.
        </p>
      </div>

      {/* ─── 0. CARRUSEL DE COMERCIOS DESTACADOS (ANUNCIOS PRINCIPALES) ─── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-xs">
              <Sparkles size={20} className="fill-current" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>Carrusel de Anuncios: Comercios Destacados</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  {activeSpotlights.length} ACTIVOS
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-['Inter']">
                Ubicado entre la barra de filtros y el catálogo. Muestra anuncios patrocinados con imagen, video de cómo llegar y botón a WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSpotlightMaster}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-['Inter'] flex items-center gap-2 transition cursor-pointer border ${
                spotlightEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}
            >
              {spotlightEnabled ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Carrusel Activo en la Web</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Carrusel Desactivado</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Añadir Comercio al Carrusel */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide font-['Inter']">
            Añadir Comercio al Carrusel (Independientemente de si ha pagado membresía)
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <select
              value={selectedBizToAdd}
              onChange={(e) => setSelectedBizToAdd(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-white cursor-pointer"
            >
              <option value="">Selecciona un comercio registrado...</option>
              {nonSpotlights.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.categoryLabel || b.category}) — Plan: {b.plan || 'standard'}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!selectedBizToAdd}
              onClick={handleAddToSpotlight}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#00a896] hover:bg-[#008f80] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center gap-2 font-['Inter'] shadow-xs"
            >
              <Plus size={16} />
              <span>Añadir al Carrusel</span>
            </button>
          </div>
        </div>

        {/* Lista de Comercios en el Carrusel */}
        <div>
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 font-['Inter']">
            Comercios que se muestran actualmente en el carrusel ({activeSpotlights.length})
          </h4>

          {activeSpotlights.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs font-['Inter'] bg-slate-50">
              No hay comercios asignados al carrusel actualmente. Selecciona uno arriba o actívalo desde la sección de Comercios.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSpotlights.map((biz) => (
                <div
                  key={biz.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-amber-200">
                      <img
                        src={biz.bannerUrl || biz.photos?.[0]}
                        alt={biz.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-['Outfit'] font-bold text-sm text-slate-900 truncate">
                        {biz.name}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-['Inter'] truncate">
                        {biz.categoryLabel} · <span className="font-semibold text-amber-800">{biz.zone}</span>
                      </p>
                      {biz.spotlightPromoTitle && (
                        <p className="text-[10px] text-emerald-700 font-bold font-['Inter'] truncate">
                          🏷️ {biz.spotlightPromoTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFromSpotlight(biz.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition cursor-pointer flex-shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── 1. BANNER OFICIAL DE CASHEA ─── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border border-amber-300 flex items-center justify-center font-black text-xl shadow-xs p-1.5 shrink-0">
              <img src="/images/cashea-icon.png" alt="Cashea" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-lg text-slate-900 flex items-center gap-2">
                <span>Banner Promocional Oficial de Cashea</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#FFE600] text-slate-950 border border-amber-300">
                  CASHEA
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-['Inter']">Se muestra en la parte inferior del Home para impulsar comercios con financiamiento.</p>
            </div>
          </div>

          {/* Toggle Activo / Inactivo */}
          <button
            type="button"
            onClick={() => setCasheaBanner(prev => ({ ...prev, active: !prev.active }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-['Inter'] flex items-center gap-2 transition cursor-pointer border ${
              casheaBanner.active
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 text-slate-500 border-slate-300'
            }`}
          >
            {casheaBanner.active ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Banner Activo en la Web</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Banner Desactivado</span>
              </>
            )}
          </button>
        </div>

        {/* Live Preview del Banner de Cashea */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide font-['Inter']">
            Vista Previa en Vivo (Estilo Oficial Cashea)
          </label>
          <div
            className="relative overflow-hidden rounded-2xl p-5 sm:p-7 border border-amber-300 shadow-inner text-slate-950"
            style={{
              backgroundColor: '#FFE600',
              backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(255, 255, 255, 0.4) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
            }}
          >
            <div className="absolute -right-4 -bottom-6 select-none opacity-10 font-['Outfit'] font-black text-[100px] sm:text-[140px] leading-none pointer-events-none">
              cashea.
            </div>
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-slate-950 text-[#FFE600] mb-2.5 shadow-xs">
                <img src="/images/cashea-icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
                <span>{casheaBanner.badgeText || 'Compre Ahora, Pague Después'}</span>
              </div>
              <h4 className="font-['Outfit'] font-bold text-xl sm:text-2xl text-slate-950 leading-tight">
                {casheaBanner.title || '¿Buscas comercios afiliados a Cashea en Cumaná?'}
              </h4>
              <p className="font-['Inter'] text-slate-900/90 text-xs sm:text-sm font-medium mt-1.5 leading-relaxed">
                {casheaBanner.subtitle || 'Filtra farmacias, talleres y tiendas con cuotas sin interés en Cumaná.'}
              </p>
            </div>
          </div>
        </div>

        {/* Inputs de Edición de Cashea */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">Título del Banner</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]"
              value={casheaBanner.title}
              onChange={e => setCasheaBanner(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">Texto de la Insignia Superior</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]"
              value={casheaBanner.badgeText}
              onChange={e => setCasheaBanner(prev => ({ ...prev, badgeText: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">Texto del Botón de Acción</label>
            <input
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]"
              value={casheaBanner.ctaText}
              onChange={e => setCasheaBanner(prev => ({ ...prev, ctaText: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1 font-['Inter']">Descripción / Subtítulo</label>
            <textarea
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] resize-none"
              value={casheaBanner.subtitle}
              onChange={e => setCasheaBanner(prev => ({ ...prev, subtitle: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSaveCasheaBanner}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-slate-950 bg-[#FFE600] hover:bg-amber-300 border border-amber-400 cursor-pointer transition shadow-xs"
          >
            {casheaSaved ? <><Check size={16} /> ¡Configuración Guardada!</> : <><Save size={16} /> Guardar Banner de Cashea</>}
          </button>
        </div>
      </div>

      {/* ─── 2. BANNER PRINCIPAL: HAZ CRECER TU NEGOCIO ─── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">Banner «Haz crecer tu negocio»</h3>
            <p className="text-xs text-slate-500 font-['Inter']">Imagen publicitaria que aparece en la sección de planes comerciales.</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-lg text-xs font-['Outfit'] font-black bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs">
              📐 1200 × 380 px
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200/60">
              Aspect Ratio 3.15 : 1
            </span>
          </div>
        </div>

        {/* Guía de diseño */}
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-['Inter']">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Resolución Óptima:</span>
            <span><strong>1200 × 380 px</strong> (ó 1280 × 400 px)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Formatos recomendados:</span>
            <span>WebP, PNG o JPG (máx. 400 KB)</span>
          </div>
        </div>

        {/* Preview */}
        {bannerUrl && (
          <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300/80 mb-4 shadow-xs">
            <img src={bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 text-xs text-white font-mono flex items-center gap-1.5">
              <Eye size={13} /> Vista Previa en Vivo
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Image size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-10 pr-3 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]"
              value={bannerUrl}
              onChange={e => setBannerUrl(e.target.value)}
              placeholder="/images/cumana_banner_negocio.png o https://..."
            />
          </div>
          <button
            onClick={handleSaveBanner}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter'] shadow-xs"
            style={{ backgroundColor: '#00a896' }}
          >
            {bannerSaved ? <><Check size={16} /> Guardado</> : <><Save size={16} /> Guardar Banner</>}
          </button>
        </div>
      </div>

      {/* ─── 3. EVENTOS Y ACTIVIDADES DESTACADAS ─── */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">Eventos & Actividades de Cumaná</h3>
            <p className="text-xs text-slate-500 font-['Inter']">{events.length} eventos configurados</p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']"
            style={{ backgroundColor: '#00a896' }}
          >
            <Plus size={16} /> Agregar Evento
          </button>
        </div>

        {events.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50">
            <Calendar size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm text-slate-500 font-['Inter']">No hay eventos configurados actualmente.</p>
            <button onClick={() => setShowForm(true)} className="mt-2 text-xs font-bold text-teal-600 hover:underline cursor-pointer">
              + Agregar el primer evento de Cumaná
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(evt => (
              <div key={evt.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col">
                {evt.imageUrl && (
                  <div className="h-32 overflow-hidden bg-slate-100">
                    <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-['Outfit'] font-bold text-sm text-slate-900">{evt.title}</h4>
                    {evt.date && <p className="text-xs text-slate-400 font-['Inter'] mt-0.5 font-semibold">{evt.date}</p>}
                    {evt.description && <p className="text-xs text-slate-600 font-['Inter'] mt-1 line-clamp-2">{evt.description}</p>}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-100">
                    <button onClick={() => { setEditTarget(evt); setShowForm(true); }} className="p-1.5 rounded-lg text-slate-500 hover:text-[#00a896] hover:bg-teal-50 transition cursor-pointer"><Edit3 size={15} /></button>
                    <button onClick={() => handleDeleteEvent(evt.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          initial={editTarget}
          onSave={handleSaveEvent}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}
