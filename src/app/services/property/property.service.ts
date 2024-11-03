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
    const checkIn = new Date(values.checkIn);
    const checkOut = new Date(values.checkOut);
    const formatDateWithoutOffset = (date: Date): string => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const checkInFormatted = formatDateWithoutOffset(checkIn);
    const checkOutFormatted = formatDateWithoutOffset(checkOut);

    const params = new HttpParams()
      .set('location', values.destination)
      .set('checkInDate', checkInFormatted)
      .set('checkOutDate', checkOutFormatted)
      .set('guests', 2)
      .set('rooms', 3);

    return this.httpClient.get<Property[]>(`${this.apiUrl}/all`, { params });
  }


  fetchProperty(propertyId: any): Observable<Property> {
    return this.httpClient.get<Property>(`${this.apiUrl}/${propertyId}`);
  }


  fetchAmenities(): Observable<string[]> {
    const url = `assets/amenities.json`;
    return this.httpClient.get<string[]>(url);
  }


  public addProperty(formData: FormData): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    return this.httpClient.post<any>(`${this.apiUrl}/add`, formData, { headers });
  }

}
