import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking, DetailedResponse} from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = environment.userService + "/booking";
  private stripeUrl = environment.userService + "/checkout";

  constructor(private httpClient: HttpClient) {}


  fetchBookings(userId: any): Observable<Booking[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    return this.httpClient.get<Booking[]>(`${this.apiUrl}/${userId}`, { headers });
  }


  public fetchStripeSession(email: string, averagePrice: number, propertyId: number, customerId: number, checkIn: string, checkOut: string, successUrl: string, cancelUrl: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    const body = {
      email: email,
      totalPrice: averagePrice * 100,
      propertyId: propertyId,
      customerId: customerId,
      checkInDate: this.formatDateWithoutOffset(new Date(checkIn)),
      checkOutDate: this.formatDateWithoutOffset(new Date(checkOut)),
      successUrl: successUrl,
      cancelUrl: cancelUrl
    }

    return this.httpClient.post<any>(`${this.apiUrl}/initialise-stripe`, body, { headers });
  }


  public getBookedDates(propertyId: number): Observable<Booking[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    return this.httpClient.get<Booking[]>(`${this.apiUrl}/booked-dates/${propertyId}`, { headers });
  }


  formatDateWithoutOffset = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  canLeaveReview(propertyId: number): Observable<DetailedResponse> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    return this.httpClient.get<DetailedResponse>(`${this.apiUrl}/can-leave-review/${propertyId}`, { headers });
  }

}
