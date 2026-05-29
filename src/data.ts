import { Product, Review, TechMatchingResult } from './types';

// Realist paths to generated images and high quality CDN fallback references
export const PRODUCTS: Product[] = [
  {
    id: 'zenith-phone-1-ultra',
    name: 'Zenith Phone 1 Ultra',
    subName: 'A Revolução do Titânio e Inteligência Artificial',
    category: 'smartphones',
    price: 6499,
    discountPrice: 5849,
    rating: 4.9,
    reviewsCount: 148,
    description: 'Experimente a vanguarda tecnológica com chassi em Titânio Aeroespacial, processador Titan-X AI integrado de 3nm e o sistema de câmera neural de 200MP mais avançado do planeta.',
    image: '/src/assets/images/hero_titanium_phone_1780009633967.png',
    isNew: true,
    isPopular: true,
    features: [
      'Chassi em Titânio de Grau Aeroespacial',
      'Processador Titan-X AI (3nm)',
      'Câmera Ultra-Sensorial Neural de 200MP',
      'Suporte a conexões via Satélite Bifluxo',
      'Tela AMOLED LTPO 1.5K de 144Hz',
      'Bateria Silício-Carbono de 5500mAh'
    ],
    colors: [
      { name: 'Titânio Natural', value: '#A1A1AA', class: 'bg-zinc-400' },
      { name: 'Nébula Azul', value: '#1E3A8A', class: 'bg-blue-900' },
      { name: 'Obsidiana Negra', value: '#090D16', class: 'bg-slate-950' }
    ],
    storage: [
      { size: '256GB', priceModifier: 0 },
      { size: '512GB', priceModifier: 600 },
      { size: '1TB', priceModifier: 1400 }
    ],
    specs: {
      'Processador': 'Titan-X AI Octa-core (3nm)',
      'Memória RAM': '12GB / 16GB LPDDR5X',
      'Tela': 'X-OLED 6.82" (1-144Hz LTPO), HDR10+, 3000 nits',
      'Câmera Traseira': '200MP (Principal OIS) + 50MP (Ultrawide) + 50MP (Telefoto Periscópica 5x)',
      'Câmera Frontal': '32MP Dual Pixel AI',
      'Carregamento': '120W HyperCharge com fio, 50W sem fio',
      'Proteção': 'IP68 Contra Água e Poeira',
      'OS': 'ZenithOS v3 (Baseado em Android 16 - 7 anos de atualizações)'
    }
  },
  {
    id: 'quantum-watch-4s',
    name: 'Quantum Watch 4S',
    subName: 'Alta Performance Biométrica no Pulso',
    category: 'wearables',
    price: 1899,
    discountPrice: 1699,
    rating: 4.8,
    reviewsCount: 92,
    description: 'Um novo parâmetro em vestíveis premium. Monitoramento de eletrocardiograma (ECG) clínico, oximetria avançada sob demanda e sensores de esporte extremo imersos em cristal de safira.',
    image: '/src/assets/images/smartwatch_premium_1780009654018.png',
    isPopular: true,
    features: [
      'Caixa de Titânio de 47mm ultra resistente',
      'Sensor Cardíaco Bio-Tríplice com ECG',
      'Tela Retina AMOLED Always-On adaptativa',
      'Até 14 dias de bateria em uso normal',
      'GPS de dupla frequência com mapeamento offline'
    ],
    colors: [
      { name: 'Titânio Escovado', value: '#D4D4D8', class: 'bg-zinc-300' },
      { name: 'Negro Profundo', value: '#111827', class: 'bg-gray-900' }
    ],
    specs: {
      'Tamanho da Caixa': '47mm',
      'Material de Tela': 'Cristal de Safira Resistente a Riscos',
      'Sensores': 'Acelerômetro, Giroscópio, Altímetro, Bússola, SpO2, ECG, Sensor de Temperatura Corporal',
      'Bateria': '500mAh (Até 14 dias em modo econômico, 48h com GPS total)',
      'Resistência à Água': '10 ATM (Apropriado para mergulho recreativo)'
    }
  },
  {
    id: 'aura-sound-max-anc',
    name: 'Aura Sound Max ANC',
    subName: 'Silêncio Absoluto. Fidelidade Acústica Espacial.',
    category: 'audio',
    price: 1299,
    discountPrice: 1149,
    rating: 4.7,
    reviewsCount: 76,
    description: 'Isolamento extremo de até 45dB com cancelamento híbrido inteligente de ruído, drivers de berílio customizados de 40mm para graves imperturbáveis e suporte a áudio lossless espacial com rastreamento cefálico.',
    image: '/src/assets/images/accessories_showcase_1780009668932.png',
    isNew: true,
    features: [
      'ANC Híbrido Avançado de 45dB com IA',
      'Rastreamento Dinâmico de Cabeça para Áudio Espacial',
      'Conexão multiponto fluida (celular/PC/tablet)',
      'Bateria monstruosa de 60 horas de reprodução',
      'Acabamento em alumínio adonisado e almofadas Memory Foam'
    ],
    colors: [
      { name: 'Azul Abissal', value: '#1E293B', class: 'bg-slate-800' },
      { name: 'Gelo Polar', value: '#F1F5F9', class: 'bg-slate-100' }
    ],
    specs: {
      'Tamanho do Driver': 'Drivers Dinâmicos de Berílio de 40mm',
      'Codec de Áudio': 'LDAC, AAC, aptX Adaptive, SBC',
      'Bluetooth': 'v5.4 Multi-Stream',
      'Cancelamento': 'Sistema ativo inteligente de 4 microfones internos/externos',
      'Autonomia': 'Até 60h (ANC desativado) ou 40h (ANC ativado)',
      'Carregamento Rápido': '10 min de carga entrega até 6h de áudio'
    }
  },
  {
    id: 'velo-charge-140w-gan',
    name: 'Velo Charge 140W GaN 5 Pro',
    subName: 'Potência Máxima no Menor Tamanho',
    category: 'power',
    price: 449,
    discountPrice: 399,
    rating: 4.9,
    reviewsCount: 220,
    description: 'Substitua todos os seus carregadores antigos. O Velo Charge GaN de 140W é capaz de recarregar um notebook premium, seu tablet e smartphone simultaneamente com eficiência térmica inigualável.',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=600&q=80',
    features: [
      'Semicondutores GaN de 5ª Geração ultra frios',
      '140W de potência máxima concentrada',
      'Distribuição dinâmica de carga (PowerSplit)',
      '3 portas USB-C Power Delivery 3.1 + 1 USB-A QuickCharge'
    ],
    colors: [
      { name: 'Fosco Negro', value: '#1F2937', class: 'bg-gray-800' },
      { name: 'Branco Cerâmico', value: '#FFFFFF', class: 'bg-white border border-gray-200' }
    ],
    specs: {
      'Protocolos': 'PD 3.1, QC 4.0+, PPS, SCP, AFC',
      'Entradas': '100-240V ~ 50/60Hz (Bivolt automático)',
      'Saídas': 'Dual USB-C (até 140W individual) | Single USB-A (até 30W)',
      'Eficiência Térmica': 'Redução de até 18°C em comparação a carregadores de silício padrão'
    }
  },
  {
    id: 'zenith-phone-1-lite',
    name: 'Zenith Phone 1 Lite',
    subName: 'A Essência Tecnológica Acessível',
    category: 'smartphones',
    price: 3499,
    discountPrice: 3199,
    rating: 4.6,
    reviewsCount: 64,
    description: 'Alta tecnologia sem concessões. Um corpo fino com tela AMOLED vibrante de 120Hz, processador Titan-Y otimizado para jogos e câmera noturna Super-OIS de 64MP.',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    features: [
      'Processador octa-core Titan-Y com 5G',
      'Tela AMOLED Plana HDR10+ de 120Hz',
      'Câmera traseira Super-OIS de 64MP',
      'Fino com apenas 7.4mm e traseira de vidro fosco',
      'Bateria para o dia todo com carga rápida de 67W'
    ],
    colors: [
      { name: 'Carbono Polar', value: '#374151', class: 'bg-gray-700' },
      { name: 'Menta Pastel', value: '#A7F3D0', class: 'bg-emerald-200' },
      { name: 'Quartzo Rosa', value: '#FCE7F3', class: 'bg-pink-100' }
    ],
    storage: [
      { size: '128GB', priceModifier: 0 },
      { size: '256GB', priceModifier: 300 }
    ],
    specs: {
      'Processador': 'Titan-Y Octa-core (4nm)',
      'Memória RAM': '8GB LPDDR4X',
      'Tela': 'AMOLED 6.55" FHD+ (120Hz Flat), 1800 nits de pico',
      'Câmera Traseira': '64MP (Principal OIS) + 8MP (Ultrawide) + 2MP (Macro)',
      'Câmera Frontal': '16MP Autofoco',
      'Carregamento': '67W Turbo ao extremo',
      'IP Rating': 'IP54 Suor e respingos leves'
    }
  },
  {
    id: 'aura-audio-pro-tws',
    name: 'Aura Audio Pro TWS',
    subName: 'Ergonomia Pura e Som Cristalino',
    category: 'audio',
    price: 699,
    discountPrice: 599,
    rating: 4.8,
    reviewsCount: 112,
    description: 'Fone in-ear ultra-anatômico projetado com silicone líquido que não cai. Graves potentes e canais de streaming isolados por cancelamento de som estático.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    features: [
      'Ponteiras de silicone termorresponsivas premium',
      'Drivers Bio-Diafragma de 11mm para som encorpado',
      'Latência ultra baixa (48ms) ideal para Gamers',
      'Classificação IPX7 para treinos intensos na chuva'
    ],
    colors: [
      { name: 'Gelo Sólido', value: '#F3F4F6', class: 'bg-gray-100' },
      { name: 'Onix Profundo', value: '#1F2937', class: 'bg-gray-800' }
    ],
    specs: {
      'Drivers': 'Custom 11mm Bio-Composite',
      'Latência': '48ms Ultra Low Latency GameMode',
      'Bluetooth': 'v5.3 Core LE',
      'Autonomia': '8h in-ear + 24h na case de carregamento rápido',
      'Isolamento': 'Cancelamento de Ruído Ambient (ENC) com 3 microfones por fone'
    }
  },
  {
    id: 'magcore-3in1-foldable',
    name: 'Base Magnética MagCore 3-em-1',
    subName: 'Alinhamento Magnético Triplo e Rápido',
    category: 'power',
    price: 599,
    discountPrice: 499,
    rating: 4.7,
    reviewsCount: 54,
    description: 'Mantenha sua escrivaninha ou criado-mudo impecável com a MagCore. Dobre-a em um pacote minimalista e leve na sua mala para carregar seus aparelhos preferidos com máxima velocidade através de bobinas de cobre puro.',
    image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80',
    features: [
      'Dobrável em silicone e liga de alumínio premium',
      'Carrega Smartphone (15W), Watch (5W) e Buds (5W) de uma só vez',
      'Alinhamento magnético duplo N52 super resistente',
      'LED indicador discreto inteligente para sono'
    ],
    colors: [
      { name: 'Escuro Fosco', value: '#111827', class: 'bg-gray-900' },
      { name: 'Prateado Platina', value: '#E5E7EB', class: 'bg-gray-200' }
    ],
    specs: {
      'Estrutura': 'Alumínio de Aviação revestido em silicone hipoalergênico',
      'Bobinas': '3 bobinas independentes integradas',
      'Total Output': 'Até 25W combinado',
      'Porta de Alimentação': 'USB Tipo-C (cabo resistente e adaptador já inclusos)'
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Guilherme Siqueira',
    avatar: 'https://picsum.photos/seed/guilherme/100/100',
    rating: 5,
    date: '12/05/2026',
    text: 'O Zenith Phone 1 Ultra é simplesmente fantástico! Migrei de outro flagship e a inteligência do processamento de fotos é algo de outro mundo. O acabamento em titânio se sente muito resistente e confortável, sem contar a tela de 144Hz que é liso demais.',
    productName: 'Zenith Phone 1 Ultra',
    verified: true,
    helpfulCount: 42
  },
  {
    id: 'rev-2',
    author: 'Mariana Duarte',
    avatar: 'https://picsum.photos/seed/mariana/100/100',
    rating: 5,
    date: '24/04/2026',
    text: 'Uso o Quantum Watch 4S para monitoramento de rotina de triatlo. O GPS de dupla frequência não oscila nos túneis ou montanhas e a bateria me entrega 10 dias inteiros com uso de notificações ativo. Muito superior.',
    productName: 'Quantum Watch 4S',
    verified: true,
    helpfulCount: 29
  },
  {
    id: 'rev-3',
    author: 'Thiago Fontes',
    avatar: 'https://picsum.photos/seed/thiago/100/100',
    rating: 4,
    date: '10/05/2026',
    text: 'A velocidade do Velo Charge de 140W me surpreendeu. Consigo carregar meu MacBook de 16 polegadas e o celular na velocidade máxima na mesma tomada. O adaptador quase não esquenta, o que era um problema nos meus antigos de silício.',
    productName: 'Velo Charge 140W GaN 5 Pro',
    verified: true,
    helpfulCount: 15
  },
  {
    id: 'rev-4',
    author: 'Beatriz Vasconcellos',
    avatar: 'https://picsum.photos/seed/beatriz/100/100',
    rating: 5,
    date: '02/05/2026',
    text: 'Adquiri os fones Aura Sound Max ANC para trabalhar no escritório de forma isolada. O cancelamento silencia até conversas vizinhas e ar condicionado. No modo som espacial dinâmico é como se estivesse diante de caixas estereofônicas de show! Recomendo mil vezes.',
    productName: 'Aura Sound Max ANC',
    verified: true,
    helpfulCount: 31
  }
];

