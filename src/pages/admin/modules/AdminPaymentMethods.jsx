import { useState, useEffect } from 'react';
import { Save, Edit3, X, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import adminStore from '../../../store/adminStore.js';

const COLOR_PREVIEW = {
  yellow: { bg: '#FFE600', text: '#000000', border: '#facc15' },
  violet: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  blue: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  amber: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  emerald: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  slate: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
};

export default function AdminPaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saved, setSaved] = useState(null);

  const load = () => setMethods(adminStore.getPaymentMethods());
  useEffect(() => { load(); }, []);

  const handleToggle = (id) => {
    const method = methods.find(m => m.id === id);
    adminStore.updatePaymentMethod(id, { active: !method.active });
    load();
  };

  const handleSaveEdit = () => {
    adminStore.updatePaymentMethod(editForm.id, editForm);
    setSaved(editForm.id);
    setTimeout(() => setSaved(null), 2000);
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">Métodos de Pago</h2>
        <p className="text-sm text-slate-500 font-['Inter']">Activa o desactiva los métodos de pago aceptados en la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map(method => {
          const cm = COLOR_PREVIEW[method.color] || COLOR_PREVIEW.slate;
          const isEditing = editing === method.id;

          return (
            <div
              key={method.id}
              className="bg-white rounded-2xl border p-5 transition hover:shadow-sm"
              style={{ borderColor: method.active ? cm.border : '#e2e8f0' }}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-['Outfit'] font-semibold text-sm text-slate-800">Editando</h4>
                    <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={16} /></button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Nombre</label>
                    <input className="w-full px-3 py-2 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Etiqueta Corta</label>
                      <input className="w-full px-3 py-2 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]" value={editForm.shortLabel} onChange={e => setEditForm(f => ({ ...f, shortLabel: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Badge Text</label>
                      <input className="w-full px-3 py-2 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]" value={editForm.badgeText} onChange={e => setEditForm(f => ({ ...f, badgeText: e.target.value }))} />
                    </div>
                  </div>
                  <button
                    onClick={handleSaveEdit}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter'] flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#00a896' }}
                  >
                    <Save size={14} /> Guardar Cambios
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {method.id === 'cashea' ? (
                        <div className="w-10 h-10 rounded-2xl bg-[#FFE600] border border-amber-300 flex items-center justify-center shrink-0 shadow-xs p-1.5">
                          <img src="/images/cashea-icon.png" alt="Cashea" className="w-7 h-7 object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold" style={{ backgroundColor: cm.bg, color: cm.text }}>
                          💳
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-['Outfit'] font-semibold text-base text-slate-800">{method.name}</h4>
                          {method.id === 'cashea' && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950 text-[#FFE600] font-['Inter']">
                              Oficial
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full font-['Inter']" style={{ backgroundColor: cm.bg, color: cm.text, border: `1px solid ${cm.border}` }}>
                            {method.badgeText}
                          </span>
                          <span className="text-xs text-slate-400 font-['Inter']">{method.shortLabel}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setEditing(method.id); setEditForm({ ...method }); }}
                      className="p-2 rounded-xl text-slate-400 hover:text-[#00a896] hover:bg-teal-50 transition cursor-pointer flex-shrink-0"
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleToggle(method.id)}
                      className="flex items-center gap-2 cursor-pointer transition"
                    >
                      {method.active
                        ? <><ToggleRight size={24} className="text-teal-500" /><span className="text-sm font-semibold text-teal-600 font-['Inter']">Activo</span></>
                        : <><ToggleLeft size={24} className="text-slate-300" /><span className="text-sm font-semibold text-slate-400 font-['Inter']">Inactivo</span></>}
                    </button>
                    {saved === method.id && (
                      <span className="text-xs text-teal-600 font-semibold flex items-center gap-1 font-['Inter']">
                        <Check size={12} /> Guardado
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
