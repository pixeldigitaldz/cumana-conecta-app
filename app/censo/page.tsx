'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Tablet, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  Store, 
  Zap, 
  MapPin, 
  Phone, 
  Camera, 
  Save, 
  RotateCcw, 
  UploadCloud, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronRight, 
  Check, 
  X, 
  ArrowLeft, 
  Download, 
  FileText, 
  Search, 
  Trash2, 
  Sun, 
  Moon, 
  Maximize, 
  Minimize,
  DollarSign,
  Plus,
  Smartphone,
  Share2,
  Globe,
  Waves,
  Car,
  Snowflake,
  Bike,
  PawPrint,
  Banknote,
  CreditCard,
  Landmark,
  Coins,
  Image as ImageIcon
} from 'lucide-react';

import { Business, BusinessTier, Amenity, PaymentMethod } from '@/types/business';
import { useAppData } from '@/lib/app-data-context';
import { VerifiedBadge } from '@/components/verified-badge';
import { useTheme } from '@/components/theme-provider';
import { isBusinessOpen, getBusinessStatusInfo, formatOpeningHours, formatTimeTo12h } from '@/lib/business-hours';
import { compressImageFile } from '@/lib/image-compression';
import { getIndexedDBItem, setIndexedDBItem } from '@/lib/storage';
import { BusinessHoursPicker } from '@/components/business-hours-picker';

interface OfflineRecord {
  id: string;
  business: Omit<Business, 'id' | 'createdAt'>;
  capturedAt: string;
  synced: boolean;
  notes?: string;
}

const OFFLINE_STORAGE_KEY = 'cumana_tablet_census_queue';

