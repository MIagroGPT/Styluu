import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-brand-mint" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-brand-purple" />
  };

  const borderColors = {
    success: 'border-brand-mint/40 bg-brand-carbon text-white shadow-mint-glow',
    warning: 'border-amber-400/40 bg-brand-carbon text-white',
    info: 'border-brand-purple/40 bg-brand-carbon text-white shadow-purple-glow'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border ${borderColors[toast.type] || borderColors.info} shadow-2xl max-w-md backdrop-blur-xl`}>
        <div className="flex-shrink-0">
          {icons[toast.type] || icons.info}
        </div>
        <p className="text-sm font-semibold tracking-wide flex-1">
          {toast.message}
        </p>
      </div>
    </div>
  );
};
