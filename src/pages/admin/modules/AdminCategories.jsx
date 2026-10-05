import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import adminStore from '../../../store/adminStore.js';

const EMOJIS = ['🏪','💊','🏥','🍔','🍰','🔧','📚','💡','🛒','🚗','✂️','🎓','🎭','🏋️','🌊','🐾','💻','🏨','⚡','🌿'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ label: '', emoji: '🏪', icon: 'Store' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => setCategories(adminStore.getCategories());
  useEffect(() => { load(); }, []);

  const handleToggle = (cat) => {
    adminStore.updateCategory(cat.id, { active: !cat.active });
    load();
  };

  const handleSaveEdit = () => {
    if (!editing.label.trim()) return;
    adminStore.updateCategory(editing.id, { label: editing.label, emoji: editing.emoji, icon: editing.icon });
    setEditing(null);
    load();
  };

  const handleAdd = () => {
    if (!newCat.label.trim()) return;
    adminStore.addCategory(newCat);
    setNewCat({ label: '', emoji: '🏪', icon: 'Store' });
    setShowAdd(false);
    load();
  };

  const handleDelete = (id) => {
    adminStore.deleteCategory(id);
    setDeleteConfirm(null);
    load();
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const list = [...categories];
    [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
    adminStore.saveCategories(list);
    setCategories(list);
  };

  const moveDown = (idx) => {
    if (idx === categories.length - 1) return;
    const list = [...categories];
    [list[idx], list[idx + 1]] = [list[idx + 1], list[idx]];
    adminStore.saveCategories(list);
    setCategories(list);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Outfit'] font-bold text-2xl text-slate-900">Categorías</h2>
          <p className="text-sm text-slate-500 font-['Inter']">{categories.filter(c => c.active).length} activas de {categories.length}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']"
          style={{ backgroundColor: '#00a896' }}
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-['Outfit'] font-semibold text-base text-slate-800 mb-4">Nueva Categoría</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Nombre *</label>
              <input
                className="w-full px-3 py-2.5 rounded-xl text-sm font-['Inter'] border border-slate-200 outline-none focus:border-[#00a896]"
                value={newCat.label}
                onChange={e => setNewCat(n => ({ ...n, label: e.target.value }))}
                placeholder="Ej: Hoteles & Turismo"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 font-['Inter']">Emoji</label>
              <div className="flex gap-1 flex-wrap">
                {EMOJIS.slice(0, 10).map(em => (
                  <button
                    key={em} type="button"
                    onClick={() => setNewCat(n => ({ ...n, emoji: em }))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg cursor-pointer transition"
                    style={{ backgroundColor: newCat.emoji === em ? '#e0f2f1' : '#f8fafc', border: newCat.emoji === em ? '2px solid #00a896' : '1px solid #e2e8f0' }}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white cursor-pointer hover:brightness-110 transition font-['Inter']" style={{ backgroundColor: '#00a896' }}>
                Guardar
              </button>
              <button onClick={() => setShowAdd(false)} className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition cursor-pointer">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm font-['Inter']">
          <thead>
            <tr className="border-b border-slate-100" style={{ backgroundColor: '#f8fafc' }}>
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide w-10">Orden</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Categoría</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Estado</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, idx) => (
              <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <button disabled={idx === 0} onClick={() => moveUp(idx)} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 cursor-pointer text-xs leading-none">▲</button>
                    <button disabled={idx === categories.length - 1} onClick={() => moveDown(idx)} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 cursor-pointer text-xs leading-none">▼</button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {editing?.id === cat.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="px-2 py-1.5 rounded-lg text-sm border border-slate-200 outline-none focus:border-[#00a896] font-['Inter']"
                        value={editing.label}
                        onChange={e => setEditing(ed => ({ ...ed, label: e.target.value }))}
                      />
                      <input
                        className="px-2 py-1.5 rounded-lg text-sm border border-slate-200 outline-none focus:border-[#00a896] font-['Inter'] w-14 text-center"
                        value={editing.emoji}
                        onChange={e => setEditing(ed => ({ ...ed, emoji: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="font-semibold text-slate-800">{cat.label}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs font-mono">{cat.id}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(cat)} className="flex items-center gap-1.5 cursor-pointer transition">
                    {cat.active !== false
                      ? <><ToggleRight size={20} className="text-teal-500" /><span className="text-xs text-teal-600 font-semibold">Activa</span></>
                      : <><ToggleLeft size={20} className="text-slate-300" /><span className="text-xs text-slate-400 font-semibold">Inactiva</span></>}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {editing?.id === cat.id ? (
                      <>
                        <button onClick={handleSaveEdit} className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 cursor-pointer transition"><Save size={15} /></button>
                        <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer transition"><X size={15} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditing({ ...cat })} className="p-1.5 rounded-lg text-slate-400 hover:text-[#00a896] hover:bg-teal-50 transition cursor-pointer"><Edit3 size={15} /></button>
                        {cat.id !== 'all' && (
                          <button onClick={() => setDeleteConfirm(cat)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"><Trash2 size={15} /></button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h4 className="font-['Outfit'] font-bold text-slate-900 mb-2">¿Eliminar categoría?</h4>
            <p className="text-sm text-slate-500 font-['Inter'] mb-5">Se eliminará «{deleteConfirm.label}» del directorio.</p>
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
