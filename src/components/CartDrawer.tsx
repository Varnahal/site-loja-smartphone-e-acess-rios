import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, Ticket, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (appliedDiscount: number, activeCouponCode: string) => void;
}

const FREE_SHIPPING_THRESHOLD = 350;

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem, onCheckout }: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Auto close if items empty - optional, let's keep it open but show happy empty illustration
  const subtotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice || item.product.price;
    const modifier = item.selectedStorage ? item.selectedStorage.priceModifier : 0;
    return acc + (unitPrice + modifier) * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? subtotal * (appliedCoupon.discount / 100) : 0;
  const deliveryCost = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 25;
  const total = subtotal - discountAmount + deliveryCost;

  const validCoupons: { [key: string]: number } = {
    'TECH15': 15,
    'GAMERBOOST15': 15,
    'CREATORPLUS12': 12,
    'PROHUB10': 10,
    'VIDATECH10': 10,
    'BEMVINDO': 10
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (validCoupons[code]) {
      setAppliedCoupon({ code, discount: validCoupons[code] });
      setCouponError('');
    } else {
      setCouponError('Cupom inválido ou expirado');
      setTimeout(() => setCouponError(''), 3000);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
  };

  const roundedDistance = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020617]/60 backdrop-blur-md"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-md glass bg-[#0a1122]/70 border-l border-white/10 flex flex-col shadow-2xl h-full backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white font-display">Seu Carrinho</h2>
                <span className="text-xs glass bg-white/5 text-slate-300 py-1 px-2.5 rounded-full font-mono font-semibold border border-white/5">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} itens
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress bar */}
            {subtotal > 0 && (
              <div className="bg-white/3 px-5 py-3 border-b border-white/5 text-xs">
                {roundedDistance > 0 ? (
                  <p className="text-slate-400 text-center">
                    Adicione mais <strong className="text-sky-400">R$ {roundedDistance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para ganhar <span className="font-semibold text-emerald-400">Frete Grátis</span>!
                  </p>
                ) : (
                  <p className="text-emerald-400 font-bold text-center flex items-center justify-center space-x-1.5">
                    <span>🎉 Parabéns! Você garantiu <strong>Frete Grátis</strong> para esta entrega</span>
                  </p>
                )}
                <div className="mt-2 w-full h-1.5 background bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                  const unitPrice = item.product.discountPrice || item.product.price;
                  const modifier = item.selectedStorage ? item.selectedStorage.priceModifier : 0;
                  const itemPrice = unitPrice + modifier;

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="flex items-start space-x-3.5 glass bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                    >
                      {/* Image Preview */}
                      <div className="w-16 h-16 rounded-lg bg-black p-1 flex items-center justify-center border border-white/10 shrink-0 animate-none">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.05)]"
                        />
                      </div>

                      {/* Info & controls */}
                      <div className="flex-1 text-left min-w-0">
                        <h4 className="font-semibold text-white text-sm truncate leading-snug font-display">
                          {item.product.name}
                        </h4>
                        
                        <div className="text-[10px] space-y-0.5 mt-0.5 text-slate-400 font-medium">
                          <p>Cor: <span className="text-slate-300">{item.selectedColor.name}</span></p>
                          {item.selectedStorage && (
                            <p>Memória: <span className="text-slate-300">{item.selectedStorage.size}</span></p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty incrementer */}
                          <div className="flex items-center border border-white/10 bg-black/40 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQty(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.id, 1)}
                              className="p-1 text-slate-400 hover:text-white cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/25 rounded-md transition-all cursor-pointer"
                            title="Remover do carrinho"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Pricing right aligned */}
                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-white font-display">
                          R$ {(itemPrice * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-slate-550 font-mono mt-0.5">
                            un: R$ {itemPrice.toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="glass bg-white/5 p-4 rounded-full border border-white/10 text-slate-500 mb-4 animate-bounce duration-4000">
                    <Trash2 className="h-10 w-10 text-sky-450" />
                  </div>
                  <h3 className="font-bold text-white text-base font-display">Seu carrinho está vazio</h3>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-[240px]">
                    Navegue pelos smartphones e acessórios premium e monte sua nova central inteligente!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 glass bg-white/5 border border-white/10 hover:border-sky-500/50 text-sky-400 text-xs py-20 py-2 px-5 rounded-full transition-all duration-200 cursor-pointer font-display"
                  >
                    Explorar Produtos
                  </button>
                </div>
              )}
            </div>

            {/* Footer Calculator */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-white/5 bg-slate-950/90 backdrop-blur-md space-y-4">
                
                {/* Promo Code input segment */}
                <div className="space-y-1.5">
                  <AnimatePresence>
                    {appliedCoupon ? (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-between bg-sky-500/10 border border-sky-500/20 py-2 px-3.5 rounded-xl"
                      >
                        <div className="flex items-center space-x-2 text-sky-400 text-xs">
                          <Ticket className="h-4 w-4" />
                          <span>Cupom <strong>{appliedCoupon.code}</strong> ({appliedCoupon.discount}% OFF) ativo</span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-xs text-sky-400 hover:text-sky-350 font-bold underline cursor-pointer"
                        >
                          Remover
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Tem cupom? Ex: TECH15"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            className="w-full glass bg-white/5 text-white pl-3 pr-8 py-2 border border-white/10 focus:border-sky-500 rounded-xl text-xs outline-none"
                          />
                        </div>
                        <button
                          onClick={handleApplyCoupon}
                          className="glass bg-white/5 text-slate-300 hover:text-sky-400 hover:bg-white/10 py-2 px-4 rounded-xl text-xs border border-white/10 transition-all font-semibold cursor-pointer"
                        >
                          Aplicar
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                  
                  {couponError && (
                    <p className="text-[10px] text-red-400 pl-1">{couponError}</p>
                  )}
                </div>

                {/* Pricing Summary */}
                <div className="space-y-2 text-xs border-b border-white/5 pb-3">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-200">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sky-400">
                      <span>Desconto ({appliedCoupon?.discount}%)</span>
                      <span className="font-mono">- R$ {discountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Entrega</span>
                    <span className="font-mono text-slate-200">
                      {deliveryCost === 0 ? <strong className="text-emerald-400 uppercase tracking-widest text-[10px]">Grátis</strong> : `R$ ${deliveryCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline font-sans">
                    <span className="text-sm font-bold text-white">Total Geral</span>
                    <div className="text-right">
                      <p className="text-lg font-extrabold text-white font-mono font-display">
                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[11px] text-sky-400">
                        ou de R$ {(total * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no Pix (10% já incluso)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkout security seal and primary CTA */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => onCheckout(appliedCoupon ? appliedCoupon.discount : 0, appliedCoupon ? appliedCoupon.code : '')}
                    className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-xl shadow-sky-500/20 active:scale-95 transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer font-display"
                  >
                    <span>Finalizar Compra</span>
                  </button>

                  <div className="flex justify-center items-center space-x-1.5 text-[10px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Ambiente criptografado SSL 100% Protegido</span>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
