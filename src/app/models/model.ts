import {Image} from '@failed-successfully/ngx-darkbox-gallery';

export interface Permission {
  permission_id?: number;
  name: string;
  description?: string;
}

export interface Property {
  id: number;
  name: string;
  location: string;
  rating: number;
  price: number;
  images: Image[];
  freebies: string[];
  amenities: string[];
  description: string;
  highlights: string[];
  reviews: Review[];
  longitude: number;
  latitude: number;
  checkIn: string;
  checkOut: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  name: string;
}
