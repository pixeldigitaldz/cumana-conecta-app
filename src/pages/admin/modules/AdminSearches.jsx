import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, Hash } from 'lucide-react';
import adminStore from '../../../store/adminStore.js';

export default function AdminSearches() {
  const [searches, setSearches] = useState([]);
  const [newSearch, setNewSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState('');

  const load = () => setSearches(adminStore.getSearches());
  useEffect(() => { load(); }, []);

  const handleAdd = () => {
    if (!newSearch.trim()) return;
    adminStore.addSearch(newSearch.trim());
    setNewSearch('');
    load();
  };

  const handleDelete = (term) => {
    adminStore.deleteSearch(term);
    load();
  };

  const handleEdit = (old) => {
    if (!editVal.trim()) { setEditing(null); return; }
    adminStore.updateSearch(old, editVal.trim());
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">Búsquedas Frecuentes</h2>
        <p className="text-sm text-slate-500 font-['Inter']">Etiquetas de acceso rápido en el footer del directorio. {searches.length} configuradas.</p>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-['Outfit'] font-semibold text-sm text-slate-700 mb-3 uppercase tracking-wide">Vista Previa en el Footer</h3>
        <div className="flex flex-wrap gap-2">
          {searches.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border font-['Inter']" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }}>
              <Hash size={11} /> {s}
            </span>
          ))}
        </div>
      </div>

      {/* Add */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-['Outfit'] font-semibold text-base text-slate-800 mb-3">Agregar Búsqueda</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]"
              value={newSearch}
              onChange={e => setNewSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Ej: Panaderías, Tours al Parque Nacional..."
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
          <h3 className="font-['Outfit'] font-semibold text-sm text-slate-700">Búsquedas Configuradas</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {searches.map((term, idx) => (
            <div key={term} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-500 flex items-center justify-center font-['Inter']">{idx + 1}</span>
                {editing === term ? (
                  <input
                    className="px-2 py-1.5 rounded-lg text-sm border border-slate-200 outline-none focus:border-[#00a896] font-['Inter'] w-52"
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(term); if (e.key === 'Escape') setEditing(null); }}
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-['Inter'] text-slate-700"># {term}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editing === term ? (
                  <>
                    <button onClick={() => handleEdit(term)} className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 cursor-pointer transition"><Save size={15} /></button>
                    <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer transition"><X size={15} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(term); setEditVal(term); }} className="p-1.5 rounded-lg text-slate-400 hover:text-[#00a896] hover:bg-teal-50 transition cursor-pointer"><Edit3 size={15} /></button>
                    <button onClick={() => handleDelete(term)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"><Trash2 size={15} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
          {searches.length === 0 && (
            <div className="text-center py-10 text-slate-400 font-['Inter'] text-sm">No hay búsquedas configuradas</div>
          )}
        </div>
      </div>
    </div>
  );
}
