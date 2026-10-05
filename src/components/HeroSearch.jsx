import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Search,
  Mic,
  X,
  MapPin,
  ChevronDown,
  Sparkles,
  Tag,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { CUMANA_ZONES } from '../data/mockBusinessData';
import { useTheme } from '../context/ThemeContext';
import { CasheaIcon } from './CasheaLogo';

const SEARCH_SUGGESTIONS = [
  { id: 'pharmacies', icon: '💊', title: 'Farmacias de turno 24 horas', category: 'Salud', query: 'farmacia' },
  { id: 'cashea', icon: '💳', title: 'Tiendas que aceptan Cashea en cuotas', category: 'Finanzas', filterCashea: true, query: 'cashea' },
  { id: 'cazon', icon: '🍔', title: 'Empanadas de cazón y comida típica', category: 'Gastronomía', query: 'cazon' },
  { id: 'talleres', icon: '🚗', title: 'Talleres mecánicos y repuestos', category: 'Automotriz', query: 'taller' },
  { id: 'salud', icon: '🏥', title: 'Clínicas, laboratorios y médicos', category: 'Salud', query: 'salud' },
  { id: 'reposteria', icon: '☕', title: 'Cafeterías y repostería artesanal', category: 'Comida', query: 'reposteria' },
  { id: 'ferreterias', icon: '🛠️', title: 'Ferreterías y materiales de construcción', category: 'Servicios', query: 'ferreteria' },
];

const QUICK_ZONES = [
  'Sector Centro',
  'Av. Bermúdez',
  'Los Chaimas',
  'El Peñón',
  'Av. Perimetral',
  'Cantarrana',
];

/**
 * Genera sutiles tonos armónicos con la Web Audio API nativa
 */
const playAudioCue = (type = 'start') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.09);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.24);
    } else if (type === 'error') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.16);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch {}
};

/**
 * Normaliza y procesa comandos de voz comunes en español venezolano
 */
const parseVoiceCommand = (rawText) => {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^(buscar|busca|buscame|búscame|quiero|necesito|muéstrame|muestrame|dónde hay|donde hay|encuentra|ver)\s+(un|una|unos|unas|el|la|los|las)?\s*/i, '');

  let detectedZone = null;
  let detectedCashea = false;
  let detectedOpenNow = false;

  if (/cashea|en cuotas|a crédito/i.test(cleaned)) {
    detectedCashea = true;
  }
  if (/abierto|24 horas|24h|de guardia/i.test(cleaned)) {
    detectedOpenNow = true;
  }

  const zoneMap = [
    { pattern: /los chaimas|chaimas/i, zone: 'Los Chaimas' },
    { pattern: /cantarrana/i, zone: 'Cantarrana' },
    { pattern: /el pe[nñ][oó]n|pe[nñ][oó]n/i, zone: 'El Peñón' },
    { pattern: /av\.?\s*berm[uú]dez|berm[uú]dez/i, zone: 'Av. Bermúdez' },
    { pattern: /av\.?\s*universidad|la universidad/i, zone: 'Av. Universidad' },
    { pattern: /hipergaler[ií]as|hiper galer[ií]as/i, zone: 'CC Hipergalerías' },
    { pattern: /centro hist[oó]rico/i, zone: 'Centro Histórico' },
    { pattern: /centro|el centro|sector centro/i, zone: 'Sector Centro' },
    { pattern: /av\.?\s*perimetral|perimetral/i, zone: 'Av. Perimetral' },
    { pattern: /andr[eé]s eloy blanco|andr[eé]s eloy/i, zone: 'Av. Andrés Eloy Blanco' },
  ];

  for (const item of zoneMap) {
    if (item.pattern.test(cleaned)) {
      detectedZone = item.zone;
      cleaned = cleaned.replace(new RegExp(`\\s*(en|por|cerca de)\\s+${item.pattern.source}`, 'i'), '');
      break;
    }
  }

  return {
    query: cleaned.trim(),
    zone: detectedZone,
    cashea: detectedCashea,
    openNow: detectedOpenNow,
  };
};

