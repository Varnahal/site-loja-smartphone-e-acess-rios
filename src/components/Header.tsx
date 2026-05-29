import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Shield, Zap, Sparkles, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { PRODUCTS } from '../data';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToQuiz: () => void;
}

export default function Header({ cartCount, onOpenCart, onSelectProduct, onNavigateToQuiz }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.subName.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleProductClick = (product: Product) => {
    onSelectProduct(product);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 glass-header px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 cursor-pointer group" id="store-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-9 h-9 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-white tracking-tight uppercase font-display">
            Quantum<span className="text-sky-400">Tech</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-400 font-medium">
          <a href="#featured" className="hover:text-white transition-colors">Smartphones</a>
          <a href="#accessories" className="hover:text-white transition-colors">Acessórios</a>
          <button 
            onClick={onNavigateToQuiz}
            className="flex items-center space-x-1.5 text-sky-400 hover:text-sky-300 font-semibold transition-colors animate-pulse"
          >
            <Sparkles className="h-4 w-4" />
            <span className="font-display">Recomendador IA</span>
          </button>
          <a href="#reviews" className="hover:text-white transition-colors">Depoimentos</a>
          <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center space-x-4">
          
          {/* Brand Seal (Desktops) */}
          <div className="hidden lg:flex items-center space-x-1 text-xs glass bg-white/5 text-slate-350 py-1.5 px-3 rounded-full">
            <Shield className="h-3.5 w-3.5 text-sky-400" />
            <span>Selo de Garantia Anatel</span>
          </div>

          {/* Search Trigger */}
          <button 
            id="toggle-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Buscar produtos"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Shopping Cart Trigger */}
          <button
            id="toggle-cart-btn"
            onClick={onOpenCart}
            className="relative p-2.5 glass text-slate-350 hover:text-white rounded-xl hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:border-sky-500/50 transition-all cursor-pointer group"
          >
            <ShoppingBag className="h-5 w-5 group-hover:scale-105 transition-transform" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-sky-500 text-white font-bold text-xs h-5 w-5 rounded-full flex items-center justify-center shadow-lg border border-slate-950"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

        </div>
      </div>

      {/* Global Interactive Search Bar Slide-Down Panel */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden " id="search-modal-overlay">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="absolute top-0 left-0 right-0 glass-header px-4 md:px-8 py-6 shadow-2xl"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sky-400 text-sm font-semibold font-display">
                    <Sparkles className="h-4 w-4" />
                    <span>Mecanismo de Busca Inteligente</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Busque por 'Titânio', 'Fone ANC', 'Carregador GaN'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass bg-white/5 text-white rounded-xl pl-12 pr-4 py-3.5 border border-white/10 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-base transition-all"
                  />
                </div>

                {/* Search Results Dropdown */}
                <div className="mt-4">
                  {searchQuery.trim().length > 0 ? (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">
                        Resultados encontrados ({searchResults.length})
                      </h4>
                      {searchResults.length > 0 ? (
                        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                          {searchResults.map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleProductClick(product)}
                              className="flex items-center justify-between p-3 glass bg-white/5 hover:bg-sky-500/10 rounded-xl border border-white/5 hover:border-sky-500/30 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-lg object-cover bg-slate-950 p-1 border border-slate-800"
                                />
                                <div className="text-left">
                                  <p className="font-semibold text-white group-hover:text-sky-450 transition-colors">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-slate-400 line-clamp-1">{product.subName}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 text-right">
                                <div>
                                  <p className="font-bold text-white text-sm">
                                    R$ {(product.discountPrice || product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                  {product.discountPrice && (
                                    <p className="text-xs text-slate-500 line-through">
                                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-450 group-hover:text-sky-400 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-500 text-sm">
                          Nenhum circuito ou dispositivo encontrado com "{searchQuery}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-1">
                        Buscas Recomendadas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {['Zenith Ultra', 'ANC', 'Carregador GaN', 'Smartwatch', 'Titânio', 'Bateria 60h'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="glass bg-white/5 hover:bg-white/10 border border-white/5 hover:border-sky-500/30 text-slate-300 hover:text-sky-400 text-xs py-1.5 px-3 rounded-xl transition-all cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
