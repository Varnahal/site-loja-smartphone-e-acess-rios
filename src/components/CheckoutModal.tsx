import { useState, useEffect } from 'react';
import { X, CheckCircle, CreditCard, QrCode, Clipboard, Clock, ExternalLink, ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discountPercentage: number;
  couponCode: string;
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discountPercentage,
  couponCode,
  onClearCart
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isPaid, setIsPaid] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixTime, setPixTime] = useState(300); // 5 minutes timer
  const [orderNumber, setOrderNumber] = useState('');

  // Card form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardInstallments, setCardInstallments] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Generate order number once opened
    if (isOpen) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(`QT-${rand}`);
      setIsPaid(false);
      setPixTime(300);
    }
  }, [isOpen]);

  // Pix timer handle
  useEffect(() => {
    if (!isOpen || paymentMethod !== 'pix' || isPaid || pixTime <= 0) return;
    const interval = setInterval(() => {
      setPixTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, paymentMethod, isPaid, pixTime]);

  const discountAmount = subtotal * (discountPercentage / 100);
  const coreTotal = subtotal - discountAmount;
  
  // Pix gets an additional 10% cash discount
  const finalPixTotal = coreTotal * 0.9;
  const finalCardTotal = coreTotal;
  const currentTotal = paymentMethod === 'pix' ? finalPixTotal : finalCardTotal;

  // Formatting helper for Card Number
  const handleCardNumberChange = (val: string) => {
    // Keep only numbers
    const cleanNumbers = val.replace(/\D/g, '');
    // Sub-segment inside chunks of 4 characters each
    const chunks = cleanNumbers.match(/.{1,4}/g);
    const masked = chunks ? chunks.slice(0, 4).join(' ') : '';
    setCardNumber(masked);
  };

  // Formatting helper for Expiery Month/Year
  const handleExpiryChange = (val: string) => {
    const cleanNumbers = val.replace(/\D/g, '');
    if (cleanNumbers.length <= 2) {
      setCardExpiry(cleanNumbers);
    } else {
      setCardExpiry(`${cleanNumbers.slice(0, 2)}/${cleanNumbers.slice(2, 4)}`);
    }
  };

  // Formatting helper for CVV
  const handleCVVChange = (val: string) => {
    setCardCVV(val.replace(/\D/g, '').slice(0, 4));
  };

  const handleCopyPixKey = () => {
    const mockPixKey = '00020126580014BR.GOV.BCB.PIX0136916faec1-e40d-4560-84cf-2bc0a9057b405204000053039865406' + currentTotal.toFixed(2) + '5802BR5925QuantumTech%20Store%20LTDA6009Sao%20Paulo62070503***6304ECE3';
    navigator.clipboard.writeText(mockPixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSimulatePaymentSuccess = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsPaid(true);
      onClearCart();
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 md:p-6" id="checkout-modal-overlay">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020617]/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-2xl glass bg-[#0a1122]/75 border border-white/10 rounded-3xl shadow-2xl overflow-hidden self-center z-10 flex flex-col md:flex-row backdrop-blur-2xl"
          >
            
            {/* Left side: Order review (Hidden on mobile if paid to save space) */}
            <div className={`w-full md:w-5/12 bg-white/2 p-6 border-b md:border-b-0 md:border-r border-white/15 flex flex-col justify-between ${isPaid ? 'hidden md:flex' : ''}`}>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase block mb-1 font-display">REVISÃO DO PEDIDO</span>
                <h3 className="text-xl font-extrabold text-white tracking-tight font-display">{orderNumber}</h3>
                
                {/* Items preview list */}
                <div className="mt-6 space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="glass bg-white/5 text-slate-300 py-0.5 px-1.5 rounded font-mono font-bold shrink-0">{item.quantity}x</span>
                        <div className="truncate">
                          <p className="text-slate-200 truncate font-medium font-sans">{item.product.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{item.selectedColor.name} {item.selectedStorage ? `| ${item.selectedStorage.size}` : ''}</p>
                        </div>
                      </div>
                      <span className="text-slate-300 font-mono pl-2 shrink-0">
                        R$ {((item.product.discountPrice || item.product.price) + (item.selectedStorage?.priceModifier || 0) * item.quantity).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total review bottom indicator */}
              <div className="mt-8 pt-4 border-t border-white/10 space-y-2 font-sans">
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-[11px] text-sky-400 font-display">
                    <span>Desconto do Cupom ({couponCode})</span>
                    <span className="font-mono">- {discountPercentage}%</span>
                  </div>
                )}
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between text-[11px] text-emerald-400 font-display font-medium">
                    <span>Desconto Adicional Pix</span>
                    <span className="font-mono">- 10% OFF</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Entrega</span>
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[9px] font-display">Grátis</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs font-bold text-slate-400 font-display">Total Devido</span>
                  <span className="text-xl font-black text-white font-mono font-display">
                    R$ {currentTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side: Payment form processing */}
            <div className="w-full md:w-7/12 p-6 flex flex-col justify-center relative">
              {/* Close Button */}
              {!isPaid && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              )}

              <AnimatePresence mode="wait">
                {isPaid ? (
                  /* Screen 3: Confirmed Success */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 space-y-5"
                  >
                    <div className="flex justify-center">
                      <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/30 animate-pulse animate-none">
                        <CheckCircle className="h-14 w-14 text-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-white font-display">Transação Confirmada!</h4>
                      <p className="text-xs text-slate-400 max-w-[280px] mx-auto font-sans">
                        Seu pedido <strong>{orderNumber}</strong> foi computado com sucesso e o envio está sendo preparado!
                      </p>
                    </div>

                    <div className="glass bg-white/5 p-4 rounded-2xl border border-white/10 text-left text-xs text-slate-300 space-y-2 max-w-[320px] mx-auto font-sans">
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-slate-500 font-display">Forma de Pagamento</span>
                        <span className="font-semibold text-white uppercase">{paymentMethod === 'pix' ? 'Pix à vista' : 'Cartão de Crédito'}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-slate-500 font-display">Valor Cobrado</span>
                        <span className="font-mono text-sky-400 font-bold">R$ {currentTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-display">Rastreamento</span>
                        <span className="text-emerald-400 font-semibold flex items-center">
                          <Smartphone className="h-3 w-3 mr-1" />
                          <span>WhatsApp ativo</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={onClose}
                        className="bg-sky-500 hover:bg-sky-450 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition-all text-center cursor-pointer font-display"
                      >
                        Voltar à Loja
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Screen 2: Choose Payment & pay */
                  <motion.div key="form" className="space-y-5">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1 font-display">Como deseja pagar?</h4>
                      <p className="text-xs text-slate-400 font-sans">Escolha o método mais rápido e seguro.</p>
                    </div>

                    {/* Selector Buttons */}
                    <div className="grid grid-cols-2 gap-3 glass bg-white/5 p-1 border border-white/5 rounded-xl">
                      <button
                        onClick={() => setPaymentMethod('pix')}
                        className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold select-none transition-all cursor-pointer font-display ${
                          paymentMethod === 'pix'
                            ? 'bg-sky-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <QrCode className="h-4 w-4" />
                        <span>Pix (-10% OFF)</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-semibold select-none transition-all cursor-pointer font-display ${
                          paymentMethod === 'card'
                            ? 'bg-sky-500 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Cartão</span>
                      </button>
                    </div>

                    {/* Method Content */}
                    <div className="min-h-[240px] flex flex-col justify-between font-sans">
                      {paymentMethod === 'pix' ? (
                        /* Pix Section */
                        <div className="space-y-4 text-center flex flex-col items-center">
                          <div className="bg-white p-2 rounded-2xl border-4 border-sky-500 shadow-md">
                            {/* Decorative simulated QR Code using visual pixels */}
                            <div className="relative h-32 w-32 bg-slate-100 flex items-center justify-center p-1.5 rounded">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126580014BR.GOV.BCB.PIX0136916faec1-e40d-4560-84cf-2bc0a9057b405204000053039865406${currentTotal.toFixed(2)}`}
                                alt="QRCode QRPIX"
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-amber-500 font-mono glass bg-white/5 py-1.5 px-3.5 rounded-full border border-white/5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Expira em: <strong className="text-white">{formatTime(pixTime)}</strong></span>
                          </div>

                          {/* Action controls */}
                          <div className="w-full space-y-2.5 pt-1">
                            <button
                              onClick={handleCopyPixKey}
                              className="w-full flex items-center justify-center space-x-1.5 glass bg-white/5 hover:bg-white/10 border border-white/10 text-slate-250 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-display"
                            >
                              <Clipboard className="h-4 w-4 text-sky-400" />
                              <span>{copiedPix ? 'Copiado!' : 'Copiar Código Copia e Cola'}</span>
                            </button>

                            <button
                              onClick={handleSimulatePaymentSuccess}
                              disabled={isSubmitting}
                              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-550/20 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center space-x-2 font-display animate-none"
                            >
                              {isSubmitting ? (
                                <>
                                  <Clock className="h-4 w-4 animate-spin text-white" />
                                  <span>Consultando Banco...</span>
                                </>
                              ) : (
                                <>
                                  <span>Já fiz o Pix (Simular Aprovação)</span>
                                  <ArrowRight className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Card Section */
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3 font-sans">
                            <div className="col-span-2 space-y-1 text-left">
                              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold font-display">Número do Cartão</label>
                              <input
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                value={cardNumber}
                                onChange={(e) => handleCardNumberChange(e.target.value)}
                                className="w-full glass bg-white/5 border border-white/10 focus:border-sky-400 text-white rounded-xl py-2 px-3 text-sm outline-none font-mono"
                              />
                            </div>

                            <div className="col-span-2 space-y-1 text-left">
                              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold font-display">Nome do Titular (Como no cartão)</label>
                              <input
                                type="text"
                                placeholder="Nome Completo"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="w-full glass bg-white/5 border border-white/10 focus:border-sky-400 text-white rounded-xl py-2 px-3 text-sm outline-none"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold font-display">Validade</label>
                              <input
                                type="text"
                                placeholder="MM/AA"
                                value={cardExpiry}
                                onChange={(e) => handleExpiryChange(e.target.value)}
                                className="w-full glass bg-white/5 border border-white/10 focus:border-sky-400 text-white rounded-xl py-2 px-3 text-sm outline-none font-mono"
                              />
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold font-display">Código CVV</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={cardCVV}
                                onChange={(e) => handleCVVChange(e.target.value)}
                                className="w-full glass bg-white/5 border border-white/10 focus:border-sky-400 text-white rounded-xl py-2 px-3 text-sm outline-none font-mono"
                              />
                            </div>

                            <div className="col-span-2 space-y-1 text-left">
                              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold font-display">Parcelas</label>
                              <select
                                value={cardInstallments}
                                onChange={(e) => setCardInstallments(e.target.value)}
                                className="w-full glass bg-white/5 border border-white/10 focus:border-sky-400 text-white rounded-xl py-2.5 px-3 text-sm outline-none font-sans"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                                  <option key={num} value={num.toString()} className="bg-[#0b1222] font-sans">
                                    {num}x de R$ {(currentTotal / num).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <button
                            onClick={handleSimulatePaymentSuccess}
                            disabled={isSubmitting || !cardNumber || !cardName || !cardExpiry || !cardCVV}
                            className="w-full bg-sky-500 hover:bg-sky-450 disabled:bg-white/5 disabled:opacity-40 text-white disabled:text-slate-500 font-bold py-3 rounded-xl text-xs shadow-lg active:scale-95 transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer font-display animate-none"
                          >
                            {isSubmitting ? (
                              <>
                                <Clock className="h-4 w-4 animate-spin text-white" />
                                <span>Processando Cartão...</span>
                              </>
                            ) : (
                              <>
                                <span>Pagar R$ {currentTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                <ShieldCheck className="h-4 w-4" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center items-center space-x-1 text-[10px] text-slate-500 border-t border-white/5 pt-3">
                      <ShieldCheck className="h-3.5 w-3.5 text-sky-450" />
                      <span>Certificado PCI-DSS Compliant com criptografia de ponta</span>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
