import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Check,
  Filter,
  Pencil,
  FileText,
  TrendingUp,
  UserPlus,
  Clock,
  ChevronDown,
  X,
  MessageCircle,
} from 'lucide-react';
import adminStore from '../../../store/adminStore.js';

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('vip');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  // Settings & WhatsApp
  const [whatsapp, setWhatsapp] = useState('');
  const [waSaved, setWaSaved] = useState(false);

  // Load plans & settings
  useEffect(() => {
    const loadedPlans = adminStore.getPlans();
    setPlans(loadedPlans);

    const s = adminStore.getSettings();
    setWhatsapp(s.adminWhatsapp || '');

    // Default select 'vip' or first plan
    const initial = loadedPlans.find(p => p.id === 'vip') || loadedPlans[0];
    if (initial) {
      setSelectedPlanId(initial.id);
      setEditForm(JSON.parse(JSON.stringify(initial)));
    }
  }, []);

  // When selected plan changes
  const handleSelectPlan = (plan) => {
    setIsCreatingNew(false);
    setSelectedPlanId(plan.id);
    setEditForm(JSON.parse(JSON.stringify(plan)));
  };

  const handleStartNewPlan = () => {
    setIsCreatingNew(true);
    setSelectedPlanId(null);
    setEditForm({
      id: `plan_${Date.now()}`,
      name: '',
      price: 0,
      currency: 'USD',
      period: 'mes',
      activeCount: 0,
      active: true,
      priority: 5,
      photoLimit: '15 fotos',
      badge: '',
      color: '#ea580c',
      description: '',
      features: [
        { id: 'search', text: 'Aparece en búsquedas destacadas', enabled: true },
        { id: 'badge', text: 'Insignia verificada en perfil', enabled: false },
        { id: 'support', text: 'Soporte prioritario', enabled: false },
      ],
      benefits: [],
      ctaText: 'Elegir Plan',
      ctaColor: '#004d5a',
    });
  };

  const handleCancelEdit = () => {
    setIsCreatingNew(false);
    const curr = plans.find(p => p.id === selectedPlanId) || plans[0];
    if (curr) {
      setSelectedPlanId(curr.id);
      setEditForm(JSON.parse(JSON.stringify(curr)));
    }
  };

  const handleSavePlan = () => {
    if (!editForm || !editForm.name.trim()) {
      alert('Por favor introduce un nombre para el plan.');
      return;
    }

    let updatedPlans;
    if (isCreatingNew) {
      updatedPlans = adminStore.addPlan(editForm);
      setIsCreatingNew(false);
      setSelectedPlanId(editForm.id);
    } else {
      updatedPlans = adminStore.updatePlan(editForm.id, editForm);
    }

    setPlans([...updatedPlans]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  const handleDeletePlan = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plan comercial?')) {
      const updated = adminStore.deletePlan(id);
      setPlans([...updated]);
      if (selectedPlanId === id) {
        const next = updated[0];
        if (next) {
          setSelectedPlanId(next.id);
          setEditForm(JSON.parse(JSON.stringify(next)));
        } else {
          handleStartNewPlan();
        }
      }
    }
  };

  const handleToggleFeature = (featureIndex) => {
    if (!editForm) return;
    const newFeatures = [...(editForm.features || [])];
    if (newFeatures[featureIndex]) {
      newFeatures[featureIndex].enabled = !newFeatures[featureIndex].enabled;
      setEditForm({ ...editForm, features: newFeatures });
    }
  };

  const handleSaveWhatsapp = () => {
    adminStore.updateSettings({ adminWhatsapp: whatsapp });
    setWaSaved(true);
    setTimeout(() => setWaSaved(false), 2000);
  };

  // Metrics calculations
  const totalActivePlans = plans.filter(p => p.active).length;
  const estimatedRevenue = plans.reduce((acc, p) => acc + (p.price || 0) * (p.activeCount || 0), 0);
  const totalSubscribers = plans.reduce((acc, p) => acc + (p.activeCount || 0), 0);

  // Filtered table rows
  const filteredPlans = plans.filter(p => {
    if (filterActiveOnly && !p.active) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ─── 1. Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] font-bold text-2xl sm:text-3xl text-[#0f172a] tracking-tight">
            Gestión de Planes de Anuncio
          </h1>
          <p className="text-sm text-slate-500 font-['Inter'] mt-1">
            Configura y supervisa los planes comerciales de la plataforma para los negocios de Cumaná.
          </p>
        </div>
        <button
          onClick={handleStartNewPlan}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all shadow-sm hover:brightness-110 active:scale-95 cursor-pointer font-['Inter'] self-start sm:self-auto"
          style={{ backgroundColor: '#004d5a' }}
        >
          <Plus size={18} />
          <span>Nuevo Plan</span>
        </button>
      </div>

      {/* ─── 2. Top Metric Cards (3 cards) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Planes Activos */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Inter']">
                PLANES ACTIVOS
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800 font-['Outfit'] mt-1.5">
                {totalActivePlans}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#cffafe] text-[#00a896] flex-shrink-0">
              <FileText size={22} className="stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-600 font-['Inter']">
            <Check size={14} className="stroke-[2.5]" />
            <span>Todos operativos</span>
          </div>
        </div>

        {/* Card 2: Ingresos (Mes) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Inter']">
                INGRESOS (MES)
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800 font-['Outfit'] mt-1.5">
                ${estimatedRevenue > 0 ? estimatedRevenue.toLocaleString('en-US') : '420'}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#e0f2fe] text-[#0284c7] flex-shrink-0">
              <TrendingUp size={22} className="stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-600 font-['Inter']">
            <span className="font-bold">↑</span>
            <span>+12% vs mes anterior</span>
          </div>
        </div>

        {/* Card 3: Nuevas Suscripciones */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['Inter']">
                NUEVAS SUSCRIPCIONES
              </p>
              <h3 className="text-3xl font-extrabold text-slate-800 font-['Outfit'] mt-1.5">
                28
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#ffedd5] text-[#ea580c] flex-shrink-0">
              <UserPlus size={22} className="stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400 font-['Inter']">
            <Clock size={13} />
            <span>Últimos 30 días</span>
          </div>
        </div>
      </div>

      {/* ─── 3. Main Content: Table & Editor ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Table (Planes Actuales) */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          {/* Table Header Controls */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
            <h2 className="font-['Outfit'] font-bold text-lg text-slate-800">
              Planes Actuales
            </h2>

            <button
              onClick={() => setFilterActiveOnly(!filterActiveOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold font-['Inter'] transition-colors border cursor-pointer ${
                filterActiveOnly
                  ? 'bg-[#00a896]/10 border-[#00a896] text-[#00a896]'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Filtrar por estado activo"
            >
              <Filter size={13} />
              <span>{filterActiveOnly ? 'Solo Activos' : 'Filtrar'}</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Inter'] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">NOMBRE DEL PLAN</th>
                  <th className="py-3.5 px-4">PRECIO MENSUAL</th>
                  <th className="py-3.5 px-4 text-center">COMERCIOS ACTIVOS</th>
                  <th className="py-3.5 px-4 text-center">ESTADO</th>
                  <th className="py-3.5 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {filteredPlans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id && !isCreatingNew;
                  const isVip = plan.id === 'vip' || plan.badge === 'TOP';
                  const isFree = !plan.price || plan.price === 0;

                  return (
                    <tr
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      className={`group cursor-pointer transition-colors relative ${
                        isSelected
                          ? 'bg-[#f0fdfa]/80'
                          : 'hover:bg-slate-50/70'
                      } ${isVip ? 'border-l-4 border-l-[#ea580c]' : 'border-l-4 border-l-transparent'}`}
                    >
                      {/* Nombre del Plan */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: plan.color || (isVip ? '#ea580c' : '#64748b') }}
                          />
                          <span className="font-semibold text-slate-800 text-sm">
                            {plan.name}
                          </span>
                          {plan.badge && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide text-white"
                              style={{ backgroundColor: plan.color || '#ea580c' }}
                            >
                              {plan.badge}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Precio Mensual */}
                      <td className="py-4 px-4 font-medium">
                        {isFree ? (
                          <span className="text-slate-600 font-semibold">Gratis</span>
                        ) : (
                          <span
                            className="font-bold"
                            style={{ color: isVip ? '#ea580c' : '#334155' }}
                          >
                            ${Number(plan.price).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Comercios Activos */}
                      <td className="py-4 px-4 text-center text-slate-600 font-semibold">
                        {plan.activeCount ?? (isVip ? 42 : 142)}
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-4 text-center">
                        {plan.active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-200/70 uppercase tracking-wide">
                            ACTIVO
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 uppercase tracking-wide">
                            INACTIVO
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPlan(plan);
                          }}
                          title="Editar plan"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredPlans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                      No se encontraron planes con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Editor Panel */}
        <div className="lg:col-span-5 xl:col-span-5">
          {editForm ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5 sticky top-4">
              {/* Editor Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-['Outfit'] font-bold text-base sm:text-lg text-slate-900 truncate">
                  {isCreatingNew ? 'Nuevo Plan' : `Editar: ${editForm.name || 'Plan'}`}
                </h3>

                {/* Active Toggle Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 font-['Inter']">
                    {editForm.active ? 'Activo' : 'Inactivo'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={editForm.active}
                    onClick={() => setEditForm({ ...editForm, active: !editForm.active })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      editForm.active ? 'bg-[#00a896]' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        editForm.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Nombre del Plan */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-['Inter']">
                    Nombre del Plan
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Ej. Plan Destacado VIP, Plan Estándar..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-white transition"
                  />
                </div>

                {/* Precio Mensual ($) & Prioridad */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-['Inter']">
                      Precio Mensual ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.price ?? 0}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-['Inter']">
                      Prioridad (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.priority ?? 5}
                      onChange={(e) =>
                        setEditForm({ ...editForm, priority: parseInt(e.target.value, 10) || 1 })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-white transition"
                    />
                  </div>
                </div>

                {/* Límite de Fotos */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 font-['Inter']">
                    Límite de Fotos
                  </label>
                  <div className="relative">
                    <select
                      value={editForm.photoLimit || '15 fotos'}
                      onChange={(e) => setEditForm({ ...editForm, photoLimit: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-white transition cursor-pointer appearance-none pr-8"
                    >
                      <option value="3 fotos">3 fotos</option>
                      <option value="5 fotos">5 fotos</option>
                      <option value="8 fotos">8 fotos</option>
                      <option value="15 fotos">15 fotos</option>
                      <option value="25 fotos">25 fotos</option>
                      <option value="Sin límite">Sin límite</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Características (Visibilidad) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 font-['Inter']">
                    Características (Visibilidad)
                  </label>
                  <div className="space-y-2.5 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                    {(editForm.features || []).map((feat, idx) => (
                      <label
                        key={feat.id || idx}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-['Inter'] text-slate-700 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={!!feat.enabled}
                          onChange={() => handleToggleFeature(idx)}
                          className="w-4 h-4 rounded text-[#00a896] accent-[#00a896] cursor-pointer"
                        />
                        <span>{feat.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition cursor-pointer font-['Inter']"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSavePlan}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:brightness-110 active:scale-95 cursor-pointer font-['Inter']"
                  style={{ backgroundColor: '#003844' }}
                >
                  {savedSuccess ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>¡Guardado!</span>
                    </>
                  ) : (
                    <span>Guardar Cambios</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
              <p className="text-sm font-['Inter']">Selecciona un plan de la tabla para editarlo o crea uno nuevo.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── 4. WhatsApp Configuration for Plan Registration / Inquiries ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="font-['Outfit'] font-bold text-base text-slate-800">
                WhatsApp de Recepción de Nuevos Negocios & Planes
              </h3>
              <p className="text-xs text-slate-500 font-['Inter'] mt-0.5">
                Las solicitudes de registro comercial y cambios de plan se enviarán directamente a este número oficial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <input
              type="text"
              className="px-3.5 py-2 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896] bg-slate-50/50 w-full sm:w-56"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="584120000000"
            />
            <button
              onClick={handleSaveWhatsapp}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:brightness-110 cursor-pointer flex-shrink-0 font-['Inter'] flex items-center gap-1.5"
              style={{ backgroundColor: '#00a896' }}
            >
              {waSaved ? (
                <>
                  <Check size={14} /> Guardado
                </>
              ) : (
                <>
                  <Save size={14} /> Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
