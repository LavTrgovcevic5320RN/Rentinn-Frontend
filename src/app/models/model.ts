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
  totalPrice: number;
}

// export interface DailyPrice {
//   id: number;
//   date: string;
//   price: number;
//   propertyId: number;
// }

export interface DailyPrice {
  id: number;
  date: Date;
  price: number;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
}

export interface Customer {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date;
  // favoriteProperties: { [id: number]: boolean };
  favoriteProperties: number[];
  permissions: Permission[];
  properties: Property[];
}

export interface EditCustomerRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: Date;
}

export interface Booking {
  id: number;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  propertyName: string;
  propertyId: number;
  customerId: number;
  review: Review;
  // property: Property;
  // customer: Customer;
}

export interface DetailedResponse {
  status: boolean;
  message: string;
}
