import {Image} from '@failed-successfully/ngx-darkbox-gallery';

export interface Permission {
  permission_id?: number;
  name: string;
  description?: string;
}

export interface Property {
  id: number;
  title: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  imagePaths: string[];
  amenities: string[];
  freebies: string[];
  rating: number;
  averagePrice: number;
  dailyPrices: DailyPrice[];
  description: string;
  highlights: string[];
  reviews: Review[];
  checkIn: string;
  checkOut: string;
}

export interface DailyPrice {
  id: number;
  date: string;
  price: number;
  propertyId: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  name: string;
}
