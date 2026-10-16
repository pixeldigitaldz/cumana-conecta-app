'use client';

import { useState } from 'react';
import { useAppData } from '@/lib/app-data-context';
import { VerifiedBadge } from '@/components/verified-badge';
import { WhatsAppIcon, InstagramIcon } from '@/components/social-icons';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Store, 
  User, 
  MapPin, 
  Tag, 
  Send,
  MessageCircle,
  Sparkles
} from 'lucide-react';

interface VerificationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledBusinessName?: string;
}

export function VerificationRequestModal({
  isOpen,
  onClose,
  prefilledBusinessName = ''
}: VerificationRequestModalProps) {
  const { structure, addVerificationRequest } = useAppData();

  const [businessName, setBusinessName] = useState(prefilledBusinessName);
  const [ownerName, setOwnerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [category, setCategory] = useState(structure.categories[0] || 'Gastronomía & Asadores');
  const [zone, setZone] = useState(structure.zones[0] || 'Casco Histórico');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent, viaWhatsapp = false) => {
    e.preventDefault();
    if (!businessName.trim() || !whatsapp.trim()) {
      alert('Por favor ingresa el nombre de tu negocio y tu WhatsApp.');
      return;
    }

    addVerificationRequest({
      businessName: businessName.trim(),
      ownerName: ownerName.trim() || 'Comerciante Cumaná',
      whatsapp: whatsapp.trim(),
      instagram: instagram.trim(),
      category,
      zone,
      address: address.trim(),
      notes: notes.trim(),
      source: viaWhatsapp ? 'whatsapp' : 'web_form'
    });

    if (viaWhatsapp) {
      const officialPhone = structure.platformSettings?.contactWhatsapp || 'https://wa.me/584147778899';
      const cleanPhone = officialPhone.replace(/\D/g, '');
      const msg = encodeURIComponent(
        `¡Hola Cumaná Conecta! 🌊 Deseo solicitar la Insignia de Verificación Oficial para mi negocio:\n\n` +
        `🏪 *Comercio:* ${businessName}\n` +
        `👤 *Responsable:* ${ownerName}\n` +
        `📍 *Sector:* ${zone}\n` +
        `🏷️ *Categoría:* ${category}\n` +
        `📱 *WhatsApp:* ${whatsapp}\n` +
        (instagram ? `📸 *Instagram:* ${instagram}\n` : '') +
        (notes ? `📝 *Nota:* ${notes}\n` : '') +
        `\nQuedo atento a la verificación en el panel. ¡Muchas gracias!`
      );
      window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    }

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setBusinessName('');
    setOwnerName('');
    setWhatsapp('');
    setInstagram('');
    setAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#131F33] rounded-3xl border border-slate-200 dark:border-[#1E2D45] shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-slate-100 dark:bg-[#080E18] text-slate-600 dark:text-[#A0AEC0] hover:text-black dark:hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-[#0095F6]/15 border-2 border-[#0095F6] flex items-center justify-center mx-auto text-[#0095F6] shadow-lg shadow-[#0095F6]/20">
              <VerifiedBadge size="lg" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-950 dark:text-white">
                ¡Solicitud Recibida con Éxito!
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#A0AEC0] max-w-sm mx-auto leading-relaxed">
                Tu solicitud para <strong className="text-slate-950 dark:text-white font-bold">{businessName}</strong> ya fue enviada a los administradores de Cumaná Conecta.
              </p>
              <div className="p-3.5 rounded-2xl bg-[#0095F6]/10 border border-[#0095F6]/30 max-w-sm mx-auto text-[11px] text-[#0095F6] font-bold">
                ✓ Aparecerá en el panel de moderación para otorgar la insignia oficial tipo Instagram con el check verificado.
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-6 py-3 rounded-xl bg-[#0095F6] hover:bg-[#0095F6]/90 text-white font-black text-xs transition-all shadow-md cursor-pointer"
            >
              Entendido, volver al portal
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2 pr-6">
              <div className="flex items-center gap-2">
                <VerifiedBadge size="md" />
                <span className="text-[10px] uppercase font-black tracking-widest text-[#0095F6]">
                  Autenticidad & Fidelidad Oficial
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                Solicitar Sello de Local Verificado
              </h2>
              <p className="text-xs text-slate-600 dark:text-[#A0AEC0] leading-relaxed">
                Obtén el check oficial tipo Instagram para tu negocio en Cumaná. La solicitud llegará al panel de moderación para validación inmediata.
              </p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Nombre Comercial del Negocio *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej. Marisquería Los Cocos"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-semibold focus:outline-none focus:border-[#0095F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    Responsable o Propietario *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Tu nombre y apellido"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#0095F6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                    WhatsApp de Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ej. 0414-1234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-mono focus:outline-none focus:border-[#0095F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#008966] dark:text-[#00C292]" />
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-bold focus:outline-none focus:border-[#0095F6]"
                  >
                    {structure.categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B4A]" />
                    Sector en Cumaná
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white font-bold focus:outline-none focus:border-[#0095F6]"
                  >
                    {structure.zones.map(z => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1 flex items-center gap-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 fill-[#E1306C]" />
                    Instagram (Opcional)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@tucomercio"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#0095F6]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                    Dirección Física
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Av. Perimetral o calle principal"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#0095F6]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                  Detalles para Validación (RIF, años de servicio o servicios)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Coméntanos brevemente sobre tu negocio para agilizar la entrega del check de verificado..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-[#1E2D45] rounded-xl text-xs text-slate-950 dark:text-white focus:outline-none focus:border-[#0095F6]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#1E2D45] flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#0095F6] hover:bg-[#0095F6]/90 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-[#0095F6]/20 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Enviar Solicitud al Panel</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#25D366]/90 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 cursor-pointer"
                  title="Enviar solicitud y abrir chat de WhatsApp oficial"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Enviar por WhatsApp</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