export default function HeroSearch({
  query = '',
  setQuery,
  activeZone = 'Todas las zonas',
  setActiveZone,
  filterOpenNow = false,
  setFilterOpenNow,
  filterCashea = false,
  setFilterCashea,
  filterDiscount = false,
  setFilterDiscount,
  filteredCount = 0,
  totalBusinesses = 0,
  onSearchSubmit,
}) {
  const { isDark } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState(null);
  const [speechSuccess, setSpeechSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isSpeechSupported] = useState(() => {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  });

  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Detener reconocimiento de voz al desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Iniciar reconocimiento por voz
  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError({
        type: 'unsupported',
        message: 'Tu navegador no soporta búsqueda por voz. Te recomendamos usar Google Chrome, Edge o Safari.',
      });
      return;
    }

    setSpeechError(null);
    setSpeechSuccess(false);
    setInterimTranscript('');
    setIsListening(true);
    playAudioCue('start');

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'es-VE';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            currentInterim += transcriptPart;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          const parsed = parseVoiceCommand(finalTranscript);
          
          if (setQuery) {
            setQuery(parsed.query || finalTranscript.trim());
          }
          if (parsed.zone && setActiveZone) {
            setActiveZone(parsed.zone);
          }
          if (parsed.cashea && setFilterCashea) {
            setFilterCashea(true);
          }
          if (parsed.openNow && setFilterOpenNow) {
            setFilterOpenNow(true);
          }

          setInterimTranscript(finalTranscript);
          setSpeechSuccess(true);
          setIsListening(false);
          setIsDropdownOpen(false);
          playAudioCue('success');

          if (onSearchSubmit) {
            onSearchSubmit(parsed.query || finalTranscript);
          }
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        playAudioCue('error');

        let message = 'No pudimos reconocer el audio. Intenta hablar nuevamente.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          message = 'El acceso al micrófono fue denegado. Permite el micrófono en tu navegador.';
        } else if (event.error === 'no-speech') {
          message = 'No se detectó voz. Haz clic en el micrófono e intenta hablar más cerca.';
        } else if (event.error === 'network') {
          message = 'Error de red con el servicio de voz. Revisa tu conexión a internet.';
        }

        setSpeechError({ type: event.error, message });
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => {
          setSpeechSuccess(false);
        }, 3500);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechError({
        type: 'start_failed',
        message: 'No fue posible iniciar el micrófono. Revisa los permisos de tu navegador.',
      });
    }
  }, [setQuery, setActiveZone, setFilterCashea, setFilterOpenNow, onSearchSubmit]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  const handleMicButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleOpenAIChat = () => {
    setIsDropdownOpen(false);
    window.dispatchEvent(
      new CustomEvent('open-cumana-bot', {
        detail: { query: query.trim() || '¿Qué comercios y servicios me recomiendas en Cumaná?' },
      })
    );
  };

  const handleSelectSuggestion = (item) => {
    setIsDropdownOpen(false);
    if (item.query && setQuery) {
      setQuery(item.query);
    }
    if (item.filterCashea && setFilterCashea) {
      setFilterCashea(true);
    }
    setSpeechError(null);
    setSpeechSuccess(false);
    if (onSearchSubmit) {
      onSearchSubmit(item.query || item.title);
    }
  };

  const handleSelectZone = (zoneName) => {
    setIsDropdownOpen(false);
    if (setActiveZone) {
      setActiveZone(zoneName);
    }
    if (onSearchSubmit) {
      onSearchSubmit(zoneName);
    }
  };

  // Filtrado de sugerencias si el usuario escribe
  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return SEARCH_SUGGESTIONS;
    const q = query.toLowerCase();
    const matched = SEARCH_SUGGESTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.query.toLowerCase().includes(q)
    );
    return matched.length > 0 ? matched : SEARCH_SUGGESTIONS;
  }, [query]);

  return (
    <div
      ref={searchContainerRef}
      className={`rounded-3xl p-4 sm:p-6 border shadow-sm max-w-4xl mx-auto text-left space-y-3.5 sm:space-y-4 relative w-full transition-colors duration-300 z-40 ${
        isDark
          ? 'bg-[#18191d] border-[#282a32] shadow-2xl'
          : 'bg-white border-[#bfc8cc]'
      }`}
      aria-label="Formulario de búsqueda de comercios"
    >
      {/* ─── Fila 1 & 2: Inputs de Búsqueda y Selector de Zona ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 relative">
        {/* Buscador de Texto con Micrófono y Limpiar */}
        <div className="relative md:col-span-7">
          <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
            <Search size={19} className={isDark ? 'text-amber-400' : 'text-[#008b8b]'} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setQuery && setQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Ej: Farmacia 24h, Cazón, Cashea, Taller..."
            className={`w-full h-12 pl-11 pr-20 rounded-2xl text-xs sm:text-sm font-['Inter'] transition-colors outline-none ${
              isDark
                ? 'bg-[#121316] border border-[#2b2d35] text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:bg-[#15161a]'
                : 'bg-[#f7f9fb] border border-[#bfc8cc] text-slate-900 placeholder:text-slate-400 focus:border-[#006e70] focus:bg-white'
            }`}
            style={{
              borderColor: isListening ? '#f59e0b' : undefined,
              backgroundColor: isListening ? (isDark ? '#241e15' : '#f0fdfa') : undefined,
            }}
            aria-label="Buscar negocios en Cumaná por texto o voz"
          />

          {/* Botones a la derecha del input: Limpiar & Micrófono */}
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
            {query && !isListening && (
              <button
                type="button"
                onClick={() => {
                  setQuery && setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 transition cursor-pointer"
                aria-label="Limpiar búsqueda"
                title="Limpiar búsqueda"
              >
                <X size={15} />
              </button>
            )}

            {/* Botón de Micrófono */}
            <button
              type="button"
              onClick={handleMicButtonClick}
              className={`h-9 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-['Inter'] font-semibold transition-all cursor-pointer ${
                isListening
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md animate-pulse font-bold'
                  : isDark
                  ? 'bg-[#241e15] hover:bg-[#332918] text-[#f59e0b] border border-[#4a391c]'
                  : 'bg-teal-50/80 hover:bg-teal-100 text-[#005f73] border border-teal-200/70'
              }`}
              aria-label={isListening ? 'Detener grabación de voz' : 'Buscar por comando de voz'}
              title={
                isListening
                  ? 'Escuchando en Cumaná... Haz clic para detener'
                  : isSpeechSupported
                  ? 'Buscar con tu voz en Cumaná (Ej: "Farmacia de guardia")'
                  : 'Búsqueda por voz no disponible en este navegador'
              }
            >
              {isListening ? (
                <>
                  <Mic size={15} className="animate-bounce" />
                  <span className="text-[11px] font-bold">Escuchando...</span>
                </>
              ) : (
                <Mic size={16} className={isDark ? 'text-amber-400' : 'text-[#005f73]'} />
              )}
            </button>
          </div>

          {/* ─── Dropdown de Sugerencias y Tarjeta CumanáBot IA (Panel Flotante Superpuesto) ─── */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className={`absolute left-0 w-full sm:w-[540px] md:w-[620px] top-full mt-2.5 z-[9999] rounded-2xl p-3.5 sm:p-4 shadow-2xl border transition-all animate-fade-in max-h-[490px] overflow-y-auto ${
                isDark
                  ? 'bg-[#15171c] border-[#2d3039] text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)]'
                  : 'bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_rgba(0,70,85,0.3)] ring-1 ring-black/5'
              }`}
              style={{
                boxShadow: isDark
                  ? '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 168, 150, 0.2)'
                  : '0 25px 60px -10px rgba(0, 70, 85, 0.35), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* 1. Tarjeta Superior: Preguntar a CumanáBot IA */}
              <div
                onClick={handleOpenAIChat}
                className="rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all border shadow-xs"
                style={{
                  backgroundColor: isDark ? '#0f242b' : '#fef9ee',
                  borderColor: isDark ? 'rgba(20, 184, 166, 0.4)' : '#fde047',
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#006e70] text-white flex-shrink-0 shadow-sm">
                    <Sparkles size={20} className="fill-[#fcd34d] text-[#fcd34d]" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="font-['Outfit'] font-black text-xs sm:text-[14.5px] truncate leading-tight tracking-tight"
                      style={{ color: isDark ? '#5eead4' : '#003844' }}
                    >
                      {query.trim()
                        ? `Preguntar sobre "${query}" a CumanáBot IA`
                        : 'Preguntar a CumanáBot IA (con Búsqueda Web)'}
                    </h4>
                    <p
                      className="text-[11.5px] font-['Inter'] truncate mt-0.5 font-medium"
                      style={{ color: isDark ? '#94a3b8' : '#475569' }}
                    >
                      Respuestas instantáneas con Gemini 3.7 y Google Search en vivo
                    </p>
                  </div>
                </div>

                <span className="px-3.5 py-1.5 rounded-full bg-[#f59e0b] hover:bg-[#ea580c] text-slate-950 font-['Outfit'] font-black text-[11px] uppercase tracking-wider flex-shrink-0 shadow-xs">
                  IA Chat
                </span>
              </div>

              {/* 2. Cabecera de Sugerencias */}
              <div className="flex items-center justify-between px-1.5 pt-3.5 pb-1.5 text-[10.5px] font-bold tracking-wider font-['Inter']">
                <span className="text-slate-500 dark:text-slate-400 uppercase">
                  SUGERENCIAS DE BÚSQUEDA EN CUMANÁ
                </span>
                <span className="text-[#007074] dark:text-teal-400 uppercase font-black">
                  DIRECTORIO OFICIAL
                </span>
              </div>

              {/* 3. Lista de Sugerencias (Sin rayas divisorias, limpio y espaciado como en la maqueta) */}
              <div className="space-y-1 py-1 no-scrollbar">
                {filteredSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className={`w-full py-2 px-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer group ${
                      isDark
                        ? 'hover:bg-white/5 text-slate-200'
                        : 'hover:bg-slate-50/90 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base flex-shrink-0">{item.icon}</span>
                      <span className="font-['Inter'] text-xs sm:text-[13px] font-medium truncate group-hover:text-[#007074] dark:group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#f0f4f8] text-[#64748b] dark:bg-[#1e293b] dark:text-[#94a3b8] flex-shrink-0">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>

              {/* 4. Sección de Búsqueda por Sector o Zona */}
              <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-['Inter'] px-1.5 block">
                  BUSCAR POR SECTOR O ZONA:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 px-1">
                  {QUICK_ZONES.map((zone) => (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => handleSelectZone(zone)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-['Inter'] flex items-center gap-1.5 transition-all cursor-pointer border ${
                        activeZone === zone
                          ? 'bg-[#007074] text-white border-[#007074] shadow-2xs font-bold'
                          : isDark
                          ? 'bg-[#1a1e28] hover:bg-[#252b3a] text-slate-200 border-[#2d3448]'
                          : 'bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800 border-slate-200'
                      }`}
                    >
                      <span>📍</span>
                      <span>{zone}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Selector de Zona */}
        <div className="relative md:col-span-5">
          <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
            <MapPin size={18} className="text-[#D97706]" />
          </div>
          <select
            value={activeZone}
            onChange={(e) => setActiveZone && setActiveZone(e.target.value)}
            className={`w-full h-12 pl-11 pr-9 rounded-2xl text-xs sm:text-sm font-['Inter'] font-medium transition-colors outline-none appearance-none cursor-pointer ${
              isDark
                ? 'bg-[#121316] border border-[#2b2d35] text-slate-200 focus:border-amber-400 focus:bg-[#15161a]'
                : 'bg-[#f7f9fb] border border-[#bfc8cc] text-slate-800 focus:border-[#006e70] focus:bg-white'
            }`}
            aria-label="Seleccionar zona de Cumaná"
          >
            {CUMANA_ZONES.map((zone) => (
              <option key={zone} value={zone} className={isDark ? 'bg-[#18191d] text-slate-200' : 'bg-white text-slate-800'}>{zone}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* ─── Panel Interactivo de Escucha de Voz Activa ─── */}
      {isListening && (
        <div
          className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 animate-fade-in-up ${
            isDark
              ? 'bg-[#221f15] border-[#45371c] text-amber-200'
              : 'bg-[#f0fdfa] border-[#99f6e4] text-slate-800'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex items-end gap-1 h-5 sm:h-6 px-1.5 py-0.5 bg-black/20 rounded-md flex-shrink-0">
              <span className="w-1 bg-[#f59e0b] rounded-full animate-[soundwave_0.8s_ease-in-out_infinite]" style={{ height: '12px' }} />
              <span className="w-1 bg-[#fbbf24] rounded-full animate-[soundwave_0.6s_ease-in-out_infinite_0.1s]" style={{ height: '18px' }} />
              <span className="w-1 bg-[#f59e0b] rounded-full animate-[soundwave_1.0s_ease-in-out_infinite_0.2s]" style={{ height: '8px' }} />
              <span className="w-1 bg-[#fbbf24] rounded-full animate-[soundwave_0.7s_ease-in-out_infinite_0.15s]" style={{ height: '15px' }} />
              <span className="w-1 bg-[#f59e0b] rounded-full animate-[soundwave_0.9s_ease-in-out_infinite_0.25s]" style={{ height: '10px' }} />
            </div>

            <div className="min-w-0">
              <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-amber-300' : 'text-[#004655]'}`}>
                <span className="truncate">Habla ahora... escuchando</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-medium flex-shrink-0">es-VE</span>
              </div>
              <p className="text-[11px] sm:text-xs italic text-slate-400 mt-0.5 truncate max-w-[240px] sm:max-w-md">
                {interimTranscript ? `"${interimTranscript}"` : 'Ej: "Buscar farmacia en Los Chaimas"'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-amber-500/20">
            <button
              type="button"
              onClick={stopListening}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer transition shadow-xs text-center"
            >
              Listo / Buscar
            </button>
            <button
              type="button"
              onClick={() => {
                stopListening();
                setInterimTranscript('');
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 cursor-pointer transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ─── Feedback de Éxito al Reconocer la Voz ─── */}
      {speechSuccess && !isListening && (
        <div
          className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 animate-fade-in-up text-xs ${
            isDark
              ? 'bg-[#14231b] border-[#1d4330] text-emerald-300'
              : 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
            <span className="truncate">
              Búsqueda aplicada: <strong>&ldquo;{query}&rdquo;</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSpeechSuccess(false)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-bold cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Notificación de Error o Permiso de Micrófono ─── */}
      {speechError && (
        <div
          className={`p-3 rounded-2xl border flex items-start justify-between gap-2 animate-fade-in-up text-xs ${
            isDark
              ? 'bg-[#2a1417] border-[#4c1d24] text-rose-300'
              : 'bg-[#fff1f2] border-[#fecdd3] text-[#9f1239]'
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2 min-w-0">
            <AlertCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-medium">{speechError.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSpeechError(null)}
            className="text-rose-400 hover:text-rose-200 cursor-pointer p-1 font-bold"
            aria-label="Cerrar aviso"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Fila 3: Chips de Filtros Rápidos & Contador de Resultados ─── */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t transition-colors ${
        isDark ? 'border-[#252830]' : 'border-slate-100'
      }`}>
        {/* Chips de Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Abierto ahora */}
          <button
            type="button"
            onClick={() => setFilterOpenNow && setFilterOpenNow(!filterOpenNow)}
            className={`px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs font-['Inter'] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              filterOpenNow
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : isDark
                ? 'bg-[#14231b] text-emerald-400 border-[#1d4330] hover:bg-[#1b3025]'
                : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0] hover:bg-[#d1fae5]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Abierto Ahora</span>
          </button>

          {/* 2. Acepta Cashea */}
          <button
            type="button"
            onClick={() => setFilterCashea && setFilterCashea(!filterCashea)}
            className={`px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs font-['Inter'] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              filterCashea
                ? 'bg-[#FFE600] text-slate-950 border-amber-400 ring-2 ring-[#FFE600]/40 shadow-sm'
                : isDark
                ? 'bg-[#FFE600]/15 text-[#FFE600] border-[#FFE600]/40 hover:bg-[#FFE600]/25'
                : 'bg-[#FFE600]/30 text-slate-950 border-amber-300 hover:bg-[#FFE600]/50'
            }`}
          >
            <CasheaIcon className="w-4 h-4 object-contain flex-shrink-0" />
            <span>Acepta Cashea</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
              filterCashea
                ? 'bg-slate-950 text-[#FFE600]'
                : isDark
                ? 'bg-[#FFE600] text-slate-950'
                : 'bg-slate-950 text-[#FFE600]'
            }`}>
              Cuotas
            </span>
          </button>

          {/* 3. Con Ofertas */}
          <button
            type="button"
            onClick={() => setFilterDiscount && setFilterDiscount(!filterDiscount)}
            className={`px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs font-['Inter'] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              filterDiscount
                ? isDark
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-800 text-white border-slate-800'
                : isDark
                ? 'bg-[#1a1c22] text-slate-300 border-[#2d3038] hover:bg-[#22252e]'
                : 'bg-[#f1f5f9] text-[#334155] border-[#e2e8f0] hover:bg-slate-200/80'
            }`}
          >
            <Tag size={13} className={filterDiscount ? 'text-current' : 'text-slate-400'} />
            <span>Con Ofertas</span>
          </button>
        </div>

        {/* Contador de Lugares */}
        <div className={`text-center sm:text-right text-xs font-['Inter'] flex-shrink-0 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>
            Mostrando <strong className={`font-bold text-sm ${isDark ? 'text-amber-400' : 'text-[#004655]'}`}>{filteredCount}</strong> de {totalBusinesses} comercios
          </span>
        </div>
      </div>

    </div>
  );
}
