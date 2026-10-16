'use client';

import React, { useRef, useState } from 'react';
import { 
  Building2, 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  Trash2, 
  Upload, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  ExternalLink,
  Navigation,
  FileText,
  AlertCircle
} from 'lucide-react';
import { BranchInfo } from '@/types/business';
import { compressImageFile } from '@/lib/image-compression';

interface BranchManagerProps {
  hasBranches: boolean;
  onToggleHasBranches: (enabled: boolean) => void;
  branches: BranchInfo[];
  onChangeBranches: (branches: BranchInfo[]) => void;
  zones: string[];
  businessName: string;
  defaultHeroImage?: string;
  defaultAddress?: string;
  defaultZone?: string;
  defaultPhone?: string;
  defaultHours?: string;
  defaultMapsUrl?: string;
}

export function BranchManager({
  hasBranches,
  onToggleHasBranches,
  branches = [],
  onChangeBranches,
  zones = [],
  businessName,
  defaultHeroImage = '',
  defaultAddress = '',
  defaultZone = '',
  defaultPhone = '',
  defaultHours = '',
  defaultMapsUrl = ''
}: BranchManagerProps) {
  const [compressingBranchIdx, setCompressingBranchIdx] = useState<number | null>(null);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const cameraInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const handleAddBranch = () => {
    const nextNum = branches.length + 1;
    const newBranch: BranchInfo = {
      id: `branch-${Date.now()}`,
      name: `Sede ${String(nextNum).padStart(2, '0')} · Sucursal`,
      roleBadge: nextNum === 1 ? 'Principal' : 'Sucursal',
      zone: zones[0] || 'Casco Histórico y Centro Comercial',
      address: '',
      status: 'open',
      entranceGuide: '',
      image: '',
      openingHours: defaultHours || '8:00 AM - 6:00 PM',
      phone: defaultPhone || '',
      mapsUrl: '',
      distanceText: `${(0.8 + (nextNum - 1) * 1.2).toFixed(1)} km`,
      videoDuration: '45 seg'
    };
    onChangeBranches([...branches, newBranch]);
  };

  const handleRemoveBranch = (idxToRemove: number) => {
    onChangeBranches(branches.filter((_, idx) => idx !== idxToRemove));
  };

  const handleUpdateBranch = (idx: number, patch: Partial<BranchInfo>) => {
    const updated = [...branches];
    updated[idx] = { ...updated[idx], ...patch };
    onChangeBranches(updated);
  };

  const handleBranchPhotoUpload = async (file: File, branchIdx: number) => {
    if (!file) return;
    try {
      setCompressingBranchIdx(branchIdx);
      const res = await compressImageFile(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.82 });
      handleUpdateBranch(branchIdx, { image: res.dataUrl });
    } catch (err: any) {
      alert(err.message || 'Error al procesar la imagen de la sede.');
    } finally {
      setCompressingBranchIdx(null);
    }
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-slate-50 dark:bg-[#0c121d] border border-slate-200 dark:border-[#1E2D45] space-y-6 shadow-sm">
      {/* Cabecera Principal del Gestor Multi-Sede */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-2 rounded-xl bg-[#FF6B4A]/10 text-[#FF6B4A]">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>02. Gestor de Sedes y Guía de Llegada para Choferes</span>
              {hasBranches && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                  {branches.length} {branches.length === 1 ? 'Sede' : 'Sedes'}
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#A0AEC0] leading-relaxed">
            Configura sucursales con fotos de fachada, coordenadas exactas e instrucciones de acceso para transportistas, despachadores y clientes.
          </p>
        </div>

        {/* Interruptor de Estructura Multi-Sede */}
        <label className="flex items-center gap-2.5 text-xs font-bold text-slate-900 dark:text-white cursor-pointer shrink-0 bg-white dark:bg-[#131F33] hover:bg-slate-100 dark:hover:bg-[#1c2a44] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1E2D45] shadow-xs transition-all select-none">
          <input
            type="checkbox"
            checked={hasBranches}
            onChange={(e) => {
              const checked = e.target.checked;
              onToggleHasBranches(checked);
              if (checked && (!branches || branches.length === 0)) {
                onChangeBranches([{
                  id: `branch-${Date.now()}`,
                  name: `Sede 01 · ${businessName || 'Centro'}`,
                  roleBadge: 'Principal',
                  zone: defaultZone || zones[0] || 'Casco Histórico y Centro Comercial',
                  address: defaultAddress || 'Calle Bermúdez, Cumaná',
                  status: 'open',
                  entranceGuide: '',
                  image: defaultHeroImage || '',
                  openingHours: defaultHours || '',
                  phone: defaultPhone || '',
                  mapsUrl: defaultMapsUrl || '',
                  distanceText: '0.8 km',
                  videoDuration: '45 seg'
                }]);
              }
            }}
            className="rounded accent-[#FF6B4A] w-4 h-4 cursor-pointer"
          />
          <span>Estructura Multi-Sede</span>
        </label>
      </div>

      {hasBranches && (
        <div className="pt-4 border-t border-slate-200 dark:border-[#1E2D45] space-y-5">
          {/* Barra de control de sedes */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#131F33] p-4 rounded-2xl border border-slate-200 dark:border-[#1E2D45] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
              <Building2 className="w-4 h-4 text-[#FF6B4A]" />
              <span>
                Comercio con red de sucursales en Cumaná: <strong className="text-[#FF6B4A]">{branches.length} Sedes</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddBranch}
              className="px-4 py-2 rounded-xl bg-[#00C292] hover:bg-[#00a87e] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Agregar Nueva Sede</span>
            </button>
          </div>

          {/* Listado de Sedes */}
          {branches.length === 0 ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-[#1E2D45] bg-white dark:bg-[#131F33] text-center text-xs text-slate-500 space-y-2">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-800 dark:text-white">No hay sedes registradas todavía para este comercio.</p>
              <p className="text-[11px] text-slate-500">Haz clic en "+ Agregar Nueva Sede" para configurar la primera sucursal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {branches.map((branch, bIdx) => (
                <div
                  key={branch.id || bIdx}
                  className="bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all relative text-left"
                >
                  {/* Inputs invisibles para foto de la sede */}
                  <input
                    ref={(el) => { fileInputRefs.current[bIdx] = el; }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleBranchPhotoUpload(file, bIdx);
                      if (e.target) e.target.value = '';
                    }}
                    className="hidden"
                  />
                  <input
                    ref={(el) => { cameraInputRefs.current[bIdx] = el; }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleBranchPhotoUpload(file, bIdx);
                      if (e.target) e.target.value = '';
                    }}
                    className="hidden"
                  />

                  {/* Cabecera de la Sede */}
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1E2D45] pb-3.5 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        branch.status === 'open' ? 'bg-emerald-500' : branch.status === 'coming_soon' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-[11px] font-black uppercase text-slate-500 dark:text-[#A0AEC0]">
                        Sede {String(bIdx + 1).padStart(2, '0')}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {branch.name || `Sucursal ${bIdx + 1}`}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        branch.roleBadge === 'Principal'
                          ? 'bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/20'
                          : branch.roleBadge === 'Próxima Apertura' || branch.status === 'coming_soon'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-slate-100 dark:bg-[#1E2D45] text-slate-700 dark:text-slate-300'
                      }`}>
                        {branch.roleBadge || (bIdx === 0 ? 'Principal' : 'Sucursal')}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveBranch(bIdx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Eliminar esta sede"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Datos Principales en Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Nombre */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Nombre de la Sede *
                      </label>
                      <input
                        type="text"
                        value={branch.name || ''}
                        onChange={(e) => handleUpdateBranch(bIdx, { name: e.target.value })}
                        placeholder="Ej: Sede 1 · Centro Av. Bermúdez"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                      />
                    </div>

                    {/* Rol / Tipo */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Etiqueta / Tipo de Sede
                      </label>
                      <select
                        value={branch.roleBadge || (bIdx === 0 ? 'Principal' : 'Sucursal')}
                        onChange={(e) => handleUpdateBranch(bIdx, { roleBadge: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                      >
                        <option value="Principal">Principal</option>
                        <option value="Sucursal">Sucursal</option>
                        <option value="Mayorista">Mayorista / Distribución</option>
                        <option value="24 Horas">24 Horas</option>
                        <option value="Express">Express</option>
                        <option value="Centro de Carga">Centro de Carga / Almacén</option>
                        <option value="Próxima Apertura">Próxima Apertura</option>
                      </select>
                    </div>

                    {/* Sector en Cumaná */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Sector en Cumaná *
                      </label>
                      <select
                        value={branch.zone || zones[0]}
                        onChange={(e) => handleUpdateBranch(bIdx, { zone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                      >
                        {zones.map(z => (
                          <option key={z} value={z}>{z}</option>
                        ))}
                      </select>
                    </div>

                    {/* Estado Operativo */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Estado Operativo
                      </label>
                      <select
                        value={branch.status || 'open'}
                        onChange={(e) => handleUpdateBranch(bIdx, { status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                      >
                        <option value="open">🟢 Abierto / Operando</option>
                        <option value="coming_soon">🟡 Próxima Apertura</option>
                        <option value="closed">🔴 Cerrado Temporalmente</option>
                      </select>
                    </div>
                  </div>

                  {/* Dirección Física Exacta */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Dirección Física Exacta *
                    </label>
                    <input
                      type="text"
                      value={branch.address || ''}
                      onChange={(e) => handleUpdateBranch(bIdx, { address: e.target.value })}
                      placeholder="Calle Bermúdez c/c Mariño, frente a Plaza Bolívar, Cumaná"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>

                  {/* GUÍA DE LLEGADA PARA CHOFERES (ZONA DESTACADA) */}
                  <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Guía de Llegada para Choferes, Transportistas y Clientes</span>
                      </label>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                        Acceso & Descarga
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Escribe referencias clave (semáforos, plazas), portón de carga pesada, estacionamiento vigilado y cómo ingresar.
                    </p>

                    <textarea
                      rows={2}
                      value={branch.entranceGuide || ''}
                      onChange={(e) => handleUpdateBranch(bIdx, { entranceGuide: e.target.value })}
                      placeholder="Ej: A 80 metros del semáforo central, sentido Puerto Sucre. Fachada blanca con portón lateral azul exclusivo para camiones de carga y estacionamiento de clientes."
                      className="w-full px-3 py-2 bg-white dark:bg-[#080E18] border border-amber-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-[#FF6B4A] resize-none"
                    />

                    {/* Sugerencias Rápidas para Choferes */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Atajos rápidos:</span>
                      {[
                        'Portón de carga lateral',
                        'Estacionamiento vigilado',
                        'Entrada para gandolas',
                        'Frente a semáforo',
                        'Área de motos'
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const cur = branch.entranceGuide?.trim() || '';
                            const val = cur ? `${cur}. ${tag}` : tag;
                            handleUpdateBranch(bIdx, { entranceGuide: val });
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-[#1E2D45] border border-slate-200 dark:border-[#1E2D45] text-slate-700 dark:text-slate-200 hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all cursor-pointer shadow-2xs"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FOTOGRAFÍA DE FACHADA DE LA SEDE */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#FF6B4A]" />
                        <span>Foto de Fachada de esta Sede</span>
                      </label>
                      <span className="text-[10px] text-slate-400">Resolución HD • Peso Ultra-Ligero</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] shrink-0 flex items-center justify-center">
                        {branch.image ? (
                          <img src={branch.image} alt={branch.name} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-7 h-7 text-slate-400" />
                        )}
                        <span className="absolute bottom-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white">
                          SEDE
                        </span>
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={branch.image || ''}
                          onChange={(e) => handleUpdateBranch(bIdx, { image: e.target.value })}
                          placeholder="Pega URL o usa los botones de abajo..."
                          className="w-full px-3 py-1.5 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                        />

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[bIdx]?.click()}
                            disabled={compressingBranchIdx === bIdx}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] hover:border-[#FF6B4A] text-slate-800 dark:text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                          >
                            {compressingBranchIdx === bIdx ? (
                              <Loader2 className="w-3 h-3 text-[#FF6B4A] animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 text-[#FF6B4A]" />
                            )}
                            <span>Subir Foto (PC / Móvil)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => cameraInputRefs.current[bIdx]?.click()}
                            disabled={compressingBranchIdx === bIdx}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-[#1E2D45] text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                          >
                            <Camera className="w-3 h-3 text-emerald-400" />
                            <span>Tomar Foto</span>
                          </button>

                          {branch.image && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBranch(bIdx, { image: '' })}
                              className="px-2 py-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-[10px] font-bold cursor-pointer"
                            >
                              Quitar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Teléfono, Horario, Google Maps y Distancia */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Teléfono / WhatsApp Sede
                      </label>
                      <input
                        type="text"
                        value={branch.phone || ''}
                        onChange={(e) => handleUpdateBranch(bIdx, { phone: e.target.value })}
                        placeholder="0414-789-4411"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Horario de la Sede
                      </label>
                      <input
                        type="text"
                        value={branch.openingHours || ''}
                        onChange={(e) => handleUpdateBranch(bIdx, { openingHours: e.target.value })}
                        placeholder="8:00 AM - 6:00 PM"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Distancia Estimada
                      </label>
                      <input
                        type="text"
                        value={branch.distanceText || ''}
                        onChange={(e) => handleUpdateBranch(bIdx, { distanceText: e.target.value })}
                        placeholder="0.8 km"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                      />
                    </div>
                  </div>

                  {/* Enlace Google Maps de la Sede */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Enlace Google Maps de esta Sede
                    </label>
                    <input
                      type="text"
                      value={branch.mapsUrl || ''}
                      onChange={(e) => handleUpdateBranch(bIdx, { mapsUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
