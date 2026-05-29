import { useState } from 'react';
import { Star, Shield, Cpu, RefreshCw, ShoppingCart, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductColor, ProductStorage } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onAddToCart: (product: Product, selectedColor: ProductColor, selectedStorage?: ProductStorage) => void;
  onViewSpecs: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewSpecs }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Padrão', value: '', class: '' }
  );
  
  const [selectedStorage, setSelectedStorage] = useState<ProductStorage | undefined>(
    product.storage && product.storage.length > 0 ? product.storage[0] : undefined
  );
  
  const [isAddedToast, setIsAddedToast] = useState(false);

  const discountedPrice = product.discountPrice || product.price;
  
  // Calculate final price with storage upgrade modifier
  const storageModifier = selectedStorage ? selectedStorage.priceModifier : 0;
  const currentBasePrice = product.price + storageModifier;
  const currentDiscountPrice = product.discountPrice ? (product.discountPrice + storageModifier) : undefined;
  const finalPrice = currentDiscountPrice || currentBasePrice;
  
  // 10% off on Pix
  const pixPrice = finalPrice * 0.9;

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, selectedStorage);
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
    }, 2000);
  };

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      id={`product-card-${product.id}`}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col glass-card rounded-2xl overflow-hidden"
    >
      {/* Absolute Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-1">
        {product.isNew && (
          <span className="bg-sky-500 text-white text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full shadow-lg font-display">
            NOVIDADE
          </span>
        )}
        {product.isPopular && (
          <span className="bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-[10px] font-black uppercase tracking-wider py-1 px-2.5 rounded-full shadow-lg font-display">
            MAIS VENDIDO
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center glass bg-black/40 px-2 py-1 rounded-lg border border-white/10 text-amber-400 text-xs font-semibold">
        <Star className="h-3.5 w-3.5 fill-current mr-1" />
        <span>{product.rating}</span>
      </div>

      {/* Image Container with high detail overlay */}
      <div className="p-6 pb-2 pt-8 flex items-center justify-center min-h-[220px] relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent rounded-t-2xl pointer-events-none" />
        <motion.img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="max-h-[190px] w-auto max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(56,189,248,0.25)] pointer-events-auto"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase bg-sky-500/10 border border-sky-500/20 py-0.5 px-2 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight leading-snug font-display">
          {product.name}
        </h3>
        
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        {/* Dynamic Color Selector (if available) */}
        {product.colors && product.colors.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Cor: <span className="text-slate-200 font-medium">{selectedColor.name}</span></span>
            <div className="flex space-x-1.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full ${color.class} border-2 ${
                    selectedColor.name === color.name ? 'border-sky-400 scale-110 shadow-md shadow-sky-400/20' : 'border-slate-900'
                  } transition-all duration-200 focus:outline-none cursor-pointer`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Storage Selector (if available) */}
        {product.storage && product.storage.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Armazenamento:</span>
            <div className="flex space-x-1">
              {product.storage.map((st) => (
                <button
                  key={st.size}
                  onClick={() => setSelectedStorage(st)}
                  className={`text-[10px] font-bold py-1 px-2.5 rounded-md border ${
                    selectedStorage?.size === st.size
                      ? 'bg-sky-500/10 border-sky-500 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                      : 'glass bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                  } transition-all focus:outline-none cursor-pointer`}
                >
                  {st.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Technical Highlights Section */}
        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center space-x-1">
            <Cpu className="h-3 w-3 text-sky-400" />
            <span className="truncate">{Object.keys(product.specs)[0] || 'Original'}: {Object.values(product.specs)[0] || 'Premium'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-sky-400" />
            <span className="truncate">Garantia 1 Ano</span>
          </div>
        </div>

        {/* Pricing Segment */}
        <div className="mt-5 space-y-1">
          <div className="flex items-baseline space-x-2">
            {currentDiscountPrice ? (
              <>
                <span className="text-xl font-extrabold text-white font-display">
                  R$ {currentDiscountPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs text-slate-500 line-through">
                  R$ {currentBasePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </>
            ) : (
              <span className="text-xl font-extrabold text-white font-display">
                R$ {currentBasePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1 text-xs bg-sky-500/10 text-sky-400 py-1.5 px-2 rounded-lg border border-sky-500/15">
            <RefreshCw className="h-3 w-3 animate-spin duration-3000" />
            <span>ou <strong className="font-bold">R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> no Pix <span className="font-semibold text-[10px] bg-sky-500 text-white px-1 py-0.2 rounded ml-1">10% OFF</span></span>
          </div>

          <p className="text-[10px] text-slate-500">
            Ou 12x de R$ {(finalPrice / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} sem juros
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          {/* Info trigger */}
          <button
            onClick={() => onViewSpecs(product)}
            className="col-span-1 flex items-center justify-center glass bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer animate-none"
            title="Especificações Técnicas"
          >
            <Info className="h-4.5 w-4.5" />
          </button>
          
          {/* Main ATC button */}
          <button
            onClick={handleAddToCart}
            className="col-span-4 flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm py-2 px-3 rounded-xl shadow-lg shadow-sky-500/20 active:scale-95 transition-all duration-150 cursor-pointer font-display"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Comprar</span>
          </button>
        </div>
      </div>

      {/* Embedded added toast */}
      <AnimatePresence>
        {isAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-16 left-4 right-4 bg-emerald-500 text-slate-950 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1.5 shadow-xl shadow-emerald-950/40 z-20 pointer-events-none"
          >
            <Check className="h-4 w-4" />
            <span>Adicionado ao carrinho com sucesso!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
