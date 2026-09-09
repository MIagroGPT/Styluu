import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  CheckCircle2, 
  MapPin, 
  QrCode, 
  Share2, 
  Check, 
  Sparkles,
  Smartphone
} from 'lucide-react';

export const ConfirmationCard = ({ booking, onClose }) => {
  const { t } = useLanguage();
  const { setCurrentView } = useApp();

  useEffect(() => {
    // Fire celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6045F4', '#53E6D4', '#39FF14', '#F472B6']
    });
  }, []);

  if (!booking) return null;

  const handleGoToMyBookings = () => {
    if (onClose) onClose();
    setCurrentView('my-bookings');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full mx-auto text-center space-y-6">
      
      {/* Top Success Badge with Royal Purple / Neon Green accent */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-brand-purple flex items-center justify-center shadow-purple-glow animate-bounce">
          <Check className="w-10 h-10 text-white stroke-[3]" />
        </div>
      </div>

      {/* Headings */}
      <div className="space-y-1">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-carbon tracking-tight">
          ¡Cita confirmada!
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Todo listo, te estamos esperando.
        </p>
      </div>

      {/* Booking Details Card Box (Identical layout to user's design image) */}
      <div className="bg-brand-soft-card rounded-2xl p-5 border border-slate-200/80 text-left space-y-4 shadow-xs">
        
        {/* Date Row */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">Fecha</span>
            <span className="text-sm font-bold text-brand-carbon">{booking.date}</span>
          </div>
        </div>

        {/* Time Row */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-mint/20 text-teal-800 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">Hora</span>
            <span className="text-sm font-bold text-brand-carbon">{booking.time}</span>
          </div>
        </div>

        {/* Venue / Specialist Row */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">Local / Especialista</span>
            <span className="text-sm font-bold text-brand-carbon">{booking.venueName} • {booking.staffName}</span>
          </div>
        </div>

        {/* Service & Price Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Servicio</span>
              <span className="text-sm font-bold text-brand-carbon">{booking.serviceName}</span>
            </div>
          </div>
          <span className="font-display font-black text-lg text-brand-carbon">
            ${booking.price}
          </span>
        </div>

      </div>

      {/* WhatsApp / SMS green confirmation box */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-left">
        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
        <p className="text-xs font-semibold text-emerald-900 leading-snug">
          Te hemos enviado los detalles de tu cita a tu correo y WhatsApp.
        </p>
      </div>

      {/* Booking Code QR pill */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
        <span>CÓDIGO DE RESERVA:</span>
        <span className="font-bold text-brand-purple">{booking.bookingCode}</span>
      </div>

      {/* Primary Action Button (Royal Purple) */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={handleGoToMyBookings}
          className="w-full py-4 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold text-sm sm:text-base shadow-brand-md hover:shadow-purple-glow transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Ver mis citas
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
        >
          Cerrar y continuar explorando
        </button>
      </div>

    </div>
  );
};
