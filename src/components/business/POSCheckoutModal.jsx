import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Check, 
  ShoppingBag, 
  Receipt, 
  Percent, 
  Plus, 
  Trash2,
  Sparkles
} from 'lucide-react';

export const POSCheckoutModal = ({ appointment, isOpen, onClose }) => {
  const { updateAppointmentStatus, showToast, products: inventoryProducts, formatMoney, staffMembers, recordSaleTransaction } = useApp();

  const [posProducts, setPosProducts] = useState(() => {
    return inventoryProducts.map(p => ({ ...p, qty: 0 }));
  });

  const [selectedTipPercent, setSelectedTipPercent] = useState(15); // 5, 10, 15, 20, 25, 30, 0
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cash' | 'apple_pay'
  const [isCharged, setIsCharged] = useState(false);

  if (!isOpen || !appointment) return null;

  const servicePrice = appointment.price || 45;
  const productsTotal = posProducts.reduce((acc, p) => acc + (p.price * p.qty), 0);
  const subtotal = servicePrice + productsTotal;
  // Tips are calculated EXCLUSIVELY on service value (never on retail products)
  const tipAmount = selectedTipPercent > 0 ? (servicePrice * selectedTipPercent) / 100 : 0;
  const total = subtotal + tipAmount;

  const handleAddProduct = (prodId) => {
    setPosProducts(posProducts.map(p => p.id === prodId ? { ...p, qty: p.qty + 1 } : p));
  };

  const handleRemoveProduct = (prodId) => {
    setPosProducts(posProducts.map(p => p.id === prodId && p.qty > 0 ? { ...p, qty: p.qty - 1 } : p));
  };

  const handleProcessPayment = () => {
    setIsCharged(true);
    updateAppointmentStatus(appointment.id, 'completed');
    
    const staff = staffMembers.find(s => s.id === appointment.staffId);
    recordSaleTransaction({
      date: appointment.date || new Date().toISOString().split('T')[0],
      time: appointment.startTime || '10:00',
      staffId: appointment.staffId || 'staff-1',
      staffName: staff?.name || 'John Templeton',
      clientName: appointment.clientName || 'Cliente',
      serviceName: appointment.serviceName || 'Servicio',
      servicePrice: servicePrice,
      productsTotal: productsTotal,
      tipAmount: tipAmount,
      taxAmount: 0,
      totalAmount: total,
      paymentMethod: paymentMethod,
      items: posProducts.filter(p => p.qty > 0)
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    showToast(`Cobro procesado por ${formatMoney(total)} para ${staff?.name || 'el especialista'}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-brand-carbon">
                Punto de Venta — Styluu POS
              </h3>
              <div className="text-xs text-slate-400">
                Cliente: <span className="font-bold text-slate-700">{appointment.clientName}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCharged ? (
          /* Payment Receipt Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-mint-glow">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl text-brand-carbon">
                ¡Pago Procesado Exitosamente!
              </h3>
              <p className="text-xs text-slate-500">
                Recibo digital enviado al teléfono {appointment.clientPhone || 'del cliente'}.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span>Servicio: {appointment.serviceName}</span>
                <span>{formatMoney(servicePrice)}</span>
              </div>
              {posProducts.filter(p => p.qty > 0).map(p => (
                <div key={p.id} className="flex justify-between text-slate-600">
                  <span>{p.qty}x {p.name}</span>
                  <span>{formatMoney(p.price * p.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-slate-600">
                <span>Propina ({selectedTipPercent > 0 ? `${selectedTipPercent}%` : 'Sin propina'}):</span>
                <span>{formatMoney(tipAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-brand-carbon pt-2 border-t border-slate-200 font-sans">
                <span>TOTAL PAGADO:</span>
                <span className="text-brand-purple font-display font-black text-lg">{formatMoney(total)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold text-sm shadow-brand-md"
            >
              Cerrar y volver al Calendario
            </button>
          </div>
        ) : (
          /* POS Register Active View */
          <div className="p-6 space-y-5">
            
            {/* Services rendered line item */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Servicios Realizados
              </label>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-brand-carbon">{appointment.serviceName}</span>
                <span className="font-display font-black text-sm text-brand-carbon">{formatMoney(servicePrice)}</span>
              </div>
            </div>

            {/* Add Retail Products */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Productos de Venta (Retail)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {posProducts.map((prod) => (
                  <div key={prod.id} className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{prod.name}</div>
                      <div className="text-[11px] text-brand-purple font-bold">{formatMoney(prod.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {prod.qty > 0 && (
                        <button
                          onClick={() => handleRemoveProduct(prod.id)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                      )}
                      <span className="font-bold w-4 text-center">{prod.qty}</span>
                      <button
                        onClick={() => handleAddProduct(prod.id)}
                        className="w-7 h-7 rounded-lg bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white flex items-center justify-center font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip percentage Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Propina para el Especialista
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                {[5, 10, 15, 20, 25, 30, 0].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setSelectedTipPercent(pct)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                      selectedTipPercent === pct
                        ? 'bg-brand-mint text-brand-carbon font-black shadow-2xs border border-brand-mint ring-2 ring-brand-mint/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {pct === 0 ? 'SIN' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Método de Pago
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-brand-purple text-white border-brand-purple'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4" /> Tarjeta POS
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'bg-brand-purple text-white border-brand-purple'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <DollarSign className="w-4 h-4" /> Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-brand-purple text-white border-brand-purple'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Apple Pay
                </button>
              </div>
            </div>

            {/* Total Calculation breakdown */}
            <div className="bg-brand-soft-card p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal (Servicios + Retail):</span>
                <span className="font-semibold text-slate-700">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Propina ({selectedTipPercent > 0 ? `${selectedTipPercent}% sobre servicios` : 'Sin propina'}):</span>
                <span className="font-semibold text-slate-700">{formatMoney(tipAmount)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 font-bold text-sm">
                <span className="text-brand-carbon">TOTAL A COBRAR:</span>
                <span className="font-display font-black text-2xl text-brand-purple">
                  {formatMoney(total)}
                </span>
              </div>
            </div>

            {/* Bottom Charge Button */}
            <button
              onClick={handleProcessPayment}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-mint hover:opacity-95 text-white font-black text-base shadow-brand-md hover:shadow-purple-glow transition-all"
            >
              Procesar Cobro — {formatMoney(total)}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