export default function TabletCensusPage() {
  const { businesses, addBusiness, structure, addCategory, removeCategory, addZone } = useAppData();
  const { theme, toggleTheme } = useTheme();

  // Estado de Conectividad en tiempo real
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Cola de registros guardados en la tablet
  const [offlineQueue, setOfflineQueue] = useState<OfflineRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [searchHistoryTerm, setSearchHistoryTerm] = useState('');

  // Modo Pantalla Completa para Tablets
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Soporte de Instalación de Aplicación PWA en Tablet
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Estados de Gestión Rápida de Categorías en Campo
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  // Estados del Formulario Rápido de Campo
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [rif, setRif] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const selectedCategory = selectedCategories[0] || '';
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [tier, setTier] = useState<BusinessTier>('free');
  const [status, setStatus] = useState<Business['status']>('active');
  const [isVerified, setIsVerified] = useState<boolean>(true); // Verificado al registrar en tablet
  const [acceptsCashea, setAcceptsCashea] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([
    'aire_acondicionado', 
    'fibra_optica'
  ]);
  const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([
    'pago_movil', 
    'efectivo_usd'
  ]);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  
  // Estados para Horario de Atención y Estado Dinámico (Abierto/Cerrado)
  const [customOpeningHours, setCustomOpeningHours] = useState<string>('Lunes a Viernes: 7:00 AM a 8:00 PM | Sábado: 8:00 AM - 1:00 PM');
  const [hasGps, setHasGps] = useState<boolean>(true);
  const [mapsUrl, setMapsUrl] = useState<string>('');
  const [isAddingZone, setIsAddingZone] = useState<boolean>(false);
  const [newZoneName, setNewZoneName] = useState<string>('');
  const [isOpen24Hours, setIsOpen24Hours] = useState<boolean>(false);
  const [openTime, setOpenTime] = useState<string>('07:00');
  const [closeTime, setCloseTime] = useState<string>('20:00');

  // Cálculo en vivo del estado según el horario ingresado en la tablet
  const currentOpeningHours = customOpeningHours;
  const currentStatusInfo = useMemo(() => {
    return getBusinessStatusInfo(customOpeningHours);
  }, [customOpeningHours]);

  const [isMounted, setIsMounted] = useState(false);
  const [todayStr, setTodayStr] = useState<string>('');

  // Modales y formularios
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Inicializar fecha y montaje
  useEffect(() => {
    setIsMounted(true);
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  // Inicializar zonas y categorías iniciales solo si están vacías
  useEffect(() => {
    if (structure.categories.length > 0) {
      setSelectedCategories(prev => prev.length > 0 ? prev : [structure.categories[0]]);
    }
    if (structure.zones.length > 0) {
      setSelectedZone(prev => prev || structure.zones[0]);
    }
  }, [structure.categories, structure.zones]);

  // Cargar cola de la tablet desde localStorage y detectar PWA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      // Detectar si ya está en modo app nativa (standalone)
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                               (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      const handleOnline = () => {
        setIsOnline(true);
        triggerAutoSync();
      };
      const handleOffline = () => setIsOnline(false);

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setInstallPrompt(e);
      };

      const handleAppInstalled = () => {
        setIsStandalone(true);
        setInstallPrompt(null);
        setSyncNotice('✓ ¡Cumaná Conecta instalada en tu tablet como aplicación!');
        setTimeout(() => setSyncNotice(null), 4000);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener('appinstalled', handleAppInstalled);

      try {
        const storedQueue = localStorage.getItem(OFFLINE_STORAGE_KEY);
        if (storedQueue) {
          const parsed = JSON.parse(storedQueue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOfflineQueue(parsed);
          }
        }
      } catch (err) {
        console.error('Error al cargar la cola offline de la tablet', err);
      }

      // Hidratación robusta desde IndexedDB (sin límite de 5MB para fotos de censo)
      getIndexedDBItem<OfflineRecord[]>(OFFLINE_STORAGE_KEY).then(dbQueue => {
        if (dbQueue && Array.isArray(dbQueue) && dbQueue.length > 0) {
          setOfflineQueue(dbQueue);
        }
      }).catch(err => {
        console.warn('Error al leer cola offline de IndexedDB:', err);
      });

      // Configurar manifest exclusivo de tablet para que la PWA sea independiente de la web
      const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      if (manifestLink) {
        manifestLink.setAttribute('href', '/manifest-tablet.json');
      }

      return () => {
        if (manifestLink) {
          manifestLink.setAttribute('href', '/manifest.json');
        }
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  // Guardar cola offline en IndexedDB y localStorage cada vez que cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIndexedDBItem(OFFLINE_STORAGE_KEY, offlineQueue);
      try {
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(offlineQueue));
      } catch (e) {
        console.warn('LocalStorage excedido en cola tablet; fotos y registros guardados de forma segura en IndexedDB');
      }
    }
  }, [offlineQueue]);

  // Métricas de estado en tiempo real
  const activeBusinessesCount = useMemo(() => {
    return businesses.filter(b => b.status === 'active').length;
  }, [businesses]);

  const inactiveBusinessesCount = useMemo(() => {
    return businesses.filter(b => b.status !== 'active').length;
  }, [businesses]);

  const verifiedBusinessesCount = useMemo(() => {
    return businesses.filter(b => b.isVerified).length;
  }, [businesses]);

  const unsyncedCount = useMemo(() => {
    return offlineQueue.filter(item => !item.synced).length;
  }, [offlineQueue]);

  const todayCount = useMemo(() => {
    if (!todayStr) return offlineQueue.length;
    return offlineQueue.filter(item => item.capturedAt.startsWith(todayStr)).length;
  }, [offlineQueue, todayStr]);

  // Sincronización Automática con el Servidor
  const triggerAutoSync = async () => {
    if (!navigator.onLine) return;

    const pendingItems = offlineQueue.filter(item => !item.synced);
    if (pendingItems.length === 0) return;

    setIsSyncing(true);
    setSyncNotice(`Sincronizando ${pendingItems.length} locales con el servidor...`);

    let uploaded = 0;
    try {
      for (const item of pendingItems) {
        addBusiness(item.business);
        uploaded++;
      }

      // Marcar registros como sincronizados en la cola
      setOfflineQueue(prev => prev.map(item => ({ ...item, synced: true })));
      setSyncNotice(`✓ ¡Éxito! ${uploaded} locales se subieron al servidor automáticamente.`);
      setTimeout(() => setSyncNotice(null), 5000);
    } catch (err) {
      console.error('Error durante la sincronización', err);
      setSyncNotice('Aviso: Algunos locales se sincronizarán en el próximo reintento.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Refs para evitar rebote de eventos táctiles / click fantasma en tablet
  const lastToggleRef = useRef<{ [key: string]: number }>({});

  const handleToggleCategory = (cat: string, e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        if (prev.length <= 1) {
          setSyncNotice('Aviso: El local debe mantener al menos un rubro seleccionado.');
          setTimeout(() => setSyncNotice(null), 3000);
          return prev;
        }
        return prev.filter(c => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  const handleSetPrimaryCategory = (cat: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedCategories(prev => {
      const rest = prev.filter(c => c !== cat);
      return [cat, ...rest];
    });
  };

  const handleSelectZone = (zone: string, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedZone(zone);
  };

  const handleSelectTier = (t: BusinessTier, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setTier(t);
  };

  // Alternar amenidad táctil de forma instantánea
  const safeToggleAmenity = (amenity: Amenity, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Alternar método de pago táctil de forma instantánea
  const safeTogglePayment = (method: PaymentMethod, e?: React.SyntheticEvent) => {
    if (e) e.stopPropagation();
    setSelectedPayments(prev => 
      prev.includes(method) ? prev.filter(p => p !== method) : [...prev, method]
    );
  };

  // Gestión Rápida de Categorías en Caliente
  const handleQuickAddCategory = (e?: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      alert('Por favor escribe el nombre de la categoría.');
      return;
    }
    addCategory(trimmed);
    setSelectedCategories(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    setNewCategoryName('');
    setIsAddingCategory(false);
    setSyncNotice(`✓ Categoría "${trimmed}" agregada a los rubros.`);
    setTimeout(() => setSyncNotice(null), 3000);
  };

  const handleQuickRemoveCategory = (catToRemove: string) => {
    if (structure.categories.length <= 1) {
      alert('Debe quedar al menos una categoría en el sistema.');
      return;
    }
    if (confirm(`¿Eliminar la categoría "${catToRemove}" de la lista?`)) {
      removeCategory(catToRemove);
      setSelectedCategories(prev => {
        const remaining = prev.filter(c => c !== catToRemove);
        if (remaining.length > 0) return remaining;
        const available = structure.categories.filter(c => c !== catToRemove);
        return available.length > 0 ? [available[0]] : [];
      });
      setSyncNotice(`✓ Categoría "${catToRemove}" removida.`);
      setTimeout(() => setSyncNotice(null), 3000);
    }
  };

  // Instalación de Aplicación PWA
  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setInstallPrompt(null);
          setIsStandalone(true);
        }
      } catch (err) {
        setIsInstallModalOpen(true);
      }
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Captura o selección de imagen (Galería del teléfono o Cámara)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
        setPhotoPreview(compressed.dataUrl);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    // Permitir volver a seleccionar el mismo archivo si se desea
    e.target.value = '';
  };

  // Guardar Local en la Tablet (Acción Rápida de Campo)
  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      alert('Por favor escribe el nombre del local.');
      nameInputRef.current?.focus();
      return;
    }

    const cleanSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const primaryCat = selectedCategories[0] || 'Comercio & Tiendas';
    const effectiveCategories = selectedCategories.length > 0 ? selectedCategories : [primaryCat];
    const rubrosText = effectiveCategories.join(', ');

    // Imagen por defecto si no tomó foto en el momento
    const finalHeroImage = photoPreview || 
      (effectiveCategories.some(c => c.includes('Gastronomía')) 
        ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
        : effectiveCategories.some(c => c.includes('Playa'))
        ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
        : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80');

    const cleanPhone = whatsapp.trim() ? (
      whatsapp.startsWith('+') ? whatsapp.trim() : 
      whatsapp.startsWith('58') ? `+${whatsapp.trim()}` : 
      `+58${whatsapp.replace(/^0/, '').trim()}`
    ) : '+584140000000';

    const newBusinessPayload: Omit<Business, 'id' | 'createdAt'> = {
      slug: `${cleanSlug}-${Date.now().toString().slice(-4)}`,
      name: businessName.trim(),
      tagline: `${effectiveCategories.slice(0, 2).join(' & ')} en ${selectedZone}. Atención verificada en sitio.`,
      description: `Comercio registrado en Modo Tablet de Cumaná Conecta. Ubicado en ${address || selectedZone}. Rubros: ${rubrosText}. Contacto directo y facilidades verificadas.`,
      category: primaryCat,
      categories: effectiveCategories,
      zone: selectedZone || 'Casco Histórico',
      address: address.trim() || `${selectedZone}, Cumaná, Estado Sucre`,
      hasGps: hasGps,
      mapsUrl: hasGps ? (mapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(businessName + ' ' + selectedZone + ' Cumana')}`) : '',
      rif: rif.trim() || undefined,
      acceptsCashea: acceptsCashea,
      isFeatured: isFeatured,
      socials: {
        whatsapp: `https://wa.me/${cleanPhone.replace(/[^0-9]/g, '')}?text=Hola,%20vi%20su%20local%20en%20Cumaná%20Conecta`,
        ...(website.trim() ? { website: website.trim().startsWith('http') ? website.trim() : `https://${website.trim()}` } : {})
      },
      paymentMethods: selectedPayments.length > 0 ? selectedPayments : ['pago_movil', 'efectivo_usd'],
      amenities: selectedAmenities,
      tier: tier,
      rating: 4.8,
      reviewsCount: 1,
      heroImage: finalHeroImage,
      gallery: [],
      isOpenNow: isBusinessOpen(customOpeningHours),
      openingHours: customOpeningHours,
      isVerified: isVerified,
      status: status
    };

    const newOfflineItem: OfflineRecord = {
      id: `tablet-${Date.now()}`,
      business: newBusinessPayload,
      capturedAt: new Date().toISOString(),
      synced: false,
      notes: notes.trim()
    };

    // 1. Guardar en la tablet inmediatamente
    setOfflineQueue(prev => [newOfflineItem, ...prev]);

    // 2. Si hay conexión en este instante, subirlo de una vez al servidor
    if (navigator.onLine) {
      try {
        addBusiness(newBusinessPayload);
        newOfflineItem.synced = true;
        setOfflineQueue(prev => [newOfflineItem, ...prev.slice(1)]);
        setSyncNotice(`✓ ¡"${businessName}" guardado y subido al servidor inmediatamente!`);
      } catch (err) {
        setSyncNotice(`✓ "${businessName}" guardado en la tablet (se subirá en cuanto haya señal).`);
      }
    } else {
      setSyncNotice(`💾 ¡"${businessName}" guardado en la memoria segura de la tablet! (Sin internet).`);
    }

    setTimeout(() => setSyncNotice(null), 4000);

    // 3. Resetear formulario para registrar el siguiente local al instante
    setBusinessName('');
    setOwnerName('');
    setWhatsapp('');
    setWebsite('');
    setRif('');
    setAddress('');
    setNotes('');
    setPhotoPreview('');
    setIsVerified(true);
    setTier('free');
    setStatus('active');
    setIsOpen24Hours(false);
    setOpenTime('07:00');
    setCloseTime('20:00');
    setSelectedCategories([structure.categories[0] || 'Comercio & Tiendas']);
    // Scroll suave hacia arriba para el siguiente registro
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Alternar pantalla completa para tablet
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Exportar respaldo en archivo JSON o CSV para seguridad
  const exportBackupJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(offlineQueue, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `registro_locales_tablet_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 font-sans -mt-[134px] md:-mt-[108px] pt-0 pb-20 select-none">
      
      {/* BARRA SUPERIOR STICKY: ESTADO DE LA TABLET & CONEXIÓN */}
      <header className="sticky top-0 z-40 bg-[#0d1017]/95 backdrop-blur-xl border-b border-[#1e222b] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
          
          {/* Logo & Modo Tablet */}
          <div className="flex items-center gap-3">
            <Link 
              href="/administracion" 
              className="p-2 rounded-xl bg-[#161920] hover:bg-[#1e2430] border border-[#222630] text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Volver a Administración"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md font-black shrink-0">
                <Tablet className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight flex items-center gap-2">
                  <span>Modo Tablet · Registro de Locales</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono-tabular font-black uppercase">
                    Offline Ready
                  </span>
                </h1>
                <p className="text-[10px] text-amber-400 font-mono-tabular font-bold">
                  Registro táctil en tiempo real · Cumaná Conecta
                </p>
              </div>
            </div>
          </div>

          {/* Indicador de Conexión + Controles de Tablet */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Píldora de Conexión */}
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-black shadow-xs font-mono-tabular ${
              isOnline 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-950/60 text-amber-400 border-amber-500/40 animate-pulse'
            }`}>
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">En Línea</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Sin Conexión</span>
                </>
              )}
            </div>

            {/* Botón Instalar como App en Tablet */}
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                title="Instalar Cumaná Conecta como aplicación independiente en la tablet"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instalar App</span>
              </button>
            )}

            {/* Botón Sincronizar Pendientes */}
            {unsyncedCount > 0 && (
              <button
                type="button"
                onClick={triggerAutoSync}
                disabled={isSyncing || !isOnline}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer active:scale-95"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                <span>Subir {unsyncedCount}</span>
              </button>
            )}

            {/* Botón Pantalla Completa */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#161920] hover:bg-[#1e2430] border border-[#222630] text-slate-300 hover:text-white transition-all cursor-pointer hidden sm:flex shadow-sm"
              title="Alternar Pantalla Completa"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICACIÓN FLOTANTE DE SINCRONIZACIÓN */}
      {syncNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0d1017]/95 text-white backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-amber-400/30 text-xs font-black flex items-center gap-2 transition-all duration-300 pointer-events-none">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        
        {/* PANEL DE MÉTRICAS EN VIVO PARA LA TABLET (PALETA LUXURY DARK) */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#11141a] rounded-2xl border border-[#1e222b] p-3.5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-slate-400 block">TOTAL DIRECTORIO</span>
            <div className="text-xl sm:text-2xl font-black text-white">{businesses.length}</div>
            <span className="text-[10px] text-slate-500">Locales registrados</span>
          </div>

          <div className="bg-[#11141a] rounded-2xl border border-[#1e222b] p-3.5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-emerald-400 block">PUBLICADOS</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{activeBusinessesCount}</div>
            <span className="text-[10px] text-slate-500">Activos en vivo</span>
          </div>

          <div className="bg-[#11141a] rounded-2xl border border-[#1e222b] p-3.5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-rose-400 block">POR APROBAR</span>
            <div className="text-xl sm:text-2xl font-black text-rose-400">{inactiveBusinessesCount}</div>
            <span className="text-[10px] text-slate-500">En revisión</span>
          </div>

          <div className="bg-[#11141a] rounded-2xl border border-[#1e222b] p-3.5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-teal-400 block flex items-center gap-1">
              <span>VERIFICADOS</span>
              <VerifiedBadge size="sm" />
            </span>
            <div className="text-xl sm:text-2xl font-black text-teal-400">{verifiedBusinessesCount}</div>
            <span className="text-[10px] text-slate-500">Con check oficial</span>
          </div>

          <div className="bg-[#11141a] rounded-2xl border border-[#1e222b] p-3.5 shadow-sm space-y-1">
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-amber-400 block">HOY EN TABLET</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400">{todayCount}</div>
            <span className="text-[10px] text-slate-500">En esta jornada</span>
          </div>

          <div className={`rounded-2xl border p-3.5 shadow-sm space-y-1 ${
            unsyncedCount > 0 
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-400' 
              : 'bg-[#11141a] border-[#1e222b] text-slate-400'
          }`}>
            <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider block">COLA LOCAL</span>
            <div className="text-xl sm:text-2xl font-black text-white">{unsyncedCount}</div>
            <span className="text-[10px]">{unsyncedCount > 0 ? 'Pendiente por subir' : 'Todo sincronizado ✓'}</span>
          </div>
        </section>

        {/* NAVEGACIÓN ENTRE FORMULARIO Y BANDEJA DE LA TABLET */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between bg-[#11141a] p-2 rounded-2xl border border-[#1e222b] shadow-sm gap-2">
          <div className="flex items-center gap-2 w-full xs:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex-1 xs:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Registrar Local</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 xs:flex-initial px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Guardados ({offlineQueue.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={exportBackupJSON}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161920] hover:bg-[#1e2430] border border-[#222630] text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
            title="Descargar copia de seguridad en JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Descargar Respaldo</span>
          </button>
        </div>

        {/* VISTA 1: FORMULARIO RÁPIDO DE CAMPO (OPTIMIZADO PARA TABLET) */}
        {activeTab === 'form' && (
          <form onSubmit={handleSaveBusiness} className="space-y-6">
            
            {/* SECCIÓN 1: IDENTIFICACIÓN COMERCIAL */}
            <div className="bg-[#11141a] rounded-3xl border border-[#1e222b] p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#1e222b] pb-3">
                <h2 className="text-xs font-mono-tabular uppercase font-bold text-amber-400 tracking-wider flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>1. Datos de Identificación del Local</span>
                </h2>
                
                {/* Switch Verificación en Sitio */}
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-400 text-xs font-bold cursor-pointer shadow-xs">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="w-4 h-4 accent-[#0095F6] rounded cursor-pointer"
                  />
                  <VerifiedBadge size="sm" />
                  <span>Verificado en Sitio (Check Oficial)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* NOMBRE DEL LOCAL COMERCIAL: TAMAÑO AJUSTADO, COMPACTO Y ELEGANTE */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Nombre del Local Comercial *
                  </label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Empanadas Doña Carmen, Posada Sol de Mochima, Farmacia San José..."
                    className="w-full px-3.5 py-2.5 bg-[#161920] border border-[#222630] rounded-xl text-xs sm:text-sm text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Encargado o Dueño (Opcional)
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ej. Carmen Rodríguez"
                    className="w-full px-3.5 py-2.5 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      WhatsApp o Teléfono *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="0414-1234567"
                        className="w-full pl-9 pr-3 py-2.5 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1 flex items-center justify-between">
                      <span>RIF Comercial</span>
                      <span className="text-[9px] text-slate-500 font-mono-tabular">Opcional</span>
                    </label>
                    <input
                      type="text"
                      value={rif}
                      onChange={(e) => setRif(e.target.value.toUpperCase())}
                      placeholder="J-505563599"
                      className="w-full px-3 py-2.5 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-black tracking-wider placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                      Página Web / Catálogo
                    </label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-9 pr-3 py-2.5 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Selector Táctil Rápido de Categorías con Multirubro, Agregar y Quitar en Caliente */}
              <div className="space-y-3 pt-3 border-t border-[#1e222b]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <span>Rubros Comerciales *</span>
                      <span className="text-[10px] text-amber-400 font-mono-tabular">({selectedCategories.length} marcados de {structure.categories.length})</span>
                    </label>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Toca varios rubros para marcarlos si el comercio tiene múltiples giros o actividades.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCategory(!isAddingCategory);
                        setIsManageCategoriesOpen(false);
                      }}
                      className="touch-manipulation px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-400 text-xs font-black border border-amber-400/30 flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Crear una nueva categoría al instante mientras caminas"
                    >
                      <Plus className="w-3.5 h-3.5 pointer-events-none" />
                      <span className="pointer-events-none">+ Nueva Categoría</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsManageCategoriesOpen(!isManageCategoriesOpen);
                        setIsAddingCategory(false);
                      }}
                      className={`touch-manipulation px-3 py-1.5 rounded-xl text-xs font-black border flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${
                        isManageCategoriesOpen 
                          ? 'bg-rose-500 text-white border-rose-500' 
                          : 'bg-[#161920] hover:bg-[#1f242e] border-[#222630] text-slate-300'
                      }`}
                      title="Eliminar categorías no deseadas"
                    >
                      <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                      <span className="pointer-events-none">{isManageCategoriesOpen ? 'Listo' : 'Quitar'}</span>
                    </button>
                  </div>
                </div>

                {/* Indicador Visual Destacado de Rubros Seleccionados */}
                <div className="p-3 rounded-2xl bg-[#161920] border border-[#222630] space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">Rubros Asignados:</span>
                      <span className="text-[10px] font-mono-tabular font-bold bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-md">
                        {selectedCategories.length} {selectedCategories.length === 1 ? 'rubro' : 'rubros'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">Añadir de la lista:</span>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleToggleCategory(e.target.value);
                          }
                        }}
                        className="px-3 py-1 rounded-xl bg-[#11141a] border border-[#222630] text-xs font-bold text-white cursor-pointer focus:outline-none focus:border-amber-400"
                      >
                        <option value="">+ Seleccionar otro rubro...</option>
                        {structure.categories.map((c) => (
                          <option key={c} value={c} className="bg-[#11141a] text-white">
                            {selectedCategories.includes(c) ? `✓ ${c}` : `+ ${c}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Badges de rubros seleccionados con opción de quitar y ver el principal */}
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategories.map((cat, idx) => (
                      <span 
                        key={cat}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-amber-400 text-slate-950 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{cat}</span>
                        {idx === 0 && selectedCategories.length > 1 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-amber-300 font-extrabold uppercase">
                            Principal
                          </span>
                        )}
                        {selectedCategories.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleToggleCategory(cat, e)}
                            className="touch-manipulation p-0.5 rounded-full hover:bg-slate-950/20 text-slate-950 cursor-pointer"
                            title="Quitar rubro"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Selector rápido de cuál es el principal si hay más de 1 */}
                  {selectedCategories.length > 1 && (
                    <div className="pt-2 border-t border-[#222630] flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold">⭐ Rubro Principal de Portada:</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategories.map((cat, idx) => (
                          <button
                            type="button"
                            key={cat}
                            onClick={(e) => handleSetPrimaryCategory(cat, e)}
                            className={`touch-manipulation px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              idx === 0 
                                ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs' 
                                : 'bg-[#11141a] text-slate-300 border-[#222630] hover:text-white'
                            }`}
                          >
                            {idx === 0 ? '★ ' : ''}{cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Formulario Rápido Desplegable para Agregar Categoría */}
                {isAddingCategory && (
                  <div className="p-3.5 rounded-2xl bg-[#161920] border border-amber-400/30 space-y-2.5 transition-all">
                    <div className="flex items-center justify-between text-xs font-black text-white">
                      <span>Agregar nueva categoría mientras caminas:</span>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingCategory(false)}
                        className="touch-manipulation p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4 pointer-events-none" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ej. Peluquería & Barbería, Repuestos Automotrices..."
                        className="flex-1 px-3.5 py-2.5 bg-[#11141a] border border-[#222630] rounded-xl text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickAddCategory(e);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => handleQuickAddCategory(e)}
                        className="touch-manipulation px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer active:scale-95"
                      >
                        <Check className="w-4 h-4 pointer-events-none stroke-[3]" />
                        <span className="pointer-events-none">Guardar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista Táctil de Categorías con Selección Múltiple y Opción de Quitar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {structure.categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    const isPrimary = selectedCategories[0] === cat;
                    return (
                      <div key={cat} className="relative group">
                        <button
                          type="button"
                          onClick={(e) => handleToggleCategory(cat, e)}
                          className={`touch-manipulation w-full p-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border active:scale-95 flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950 border-amber-400 font-black scale-[1.02] shadow-md'
                              : 'bg-[#161920] hover:bg-[#1f242e] text-slate-300 border-[#222630] hover:text-white'
                          } ${isManageCategoriesOpen ? 'opacity-90 pr-5' : ''}`}
                        >
                          <span className="text-xs font-extrabold shrink-0">{isSelected ? '✓' : '+'}</span>
                          <span className="line-clamp-2 pointer-events-none">{cat}</span>
                          {isSelected && isPrimary && selectedCategories.length > 1 && (
                            <span className="text-[8px] bg-slate-950 text-amber-400 px-1 py-0.2 rounded font-black shrink-0">1º</span>
                          )}
                        </button>
                        
                        {/* Botón de Quitar Categoría */}
                        {isManageCategoriesOpen && structure.categories.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuickRemoveCategory(cat);
                            }}
                            className="touch-manipulation absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md cursor-pointer z-10 transition-transform active:scale-90"
                            title={`Eliminar categoría ${cat}`}
                          >
                            <X className="w-3 h-3 pointer-events-none" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selector Táctil Rápido de Sectores y Registro en Campo */}
              <div className="space-y-2.5 pt-3 border-t border-[#1e222b]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                    Sector o Bahía de Cumaná *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-teal-400 font-mono-tabular">({structure.zones.length} sectores)</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingZone(!isAddingZone)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                    >
                      {isAddingZone ? 'Cerrar registro' : '+ Añadir nuevo sector'}
                    </button>
                  </div>
                </div>

                {/* Formulario rápido para añadir sector/dirección en la tablet */}
                {isAddingZone && (
                  <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2 animate-in fade-in">
                    <span className="text-[11px] font-bold text-teal-300 block">
                      Registrar nuevo sector o dirección en la tablet:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newZoneName}
                        onChange={(e) => setNewZoneName(e.target.value)}
                        placeholder="Ej: Av. Cancamure, Calle Blanco Fombona, Caigüire..."
                        className="flex-1 px-3 py-2 bg-[#11141a] border border-teal-500/40 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-teal-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const clean = newZoneName.trim();
                          if (!clean) return;
                          addZone(clean);
                          setSelectedZone(clean);
                          if (!address) setAddress(clean);
                          setNewZoneName('');
                          setIsAddingZone(false);
                          setSyncNotice(`✓ Sector "${clean}" agregado y seleccionado.`);
                        }}
                        className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-black text-xs hover:bg-teal-300 cursor-pointer shadow-sm"
                      >
                        Añadir y Seleccionar
                      </button>
                    </div>
                  </div>
                )}

                {/* Indicador Visual Destacado de Sector Activo + Selector Desplegable Sincronizado */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#161920] border border-[#222630]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">Seleccionado:</span>
                    <span 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-teal-400 text-slate-950 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{selectedZone || 'Toca un sector'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">O elige aquí:</span>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-[#11141a] border border-[#222630] text-xs font-bold text-white cursor-pointer focus:outline-none focus:border-teal-400"
                    >
                      {structure.zones.map((z) => (
                        <option key={z} value={z} className="bg-[#11141a] text-white">{z}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {structure.zones.map((zone) => {
                    const isSelected = selectedZone === zone;
                    return (
                      <button
                        key={zone}
                        type="button"
                        onClick={(e) => handleSelectZone(zone, e)}
                        className={`touch-manipulation p-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border active:scale-95 flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-400 text-slate-950 border-teal-400 font-black scale-[1.02] shadow-md'
                            : 'bg-[#161920] hover:bg-[#1f242e] text-slate-300 border-[#222630] hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3] shrink-0 pointer-events-none" />}
                        <span className="pointer-events-none">{zone}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dirección / Punto de Referencia con Datalist y Sugerencias */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                    Dirección Exacta o Punto de Referencia Visual
                  </label>
                  {selectedZone && (
                    <button
                      type="button"
                      onClick={() => setAddress(selectedZone)}
                      className="text-[10px] text-amber-400 hover:underline font-bold cursor-pointer"
                    >
                      Usar sector "{selectedZone}" como dirección
                    </button>
                  )}
                </div>

                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    list="censo-registered-zones-list"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej. Calle Bolívar diagonal a la Plaza Santa Inés, frente al semáforo..."
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>

                <datalist id="censo-registered-zones-list">
                  {structure.zones.map(z => (
                    <option key={z} value={z} />
                  ))}
                </datalist>

                {/* Sugerencias de Zonas Registradas */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold">Zonas registradas:</span>
                  {structure.zones.slice(0, 8).map(z => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setAddress(prev => prev ? (prev.includes(z) ? prev : `${prev}, ${z}`) : z)}
                      className="px-2 py-0.5 rounded-lg bg-[#161920] hover:bg-[#1f242e] text-[10px] font-bold text-slate-300 border border-[#222630] transition-all cursor-pointer"
                    >
                      + {z}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: HORARIO DE ATENCIÓN FLEXIBLE (LUNES A DOMINGO / FINES DE SEMANA) */}
            <div className="bg-[#11141a] rounded-3xl border border-[#1e222b] p-5 sm:p-7 shadow-sm space-y-4">
              <BusinessHoursPicker
                value={customOpeningHours}
                onChange={setCustomOpeningHours}
              />
            </div>

            {/* SECCIÓN 3: GEOLOCALIZACIÓN POR GOOGLE MAPS (INTERRUPTOR ACTIVO / INACTIVO) */}
            <div className="bg-[#11141a] rounded-3xl border border-[#1e222b] p-5 sm:p-7 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e222b] pb-3">
                <div className="space-y-0.5">
                  <h2 className="text-xs font-mono-tabular uppercase font-bold text-amber-400 tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Geolocalización por Google Maps</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Activa si el comercio cuenta con punto exacto en Google Maps o desactívalo para locales por dirección física
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setHasGps(!hasGps)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black border flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                    hasGps
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-[#161920] text-slate-400 border-[#222630]'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${hasGps ? 'bg-slate-950' : 'bg-slate-500'}`} />
                  <span>{hasGps ? 'GPS ACTIVO' : 'GPS INACTIVO'}</span>
                </button>
              </div>

              {hasGps ? (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                    Enlace de Google Maps (Opcional - se generará automático si se deja vacío)
                  </label>
                  <input
                    type="text"
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3.5 py-2.5 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                  <p className="text-[10px] text-emerald-400 font-medium">
                    ✓ El comercio mostrará mapa interactivo y botón "Abrir en Google Maps" en su ficha.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#161920] border border-dashed border-[#222630] text-xs text-slate-400 space-y-1">
                  <span className="font-bold text-slate-200 block">Modo sin mapa satelital:</span>
                  <p className="text-[11px]">
                    El local se publicará sin recuadro de mapa. Los clientes se guiarán por su dirección física y botones directos de WhatsApp o llamada.
                  </p>
                </div>
              )}
            </div>

            {/* SECCIÓN 3: RESPALDO OPERATIVO & COMODIDADES (BOTONES TÁCTILES) */}
            <div className="bg-[#11141a] rounded-3xl border border-[#1e222b] p-5 sm:p-7 shadow-sm space-y-4">
              <h2 className="text-xs font-mono-tabular uppercase font-bold text-amber-400 tracking-wider flex items-center gap-2 border-b border-[#1e222b] pb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>3. Servicios & Respaldo Operativo (Toca para activar)</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'fibra_optica' as Amenity, label: 'Fibra Óptica', icon: Wifi, desc: 'Internet de alta velocidad' },
                  { key: 'aire_acondicionado' as Amenity, label: 'Aire Acondicionado', icon: Snowflake, desc: 'Ambiente climatizado' },
                  { key: 'estacionamiento' as Amenity, label: 'Estacionamiento', icon: Car, desc: 'Área de vehículos' },
                  { key: 'delivery' as Amenity, label: 'Servicio Delivery', icon: Bike, desc: 'Envíos a domicilio' },
                  { key: 'frente_al_mar' as Amenity, label: 'Frente al Mar', icon: Waves, desc: 'Vista a bahía/playa' },
                  { key: 'pet_friendly' as Amenity, label: 'Pet Friendly', icon: PawPrint, desc: 'Admite mascotas' }
                ].map((item) => {
                  const isActive = selectedAmenities.includes(item.key);
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={(e) => safeToggleAmenity(item.key, e)}
                      className={`touch-manipulation p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-20 active:scale-95 ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold ring-1 ring-emerald-500'
                          : 'bg-[#161920] hover:bg-[#1f242e] border-[#222630] text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold pointer-events-none flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <IconComp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item.label}</span>
                        </span>
                        {isActive && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                      </div>
                      <div className="text-[10px] text-slate-400 pointer-events-none">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 4: MÉTODOS DE PAGO ACEPTADOS */}
            <div className="bg-[#11141a] rounded-3xl border border-[#1e222b] p-5 sm:p-7 shadow-sm space-y-4">
              <h2 className="text-xs font-mono-tabular uppercase font-bold text-amber-400 tracking-wider flex items-center gap-2 border-b border-[#1e222b] pb-3">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>4. Formas de Pago Aceptadas en Caja (Toca para activar)</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: 'pago_movil' as PaymentMethod, label: 'Pago Móvil', icon: Smartphone },
                  { key: 'efectivo_usd' as PaymentMethod, label: 'Dólares Efectivo', icon: Banknote },
                  { key: 'punto_de_venta' as PaymentMethod, label: 'Punto de Venta', icon: CreditCard },
                  { key: 'zelle' as PaymentMethod, label: 'Zelle', icon: Landmark },
                  { key: 'binance' as PaymentMethod, label: 'Binance Pay', icon: Coins },
                ].map((pay) => {
                  const isActive = selectedPayments.includes(pay.key);
                  const IconComp = pay.icon;
                  return (
                    <button
                      key={pay.key}
                      type="button"
                      onClick={(e) => safeTogglePayment(pay.key, e)}
                      className={`touch-manipulation p-3 rounded-2xl text-xs font-bold text-center border transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-bold shadow-xs'
                          : 'bg-[#161920] hover:bg-[#1f242e] border-[#222630] text-slate-300'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 shrink-0 pointer-events-none" />
                      <span className="pointer-events-none">{pay.label}</span>
                      {isActive && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3] shrink-0 pointer-events-none" />}
                    </button>
                  );
                })}
              </div>

              {/* Opción Táctil: Modalidad Cashea */}
              <div 
                onClick={() => setAcceptsCashea(!acceptsCashea)}
                className={`touch-manipulation p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] select-none ${
                  acceptsCashea
                    ? 'bg-amber-400/15 border-amber-400 text-white font-bold ring-1 ring-amber-400 shadow-xs'
                    : 'bg-[#161920] border-[#222630] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    C
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-2 text-white">
                      <span>¿Acepta Modalidad Cashea? (Cuotas a Tasa Oficial BCV)</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black uppercase font-mono-tabular">
                        ALTA DEMANDA
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Activa la insignia amarilla de Cashea para que aparezca en el directorio de Cumaná.
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                  acceptsCashea ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-500'
                }`}>
                  {acceptsCashea && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>

            {/* SECCIÓN 5: FOTO, PLAN Y NOTAS DE REGISTRO */}
            <div className="bg-[#11141a] rounded-3xl border border-[#1e222b] p-5 sm:p-7 shadow-sm space-y-5">
              <h2 className="text-xs font-mono-tabular uppercase font-bold text-amber-400 tracking-wider flex items-center gap-2 border-b border-[#1e222b] pb-3">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>5. Foto del Local & Asignación de Plan</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                {/* Captura o Subida de Foto (Galería o Cámara) */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5 flex items-center justify-between">
                    <span>Foto de Fachada / Entrada</span>
                    <span className="text-[10px] text-amber-400 font-medium">Galería o Cámara</span>
                  </label>
                  
                  {/* Input 1: Galería del teléfono o tablet (abre selector de fotos/archivos sin forzar cámara) */}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {/* Input 2: Cámara directa de la tablet o teléfono (disparo en vivo) */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {photoPreview ? (
                    <div className="relative rounded-2xl overflow-hidden h-36 border border-[#222630] group bg-black/40">
                      <img src={photoPreview} alt="Vista previa" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-xl bg-[#1e222b] hover:bg-[#282d38] text-white text-[11px] font-bold flex items-center gap-1 border border-[#2e3340] cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Galería</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-slate-950" />
                          <span>Cámara</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoPreview('')}
                          className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white cursor-pointer"
                          title="Quitar foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="sm:hidden absolute top-2 right-2 p-1.5 rounded-full bg-rose-600/90 text-white shadow-md cursor-pointer"
                        title="Quitar foto"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-[#222630] hover:border-amber-400/60 bg-[#161920] p-3 transition-all flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Botón 1: Subir desde Galería del Teléfono/Tablet */}
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="py-3 px-2 rounded-xl bg-[#1e222b] hover:bg-[#282d38] active:scale-95 border border-[#2e3340] text-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                        >
                          <ImageIcon className="w-5 h-5 text-amber-400" />
                          <span className="text-[11px] font-bold">Galería</span>
                          <span className="text-[9px] text-slate-400">Fotos del celular</span>
                        </button>

                        {/* Botón 2: Tomar Foto con la Cámara */}
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="py-3 px-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shadow-sm font-bold"
                        >
                          <Camera className="w-5 h-5 text-slate-950" />
                          <span className="text-[11px] font-bold">Cámara</span>
                          <span className="text-[9px] text-slate-900/80">Tomar foto en vivo</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center">
                        Elige de la galería del teléfono o dispara con la cámara
                      </p>
                    </div>
                  )}
                </div>

                {/* Plan Inicial */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                    Plan Acordado con el Negocio
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'free' as BusinessTier, label: 'Plan Comunidad', desc: 'Ficha Básica ($0)' },
                      { key: 'pro' as BusinessTier, label: 'Destacado Pro', desc: 'Verificado ($19/mes)' },
                      { key: 'vip' as BusinessTier, label: 'Plan Destacado', desc: 'Video-Ruta 60s ($39/mes)' }
                    ].map((p) => {
                      const isSelected = tier === p.key;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={(e) => handleSelectTier(p.key, e)}
                          className={`touch-manipulation w-full p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all active:scale-95 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-400/15 text-white font-bold ring-1 ring-amber-400'
                              : 'bg-[#161920] border-[#222630] text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 pointer-events-none">
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                            <span className="text-xs font-bold">{p.label}</span>
                          </div>
                          <span className="text-[10px] text-amber-400 font-mono-tabular pointer-events-none font-bold">{p.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Estado y Notas de Campo */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#161920] border border-[#222630] rounded-xl text-xs font-bold text-white mb-3 focus:outline-none focus:border-amber-400"
                  >
                    <option value="active">● Activo (Visible inmediatamente)</option>
                    <option value="pending">● En Revisión (Pendiente)</option>
                  </select>

                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Notas y Observaciones del Local
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Propietario disponible en las tardes, horario especial, sucursal adicional..."
                    className="w-full px-3 py-2 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-medium placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* BOTÓN PRINCIPAL TÁCTIL: GUARDAR LOCAL EN TABLET */}
            <div className="pt-2">
              <button
                type="submit"
                className="touch-manipulation w-full h-14 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Save className="w-5 h-5 stroke-[2.5] shrink-0" />
                <span>GUARDAR LOCAL EN LA TABLET (REGISTRAR)</span>
              </button>
              <p className="text-center text-[10px] text-slate-500 font-semibold mt-2">
                Se guardará al instante en la memoria de la tablet. Si tienes señal, se subirá automáticamente a la web.
              </p>
            </div>
          </form>
        )}

        {/* VISTA 2: BANDEJA DE LOCALES CENSADOS EN LA TABLET */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-[#11141a] rounded-2xl border border-[#1e222b] p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white">
                    Historial de Locales en esta Tablet
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {offlineQueue.length} comercios guardados en la memoria local.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchHistoryTerm}
                      onChange={(e) => setSearchHistoryTerm(e.target.value)}
                      placeholder="Buscar en la tablet..."
                      className="pl-9 pr-3 py-2 bg-[#161920] border border-[#222630] rounded-xl text-xs text-white font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={exportBackupJSON}
                    className="p-2.5 rounded-xl bg-[#161920] border border-[#222630] text-slate-300 hover:text-white hover:border-amber-400/40 transition-all cursor-pointer"
                    title="Exportar respaldo JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {offlineQueue.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Tablet className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-400">Aún no has registrado locales en esta tablet.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('form')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md cursor-pointer transition-all"
                  >
                    Comenzar Registro de Locales
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {offlineQueue
                    .filter(item => !searchHistoryTerm || item.business.name.toLowerCase().includes(searchHistoryTerm.toLowerCase()))
                    .map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#161920] border border-[#222630] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.business.heroImage}
                            alt={item.business.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-800"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white">
                                {item.business.name}
                              </h4>
                              {item.business.isVerified && <VerifiedBadge size="sm" />}
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                                item.synced 
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                              }`}>
                                {item.synced ? 'Subido a la Web' : 'Guardado en Tablet'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                              {(item.business.categories && item.business.categories.length > 0 ? item.business.categories : [item.business.category]).join(', ')} · {item.business.zone}
                            </p>
                            {item.notes && (
                              <p className="text-[11px] text-slate-400 italic mt-0.5">
                                Nota: &ldquo;{item.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {!item.synced && isOnline && (
                            <button
                              type="button"
                              onClick={() => {
                                addBusiness(item.business);
                                setOfflineQueue(prev => prev.map(q => q.id === item.id ? { ...q, synced: true } : q));
                                setSyncNotice(`✓ "${item.business.name}" subido con éxito.`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-sm cursor-pointer transition-all"
                            >
                              Subir ahora
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400 font-semibold font-mono-tabular">
                            {isMounted ? new Date(item.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* MODAL DE INSTALACIÓN EN LA TABLET */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all">
          <div className="bg-[#11141a] border border-[#1e222b] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setIsInstallModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#161920] cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-400/20 font-black">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Instalar en tu Tablet
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  Úsala como aplicación nativa a pantalla completa y sin lápiz ni papel.
                </p>
              </div>
            </div>

            {/* Si el navegador soporta instalación directa con prompt */}
            {installPrompt && (
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-center space-y-2">
                <p className="text-xs font-black text-white">
                  ¡Tu navegador permite instalación con 1 toque!
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      installPrompt.prompt();
                      const choice = await installPrompt.userChoice;
                      if (choice.outcome === 'accepted') {
                        setIsInstallModalOpen(false);
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Instalar Ahora Directamente</span>
                </button>
              </div>
            )}

            {/* Instrucciones según el sistema */}
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#161920] border border-[#222630] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-white">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">🍎</span>
                  <span>En iPad / iOS (Safari):</span>
                </div>
                <ol className="list-decimal list-inside text-slate-400 font-semibold space-y-1 pl-1">
                  <li>Toca el botón <span className="font-black text-white">Compartir</span> (<Share2 className="inline w-3.5 h-3.5 text-blue-400 mx-0.5" />) en la barra superior.</li>
                  <li>Desliza y selecciona <span className="font-black text-white">&ldquo;Agregar al inicio&rdquo;</span> (o Add to Home Screen).</li>
                  <li>Toca <span className="font-black text-amber-400">Agregar</span> en la esquina superior derecha.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#161920] border border-[#222630] space-y-1.5">
                <div className="flex items-center gap-2 font-black text-white">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">🤖</span>
                  <span>En Tablets Android (Chrome / Edge / Firefox):</span>
                </div>
                <ol className="list-decimal list-inside text-slate-400 font-semibold space-y-1 pl-1">
                  <li>Toca el menú de tres puntos <span className="font-black text-white">(⋮)</span> en la barra superior derecha.</li>
                  <li>Toca <span className="font-black text-white">&ldquo;Instalar aplicación&rdquo;</span> o &ldquo;Agregar a la pantalla principal&rdquo;.</li>
                  <li>Confirma y el icono aparecerá en tu escritorio de la tablet.</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsInstallModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#161920] hover:bg-[#1e222b] border border-[#222630] text-white text-xs font-black cursor-pointer transition-all"
              >
                Entendido / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
