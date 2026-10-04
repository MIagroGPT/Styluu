import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Store, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Scissors, 
  Gift, 
  Building2,
  Check
} from 'lucide-react';

export const AuthModal = () => {
  const { t } = useLanguage();
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode,
    authRole, 
    setAuthRole,
    selectedPlanForRegistration,
    login,
    registerUser,
    showToast,
    navigateToApp,
    navigateToBiz
  } = useApp();

  const [mode, setMode] = useState(authModalMode || 'login'); // 'login' | 'register'
  const [role, setRole] = useState(authRole || 'client'); // 'client' | 'partner'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Business Specific Fields
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('barber');
  const [city, setCity] = useState('Miami, FL');
  const [address, setAddress] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(selectedPlanForRegistration || 'staff');

  React.useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalMode) setMode(authModalMode);
      if (authRole) setRole(authRole);
      if (selectedPlanForRegistration) setSelectedPlan(selectedPlanForRegistration);
    }
  }, [isAuthModalOpen, authModalMode, authRole, selectedPlanForRegistration]);

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (demoRole) => {
    setLoading(true);
    setTimeout(() => {
      if (demoRole === 'client') {
        login({
          id: 'client-1',
          name: 'Diego Ramirez',
          email: 'diego.ramirez@mail.com',
          phone: '+1 (305) 555-0199',
          role: 'client',
          isVip: true,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        });
        showToast('¡Bienvenido de nuevo, Diego!', 'success');
        closeAuthModal();
        navigateToApp();
      } else {
        login({
          id: 'partner-1',
          name: 'Carlos Mendoza',
          email: 'carlos@thehustlebarber.com',
          phone: '+1 (305) 555-0144',
          role: 'partner',
          businessName: 'The Hustle Barber & Lounge',
          venueId: 'venue-1',
          plan: 'staff'
        });
        showToast('¡Bienvenido a Bublyme Business OS!', 'success');
        closeAuthModal();
        navigateToBiz('calendar');
      }
      setLoading(false);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Por favor completa los campos obligatorios', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (mode === 'login') {
        login({
          id: `user-${Date.now()}`,
          name: fullName || (email.split('@')[0]),
          email,
          phone: phone || '+1 (305) 555-0100',
          role,
          businessName: role === 'partner' ? (businessName || 'Mi Establecimiento') : undefined,
          isVip: true
        });
        showToast('Sesión iniciada correctamente', 'success');
        closeAuthModal();
        if (role === 'partner') {
          navigateToBiz('calendar');
        } else {
          navigateToApp();
        }
      } else {
        // Registration
        registerUser({
          id: `user-${Date.now()}`,
          name: fullName || (email.split('@')[0]),
          email,
          phone,
          role,
          businessName: role === 'partner' ? businessName : undefined,
          category: role === 'partner' ? category : undefined,
          city: role === 'partner' ? city : undefined,
          address: role === 'partner' ? address : undefined,
          plan: role === 'partner' ? selectedPlan : undefined
        });
        showToast(role === 'partner' ? '¡Tu negocio ha sido registrado con 7 días gratis!' : '¡Cuenta creada con éxito!', 'success');
        closeAuthModal();
        if (role === 'partner') {
          navigateToBiz('calendar');
        } else {
          navigateToApp();
        }
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* Modal Card */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl sm:rounded-4xl max-w-lg w-full p-6 sm:p-9 shadow-2xl relative overflow-hidden text-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow ambient */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-brand-mint/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Branding */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center">
            <Logo variant="white" className="h-8" />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            {mode === 'login' ? 'Bienvenido a Bublyme' : 'Crea tu Cuenta Oficial'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Accede a tus citas o a la administración de tu negocio' 
              : 'Únete a la plataforma #1 de belleza, barbería y bienestar'}
          </p>
        </div>

        {/* Mode Selector Tab (Login vs Register) */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-800/80 border border-slate-700/80 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-brand-purple text-white shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2.5 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-brand-purple text-white shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Registrarme
          </button>
        </div>

        {/* Role Selector (Client vs Partner/Business) */}
        <div className="mb-6">
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
            Tipo de Perfil
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                role === 'client'
                  ? 'border-brand-purple bg-brand-purple/15 text-white shadow-brand-sm ring-1 ring-brand-purple'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                role === 'client' ? 'bg-brand-purple text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs">Soy Cliente</div>
                <div className="text-[10px] text-slate-400">Reservar citas</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                role === 'partner'
                  ? 'border-brand-mint bg-brand-mint/15 text-white shadow-brand-sm ring-1 ring-brand-mint'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                role === 'partner' ? 'bg-brand-mint text-brand-carbon' : 'bg-slate-800 text-slate-400'
              }`}>
                <Store className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs">Soy Negocio</div>
                <div className="text-[10px] text-slate-400">Salón o Barbería</div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick 1-Click Demo Logins */}
        <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
              Acceso Rápido Demo (1 Clic)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('client')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center border border-slate-700 transition-all truncate"
            >
              👤 Como Cliente
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('partner')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-mint text-xs font-semibold text-center border border-slate-700 transition-all truncate"
            >
              💈 Como Negocio
            </button>
          </div>
        </div>

        {/* Main Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Register Mode Extra Fields */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Diego Ramirez"
                  className="w-full px-3.5 py-3 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Business Specific Registration Fields */}
          {mode === 'register' && role === 'partner' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nombre del Establecimiento *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ej: Golden Blades Barber Studio"
                    className="w-full px-3.5 py-3 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                  />
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="barber">Barbería</option>
                    <option value="hair-salon">Peluquería / Salón</option>
                    <option value="spa">Spa & Masajes</option>
                    <option value="nails">Uñas & Manicura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Miami, FL / Bogotá"
                    className="w-full px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Plan Picker for new business */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Plan Seleccionado</span>
                  <span className="text-[10px] text-brand-mint font-extrabold flex items-center gap-1">
                    <Gift className="w-3 h-3" /> 7 Días de Prueba Gratis
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('independiente')}
                    className={`p-2.5 rounded-xl border transition-all ${
                      selectedPlan === 'independiente'
                        ? 'border-brand-purple bg-brand-purple/20 text-white'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">Independiente</div>
                    <div className="font-extrabold text-xs">$100 MXN</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('staff')}
                    className={`p-2.5 rounded-xl border transition-all relative ${
                      selectedPlan === 'staff'
                        ? 'border-brand-mint bg-brand-mint/20 text-white'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] text-brand-mint">Staff (Popular)</div>
                    <div className="font-extrabold text-xs">$500 MXN</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('ilimitado')}
                    className={`p-2.5 rounded-xl border transition-all ${
                      selectedPlan === 'ilimitado'
                        ? 'border-cyan-400 bg-cyan-400/20 text-white'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">Ilimitado</div>
                    <div className="font-extrabold text-xs">$900 MXN</div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Correo Electrónico *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-3.5 py-3 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Phone (WhatsApp) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Teléfono WhatsApp *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (305) 555-0100"
                  className="w-full px-3.5 py-3 pl-10 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">
                Contraseña *
              </label>
              {mode === 'login' && (
                <a href="#" onClick={(e) => { e.preventDefault(); showToast('Enlace de recuperación enviado al correo', 'info'); }} className="text-[11px] text-brand-mint hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-3 pl-10 pr-10 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white shadow-brand-md transition-all flex items-center justify-center gap-2 mt-4 ${
              role === 'partner'
                ? 'bg-gradient-to-r from-teal-500 to-brand-mint text-brand-carbon hover:opacity-95'
                : 'bg-brand-purple hover:bg-brand-purple-dark'
            }`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' 
                    ? `Ingresar como ${role === 'partner' ? 'Negocio' : 'Cliente'}` 
                    : `Crear Cuenta de ${role === 'partner' ? 'Negocio (7 días gratis)' : 'Cliente'}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Trust Badges */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-center gap-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
            Datos cifrados 256-bit
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-mint" />
            Sin contratos forzosos
          </span>
        </div>

      </div>

    </div>
  );
};

export default AuthModal;
