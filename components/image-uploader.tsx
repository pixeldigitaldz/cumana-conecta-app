'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  Plus, 
  FileImage,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { compressImageFile, compressMultipleImageFiles, CompressedImageResult, formatFileSize } from '@/lib/image-compression';

interface SingleImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  helpText?: string;
}

export function SingleImageUploader({
  label,
  value,
  onChange,
  required = false,
  maxWidth = 1280,
  maxHeight = 850,
  helpText = 'Compresión automática WebP: Máxima nitidez HD con peso ultra-bajo.'
}: SingleImageUploaderProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCompression, setLastCompression] = useState<CompressedImageResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const result = await compressImageFile(file, { maxWidth, maxHeight, quality: 0.82 });
      setLastCompression(result);
      onChange(result.dataUrl);
    } catch (err: any) {
      alert(err.message || 'Error al procesar la imagen.');
    } finally {
      setIsProcessing(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const result = await compressImageFile(file, { maxWidth, maxHeight, quality: 0.82 });
      setLastCompression(result);
      onChange(result.dataUrl);
    } catch (err: any) {
      alert(err.message || 'Error al procesar la imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-[#FF6B4A]">*</span>}
        </label>

        {/* Alternador de método: Subir archivo o URL */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#080E18] p-0.5 rounded-lg border border-slate-200 dark:border-[#1E2D45] text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'upload'
                ? 'bg-white dark:bg-[#1E2D45] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3 text-[#FF6B4A]" />
            <span>Subir de PC / Teléfono</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mode === 'url'
                ? 'bg-white dark:bg-[#1E2D45] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Pegar URL</span>
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div>
          <input
            type="text"
            required={required}
            value={value}
            onChange={(e) => {
              setLastCompression(null);
              onChange(e.target.value);
            }}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
          />
          <p className="text-[11px] text-slate-400 mt-1">Pega el enlace directo de una foto en internet.</p>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#1E2D45] bg-slate-50 dark:bg-[#080E18] p-3 flex flex-col sm:flex-row items-center gap-4 group">
              <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-slate-200 dark:border-[#1E2D45]">
                <img
                  src={value}
                  alt="Vista previa de portada"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Foto Activa</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-1.5 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Imagen Lista (Alta Definición)
                  </span>
                  {lastCompression && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      {lastCompression.format.toUpperCase()} HD • {lastCompression.formattedCompressedSize}
                      {lastCompression.savedPercent > 0 && ` (-${lastCompression.savedPercent}% peso)`}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lastCompression ? (
                    <>
                      Original: <span className="font-semibold">{lastCompression.formattedOriginalSize}</span> ➔ Reducida a <span className="font-semibold text-emerald-600 dark:text-emerald-400">{lastCompression.formattedCompressedSize}</span> manteniendo resolución y nitidez cristalina.
                    </>
                  ) : (
                    helpText
                  )}
                </p>

                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] hover:border-[#FF6B4A] text-slate-700 dark:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {isProcessing ? <Loader2 className="w-3 h-3 animate-spin text-[#FF6B4A]" /> : <Upload className="w-3 h-3 text-[#FF6B4A]" />}
                    <span>Cambiar Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isProcessing}
                    className="sm:hidden px-3 py-1.5 rounded-lg bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] text-slate-700 dark:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Camera className="w-3 h-3 text-cyan-500" />
                    <span>Tomar Foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                      setLastCompression(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Quitar</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all bg-slate-50/70 dark:bg-[#080E18]/60 ${
                isDragging
                  ? 'border-[#FF6B4A] bg-[#FF6B4A]/5 scale-[0.99]'
                  : 'border-slate-300 dark:border-[#1E2D45] hover:border-[#FF6B4A]/70'
              }`}
            >
              {isProcessing ? (
                <div className="py-6 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#FF6B4A] animate-spin" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900 dark:text-white">Optimizando imagen...</p>
                    <p className="text-[11px] text-slate-400">Manteniendo resolución HD y reduciendo peso a WebP</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 text-slate-400 dark:text-slate-500">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] shadow-xs">
                      <Laptop className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] shadow-xs">
                      <Smartphone className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] shadow-xs">
                      <Tablet className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      Arrastra tu foto aquí o elígela desde tu PC, teléfono o tablet
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Se reduce el peso automáticamente sin perder calidad ni nitidez.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Elegir Foto (PC / Celular / Tablet)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-[#1E2D45] hover:bg-black text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>Tomar Foto con Cámara</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface GalleryImageUploaderProps {
  images: string[];
  onAddImages: (newUrls: string[]) => void;
  onRemoveImage: (index: number) => void;
  maxWidth?: number;
  maxHeight?: number;
}

export function GalleryImageUploader({
  images,
  onAddImages,
  onRemoveImage,
  maxWidth = 1200,
  maxHeight = 800
}: GalleryImageUploaderProps) {
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [recentSavings, setRecentSavings] = useState<{ totalOriginal: string; totalCompressed: string; percent: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleMultipleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      setProgressText(`Optimizando 1 de ${files.length} fotos...`);

      let totalOrig = 0;
      let totalComp = 0;

      const compressedResults = await compressMultipleImageFiles(
        files,
        { maxWidth, maxHeight, quality: 0.82 },
        (current, total, latest) => {
          if (latest) {
            totalOrig += latest.originalSize;
            totalComp += latest.compressedSize;
          }
          setProgressText(`Optimizando foto ${current} de ${total}...`);
        }
      );

      const newUrls = compressedResults.map(r => r.dataUrl);
      if (newUrls.length > 0) {
        onAddImages(newUrls);
        const percent = totalOrig > 0 ? Math.round(((totalOrig - totalComp) / totalOrig) * 100) : 0;
        setRecentSavings({
          totalOriginal: formatFileSize(totalOrig),
          totalCompressed: formatFileSize(totalComp),
          percent
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error al procesar las fotos.');
    } finally {
      setIsProcessing(false);
      setProgressText('');
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      alert('Esta imagen ya está agregada en la galería.');
      return;
    }
    onAddImages([trimmed]);
    setUrlInput('');
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#FF6B4A]" />
          <span className="text-xs font-bold text-slate-800 dark:text-white">
            Galería Fotográfica ({images.length} {images.length === 1 ? 'imagen' : 'imágenes'})
          </span>
          {recentSavings && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Ahorro: {recentSavings.totalOriginal} ➔ {recentSavings.totalCompressed} (-{recentSavings.percent}%)
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-500">Agrega fotos de platos, instalaciones o fachada</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          handleMultipleFiles(e.target.files);
          if (e.target) e.target.value = '';
        }}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          handleMultipleFiles(e.target.files);
          if (e.target) e.target.value = '';
        }}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="px-4 py-2.5 rounded-xl bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{progressText || 'Optimizando...'}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Subir Fotos (PC / Teléfono / Tablet)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={isProcessing}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-[#1E2D45] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
          title="Tomar foto con la cámara del dispositivo"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span>Tomar Foto</span>
        </button>

        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] text-slate-700 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlField ? 'Ocultar URL' : 'O pegar enlace URL'}</span>
        </button>
      </div>

      {showUrlField && (
        <div className="flex gap-2 pt-1 animate-in fade-in duration-150">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="Pega la URL de una foto para la galería..."
            className="flex-1 px-3.5 py-2 bg-white dark:bg-[#131F33] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#FF6B4A]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir</span>
          </button>
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {images.map((imgUrl, idx) => (
            <div 
              key={idx} 
              className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-[#1E2D45] group bg-black/10 shadow-xs"
            >
              <img 
                src={imgUrl} 
                alt={`Foto galería ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200" 
              />
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold">
                #{idx + 1}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onRemoveImage(idx)}
                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-md"
                  title="Eliminar de galería"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 dark:border-[#1E2D45] rounded-xl py-6 text-center text-slate-400 dark:text-slate-500">
          <FileImage className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
          <p className="text-xs font-medium">No has añadido fotos a la galería todavía.</p>
          <p className="text-[11px] text-slate-400">Puedes seleccionar varias fotos a la vez desde tu PC, teléfono o tablet.</p>
        </div>
      )}
    </div>
  );
}