export const MATCHERS_DATA: TechMatchingResult[] = [
  {
    profile: 'gamer',
    title: 'Gamer de Elite / Hardcore',
    description: 'Você precisa de máxima taxa de quadros, latência insignificante, resfriamento otimizado e fones ultra velozes.',
    recommendedProducts: ['zenith-phone-1-ultra', 'aura-audio-pro-tws', 'velo-charge-140w-gan'],
    exclusiveCode: 'GAMERBOOST15',
    exclusiveDiscount: 15
  },
  {
    profile: 'creator',
    title: 'Criador de Conteúdo / Artista',
    description: 'Câmeras de ultra resolução, fidelidade absoluta de cores na tela e áudio espacial imersivo com fones de isolamento absoluto são vitais para o seu sucesso.',
    recommendedProducts: ['zenith-phone-1-ultra', 'aura-sound-max-anc', 'magcore-3in1-foldable'],
    exclusiveCode: 'CREATORPLUS12',
    exclusiveDiscount: 12
  },
  {
    profile: 'professional',
    title: 'Alta Produtividade / Executivo',
    description: 'Bateria para dias, conectividade instantânea fluida multiponto, recarga extremamente rápida em qualquer aeroporto e segurança total de biométricos.',
    recommendedProducts: ['quantum-watch-4s', 'velo-charge-140w-gan', 'zenith-phone-1-ultra'],
    exclusiveCode: 'PROHUB10',
    exclusiveDiscount: 10
  },
  {
    profile: 'casual',
    title: 'Estilo de Vida Conectado',
    description: 'Equilíbrio ideal entre custos e benefícios. Celulares finos e fluidos para redes sociais, carregadores eficientes e relógios inteligentes focados em bem-estar e sono.',
    recommendedProducts: ['zenith-phone-1-lite', 'quantum-watch-4s', 'magcore-3in1-foldable'],
    exclusiveCode: 'VIDATECH10',
    exclusiveDiscount: 10
  }
];

