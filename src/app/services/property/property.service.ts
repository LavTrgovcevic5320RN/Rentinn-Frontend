import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Property} from '../../models/model';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = environment.userService + "/property";

  constructor(private httpClient: HttpClient) {}

  fetchProperties(values: any): Observable<Property[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (sessionStorage.getItem('jwt') || localStorage.getItem('jwt'))
    });

    console.log('U property-service fetch properties:', values);

    const city = values.destination.split(',')[0];
    const country = values.destination.split(',')[1];
    const formattedCheckIn = values.checkIn.toISOString().split('T')[0];
    const formattedCheckOut = values.checkIn.toISOString().split('T')[0];

    // console.log('Check in:', formattedCheckIn);
    // console.log('Check out:', formattedCheckOut);
    // console.log('City:', city);
    // console.log('Country:', country);

    const params = new HttpParams()
      .set('city', city)
      .set('country', country)
      .set('checkInDate', formattedCheckIn)
      .set('checkOutDate', formattedCheckOut)
      .set('guests', 2)
      .set('rooms', 3);

    console.log('Params:', params);

    return this.httpClient.get<Property[]>(`${this.apiUrl}/all`, { headers, params });
  }

  fetchAmenities(): Observable<string[]> {
    const url = `assets/amenities.json`;
    return this.httpClient.get<string[]>(url);
  }

  public createProperty(formData: FormData): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (sessionStorage.getItem('jwt') || localStorage.getItem('jwt'))
    });
    return this.httpClient.post<any>(`${this.apiUrl}/add`, formData, { headers });
  }

}
