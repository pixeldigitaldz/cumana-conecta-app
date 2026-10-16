'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  X, 
  Copy, 
  Check, 
  Star, 
  Zap, 
  ChevronRight, 
  ArrowRight,
  Phone
} from 'lucide-react';
import { Business } from '@/types/business';
import { useAppData } from '@/lib/app-data-context';
import { VerifiedBadge } from '@/components/verified-badge';

/**
 * ICONO EXCLUSIVO CUMANÁBOT IA (SVG estilizado retro-futurista de alta gama)
 */
export function BotRobotIcon({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Antena con emisor brillante */}
      <circle cx="16" cy="4.5" r="2" fill="#00E5AA" />
      <path d="M16 6.5V9.5" stroke="#00E5AA" strokeWidth="2" strokeLinecap="round" />
      
      {/* Auriculares / Conectores laterales */}
      <rect x="2.5" y="14" width="3" height="7" rx="1.5" fill="#00E5AA" />
      <rect x="26.5" y="14" width="3" height="7" rx="1.5" fill="#00E5AA" />
      <path d="M5.5 17.5H6.5" stroke="#00E5AA" strokeWidth="2" strokeLinecap="round" />
      <path d="M25.5 17.5H26.5" stroke="#00E5AA" strokeWidth="2" strokeLinecap="round" />

      {/* Casco / Cabeza estilizada */}
      <rect x="5.5" y="9.5" width="21" height="17" rx="5" fill="#082A2E" stroke="#00E5AA" strokeWidth="1.8" />

      {/* Pantalla digital frontal */}
      <rect x="8.5" y="12.5" width="15" height="9" rx="3" fill="#031618" stroke="#00C292" strokeWidth="1" />

      {/* Ojos cyber iluminados */}
      <rect x="11" y="15" width="3.2" height="3.8" rx="1" fill="#00E5AA" />
      <rect x="17.8" y="15" width="3.2" height="3.8" rx="1" fill="#00E5AA" />
      
      {/* Sonrisa / Indicador de voz */}
      <path d="M13 23.5H19" stroke="#00E5AA" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  recommendedBusinesses?: Business[];
  actionLinks?: { label: string; href: string }[];
  isThinking?: boolean;
}

const DEFAULT_WELCOME: ChatMessage = {
  id: 'welcome-msg',
  sender: 'bot',
  text: '¡Hola! Soy Cumaná Conecta IA, tu asistente inteligente en línea y con búsqueda en vivo. Puedo ayudarte con cualquier consulta sobre comercios, farmacias 24h, rutas de llegada, servicios, cultura de Cumaná o planes comerciales. ¿En qué te puedo orientar hoy?',
  timestamp: 'Ahora',
  actionLinks: [
    { label: 'Ver todos los locales', href: '/locales' },
    { label: 'Planes comerciales', href: '/planes' }
  ]
};

const SUGGESTIONS = [
  { label: 'Farmacias 24H', prompt: '¿Cuáles son las farmacias activas o con servicio continuo en Cumaná?' },
  { label: 'Dónde comer pescado', prompt: '¿Dónde puedo comer pescado frito o mariscos cerca del mar?' },
  { label: 'Cafés y Heladerías', prompt: '¿Qué cafeterías, heladerías o sitios para merendar hay en Cumaná?' },
  { label: 'Playas y Mochima', prompt: '¿Qué posadas, playas o paseos marítimos me recomiendas en Cumaná?' },
  { label: 'Posadas y Hospedaje', prompt: '¿Qué posadas u hoteles me recomiendas para hospedarme?' },
  { label: 'Planes Comerciales', prompt: '¿Cómo puedo anunciar mi negocio y qué planes tienen?' },
  { label: 'Comida rápida y Hamburguesas', prompt: '¿Dónde comer hamburguesas o comida rápida en Cumaná?' }
];

