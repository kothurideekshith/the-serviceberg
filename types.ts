
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: string;
  image: string;
  category: string;
  subCategory?: string;
  rating?: number;
  reviews?: string;
  time?: string;
  offer?: string;
  providerId?: string;
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  image: string;
  coverImage?: string;
  rating: number;
  reviews: string;
  services: Service[];
  location: string;
  isActive?: boolean;
  phone?: string;
  whatsapp?: string;
  paymentUrl?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  lat?: number;
  lng?: number;
}

export interface CategoryData {
  id: string;
  name: string;
  heroImage: string;
  providers: Provider[];
  subCategories: string[];
  isActive?: boolean;
}

export interface Order {
  id: string;
  serviceName: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  details: string;
}

export type DrawerState = {
  isOpen: boolean;
  service: Service | null;
};
