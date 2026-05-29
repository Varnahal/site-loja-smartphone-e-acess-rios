import React, { useState, useRef, FormEvent } from 'react';
import {
  Shield,
  Sparkles,
  CheckCircle,
  ChevronDown,
  MessageSquare,
  Headphones,
  Zap,
  Battery,
  Camera,
  Star,
  Award,
  Truck,
  ShieldCheck,
  X,
  ArrowRight,
  ChevronRight,
  Heart,
  HelpCircle,
  Cpu,
  Monitor,
  Eye,
  Check,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom Data & Typings
import { Product, CartItem, ProductColor, ProductStorage, Review } from './types';
import { PRODUCTS, REVIEWS, FAQS } from './data';

// Modular Sub-components
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TechMatcherQuiz from './components/TechMatcherQuiz';

export default function App() {
  // Global Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout popup states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Filtering catalog
  const [activeCategory, setActiveCategory] = useState<'all' | 'smartphones' | 'audio' | 'power' | 'wearables'>('all');

  // Specs Modal / Detail State Drawer
  const [activeSpecsProduct, setActiveSpecsProduct] = useState<Product | null>(null);

  // Core specs smartphone comparison table state
  const [compareProductA, setCompareProductB] = useState<Product>(PRODUCTS[0]); // Zenith 1 Ultra
  const [compareProductB, setCompareProductC] = useState<Product>(PRODUCTS[4]); // Zenith 1 Lite (index 4)

  // Interactive Blueprint hotspots state
  const [activeTechPoint, setActiveTechPoint] = useState<string | null>('titanium');

  // Interactive reviews state (to allow upvoting/submitting reviews)
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [upvotedReviews, setUpvotedReviews] = useState<string[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewProduct, setNewReviewProduct] = useState('Zenith Phone 1 Ultra');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  // FAQ open/close states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Toast notifier states
  const [toastMessage, setToastMessage] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, color: ProductColor, storage?: ProductStorage) => {
    const itemUniqueId = `${product.id}-${color.name}-${storage?.size || 'default'}`;
    
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === itemUniqueId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === itemUniqueId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { id: itemUniqueId, product, quantity: 1, selectedColor: color, selectedStorage: storage }];
    });

    showToast(`Adicionado ${product.name} no carrinho!`);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showToast('Item removido do carrinho.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Quiz Matcher triggers bundle additions
  const handleAddBundleToCart = (productIds: string[], couponCode: string) => {
    productIds.forEach((id) => {
      const p = PRODUCTS.find((prod) => prod.id === id);
      if (p) {
        // Automatically choose first color and first storage option if available
        const preferredColor = p.colors && p.colors.length > 0 ? p.colors[0] : { name: 'Padrão', value: '', class: '' };
        const preferredStorage = p.storage && p.storage.length > 0 ? p.storage[0] : undefined;
        
        handleAddToCart(p, preferredColor, preferredStorage);
      }
    });

    // Apply Coupon Code
    setAppliedCoupon(couponCode);
    setAppliedDiscount(couponCode === 'GAMERBOOST15' ? 15 : couponCode === 'CREATORPLUS12' ? 12 : 10);
    
    // Smoothly toggle cart drawer open so user watches their bundle sitting ready
    setTimeout(() => {
      setIsCartOpen(true);
    }, 1000);
  };

  // Review helper feedback
  const handleReviewUpvote = (id: string) => {
    if (upvotedReviews.includes(id)) return;
    
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    setUpvotedReviews((prev) => [...prev, id]);
    showToast('Obrigado pelo seu feedback sobre a avaliação!');
  };

  // Submit custom review
  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newReviewAuthor.trim()) return;

    const newRevObj: Review = {
      id: `rev-custom-${Date.now()}`,
      author: newReviewAuthor,
      avatar: `https://picsum.photos/seed/${newReviewAuthor.toLowerCase()}/100/100`,
      rating: newReviewRating,
      date: 'Hoje',
      text: newReviewText,
      productName: newReviewProduct,
      verified: true,
      helpfulCount: 0
    };

    setReviewsList((prev) => [newRevObj, ...prev]);
    setNewReviewText('');
    setNewReviewAuthor('');
    setReviewSubmitSuccess(true);
    showToast('Depoimento postado com sucesso!');
    setTimeout(() => setReviewSubmitSuccess(false), 4500);
  };

  // Handle newsletter submit
  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterSuccess(true);
    setNewsletterEmail('');
    showToast('Inscrição confirmada! Use o cupom BEMVINDO.');
  };

  // Quick buy action for Hero Section
  const handleHeroBuy = () => {
    const flagship = PRODUCTS[0]; // Zenith Ultra
    const col = flagship.colors ? flagship.colors[0] : { name: 'Titan', value: '', class: '' };
    const st = flagship.storage ? flagship.storage[0] : undefined;

    handleAddToCart(flagship, col, st);
    setIsCartOpen(true);
  };

  // Categories Filtering list
  const filteredCatalog = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const cartTotalSum = cart.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    const modifier = item.selectedStorage ? item.selectedStorage.priceModifier : 0;
    return acc + (price + modifier) * item.quantity;
  }, 0);

  // Tech Blueprint Highlights specs maps
  const techPointsMap: { [key: string]: { title: string; desc: string; icon: any } } = {
    titanium: {
      title: 'Chassi Titânio Aeroespacial',
      desc: 'Liga ultra-resistente de grau 5, reduzindo o peso total em 18% enquanto garante proteção impenetrável contra impactos e torção estrutural.',
      icon: Shield
    },
    neural: {
      title: 'Processamento Titan-X AI',
      desc: 'Semicondutores sub-nanométricos de 3nm capazes de executar 58 trilhões de operações por segundo, auto-otimizando jogos e refinamento de som dinamicamente.',
      icon: Cpu
    },
    lenses: {
      title: 'Câmera Sensorial Neural 200MP',
      desc: 'Abertura principal de f/1.4 com super amostragem pixel-binning 16-em-1. Captura imagens incrivelmente iluminadas e coloridas mesmo sob noites escuras sem ruídos.',
      icon: Camera
    },
    battery: {
      title: 'Célula Silício-Carbono 5500mAh',
      desc: 'Nova fórmula de densidade ultra-compacta que entrega 25% mais amperagem e autonomia no mesmo volume físico, aceitando recargas brutais HyperCharge de 120W.',
      icon: Battery
    }
  };

  return (
    <div className="min-h-screen mesh-bg text-slate-100 font-sans selection:bg-sky-500 selection:text-white overflow-x-hidden scroll-smooth">
      
      {/* Background neon ambient grids */}
      <div className="absolute top-0 left-0 right-0 h-[650px] bg-gradient-to-b from-sky-900/10 via-violet-900/5 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[1200px] -left-20 w-80 h-80 bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[2600px] -right-20 w-80 h-80 bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Sticky Navbar */}
      <Header
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onSelectProduct={(p) => setActiveSpecsProduct(p)}
        onNavigateToQuiz={() => {
          const el = document.getElementById('recommendator-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto z-10" id="hero-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text information column */}
          <div className="lg:col-span-7 text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center space-x-2 glass-accent py-1.5 px-4 rounded-full text-xs font-semibold text-sky-400 font-display">
              <Sparkles className="h-4.5 w-4.5 animate-pulse text-sky-400" />
              <span>Conheça o Futuro do Mobile</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white font-display">
              A evolução do <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Titânio</span> e inteligência no seu bolso
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
              Apresentamos a nova central ultra-tecnológica de dispositivos móveis. Smartphones blindados em Titânio Grau 5 com arquitetura de inteligência artificial de 3nm e acessórios de áudio com cancelamento absoluto.
            </p>

            {/* Micro value badges list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-2 text-slate-350">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 glass rounded-lg text-sky-400">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none font-display">Anatel 100%</p>
                  <span className="text-[10px] text-slate-500 font-sans">Homologado</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 glass rounded-lg text-sky-400">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none font-display">Frete Grátis</p>
                  <span className="text-[10px] text-slate-500 font-sans">Acima de R$ 350</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 col-span-2 sm:col-span-1">
                <div className="p-1.5 glass rounded-lg text-sky-400">
                  <Award className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none font-display">12x Sem Juros</p>
                  <span className="text-[10px] text-slate-500 font-sans">10% OFF no Pix</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-buy-btn"
                onClick={handleHeroBuy}
                className="bg-sky-500 hover:bg-sky-455 text-white font-extrabold py-3.5 px-8 rounded-xl text-sm shadow-xl shadow-sky-505/20 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center space-x-2 font-display"
              >
                <span>Garantir Zenith Phone</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('recommendator-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="glass bg-white/5 hover:bg-white/10 hover:border-white/20 text-sky-400 font-bold py-3.5 px-6 rounded-xl text-sm transition-all text-center cursor-pointer flex items-center justify-center space-x-2 font-display"
              >
                <Sparkles className="h-4 w-4 text-sky-400 animate-pulse" />
                <span>Montar Ecossistema Ideal AI</span>
              </button>
            </div>
          </div>

          {/* Hero interactive visual column (Titanium Phone floating) */}
          <div className="lg:col-span-5 relative flex items-center justify-center h-[350px] md:h-[450px]">
            {/* Blue back glowing disk */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-cyan-500/20 to-blue-600/10 rounded-full blur-[80px]" />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, type: 'spring' }}
              className="relative p-6 max-h-[400px] flex items-center justify-center group"
            >
              <img
                src="/src/assets/images/hero_titanium_phone_1780009633967.png"
                alt="Zenith Phone 1 Ultra"
                referrerPolicy="no-referrer"
                className="max-h-[300px] md:max-h-[380px] w-auto filter drop-shadow-[0_25px_40px_rgba(34,211,238,0.25)] relative z-10 group-hover:rotate-1 transition-transform"
              />

              {/* Float floating specs stickers badges */}
              <div className="absolute top-20 -left-6 glass bg-slate-950/80 rounded-2xl py-2 px-3 shadow-2xl text-left flex items-center space-x-2 z-20 hover:scale-105 transition-transform">
                <span className="p-1.5 glass bg-sky-500/10 text-sky-400 rounded">
                  <Cpu className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-white leading-none font-display">Titan-X AI</p>
                  <span className="text-[9px] text-slate-400 font-mono">Tecnologia 3nm</span>
                </div>
              </div>

              <div className="absolute bottom-16 -right-6 glass bg-slate-950/80 rounded-2xl py-2 px-3 shadow-2xl text-left flex items-center space-x-2 z-20 hover:scale-105 transition-transform">
                <span className="p-1.5 glass bg-sky-500/10 text-sky-400 rounded">
                  <Camera className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-white leading-none font-display">200 megapixels</p>
                  <span className="text-[9px] text-slate-400 font-mono">Câmera Pro Neural</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Trust Highlight banner strip with micro indicators */}
      <section className="bg-slate-950 border-y border-slate-900 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { text: 'Anatel Oficial', desc: 'Selo e homologação Anatel', icon: ShieldCheck },
            { text: 'Frete Grátis Nacional', desc: 'Pedidos acima de R$ 350', icon: Truck },
            { text: 'Garantia de 1 Ano', desc: 'Suporte autorizado no Brasil', icon: Award },
            { text: 'Atendimento Rápido', desc: 'Time via WhatsApp 24h', icon: Headphones }
          ].map((item, i) => {
            const IconComp = item.icon;
            return (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-3.5">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-850 text-cyan-500 shrink-0">
                  <IconComp className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{item.text}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Blueprint Tech Details Feature Explainer */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 font-sans" id="tech-blueprint">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase block font-display">EXPLORE POR DENTRO</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display">Arquitetura de Máxima Engenharia</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">Clique nos pontos de interesse para entender por que as peças de hardware do Zenith Phone 1 definem os novos limites da indústria.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: Floating hotspot phone chassis */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-10 bg-gradient-to-b from-slate-950/20 to-sky-950/5 rounded-3xl border border-white/5 p-4">
            
            {/* Visual Phone with holographic schematic structure overlay */}
            <div className="relative h-[280px] md:h-[400px]">
              <img
                src="/src/assets/images/hero_titanium_phone_1780009633967.png"
                alt="Zenith blueprint structural"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain filter grayscale brightness-50 opacity-80"
              />
              <div className="absolute inset-0 bg-sky-500/10 mix-blend-color-dodge rounded-2xl pointer-events-none" />

              {/* Hotspots */}
              {/* Hotspot 1: Titanium */}
              <button
                type="button"
                onClick={() => setActiveTechPoint('titanium')}
                className={`absolute top-1/4 left-1/2 -translate-x-14 p-1 rounded-full cursor-pointer transition-all ${
                  activeTechPoint === 'titanium' ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <span className="absolute inset-0 rounded-full animate-ping bg-sky-400 opacity-75 inline-flex" />
                <span className="relative flex h-6 w-6 rounded-full bg-sky-500 text-white font-black text-[10px] items-center justify-center border border-slate-950 shadow-md">
                  01
                </span>
              </button>

              {/* Hotspot 2: Processor */}
              <button
                type="button"
                onClick={() => setActiveTechPoint('neural')}
                className={`absolute top-1/2 left-1/2 -translate-x-4 p-1 rounded-full cursor-pointer transition-all ${
                  activeTechPoint === 'neural' ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <span className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-75 inline-flex" />
                <span className="relative flex h-6 w-6 rounded-full bg-indigo-555 text-white font-black text-[10px] items-center justify-center border border-slate-950 shadow-md">
                  02
                </span>
              </button>

              {/* Hotspot 3: Cameras */}
              <button
                type="button"
                onClick={() => setActiveTechPoint('lenses')}
                className={`absolute top-[15%] left-1/2 -translate-x-3.5 p-1 rounded-full cursor-pointer transition-all ${
                  activeTechPoint === 'lenses' ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <span className="absolute inset-0 rounded-full animate-ping bg-sky-400 opacity-75 inline-flex" />
                <span className="relative flex h-6 w-6 rounded-full bg-sky-400 text-white font-black text-[10px] items-center justify-center border border-slate-950 shadow-md">
                  03
                </span>
              </button>

              {/* Hotspot 4: Battery */}
              <button
                type="button"
                onClick={() => setActiveTechPoint('battery')}
                className={`absolute bottom-1/4 left-1/2 -translate-x-[45px] p-1 rounded-full cursor-pointer transition-all ${
                  activeTechPoint === 'battery' ? 'scale-125' : 'hover:scale-110'
                }`}
              >
                <span className="absolute inset-0 rounded-full animate-ping bg-emerald-450 opacity-75 inline-flex" />
                <span className="relative flex h-6 w-6 rounded-full bg-emerald-500 text-white font-black text-[10px] items-center justify-center border border-slate-950 shadow-md">
                  04
                </span>
              </button>
            </div>
          </div>

          {/* Right panel: Active specification info presentation card */}
          <div className="lg:col-span-6 text-left shrink-0">
            <AnimatePresence mode="wait">
              {activeTechPoint && (
                <motion.div
                  key={activeTechPoint}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass bg-[#0a1122]/75 p-6 md:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4 max-w-xl backdrop-blur-xl"
                >
                  <div className="flex items-center space-x-3 text-sky-400">
                    <div className="glass bg-sky-500/10 p-2.5 rounded-xl border border-sky-500/20 text-sky-400">
                      {(() => {
                        const IconComponent = techPointsMap[activeTechPoint].icon;
                        return <IconComponent className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-white font-display">{techPointsMap[activeTechPoint].title}</h4>
                      <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold mt-0.5">Componente de Alta Especificidade</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {techPointsMap[activeTechPoint].desc}
                  </p>

                  <div className="pt-4 border-t border-slate-900 text-xs space-y-2 text-slate-450">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>Componente sob garantia integrada de 365 dias.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>Fórmula patenteada internacionalmente QuantumTech.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Micro selector tags list to click instead of dots */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { id: 'titanium', label: '01. Liga de Titânio 5' },
                { id: 'neural', label: '02. Processador Titan-X AI' },
                { id: 'lenses', label: '03. Lente Neural 200MP' },
                { id: 'battery', label: '04. Bateria Silício-Carbono' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveTechPoint(btn.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer font-display ${
                    activeTechPoint === btn.id
                      ? 'bg-[#0e2142]/85 text-sky-400 border-sky-450/40 shadow-sm shadow-sky-500/10'
                      : 'glass-btn text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Showcase Gallery Grid */}
      <section className="py-16 border-y border-white/5 px-4 md:px-8 z-10" id="featured">
        <div className="max-w-7xl mx-auto">
          
          {/* Header catalog information */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
            <div className="text-left space-y-2.5 font-sans">
              <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase block font-display">CATÁLOGO COMPLETO</span>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none font-display">Vitrine de Dispositivos</h2>
              <p className="text-xs text-slate-400">Pressione qualquer filtro abaixo para classificar nossa linha premium ativa.</p>
            </div>

            {/* Beautiful Category Tab Switcher filter list */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'smartphones', label: 'Smartphones' },
                { id: 'wearables', label: 'Wearables' },
                { id: 'audio', label: 'Áudio Pro' },
                { id: 'power', label: 'Energia GaN' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none font-display ${
                    activeCategory === tab.id
                      ? 'bg-sky-500 border-sky-450 text-white shadow-md shadow-sky-550/15'
                      : 'glass-btn text-slate-300 border-white/5 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product cards response grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCatalog.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewSpecs={setActiveSpecsProduct}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Interactive side-by-side core Smartphone Comparison Matrix section */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto z-10" id="comparison">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase block font-display">COMPARAÇÃO DIRETA</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">Qual Zenith É Ideal Para Você?</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans">Compare as especificações fundamentais de nossos smartphones principais e observe as diferenças lado a lado.</p>
        </div>

        <div className="max-w-4xl mx-auto glass bg-[#0a1122]/75 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-2xl">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-white/10 items-center font-sans">
            
            <span className="col-span-1 text-xs font-bold text-slate-500 uppercase tracking-widest text-left font-display">Especificação</span>
            
            {/* Compare A header info card */}
            <div className="col-span-1 text-center">
              <h4 className="text-sm font-extrabold text-sky-400 font-display">{compareProductA.name}</h4>
              <span className="text-[10px] text-slate-500 font-mono">Flagship Titanium</span>
            </div>

            {/* Compare B header info card */}
            <div className="col-span-1 text-center">
              <h4 className="text-sm font-extrabold text-[#34d399] font-display">{compareProductB.name}</h4>
              <span className="text-[10px] text-slate-500 font-mono">Lite Premium</span>
            </div>
          </div>

          {/* Comparative metrics grids list */}
          <div className="divide-y divide-slate-900 text-xs py-2">
            {[
              { label: 'Processamento', specKey: 'Processador' },
              { label: 'Memória RAM', specKey: 'Memória RAM' },
              { label: 'Tela & Painel', specKey: 'Tela' },
              { label: 'Câmera Traseira', specKey: 'Câmera Traseira' },
              { label: 'Carregamento / Watts', specKey: 'Carregamento' },
              { label: 'Proteção contra Água', specKey: 'Proteção' }
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 py-3 items-center">
                <span className="col-span-1 text-left font-semibold text-slate-400">{row.label}</span>
                <span className="col-span-1 text-center text-slate-200 text-xs pl-2 pr-2 leading-tight">
                  {compareProductA.specs[row.specKey] || compareProductA.specs['OS'] || 'Consulte'}
                </span>
                <span className="col-span-1 text-center text-slate-200 text-xs pl-2 pr-2 leading-tight">
                  {compareProductB.specs[row.specKey] || compareProductB.specs['OS'] || 'Consulte'}
                </span>
              </div>
            ))}

            {/* Pricing compare line */}
            <div className="grid grid-cols-3 gap-4 py-4 items-center font-bold">
              <span className="col-span-1 text-left text-sm text-white font-extrabold font-display">Preço à vista (Pix)</span>
              <span className="col-span-1 text-center text-sm text-sky-400 font-mono">
                R$ {((compareProductA.discountPrice || compareProductA.price) * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="col-span-1 text-center text-sm text-emerald-400 font-mono">
                R$ {((compareProductB.discountPrice || compareProductB.price) * 0.9).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex justify-center space-x-4">
            <button
              onClick={() => handleAddToCart(compareProductA, compareProductA.colors ? compareProductA.colors[0] : { name: 'Titan', value: '', class: '' })}
              className="bg-sky-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-sky-450 transition-all cursor-pointer font-display"
            >
              Comprar {compareProductA.name}
            </button>
            <button
              onClick={() => handleAddToCart(compareProductB, compareProductB.colors ? compareProductB.colors[0] : { name: 'Titan', value: '', class: '' })}
              className="bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs hover:bg-emerald-450 transition-all cursor-pointer font-display"
            >
              Comprar {compareProductB.name}
            </button>
          </div>
        </div>
      </section>

      {/* Gamified AI Matcher Quiz Section (Fascinating customer value addition) */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto z-10" id="recommendator-section">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase block font-display">RECOMENDADOR DE ECOSSISTEMA</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">Seu Estilo, Seu Kit Otimizado</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto font-sans">Não desperdice dinheiro com tecnologia desnecessária. Deixe nossa inteligência sugerir o kit ideal para sua rotina com descontos exclusivos.</p>
        </div>

        <TechMatcherQuiz
          onAddBundleToCart={(ids, code) => handleAddBundleToCart(ids, code)}
          onSelectProduct={(p) => setActiveSpecsProduct(p)}
        />
      </section>

      {/* Trust Signals Reviews Portal component (Highly immersive, interactive) */}
      <section className="py-16 border-y border-white/5 px-4 md:px-8 z-10" id="reviews">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-2.5 mb-12">
            <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase block font-display">DEPOIMENTOS DE CLIENTES</span>
            <h2 className="text-3xl font-black text-white tracking-tight font-display">Quem Já Migrou Para a QuantumTech</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">Vozes reais da nossa comunidade de entusiastas de tecnologia de performance ativa.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: List of posted active evaluations */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsList.map((review) => (
                  <motion.div
                    key={review.id}
                    layoutId={`review-card-${review.id}`}
                    className="p-5 glass-card rounded-2xl flex flex-col justify-between text-left space-y-4"
                  >
                    <div className="space-y-2.5 font-sans">
                      {/* Rating details & item name stamp */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating ? 'fill-current' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono font-medium text-slate-500">
                          {review.date}
                        </span>
                      </div>

                      {/* Purchased Model indicator */}
                      <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-sky-400 glass bg-sky-500/15 p-1.5 rounded inline-block font-display">
                        Adquiriu: {review.productName}
                      </span>

                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{review.text}"
                      </p>
                    </div>

                    {/* Author footer segment */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/5 font-sans">
                      <div className="flex items-center space-x-2">
                        <img
                          src={review.avatar}
                          alt={review.author}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full border border-white/10"
                        />
                        <div>
                          <p className="text-xs font-bold text-white font-display">{review.author}</p>
                          {review.verified && (
                            <span className="text-[9px] text-emerald-400 font-semibold flex items-center">
                              <Check className="h-2.5 w-2.5 mr-0.5" />
                              <span>Comprador Verificado</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interactive Helpful Upvote key */}
                      <button
                        onClick={() => handleReviewUpvote(review.id)}
                        disabled={upvotedReviews.includes(review.id)}
                        className={`text-[10px] py-1 px-2.5 rounded-lg border flex items-center space-x-1 transition-all cursor-pointer font-display ${
                          upvotedReviews.includes(review.id)
                            ? 'bg-sky-500/10 border-sky-500 text-sky-400'
                            : 'glass-btn border-white/5 text-slate-500 hover:text-slate-100'
                        }`}
                      >
                        <Heart className={`h-3 w-3 ${upvotedReviews.includes(review.id) ? 'fill-current' : ''}`} />
                        <span>({review.helpfulCount}) Útil</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Mini-form allowing the reviewer in the preview to post as well */}
            <div className="lg:col-span-4 glass bg-[#0a1122]/75 border border-white/10 p-6 rounded-3xl flex flex-col justify-between backdrop-blur-2xl shadow-xl font-sans">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white flex items-center font-display">
                    <MessageSquare className="h-4 w-4 text-sky-400 mr-2" />
                    <span>Deixe sua Opinião</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Sua experiência nos ajuda a aprimorar nosso processador e serviços!</p>
                </div>

                <div className="space-y-3.5 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-400 font-black font-display">Seu Nome</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: João Silva"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full glass-input text-xs text-white rounded-xl py-2 px-3 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-400 font-black font-display">Modelo Escolhido</label>
                    <select
                      value={newReviewProduct}
                      onChange={(e) => setNewReviewProduct(e.target.value)}
                      className="w-full glass-input text-xs text-white rounded-xl py-2 px-3 outline-none"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.name} className="bg-slate-950 text-xs">
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-400 font-black font-display">Nota de recomendação</label>
                    <div className="flex space-x-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNewReviewRating(val)}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              val <= newReviewRating ? 'text-amber-400 fill-current' : 'text-slate-800'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-mono text-slate-400 font-black font-display">Seu Depoimento</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Conte sobre ergonomia, velocidade do Pix e por que escolheu QuantumTech..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      className="w-full glass-input text-xs text-white rounded-xl py-2 px-3 outline-none resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-sky-450 transition-all text-center cursor-pointer font-display shadow-lg shadow-sky-500/10"
                >
                  Postar Avaliação
                </button>

                {reviewSubmitSuccess && (
                  <p className="text-[10px] text-emerald-400 font-bold text-center pl-1 animate-pulse">
                    Obrigado! Sua avaliação foi cadastrada com sucesso.
                  </p>
                )}
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* Beautiful Accordion Interactive FAQs section */}
      <section className="py-16 md:py-20 px-4 md:px-8 max-w-4xl mx-auto z-10 font-sans" id="faq">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-mono tracking-widest text-sky-400 font-bold uppercase block font-display">AJUDA & DÚVIDAS</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">Perguntas Frequentes</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Compreenda a nossa operação e obtenha respostas imediatas sobre entregas e garantias.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="glass bg-[#0a1122]/40 border border-white/5 rounded-2xl hover:border-white/10 overflow-hidden transition-all duration-300 text-left cursor-pointer"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full py-4.5 px-6 flex items-center justify-between font-bold text-white text-sm focus:outline-none cursor-pointer font-display"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 ${
                    openFaqIndex === idx ? 'rotate-180 text-sky-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="pb-5 px-6 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-900">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Newsletter Glow-up subscription card banner */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto z-10" id="newsletter">
        <div className="relative glass bg-[#0a1122]/50 border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl text-center flex flex-col items-center backdrop-blur-2xl">
          
          {/* Neon blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[80px] pointer-events-none rounded-full" />
          
          <div className="inline-flex items-center space-x-1 border border-sky-500/20 bg-sky-500/10 text-sky-400 py-1 px-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 font-display">
            <Gift className="h-3 w-3 animate-bounce" />
            <span>Desconto na primeira compra</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">Receba Ofertas e Novidades Biotech</h3>
          <p className="text-xs text-slate-400 mt-2 max-w-md font-sans">Não perca o lançamento de nossos novos fones acústicos híbridos de grafeno e ganhe um código de boas-vindas especial.</p>

          <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-2.5 w-full max-w-md font-sans">
            <input
              required
              type="email"
              placeholder="Digite seu endereço de email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 glass-input text-xs text-white rounded-xl py-3 px-4 outline-none"
            />
            <button
              type="submit"
              className="bg-sky-500 text-white font-extrabold text-xs py-3 px-6 rounded-xl hover:bg-sky-455 transition-all cursor-pointer shadow-lg shadow-sky-500/10 shrink-0 font-display"
            >
              Registrar E-mail
            </button>
          </form>

          {newsletterSuccess && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-4 bg-emerald-950/40 border border-emerald-900/60 py-2 px-4 rounded-xl text-xs text-emerald-400 font-semibold"
            >
              Sucesso! Use o cupom <strong>BEMVINDO</strong> para 10% de desconto no carrinho!
            </motion.div>
          )}
        </div>
      </section>

      {/* Trust Badge details / full Footer */}
      <footer className="border-t border-white/5 bg-[#030712]/50 backdrop-blur-md pt-16 pb-8 px-4 md:px-8 z-10 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/5">
          
          {/* Logo segment */}
          <div className="text-left space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-sky-500 p-1.5 rounded-lg text-white">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white font-display">Quantum<span className="text-sky-400">Tech</span></span>
            </div>
            <p className="text-xs text-slate-450 leading-relaxed max-w-[200px]">Dispositivos eletrônicos originais homologados Anatel para entusiastas de máxima entrega.</p>
          </div>

          {/* Nav links column 1 */}
          <div className="text-left space-y-3.5">
            <h5 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 font-display">Smartphones</h5>
            <div className="flex flex-col space-y-2 text-xs text-slate-400 font-medium">
              <a href="#featured" className="hover:text-sky-400 transition-colors">Zenith 1 Ultra</a>
              <a href="#featured" className="hover:text-sky-400 transition-colors">Zenith 1 Lite</a>
              <a href="#tech-blueprint" className="hover:text-sky-400 transition-colors">Garantia e Processador</a>
            </div>
          </div>

          {/* Nav links column 2 */}
          <div className="text-left space-y-3.5">
            <h5 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 font-display">Acessórios Pro</h5>
            <div className="flex flex-col space-y-2 text-xs text-slate-400 font-medium">
              <a href="#featured" className="hover:text-sky-400 transition-colors">Smartwatch 4S</a>
              <a href="#featured" className="hover:text-sky-400 transition-colors">Headphones ANC</a>
              <a href="#featured" className="hover:text-sky-400 transition-colors">Adaptadores GaN</a>
            </div>
          </div>

          {/* Contact help line */}
          <div className="text-left space-y-3.5 text-xs text-slate-400">
            <h5 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400 font-display">Suporte Oficial</h5>
            <p className="leading-relaxed">Dúvidas? Entre em contato agora pelo <span className="text-[#34d399] font-bold block">sac@quantumtech.com.br</span> ou chat de suporte.</p>
            <div className="flex items-center space-x-1 glass bg-white/2 border border-white/5 p-2 rounded-xl text-[10px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-sky-400 mr-1 shrink-0" />
              <span>Plataforma Oficial Segura QuantumTech Brasil S/A</span>
            </div>
          </div>

        </div>

        {/* Footnotes regulatory standards */}
        <div className="max-w-7xl mx-auto pt-6 text-center text-[10px] text-slate-600 space-y-2">
          <p>© 2026 QuantumTech Store Brasil LTDA. CNPJ: 29.400.952/0001-92. Todos os direitos reservados.</p>
          <p>Preços e condições de parcelamento de até 12x são de exclusividade desta landing page, válidos até o final de estoque. Compras via Pix contam com desconto acumulável de 10% adicionais automáticos calculados sob o subtotal final.</p>
        </div>
      </footer>

      {/* Global Interactive Shopping Cart Slide Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={(id, delta) => handleUpdateCartQty(id, delta)}
        onRemoveItem={(id) => handleRemoveCartItem(id)}
        onCheckout={(percentage, code) => {
          setAppliedDiscount(percentage);
          setAppliedCoupon(code);
          setIsCartOpen(false);   // close cart
          setIsCheckoutOpen(true); // open checkout
        }}
      />

      {/* Checkout Processing Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        subtotal={cartTotalSum}
        discountPercentage={appliedDiscount}
        couponCode={appliedCoupon}
        onClearCart={handleClearCart}
      />

      {/* Technical Specifications Spotlight Drawer Detail dialog popup */}
      <AnimatePresence>
        {activeSpecsProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSpecsProduct(null)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />

            {/* Content card popup panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass bg-[#0a1122]/90 border border-white/10 rounded-3xl p-5 md:p-8 max-w-xl w-full z-10 shadow-2xl overflow-hidden backdrop-blur-2xl"
            >
              {/* Close x */}
              <button
                onClick={() => setActiveSpecsProduct(null)}
                className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-left space-y-4">
                <div className="flex items-center space-x-3.5 pb-3 border-b border-white/10">
                  <img
                    src={activeSpecsProduct.image}
                    alt={activeSpecsProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-contain rounded-lg glass bg-white/2 p-1"
                  />
                  <div>
                    <h3 className="text-lg font-extrabold text-white font-display">{activeSpecsProduct.name}</h3>
                    <p className="text-xs text-sky-400 font-display font-semibold">{activeSpecsProduct.subName}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display">Ficha Técnica Completa</h4>
                  
                  <div className="grid grid-cols-1 gap-2 glass bg-white/2 p-4 rounded-xl border border-white/5 text-xs font-sans">
                    {Object.entries(activeSpecsProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-baseline py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-slate-400 shrink-0 font-medium">{key}</span>
                        <span className="text-slate-200 text-right pl-4 text-xs font-semibold font-mono">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      // Add to cart with default options from detail page
                      const preferredColor = activeSpecsProduct.colors && activeSpecsProduct.colors.length > 0 ? activeSpecsProduct.colors[0] : { name: 'Padrão', value: '', class: '' };
                      const preferredStorage = activeSpecsProduct.storage && activeSpecsProduct.storage.length > 0 ? activeSpecsProduct.storage[0] : undefined;
                      
                      handleAddToCart(activeSpecsProduct, preferredColor, preferredStorage);
                      setActiveSpecsProduct(null);
                    }}
                    className="bg-sky-500 text-white font-black py-2.5 px-6 rounded-xl text-xs hover:bg-sky-455 transition-all text-center cursor-pointer font-display shadow-lg shadow-sky-500/10"
                  >
                    Colocar no Carrinho
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Floating global dynamic success notification toast */}
      <AnimatePresence>
        {showNotificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 s:bottom-8 right-4 sm:right-6 glass bg-[#0a1122]/95 border border-sky-500/40 text-slate-100 font-semibold p-4 rounded-2xl flex items-center space-x-3.5 shadow-2xl z-50 max-w-[280px] backdrop-blur-xl"
            id="toast-alert"
          >
            <div className="bg-sky-500/10 p-1 rounded-lg text-sky-400 shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <p className="text-xs text-left leading-snug font-sans">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
