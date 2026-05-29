import { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle, Gift, Copy, ShoppingCart, RefreshCw, Smartphone, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TechProfile, Product } from '../types';
import { MATCHERS_DATA, PRODUCTS } from '../data';

interface TechMatcherQuizProps {
  onAddBundleToCart: (productIds: string[], couponCode: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function TechMatcherQuiz({ onAddBundleToCart, onSelectProduct }: TechMatcherQuizProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  
  // Quiz Answers State
  const [focus, setFocus] = useState<TechProfile | null>(null);
  const [hoursConnected, setHoursConnected] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const [matchedProfile, setMatchedProfile] = useState<typeof MATCHERS_DATA[0] | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  const startQuiz = () => {
    setFocus(null);
    setHoursConnected('');
    setPriority('');
    setMatchedProfile(null);
    setStep(1);
  };

  const handleNextStep = () => {
    if (step === 3) {
      calculateResult();
    } else {
      setStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev - 1) as any);
  };

  const calculateResult = () => {
    // Basic heuristic: Priority match based on Focus state primarily
    const profileKey: TechProfile = focus || 'casual';
    const foundProfile = MATCHERS_DATA.find((m) => m.profile === profileKey) || MATCHERS_DATA[3];
    setMatchedProfile(foundProfile);
    setStep(4);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const handleAddBundle = () => {
    if (!matchedProfile) return;
    setIsAddingBundle(true);
    setTimeout(() => {
      onAddBundleToCart(matchedProfile.recommendedProducts, matchedProfile.exclusiveCode);
      setIsAddingBundle(false);
    }, 1200);
  };

  // Resolve recommended products from database
  const getRecommendedProducts = (): Product[] => {
    if (!matchedProfile) return [];
    return matchedProfile.recommendedProducts
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  };

  return (
    <div id="quiz-container" className="glass p-6 md:p-10 rounded-3xl relative overflow-hidden">
      
      {/* Absolute Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {step === 0 && (
          /* Step 0: Welcome / Call-To-Action */
          <motion.div
            key="step-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center max-w-2xl mx-auto space-y-6 py-4"
          >
            <div className="inline-flex items-center space-x-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 py-1.5 px-4 rounded-full text-xs font-semibold animate-pulse font-display">
              <Sparkles className="h-4 w-4" />
              <span>SISTEMA DE MATCH DE ALTA TECNOLOGIA</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-display">
                Encontre o Ecossistema Ideal para Sua Rotina
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                Responda a 3 perguntas simples e nosso algoritmo inteligente irá sugerir a combinação perfeita de smartphone e acessórios que se adaptam exatamente ao seu estilo de uso. Livre-se do desperdício de recursos!
              </p>
            </div>

            <div className="glass bg-white/5 rounded-2xl p-4 border border-white/15 text-left text-xs text-slate-400 grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
              <div className="flex items-start space-x-2.5">
                <span className="text-sky-400 font-extrabold text-base font-display">01.</span>
                <p><strong>Configuração Otimizada</strong> ajustada ao seu perfil profissional ou de lazer.</p>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-sky-400 font-extrabold text-base font-display">02.</span>
                <p><strong>Cupom Exclusivo</strong> com desconto instantâneo de até 15% no kit completo.</p>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="text-sky-400 font-extrabold text-base font-display">03.</span>
                <p><strong>Adicione com 1 Clique</strong> todo o ecossistema pronto e configurado no carrinho.</p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={startQuiz}
                className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-8 rounded-xl text-sm shadow-xl shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2 mx-auto cursor-pointer group font-display"
              >
                <span>Descobrir Meu Perfil Tech</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          /* Step 1: Main Focus */
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase">
              <span>Pergunta 1 de 3</span>
              <span className="text-sky-400">Objetivo</span>
            </div>

            <h4 className="text-lg md:text-xl font-bold text-white tracking-tight text-left font-display">
              Qual é o foco principal de uso do celular e tecnologia no seu dia a dia?
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { key: 'gamer', title: 'Jogar Games Pesados / Streams', desc: 'Rendimentos fluídos, taxas de quadro altíssimas e baixíssima latência acústica.' },
                { key: 'creator', title: 'Criação de Conteúdo / Estúdio', desc: 'Câmeras de alta definição, fidelidade cromática e isolamento acústico absoluto.' },
                { key: 'professional', title: 'Produtividade / Negócios', desc: 'Alta performance de múltiplos apps, recargas urgentes GaN e autonomia longa.' },
                { key: 'casual', title: 'Mídias Sociais / Dia a Dia', desc: 'Estética leve e moderna, rastreamento de saúde física e consumo de músicas.' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFocus(opt.key as TechProfile)}
                  className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    focus === opt.key
                      ? 'bg-sky-500/10 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                      : 'glass bg-white/5 border-white/5 text-slate-355 hover:border-white/15 hover:text-white'
                  }`}
                >
                  <p className="font-bold text-sm text-sky-400 font-display">{opt.title}</p>
                  <p className="text-xs text-slate-500 mt-1 lines-clamp-2">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end space-x-2 border-t border-white/5">
              <button
                onClick={() => setStep(0)}
                className="py-2.5 px-5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                disabled={!focus}
                onClick={handleNextStep}
                className="bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center space-x-1.5 cursor-pointer font-display"
              >
                <span>Avançar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          /* Step 2: Hours Connected */
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase">
              <span>Pergunta 2 de 3</span>
              <span className="text-sky-400 font-display">Intensidade de uso</span>
            </div>

            <h4 className="text-lg md:text-xl font-bold text-white tracking-tight text-left font-display">
              Em média, quantas horas diárias você costuma passar utilizando dispositivos móveis?
            </h4>

            <div className="space-y-3">
              {[
                { label: 'Uso Moderado (até 4 horas por dia)', desc: 'Foco em ligações rápidas, mensagens esporádicas e gerenciamento básico.' },
                { label: 'Uso Padrão (de 4 a 8 horas por dia)', desc: 'Utilização frequente para redes sociais, streaming de áudio, navegação e emails.' },
                { label: 'Uso Intensivo de Elite (mais de 8 horas por dia)', desc: 'Multitarefas constante, jogos contínuos, reuniões em vídeo e ferramentas de produtividade.' }
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setHoursConnected(opt.label)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                    hoursConnected === opt.label
                      ? 'bg-sky-500/10 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                      : 'glass bg-white/5 border-white/5 text-slate-300 hover:border-white/15'
                  }`}
                >
                  <p className="font-bold text-xs text-white font-display">{opt.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between space-x-2 border-t border-white/5">
              <button
                onClick={handlePrevStep}
                className="flex items-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-slate-450 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </button>
              <button
                disabled={!hoursConnected}
                onClick={handleNextStep}
                className="bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center space-x-1.5 cursor-pointer font-display"
              >
                <span>Avançar</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          /* Step 3: Priorities */
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold uppercase">
              <span>Pergunta 3 de 3</span>
              <span className="text-sky-400 font-display">Diferencial</span>
            </div>

            <h4 className="text-lg md:text-xl font-bold text-white tracking-tight text-left font-display font-medium">
              Qual atributo você mais valoriza em uma peça de tecnologia moderna?
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {[
                'Carregamento ultra-rápido de tomada e bateria de longa permanência física',
                'Poder óptico superior com lentes de alta resolução para fotografia de cinema',
                'Cancelamento de ruído estático puro isolador e profundidade de áudio espacial',
                'Corpo fino, construção em materiais nobres e acabamento altamente refinado'
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPriority(opt)}
                  className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                    priority === opt
                      ? 'bg-sky-500/10 border-sky-400 text-white'
                      : 'glass bg-white/5 border-white/5 text-slate-300 hover:border-white/15'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-200">{opt}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between space-x-2 border-t border-white/5">
              <button
                onClick={handlePrevStep}
                className="flex items-center space-x-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-slate-455 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </button>
              <button
                disabled={!priority}
                onClick={handleNextStep}
                className="bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center space-x-1.5 cursor-pointer font-display"
              >
                <span>Finalizar Match</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && matchedProfile && (
          /* Step 4: Result page and Bundle proposal */
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-left max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-900 py-1 px-3 rounded-full font-bold">MATCH ENCONTRADO!</span>
                <h3 className="text-2xl font-black text-white mt-2 leading-none font-display uppercase">{matchedProfile.title}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-lg">{matchedProfile.description}</p>
              </div>

              {/* Coupon Reveal Section */}
              <div className="glass bg-white/5 border border-white/10 p-4 rounded-2xl w-full md:w-auto flex flex-col justify-center items-center shrink-0 shadow-lg text-center">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest flex items-center pr-1 gap-1 font-display">
                  <Gift className="h-3.5 w-3.5" />
                  Cupom de Desconto Exclusivo
                </span>
                
                <h4 className="text-2xl font-extrabold text-white mt-1 border-b border-dashed border-white/10 pb-1 font-display">
                  {matchedProfile.exclusiveDiscount}% OFF
                </h4>

                <button
                  type="button"
                  onClick={() => handleCopyCoupon(matchedProfile.exclusiveCode)}
                  className="mt-2.5 flex items-center space-x-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] py-1.5 px-4 rounded-lg transition-all cursor-pointer shadow-md shadow-sky-500/20 font-display"
                >
                  <Copy className="h-3 w-3" />
                  <span>{copiedCoupon ? 'Copiado!' : matchedProfile.exclusiveCode}</span>
                </button>
              </div>
            </div>

            {/* Recommended items cluster selection cards layout */}
            <div className="space-y-3.5 text-slate-500">
              <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Seu Kit Recomendado Personalizado:
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getRecommendedProducts().map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="p-3 glass bg-white/5 border border-white/5 hover:border-sky-500/30 rounded-2xl cursor-pointer flex items-center space-x-3.5 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-black/45 p-1 flex items-center justify-center shrink-0 border border-white/10">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.05)]"
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-bold text-white text-xs truncate leading-snug group-hover:text-sky-400 transition-colors font-display">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 truncate">{product.subName}</p>
                      <p className="text-[11px] text-sky-400 font-bold mt-1">R$ {(product.discountPrice || product.price).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5">
              <button
                onClick={startQuiz}
                className="text-slate-400 hover:text-white text-xs font-bold underline flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refazer Perguntas</span>
              </button>

              <button
                onClick={handleAddBundle}
                disabled={isAddingBundle}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-center flex items-center justify-center space-x-2 cursor-pointer font-display"
              >
                {isAddingBundle ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Conectando ao carrinho...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Adicionar Todo o Kit ao Carrinho (Ativar Cupom)</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