export const FAQS = [
  {
    question: 'Os celulares possuem homologação da Anatel e garantia?',
    answer: 'Sim, todos os nossos smartphones possuem homologação oficial da Anatel, são comercializados lacrados na caixa com selo de garantia de 1 ano válida em toda a rede de assistência técnica autorizada nacional.'
  },
  {
    question: 'A tecnologia dos carregadores GaN é segura para aparelhos antigos?',
    answer: 'Totalmente segura. Os nossos carregadores Velo Charge GaN incorporam chips de negociação ativa inteligente de protocolo (Power Delivery / PPS). Eles leem a capacidade exata do seu telefone, fone ou laptop e entregam apenas a energia ideal que ele aceita, protegendo a vida útil da sua bateria interna.'
  },
  {
    question: 'Qual o tempo estimado de entrega e política de frete?',
    answer: 'Oferecemos Frete Grátis na modalidade padrão para todas as capitais estaduais em compras acima de R$ 350. O prazo de postagem é de até 24h úteis. O rastreamento detalhado é enviado automaticamente via E-mail e WhatsApp para você acompanhar a rota.'
  },
  {
    question: 'Posso pagar em até quantas vezes e tem desconto no Pix?',
    answer: 'Oferecemos 10% de desconto adicional para pagamentos à vista via Pix (com geração ou leitura do QR code de checkout). Também aceitamos parcelamento em até 12 vezes sem juros em todos os cartões de crédito.'
  },
  {
    question: 'Como funciona o quiz "Recomendador Inteligente"?',
    answer: 'O nosso quiz analisa três pilares fundamentais da sua rotina: uso de tela, necessidades profissionais e prioridades biotechs. Com base nos seus dados, montamos um kit perfeitamente ajustado para evitar gastos desnecessários com recursos que você não usaria e geramos um cupom de desconto exclusivo instantâneo para fechar sua nova central tecnológica.'
  }
];
