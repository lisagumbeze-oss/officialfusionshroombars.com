export interface Review {
  id: string;
  rating: number;
  content: string;
  name: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  regularPrice?: number | null;
  category: string;
  image: string;
  gallery?: string | null;
  isActive: boolean;
  weight?: string | null;
  effects?: string | null;
  ingredients?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
}
