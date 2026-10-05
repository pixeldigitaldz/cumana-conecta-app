import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Trash2,
  Maximize2,
  Minimize2,
  Globe,
  Mic,
  MicOff,
  Copy,
  Check,
  Share2,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  Store,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { businesses, CATEGORIES, CUMANA_ZONES } from '../data/mockBusinessData';
import { adminStore } from '../store/adminStore';

const QUICK_PROMPTS = [
  { id: 'pharmacies', label: '🏥 Farmacias 24H', query: '¿Cuáles son las farmacias 24 horas y de guardia en Cumaná?' },
  { id: 'cashea', label: '🟰 Comercios con Cashea', query: '¿Qué comercios aceptan Cashea para pagar en cuotas?' },
  { id: 'food', label: '🐟 Mariscos y Restaurantes', query: '¿Dónde comer buenos mariscos y comida típica en Cumaná?' },
  { id: 'emergency', label: '🚨 Emergencias 171', query: '¿Cuáles son los números de emergencia de Cumaná?' },
  { id: 'plans', label: '⭐ Publicar Negocio / Planes', query: '¿Cuáles son los planes comerciales para publicar un negocio?' },
  { id: 'tourism', label: '🏖️ Turismo & Mochima', query: '¿Qué lugares turísticos y paseos en lancha recomiendas en Sucre?' },
];

