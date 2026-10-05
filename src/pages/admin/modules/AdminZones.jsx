import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, MapPin } from 'lucide-react';
import adminStore from '../../../store/adminStore.js';

export default function AdminZones() {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState('');
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => setZones(adminStore.getZones());
  useEffect(() => { load(); }, []);

  const handleAdd = () => {
    if (!newZone.trim()) return;
    adminStore.addZone(newZone.trim());
    setNewZone('');
    load();
  };

  const handleDelete = (zone) => {
    adminStore.deleteZone(zone);
    setDeleteConfirm(null);
    load();
  };

  const handleEdit = (zone) => {
    if (!editVal.trim() || editVal === zone) { setEditing(null); return; }
    const list = zones.map(z => z === zone ? editVal.trim() : z);
    adminStore.saveZones(list);
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">Zonas de Cumaná</h2>
        <p className="text-sm text-slate-500 font-['Inter']">{zones.length} zonas configuradas — aparecen en el filtro del directorio y en el formulario de registro</p>
      </div>

      {/* Add */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-['Outfit'] font-semibold text-base text-slate-800 mb-3">Agregar Nueva Zona</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]"
              value={newZone}
              onChange={e => setNewZone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Ej: Av. Gran Mariscal, Sector Cuatro Bocas..."
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']"
            style={{ backgroundColor: '#00a896' }}
          >
            <Plus size={16} /> Agregar
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h3 className="font-['Outfit'] font-semibold text-sm text-slate-700">Zonas Registradas</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {zones.map((zone, idx) => (
            <div key={zone} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-500 flex items-center justify-center font-['Inter']">{idx + 1}</span>
                {editing === zone ? (
                  <input
                    className="px-2 py-1.5 rounded-lg text-sm border border-slate-200 outline-none focus:border-[#00a896] font-['Inter'] w-52"
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(zone); if (e.key === 'Escape') setEditing(null); }}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-['Inter'] text-slate-700">{zone}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editing === zone ? (
                  <>
                    <button onClick={() => handleEdit(zone)} className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 cursor-pointer transition"><Save size={15} /></button>
                    <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer transition"><X size={15} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(zone); setEditVal(zone); }} className="p-1.5 rounded-lg text-slate-400 hover:text-[#00a896] hover:bg-teal-50 transition cursor-pointer"><Edit3 size={15} /></button>
                    <button onClick={() => setDeleteConfirm(zone)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"><Trash2 size={15} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
          {zones.length === 0 && (
            <div className="text-center py-10 text-slate-400 font-['Inter'] text-sm">No hay zonas configuradas</div>
          )}
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h4 className="font-['Outfit'] font-bold text-slate-900 mb-2">¿Eliminar zona?</h4>
            <p className="text-sm text-slate-500 font-['Inter'] mb-5">Se eliminará «{deleteConfirm}» de los filtros y formularios.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer font-['Inter']">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']" style={{ backgroundColor: '#dc2626' }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