export function CumanaBotIA() {
  const pathname = usePathname();
  const { businesses } = useAppData();

  if (
    pathname === '/censo' || 
    pathname === '/tablet' || 
    pathname?.startsWith('/administracion')
  ) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_WELCOME]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isTyping]);

  // Manejo de reconocimiento por voz (Speech-to-Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'es-VE';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputVal(prev => prev ? `${prev} ${transcript}` : transcript);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta entrada por voz.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME]);
  };

  /**
   * MOTOR DE BÚSQUEDA Y RAZONAMIENTO INTELIGENTE
   * Regla de Negocio Crítica: Prioriza en primer lugar a los clientes destacados que pagan suscripción
   * (Tier VIP primero, luego Tier Pro, y finalmente Free).
   */
  const processQueryLocally = (query: string): { 
    text: string; 
    recommended: Business[]; 
    actionLinks?: { label: string; href: string }[] 
  } => {
    const q = query.toLowerCase().trim();
    const activeBusinesses = businesses.filter(b => b.status === 'active');

    // Consulta de Planes o Publicidad
    const isAskingAboutPlans = /plan|precio|costo|pagar|suscripci|anuncia|tarifa|publici|membres/i.test(q);
    if (isAskingAboutPlans) {
      return {
        text: `¡Excelente iniciativa! En **Cumaná Conecta** impulsamos los negocios del Estado Sucre con 3 planes oficiales:

1. ⭐ **Plan Aliado VIP ($39/mes)**: Máxima prioridad en búsquedas con IA, posición destacada #1 en el portal, videoruta aérea oficial y botón de WhatsApp permanente.
2. ⚡ **Plan Destacado Pro ($19/mes)**: Top 3 garantizado por sector y categoría, insignia oficial de verificación y métricas mensuales.
3. 🤝 **Plan Comunidad ($0 - Gratis)**: Registro permanente de tu ficha y ubicación.

Puedes consultar todos los beneficios o activar tu plan ahora mismo:`,
        recommended: activeBusinesses.filter(b => b.tier === 'vip').slice(0, 2),
        actionLinks: [
          { label: 'Ver Planes y Precios Detallados', href: '/planes' },
          { label: 'Sumar Mi Local Ahora', href: '/planes' }
        ]
      };
    }

    // Puntuación con PRIORIZACIÓN ESTRICTA para suscriptores de pago
    const scoredList = activeBusinesses.map(biz => {
      let score = 0;
      const name = biz.name.toLowerCase();
      const cat = (biz.categories && biz.categories.length > 0 ? biz.categories.join(' ') : biz.category).toLowerCase();
      const desc = biz.description.toLowerCase();
      const tagline = biz.tagline.toLowerCase();
      const zone = biz.zone.toLowerCase();
      const amenitiesStr = biz.amenities.join(' ').toLowerCase();
      const paymentsStr = biz.paymentMethods.join(' ').toLowerCase();

      const keywords = q.split(/\s+/).filter(w => w.length > 2);
      
      keywords.forEach(word => {
        if (name.includes(word)) score += 40;
        if (cat.includes(word)) score += 35;
        if (desc.includes(word)) score += 20;
        if (tagline.includes(word)) score += 15;
        if (zone.includes(word)) score += 25;
        if (amenitiesStr.includes(word)) score += 20;
        if (paymentsStr.includes(word)) score += 15;
      });

      if (/wifi|internet|fibra/i.test(q) && biz.amenities.includes('fibra_optica')) {
        score += 50;
      }
      if (/pescado|marisc|mar|playa|golfo/i.test(q) && (cat.includes('gastronom') || desc.includes('pescado') || biz.amenities.includes('frente_al_mar'))) {
        score += 55;
      }
      if (/farmacia|medic|medicina|salud/i.test(q) && (cat.includes('farmacia') || cat.includes('salud') || name.includes('farmacia'))) {
        score += 70;
      }
      if (/hotel|posada|hospedaje|dormir/i.test(q) && (cat.includes('posada') || cat.includes('hotel') || desc.includes('habitacion'))) {
        score += 70;
      }
      if (/hamburguesa|comida|restauran|cenar|almorzar/i.test(q) && (cat.includes('gastronom') || cat.includes('restauran') || desc.includes('comida'))) {
        score += 60;
      }

      if (score === 0 && (q.includes('dónde') || q.includes('que') || q.includes('recomiendame') || q.includes('mejores') || q.includes('todos'))) {
        score = 10;
      }

      // =========================================================================
      // PRIORIZACIÓN: BOOST A CLIENTES DESTACADOS QUE PAGAN SUSCRIPCIÓN
      // =========================================================================
      if (score > 0) {
        if (biz.tier === 'vip') {
          score += 1000; // Prioridad #1: Clientes Plan VIP
        } else if (biz.tier === 'pro') {
          score += 500;  // Prioridad #2: Clientes Plan Pro
        } else {
          score += 50;   // Plan Free
        }

        if (biz.isVerified) {
          score += 30;
        }
      }

      return { biz, score };
    });

    const topMatches = scoredList
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.biz);

    const recommended = topMatches.slice(0, 4);

    if (recommended.length > 0) {
      const topBiz = recommended[0];
      const hasVip = recommended.some(b => b.tier === 'vip' || b.tier === 'pro');

      let reply = '';
      if (hasVip) {
        reply = `Encontré las mejores opciones para tu consulta. Como prioridad destacada de **Cumaná Conecta**, te presento en primer lugar nuestros **establecimientos destacados y verificados en Cumaná**:`;
      } else {
        reply = `Aquí tienes los comercios verificados en Cumaná ideales para lo que buscas:`;
      }

      reply += `\n\n**${topBiz.name}** (${topBiz.category}) en *${topBiz.zone}* es la opción número uno recomendada. `;
      if (topBiz.tagline) {
        reply += `"${topBiz.tagline}". `;
      }
      if (topBiz.amenities.includes('fibra_optica')) {
        reply += `Cuenta con WiFi de alta velocidad. `;
      }

      return {
        text: reply,
        recommended,
        actionLinks: [
          { label: 'Ver todos los locales en Cumaná', href: '/locales' }
        ]
      };
    }

    const fallbackVip = activeBusinesses
      .filter(b => b.tier === 'vip' || b.tier === 'pro')
      .slice(0, 3);

    return {
      text: `Entendido. Te muestro las opciones comerciales y aliados destacados más solicitados en Cumaná actualmente. También puedes afinar tu búsqueda indicando la zona (ej. *El Centro*, *Av. Perimetral*, *San Luis*):`,
      recommended: fallbackVip,
      actionLinks: [
        { label: 'Explorar Catálogo Completo', href: '/locales' },
        { label: 'Consultar Planes Comerciales', href: '/planes' }
      ]
    };
  };

  const handleSendMessage = async (userText?: string) => {
    const textToSend = (userText || inputVal).trim();
    if (!textToSend || isTyping) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(async () => {
      try {
        let botResponse: { text: string; recommended: Business[]; actionLinks?: { label: string; href: string }[] };

        try {
          const res = await fetch('/api/gemini-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: textToSend,
              businesses: businesses.map(b => ({
                id: b.id,
                slug: b.slug,
                name: b.name,
                category: b.category,
                zone: b.zone,
                tier: b.tier,
                isVerified: b.isVerified,
                tagline: b.tagline,
                description: b.description,
                amenities: b.amenities,
                paymentMethods: b.paymentMethods
              }))
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.text) {
              botResponse = {
                text: data.text,
                recommended: data.recommendedBusinesses || processQueryLocally(textToSend).recommended,
                actionLinks: data.actionLinks
              };
            } else {
              botResponse = processQueryLocally(textToSend);
            }
          } else {
            botResponse = processQueryLocally(textToSend);
          }
        } catch {
          botResponse = processQueryLocally(textToSend);
        }

        const newBotMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedBusinesses: botResponse.recommended,
          actionLinks: botResponse.actionLinks
        };

        setMessages(prev => [...prev, newBotMessage]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    }, 500);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE DISPARADOR: CUMANÁ CONECTA IA (COMPACTO, ELEGANTE Y SIMPLE) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{ zIndex: 99999 }}
          className="fixed bottom-16 right-3 sm:bottom-6 sm:right-6 flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#0A1220]/95 hover:bg-[#111C2E] text-white hover:scale-105 active:scale-95 transition-all duration-200 border border-slate-700/80 hover:border-emerald-500/50 shadow-lg shadow-black/40 backdrop-blur-md cursor-pointer group select-none"
          aria-label="Abrir Cumaná Conecta IA"
        >
          {/* Icono de Robot discreto */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-slate-800/90 border border-slate-700 shrink-0 text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
            <BotRobotIcon size={14} />
          </div>

          {/* Nombre y lucecita activa prendida (sin texto 'online') */}
          <div className="flex items-center gap-1.5 shrink-0 pr-0.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-100 tracking-tight flex items-center gap-1">
              <span>Cumaná Conecta</span>
              <span className="text-emerald-400 font-extrabold">IA</span>
            </span>

            {/* Lucecita prendida */}
            <span className="relative flex items-center justify-center w-2 h-2 ml-0.5" title="Activo">
              <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            </span>
          </div>
        </button>
      )}

      {/* VENTANA DEL CHAT IA DE GEMINI (Z-INDEX MÁXIMO GARANTIZADO) */}
      {isOpen && (
        <div 
          style={{ zIndex: 99999 }}
          className={`fixed bottom-16 right-3 sm:bottom-6 sm:right-6 flex flex-col bg-white dark:bg-[#08121E] border border-slate-200 dark:border-[#1E2D45] rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isExpanded 
              ? 'w-[calc(100vw-24px)] sm:w-[580px] h-[550px] max-h-[75vh] sm:max-h-[88vh]' 
              : 'w-[calc(100vw-24px)] sm:w-[390px] h-[480px] max-h-[72vh] sm:max-h-[82vh]'
          }`}
        >
          {/* CABECERA CUMANÁ CONECTA IA */}
          <div className="bg-[#0A1220] dark:bg-[#060D17] text-white px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                <BotRobotIcon size={16} />
              </div>

              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Cumaná Conecta IA</h3>
                  {/* Lucecita prendida en cabecera */}
                  <span className="relative flex items-center justify-center w-2 h-2" title="En línea">
                    <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <span>Asistente Oficial</span>
                  <span>•</span>
                  <span className="text-emerald-400">En vivo</span>
                </p>
              </div>
            </div>

            {/* Acciones superiores del chat */}
            <div className="flex items-center gap-1 text-slate-300">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Limpiar conversación"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Restaurar tamaño' : 'Expandir ventana'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Cerrar asistente"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CUERPO DEL CHAT: HISTORIAL DE MENSAJES */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/80 dark:bg-[#070E1A] scroll-smooth text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-2 ${isBot ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isBot && (
                    <div className="w-6 h-6 rounded-lg bg-[#051C1F] border border-[#00C292]/30 flex items-center justify-center text-[#00E5AA] shrink-0 mt-0.5">
                      <BotRobotIcon size={14} />
                    </div>
                  )}

                  <div className={`space-y-1.5 max-w-[88%] ${isBot ? '' : 'ml-auto'}`}>
                    <div 
                      className={`p-3 rounded-2xl text-xs relative group ${
                        isBot 
                          ? 'bg-white dark:bg-[#111C2E] text-slate-800 dark:text-[#E2E8F0] border border-slate-200 dark:border-[#1E2D45] shadow-xs' 
                          : 'bg-[#00C292] text-slate-950 font-bold shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed font-semibold text-[11px] sm:text-xs">
                        {msg.text}
                      </p>

                      {/* Tarjetas Interactivas de Locales Recomendados (Priorizando VIP y Clientes que cancelan) */}
                      {msg.recommendedBusinesses && msg.recommendedBusinesses.length > 0 && (
                        <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-100 dark:border-[#1E2D45]">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                            Comercios prioritarios recomendados:
                          </span>

                          <div className="grid grid-cols-1 gap-1.5">
                            {msg.recommendedBusinesses.map((biz) => {
                              const isVip = biz.tier === 'vip';
                              const isPro = biz.tier === 'pro';

                              return (
                                <div 
                                  key={biz.id}
                                  className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                                    isVip 
                                      ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/40 shadow-xs' 
                                      : isPro
                                      ? 'bg-[#00C292]/10 border-[#00C292]/30'
                                      : 'bg-slate-50 dark:bg-[#0A1322] border-slate-200 dark:border-[#1E2D45]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img 
                                      src={biz.heroImage} 
                                      alt={biz.name}
                                      className="w-9 h-9 rounded-lg object-cover shrink-0 bg-slate-200" 
                                    />
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1">
                                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                                          {biz.name}
                                        </h4>
                                        {biz.isVerified && <VerifiedBadge size="sm" />}
                                      </div>

                                      <div className="text-[10px] text-slate-500 dark:text-[#A0AEC0] truncate">
                                        {biz.category} · {biz.zone}
                                      </div>

                                      {isVip && (
                                        <span className="inline-flex items-center gap-0.5 text-[8px] font-black text-amber-600 dark:text-amber-400">
                                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                          <span>★ Comercio Destacado</span>
                                        </span>
                                      )}
                                      {isPro && !isVip && (
                                        <span className="inline-flex items-center gap-0.5 text-[8px] font-black text-[#00C292]">
                                          <Zap className="w-2.5 h-2.5 text-[#00C292]" />
                                          <span>✓ Comercio Verificado</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <Link
                                      href={
                                        biz.tier === 'free' && !biz.hasBranches && (!biz.branches || biz.branches.length === 0)
                                          ? `/locales?q=${encodeURIComponent(biz.name)}`
                                          : `/local/${biz.slug}`
                                      }
                                      className="px-2 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black hover:opacity-90 transition-opacity flex items-center gap-0.5"
                                    >
                                      <span>Ver</span>
                                      <ChevronRight className="w-2.5 h-2.5" />
                                    </Link>

                                    {biz.socials?.whatsapp && (
                                      <a
                                        href={`https://wa.me/${biz.socials.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                                        title="Chatear por WhatsApp"
                                      >
                                        <Phone className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Botones de acción directa */}
                      {msg.actionLinks && msg.actionLinks.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-[#1E2D45] flex flex-wrap gap-1">
                          {msg.actionLinks.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.href}
                              className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1E2D45] dark:hover:bg-[#2A3E5E] text-slate-800 dark:text-white text-[9px] font-bold flex items-center gap-1 transition-all"
                            >
                              <span>{link.label}</span>
                              <ArrowRight className="w-2 h-2" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Pie del mensaje */}
                      <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 mt-0.5">
                        <span>{msg.timestamp}</span>
                        {isBot && (
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
                            title="Copiar respuesta"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Animación Pensando */}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs pl-8">
                <div className="flex items-center gap-1 bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-[#1E2D45] px-2.5 py-1.5 rounded-2xl shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C292] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[9px] font-bold text-slate-500 ml-1">Gemini analizando la ciudad...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SUGERENCIAS RÁPIDAS (HORIZONTAL SCROLL) */}
          <div className="px-2.5 py-1.5 bg-white dark:bg-[#070F1C] border-t border-slate-200 dark:border-[#1E2D45] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
            <span className="text-[9px] font-black uppercase text-amber-500 shrink-0 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>SUGERENCIAS:</span>
            </span>

            <div className="flex items-center gap-1 whitespace-nowrap">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(sug.prompt)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-xs active:scale-95 ${
                    idx === 1 
                      ? 'bg-amber-400 text-slate-950 hover:bg-amber-500' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-[#111C2E] dark:hover:bg-[#1E2D45] dark:text-[#CBD5E1] border border-slate-200 dark:border-[#1E2D45]'
                  }`}
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>

          {/* CAJA DE ENTRADA Y ACCIONES */}
          <div className="p-2.5 bg-white dark:bg-[#050C17] border-t border-slate-200 dark:border-[#1E2D45] shrink-0 space-y-1">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Pregunta sobre comercios, zonas, farmacias, rutas, taxis..."
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 dark:bg-[#111C2E] border border-slate-300 dark:border-[#1E2D45] rounded-xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00C292]"
                />
                
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all cursor-pointer ${
                    isListening 
                      ? 'text-red-500 bg-red-500/10 animate-pulse' 
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                  }`}
                  title={isListening ? 'Detener micrófono' : 'Hablar por micrófono'}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[#111C2E] hover:bg-[#00C292] hover:text-slate-950 text-slate-600 dark:text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer active:scale-95 shrink-0 border border-slate-200 dark:border-[#1E2D45]"
                title="Enviar mensaje"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-semibold px-1">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Base comercial de Cumaná en vivo</span>
              </span>
              <span>Presiona ↵ Enter</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