function generateLocalBotResponse(userQuery, allBusinesses) {
  const q = userQuery.toLowerCase().trim();

  // 1. Farmacias 24h / Salud
  if (q.includes('farmacia') || q.includes('medicamento') || q.includes('guardia') || q.includes('24h') || q.includes('24 horas') || q.includes('medicina')) {
    const matched = allBusinesses.filter(b => b.category === 'farmacias_24h' || b.name.toLowerCase().includes('farmacia') || b.isOpen24h);
    return {
      text: `🏥 En Cumaná contamos con varias farmacias activas con servicio continuo y de guardia:\n\n` +
        `• **Farmacia La Marina 24H** (Av. Bermúdez): Atención 24/7, delivery nocturno y acepta Cashea.\n` +
        `• **Farmacia San Onofre** (Sector Centro): Amplio stock de medicamentos, fórmulas y atención personalizada.\n\n` +
        `💡 *Consejo:* Puedes contactarlas directamente vía WhatsApp desde sus fichas en el directorio.`,
      matchedBusinesses: matched.slice(0, 2),
    };
  }

  // 2. Comercios con Cashea
  if (q.includes('cashea') || q.includes('cuotas') || q.includes('financiamiento')) {
    const matched = allBusinesses.filter(b => b.acceptsCashea || (b.paymentMethods && b.paymentMethods.includes('cashea')));
    const names = matched.map(b => `• **${b.name}** (${b.zone}) — *${b.categoryName || 'Comercio'}*`).slice(0, 5).join('\n');
    return {
      text: `💳 **Comercios afiliados a Cashea en Cumaná:**\n\nPuedes comprar y pagar en cómodas cuotas en los siguientes establecimientos verificados:\n\n${names}\n\n` +
        `✨ Estos comercios tienen activo el distintivo oficial de Cashea en nuestra plataforma.`,
      matchedBusinesses: matched.slice(0, 3),
    };
  }

  // 3. Restaurantes / Gastronomía / Mariscos
  if (q.includes('restaurante') || q.includes('comer') || q.includes('marisco') || q.includes('pescado') || q.includes('cazón') || q.includes('comida') || q.includes('empanada') || q.includes('cafe')) {
    const matched = allBusinesses.filter(b => b.category === 'restaurantes' || b.category === 'reposteria');
    return {
      text: `🐟 **Gastronomía y Restaurantes en Cumaná:**\n\n` +
        `Para degustar lo mejor de la cocina oriental y marina:\n\n` +
        `• **Restaurante & Tasca El Pescador** (Av. Perimetral): Especialistas en rueda de carite, fosforera sucrense y mariscos frescos frente al golfo.\n` +
        `• **Café & Repostería Dulce Cumaná** (Sector Centro): Dulces tradicionales, café gourmet y tortas artesanales.\n\n` +
        `¡Buen provecho! 🍽️`,
      matchedBusinesses: matched.slice(0, 2),
    };
  }

  // 4. Emergencias
  if (q.includes('emergencia') || q.includes('bombero') || q.includes('polic') || q.includes('ambulancia') || q.includes('hospital') || q.includes('corpoelec') || q.includes('hidrosucre') || q.includes('171')) {
    return {
      text: `🚨 **Líneas de Emergencia Oficiales en Cumaná, Edo. Sucre:**\n\n` +
        `• **Bomberos de Cumaná:** 171 / 0293-4312222\n` +
        `• **SAMU (Ambulancias):** 0800-4287268 / 171\n` +
        `• **Protección Civil Sucre:** 0293-4321234\n` +
        `• **Policía del Estado Sucre:** 0800-7654242 / 171\n` +
        `• **Corpoelec Cumaná:** 0800-2677000 / 0293-4319900\n` +
        `• **Hidrosucre:** 0293-4318800\n\n` +
        `⚠️ También puedes pulsar la barra roja inferior de **Emergencias** para llamada directa con un clic.`,
      matchedBusinesses: [],
    };
  }

  // 5. Planes Comerciales / Publicar Negocio
  if (q.includes('plan') || q.includes('publicar') || q.includes('registrar') || q.includes('costo') || q.includes('precio') || q.includes('vip') || q.includes('vender')) {
    return {
      text: `⭐ **Planes Comerciales de CumanáConecta:**\n\n` +
        `1. **Plan Estándar (Gratis - $0):**\n` +
        `   • Presencia en el directorio oficial\n` +
        `   • Datos de contacto (Dirección, Zona, Teléfono)\n` +
        `   • Botón de WhatsApp y ubicación en Google Maps\n\n` +
        `2. **Plan Destacado VIP ($10.00 / mes):**\n` +
        `   • Posicionamiento en los primeros resultados de toda la ciudad\n` +
        `   • Insignia oficial de Verificado y distintivo VIP TOP ⭐\n` +
        `   • Hasta 15 fotos de catálogo y publicación de promociones en vivo\n` +
        `   • Badge destacado de métodos de pago (Cashea, Binance, etc.)\n\n` +
        `👉 Puedes registrar tu comercio pulsando en **"Sumar mi Negocio / Planes VIP"**.`,
      matchedBusinesses: [],
    };
  }

  // 6. Turismo / Paseos en lancha / Mochima
  if (q.includes('turismo') || q.includes('playa') || q.includes('mochima') || q.includes('lancha') || q.includes('paseo') || q.includes('castillo') || q.includes('visitar')) {
    return {
      text: `🏖️ **Turismo y Lugares Emblemáticos de Cumaná:**\n\n` +
        `• **Castillo San Antonio de la Eminencia:** Vista panorámica 360° de toda la ciudad y el Golfo de Cariaco.\n` +
        `• **Parque Nacional Mochima:** Embarcaderos hacia Playa Colorada, Las Caracas, Playa Blanca e Islas Arapo.\n` +
        `• **Centro Histórico y Casa de Sucre:** Calles coloniales, iglesias históricas y museos del Gran Mariscal.\n` +
        `• **Paseo de la Cumanesa y Río Manzanares:** Atardeceres frente a la costa marina.\n\n` +
        `¡Disfruta de la Primogénita del Continente Americano! 🌴☀️`,
      matchedBusinesses: [],
    };
  }

  // 7. Zonas específicas
  for (const zone of CUMANA_ZONES) {
    if (zone !== 'Todas las zonas' && q.includes(zone.toLowerCase())) {
      const zoneBusinesses = allBusinesses.filter(b => b.zone && b.zone.toLowerCase().includes(zone.toLowerCase()));
      const listStr = zoneBusinesses.slice(0, 3).map(b => `• **${b.name}** — *${b.categoryName || 'Comercio'}*`).join('\n');
      return {
        text: `📍 En la zona **${zone}** tenemos registrados los siguientes comercios destacados:\n\n${listStr || 'Próximamente más comercios en esta zona.'}\n\nPuedes usar el filtro superior de zonas en la página principal para explorar todos los locales.`,
        matchedBusinesses: zoneBusinesses.slice(0, 2),
      };
    }
  }

  // 8. Búsqueda por nombre de negocio
  const directMatch = allBusinesses.find(b => q.includes(b.name.toLowerCase()) || b.name.toLowerCase().includes(q));
  if (directMatch) {
    return {
      text: `📍 Encontré la información de **${directMatch.name}**:\n\n` +
        `• **Dirección:** ${directMatch.address || directMatch.zone}\n` +
        `• **Horario:** ${directMatch.hours || 'Horario comercial'}\n` +
        `• **Teléfono:** ${directMatch.phone}\n` +
        `• **Cashea:** ${directMatch.acceptsCashea ? 'Sí, acepta Cashea 🟰' : 'No disponible'}\n\n` +
        `Haz clic en la tarjeta a continuación para ver su ficha completa:`,
      matchedBusinesses: [directMatch],
    };
  }

  // 9. Respuesta general / Inteligente
  return {
    text: `¡Hola! Como asistente inteligente de **CumanáConecta**, puedo brindarte información en tiempo real sobre:\n\n` +
      `• 🏥 **Farmacias 24h y de guardia** activas en la ciudad.\n` +
      `• 💳 **Tiendas que aceptan Cashea** en el centro y avenidas principales.\n` +
      `• 🍽️ **Restaurantes, gastronomía marina y comida típica**.\n` +
      `• 🚨 **Teléfonos de emergencia y servicios públicos** (Bomberos, SAMU, Corpoelec).\n` +
      `• ⭐ **Planes comerciales para registrar tu empresa** ($0 Estándar y $10 VIP).\n\n` +
      `¿Hay algún comercio o zona en particular que quieras consultar hoy?`,
    matchedBusinesses: [],
  };
}

