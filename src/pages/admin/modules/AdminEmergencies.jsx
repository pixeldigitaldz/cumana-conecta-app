import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Phone } from 'lucide-react';
import adminStore from '../../../store/adminStore.js';

const COLORS = ['rose', 'amber', 'emerald', 'blue', 'yellow', 'cyan', 'violet', 'orange', 'indigo', 'pink'];

const COLOR_MAP = {
  rose: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
  amber: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  emerald: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  blue: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  yellow: { bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
  cyan: { bg: '#ecfeff', text: '#164e63', border: '#a5f3fc' },
  violet: { bg: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' },
  orange: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
  indigo: { bg: '#eef2ff', text: '#3730a3', border: '#c7d2fe' },
  pink: { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
};

function EmergencyForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', number: '', altNumber: '', category: '', color: 'rose' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputClass = "w-full px-3 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">{initial?.id ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition cursor-pointer"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Nombre del Servicio</label>
            <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Cuerpo de Bomberos de Cumaná" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Número Principal</label>
              <input className={inputClass} value={form.number} onChange={e => set('number', e.target.value)} placeholder="171" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Número Alterno</label>
              <input className={inputClass} value={form.altNumber} onChange={e => set('altNumber', e.target.value)} placeholder="0293-4312222" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Categoría / Tipo</label>
            <input className={inputClass} value={form.category} onChange={e => set('category', e.target.value)} placeholder="Incendios, Rescate & Siniestros" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 font-['Inter']">Color del Badge</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => {
                const cm = COLOR_MAP[c];
                return (
                  <button
                    key={c} type="button"
                    onClick={() => set('color', c)}
                    className="px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer font-['Inter']"
                    style={{
                      backgroundColor: cm.bg,
                      color: cm.text,
                      borderColor: form.color === c ? cm.text : cm.border,
                      boxShadow: form.color === c ? `0 0 0 2px ${cm.text}` : 'none',
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']">Cancelar</button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']"
            style={{ backgroundColor: '#00a896' }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminEmergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => setEmergencies(adminStore.getEmergencies());
  useEffect(() => { load(); }, []);

  const handleSave = (data) => {
    if (data.id) {
      adminStore.updateEmergency(data.id, data);
    } else {
      adminStore.addEmergency(data);
    }
    setShowForm(false);
    setEditTarget(null);
    load();
  };

  const handleDelete = (id) => {
    adminStore.deleteEmergency(id);
    setDeleteConfirm(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">Emergencias 24h</h2>
          <p className="text-sm text-slate-500 font-['Inter']">Líneas de emergencia que aparecen en el directorio y el footer</p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']"
          style={{ backgroundColor: '#00a896' }}
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencies.map(svc => {
          const cm = COLOR_MAP[svc.color] || COLOR_MAP.rose;
          return (
            <div key={svc.id} className="bg-white rounded-2xl border p-4 hover:shadow-sm transition" style={{ borderColor: cm.border }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full font-['Inter']" style={{ backgroundColor: cm.bg, color: cm.text }}>{svc.color}</span>
                  </div>
                  <h4 className="font-['Outfit'] font-semibold text-sm text-slate-800 mb-1">{svc.name}</h4>
                  <p className="text-xs text-slate-500 font-['Inter'] mb-2">{svc.category}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm font-bold font-['Inter']" style={{ color: cm.text }}>
                      <Phone size={13} /> {svc.number}
                    </span>
                    {svc.altNumber && (
                      <span className="text-xs text-slate-400 font-['Inter']">{svc.altNumber}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditTarget(svc); setShowForm(true); }}
                    className="p-2 rounded-xl text-slate-400 hover:text-[#00a896] hover:bg-teal-50 transition cursor-pointer"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(svc)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <EmergencyForm
          initial={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h4 className="font-['Outfit'] font-bold text-slate-900 mb-2">¿Eliminar servicio?</h4>
            <p className="text-sm text-slate-500 font-['Inter'] mb-5">Se eliminará «{deleteConfirm.name}» de las emergencias.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']" style={{ backgroundColor: '#dc2626' }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
