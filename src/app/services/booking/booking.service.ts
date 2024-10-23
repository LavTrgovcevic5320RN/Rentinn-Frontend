import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Booking} from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private apiUrl = environment.userService + "/booking";

  constructor(private httpClient: HttpClient) {}

  fetchBookings(userId: any): Observable<Booking[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (sessionStorage.getItem('jwt') || localStorage.getItem('jwt'))
    });

    return this.httpClient.get<Booking[]>(`${this.apiUrl}/${userId}`, { headers });
  }

}