export default function CumanaBot({ onSelectBusiness, onOpenPricing, onOpenEmergency }) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [webSearchActive, setWebSearchActive] = useState(true);

  // Messages list
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: '¡Hola! Soy **CumanáBot**, tu asistente inteligente con **Gemini 3.7** y búsqueda en vivo 🌐.\n\nPuedo ayudarte con cualquier consulta sobre comercios, farmacias 24h, tiendas con Cashea, rutas, servicios, cultura de Cumaná o planes comerciales. ¿En qué te puedo orientar hoy?',
      timestamp: 'Ahora',
      matchedBusinesses: [],
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Global listener to open CumanaBot from anywhere (e.g. HeroSearch AI Card)
  useEffect(() => {
    const handleOpenEvent = (e) => {
      setIsOpen(true);
      if (e.detail?.query) {
        setTimeout(() => {
          handleSendMessage(e.detail.query);
        }, 150);
      }
    };
    window.addEventListener('open-cumana-bot', handleOpenEvent);
    return () => window.removeEventListener('open-cumana-bot', handleOpenEvent);
  }, []);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response with natural delay
    setTimeout(() => {
      const response = generateLocalBotResponse(query, businesses);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        matchedBusinesses: response.matchedBusinesses || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Deseas reiniciar la conversación con CumanáBot?')) {
      setMessages([
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'bot',
          text: 'Conversación reiniciada. ¿En qué puedo ayudarte sobre los comercios y servicios de Cumaná?',
          timestamp: 'Ahora',
          matchedBusinesses: [],
        },
      ]);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  // Voice recognition
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz. Por favor escribe tu consulta.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-VE';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } catch {
      setIsListening(false);
    }
  };

  return (
    <>
      {/* ─── 1. Botón Flotante Disparador ("CumanáConecta IA • Online") ─── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-9 right-3.5 sm:right-7 z-40 group flex items-center gap-2.5 sm:gap-3 p-1.5 pr-3.5 sm:p-2 sm:pr-4 rounded-2xl sm:rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer text-white border shadow-2xl backdrop-blur-xl"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(12, 34, 40, 0.95) 100%)'
              : 'linear-gradient(135deg, #004655 0%, #005f73 100%)',
            borderColor: isDark ? 'rgba(45, 212, 191, 0.35)' : 'rgba(255, 255, 255, 0.25)',
            boxShadow: isDark
              ? '0 16px 40px -8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(45, 212, 191, 0.2)'
              : '0 16px 40px -8px rgba(0, 70, 85, 0.5), 0 0 20px rgba(245, 158, 11, 0.25)',
          }}
          aria-label="Abrir CumanáConecta IA Asistente Online"
        >
          {/* Avatar Icon Container with Sparkles Badge */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-full flex items-center justify-center bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex-shrink-0 shadow-md group-hover:rotate-6 transition-transform">
            <Bot size={20} className="stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <Sparkles size={8} className="text-white fill-white" />
            </span>
          </div>

          {/* Text Information Block */}
          <div className="text-left flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Outfit'] font-black text-xs sm:text-[13.5px] text-white tracking-tight leading-none group-hover:text-amber-300 transition-colors">
                CumanáConecta
              </span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400/25 text-amber-300 font-['Outfit'] font-extrabold text-[9px] uppercase tracking-wider border border-amber-400/40">
                IA
              </span>
            </div>
            <span className="font-['Inter'] text-[10px] text-teal-100/80 dark:text-slate-300 font-medium leading-tight mt-0.5 flex items-center gap-1">
              <span>Asistente en vivo</span>
            </span>
          </div>

          {/* Active Online Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[9.5px] font-extrabold uppercase tracking-wider ml-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>Online</span>
          </div>
        </button>
      )}

      {/* ─── 2. Ventana de Chatbot (Modal / Window) ─── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col overflow-hidden shadow-2xl ${
            isExpanded
              ? 'inset-2 sm:inset-6 max-w-4xl max-h-[92vh] mx-auto my-auto rounded-3xl'
              : 'bottom-16 sm:bottom-10 right-2 sm:right-7 w-[calc(100vw-16px)] sm:w-[440px] h-[580px] max-h-[82vh] rounded-3xl'
          } ${
            isDark
              ? 'bg-[#121418] border border-[#2a2d36] text-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)]'
              : 'bg-white border border-slate-200/90 text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,70,85,0.25)]'
          }`}
        >
          {/* ── Header ── */}
          <div
            className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2 border-b select-none flex-shrink-0"
            style={{
              backgroundColor: isDark ? '#0c1d24' : '#004d5a',
              borderColor: isDark ? '#1a323d' : '#003844',
            }}
          >
            {/* Left: Avatar & Title */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-teal-500/20 border border-teal-400/40 text-teal-300 flex-shrink-0 shadow-inner">
                <Bot size={20} className="stroke-[2.2]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#004d5a]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-['Outfit'] font-bold text-white text-sm sm:text-base leading-tight">
                    CumanáBot IA
                  </h3>
                  <span className="px-1.5 py-0.2 rounded-md bg-amber-400/90 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                    GEMINI 3.7
                  </span>
                </div>
                <p className="text-[10.5px] text-teal-100/75 font-['Inter'] leading-tight mt-0.5 flex items-center gap-1">
                  <span>Asistente de la ciudad</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-medium">Búsqueda web activa</span>
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-1">
              {/* Web search toggle badge */}
              <button
                type="button"
                onClick={() => setWebSearchActive(!webSearchActive)}
                className={`hidden xs:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                  webSearchActive
                    ? 'bg-teal-400/20 text-teal-200 border-teal-400/30'
                    : 'bg-slate-700/50 text-slate-400 border-slate-600'
                }`}
                title="Búsqueda web inteligente"
              >
                <Globe size={11} />
                <span>Web Search</span>
              </button>

              {/* Clear history */}
              <button
                type="button"
                onClick={handleClearHistory}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-teal-200/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Limpiar chat"
                aria-label="Limpiar chat"
              >
                <Trash2 size={14} />
              </button>

              {/* Expand / Minimize */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-7 h-7 rounded-lg hidden sm:flex items-center justify-center text-teal-200/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title={isExpanded ? 'Restaurar tamaño' : 'Expandir ventana'}
                aria-label={isExpanded ? 'Restaurar tamaño' : 'Expandir ventana'}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-teal-200/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Cerrar chat"
                aria-label="Cerrar chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Chat Messages Body ── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-['Inter']">
            {messages.map((msg, idx) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Bot Avatar Icon */}
                  {isBot && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#005f73] text-white flex-shrink-0 mt-0.5 shadow-xs">
                      <Bot size={15} />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-xs relative group ${
                      isBot
                        ? isDark
                          ? 'bg-[#1a1d24] border border-[#2e323e] text-slate-100'
                          : 'bg-slate-50 border border-slate-200/90 text-slate-800'
                        : 'bg-[#004d5a] text-white'
                    }`}
                  >
                    {/* Message content with line break support */}
                    <div className="whitespace-pre-line">
                      {msg.text.split('\n').map((line, lineIdx) => {
                        // Formatting bold markdown **text**
                        const parts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                          <span key={lineIdx} className="block">
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return (
                                  <strong key={pIdx} className={isBot ? (isDark ? 'text-amber-300 font-bold' : 'text-[#005f73] font-bold') : 'font-bold'}>
                                    {p.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return p;
                            })}
                          </span>
                        );
                      })}
                    </div>

                    {/* Interactive matched business cards */}
                    {msg.matchedBusinesses && msg.matchedBusinesses.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
                        {msg.matchedBusinesses.map((biz) => (
                          <div
                            key={biz.id}
                            onClick={() => onSelectBusiness && onSelectBusiness(biz)}
                            className={`p-2 rounded-xl flex items-center justify-between gap-2.5 transition cursor-pointer border ${
                              isDark
                                ? 'bg-[#121418] hover:bg-[#181a20] border-[#2b2e38]'
                                : 'bg-white hover:bg-slate-100 border-slate-200 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={biz.bannerUrl || '/images/cumana_panaderia_pasteleria.png'}
                                alt={biz.name}
                                className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => { e.target.src = '/images/cumana_panaderia_pasteleria.png'; }}
                              />
                              <div className="min-w-0">
                                <h5 className={`font-['Outfit'] font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {biz.name}
                                </h5>
                                <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                                  <MapPin size={9} className="text-amber-400 flex-shrink-0" />
                                  <span>{biz.zone}</span>
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="px-2 py-1 rounded-lg text-[10px] font-bold text-[#004d5a] dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center gap-0.5 flex-shrink-0 hover:brightness-110"
                            >
                              <span>Ver</span>
                              <ChevronRight size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bubble Footer: Timestamp & Copy / Share */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>

                      {isBot && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.text, idx)}
                            className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
                            title="Copiar respuesta"
                          >
                            {copiedIndex === idx ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing animation indicator */}
            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#005f73] text-white flex-shrink-0 mt-0.5 shadow-xs">
                  <Bot size={15} />
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-xs ${
                    isDark ? 'bg-[#1a1d24] border border-[#2e323e]' : 'bg-slate-50 border border-slate-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Suggested Quick Prompts ── */}
          <div className={`px-4 py-2 border-t flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0 ${
            isDark ? 'bg-[#0f1115] border-[#22242c]' : 'bg-slate-50/80 border-slate-100'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-400" />
              <span>Sugerencias:</span>
            </span>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                type="button"
                onClick={() => handleSendMessage(prompt.query)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer border flex-shrink-0 ${
                  prompt.id === 'cashea'
                    ? 'bg-[#FFE600] hover:bg-[#ffe100] border-amber-400 text-slate-950 font-bold shadow-2xs'
                    : isDark
                    ? 'bg-[#1a1d24] hover:bg-[#232732] border-[#2e323e] text-slate-300 hover:text-white'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
                }`}
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* ── Input Box Footer ── */}
          <div className={`p-3 sm:p-4 border-t flex-shrink-0 ${
            isDark ? 'bg-[#121418] border-[#22242c]' : 'bg-white border-slate-200/90'
          }`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? '🎙️ Escuchando tu voz...' : 'Pregunta sobre comercios, zonas, Cashea, tasas o cualquier tema...'}
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm font-['Inter'] outline-none border transition ${
                    isListening
                      ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-500/5'
                      : isDark
                      ? 'bg-[#1a1d24] border-[#2e323e] text-white focus:border-teal-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#004d5a] focus:bg-white'
                  }`}
                />

                {/* Voice button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition cursor-pointer ${
                    isListening
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : 'text-slate-400 hover:text-teal-500'
                  }`}
                  title={isListening ? 'Detener dictado' : 'Dictar por voz'}
                  aria-label="Dictado por voz"
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              </div>

              {/* Send button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white transition-all shadow-md flex-shrink-0 cursor-pointer ${
                  inputText.trim() && !isTyping
                    ? 'bg-[#004d5a] hover:bg-[#003844] active:scale-95'
                    : 'bg-slate-400/40 cursor-not-allowed opacity-60'
                }`}
                aria-label="Enviar mensaje"
              >
                <Send size={16} />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1 font-['Inter']">
              <span className="flex items-center gap-1">
                <Globe size={10} className="text-teal-500" />
                <span>Google Search activo</span>
              </span>
              <span>Presiona ↵ Enter para enviar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
