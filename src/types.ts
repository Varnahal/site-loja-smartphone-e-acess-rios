export interface ProductColor {
  name: string;
  value: string;
  class: string;
}

export interface ProductStorage {
  size: string;
  priceModifier: number;
}

export interface TechnicalSpecs {
  [key: string]: string;
}

export interface Product {
  id: string;
  name: string;
  subName: string;
  category: 'smartphones' | 'audio' | 'power' | 'wearables';
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  isNew?: boolean;
  isPopular?: boolean;
  features: string[];
  colors?: ProductColor[];
  storage?: ProductStorage[];
  specs: TechnicalSpecs;
}

export interface CartItem {
  id: string; // unique ID including color and storage selection
  product: Product;
  quantity: number;
  selectedColor: ProductColor;
  selectedStorage?: ProductStorage;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  productName: string;
  verified: boolean;
  helpfulCount: number;
}

export type TechProfile = 'gamer' | 'creator' | 'professional' | 'casual';

export interface TechMatchingResult {
  profile: TechProfile;
  title: string;
  description: string;
  recommendedProducts: string[]; // Product IDs
  exclusiveCode: string;
  exclusiveDiscount: number; // percentage
}
